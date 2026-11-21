/* Discord client themes (Nitro "Motywy kolorystyczne"), ported from Discord's web bundle:
   presets   = module 385803 (BACKGROUND_GRADIENT_PRESET list; token hexes from BG_GRADIENT_* raw colours, names from pl intl)
   gradient  = module 644235 FK: linear-gradient(<angle>deg, <colour> <stop>%, ...)
   variables = module 162772 u() (preset) / c() (custom theme) + module 345815 Zk() (base/text colour mix)
   standard theme ids = module 680049: ASH "dark", DARK "darker", ONYX "midnight", LIGHT "light" (preset DARK = "darker"). */
(function (global) {
  "use strict";
  const STANDARD = [["light", "Jasny"], ["dark", "Popielaty"], ["darker", "Ciemny"], ["midnight", "Onyks"]];
  // order = Discord's picker order (light presets, then dark presets)
  const PRESETS = [
    { id: "MINT_APPLE", name: "Jabłko i mięta", base: "light", angle: 180, stops: [["#56b69f", 6.15], ["#63bc61", 48.7], ["#9eca67", 93.07]] },
    { id: "CITRUS_SHERBERT", name: "Cytrusowy sorbet", base: "light", angle: 180, stops: [["#f3b336", 31.1], ["#ee8558", 67.09]] },
    { id: "RETRO_RAINCLOUD", name: "Chmura deszczowa retro", base: "light", angle: 148.71, stops: [["#3a7ca1", 5.64], ["#7f7eb9", 26.38], ["#7f7eb9", 49.92], ["#3a7ca1", 73.12]] },
    { id: "HANAMI", name: "Hanami", base: "light", angle: 38.08, stops: [["#efaab3", 3.56], ["#efd696", 35.49], ["#a6daa2", 68.78]] },
    { id: "SUNRISE", name: "Wschód słońca", base: "light", angle: 154.19, stops: [["#9f4175", 8.62], ["#c49064", 48.07], ["#a6953d", 76.04]] },
    { id: "COTTON_CANDY", name: "Wata cukrowa", base: "light", angle: 180.14, stops: [["#f4abb8", 8.5], ["#b1c2fc", 94.28]] },
    { id: "LOFI_VIBES", name: "Klimat LoFi", base: "light", angle: 179.52, stops: [["#a4c0f7", 7.08], ["#a9e4e8", 34.94], ["#b0e2b8", 65.12], ["#cfdfa2", 96.23]] },
    { id: "DESERT_KHAKI", name: "Pustynny kamuflaż", base: "light", angle: 38.99, stops: [["#e7dbd0", 12.92], ["#dfd0b2", 32.92], ["#e0d6a3", 52.11]] },
    { id: "SUNSET", name: "Zachód słońca", base: "darker", angle: 141.68, stops: [["#48288c", 27.57], ["#db7f4b", 71.25]] },
    { id: "CHROMA_GLOW", name: "Chromatyczny blask", base: "darker", angle: 128.92, stops: [["#0eb5bf", 3.94], ["#4c0ce0", 26.1], ["#a308a7", 39.82], ["#9a53ff", 56.89], ["#218be0", 76.45]] },
    { id: "FOREST", name: "Las", base: "darker", angle: 162.27, stops: [["#142215", 11.2], ["#2d4d39", 29.93], ["#454c32", 48.64], ["#5a7c58", 67.85], ["#a98e4b", 83.54]] },
    { id: "CRIMSON_MOON", name: "Karmazynowy księżyc", base: "darker", angle: 64.92, stops: [["#950909", 16.17], ["#000000", 72]] },
    { id: "MIDNIGHT_BLURPLE", name: "Ciemny niebieskofioletowy", base: "darker", angle: 48.17, stops: [["#5348ca", 11.21], ["#140730", 61.92]] },
    { id: "MARS", name: "Mars", base: "darker", angle: 170.82, stops: [["#895240", 14.61], ["#8f4343", 74.62]] },
    { id: "DUSK", name: "Zmrok", base: "darker", angle: 180, stops: [["#665069", 12.84], ["#91a3d1", 85.99]] },
    { id: "UNDER_THE_SEA", name: "Pod wodą", base: "darker", angle: 179.14, stops: [["#647962", 1.91], ["#588575", 48.99], ["#6a8482", 96.35]] },
    { id: "RETRO_STORM", name: "Burza retro", base: "darker", angle: 148.71, stops: [["#3a7ca1", 5.64], ["#58579a", 26.38], ["#58579a", 49.92], ["#3a7ca1", 73.12]] },
    { id: "NEON_NIGHTS", name: "Neonowe noce", base: "darker", angle: 180, stops: [["#01a89e", 0], ["#7d60ba", 50], ["#b43898", 100]] },
    { id: "STRAWBERRY_LEMONADE", name: "Truskawkowa lemoniada", base: "darker", angle: 161.03, stops: [["#af1a6c", 18.79], ["#c26b20", 49.76], ["#e7a525", 80.72]] },
    { id: "AURORA", name: "Aurora", base: "darker", angle: 239.16, stops: [["#062053", 10.39], ["#191fbb", 26.87], ["#13929a", 48.31], ["#218573", 64.98], ["#051a81", 92.5]] },
    { id: "SEPIA", name: "Sepia", base: "darker", angle: 69.98, stops: [["#857664", 14.14], ["#5b4421", 60.35]] },
    { id: "BLURPLE_TWILIGHT", name: "Niebieskofioletowy zmierzch", base: "darker", angle: 47.61, stops: [["#2c3fe7", 11.18], ["#261d83", 64.54]] },
  ];
  const gradientOf = p => `linear-gradient(${p.angle}deg, ${p.stops.map(([c, s]) => `${c} ${s}%`).join(", ")})`;

  // module 345815 l(): base/text colours derived from the two gradient end colours
  function mixColors(primary, secondary, dark) {
    const r = chroma(primary), s = chroma(secondary);
    let [l, o] = r.luminance() > s.luminance() ? [r, s] : [s, r];
    const d = o.get("hsl.h");
    if (d === 0 || Number.isNaN(d)) o = l;
    let c = dark ? l.set("hsl.s", 1) : o.set("hsl.s", 1);
    const u = c.get("hsl.h");
    c = c.set("hsl.l", u >= 200 && u <= 300 ? (dark ? .8 : .25) : (dark ? .95 : .15));
    return { base: dark ? o.set("hsl.s", 1).set("hsl.l", .05) : l.set("hsl.s", 1).set("hsl.l", .9), text: c };
  }
  // module 345815 FT()
  const hslTriplet = c => { const [h, s, l] = c.hsl(); return `${Number.isNaN(h) ? 0 : h} ${100 * s}% ${100 * l}%`; };
  // module 345815 Zk()
  function themeVars(primary, secondary, baseMix = 50, textMix = 38) {
    const D = mixColors(primary, secondary, true), L = mixColors(primary, secondary, false);
    return {
      "--custom-theme-base-color-amount": `${baseMix}%`,
      "--custom-theme-text-color-amount": `${textMix}%`,
      "--custom-theme-base-color-light-hsl": hslTriplet(L.base),
      "--custom-theme-base-color-light": L.base.css(),
      "--custom-theme-text-color-light": L.text.css(),
      "--custom-theme-base-color-dark-hsl": hslTriplet(D.base),
      "--custom-theme-base-color-dark": D.base.css(),
      "--custom-theme-text-color-dark": D.text.css(),
    };
  }
  const block = vars => `.custom-theme-background {\n${Object.entries(vars).map(([k, v]) => `  ${k}: ${v};`).join("\n")}\n}`;

  // module 162772 u(): stylesheet for a preset
  function presetCSS(p) {
    const first = p.stops[0][0], last = p.stops[p.stops.length - 1][0];
    return block({
      "--custom-theme-background": gradientOf(p),
      "--custom-theme-primary-color": first,
      "--custom-theme-secondary-color": last,
      "--custom-background-gradient-opacity-multiplier": 1,
      ...themeVars(first, last),
    });
  }

  // module 162772 c(colors, angle, mix, baseTheme): stylesheet for a Nitro custom theme ("Własny motyw")
  function customCSS({ colors, angle, mix, base }) {
    const T = colors.slice(); if (T.length === 1) T.push(T[0]);
    const lum = colors.map(c => chroma(c).luminance());
    const darkest = chroma(colors[lum.indexOf(Math.min(...lum))]), lightest = chroma(colors[lum.indexOf(Math.max(...lum))]);
    const dark = base !== "light", h = 100 - mix;
    const f = { light: lightest.set("hsl.s", 1).set("hsl.l", .9), dark: darkest.set("hsl.s", 1).set("hsl.l", .05) };
    return block({
      "--custom-theme-background": `linear-gradient(${angle}deg, ${T.join(", ")})`,
      "--custom-background-gradient-opacity-multiplier": 1,
      "--custom-background-gradient-chat-opacity-base-light": "0.95",
      "--custom-background-gradient-highest-opacity-base-light": "1.0",
      "--custom-background-gradient-opacity-mix-amount": ((30 + .7 * h) / 100).toFixed(2),
      "--custom-theme-border-color-amount": "5%",
      "--custom-theme-base-color-amount": dark ? `${60 + .4 * h}%` : `${30 + -.2 * mix}%`,
      "--custom-theme-text-color-amount": dark ? "30%" : "40%",
      "--custom-theme-base-color-dark": f.dark.css(),
      "--custom-theme-base-color-dark-hsl": hslTriplet(f.dark),
      "--custom-theme-text-color-dark": darkest.set("hsl.l", ((100 - .1 * h) / 100).toFixed(2)).css(),
      "--custom-theme-base-color-light": f.light.css(),
      "--custom-theme-base-color-light-hsl": hslTriplet(f.light),
      "--custom-theme-text-color-light": lightest.set("hsl.l", (.05 * h / 100).toFixed(2)).css(),
    });
  }

  global.DiscordClientThemes = { STANDARD, PRESETS, gradientOf, presetCSS, customCSS };
})(window);
