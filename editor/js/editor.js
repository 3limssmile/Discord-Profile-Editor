/* Profile editor: state, controls, preview rendering and the profile-effect player. */
(function () {
  "use strict";
  const T = window.DiscordTheme, TPL = window.DiscordTemplates, CAT = window.DISCORD_CATALOG;
  // shop names: the catalog holds Discord's Polish names (n) and English ones (ne), both from Discord's shop API
  if (I18N.lang === "en") {
    for (const d of CAT.decorations) if (d.ne) { d.n = d.ne; d.l = ""; }
    for (const e of CAT.effects) if (e.ne) { e.n = e.ne; e.l = e.ne; }
    if (CAT.categoriesEn) CAT.categories = CAT.categoriesEn;
  }
  const $ = (sel, root = document) => root.querySelector(sel);
  const esc = TPL.esc;
  const STORE_KEY = "dpe-state-v1";

  // ---------------------------------------------------------------- reference data (real Discord CDN assets)
  // Profile badges: icons are Discord's own badge-icons/{hash}.png (hashes read from live profiles / verified on the CDN).
  // Array order = the order the profile shows them (premium before account age before HypeSquad house, as on a live profile).
  // group: only one badge of a group can be on a profile (Nitro tenure tier, boost tier).
  const BI = h => `https://cdn.discordapp.com/badge-icons/${h}.png`;
  const BADGES = [
    { id: "staff", label: "Pracownik Discorda", src: BI("5e74e9b61934fc1f67c65515d1f7e60d") },
    { id: "partner", label: "Właściciel serwera partnerskiego", src: BI("3f9748e53446a137a052f3454e2de41e") },
    { id: "modalumni", label: "Absolwent programów dla moderatorów", src: BI("fee1624003e2fee35cb398e125dc479b") },
    { id: "hypesquad", label: "Wydarzenia HypeSquad", src: BI("bf01d1073931f921909045f3a39fd264") },
    // Nitro: premium (under a month) + tenure tiers premium_tenure_{1,3,6,12,24,36,60,72}_month_v2
    { id: "nitro", group: "nitro", name: "Nitro", label: "Subskrybent od", src: BI("2ba85e8026a8614b640c2837bcdfe21b") },
    { id: "nitro-1", group: "nitro", name: "Brąz (1 mies.)", label: "Subskrybent od", src: BI("4f33c4a9c64ce221936bd256c356f91f") },
    { id: "nitro-3", group: "nitro", name: "Srebro (3 mies.)", label: "Subskrybent od", src: BI("4514fab914bdbfb4ad2fa23df76121a6") },
    { id: "nitro-6", group: "nitro", name: "Złoto (6 mies.)", label: "Subskrybent od", src: BI("2895086c18d5531d499862e41d1155a6") },
    { id: "nitro-12", group: "nitro", name: "Platyna (1 rok)", label: "Subskrybent od", src: BI("0334688279c8359120922938dcb1d6f8") },
    { id: "nitro-24", group: "nitro", name: "Diament (2 lata)", label: "Subskrybent od", src: BI("0d61871f72bb9a33a7ae568c1fb4f20a") },
    { id: "nitro-36", group: "nitro", name: "Szmaragd (3 lata)", label: "Subskrybent od", src: BI("11e2d339068b55d3a506cff34d3780f3") },
    { id: "nitro-60", group: "nitro", name: "Rubin (5 lat)", label: "Subskrybent od", src: BI("cd5e2cfd9d7f27a8cdcd3e8a8d5dc9f4") },
    { id: "nitro-72", group: "nitro", name: "Opal (6 lat)", label: "Subskrybent od", src: BI("5b154df19c53dce2af92c9b61e6be5e2") },
    // server boost tiers guild_booster_lvl1..9
    { id: "boost", group: "boost", name: "1 mies.", label: "Ulepsza serwer od", src: BI("51040c70d4f20a921ad6674ff86fc95c") },
    { id: "boost-2", group: "boost", name: "2 mies.", label: "Ulepsza serwer od", src: BI("0e4080d1d333bc7ad29ef6528b6f2fb7") },
    { id: "boost-3", group: "boost", name: "3 mies.", label: "Ulepsza serwer od", src: BI("72bed924410c304dbe3d00a6e593ff59") },
    { id: "boost-6", group: "boost", name: "6 mies.", label: "Ulepsza serwer od", src: BI("df199d2050d3ed4ebf84d64ae83989f8") },
    { id: "boost-9", group: "boost", name: "9 mies.", label: "Ulepsza serwer od", src: BI("996b3e870e8a22ce519b3a50e6bdd52f") },
    { id: "boost-12", group: "boost", name: "12 mies.", label: "Ulepsza serwer od", src: BI("991c9f39ee33d7537d9f408c3e53141e") },
    { id: "boost-15", group: "boost", name: "15 mies.", label: "Ulepsza serwer od", src: BI("cb3ae83c15e970e8f3d410bc62cb8b99") },
    { id: "boost-18", group: "boost", name: "18 mies.", label: "Ulepsza serwer od", src: BI("7142225d31238f6387d9f09efaa02759") },
    { id: "boost-24", group: "boost", name: "24 mies.", label: "Ulepsza serwer od", src: BI("ec92202290b48d0879b7413d2dde3bab") },
    // account age (badge type 18), one tier per year. Tier art = the tiers' simple_icon_url from Discord's badge
    // progress popout (cdn.discordapp.com/assets/content/*.svg); tier 6 is the badge-icons PNG read from a live profile.
    // Tier names come from Discord's server (English); "account-age" stays the id of tier 6 for older saves.
    ...[["Seed", "1 rok", "465f6cc202c60d0e250f986fa035ed461e275adddbf875106089527a2c16ef2c"],
      ["Sprout", "2 lata", "2f2f1d83c3abedbbd2346212343e3f45bd215ddd3d97fdf2272f3c3b4ea52dae"],
      ["Sapling", "3 lata", "b9f15d9592f7a4fab4f7295e59bbc9cf45cc4787505eafc17e1586e499d4b64a"],
      ["Bud", "4 lata", "5a8088ae64ce072f086049e862b9c6fb94a34be8c1de85870cebd4a7db0596ff"],
      ["Blossom", "5 lat", "6b236652251f52ab8d0183934bbcd2f3246ac531cecb8d86569d24cbdc8eb1f4"],
      ["Redwood", "6 lat", null],
      ["Sequoia", "7 lat", "2a598969188c36a8292855ca82a6acd953b7adab398721a65bfd360f55eed26a"],
      ["Bristlecone", "8 lat", "5dc6789b3102d1d63b3a4e257bc0067555702116f392d54cd3f83c0c137e6e11"],
      ["Stromatolite", "9 lat", "3251cbd59d4b048fc5ea83890cfb78fe2e092865ebbf8eff61dcd861af4b5fc7"],
      ["Primordial", "10+ lat", "895ded0aa669176a4c45b41f18f992ea1a762a57d99edab380377162d54851e5"]
    ].map(([n, y, h], i) => ({ id: i === 5 ? "account-age" : `account-age-${i + 1}`, group: "age", name: `${n} (${y})`, label: "Wiek konta",
      src: h ? `https://cdn.discordapp.com/assets/content/${h}.svg` : BI("813d80b654901205a69da56b5e5ff2e4") })),
    // house labels follow the live "HypeSquad – równowaga" (descriptions come from the server, not the client)
    { id: "bravery", label: "HypeSquad – odwaga", src: BI("8a88d63823d8a71cd5e390baa45efa02") },
    { id: "brilliance", label: "HypeSquad – błyskotliwość", src: BI("011940fd013da3f7fb926e4a1cd2e618") },
    { id: "balance", label: "HypeSquad – równowaga", src: BI("3aa41de486fa12454c3761e8e223442e") },
    { id: "bughunter1", label: "Łowca błędów Discorda", src: BI("2717692c7dca7289b35297368a940dd0") },
    { id: "bughunter2", label: "Łowca błędów Discorda", src: BI("848f79194d4be5ff5f81505cbd0ce1e6") },
    { id: "activedev", label: "Aktywny deweloper", src: BI("6bdc42827a38498929a4920da12695d9") },
    { id: "earlydev", label: "Wczesny zweryfikowany twórca botów", src: BI("6df5892e0f35b051f8b61eace34f4967") },
    { id: "early", label: "Wczesny sponsor", src: BI("7060786766c9c840eb3019e725d2b358") },
    { id: "legacy", label: "Użytkownik znany wcześniej jako", src: BI("6de6d34650760ba5551a79732e98ed60") },
    { id: "quest", label: "Ukończono misję", src: BI("7d9ae358c8c5e118768335dbe68b4fb8") },
    { id: "level-100", label: "Osiągnięto poziom 100", src: BI("ca105ad9cfc8580c765101d17bbb2323") },
    { id: "orbs", label: "Zdobyto odznakę profilową „Orbs”", src: BI("83d8a1eb09a8d64e59233eec5d4d5c2d") },
    { id: "orb-patron", label: "Gifting Patron", src: BI("025035e4f4c124c44d29b369936c6843") },
    { id: "orb-streaming", label: "Streaming", src: BI("852c0e2f5d2d73e75b1eabb286417acf") },
    { id: "orb-variety", label: "Game Variety", src: BI("68af20428336f8c018bab39206644d60") },
    { id: "orb-time", label: "Game Time", src: BI("208e1bb66e311286cae364bc6f19277a") },
    { id: "orb-age", label: "Account Age", src: BI("b5716cca77a6e24b20eabe4d008479a9") },
  ];
  // connection platforms (module 573648, names as Discord shows them); icons = icon.lightPNG, which the profile uses
  const CONNECTIONS = {
    "amazon-music": "Amazon Music", battlenet: "Battle.net", bluesky: "Bluesky", bungie: "Bungie.net", crunchyroll: "Crunchyroll",
    domain: "Domain", ebay: "eBay", epicgames: "Epic Games", facebook: "Facebook", github: "GitHub", instagram: "Instagram",
    leagueoflegends: "League of Legends", letterboxd: "Letterboxd", mastodon: "Mastodon", meta_quest_or_horizon: "Meta Quest",
    paypal: "PayPal", playstation: "PlayStation Network", reddit: "Reddit", riotgames: "Riot Games", roblox: "Roblox",
    spotify: "Spotify", steam: "Steam", tiktok: "TikTok", twitch: "Twitch", twitter: "X", xbox: "Xbox", youtube: "YouTube",
  };
  // showcase games for the default profile: popular titles from Discord's public detectable-apps list (data/games.js),
  // cover/icon straight from Discord's CDN like the board widget loads them
  const BOARD_GAMES = [
    ["1402418491272986635", "Minecraft", "2975c144dc7e00ecf57018a4af98b1eb", "166fbad351ecdd02d11a3b464748f66b"],
    ["700136079562375258", "VALORANT", "9c55c3dbef3b1621d17ee32dc7765dcc", "11f81959f4fdd76ca6c39c59eac256c1"],
    ["1402418696126992445", "League of Legends", "fae8bbf6a5d14f494db342b5d53eea21", "7c99428541032ac02ec6981d88b78fb7"],
    ["1402418703554842694", "Fortnite", "c1864b38910c209afd5bf6423b672022", "c1864b38910c209afd5bf6423b672022"],
    ["356877880938070016", "Rocket League", "6d100462f957942928a22e6b2f6780f3", "a74899a5190c48a3e6ce9f8d2eaff348"],
    ["359509387670192128", "Stardew Valley", "2727f218e06d9c3c4204fed086181a53", "1e84012079d438b46bbb3c3bf2a409bb"],
    ["1402418440685486130", "Among Us", "6b05f8bebdb9740a1d56569916f8c56a", "e6cf30ebdaf6e657f636f391b29f06f8"],
    ["1402418344912752671", "Terraria", "7cfbdeb7c505f9440335efc5e5ff1517", "4c3c185abc0dfb4cb1ec5612de4d7366"],
  ].map(([id, name, cover, icon]) => ({ id, name,
    src: `https://cdn.discordapp.com/app-icons/${id}/${cover}.png?size=300&keep_aspect_ratio=true`,
    icon: `https://cdn.discordapp.com/app-icons/${id}/${icon}.png?size=256` }));
  // Discord's display-name font names (OAgVZM classes)
  const FONTS = [["default", "Domyślna"], ["cherryBomb", "Sakura"], ["chicle", "Jellybean"], ["museoModerno", "Modern"], ["neoCastel", "Medieval"],
    ["pixelify", "8Bit"], ["sinistre", "Vampyre"], ["zillaSlab", "Tempo"], ["playpenSans", "Monkey Bars"], ["orbitron", "Mainframe"],
    ["newRocker", "Headbang"], ["kalam", "Journal"], ["pricedown", "Pricedown"]];
  const NAME_EFFECTS = [["solid", "Jednolity"], ["gradient", "Gradient"], ["neon", "Neon"], ["toon", "Toon"], ["pop", "Pop"], ["gummy", "Gummy"], ["prism", "Pryzmat"]];
  const NAME_DEFAULTS = { solid: ["#ffffff"], gradient: ["#ff5ca8", "#5c7cff"], neon: ["#" + (6888941).toString(16).padStart(6, "0")],
    toon: ["#" + (0xf42098).toString(16).padStart(6, "0")], pop: ["#" + (1036166).toString(16).padStart(6, "0")],
    gummy: ["#ff6b6b", "#ffd93d", "#6bcB77", "#4d96ff"], prism: ["#ff5f6d", "#ffc371", "#47e891", "#4facfe", "#b06ab3"] };

  const DEFAULT_STATE = {
    view: "modal", clientTheme: "darker", stageBg: "app",
    // Nitro client theme: "" | preset id (DiscordClientThemes.PRESETS) | "custom"
    clientGradient: "", clientCustom: { colors: ["#5348ca", "#a308a7"], angle: 135, mix: 50, base: "darker" },
    displayName: I18N.t("Użytkownik"), username: I18N.t("uzytkownik"), pronouns: "", bio: I18N.t("Cześć! **To jest bio** z *formatowaniem* Discorda.\nhttps://discord.com"),
    status: "online", statusText: I18N.t("Edytuję profil"), statusEmoji: "✨",
    avatar: "https://cdn.discordapp.com/embed/avatars/0.png",
    decoration: "", decorationUrl: "", animate: true,
    bannerImage: "", bannerColor: "#5865f2", bannerAuto: true,
    themeOn: false, themeSync: false, themePrimary: "#5865f2", themeSecondary: "#5bffd0",
    effect: "",
    nameOn: false, nameFont: "default", nameEffect: "solid", nameColors: ["#ffffff"],
    badges: ["hypesquad", "nitro", "quest"],
    tagOn: false, tagText: "DSCD", tagBadgeId: 6, tagPrimary: "#ff1c90", tagSecondary: "#ff7fc0", tagBadgeUrl: "",
    memberSince: I18N.fmtDate(new Date(2026, 10, 19)), customBadges: [], friendsSince: "", connections: [{ platform: "github", name: I18N.t("uzytkownik") }],
    guildOn: false, guildName: I18N.t("Mój serwer"), guildIcon: "", guildJoined: I18N.fmtDate(new Date(2026, 10, 20)),
    showNote: true, showBoard: true, rightTab: "widgets", showActivityTab: true, mutualFriends: 0, mutualGuilds: 0,
    board: [
      { type: "favorite_games", games: [{ ...BOARD_GAMES[0], tags: ["casual", "love_it"], comment: I18N.t("Klasyka, do której zawsze wracam") }] },
      { type: "current_games", games: [{ ...BOARD_GAMES[1], tags: ["intermediate", "looking_for_group"] }, { ...BOARD_GAMES[4], tags: ["expert", "rage_quitting"] }, { ...BOARD_GAMES[5] }] },
      { type: "want_to_play_games", games: [{ ...BOARD_GAMES[7] }] },
      { type: "played_games", games: BOARD_GAMES.map(g => ({ ...g })) },
    ],
    wishlist: [],
  };
  let state = load();
  const boardExpanded = new Set(); // widgets toggled with "Pokaż więcej" in the preview

  function load() {
    try { const s = JSON.parse(localStorage.getItem(STORE_KEY)); if (s) return migrate({ ...DEFAULT_STATE, ...s }); } catch (e) { }
    return structuredClone(DEFAULT_STATE);
  }
  // older saves had free-text widget titles; map them onto Discord's widget types
  function migrate(s) {
    const byTitle = Object.fromEntries(Object.entries(TPL.WIDGETS).map(([k, v]) => [v.title.toLowerCase(), k]));
    const used = new Set(), types = Object.keys(TPL.WIDGETS);
    s.board = (s.board || []).map(w => {
      let type = w.type || byTitle[(w.title || "").toLowerCase()] || "played_games";
      if (used.has(type)) type = types.find(t => !used.has(t)); // Discord allows each widget type once
      if (!type) return null;
      used.add(type);
      return { type, games: w.games || [] };
    }).filter(Boolean);
    // the old default board used local snapshots (assets/snap, removed): swap it for the current showcase board
    const games = s.board.flatMap(w => w.games);
    if (games.some(g => /^assets\/snap\//.test(g.src || "") || (!g.src && !g.icon))) {
      if (games.every(g => /^assets\/snap\//.test(g.src || ""))) s.board = structuredClone(DEFAULT_STATE.board);
      else {
        // keep the user's edits: point those games at Discord's CDN cover instead (ids/hashes from data/games.js)
        const CDN_GAME = { "War Thunder": ["357607478105604096", "1af9ab8fc691d17ed5d4103fdbece879", "b23dfa191e3f3aa8142572110a99723f"],
          "Counter-Strike 2": ["1158877933042143272", "694f0b895f21566723671fa6219c1001", "558f5a26ecb3b17c3dea3d15c1df537a"],
          "Minecraft": ["1402418491272986635", "2975c144dc7e00ecf57018a4af98b1eb", "166fbad351ecdd02d11a3b464748f66b"],
          "Euro Truck Simulator 2": ["1402418075726254102", "b9b324a2872d5d7edb4a2a04d8f85278", "46bfdfc58e4eacbfde29b2461e118e78"],
          "ROBLOX": ["363445589247131668", "82f092687242e81976b955927df9cd24", "f2b60e350a2097289b3b0b877495e55f"],
          "Grand Theft Auto VI": ["1445160676522856458", "0788ab1237f5801d9f72af6d34665327", "251322eb2a778edc62ecce8d791e3701"] };
        games.forEach(g => {
          if (!/^assets\/snap\//.test(g.src || "") && (g.src || g.icon)) return;
          const c = CDN_GAME[g.name];
          g.src = c ? `https://cdn.discordapp.com/app-icons/${c[0]}/${c[1]}.png?size=300&keep_aspect_ratio=true` : "";
          if (c) { g.id = c[0]; g.icon = `https://cdn.discordapp.com/app-icons/${c[0]}/${c[2]}.png?size=256`; }
        });
      }
    }
    if (!Array.isArray(s.customBadges)) s.customBadges = [];
    if (!s.clientCustom || !Array.isArray(s.clientCustom.colors)) s.clientCustom = structuredClone(DEFAULT_STATE.clientCustom);
    if (!TPL.CLIENT_THEME[s.clientTheme]) s.clientTheme = "darker";
    // defaults saved in the other language (e.g. created while the page was Polish) follow the current language
    const DEF = ["Użytkownik", "uzytkownik", "Cześć! **To jest bio** z *formatowaniem* Discorda.\nhttps://discord.com", "Edytuję profil", "Mój serwer", "Klasyka, do której zawsze wracam"];
    for (const k of ["displayName", "username", "bio", "statusText", "guildName"]) s[k] = I18N.relocalize(s[k], DEF);
    for (const c of s.connections || []) c.name = I18N.relocalize(c.name, DEF);
    for (const w of s.board) for (const g of w.games) if (g.comment) g.comment = I18N.relocalize(g.comment, DEF);
    for (const k of ["memberSince", "guildJoined", "friendsSince"]) s[k] = I18N.relocalizeDate(s[k]);
    return s;
  }
  function save() { try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); } catch (e) { /* quota: uploaded images too big */ } }

  // ---------------------------------------------------------------- derived values
  const decoAsset = () => state.decoration && CAT.decorations.find(d => d.s === state.decoration);
  function decorationSrc(px) {
    if (state.decorationUrl) return state.decorationUrl;
    const d = decoAsset();
    return d ? `https://cdn.discordapp.com/avatar-decoration-presets/${d.a}.png?size=${px}&passthrough=${state.animate}` : "";
  }
  const effectItem = () => state.effect && CAT.effects.find(e => e.s === state.effect);
  const GTB = window.GuildTagBadges;
  const catName = i => CAT.categories[i] || "";
  // server tag badge: Discord's own badge artwork (module 803484) tinted with the chosen colours, or a custom image
  const tagBadgeSrc = () => state.tagBadgeUrl || GTB.dataUrl(state.tagBadgeId, state.tagPrimary, GTB.COLOR_COUNT[state.tagBadgeId] === 2 ? state.tagSecondary : null, 14);
  function rightTabs() {
    const t = [{ id: "widgets", label: "Tablica" }];
    if (state.showActivityTab) t.push({ id: "activity", label: "Aktywność" });
    t.push({ id: "wishlist", label: "Lista życzeń" });
    const pl = (n, one, few, many) => n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? few : many;
    if (state.mutualFriends > 0) t.push({ id: "mutual-friends", label: `${state.mutualFriends} ${pl(state.mutualFriends, "wspólny znajomy", "wspólnych znajomych", "wspólnych znajomych")}` });
    if (state.mutualGuilds > 0) t.push({ id: "mutual-guilds", label: `${state.mutualGuilds} ${pl(state.mutualGuilds, "wspólny serwer", "wspólne serwery", "wspólnych serwerów")}` });
    return t;
  }
  // wishlist entries are {k: "d"|"e", s: sku}
  function wishlistItems() {
    return state.wishlist.map(w => {
      // the wishlist card shows the shop's static asset (media/v1/collectibles-shop/{sku}/static)
      if (w.k === "d") { const d = CAT.decorations.find(x => x.s === w.s); return d && { type: "decoration", name: d.n, label: d.l || d.n, src: `https://cdn.discordapp.com/media/v1/collectibles-shop/${d.s}/static`, thumb: `https://cdn.discordapp.com/avatar-decoration-presets/${d.a}.png?size=96&passthrough=false` }; }
      const e = CAT.effects.find(x => x.s === w.s); return e && { type: "effect", name: e.n, label: e.l, src: e.t, thumb: e.t };
    }).filter(Boolean);
  }

  function props() {
    const theme = state.themeOn
      ? T.profileThemeStyle(T.toInt(state.themePrimary), T.toInt(state.themeSecondary), { synced: state.themeSync, clientTheme: effTheme() === "light" ? "light" : "dark" })
      : T.profileThemeStyle(null, null);
    const eff = effectItem();
    return {
      theme, avatar: state.avatar || "https://cdn.discordapp.com/embed/avatars/0.png", status: state.status,
      username: state.username, displayName: state.displayName || state.username, pronouns: state.pronouns, bio: state.bio,
      statusText: state.statusText, statusEmoji: state.statusEmoji,
      decoration: decorationSrc,
      bannerImage: state.bannerImage, bannerColor: state.bannerColor,
      nameStyle: state.nameOn ? { enabled: true, font: state.nameFont, effect: state.nameEffect, colors: state.nameColors } : null,
      guildTag: state.tagOn ? { text: state.tagText, badge: tagBadgeSrc() } : null,
      // custom badges (any icon URL) go after Discord's own, so badges Discord adds later can be shown too
      badges: state.badges.map(id => BADGES.find(b => b.id === id)).filter(Boolean)
        .concat((state.customBadges || []).filter(b => b.src).map((b, i) => ({ id: "custom-" + i, label: b.label || "", src: b.src }))),
      memberSince: state.memberSince, friendsSince: state.friendsSince,
      guildContext: state.guildOn ? { name: state.guildName, icon: state.guildIcon, joined: state.guildJoined } : null,
      connections: state.connections.filter(c => CONNECTIONS[c.platform]).map(c => ({ platform: CONNECTIONS[c.platform], name: c.name, icon: `assets/conn/${c.platform}.png` })),
      showNote: state.showNote,
      rightColumn: state.showBoard ? { tabs: rightTabs(), selected: state.rightTab, board: state.board, wishlist: wishlistItems(), expanded: boardExpanded, owner: state.displayName || state.username } : null,
      effect: eff ? { label: eff.l || eff.n } : null,
    };
  }

  // ---------------------------------------------------------------- render
  const preview = $("#preview"), stage = $("#stage");
  // ---------------------------------------------------------------- client theme (Discord's html classes + generated stylesheet)
  const CT = window.DiscordClientThemes;
  const gradientPreset = () => CT.PRESETS.find(p => p.id === state.clientGradient);
  // a Nitro colour theme brings its own base theme (preset.theme / custom base); otherwise the chosen standard theme
  function effTheme() {
    if (state.clientGradient === "custom") return state.clientCustom.base === "light" ? "light" : "darker";
    const p = gradientPreset();
    return p ? p.base : state.clientTheme;
  }
  function applyClientTheme() {
    const t = effTheme(), p = gradientPreset(), custom = state.clientGradient === "custom";
    const cls = [TPL.CLIENT_THEME[t], t === "light" ? "images-light" : "images-dark"];
    if (p || custom) cls.push("custom-theme-background");
    if (custom) cls.push("custom-client-theme");
    document.documentElement.className = document.documentElement.className
      .replace(/\btheme-(dark|darker|midnight|light)\b|\bimages-(dark|light)\b|\bcustom-theme-background\b|\bcustom-client-theme\b/g, "")
      .replace(/\s+/g, " ").trim() + " " + cls.join(" ");
    $("#clientThemeStyle").textContent = p ? CT.presetCSS(p) : custom ? CT.customCSS(state.clientCustom) : "";
  }
  function render() {
    TPL.setClientTheme(effTheme());
    applyClientTheme();
    stage.dataset.bg = state.stageBg;
    preview.dataset.view = state.view;
    const p = props();
    preview.innerHTML = state.view === "modal" ? TPL.modal(p) : TPL.popout(p);
    I18N.apply(preview); // translate before measuring tag widths
    preview.style.zoom = 1; TPL.layoutTags(preview); // measured unscaled, like Discord
    playEffect();
    fit();
    save();
  }
  let raf = 0;
  const scheduleRender = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(render); };

  // fit preview into the stage (Discord renders the modal at 962x800 on desktop; we scale the whole thing)
  function fit() {
    const el = preview.firstElementChild; if (!el) return;
    preview.style.zoom = 1;
    const pad = 32, w = el.offsetWidth, h = el.offsetHeight;
    const z = Math.min(1, (stage.clientWidth - pad * 2) / w, (stage.clientHeight - pad * 2) / h);
    preview.style.zoom = z > 0 ? z : 1;
    $("#zoomLabel").textContent = Math.round((z > 0 ? z : 1) * 100) + "%";
  }
  new ResizeObserver(() => fit()).observe(stage);
  addEventListener("resize", () => requestAnimationFrame(fit)); // backup: the observer can miss a step when the layout switches to one column

  // ---------------------------------------------------------------- profile effect player
  // catalog layer: [src, loop, duration, start, loopDelay, zIndex, randomizedSources]
  let timers = [];
  function playEffect() {
    timers.forEach(clearTimeout); timers = [];
    const eff = effectItem(), host = $(".inner_ZjcCyW", preview);
    if (!eff || !host) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches && eff.r) {
      host.innerHTML = `<img class="effect_ZjcCyW" alt="${esc(eff.l)}" src="${esc(eff.r)}" style="z-index: 1;">`; return;
    }
    eff.e.forEach(([src, loop, duration, start, loopDelay, z, rnd]) => {
      const show = () => {
        const pick = rnd && rnd.length ? rnd[Math.floor(Math.random() * rnd.length)] : src;
        const img = document.createElement("img");
        img.className = "effect_ZjcCyW"; img.alt = ""; img.style.zIndex = z;
        img.src = pick + (pick.includes("?") ? "&" : "?") + "_=" + Date.now(); // restart APNG from frame 0
        host.appendChild(img);
        timers.push(setTimeout(() => img.remove(), duration));
        if (loop) timers.push(setTimeout(show, duration + loopDelay));
      };
      timers.push(setTimeout(show, start));
    });
  }

  // ---------------------------------------------------------------- controls
  const form = $("#controls");
  const bind = (id, key, parse = v => v) => {
    const el = document.getElementById(id); if (!el) return;
    const isBox = el.type === "checkbox";
    if (isBox) el.checked = !!state[key]; else el.value = state[key] ?? "";
    el.addEventListener(isBox || el.tagName === "SELECT" ? "change" : "input", () => {
      state[key] = isBox ? el.checked : parse(el.value);
      onChange(key);
    });
  };
  function onChange(key) {
    if (key === "avatar" && state.bannerAuto) autoBannerColor();
    if (key === "nameEffect") { state.nameColors = NAME_DEFAULTS[state.nameEffect].slice(); buildNameColors(); }
    if (key === "bannerColor") { state.bannerAuto = false; $("#bannerAuto").checked = false; }
    if (key === "bannerAuto" && state.bannerAuto) autoBannerColor();
    syncDisabled();
    scheduleRender();
  }
  function syncDisabled() {
    form.querySelectorAll("[data-needs]").forEach(el => { el.hidden = !state[el.dataset.needs]; });
  }

  // fill selects
  $("#nameFont").innerHTML = FONTS.map(([v, n]) => `<option value="${v}">${n}</option>`).join("");
  $("#nameEffect").innerHTML = NAME_EFFECTS.map(([v, n]) => `<option value="${v}">${n}</option>`).join("");

  // client theme picker: Discord's four standard themes + Nitro colour themes (+ custom)
  function buildClientThemes() {
    const on = (std, grad) => (std ? !state.clientGradient && state.clientTheme === std : state.clientGradient === grad);
    $("#themeStd").innerHTML = CT.STANDARD.map(([id, name]) =>
      `<button type="button" role="radio" class="theme-swatch std ${TPL.CLIENT_THEME[id]}" data-std="${id}" aria-checked="${on(id)}" title="${name}" aria-label="${name}"></button>`).join("");
    $("#themeGrad").innerHTML = CT.PRESETS.map(p =>
      `<button type="button" role="radio" class="theme-swatch" data-grad="${p.id}" aria-checked="${on(null, p.id)}" title="${esc(p.name)}" aria-label="${esc(p.name)}" style="background:${CT.gradientOf(p)}"></button>`).join("")
      + `<button type="button" role="radio" class="theme-swatch custom" data-grad="custom" aria-checked="${on(null, "custom")}" title="Własny motyw" aria-label="Własny motyw" style="background:linear-gradient(${state.clientCustom.angle}deg, ${state.clientCustom.colors.length > 1 ? state.clientCustom.colors.join(", ") : state.clientCustom.colors[0] + "," + state.clientCustom.colors[0]})"><svg aria-hidden="true" width="20" height="20" viewBox="0 0 24 24"><path fill="currentColor" d="M13 6a1 1 0 1 0-2 0v5H6a1 1 0 1 0 0 2h5v5a1 1 0 1 0 2 0v-5h5a1 1 0 1 0 0-2h-5V6Z"/></svg></button>`;
    $("#themeCustom").hidden = state.clientGradient !== "custom";
    const c = state.clientCustom;
    $("#customColors").innerHTML = c.colors.map((col, i) => `<input type="color" value="${col}" data-ci="${i}" aria-label="Kolor ${i + 1}">`).join("")
      + (c.colors.length < 5 ? `<button type="button" class="btn" data-cadd>+</button>` : "")
      + (c.colors.length > 1 ? `<button type="button" class="btn" data-cdel>−</button>` : "");
    $("#customAngle").value = c.angle; $("#customAngleOut").textContent = c.angle + "°";
    $("#customMix").value = c.mix; $("#customMixOut").textContent = c.mix + "%";
    form.querySelectorAll("[name=customBase]").forEach(r => { r.checked = r.value === c.base; });
  }
  buildClientThemes();

  // language
  $("#lang").innerHTML = Object.entries(I18N.LANGS).map(([k, n]) => `<option value="${k}"${k === I18N.lang ? " selected" : ""}>${n}</option>`).join("");
  $("#lang").addEventListener("change", e => { save(); I18N.setLang(e.target.value); });
  I18N.protect(() => [state.displayName, state.username, state.pronouns, state.statusText, state.guildName, state.tagText,
    ...state.bio.split("\n"), ...state.board.flatMap(w => w.games.flatMap(g => [g.name, g.comment])),
    ...state.connections.map(c => c.name), ...(state.customBadges || []).map(b => b.label)]);
  I18N.watch();

  // custom badges: icon URL + description (for badges this editor doesn't know yet)
  function buildCustomBadges() {
    const list = state.customBadges || (state.customBadges = []);
    $("#customBadges").innerHTML = list.map((b, i) => `<div class="wish"><img src="${esc(b.src)}" alt=""><span>${esc(b.label || b.src)}</span><button type="button" class="icon-btn" data-cbdel="${i}" aria-label="Usuń">✕</button></div>`).join("");
  }
  buildCustomBadges();
  $("#cbAdd").addEventListener("click", () => {
    const src = $("#cbUrl").value.trim(); if (!/^https?:\/\/|^data:image\//.test(src)) { $("#cbUrl").focus(); return; }
    state.customBadges.push({ src, label: $("#cbLabel").value.trim() });
    $("#cbUrl").value = ""; $("#cbLabel").value = "";
    buildCustomBadges(); scheduleRender();
  });
  $("#customBadges").addEventListener("click", e => {
    const b = e.target.closest("[data-cbdel]"); if (!b) return;
    state.customBadges.splice(+b.dataset.cbdel, 1); buildCustomBadges(); scheduleRender();
  });
  $("#themeStd").addEventListener("click", e => {
    const b = e.target.closest("[data-std]"); if (!b) return;
    state.clientTheme = b.dataset.std; state.clientGradient = ""; buildClientThemes(); scheduleRender();
  });
  $("#themeGrad").addEventListener("click", e => {
    const b = e.target.closest("[data-grad]"); if (!b) return;
    state.clientGradient = state.clientGradient === b.dataset.grad && b.dataset.grad !== "custom" ? "" : b.dataset.grad; // click again = off
    buildClientThemes(); scheduleRender();
  });
  $("#themeCustom").addEventListener("input", e => {
    const c = state.clientCustom, t = e.target;
    if (t.dataset.ci != null) c.colors[+t.dataset.ci] = t.value;
    else if (t.id === "customAngle") { c.angle = +t.value; $("#customAngleOut").textContent = c.angle + "°"; }
    else if (t.id === "customMix") { c.mix = +t.value; $("#customMixOut").textContent = c.mix + "%"; }
    else if (t.name === "customBase") c.base = t.value;
    const sw = $('[data-grad="custom"]'); if (sw) sw.style.background = `linear-gradient(${c.angle}deg, ${c.colors.length > 1 ? c.colors.join(", ") : c.colors[0] + "," + c.colors[0]})`;
    scheduleRender();
  });
  $("#themeCustom").addEventListener("click", e => {
    const c = state.clientCustom;
    if (e.target.closest("[data-cadd]")) c.colors.push(c.colors[c.colors.length - 1]);
    else if (e.target.closest("[data-cdel]")) c.colors.pop();
    else return;
    buildClientThemes(); scheduleRender();
  });

  ["displayName", "username", "pronouns", "bio", "statusText", "statusEmoji", "memberSince", "friendsSince", "tagText", "decorationUrl",
    "guildName", "guildJoined", "tagBadgeUrl"].forEach(k => bind(k, k));
  ["status", "nameFont", "nameEffect", "stageBg"].forEach(k => bind(k, k));
  ["animate", "bannerAuto", "themeOn", "themeSync", "nameOn", "tagOn", "showNote", "showBoard", "guildOn", "showActivityTab"].forEach(k => bind(k, k));
  ["bannerColor", "themePrimary", "themeSecondary"].forEach(k => bind(k, k));
  ["mutualFriends", "mutualGuilds"].forEach(k => bind(k, k, v => Math.max(0, parseInt(v, 10) || 0)));

  // view switch
  form.querySelectorAll("[name=view]").forEach(r => { r.checked = r.value === state.view; r.addEventListener("change", () => { state.view = r.value; scheduleRender(); }); });

  // images: upload or URL
  function imageInput(key, { onSet } = {}) {
    const url = document.getElementById(key + "Url"), file = document.getElementById(key + "File"), clear = document.getElementById(key + "Clear");
    url.value = state[key] && !state[key].startsWith("data:") ? state[key] : "";
    url.addEventListener("change", () => { state[key] = url.value.trim(); onSet && onSet(); onChange(key); });
    file.addEventListener("change", () => {
      const f = file.files[0]; if (!f) return;
      const rd = new FileReader();
      rd.onload = () => { state[key] = rd.result; url.value = ""; onSet && onSet(); onChange(key); };
      rd.readAsDataURL(f);
    });
    clear && clear.addEventListener("click", () => { state[key] = ""; url.value = ""; onChange(key); });
  }
  imageInput("avatar");
  imageInput("bannerImage");
  imageInput("guildIcon");

  // reads a File as data: URL
  const readFile = f => new Promise((ok, err) => { const rd = new FileReader(); rd.onload = () => ok(rd.result); rd.onerror = err; rd.readAsDataURL(f); });

  // ---------------------------------------------------------------- server tag badge picker (Discord's 41 badges + 13 colour presets)
  function buildTagPicker() {
    const two = GTB.COLOR_COUNT[state.tagBadgeId] === 2;
    const order = [...GTB.DEFAULT_ORDER, ...GTB.NAMES.map((_, i) => i).filter(i => !GTB.DEFAULT_ORDER.includes(i))];
    $("#tagBadges").innerHTML = order.map(i => `<button type="button" class="tile badge-tile${i === state.tagBadgeId && !state.tagBadgeUrl ? " selected" : ""}" data-b="${i}" title="${GTB.NAMES[i]}">${GTB.svg(i, state.tagPrimary, GTB.COLOR_COUNT[i] === 2 ? state.tagSecondary : null, 24)}</button>`).join("");
    $("#tagPresets").innerHTML = GTB.PRESETS.map((p, i) => `<button type="button" class="preset${p.primary === state.tagPrimary && (!two || p.secondary === state.tagSecondary) ? " selected" : ""}" data-p="${i}" title="${p.primary} / ${p.secondary}" style="--a:${p.primary};--b:${two ? p.secondary : p.primary}"></button>`).join("");
    $("#tagPrimary").value = state.tagPrimary; $("#tagSecondary").value = state.tagSecondary;
    $("#tagSecondaryWrap").hidden = !two;
  }
  $("#tagBadges").addEventListener("click", e => { const b = e.target.closest("[data-b]"); if (!b) return; state.tagBadgeId = +b.dataset.b; state.tagBadgeUrl = ""; $("#tagBadgeUrl").value = ""; buildTagPicker(); scheduleRender(); });
  $("#tagPresets").addEventListener("click", e => { const b = e.target.closest("[data-p]"); if (!b) return; const p = GTB.PRESETS[+b.dataset.p]; state.tagPrimary = p.primary; state.tagSecondary = p.secondary; buildTagPicker(); scheduleRender(); });
  ["tagPrimary", "tagSecondary"].forEach(id => $("#" + id).addEventListener("input", e => { state[id] = e.target.value; buildTagPicker(); scheduleRender(); }));
  $("#tagBadgeUrl").addEventListener("input", () => buildTagPicker());
  $("#tagBadgeFile").addEventListener("change", async e => { const f = e.target.files[0]; if (!f) return; state.tagBadgeUrl = await readFile(f); buildTagPicker(); scheduleRender(); });
  buildTagPicker();

  // ---------------------------------------------------------------- board (Tablica) editor
  // widget types and game tags come from Discord (TPL.WIDGETS / TPL.TAG_GROUPS); each type can be added once
  function tagEditor(wi, gi, tags) {
    return `<details class="tag-edit"><summary>Tagi${tags.length ? ` (${tags.length})` : ""}</summary>${TPL.TAG_GROUPS.map(gr => `<div class="sub">${esc(gr.label)}</div><div class="tag-opts">${gr.radio ? `<label><input type="radio" name="tg${wi}_${gi}_${gr.id}" data-tag="${wi}:${gi}" data-group="${gr.id}" value=""${gr.tags.some(([id]) => tags.includes(id)) ? "" : " checked"}><span>Brak</span></label>` : ""}${gr.tags.map(([id, text]) => `<label><input type="${gr.radio ? "radio" : "checkbox"}"${gr.radio ? ` name="tg${wi}_${gi}_${gr.id}"` : ""} data-tag="${wi}:${gi}" data-group="${gr.id}" value="${id}"${tags.includes(id) ? " checked" : ""}><span>${esc(text)}</span></label>`).join("")}</div>`).join("")}</details>`;
  }
  function buildBoard() {
    const used = new Set(state.board.map(w => w.type));
    $("#boardEditor").innerHTML = state.board.map((w, wi) => {
      const spec = TPL.WIDGETS[w.type], card = spec.layout !== "grid", full = w.games.length >= spec.max;
      return `<div class="widget-edit" data-w="${wi}">
      <div class="row"><select data-wtype="${wi}">${Object.entries(TPL.WIDGETS).map(([k, v]) => `<option value="${k}"${k === w.type ? " selected" : used.has(k) ? " disabled" : ""}>${esc(v.title)} (maks. ${v.max})</option>`).join("")}</select><button type="button" class="icon-btn" data-delw="${wi}" aria-label="Usuń widżet">✕</button></div>
      <div class="games">${w.games.map((g, gi) => `<div class="game-edit"><div class="game"><img src="${esc(g.src || g.icon || "")}" alt=""><input data-w="${wi}" data-g="${gi}" data-f="name" value="${esc(g.name)}" placeholder="Nazwa gry"><input data-w="${wi}" data-g="${gi}" data-f="src" value="${(g.src || "").startsWith("data:") ? "" : esc(g.src || "")}" placeholder="URL okładki"><label class="icon-btn file-mini" title="Prześlij okładkę">⤒<input type="file" accept="image/*" data-w="${wi}" data-g="${gi}" data-f="file"></label><button type="button" class="icon-btn" data-delg="${wi}:${gi}" aria-label="Usuń grę">✕</button></div>${card ? `<input class="game-comment" data-w="${wi}" data-g="${gi}" data-f="comment" maxlength="200" value="${esc(g.comment || "")}" placeholder="Komentarz (opcjonalnie)">${tagEditor(wi, gi, g.tags || [])}` : ""}</div>`).join("")}</div>
      ${full ? `<div class="sub">Limit gier w tym widżecie: ${spec.max}.</div>` : `<input type="search" class="game-search" data-gsearch="${wi}" placeholder="Szukaj" aria-label="Przeglądaj gry">
      <div class="game-results" data-gres="${wi}"></div>
      <button type="button" class="btn" data-addg="${wi}">Dodaj własną grę</button>`}
    </div>`;
    }).join("");
    $("#addWidget").disabled = used.size >= Object.keys(TPL.WIDGETS).length;
  }

  // ---- game search: a port of Discord's own game autocomplete (modules 929396 / 243264 / 518805 hook J)
  //   GET /api/v9/games/autocomplete?q=&filter_group= (public, CORS reflects any origin), 10 results per query.
  //   Query = C7(input); first query fires at once, later ones after min(200, max(0, 500 - msSinceLast)) ms;
  //   previous results stay on screen until the new ones arrive; results cached per "filterGroup:query" for 1h.
  const GAME_FILTER_GROUP = "default";
  const EXCLUDED_GAMES = new Set(["484425151631589378","1124351896166076496","1124351975702679583","1124353289857810612","1124353460880556183","1124353599590379552","1124354036020297778","1124354174310699169","1124354219374297238","1124354724301393940","1124355292591829002","1124355334593593364","1124355447323906128","1124355979383943238","1124356108509786252","1124356199043846164","1124357045823488140","1124357133526384761","1124357256008450188","1124357277042888804","1124357563014725652","1124357621219086427","1124357688621551638","1124358061314818138","1124358311232426086","1124358369315139704","1124358585397293186","1124358634739093554","1124358645010935888","1124358853446873148","1124359047932555324","1124359276488573050","1124359293873963008","1124359312932884551","1124359434689335407","1124359758556708915","1124360177634791564","1124360363962552450","1124360393519804557","1124360545580093551","1124360662131425361","1124360678858309652","1129504691517136927","1129504937424986152","1129505486010589265","1130001171172561006","1131042996108927056","1132690430694264872","1138683327470108773","1185733153193725952","1201723489271431208","1202901407431266324","1216022702519746742","1222062501890625598","1251038428578189345","1262015762298830888","1264748775877120030","1294962893057429605","1297635514555306004","1328800843922804786","1340125468736618546","1345440503465906216","1366277825207861270","1370943538572824626","1373812493151113266","1381135699486445642","1384291534962430072","1428188279433597048","1429242833394729142","1441988763529117706","1445221962757701702","1445976787174686730","1447467809293733930","1447664345839571158","1455772568979116103","1458671686131122269","1459562537145077832"]); // module 926675 Z
  const C7 = e => { if (e == null) return null; const t = e.trim().toLowerCase().replaceAll("_", " ").slice(0, 100); return t.length > 0 ? t : null; };
  // suppress a fetch when a prefix of >= 7 chars already returned nothing (module 929396 bC)
  const bC = (e, get) => { for (let n = e.length - 1; n >= 1; n--) { const r = get(e.slice(0, n)); if (r != null) return r.length > 0 ? false : n >= 7; } return false; };
  const acCache = new Map(), acFetching = new Set(), HOUR = 36e5;
  const acKey = q => `${GAME_FILTER_GROUP}:${q}`;
  const acPeek = q => { const c = acCache.get(acKey(q)); if (!c) return undefined; if (Date.now() - c.at > HOUR) { acCache.delete(acKey(q)); return undefined; } return c.results; };
  async function acLoad(q) {
    const k = acKey(q);
    if (acPeek(q) !== undefined || acFetching.has(k)) return;
    if (bC(q, acPeek)) { acCache.set(k, { at: Date.now(), results: [] }); return; }
    acFetching.add(k);
    try {
      const r = await fetch(`https://discord.com/api/v9/games/autocomplete?q=${encodeURIComponent(q)}&filter_group=${GAME_FILTER_GROUP}`, { credentials: "omit" });
      if (!r.ok) return;
      const body = await r.json();
      acCache.set(k, { at: Date.now(), results: (body ?? []).map(e => ({ id: String(e.id), name: e.name, icon: e.icon, platformAvailability: e.platform_availability })) });
    } catch (e) { /* offline: keep previous results */ } finally { acFetching.delete(k); }
  }
  // covers: Discord's board shows getGame(id).getCoverURL(300) (needs login) and falls back to
  // getApplicationIconURL({id, icon: coverImageHash, size: 300, keepAspectRatio: true}); coverImageHash comes from the
  // public detectable list (data/games.js). Games without one fall back to their icon (module 744700: hash -> app-icons, url -> as is).
  const appAsset = (id, hash) => `https://cdn.discordapp.com/app-icons/${id}/${hash}.png?size=300&keep_aspect_ratio=true`;
  const iconUrl = (id, icon) => !icon || !icon.value ? "" : icon.type === "hash" ? `https://cdn.discordapp.com/app-icons/${id}/${icon.value}.png?size=64` : icon.type === "url" ? icon.value : "";
  // module 282435 sx: the games Discord's picker lists before you type (most popular first)
  const POPULAR_GAMES = ["363445589247131668","700136079562375258","1402418696126992445","1402418491272986635","1158877933042143272","1402418703554842694","1402418714716143646","356875221078245376","356875988589740042","356877880938070016","1402418487745581248","1402418717781921935","542075586886107149","762434991303950386","1402418436809953330","356876590342340608","1260340082150346932","1253061774555611238","1167674267748540516","359509007423242240","1257819671114289184","1402418103702524046","357607478105604096","1137125502985961543","1402418594532298837","356875762940379136","1121201675240210523","1205090671527071784","357607133254254632","1402418075726254102","363409643973771264","359509387670192128","1402418239342120960","742897755160313986","1215361187684946010","1247227126416146462","1402418440685486130","1402418344912752671","1402418571715543120","1256912167685587034","1402418078813523999","356954277803065354","1402418648332898466","356879032584896512","506950362461110273","1113966530531704943","356944273133928458","363447565905166336","363413743335374859","356942674672091136","426526722322726912","1402418586244612216","905961880789590076","356888453796986880","398632010442211348","1402418082366095493","1124351715618074634","356888577310851072","787443973538971748","1197827812623650866","1124349969906815007","356875890958925834","356889262362329098","425778010222886912","428055627030331402","1224418065295478955","1263691812338536570","372438022647578634","1129504162200166401","1238113262969557002","443159611479031808","615752773690064908","1182713227491147776","358421669603311616","1174041358995042375","385538724592746496","1124358970618953818","428054228511227914","1402417933225033759","1234262945350025246","363430548028522496","359509332490059776","358420454764969994","1124353632758939688","363413834301571072","1162076274622222346","359509759642042378","477152881196269569","449806905901056012","1402418087793528862","940810636273795162","359510095811444736","1245451463736692857","356887282982191114","1124351876033425529","363411421553360896","1162151882039504916","1067554911358832721","1140238527980916757","359801269008859136","1272842103910699040","1276737795012165766"];
  let CATALOG = null, catalogLoading = null; // id -> {name, cover, icon}
  function loadCatalog() {
    if (CATALOG) return Promise.resolve(CATALOG);
    return catalogLoading || (catalogLoading = new Promise(ok => {
      const sc = document.createElement("script");
      sc.src = "data/games.js";
      sc.onload = () => { CATALOG = new Map((window.DISCORD_GAMES || []).map(g => [g[0], { name: g[1], cover: g[2], icon: g[3] }])); ok(CATALOG); };
      sc.onerror = () => { catalogLoading = null; ok(new Map()); };
      document.head.appendChild(sc);
    }));
  }
  const coverFor = (cat, id) => { const c = cat.get(id); return c && c.cover ? appAsset(id, c.cover) : ""; };
  const iconFor = (cat, id, icon) => { const c = cat.get(id); return icon && icon.value ? iconUrl(id, icon) : c && c.icon ? iconUrl(id, { type: "hash", value: c.icon }) : ""; };
  const searchState = {}; // per widget: {applied, lastAt, timer, shown}
  function searchGames(input) {
    const wi = input.dataset.gsearch, st = searchState[wi] || (searchState[wi] = { applied: null, lastAt: 0, timer: 0, shown: null });
    const q = C7(input.value);
    clearTimeout(st.timer);
    const apply = () => { st.lastAt = Date.now(); st.applied = q; showGames(input); };
    if (q == null || st.applied == null) apply();
    else st.timer = setTimeout(apply, Math.min(200, Math.max(0, 500 - (Date.now() - st.lastAt))));
  }
  // picker rows: game icon + name (Discord's GameIcon withBackground + body-md/medium); games already on the widget are disabled
  function gameRow(wi, cat, id, name, icon, added) {
    const ic = icon ? iconUrl(id, icon) : (cat.get(id) && cat.get(id).icon ? iconUrl(id, { type: "hash", value: cat.get(id).icon }) : "");
    return `<button type="button" class="game-row" data-gadd="${wi}" data-id="${id}" data-src="${esc(coverFor(cat, id))}" data-icon="${esc(iconFor(cat, id, icon).replace("size=64", "size=256"))}" data-name="${esc(name)}"${added ? " disabled" : ""}>${ic ? `<img loading="lazy" src="${esc(ic)}" alt="">` : `<span class="game-noart" aria-hidden="true">?</span>`}<span class="game-name">${esc(name)}</span></button>`;
  }
  async function showGames(input) {
    const wi = input.dataset.gsearch, st = searchState[wi], box = $(`[data-gres="${wi}"]`, boardEl), q = st.applied;
    const added = new Set(state.board[wi].games.map(g => g.id).filter(Boolean));
    if (q == null) { // empty query: Discord lists its popular games
      if (document.activeElement !== input) { box.innerHTML = ""; return; }
      const cat = await loadCatalog();
      if (st.applied != null) return;
      box.innerHTML = POPULAR_GAMES.filter(id => cat.has(id)).map(id => gameRow(wi, cat, id, cat.get(id).name, null, added.has(id))).join("");
      return;
    }
    if (acPeek(q) === undefined) {
      if (!st.shown) box.innerHTML = `<div class="sub">Szukam…</div>`;
      await acLoad(q);
      if (st.applied !== q) return;
    }
    const results = acPeek(q);
    if (results === undefined) { if (!st.shown) box.innerHTML = `<div class="sub">Nie udało się połączyć z Discordem.</div>`; return; }
    st.shown = { query: q, results };
    const cat = await loadCatalog();
    if (st.applied !== q) return;
    const list = results.filter(g => !EXCLUDED_GAMES.has(g.id)); // module 929396 qS
    box.innerHTML = list.length ? list.map(g => gameRow(wi, cat, g.id, g.name, g.icon, added.has(g.id))).join("") : `<div class="sub">Brak wyników.</div>`;
  }
  const boardEl = $("#boardEditor");
  boardEl.addEventListener("focusin", e => { if (e.target.dataset.gsearch != null) searchGames(e.target); });
  boardEl.addEventListener("focusout", e => {
    const t = e.target; if (t.dataset.gsearch == null) return;
    const box = $(`[data-gres="${t.dataset.gsearch}"]`, boardEl);
    if (!box.contains(e.relatedTarget)) { box.innerHTML = ""; delete searchState[t.dataset.gsearch]; }
  });
  boardEl.addEventListener("mousedown", e => { if (e.target.closest(".game-results")) e.preventDefault(); }); // keep focus in the field
  boardEl.addEventListener("input", e => {
    if (e.target.dataset.gsearch != null) { searchGames(e.target); return; }
    const t = e.target, w = +t.dataset.w; if (isNaN(w) || t.type === "file" || t.dataset.tag) return;
    if (t.dataset.g != null) state.board[w].games[+t.dataset.g][t.dataset.f] = t.value; else state.board[w][t.dataset.f] = t.value;
    if (t.dataset.f === "src") t.closest(".game").querySelector("img").src = t.value;
    scheduleRender();
  });
  boardEl.addEventListener("change", async e => {
    const t = e.target;
    if (t.dataset.wtype != null) {
      const w = state.board[+t.dataset.wtype]; w.type = t.value; w.games = w.games.slice(0, TPL.WIDGETS[w.type].max);
      boardExpanded.clear(); buildBoard(); scheduleRender(); return;
    }
    if (t.dataset.tag) { // radio groups replace their tag, checkboxes toggle (module 126601 pK / LQ)
      const [wi, gi] = t.dataset.tag.split(":").map(Number), g = state.board[wi].games[gi];
      const group = TPL.TAG_GROUPS.find(x => x.id === t.dataset.group), ids = group.tags.map(x => x[0]);
      let tags = (g.tags || []).slice();
      if (group.radio) { tags = tags.filter(x => !ids.includes(x)); if (t.value) tags.push(t.value); }
      else tags = t.checked ? [...tags.filter(x => x !== t.value), t.value] : tags.filter(x => x !== t.value);
      g.tags = tags;
      const sum = t.closest("details").querySelector("summary"); sum.textContent = tags.length ? `Tagi (${tags.length})` : "Tagi";
      scheduleRender(); return;
    }
    const w = +t.dataset.w;
    if (t.type === "file" && t.files[0]) { state.board[w].games[+t.dataset.g].src = await readFile(t.files[0]); buildBoard(); scheduleRender(); }
  });
  boardEl.addEventListener("click", e => {
    const t = e.target.closest("button"); if (!t) return;
    if (t.dataset.gadd != null) {
      const wi = +t.dataset.gadd, q = $(`[data-gsearch="${wi}"]`, boardEl).value;
      if (state.board[wi].games.length >= TPL.WIDGETS[state.board[wi].type].max) return;
      state.board[wi].games.push({ name: t.dataset.name, src: t.dataset.src, icon: t.dataset.icon || "", id: t.dataset.id });
      buildBoard(); scheduleRender();
      delete searchState[wi]; // Discord closes the picker after a selection
      return;
    }
    if (t.dataset.delw != null) state.board.splice(+t.dataset.delw, 1);
    else if (t.dataset.delg) { const [w, g] = t.dataset.delg.split(":").map(Number); state.board[w].games.splice(g, 1); }
    else if (t.dataset.addg != null) state.board[+t.dataset.addg].games.push({ name: "Nowa gra", src: "" });
    else return;
    boardExpanded.clear();
    buildBoard(); scheduleRender();
  });
  $("#addWidget").addEventListener("click", () => {
    const free = Object.keys(TPL.WIDGETS).find(k => !state.board.some(w => w.type === k)); if (!free) return;
    state.board.push({ type: free, games: [] }); buildBoard(); scheduleRender();
  });
  buildBoard();

  // ---------------------------------------------------------------- wishlist editor
  function buildWishlist() {
    const items = wishlistItems();
    $("#wishlistItems").innerHTML = items.length ? items.map((it, i) => `<div class="wish"><img src="${esc(it.thumb)}" alt=""><span>${esc(it.name)}</span><button type="button" class="icon-btn" data-up="${i}" aria-label="W górę"${i ? "" : " disabled"}>↑</button><button type="button" class="icon-btn" data-del="${i}" aria-label="Usuń">✕</button></div>`).join("") : `<div class="sub">Pusta lista (Discord pokaże stan pusty).</div>`;
  }
  $("#wishlistItems").addEventListener("click", e => {
    const b = e.target.closest("button"); if (!b) return;
    if (b.dataset.del != null) state.wishlist.splice(+b.dataset.del, 1);
    if (b.dataset.up != null) { const i = +b.dataset.up; [state.wishlist[i - 1], state.wishlist[i]] = [state.wishlist[i], state.wishlist[i - 1]]; }
    buildWishlist(); scheduleRender();
  });
  function wishPicker() {
    const kind = $("#wishKind").value, q = $("#wishSearch").value.trim().toLowerCase();
    const src = kind === "d" ? CAT.decorations : CAT.effects;
    const list = src.filter(it => !q || (it.n + " " + catName(it.c)).toLowerCase().includes(q));
    $("#wishGrid").innerHTML = list.map(it => `<button type="button" class="tile${state.wishlist.some(w => w.k === kind && w.s === it.s) ? " selected" : ""}" data-s="${it.s}" title="${esc(it.n)}"><img loading="lazy" src="${esc(kind === "d" ? `https://cdn.discordapp.com/avatar-decoration-presets/${it.a}.png?size=96&passthrough=false` : it.t)}" alt="${esc(it.n)}"></button>`).join("");
  }
  $("#wishKind").addEventListener("change", wishPicker);
  $("#wishSearch").addEventListener("input", wishPicker);
  $("#wishGrid").addEventListener("click", e => {
    const t = e.target.closest(".tile"); if (!t) return;
    const kind = $("#wishKind").value, i = state.wishlist.findIndex(w => w.k === kind && w.s === t.dataset.s);
    if (i >= 0) state.wishlist.splice(i, 1); else state.wishlist.push({ k: kind, s: t.dataset.s });
    wishPicker(); buildWishlist(); state.rightTab = "wishlist"; scheduleRender();
  });
  buildWishlist();
  wishPicker();
  if (state.tagBadgeUrl.startsWith("data:")) $("#tagBadgeUrl").value = "";

  // tabs in the preview are clickable (Tablica / Lista życzeń)
  preview.addEventListener("click", e => {
    const ex = e.target.closest("[data-expand]");
    if (ex) { const i = +ex.dataset.expand; boardExpanded.has(i) ? boardExpanded.delete(i) : boardExpanded.add(i); scheduleRender(); return; }
    const tt = e.target.closest("[data-tags-toggle]");
    if (tt) { TPL.toggleTags(tt.dataset.tagsToggle); scheduleRender(); return; }
    const tab = e.target.closest("[data-tab]"); if (!tab) return;
    state.rightTab = tab.dataset.tab; scheduleRender();
  });
  $("#defaultAvatars").innerHTML = [0, 1, 2, 3, 4, 5].map(i => `<button type="button" class="swatch avatar" data-i="${i}" title="Domyślny awatar ${i}"><img src="https://cdn.discordapp.com/embed/avatars/${i}.png" alt=""></button>`).join("");
  $("#defaultAvatars").addEventListener("click", e => {
    const b = e.target.closest("[data-i]"); if (!b) return;
    state.avatar = `https://cdn.discordapp.com/embed/avatars/${b.dataset.i}.png`; $("#avatarUrl").value = state.avatar; onChange("avatar");
  });

  // banner colour = dominant avatar colour when the user has no banner (Discord does the same for default banners)
  function autoBannerColor() {
    const img = new Image(); img.crossOrigin = "anonymous";
    img.onload = () => {
      try {
        const c = document.createElement("canvas"), n = 32; c.width = c.height = n;
        const ctx = c.getContext("2d"); ctx.drawImage(img, 0, 0, n, n);
        const d = ctx.getImageData(0, 0, n, n).data, buckets = new Map();
        for (let i = 0; i < d.length; i += 4) {
          if (d[i + 3] < 128) continue;
          const k = (d[i] >> 4) << 8 | (d[i + 1] >> 4) << 4 | d[i + 2] >> 4;
          const b = buckets.get(k) || [0, 0, 0, 0]; b[0] += d[i]; b[1] += d[i + 1]; b[2] += d[i + 2]; b[3]++; buckets.set(k, b);
        }
        const best = [...buckets.values()].sort((a, b) => b[3] - a[3])[0];
        if (!best) return;
        state.bannerColor = chroma(best[0] / best[3], best[1] / best[3], best[2] / best[3]).hex();
        $("#bannerColor").value = state.bannerColor; scheduleRender();
      } catch (e) { /* tainted canvas (no CORS) - keep manual colour */ }
    };
    img.src = state.avatar;
  }

  // name colours
  function buildNameColors() {
    const n = T.COLOR_COUNT[state.nameEffect] || 1;
    while (state.nameColors.length < n) state.nameColors.push(NAME_DEFAULTS[state.nameEffect][state.nameColors.length] || "#ffffff");
    state.nameColors.length = n;
    $("#nameColors").innerHTML = state.nameColors.map((c, i) => `<input type="color" value="${c}" data-i="${i}" aria-label="Kolor ${i + 1}">`).join("");
  }
  $("#nameColors").addEventListener("input", e => { const i = +e.target.dataset.i; state.nameColors[i] = e.target.value; scheduleRender(); });
  buildNameColors();

  // badges
  // tiered badges (Nitro tenure, boost) are a radio group: a profile shows one tier; the rest are toggles
  const GROUP_LABEL = { nitro: "Nitro (staż)", boost: "Boost serwera (staż)", age: "Wiek konta" };
  function buildBadges() {
    const chip = b => `<label class="chip" title="${esc(b.name ? `${GROUP_LABEL[b.group]}: ${b.name}` : b.label)}"><input type="${b.group ? "radio" : "checkbox"}"${b.group ? ` name="badge-${b.group}"` : ""} value="${b.id}"${state.badges.includes(b.id) ? " checked" : ""}><img src="${esc(b.src)}" alt="${esc(b.name || b.label)}"></label>`;
    const groups = Object.keys(GROUP_LABEL).map(g => `<div class="sub">${GROUP_LABEL[g]}</div><div class="chips">${chip({ id: "", group: g, name: "brak", label: "brak", src: "" }).replace(/<img[^>]*>/, '<span class="chip-none">brak</span>')}${BADGES.filter(b => b.group === g).map(chip).join("")}</div>`).join("");
    $("#badges").innerHTML = `<div class="sub">Odznaki</div><div class="chips">${BADGES.filter(b => !b.group).map(chip).join("")}</div>${groups}`;
    $("#badges").querySelectorAll('input[value=""]').forEach(i => { i.checked = !BADGES.some(b => b.group === i.name.slice(6) && state.badges.includes(b.id)); });
  }
  buildBadges();
  $("#badges").addEventListener("change", () => {
    const on = new Set([...$("#badges").querySelectorAll("input:checked")].map(i => i.value).filter(Boolean));
    state.badges = BADGES.filter(b => on.has(b.id)).map(b => b.id); // Discord's order, not click order
    scheduleRender();
  });

  // connections
  function buildConnections() {
    $("#connections").innerHTML = state.connections.map((c, i) => `<div class="row conn"><select data-i="${i}" data-f="platform">${Object.entries(CONNECTIONS).map(([k, n]) => `<option value="${k}"${k === c.platform ? " selected" : ""}>${n}</option>`).join("")}</select><input data-i="${i}" data-f="name" value="${esc(c.name)}" placeholder="nazwa konta"><button type="button" class="icon-btn" data-del="${i}" aria-label="Usuń">✕</button></div>`).join("");
  }
  $("#connections").addEventListener("input", e => { const t = e.target; if (t.dataset.f) { state.connections[+t.dataset.i][t.dataset.f] = t.value; scheduleRender(); } });
  $("#connections").addEventListener("click", e => { const d = e.target.closest("[data-del]"); if (d) { state.connections.splice(+d.dataset.del, 1); buildConnections(); scheduleRender(); } });
  $("#addConnection").addEventListener("click", () => { state.connections.push({ platform: "steam", name: "" }); buildConnections(); scheduleRender(); });
  buildConnections();

  // ---------------------------------------------------------------- catalog pickers (decorations, effects)
  function picker({ grid, search, items, current, thumb, onPick, noneLabel }) {
    const draw = () => {
      const q = search.value.trim().toLowerCase();
      const list = items.filter(it => !q || (it.n + " " + catName(it.c)).toLowerCase().includes(q));
      grid.innerHTML = `<button type="button" class="tile none${!current() ? " selected" : ""}" data-s="">${noneLabel}</button>`
        + list.map(it => `<button type="button" class="tile${current() === it.s ? " selected" : ""}" data-s="${it.s}" title="${esc(it.n)} · ${esc(catName(it.c))}"><img loading="lazy" src="${esc(thumb(it))}" alt="${esc(it.n)}"></button>`).join("");
    };
    search.addEventListener("input", draw);
    grid.addEventListener("click", e => { const t = e.target.closest(".tile"); if (!t) return; onPick(t.dataset.s); draw(); });
    draw();
    return draw;
  }
  const drawDecos = picker({
    grid: $("#decoGrid"), search: $("#decoSearch"), items: CAT.decorations, current: () => state.decoration, noneLabel: "Brak",
    thumb: d => `https://cdn.discordapp.com/avatar-decoration-presets/${d.a}.png?size=96&passthrough=false`,
    onPick: s => { state.decoration = s; state.decorationUrl = ""; $("#decorationUrl").value = ""; scheduleRender(); },
  });
  picker({
    grid: $("#effectGrid"), search: $("#effectSearch"), items: CAT.effects, current: () => state.effect, noneLabel: "Brak",
    thumb: e => e.t, onPick: s => { state.effect = s; scheduleRender(); },
  });
  $("#replayEffect").addEventListener("click", () => { const h = $(".inner_ZjcCyW", preview); if (h) h.innerHTML = ""; playEffect(); });

  // ---------------------------------------------------------------- import / export / reset
  $("#exportBtn").addEventListener("click", () => {
    const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = "discord-profile.json"; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  });
  $("#importFile").addEventListener("change", e => {
    const f = e.target.files[0]; if (!f) return;
    f.text().then(t => {
      const data = JSON.parse(t);
      if (!data || typeof data !== "object" || Array.isArray(data) || !("displayName" in data || "username" in data)) throw new Error("not a profile export");
      state = { ...DEFAULT_STATE, ...data }; save(); location.reload();
    }).catch(err => { e.target.value = ""; alert(I18N.t("Nieprawidłowy plik: " + err.message)); });
  });
  $("#resetBtn").addEventListener("click", () => { if (confirm(I18N.t("Przywrócić ustawienia domyślne?"))) { localStorage.removeItem(STORE_KEY); location.reload(); } });

  // ---------------------------------------------------------------- "Zaloguj przez Discord" (OAuth2 implicit grant, no backend)
  // Scopes identify + connections give: names, avatar, banner/accent, avatar decoration, server tag, public badges, Nitro,
  // display name style, connections. Bio, pronouns, theme, effect, widgets and wishlist are not exposed to OAuth apps.
  // The token is only kept in memory for the two requests below and is never stored.
  const OAUTH_CLIENT_ID = "1573407593387262132";
  // must match a redirect registered in the Developer Portal (OAuth2 → Redirects), e.g. https://dc.elimssmile.dev/
  // and http://localhost:5173/editor/ — derived from wherever the editor is served
  const OAUTH_REDIRECT = location.origin + location.pathname.replace(/[^/]*$/, "");
  const OAUTH_SCOPES = "identify connections";
  const CDN = "https://cdn.discordapp.com";
  // user.public_flags bit -> badge, in the order Discord's profile shows them; premium_type > 0 -> Nitro
  const FLAG_BADGES = [[0, "staff"], [1, "partner"], [18, "modalumni"], [2, "hypesquad"], [6, "bravery"], [7, "brilliance"], [8, "balance"],
    [3, "bughunter1"], [14, "bughunter2"], [22, "activedev"], [17, "earlydev"], [9, "early"]];
  // display_name_styles enums (discord_protos users: font W, effect Y); GLOW has no picker entry here -> gradient
  const DNS_FONT = { 11: "default", 3: "cherryBomb", 4: "chicle", 6: "museoModerno", 7: "neoCastel", 8: "pixelify", 10: "sinistre", 12: "zillaSlab", 13: "playpenSans", 14: "orbitron", 15: "newRocker", 16: "kalam" };
  const DNS_EFFECT = { 1: "solid", 2: "gradient", 3: "neon", 4: "toon", 5: "pop", 6: "gradient", 7: "prism", 8: "gummy" };
  const hex = n => "#" + ((n >>> 0) & 0xffffff).toString(16).padStart(6, "0");
  const snowflakeDate = id => new Date(Number((BigInt(id) >> 22n) + 1420070400000n));
  const plDate = I18N.fmtDate;
  const TODO = [["basic", "O mnie, zaimki i status"], ["badges", "Odznaki (staż Nitro, boost, inne)"], ["theme", "Motyw profilu"], ["effect", "Efekt profilu"], ["board", "Tablica"], ["wishlist", "Lista życzeń"]];

  $("#loginBtn").addEventListener("click", () => {
    if (location.protocol === "file:") { $("#loginStatus").textContent = "Logowanie działa tylko z serwera http(s), nie z pliku."; return; }
    const nonce = crypto.randomUUID();
    sessionStorage.setItem("dpe-oauth-state", nonce);
    const q = new URLSearchParams({ client_id: OAUTH_CLIENT_ID, response_type: "token", redirect_uri: OAUTH_REDIRECT, scope: OAUTH_SCOPES, state: nonce, prompt: "none" });
    location.href = "https://discord.com/oauth2/authorize?" + q;
  });

  function applyDiscordUser(u, conns) {
    const ext = h => h && h.startsWith("a_") ? "gif" : "png";
    state.username = u.username;
    state.displayName = u.global_name || u.username;
    state.avatar = u.avatar ? `${CDN}/avatars/${u.id}/${u.avatar}.${ext(u.avatar)}?size=512` : `${CDN}/embed/avatars/${Number((BigInt(u.id) >> 22n) % 6n)}.png`;
    state.bannerImage = u.banner ? `${CDN}/banners/${u.id}/${u.banner}.${ext(u.banner)}?size=600` : "";
    if (u.accent_color != null) { state.bannerColor = hex(u.accent_color); state.bannerAuto = false; } else state.bannerAuto = true;
    const deco = u.avatar_decoration_data;
    const d = deco && CAT.decorations.find(x => x.s === String(deco.sku_id) || x.a === deco.asset);
    state.decoration = d ? d.s : "";
    state.decorationUrl = deco && !d ? `${CDN}/avatar-decoration-presets/${deco.asset}.png?size=240&passthrough=true` : "";
    const pg = u.primary_guild;
    state.tagOn = !!(pg && pg.identity_enabled && pg.tag);
    if (state.tagOn) { state.tagText = pg.tag; state.tagBadgeUrl = pg.badge ? `${CDN}/clan-badges/${pg.identity_guild_id}/${pg.badge}.png?size=16` : ""; }
    const flags = Number(u.public_flags || 0);
    const got = new Set(FLAG_BADGES.filter(([bit]) => flags & (1 << bit)).map(([, id]) => id));
    if (u.premium_type > 0) got.add("nitro"); // tenure tier isn't in the API: pick it in "Odznaki"
    state.badges = BADGES.filter(b => got.has(b.id)).map(b => b.id);
    const dns = u.display_name_styles;
    if (dns && (dns.font_id || dns.effect_id)) {
      state.nameOn = true; state.nameFont = DNS_FONT[dns.font_id] || "default"; state.nameEffect = DNS_EFFECT[dns.effect_id] || "solid";
      state.nameColors = (dns.colors || []).length ? dns.colors.map(hex) : NAME_DEFAULTS[state.nameEffect].slice();
    } else state.nameOn = false;
    state.memberSince = plDate(snowflakeDate(u.id));
    state.guildOn = false; // server join date isn't available to OAuth apps
    if (Array.isArray(conns)) state.connections = conns.filter(c => c.visibility === 1 && CONNECTIONS[c.type]).map(c => ({ platform: c.type, name: c.name }));
    // placeholder texts of the default profile are not the user's: clear them so the preview only shows real data
    ["bio", "pronouns", "statusText", "statusEmoji"].forEach(k => { if (state[k] === DEFAULT_STATE[k]) state[k] = ""; });
  }

  async function finishLogin() {
    const h = new URLSearchParams(location.hash.slice(1));
    if (!h.has("access_token") && !h.has("error")) return;
    history.replaceState(null, "", location.pathname + location.search); // drop the token from the address bar
    const expected = sessionStorage.getItem("dpe-oauth-state"); sessionStorage.removeItem("dpe-oauth-state");
    const status = $("#loginStatus");
    if (h.has("error")) { status.textContent = h.get("error") === "access_denied" ? "Logowanie anulowane." : "Błąd logowania: " + (h.get("error_description") || h.get("error")); return; }
    if (!expected || h.get("state") !== expected) { status.textContent = "Odrzucono logowanie (nieprawidłowy state)."; return; }
    status.textContent = "Pobieram profil…";
    const auth = { headers: { Authorization: `Bearer ${h.get("access_token")}` } };
    try {
      const [ur, cr] = await Promise.all([fetch("https://discord.com/api/v10/users/@me", auth), fetch("https://discord.com/api/v10/users/@me/connections", auth)]);
      if (!ur.ok) throw new Error("HTTP " + ur.status);
      const user = await ur.json(), conns = cr.ok ? await cr.json() : null;
      // probe: is the full profile (bio, theme, widgets) readable with an OAuth token? (read-only, expected to be refused)
      const profileStatus = await fetch(`https://discord.com/api/v10/users/${user.id}/profile`, auth).then(r => r.status, () => 0);
      sessionStorage.setItem("dpe-diag", JSON.stringify({ at: new Date().toISOString(), userStatus: ur.status, connStatus: cr.status, profileStatus, user, conns }));
      applyDiscordUser(user, conns);
      save();
      sessionStorage.setItem("dpe-todo", state.displayName);
      location.reload(); // rebuild every control from the imported state
    } catch (e) { status.textContent = "Nie udało się pobrać profilu (" + e.message + ")."; }
  }

  // after an import: point at what OAuth can't provide
  const todoName = sessionStorage.getItem("dpe-todo");
  if (todoName != null) {
    sessionStorage.removeItem("dpe-todo");
    $("#todoTitle").textContent = `Zaimportowano profil ${todoName}`;
    $("#todoLinks").innerHTML = TODO.map(([k, label]) => `<button type="button" class="btn" data-goto="${k}">${label}</button>`).join("");
    $("#todo").hidden = false;
  }
  $("#todoLinks").addEventListener("click", e => {
    const b = e.target.closest("[data-goto]"); if (!b) return;
    const d = form.querySelector(`details[data-k="${b.dataset.goto}"]`); d.open = true;
    d.scrollIntoView({ behavior: "smooth", block: "start" });
    b.disabled = true;
  });
  $("#todoClose").addEventListener("click", () => { $("#todo").hidden = true; });
  // ---------------------------------------------------------------- login diagnostics: what the API really returned (true/false per field)
  const KNOWN_USER_KEYS = ["id", "username", "discriminator", "global_name", "avatar", "banner", "accent_color", "banner_color", "avatar_decoration_data",
    "collectibles", "primary_guild", "clan", "display_name_styles", "public_flags", "flags", "premium_type", "locale", "mfa_enabled", "bot", "system"];
  const FLAG_NAMES = { 0: "STAFF", 1: "PARTNER", 2: "HYPESQUAD", 3: "BUG_HUNTER_1", 6: "BRAVERY", 7: "BRILLIANCE", 8: "BALANCE", 9: "EARLY_SUPPORTER",
    10: "TEAM_PSEUDO_USER", 14: "BUG_HUNTER_2", 16: "VERIFIED_BOT", 17: "EARLY_VERIFIED_DEV", 18: "CERTIFIED_MODERATOR", 19: "BOT_HTTP", 22: "ACTIVE_DEVELOPER" };
  const PREMIUM = { 0: "brak", 1: "Nitro Classic", 2: "Nitro", 3: "Nitro Basic" };
  const j = v => v === undefined ? "(brak pola)" : JSON.stringify(v);
  function diagRows(d) {
    const U = d.user || {}, C = Array.isArray(d.conns) ? d.conns : null;
    const has = k => U[k] !== undefined && U[k] !== null;
    const deco = U.avatar_decoration_data, dns = U.display_name_styles || {}, pg = U.primary_guild || {};
    const decoHit = deco && CAT.decorations.find(x => x.s === String(deco.sku_id) || x.a === deco.asset);
    const flags = Number(U.public_flags || 0);
    const pub = C ? C.filter(c => c.visibility === 1) : [];
    const unsupported = C ? [...new Set(C.map(c => c.type).filter(t => !CONNECTIONS[t]))] : [];
    const extra = Object.keys(U).filter(k => !KNOWN_USER_KEYS.includes(k));
    return [
      ["GET users/@me", d.userStatus === 200, "HTTP " + d.userStatus],
      ["GET users/@me/connections", d.connStatus === 200, "HTTP " + d.connStatus],
      ["id", has("id"), j(U.id)],
      ["username", has("username"), j(U.username)],
      ["global_name (wyświetlana nazwa)", has("global_name"), j(U.global_name)],
      ["avatar", has("avatar"), j(U.avatar)],
      ["avatar animowany (a_)", String(U.avatar || "").startsWith("a_"), j(U.avatar)],
      ["banner", has("banner"), j(U.banner)],
      ["accent_color", has("accent_color"), has("accent_color") ? hex(U.accent_color) : j(U.accent_color)],
      ["banner_color", has("banner_color"), j(U.banner_color)],
      ["avatar_decoration_data", has("avatar_decoration_data"), j(deco)],
      ["dekoracja jest w katalogu edytora", !!decoHit, decoHit ? decoHit.n : deco ? "brak w katalogu → link do assetu" : "-"],
      ["collectibles", has("collectibles"), j(U.collectibles)],
      ["collectibles.nameplate", !!(U.collectibles && U.collectibles.nameplate), j(U.collectibles && U.collectibles.nameplate)],
      ["primary_guild", has("primary_guild"), j(U.primary_guild)],
      ["primary_guild.identity_enabled", pg.identity_enabled === true, j(pg.identity_enabled)],
      ["primary_guild.tag", !!pg.tag, j(pg.tag)],
      ["primary_guild.badge", !!pg.badge, j(pg.badge)],
      ["clan (stara nazwa tagu)", has("clan"), j(U.clan)],
      ["display_name_styles", has("display_name_styles"), j(U.display_name_styles)],
      ["display_name_styles: czcionka znana", dns.font_id != null && DNS_FONT[dns.font_id] != null, j(dns.font_id) + (DNS_FONT[dns.font_id] ? " → " + DNS_FONT[dns.font_id] : "")],
      ["display_name_styles: efekt znany", dns.effect_id != null && DNS_EFFECT[dns.effect_id] != null, j(dns.effect_id) + (DNS_EFFECT[dns.effect_id] ? " → " + DNS_EFFECT[dns.effect_id] : "")],
      ["display_name_styles: kolory", Array.isArray(dns.colors) && dns.colors.length > 0, Array.isArray(dns.colors) ? dns.colors.map(hex).join(" ") : j(dns.colors)],
      ["public_flags", has("public_flags"), `${flags} = ${Object.keys(FLAG_NAMES).filter(b => flags & (1 << b)).map(b => FLAG_NAMES[b]).join(", ") || "brak"}`],
      ["flags", has("flags"), j(U.flags)],
      ["premium_type (Nitro)", has("premium_type"), has("premium_type") ? `${U.premium_type} = ${PREMIUM[U.premium_type] || "?"}` : j(U.premium_type)],
      ["połączenia: wszystkie", !!C, C ? String(C.length) : "-"],
      ["połączenia: publiczne (visibility 1)", pub.length > 0, pub.map(c => `${c.type}:${c.name}`).join(", ") || "-"],
      ["połączenia: wszystkie typy obsługiwane", !!C && unsupported.length === 0, unsupported.join(", ") || "-"],
      ["bio/motyw/widżety (users/{id}/profile)", d.profileStatus === 200, "HTTP " + d.profileStatus + " (oczekiwane: odmowa)"],
      ["inne pola w odpowiedzi", extra.length > 0, extra.join(", ") || "-"],
    ];
  }
  function showDiag() {
    let d; try { d = JSON.parse(sessionStorage.getItem("dpe-diag") || "null"); } catch (e) { d = null; }
    if (!d) return;
    const rows = diagRows(d);
    $("#diagRows").innerHTML = rows.map(([k, ok, v]) => `<div class="diag-row"><span class="diag-k">${esc(k)}</span><b class="${ok ? "ok" : "no"}">${ok}</b><span class="diag-v">${esc(v)}</span></div>`).join("");
    const raw = JSON.stringify({ user: d.user, connections: d.conns }, null, 2);
    $("#diagRaw").textContent = raw;
    $("#diag").hidden = false;
    $("#diagCopy").onclick = async () => {
      const text = `Diagnostyka logowania Discord (${d.at})\n` + rows.map(([k, ok, v]) => `${ok ? "true " : "false"} | ${k} | ${v}`).join("\n") + "\n\nSurowa odpowiedź:\n" + raw;
      try { await navigator.clipboard.writeText(text); $("#diagCopied").textContent = "Skopiowano"; }
      catch (e) { $("#diagRaw").textContent = text; $("#diagCopied").textContent = "Zaznacz tekst poniżej i skopiuj"; }
    };
  }
  $("#diagClose").addEventListener("click", () => { $("#diag").hidden = true; sessionStorage.removeItem("dpe-diag"); });
  showDiag();
  finishLogin();

  // collapsible sections remember state per viewer
  form.querySelectorAll("details[data-k]").forEach(d => {
    try { const v = localStorage.getItem("dpe-open-" + d.dataset.k); if (v != null) d.open = v === "1"; } catch (e) { }
    d.addEventListener("toggle", () => { try { localStorage.setItem("dpe-open-" + d.dataset.k, d.open ? "1" : "0"); } catch (e) { } });
  });

  syncDisabled();
  if (state.bannerAuto && !state.bannerImage) autoBannerColor();
  render();
  void drawDecos;
})();
