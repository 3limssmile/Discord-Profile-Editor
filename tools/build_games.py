"""Build editor/data/games.js from Discord's public detectable-applications list.

Source: GET https://discord.com/api/v9/applications/detectable (no auth). Save it first, e.g.
  curl -s -o detectable.json https://discord.com/api/v9/applications/detectable
then: python -I tools/build_games.py detectable.json

Output rows: [id, name, cover_image_hash, icon_hash] for every app with a cover or an icon ("" when missing). The editor builds the cover URL
the way Discord's game widget falls back to it: getApplicationIconURL({id, icon: coverImageHash, size: 300, keepAspectRatio: true})
-> https://cdn.discordapp.com/app-icons/{id}/{hash}.png?size=300&keep_aspect_ratio=true
"""
import json
import pathlib
import sys

src = pathlib.Path(sys.argv[1])
# a .js file (not .json) so it also loads when index.html is opened straight from disk (file:// blocks fetch)
out = pathlib.Path(__file__).resolve().parent.parent / "editor" / "data" / "games.js"
apps = json.loads(src.read_text(encoding="utf-8"))
rows = []
for a in apps:
    if not a.get("cover_image_hash") and not a.get("icon_hash"):
        continue
    rows.append([a["id"], a["name"], a.get("cover_image_hash") or "", a.get("icon_hash") or ""])
rows.sort(key=lambda r: r[1].lower())
out.parent.mkdir(parents=True, exist_ok=True)
out.write_text("window.DISCORD_GAMES=" + json.dumps(rows, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
print(json.dumps({"apps": len(apps), "with_cover": len(rows), "bytes": out.stat().st_size}))
