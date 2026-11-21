# Discord Profile Editor

**Preview your Discord profile pixel-for-pixel before you change it.**

🔗 **Live:** [dc.elimssmile.dev](https://dc.elimssmile.dev)

The preview is built from Discord's own web client: its markup, its CSS (tree-shaken down to the classes the editor uses) and its colour formulas. Nothing is redrawn from screenshots, so the full profile and the popout look the way they do in the app.

> [!IMPORTANT]
> This is an **unofficial fan project, not affiliated with or endorsed by Discord Inc.** "Discord", the Discord logo, fonts, styles and artwork belong to Discord Inc. The editor is a preview tool: it never changes anything on your account.

## Features

**Profile**
- Display name, username, pronouns, bio (Discord markdown), status and custom status.
- Avatar, avatar decoration (full shop catalog or any URL), banner image or colour.
- Nitro profile theme, profile effect, display name style (all fonts and effects).
- Badges: Nitro and server boost tenure tiers, all ten account age tiers, Level 100, Orbs, HypeSquad and more. Any other badge can be added by icon URL.
- Server tag, connected accounts (27 platforms), member since dates, note.
- Board widgets (favorite game, games in rotation, want to play, games I like) with Discord's live game search, tags and comments.
- Wishlist with decorations and profile effects.

**App appearance**
- Discord's standard themes: Light, Ash, Dark and Onyx.
- All 22 Nitro colour themes and a custom gradient theme, computed with the same formulas as the Discord client.

**Editor**
- Full profile and popout views.
- English and Polish interface. Discord's own UI strings come from Discord's translations.
- Colour picker with a hex field that works the same in every browser.
- Settings are saved in your browser (`localStorage`) and can be exported to or imported from JSON.

## Log in with Discord

**Log in with Discord** uses Discord's official OAuth2 flow (implicit grant, scopes `identify connections`). It imports:

- display name and username,
- avatar, banner and accent colour,
- avatar decoration and server tag,
- public badges and display name style,
- visible connected accounts.

The access token stays in the memory of the open tab. It's used for two requests to `discord.com` and is never stored or sent anywhere else.

Discord does **not** give OAuth apps the rest of the profile: bio, pronouns, profile theme, effect, board and wishlist. You fill those in by hand.

The editor deliberately offers no "paste this script" way around that limit:
- automating a user account (self-botting) breaks [Discord's Terms of Service](https://discord.com/terms) and can get the account banned;
- pasting code into the browser console is the most common way Discord accounts get stolen.

## Run it locally

It's a static site with no build step and no backend:

```sh
git clone https://github.com/3limssmile/discord-profile-editor
cd discord-profile-editor
python -m http.server 5173
```

Then open <http://localhost:5173/editor/>.

## Deploy your own

The included workflow (`.github/workflows/pages.yml`) publishes the `editor/` folder as the site root on GitHub Pages.

1. Push the repository to GitHub.
2. In **Settings → Pages**, set **Source** to **GitHub Actions**.
3. Optional custom domain:
   1. Add a DNS record `CNAME dc → <user>.github.io`.
   2. Enter the domain under **Settings → Pages → Custom domain**.
   3. Enable **Enforce HTTPS**.
   4. Verify the domain under your account's **Settings → Pages** to protect it from takeover.
4. For login:
   1. Create an application in the [Discord Developer Portal](https://discord.com/developers/applications).
   2. Under **OAuth2 → Redirects**, add the exact site address with a trailing slash, for example `https://dc.elimssmile.dev/` and `http://localhost:5173/editor/`.
   3. Put the application ID in `OAUTH_CLIENT_ID` in `editor/js/editor.js`.

The redirect address is derived from wherever the editor is served, so nothing else needs to change.

## When Discord adds something new

| What | Source | How to update |
| --- | --- | --- |
| Board games | Discord's public game search, queried live | Nothing to do. `tools/build_games.py` refreshes the offline list. |
| Badges | icons on `cdn.discordapp.com/badge-icons/` | Right away: **Custom badge (URL)**. Permanently: add it to `BADGES` in `editor/js/editor.js`. |
| Decorations and effects | `editor/js/catalog.js`, a snapshot of the shop | Rebuild with `tools/build_catalog.py` from a new snapshot. Decorations also accept any URL. |
| Client themes | `editor/js/client-themes.js`, ported from the client | Right away: **Custom theme**. Permanently: add the preset. |

Decoration and effect names come from Discord's shop in both English and Polish, so they follow the interface language. Items added to the shop after the snapshot need a rebuild (or a custom decoration URL).

The account age badge has all ten yearly tiers (Seed to Primordial). The icons are the tier artwork from Discord's badge progress popout, on `cdn.discordapp.com/assets/content/`. Tier names come from Discord's server and stay in English in both languages.

## Project structure

```
editor/                 the site (published to GitHub Pages)
  index.html            editor panel and preview stage
  discord.css           generated: Discord's CSS trimmed to the classes in use
  editor.css            editor chrome, built on Discord's design tokens
  js/templates.js       Discord's profile markup
  js/editor.js          editor state, controls, login
  js/discord-theme.js   Discord's profile theme colour formulas
  js/client-themes.js   Nitro client themes (presets and formulas)
  js/i18n.js            English/Polish UI
  js/color-picker.js    colour picker
  js/catalog.js         shop catalog snapshot (decorations, effects)
  data/games.js         offline list of detectable games
tools/                  scripts that rebuild the generated files
LICENSE                 MIT for the project's code, with the Discord exclusions
```

`editor/discord.css` is produced by `python -I tools/build_css.py`. It trims Discord's stylesheets from `_capture/css/` down to the classes the editor uses. The `_capture/` folder holds captures from a logged-in session and is not part of the repository.

## License

The project's own code (editor logic, `editor/editor.css`, `tools/`, docs) is released under the [MIT License](LICENSE).

The MIT license does **not** cover Discord's material bundled for the preview: `editor/discord.css`, the reproduced markup, the fonts and logos in `editor/assets/`, the catalog, game and badge data, the ported theme presets, or the Discord name and logo. These belong to Discord Inc. and are used only to render an accurate preview. [LICENSE](LICENSE) lists them. [chroma.js](https://github.com/gka/chroma.js) is included under its own BSD license.

If you are a rights holder and want something removed, please open an issue.
