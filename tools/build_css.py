"""
Tree-shake Discord's real CSS down to what the editor templates use.

Inputs
  _capture/css/*.css                 Discord stylesheets downloaded from discord.com/assets
  discord-profile-yebacducha.html    original scrape (only for 3 lazy modules missing from the live build)
  editor/index.html                  editor page with the Discord DOM templates (scanned for class names / vars)

Outputs
  editor/discord.css                 optimized stylesheet
  editor/assets/*                    fonts + images referenced by the kept rules
"""
import os, re, sys, glob, json, urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CSS_DIR = os.path.join(ROOT, "_capture", "css")
EDITOR = os.path.join(ROOT, "editor")
ASSETS = os.path.join(EDITOR, "assets")

HASH_RE = re.compile(r"\.((?:[A-Za-z][\w∕-]*?))_([A-Za-z0-9_-]{6})(?![\w-])")  # ∕ = escaped "/" in text variants
# plain (non-module) classes that the editor toggles at runtime or that live on <html>
PLAIN_ALLOWED = set("""
theme-dark theme-light theme-darker theme-midnight images-dark images-light visual-refresh platform-web
density-default font-size-16 has-webkit-scrollbar full-motion enlarge-target-size
custom-theme-background custom-client-theme custom-user-profile-theme profile-theme-synced-with-user-theme
user-profile-popout user-profile-modal-v2 user-profile-sidebar emoji
""".split())
# module hashes whose *every* class may be toggled by the editor JS (not all appear in static markup)
DYNAMIC_MODULES = {"or4Hj-", "OAgVZM", "XpIUHy", "ZjcCyW", "rmCN9_", "IqWmhA", "C2XpHA"}
TAG_OK = re.compile(r"^(?::root|html|body|\*|a|strong|img|button|input|textarea|svg|h[1-6]|p|ul|ol|li|code|pre|em|small|section|main|span|div)"
                    r"(?:::?[\w-]+(?:\([^)]*\))?)*$")


# ---------------------------------------------------------------- parsing
def strip_comments(s):
    return re.sub(r"/\*.*?\*/", "", s, flags=re.S)


def parse_blocks(s):
    """Yield (prelude, body) for top-level blocks; body is None for statements like @import."""
    i, n = 0, len(s)
    while i < n:
        while i < n and s[i] in " \t\r\n;":
            i += 1
        if i >= n:
            break
        j, q = i, None
        while j < n:
            c = s[j]
            if q:
                if c == "\\":
                    j += 1
                elif c == q:
                    q = None
            elif c in "\"'":
                q = c
            elif c == "{" or c == ";":
                break
            j += 1
        prelude = s[i:j].strip()
        if j >= n:
            break
        if s[j] == ";":
            yield prelude, None
            i = j + 1
            continue
        depth, k, q = 1, j + 1, None
        while k < n and depth:
            c = s[k]
            if q:
                if c == "\\":
                    k += 1
                elif c == q:
                    q = None
            elif c in "\"'":
                q = c
            elif c == "{":
                depth += 1
            elif c == "}":
                depth -= 1
            k += 1
        yield prelude, s[j + 1:k - 1]
        i = k


def split_selectors(sel):
    out, depth, cur, q = [], 0, "", None
    for c in sel:
        if q:
            cur += c
            if c == q:
                q = None
            continue
        if c in "\"'":
            q = c
        elif c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
        elif c == "," and depth == 0:
            out.append(cur.strip()); cur = ""; continue
        cur += c
    if cur.strip():
        out.append(cur.strip())
    return out


def split_decls(body):
    out, depth, cur, q = [], 0, "", None
    for c in body:
        if q:
            cur += c
            if c == q:
                q = None
            continue
        if c in "\"'":
            q = c
        elif c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
        elif c == ";" and depth == 0:
            if cur.strip():
                out.append(cur.strip())
            cur = ""; continue
        cur += c
    if cur.strip():
        out.append(cur.strip())
    return out


# ---------------------------------------------------------------- selector filter
def remove_not(sel):
    # drop :not(...) arguments (their classes need not be present)
    out, i = "", 0
    while i < len(sel):
        if sel.startswith(":not(", i):
            depth, j = 1, i + 5
            while j < len(sel) and depth:
                depth += {"(": 1, ")": -1}.get(sel[j], 0); j += 1
            i = j; continue
        out += sel[i]; i += 1
    return out


def selector_ok(sel, used_classes, used_modules):
    s = remove_not(sel)
    hashed = HASH_RE.findall(s)
    for name, h in hashed:
        if h not in used_modules:
            return False
        if f"{name}_{h}" not in used_classes and h not in DYNAMIC_MODULES:
            return False
    s_wo = HASH_RE.sub("", s)
    plain = re.findall(r"\.([A-Za-z_][\w-]*)", s_wo)
    for p in plain:
        if p not in PLAIN_ALLOWED and p not in used_classes:
            return False
    if not hashed and not plain:
        # tag / :root / attribute-only selectors: keep only basic element rules
        parts = re.split(r"\s*[>+~]\s*|\s+", s.strip())
        return all(TAG_OK.match(p) for p in parts if p)
    # attribute selectors must reference attributes present in our markup
    for attr in re.findall(r"\[([\w-]+)", s_wo):
        if attr not in USED_ATTRS:
            return False
    return True


USED_ATTRS = set()


def filter_rules(css, used_classes, used_modules, src):
    out = []
    for prelude, body in parse_blocks(css):
        if body is None:
            continue
        if prelude.startswith("@"):
            at = prelude.split()[0].lower()
            if at in ("@media", "@supports", "@container", "@layer"):
                inner = filter_rules(body, used_classes, used_modules, src)
                if inner:
                    out.append(("at", prelude, inner))
            elif at in ("@keyframes", "@-webkit-keyframes"):
                out.append(("kf", prelude.split(None, 1)[1].strip(), body))
            elif at == "@font-face":
                out.append(("ff", prelude, body))
            elif at == "@property":
                out.append(("prop", prelude.split(None, 1)[1].strip(), body))
            continue
        sels = [s for s in split_selectors(prelude) if selector_ok(s, used_classes, used_modules)]
        if sels:
            out.append(("rule", ",".join(sels), split_decls(body)))
    return out


# ---------------------------------------------------------------- viewport media queries
# The preview pane is smaller than a desktop window, so Discord's (min|max)-(width|height) media queries would pick
# tablet/mobile values. Evaluate them for a desktop window instead: true -> unwrap the rules, false -> drop them.
VIEWPORT = {"width": 1920, "height": 1080}
MQ_FEATURE = re.compile(r"^\(\s*(min|max)-(width|height)\s*:\s*([\d.]+)px\s*\)$")


def eval_media(prelude):
    q = prelude[len("@media"):].strip()
    if "," in q:
        return None
    parts = [p.strip() for p in re.split(r"\s+and\s+", q)]
    ok = True
    for part in parts:
        m = MQ_FEATURE.match(part)
        if not m:
            return None  # other features (hover, prefers-*, screen...) stay as real media queries
        kind, dim, val = m.group(1), m.group(2), float(m.group(3))
        ok &= VIEWPORT[dim] >= val if kind == "min" else VIEWPORT[dim] <= val
    return ok


def resolve_media(items):
    out = []
    for it in items:
        if it[0] == "at" and it[1].lower().startswith("@media"):
            inner = resolve_media(it[2])
            v = eval_media(it[1])
            if v is None:
                out.append(("at", it[1], inner))
            elif v:
                out.extend(inner)
        elif it[0] == "at":
            out.append(("at", it[1], resolve_media(it[2])))
        else:
            out.append(it)
    return out


# ---------------------------------------------------------------- var / keyframe shaking
VAR_RE = re.compile(r"var\(\s*(--[\w-]+)")


def walk(items):
    for it in items:
        if it[0] == "at":
            yield from walk(it[2])
        else:
            yield it


def shake(items, seed_vars):
    rules = [it for it in walk(items) if it[0] == "rule"]
    used = set(seed_vars)
    for _, _, decls in rules:
        for d in decls:
            if not d.startswith("--"):
                used.update(VAR_RE.findall(d))
    defs = {}
    for _, _, decls in rules:
        for d in decls:
            if d.startswith("--"):
                name, _, val = d.partition(":")
                defs.setdefault(name.strip(), []).append(val)
    for it in walk(items):
        if it[0] in ("kf", "prop"):
            pass
    changed = True
    while changed:
        changed = False
        for name in list(used):
            for val in defs.get(name, []):
                for v in VAR_RE.findall(val):
                    if v not in used:
                        used.add(v); changed = True
    # keyframes referenced by animation / animation-name (incl. via variables)
    anim_text = " ".join(d for _, _, decls in rules for d in decls
                         if re.match(r"(animation|--)", d) and (d.startswith("animation") or d.split(":")[0].strip() in used))
    return used, anim_text


def prune(items, used_vars, anim_text, font_families):
    out = []
    for it in items:
        kind = it[0]
        if kind == "at":
            inner = prune(it[2], used_vars, anim_text, font_families)
            if inner:
                out.append(("at", it[1], inner))
        elif kind == "rule":
            decls = [d for d in it[2] if not d.startswith("--") or d.split(":")[0].strip() in used_vars]
            if decls:
                out.append(("rule", it[1], decls))
        elif kind == "kf":
            if re.search(r"(?<![\w-])" + re.escape(it[1]) + r"(?![\w-])", anim_text):
                out.append(it)
        elif kind == "ff":
            fam = re.search(r"font-family:\s*([^;]+)", it[2])
            if fam and fam.group(1).strip().strip("\"'") in font_families:
                out.append(it)
        elif kind == "prop":
            if it[1] in used_vars:
                out.append(it)
    return out


def emit(items):
    s = []
    for it in items:
        if it[0] == "at":
            s.append(it[1] + "{" + emit(it[2]) + "}")
        elif it[0] == "rule":
            s.append(it[1] + "{" + ";".join(it[2]) + "}")
        elif it[0] == "kf":
            s.append("@keyframes " + it[1] + "{" + it[2] + "}")
        elif it[0] == "ff":
            s.append("@font-face{" + it[2] + "}")
        elif it[0] == "prop":
            s.append("@property " + it[1] + "{" + it[2] + "}")
    return "".join(s)


# ---------------------------------------------------------------- main
def main():
    page = open(os.path.join(EDITOR, "index.html"), encoding="utf-8").read()
    js_files = [open(f, encoding="utf-8").read() for f in glob.glob(os.path.join(EDITOR, "js", "*.js"))
                if os.path.basename(f) != "catalog.js"]  # catalog is data (asset hashes), not markup
    corpus = page + "\n".join(js_files)
    editor_css = open(os.path.join(EDITOR, "editor.css"), encoding="utf-8").read()
    used_classes = set(m.group(0) for m in re.finditer(r"[A-Za-z][\w-]*?_[A-Za-z0-9_-]{6}(?![\w-])", corpus))
    used_classes |= set(re.findall(r"\b[a-z][\w-]*(?:/[\w-]+)?_RAOoio\b", corpus))  # text variants like body-sm/normal_RAOoio
    used_modules = {c.rsplit("_", 1)[1] for c in used_classes} | DYNAMIC_MODULES
    USED_ATTRS.update(set(re.findall(r"\s(data-[\w-]+|aria-[\w-]+|role|dir|style|disabled|type|href|tabindex|draggable)=", corpus)))
    seed_vars = set(re.findall(r"--[\w-]+", corpus)) | set(VAR_RE.findall(editor_css))

    # CSS escapes "/" in classes like .body-sm\/normal_RAOoio -> normalise for matching, restore on output
    files = sorted(glob.glob(os.path.join(CSS_DIR, "*.css")))
    items = []
    for f in files:
        css = strip_comments(open(f, encoding="utf-8").read())
        css = css.replace("\\/", "∕")
        items += filter_rules(css, {c.replace("/", "∕") for c in used_classes},
                              used_modules, os.path.basename(f))

    # 3 lazy modules that were not in the live build we downloaded: take them from the user's scrape
    scrape = open(os.path.join(ROOT, "discord-profile-yebacducha.html"), encoding="utf-8").read()
    style = scrape[scrape.find("<style>") + 7: scrape.find("</style>")]
    style = strip_comments(style).replace("\\/", "∕")
    lazy = {"W5z7fj", "I0Hvcn", "VlBwYX"}
    for prelude, body in parse_blocks(style):
        if body is None or prelude.startswith("@"):
            continue
        sels = [s for s in split_selectors(prelude) if any("_" + h in s for h in lazy)]
        if sels:
            items.append(("rule", ",".join(sels), split_decls(body)))

    items = resolve_media(items)
    used_vars, anim_text = shake(items, seed_vars)
    fams = set()
    for it in walk(items):
        if it[0] == "rule":
            for d in it[2]:
                if d.startswith("font-family") or (d.startswith("--font") and d.split(":")[0].strip() in used_vars):
                    for fam in d.split(":", 1)[1].split(","):
                        fams.add(fam.strip().strip("\"'"))
    items = prune(items, used_vars, anim_text, fams)
    css = emit(items).replace("∕", "\\/")

    # localise /assets/* urls
    os.makedirs(ASSETS, exist_ok=True)
    urls = sorted(set(re.findall(r"url\(\s*[\"']?(/assets/[\w.-]+)[\"']?\s*\)", css)))
    for u in urls:
        dst = os.path.join(ASSETS, os.path.basename(u))
        if not os.path.exists(dst):
            req = urllib.request.Request("https://discord.com" + u, headers={"User-Agent": "Mozilla/5.0"})
            with urllib.request.urlopen(req, timeout=30) as r, open(dst, "wb") as fh:
                fh.write(r.read())
    css = re.sub(r"url\(\s*([\"']?)/assets/", r"url(\1assets/", css)

    header = "/* Discord client CSS (discord.com/assets, build of 2026-11-19), tree-shaken for the profile editor */\n"
    open(os.path.join(EDITOR, "discord.css"), "w", encoding="utf-8").write(header + css)
    n_rules = sum(1 for it in walk(items) if it[0] == "rule")
    print(json.dumps({"rules": n_rules, "bytes": len(css), "vars": len(used_vars), "assets": len(urls),
                      "fonts": sorted(f for f in fams if f in css)}, ensure_ascii=False))


if __name__ == "__main__":
    main()
