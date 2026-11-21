"""
Compact Discord's collectibles catalog (GET /api/v9/collectibles-categories/v2, captured from the live client)
into editor/js/catalog.js so the page works from file:// without fetch().
"""
import os, json

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
cap = json.load(open(os.path.join(ROOT, "_capture", "capture.json"), encoding="utf-8"))
raw = next(v for k, v in cap["grab"].items() if "collectibles-categories" in k)
data = json.loads(raw)

decos, effects, plates = {}, {}, {}
cats = []
for ci, cat in enumerate(data["categories"]):
    cats.append(cat["name"])
    for prod in cat.get("products", []):
        pname = prod.get("name", "")
        bundled = {b["sku_id"]: b["name"] for b in prod.get("bundled_products", []) or []}
        for it in prod.get("items", []):
            sku = it["sku_id"]
            name = bundled.get(sku) or (pname if prod.get("type") != 1000 else it.get("title") or pname)
            t = it.get("type")
            if t == 0 and sku not in decos:
                decos[sku] = {"s": sku, "n": name, "a": it["asset"], "l": it.get("label", ""), "c": ci}
            elif t == 1 and sku not in effects:
                effects[sku] = {"s": sku, "n": it.get("title") or name, "l": it.get("accessibilityLabel", ""),
                                "t": it.get("thumbnailPreviewSrc"), "r": it.get("reducedMotionSrc"), "c": ci,
                                "e": [[e["src"], 1 if e.get("loop") else 0, e.get("duration", 0), e.get("start", 0),
                                       e.get("loopDelay", 0), e.get("zIndex", 100),
                                       [r.get("src") if isinstance(r, dict) else r for r in e.get("randomizedSources") or []]]
                                      for e in it.get("effects", [])]}
            elif t == 2 and sku not in plates:
                plates[sku] = {"s": sku, "n": name, "a": it["asset"], "p": it.get("palette"), "l": it.get("label", ""), "c": ci}

out = {"categories": cats, "decorations": list(decos.values()), "effects": list(effects.values()),
       "nameplates": list(plates.values())}

# keep the English names ("ne", captured from the same API in an English client) already in catalog.js
old_path = os.path.join(ROOT, "editor", "js", "catalog.js")
if os.path.exists(old_path):
    s = open(old_path, encoding="utf-8").read()
    old = json.loads(s[s.index("=") + 1:s.rstrip().rindex(";")])
    ne = {x["s"]: x["ne"] for k in ("decorations", "effects") for x in old.get(k, []) if x.get("ne")}
    for k in ("decorations", "effects"):
        for x in out[k]:
            if x["s"] in ne: x["ne"] = ne[x["s"]]
    if old.get("categoriesEn") and len(old["categoriesEn"]) == len(cats): out["categoriesEn"] = old["categoriesEn"]
os.makedirs(os.path.join(ROOT, "editor", "js"), exist_ok=True)
with open(os.path.join(ROOT, "editor", "js", "catalog.js"), "w", encoding="utf-8") as f:
    f.write("/* Discord collectibles catalog captured 2026-11-19 (collectibles-categories/v2) */\n")
    f.write("window.DISCORD_CATALOG=" + json.dumps(out, ensure_ascii=False, separators=(",", ":")) + ";\n")
print({k: len(v) for k, v in out.items()}, os.path.getsize(os.path.join(ROOT, "editor", "js", "catalog.js")))
