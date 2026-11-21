/*
 * Ports of Discord client functions (web.bb7e22d7f6985781.js, 2026-11-19 build), kept as close to the
 * original as possible. Module ids are noted so they can be re-checked against a newer build.
 * Requires chroma-js (Discord bundles it as module 310784).
 */
(function (global) {
  "use strict";
  const chroma = global.chroma;

  // ---- 317097: int colour helpers --------------------------------------------------------------
  function intToHsl(e) { // 317097.tf
    let t = e >> 16 & 255, n = e >> 8 & 255, i = 255 & e;
    const r = Math.min(t /= 255, n /= 255, i /= 255), a = Math.max(t, n, i), s = a - r;
    let l = 0, o;
    l = Math.round(60 * (l = s === 0 ? 0 : a === t ? (n - i) / s % 6 : a === n ? (i - t) / s + 2 : (t - n) / s + 4));
    if (l < 0) l += 360;
    o = (a + r) / 2;
    return { h: l, s: +(s === 0 ? 0 : s / (1 - Math.abs(2 * o - 1))).toFixed(3), l: +o.toFixed(3) };
  }
  function intToHsla(e, desaturate = false, sat = null, alpha = 1) { // 317097.$k
    const { h, s, l } = intToHsl(e), o = +(100 * s).toFixed(1), d = +(100 * l).toFixed(1);
    return desaturate ? `hsla(${h}, calc(var(--saturation-factor, 1) * ${o}%), ${d}%, ${alpha})`
      : sat != null ? `hsla(${h}, ${sat * o}%, ${d}%, ${alpha})` : `hsla(${h}, ${o}%, ${d}%, ${alpha})`;
  }
  const darkness = e => 1 - (0.299 * (e >> 16 & 255) + 0.587 * (e >> 8 & 255) + 0.114 * (255 & e)) / 255; // 317097.OK
  const toInt = c => chroma(c).num(); // 317097.LX

  // ---- 498596: contrast nudging -------------------------------------------------------------
  const Contrast = { NonText: 3, Text: 4.5, HighContrastText: 7 };
  function ensureContrast(e, t = {}) { // 498596.OB
    const n = t.contrastRatio ?? Contrast.NonText, i = t.tolerance ?? 3, l = chroma(t.base ?? e), o = chroma(e);
    const d = l.luminance(); let c = o; const u = n + i; let _ = chroma.contrast(l, o), E = 100;
    for (; E-- > 0;) {
      const lo = _ < n, hi = _ > u;
      if (!lo && !hi) break;
      const brighter = c.luminance() > d;
      c = (hi && brighter) || (lo && !brighter) ? c.darken() : c.brighten();
      _ = chroma.contrast(l, c);
    }
    const [r, g, b, a] = c.rgba();
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }

  // ---- 543699: profile theme helpers --------------------------------------------------------
  const THEME_DARK = "dark", THEME_LIGHT = "light";
  const themeForPrimary = e => e == null ? null : darkness(e) > 0.5 ? THEME_DARK : THEME_LIGHT; // 543699.tM
  const buttonColor = e => toInt(ensureContrast(e, { base: "#ffffff", contrastRatio: Contrast.HighContrastText })); // 543699.wg
  function modalBackground(e, t, n) { // 543699.v2
    const dark = (n ?? themeForPrimary(e)) !== THEME_LIGHT;
    const s = chroma.mix(chroma(e), chroma(t), 0.5, "lab");
    const l = Math.round(100 * s.get("hsl.l")) / 100;
    const c = dark ? Math.min(Math.max(l, 0), 0.1) : Math.min(Math.max(l, 0.8), 1);
    return chroma(s).set("hsl.l", c).num();
  }

  // ---- 345815: custom theme base/text colours -------------------------------------------------
  function baseAndText({ primaryColor, secondaryColor, isDarkTheme }) {
    const r = chroma(primaryColor), s = chroma(secondaryColor);
    let [l, o] = r.luminance() > s.luminance() ? [r, s] : [s, r];
    const d = o.get("hsl.h");
    if (d === 0 || Number.isNaN(d)) o = l;
    let c = isDarkTheme ? l.set("hsl.s", 1) : o.set("hsl.s", 1);
    const u = c.get("hsl.h");
    c = c.set("hsl.l", u >= 200 && u <= 300 ? (isDarkTheme ? 0.8 : 0.25) : (isDarkTheme ? 0.95 : 0.15));
    return { base: isDarkTheme ? o.set("hsl.s", 1).set("hsl.l", 0.05) : l.set("hsl.s", 1).set("hsl.l", 0.9), text: c };
  }
  function hslTriplet(e) { const [t, n, i] = e.hsl(); return `${Number.isNaN(t) ? 0 : t} ${100 * n}% ${100 * i}%`; }
  function customThemeVars({ enabled, primaryColor, secondaryColor, baseMixAmount = 50, textMixAmount = 38 }) { // 345815.Zk
    const { base: s, text: d } = baseAndText({ primaryColor, secondaryColor, isDarkTheme: true });
    const { base: c, text: u } = baseAndText({ primaryColor, secondaryColor, isDarkTheme: false });
    return {
      "--custom-theme-base-color-amount": `${enabled ? baseMixAmount : 0}%`,
      "--custom-theme-text-color-amount": `${enabled ? textMixAmount : 0}%`,
      "--custom-theme-base-color-light-hsl": hslTriplet(c),
      "--custom-theme-base-color-light": c.css(),
      "--custom-theme-text-color-light": u.css(),
      "--custom-theme-base-color-dark-hsl": hslTriplet(s),
      "--custom-theme-base-color-dark": s.css(),
      "--custom-theme-text-color-dark": d.css(),
    };
  }

  // ---- 991988: profile theme style (useProfileThemeStyle) -------------------------------------
  const DEFAULT_PROFILE_STYLE = Object.freeze({
    "--profile-gradient-primary-color": "var(--background-surface-high)",
    "--profile-gradient-secondary-color": "var(--background-surface-high)",
    "--profile-gradient-overlay-color": "rgba(0, 0, 0, 0)",
    "--profile-gradient-button-color": "var(--background-mod-subtle)",
    "--profile-gradient-modal-background-color": "var(--background-base-lower)",
  });
  // design tokens PROFILE_GRADIENT_OVERLAY (BLACK/WHITE @ .6) and PROFILE_GRADIENT_OVERLAY_SYNCED_WITH_USER_THEME (@ .8)
  const OVERLAY = { dark: "#00000099", light: "#ffffff99" };
  const OVERLAY_SYNCED = { dark: "#000000cc", light: "#ffffffcc" };
  // synced = viewer setting syncProfileThemeWithUserTheme: theme follows the viewer's client theme instead of tM(primary)
  function profileThemeStyle(primary, secondary, { synced = false, clientTheme = THEME_DARK } = {}) {
    if (primary == null || secondary == null) return { theme: null, synced: false, style: { ...DEFAULT_PROFILE_STYLE } };
    const theme = synced ? clientTheme : themeForPrimary(primary);
    const style = {
      "--profile-gradient-primary-color": intToHsla(primary),
      "--profile-gradient-secondary-color": intToHsla(secondary),
      "--profile-gradient-overlay-color": (synced ? OVERLAY_SYNCED : OVERLAY)[theme],
      "--profile-gradient-button-color": intToHsla(buttonColor(primary)),
      "--profile-gradient-modal-background-color": intToHsla(modalBackground(primary, secondary, synced ? theme : undefined)),
      ...customThemeVars({ enabled: true, primaryColor: primary, secondaryColor: secondary, isDarkTheme: theme === THEME_DARK, textMixAmount: 25 }),
    };
    return { theme, synced, style };
  }

  // ---- display name styles (UserNameWithEffects) --------------------------------------------
  const DNS_EFFECTS = { SOLID: 1, GRADIENT: 2, NEON: 3, TOON: 4, POP: 5, GLOW: 6, GUMMY: 7, PRISM: 8 };
  const MIN_CONTRAST = { solid: 3, gradient: 2.5, glow: 2.5, prism: 2.5, neon: 3, toon: 3, pop: 3, gummy: 3 };
  const COLOR_COUNT = { gradient: 2, gummy: 4, prism: 5 };
  function namePalette(e) { // m.$0
    const t = chroma(e).alpha(1), n = t.get("hsl.l"), i = Math.min(1, 1.2 * t.get("hsl.s")), a = Math.min(0.6, n + 0.1);
    return {
      main: e,
      light1: t.set("hsl.l", Math.min(1, 1.2 * n)).hex(), light2: t.set("hsl.l", Math.min(1, 1.6 * n)).hex(),
      dark1: t.set("hsl.l", Math.max(0, 0.6 * n)).hex(), dark2: t.set("hsl.l", Math.max(0, 0.2 * n)).hex(),
      toonStroke: t.set("hsl.l", Math.max(0.12, 0.4 * n)).hex(), neonStroke: t.set("hsl.s", i).set("hsl.l", a).hex(),
    };
  }
  function contrastAdjust({ foreground: t, background: n, ratio: i = 5 }) { // p.lZ (saturationFactor 1)
    const s = 0.5 >= n.luminance(); let l = chroma.contrast(t, n);
    for (let e = 0; e < 10 && l < i; e++) {
      const L = t.get("hsl.l");
      if (s) { if (L < 0.95) t = t.set("hsl.l", L + 0.05); else break; }
      else if (L > 0.05) t = t.set("hsl.l", L - 0.05); else break;
      l = chroma.contrast(t, n);
    }
    return t.alpha(1);
  }
  function displayNameVars(effect, colors, { shouldWrap = true, nameLength = 0, background = "#1a1a1e" } = {}) {
    const bg = effect === "toon" ? chroma("#333") : chroma(background);
    const V = colors.map(c => contrastAdjust({ foreground: chroma(c), background: bg, ratio: MIN_CONTRAST[effect] ?? 3 }).hex());
    let d = {};
    const N = "--custom-display-name-styles-main-color";
    if (effect === "gradient" || effect === "glow") {
      d = V.length === 0 ? {} : {
        "--custom-display-name-styles-gradient-stops": V.length === 1 ? `${V[0]}, ${V[0]}` : V.map((e, t) => `${e} ${10 + 80 * t / (V.length - 1)}%`).join(", "),
        [N]: V[0],
      };
    } else if (effect === "prism") {
      d = V.length === 0 ? {} : {
        "--custom-display-name-styles-prism-stops": Array.from({ length: V.length + 1 }, (e, t) => `${V[t % V.length]} ${(100 * t / V.length).toFixed(3)}%`).join(", "),
        "--custom-display-name-styles-prism-cycle": `max(${nameLength}ch, 38px)`,
        [N]: V[0],
      };
    } else if (V.length > 0) {
      const p = namePalette(V[0]);
      d = {
        [N]: p.main, "--custom-display-name-styles-light-1-color": p.light1, "--custom-display-name-styles-light-2-color": p.light2,
        "--custom-display-name-styles-dark-1-color": p.dark1, "--custom-display-name-styles-dark-2-color": p.dark2,
        "--custom-display-name-styles-toon-stroke-color": p.toonStroke, "--custom-display-name-styles-neon-stroke-color": p.neonStroke,
      };
    }
    return { vars: { ...d, "--custom-display-name-styles-wrap": shouldWrap ? "wrap" : "nowrap", "--custom-display-name-styles-font-opacity": 1 }, colors: V };
  }

  // ---- avatar sizes (778712) + mask geometry (mask generators G / x) ------------------------
  const AVATAR_SIZES = {
    80: { size: 80, status: 16, stroke: 6, offset: 4 },
    120: { size: 120, status: 24, stroke: 8, offset: 8 },
  };
  function avatarStatusMask(size) { // G()
    const n = AVATAR_SIZES[size], i = n.status / 2, c = (n.size - i - n.offset) / n.size;
    return `<mask id="svg-mask-avatar-status-round-${size}" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="${c}" cy="${c}" r="${(i + n.stroke) / n.size}"></circle></mask>`;
  }
  function decorationStatusMask(size) { // x()
    const n = AVATAR_SIZES[size], i = n.status / 2, a = (i + n.stroke) / n.size / 1.2, s = ((n.size - i - n.offset) / n.size + 0.1) / 1.2;
    return `<mask id="svg-mask-avatar-decoration-status-round-${size}" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><rect fill="white" x="0" y="0" width="100%" height="100%"></rect><circle fill="black" cx="${s}" cy="${s}" r="${a}"></circle></mask>`;
  }

  global.DiscordTheme = {
    intToHsla, toInt, darkness, ensureContrast, themeForPrimary, buttonColor, modalBackground, customThemeVars,
    profileThemeStyle, DEFAULT_PROFILE_STYLE, namePalette, displayNameVars, COLOR_COUNT, AVATAR_SIZES,
    avatarStatusMask, decorationStatusMask,
  };
})(window);
