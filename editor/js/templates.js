/*
 * Discord DOM templates.
 * Every element, class and attribute below is copied from markup rendered by the Discord web client
 * (captured 2026-11-19 from the live client and from discord-profile-yebacducha.html). Only the data
 * (names, images, colours) is parameterised; structure is not invented.
 */
(function (global) {
  "use strict";
  const T = global.DiscordTheme;

  const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const styleAttr = obj => Object.entries(obj).map(([k, v]) => `${k}: ${v};`).join(" ");

  // ---------------------------------------------------------------- icons (verbatim paths)
  const ICON = {
    message: '<path fill="currentColor" d="M12 22a10 10 0 1 0-8.45-4.64c.13.19.11.44-.04.61l-2.06 2.37A1 1 0 0 0 2.2 22H12Z" class=""></path>',
    friend: '<path fill="currentColor" d="M12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM11.53 11A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h6.4a.5.5 0 0 0 .35-.85l-.02-.03a3 3 0 1 1 4.24-4.24l.53.52c.2.2.5.2.7 0l1.8-1.8c.17-.17.2-.43.06-.62A9.52 9.52 0 0 0 12.47 11h-.94Z" class=""></path><path fill="currentColor" d="M23.7 17.7a1 1 0 1 0-1.4-1.4L18 20.58l-2.3-2.3a1 1 0 0 0-1.4 1.42l3 3a1 1 0 0 0 1.4 0l5-5Z" class=""></path>',
    more: '<path fill="currentColor" fill-rule="evenodd" d="M4 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm10-2a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm8 0a2 2 0 1 1-4 0 2 2 0 0 1 4 0Z" clip-rule="evenodd" class=""></path>',
    close: '<path fill="currentColor" d="M17.3 18.7a1 1 0 0 0 1.4-1.4L13.42 12l5.3-5.3a1 1 0 0 0-1.42-1.4L12 10.58l-5.3-5.3a1 1 0 0 0-1.4 1.42L10.58 12l-5.3 5.3a1 1 0 1 0 1.42 1.4L12 13.42l5.3 5.3Z" class=""></path>',
    react: '<path fill="var(--interactive-icon-default)" fill-rule="evenodd" d="M12 23a11 11 0 1 0 0-22 11 11 0 0 0 0 22ZM6.5 13a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm11 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm-9.8 1.17a1 1 0 0 1 1.39.27 3.5 3.5 0 0 0 5.82 0 1 1 0 0 1 1.66 1.12 5.5 5.5 0 0 1-9.14 0 1 1 0 0 1 .27-1.4Z" clip-rule="evenodd" class=""></path>',
    reply: '<path fill="var(--interactive-icon-default)" d="M2.3 7.3a1 1 0 0 0 0 1.4l5 5a1 1 0 0 0 1.4-1.4L5.42 9H11a7 7 0 0 1 7 7v4a1 1 0 1 0 2 0v-4a9 9 0 0 0-9-9H5.41l3.3-3.3a1 1 0 0 0-1.42-1.4l-5 5Z" class=""></path>',
    addFriend: '<path d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 0 1 0 2h-3v3a1 1 0 0 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z" fill="currentColor" class=""></path><path d="M16.83 12.93c.26-.27.26-.75-.08-.92A9.5 9.5 0 0 0 12.47 11h-.94A9.53 9.53 0 0 0 2 20.53c0 .81.66 1.47 1.47 1.47h.22c.24 0 .44-.17.5-.4.29-1.12.84-2.17 1.32-2.91.14-.21.43-.1.4.15l-.26 2.61c-.02.3.2.55.5.55h7.64c.12 0 .17-.31.06-.36C12.82 21.14 12 20.22 12 19a3 3 0 0 1 3-3h.5a.5.5 0 0 0 .5-.5V15c0-.8.31-1.53.83-2.07ZM12 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" fill="currentColor" class=""></path>',
    link: '<path fill="currentColor" d="M8 5a1 1 0 0 0 0 2h7.59L5.29 17.3a1 1 0 1 0 1.42 1.4L17 8.42V16a1 1 0 1 0 2 0V6a1 1 0 0 0-1-1H8Z" class=""></path>',
    note: '<path fill="currentColor" fill-rule="evenodd" d="M5 2a3 3 0 0 0-3 3v14a3 3 0 0 0 3 3h9c.1 0 .12-.11.04-.15a3 3 0 0 1-2.03-3.16c.04-.34-.2-.69-.55-.69H6a1 1 0 1 1 0-2h9.5a.5.5 0 0 0 .5-.5V15a3 3 0 0 1 .19-1.05c.15-.4-.11-.95-.54-.95H6a1 1 0 1 1 0-2h12a1 1 0 0 1 .88.52c.13.24.35.48.62.52A3 3 0 0 1 21.83 14v.02c.02.06.17.05.17-.02V5a3 3 0 0 0-3-3H5Zm1 4a1 1 0 0 0 0 2h5a1 1 0 1 0 0-2H6Z" clip-rule="evenodd" class=""></path><path fill="currentColor" d="M19 14a1 1 0 0 1 1 1v3h3a1 1 0 1 1 0 2h-3v3a1 1 0 1 1-2 0v-3h-3a1 1 0 1 1 0-2h3v-3a1 1 0 0 1 1-1Z" class=""></path>',
  };
  const svg16 = (body, cls = "") => `<svg${cls ? ` class="${cls}"` : ""} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">${body}</svg>`;

  // full class names written out literally so tools/build_css.py can find them
  const BUTTON_VARIANT = { primary: "primary_F7qvhY", secondary: "secondary_F7qvhY" };
  const TEXT_VARIANT = { "heading-xl/semibold": "heading-xl/semibold_RAOoio", "heading-lg/semibold": "heading-lg/semibold_RAOoio" };
  const button = ({ variant = "secondary", label = "", icon = "", trail = "", aria = "", extra = "" }) =>
    `<button data-mana-component="button" role="button" class="button_F7qvhY sm_F7qvhY ${BUTTON_VARIANT[variant]}${label ? " hasText_F7qvhY" : ""}" type="button"${aria ? ` aria-label="${esc(aria)}"` : ""}${extra}><div class="buttonChildrenWrapper_F7qvhY"><div class="buttonChildren_F7qvhY">${icon ? svg16(icon, "icon_F7qvhY") : ""}${label ? `<span class="lineClamp1_MMUIw6 body-sm/medium_RAOoio" data-text-variant="body-sm/medium">${esc(label)}</span>` : ""}${trail ? svg16(trail, "icon_F7qvhY") : ""}</div></div></button>`;

  // Discord tokens are hsl(... calc() ...) / color-mix(); let the browser resolve them, then rasterise to a hex
  const colorCache = new Map();
  function resolveColor(cssColor, scope = document.querySelector("#preview") || document.body) {
    const key = cssColor + "|" + document.documentElement.className;
    if (colorCache.has(key)) return colorCache.get(key);
    const probe = document.createElement("i");
    probe.style.cssText = `position:absolute;visibility:hidden;color:${cssColor}`;
    scope.appendChild(probe);
    const computed = getComputedStyle(probe).color; probe.remove();
    const cv = document.createElement("canvas"); cv.width = cv.height = 1;
    const ctx = cv.getContext("2d", { willReadFrequently: true });
    ctx.fillStyle = "#000"; ctx.fillStyle = computed; ctx.fillRect(0, 0, 1, 1);
    const [r, g, b, a] = ctx.getImageData(0, 0, 1, 1).data;
    const hex = a ? "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("") : null;
    colorCache.set(key, hex);
    return hex;
  }

  // ---------------------------------------------------------------- status
  const STATUS_LABEL = { online: "Dostępny", idle: "Zaraz wracam", dnd: "Nie przeszkadzać", offline: "Niedostępny", streaming: "Na żywo" };
  // Avatar status colour: unsafe_rawColors resolved with {saturation:1}.hex() (module 791966 fn A):
  // ONLINE GREEN_NEW_38, IDLE YELLOW_NEW_30, DND RED_NEW_46, STREAMING PLATFORM_TWITCH, OFFLINE/INVISIBLE NEUTRAL_34
  const STATUS_COLOR = { online: "#45a366", idle: "#ffc04e", dnd: "#da3e44", streaming: "#9147ff", offline: "#84858d" };
  const statusFill = status => STATUS_COLOR[status] || STATUS_COLOR.offline;

  // ---------------------------------------------------------------- avatar (+ decoration)
  function avatar({ size, src, status, name, decorationSrc, clickableLabel }) {
    const spec = T.AVATAR_SIZES[size];
    const w = size + spec.status * 0.75;
    const x = size - spec.status - spec.offset;
    const statusRect = status
      ? `<g><rect width="${spec.status}" height="${spec.status}" x="${x}" y="${x}" fill="${statusFill(status)}" mask="url(#svg-mask-status-${status})" class="pointerEvents_XpIUHy"></rect></g>` : "";
    const mask = status ? `svg-mask-avatar-status-round-${size}` : "svg-mask-avatar-default";
    const decoSize = size * 1.2;
    const deco = decorationSrc
      ? `<svg width="${decoSize + spec.status * 0.75}" height="${decoSize}" viewBox="0 0 ${decoSize + spec.status * 0.75} ${decoSize}" class="avatarDecorationContainer_XpIUHy" aria-hidden="true"><foreignObject x="0" y="0" width="${decoSize}" height="${decoSize}"${status ? ` mask="url(#svg-mask-avatar-decoration-status-round-${size})"` : ""}><img class="avatarDecoration_XpIUHy" alt=" " aria-hidden="true" src="${esc(decorationSrc)}"></foreignObject></svg>` : "";
    return `<div class="avatar_WRLIGC clickable_WRLIGC"><div class="focusTarget_EEwkB0" aria-label="${esc(clickableLabel)}" role="button" tabindex="0"></div><div class="wrapper_XpIUHy" role="img" aria-label="${esc(name)}, ${esc(STATUS_LABEL[status] || "")}" aria-hidden="false" style="width: ${size}px; height: ${size}px;"><svg width="${w}" height="${w}" viewBox="0 0 ${w} ${w}" class="mask_XpIUHy svg_XpIUHy" aria-hidden="true"><foreignObject x="0" y="0" width="${size}" height="${size}" mask="url(#${mask})"><div class="avatarStack_XpIUHy overlay_WRLIGC"><img alt=" " class="avatar_XpIUHy" aria-hidden="true" src="${esc(src)}"></div></foreignObject>${statusRect}</svg>${deco}</div></div>`;
  }

  // ---------------------------------------------------------------- banner
  function banner({ height, radius, cx, cy, image, color }) {
    const st = { "--custom-cutout-radius": `${radius}px`, "--custom-cutout-x": `${cx}px`, "--custom-cutout-y": cy };
    if (image) st["background-image"] = `url("${image}")`;
    st["background-color"] = color;
    return `<div class="banner_vNEdYY" style="height: ${height}px; width: 100%;"><div class="fill_vNEdYY banner_s9bWOi" style="${esc(styleAttr(st))}"></div></div>`;
  }

  // ---------------------------------------------------------------- custom status bubble
  function emojiImg(emoji) {
    if (!emoji) return "";
    const cp = [...emoji].map(c => c.codePointAt(0).toString(16)).filter(h => h !== "fe0f").join("-");
    // Discord ships twemoji artwork (hashed under discord.com/assets); same SVGs from the twemoji repo:
    return `<img class="emoji emoji_HigqCD statusEmoji_rmCN9_" data-type="emoji" data-name="${esc(emoji)}" alt="${esc(emoji)}" draggable="false" src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${cp}.svg">`;
  }
  function customStatus({ text, emoji, name }) {
    if (!text && !emoji) return "";
    const content = extra => `<div class="content_rmCN9_${extra}">${emojiImg(emoji)}${text ? `<div class="defaultColor_MMUIw6 body-sm/normal_RAOoio statusText_rmCN9_" data-text-variant="body-sm/normal">${esc(text)}</div>` : ""}</div>`;
    return `<div class="referenceContainer_rmCN9_"><div class="outer_rmCN9_"><span class="inner_rmCN9_">${content("")}${content(" referenceMeasurement_rmCN9_")}${content(" unclamped_rmCN9_ referenceMeasurement_rmCN9_")}</span></div></div>`
      + `<div class="container_rmCN9_"><div class="outer_rmCN9_" role="group" aria-label="Status własny użytkownika ${esc(name)}"><span class="inner_rmCN9_"><div id="uid_274" class="content_rmCN9_" style="max-height: 18px;">${emojiImg(emoji)}${text ? `<div class="defaultColor_MMUIw6 body-sm/normal_RAOoio statusText_rmCN9_" data-text-variant="body-sm/normal">${esc(text)}</div>` : ""}</div></span></div>`
      + `<div class="popover_yDAPhH statusPopover_yDAPhH wrapper_Z0MHyc"><span><div class="button_yDAPhH button_Z0MHyc" aria-label="Zareaguj na status" aria-haspopup="dialog" role="button" tabindex="0">${svg16(ICON.react, "icon_yDAPhH")}</div></span><span><div class="button_yDAPhH button_Z0MHyc" aria-label="Odpowiedz na status" aria-haspopup="dialog" role="button" tabindex="0">${svg16(ICON.reply, "icon_yDAPhH")}</div></span></div></div>`;
  }

  // ---------------------------------------------------------------- display name (+ styles)
  const FONT_CLASS = { default: "", cherryBomb: "cherryBomb_OAgVZM", chicle: "chicle_OAgVZM", museoModerno: "museoModerno_OAgVZM",
    neoCastel: "neoCastel_OAgVZM", pixelify: "pixelify_OAgVZM", sinistre: "sinistre_OAgVZM", zillaSlab: "zillaSlab_OAgVZM",
    playpenSans: "playpenSans_OAgVZM", orbitron: "orbitron_OAgVZM", newRocker: "newRocker_OAgVZM", kalam: "kalam_OAgVZM", pricedown: "pricedown_OAgVZM" };
  const EFFECT_CLASS = { solid: "solid_or4Hj-", gradient: "gradient_or4Hj-", glow: "gradient_or4Hj-", neon: "neon_or4Hj-", toon: "toon_or4Hj-", pop: "pop_or4Hj-", gummy: "gummy_or4Hj-", prism: "prism_or4Hj-" };

  function displayName({ name, variant, style, clickable }) {
    // variant: "heading-xl/semibold" (modal) | "heading-lg/semibold" (popout)
    let inner;
    if (!style || !style.enabled) {
      inner = `<div class="defaultColor_MMUIw6 ${TEXT_VARIANT[variant]} displayName_C2XpHA noStyles_C2XpHA" data-text-variant="${variant}">${esc(name)} </div>`;
    } else {
      const bg = resolveColor("var(--background-base-low)") || "#1a1a1e";
      const { vars, colors } = T.displayNameVars(style.effect, style.colors, { shouldWrap: true, nameLength: [...name].length, background: bg });
      const font = FONT_CLASS[style.font] || "";
      let text = esc(name);
      if (style.effect === "gummy") {
        let idx = 0;
        text = name.split(/(\s+)/).map(word => /^\s+$/.test(word) ? esc(word) : `<span class="gummyWord_or4Hj-">${[...word].map(ch => `<span class="gummyLetter_or4Hj-" style="--custom-letter-index: ${idx}; color: ${colors[idx++ % colors.length]};">${esc(ch)}</span>`).join("")}</span>`).join("");
      }
      inner = `<div class="defaultColor_MMUIw6 ${TEXT_VARIANT[variant]}" data-text-variant="${variant}"><div class="container_or4Hj- dnsFont_OAgVZM${font ? " " + font : ""} displayName_C2XpHA showEffect_or4Hj- animated_or4Hj- loop_or4Hj- inProfile_or4Hj- shouldWrap_or4Hj-" style="${esc(styleAttr(vars))}"><span data-username-with-effects="${esc(name)}" class="innerContainer_or4Hj- ${EFFECT_CLASS[style.effect]}">${text}</span></div></div>`;
    }
    return clickable ? `<div class="clickable_C2XpHA" role="button" tabindex="0">${inner}</div>` : inner;
  }

  // ---------------------------------------------------------------- username row (+ guild tag, badges)
  function guildTag(tag) {
    if (!tag || !tag.text) return "";
    return `<span><span class="chipletContainerInner_k8jyN7 chipletContainerInline_k8jyN7 guildTagPill_C2XpHA clickable_k8jyN7" aria-expanded="false" role="button" tabindex="0"><span class="lineClamp1_MMUIw6 body-xs/normal_RAOoio text_k8jyN7" data-text-variant="body-xs/normal" style="color: var(--text-default);"><img alt="" class="badge_k8jyN7" width="14" height="14" src="${esc(tag.badge)}"><span tag="span" class="hiddenVisually_FX8kaC">Tag serwera: ${esc(tag.text)}</span><span class="tagText_k8jyN7" aria-hidden="true">${esc(tag.text)}</span></span></span></span>`;
  }
  function badges(list, max = 6) {
    if (!list || !list.length) return "";
    const shown = list.slice(0, list.length > max ? max : list.length);
    const more = list.length - shown.length;
    return `<div class="container_IqWmhA managed_IqWmhA" aria-label="Odznaki użytkownika" role="group">${shown.map((b, i) => `<a class="anchor_R6ReNl anchorUnderlineOnHover_R6ReNl" aria-label="${esc(b.label)}" aria-describedby="_r_b${i}_" role="link" tabindex="0"><img alt=" " aria-hidden="true" class="badge_IqWmhA" src="${esc(b.src)}"></a><span id="_r_b${i}_" class="hiddenVisually_FX8kaC">${esc(b.label)}</span>`).join("")}${more > 0 ? `<button type="button" class="overflowSlot_IqWmhA overflowButton_IqWmhA" aria-label="${more} więcej odznak"><span class="body-sm/normal_RAOoio hiddenCount_IqWmhA" aria-hidden="true" data-text-variant="body-sm/normal" style="color: var(--text-default);">+${more}</span></button>` : ""}</div>`;
  }
  // UsernameRow (C): [userTag] [dotSpacer + pronouns] [guild tag pill] [trailing badges]
  function usernameRow({ username, pronouns, tag, badgeList, clickable }) {
    const tagEl = `<div class="info_PTA1Mz userTag_C2XpHA body-sm/normal_RAOoio"><span class="userTagUsername_C2XpHA body-sm/normal_RAOoio">${esc(username)}</span></div>`;
    const pr = pronouns ? `<div aria-hidden="true" class="dotSpacer_C2XpHA"></div><span class="pronounsTooltip_C2XpHA"><div class="pronouns_C2XpHA userTag_C2XpHA body-sm/normal_RAOoio" data-text-variant="body-sm/normal" style="color: var(--text-strong);"><span class="hiddenVisually_FX8kaC">Zaimki: ${esc(pronouns)}</span><span aria-hidden="true">${esc(pronouns)}</span></div></span>` : "";
    return `<div class="usernameAndPronounsRow_C2XpHA${pronouns ? " hasPronouns_C2XpHA" : ""}">${clickable ? `<div class="userTagClickable_C2XpHA clickable_C2XpHA" role="button" tabindex="0">${tagEl}</div>` : tagEl}${pr}${guildTag(tag)}${badges(badgeList)}</div>`;
  }

  // ---------------------------------------------------------------- bio markup (subset of Discord markdown)
  // timestamps <t:unix:style>, formatted like Discord's moment formats (LT, LTS, L, LL, LLL, LLLL, relative)
  const uiLang = () => (global.I18N && global.I18N.lang === "pl" ? "pl" : "en");
  function relativeTime(sec) {
    const pl = uiLang() === "pl", future = sec >= 0, a = Math.abs(sec);
    const plForm = (n, one, few, many) => n === 1 ? one : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? few : many;
    const U = pl
      ? { s: "kilka sekund", m: "minutę", mm: n => `${n} ${plForm(n, "minuta", "minuty", "minut")}`, h: "godzinę", hh: n => `${n} ${plForm(n, "godzina", "godziny", "godzin")}`,
        d: "1 dzień", dd: n => `${n} dni`, M: "miesiąc", MM: n => `${n} ${plForm(n, "miesiąc", "miesiące", "miesięcy")}`, y: "rok", yy: n => `${n} ${plForm(n, "rok", "lata", "lat")}` }
      : { s: "a few seconds", m: "a minute", mm: n => `${n} minutes`, h: "an hour", hh: n => `${n} hours`,
        d: "a day", dd: n => `${n} days`, M: "a month", MM: n => `${n} months`, y: "a year", yy: n => `${n} years` };
    const min = a / 60, hr = min / 60, day = hr / 24, mon = day / 30.4375, yr = day / 365.25;
    const r = Math.round;
    const s = a < 45 ? U.s : a < 90 ? U.m : min < 45 ? U.mm(r(min)) : min < 90 ? U.h : hr < 22 ? U.hh(r(hr))
      : hr < 36 ? U.d : day < 26 ? U.dd(r(day)) : day < 45 ? U.M : day < 320 ? U.MM(Math.max(2, r(mon))) : day < 548 ? U.y : U.yy(Math.max(2, r(yr)));
    return pl ? (future ? `za ${s}` : `${s} temu`) : (future ? `in ${s}` : `${s} ago`);
  }
  function timestamp(unix, style) {
    const d = new Date(unix * 1000);
    if (isNaN(d)) return null;
    const loc = uiLang() === "pl" ? "pl-PL" : "en-US";
    const f = o => new Intl.DateTimeFormat(loc, o).format(d);
    const time = f({ hour: "numeric", minute: "2-digit" }), long = f({ day: "numeric", month: "long", year: "numeric" });
    switch (style) {
      case "t": return time;
      case "T": return f({ hour: "numeric", minute: "2-digit", second: "2-digit" });
      case "d": return f({ day: "2-digit", month: "2-digit", year: "numeric" });
      case "D": return long;
      case "F": return `${f({ weekday: "long" })}, ${long} ${time}`;
      case "R": return relativeTime(unix - Date.now() / 1000);
      default: return `${long} ${time}`;
    }
  }
  // unicode emoji in text become twemoji images, as Discord renders them in markup
  const EMOJI_RE = /\p{RI}\p{RI}|[#*0-9]️?⃣|\p{Extended_Pictographic}(?:️|\p{EMod})?(?:‍\p{Extended_Pictographic}(?:️|\p{EMod})?)*/gu;
  const markupEmoji = e => {
    const cp = [...e].map(c => c.codePointAt(0).toString(16)).filter(h => h !== "fe0f").join("-");
    return `<img aria-label="${e}" src="https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/svg/${cp}.svg" alt="${e}" draggable="false" class="emoji" data-type="emoji">`;
  };
  const SHORTCODES = global.DISCORD_EMOJI || {};
  function bioMarkup(text) {
    const lines = esc(text)
      .replace(/:([\w+-]+):/g, (m, n) => SHORTCODES[n] || m)
      .replace(/&lt;t:(-?\d{1,13})(?::([tTdDfFR]))?&gt;/g, (m, n, st) => { const v = timestamp(+n, st); return v ? `<span class="timestamp_ku1OHH">${esc(v)}</span>` : m; })
      .split("\n");
    const emojify = s => s.split(/(<[^>]+>)/).map(seg => seg[0] === "<" ? seg : seg.replace(EMOJI_RE, markupEmoji)).join("");
    const inline = s => emojify(s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/(^|[^*])\*(?!\s)(.+?)\*/g, "$1<em>$2</em>")
      .replace(/__(.+?)__/g, "<u>$1</u>")
      .replace(/~~(.+?)~~/g, "<s>$1</s>")
      .replace(/`([^`]+)`/g, '<code class="inlineCode_ku1OHH">$1</code>')
      .replace(/(https?:\/\/[^\s<]+)/g, '<a class="anchor_R6ReNl anchorUnderlineOnHover_R6ReNl" href="$1" rel="noreferrer noopener" target="_blank" title="$1" role="link" tabindex="0"><span>$1</span></a>'));
    return lines.map(inline).join("\n");
  }
  function section(title, body, id) {
    return `<section class="section_NcvRRg section_bnpVhc" aria-labelledby="${id}"><div class="headings_NcvRRg"><div class="header_NcvRRg" style="color: var(--text-subtle);"><h2 class="body-xs/medium_RAOoio defaultColor_HtJY5C" id="${id}" data-text-variant="body-xs/medium" style="color: currentcolor;">${esc(title)}</h2></div></div>${body}</section>`;
  }
  const bioSection = text => text ? `<section class="section_NcvRRg section_bnpVhc" aria-labelledby="uid_278"><span class="hiddenVisually_FX8kaC"><h2 id="uid_278">O mnie</h2></span><div class="markup_ku1OHH bio_qjJ3Wv"><div class="defaultColor_MMUIw6 body-sm/normal_RAOoio bioText_qjJ3Wv" data-text-variant="body-sm/normal">${bioMarkup(text)}</div></div></section>` : "";
  // MemberSince (module 743987): plain text, or - when viewed in a server context - Discord icon + date | guild icon + join date
  const CLYDE = '<path fill="currentColor" d="M19.73 4.87a18.2 18.2 0 0 0-4.6-1.44c-.21.4-.4.8-.58 1.21-1.69-.25-3.4-.25-5.1 0-.18-.41-.37-.82-.59-1.2-1.6.27-3.14.75-4.6 1.43A19.04 19.04 0 0 0 .96 17.7a18.43 18.43 0 0 0 5.63 2.87c.46-.62.86-1.28 1.2-1.98-.65-.25-1.29-.55-1.9-.92.17-.12.32-.24.47-.37 3.58 1.7 7.7 1.7 11.28 0l.46.37c-.6.36-1.25.67-1.9.92.35.7.75 1.35 1.2 1.98 2.03-.63 3.94-1.6 5.64-2.87.47-4.87-.78-9.09-3.3-12.83ZM8.3 15.12c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.89 2.27-2 2.27Zm7.4 0c-1.1 0-2-1.02-2-2.27 0-1.24.88-2.26 2-2.26s2.02 1.02 2 2.26c0 1.25-.88 2.27-2 2.27Z" class=""></path>';
  function memberSince(discordDate, guild, id) {
    if (!discordDate) return "";
    const txt = v => `<div class="defaultColor_MMUIw6 body-sm/normal_RAOoio" data-text-variant="body-sm/normal">${esc(v)}</div>`;
    if (!guild || !guild.joined) return section("Członek od", txt(discordDate), id);
    // GuildIcon (SMOL): acronym = Discord's getAcronym, font size from R[SMOL][acronym.length] * textScale(1)
    const acronym = (guild.name || "").replace(/'s /g, " ").replace(/\w+/g, w => w[0]).replace(/\s/g, "");
    const SMOL_FONT = [10, 10, 8, 6, 6, 4];
    const gIcon = guild.icon
      ? `<div class="icon_qqAqr1 guildIcon_EhAvF- iconSizeSmol_qqAqr1 iconInactive_qqAqr1" tabindex="0" aria-describedby="_r_gi_" role="button" style="background-image: url(&quot;${esc(guild.icon)}&quot;);"></div>`
      : `<div class="icon_qqAqr1 guildIcon_EhAvF- iconSizeSmol_qqAqr1 iconInactive_qqAqr1 noIcon_qqAqr1" tabindex="0" aria-describedby="_r_gi_" role="button" style="font-size: ${SMOL_FONT[acronym.length] ?? SMOL_FONT[SMOL_FONT.length - 1]}px;"><div class="acronym_qqAqr1">${esc(acronym)}</div></div>`;
    return section("Członek od", `<div class="memberSinceWrapper_EhAvF-"><div class="memberSince_EhAvF-"><svg class="discordIcon_EhAvF-" aria-describedby="_r_di_" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="none" viewBox="0 0 24 24">${CLYDE}</svg><span id="_r_di_" class="hiddenVisually_FX8kaC">Discord</span>${txt(discordDate)}</div><div class="divider_EhAvF-"></div><div class="memberSince_EhAvF-">${gIcon}<span id="_r_gi_" class="hiddenVisually_FX8kaC">${esc(guild.name)}</span>${txt(guild.joined)}</div></div>`, id);
  }
  const textSection = (title, value, id) => value ? section(title, `<div class="defaultColor_MMUIw6 body-sm/normal_RAOoio" data-text-variant="body-sm/normal">${esc(value)}</div>`, id) : "";

  function connections(list) {
    if (!list || !list.length) return "";
    return section("Połączone konta", `<div class="container_O2KI4e profileAppConnections_s3DB6Y"><ul class="connectionList_O2KI4e">${list.map((c, i) => `<li class="connection_O2KI4e"><div class="platformIconContainer_O2KI4e" aria-describedby="_r_c${i}_"><img alt="Logo ${esc(c.platform)}" class="platformIcon_O2KI4e" src="${esc(c.icon)}"></div><span id="_r_c${i}_" class="hiddenVisually_FX8kaC">${esc(c.platform)}</span><div class="connectionInfo_O2KI4e"><div><a class="anchor_R6ReNl platformUrlAnchor_O2KI4e" aria-label="${esc(c.platform)}, ${esc(c.name)}, Otwórz w przeglądarce" rel="noreferrer noopener" target="_blank" role="link" tabindex="0"><div class="accountName_O2KI4e"><div class="defaultColor_MMUIw6 body-sm/normal_RAOoio accountNameText_O2KI4e" data-text-variant="body-sm/normal">${esc(c.name)}</div><span class="hiddenVisually_FX8kaC">${esc(c.name)}</span>${svg16(ICON.link, "linkIcon_O2KI4e")}</div></a></div><div class="metadata_O2KI4e"></div></div></li>`).join("")}</ul></div>`, "uid_281");
  }

  function noteSection() {
    return section("Notka (widoczna wyłącznie dla Ciebie)", `<div class="container_IEutSJ note_nr7Zul"><div class="root_CJLDJI"><div class="container_VhFsFg" data-layout="vertical" data-disabled="false"><span class="hiddenVisually_FX8kaC"><label class="body-md/medium_RAOoio label_VhFsFg" aria-hidden="false" data-interactive="false" data-text-variant="body-md/medium" style="color: var(--text-strong);">Notka</label></span><div class="control_VhFsFg"><div class="container_CJLDJI body-sm/normal_RAOoio" data-disabled="false" data-padding-block="md" data-padding-inline="md" data-read-only="false"><textarea autocomplete="off" placeholder="Kliknij, aby dodać notkę" maxlength="256" class="input_CJLDJI multiline_CJLDJI field_CJLDJI scrollbarDefault_s8JExU scrollbar_s8JExU" aria-invalid="false" rows="1"></textarea><div aria-hidden="true" class="input_CJLDJI multiline_CJLDJI sizer_CJLDJI placeholderSizer_CJLDJI">Kliknij, aby dodać notkę​</div></div></div></div></div></div>`, "uid_282");
  }

  // ---------------------------------------------------------------- right column (tabs + board)
  // tabs: [{id, label}] ; selected: tab id ; panels rendered for "widgets" (Tablica) and "wishlist" (Lista życzeń)
  function rightColumn({ tabs, selected, board, wishlist, expanded, owner }) {
    const sel = tabs.some(t => t.id === selected) ? selected : tabs[0].id;
    const tabBar = tabs.map(t => { const on = t.id === sel; return `<div class="tabBarItem_y4ZEM5 item_6zZYhF${on ? " selected_6zZYhF" : ""}" role="tab" aria-selected="${on}"${on ? ` aria-controls="${t.id}-tab"` : ""} aria-disabled="false" tabindex="${on ? 0 : -1}" aria-label="${esc(t.label)}" data-tab="${t.id}"><div class="body-sm/semibold_RAOoio itemText_6zZYhF" data-text-variant="body-sm/semibold">${esc(t.label)}</div></div>`; }).join("");
    const label = tabs.find(t => t.id === sel).label;
    const scroller = (extra, body, attrs = "") => `<div class="tabPanelScroller_y4ZEM5${extra} scrollbarGutterStable_tqapBM thin_tqapBM scrollerBase_tqapBM fade_tqapBM" dir="ltr"${attrs} style="overflow: hidden scroll; overflow-anchor: auto; overscroll-behavior: auto;">${body}</div>`;
    let body;
    if (sel === "wishlist") body = scroller(wishlist && wishlist.length ? " scroller_AI9GeR" : "", wishlistPanel(wishlist || []));
    else if (sel === "widgets") body = scroller(" scroller_9onezO", boardPanel(board || [], expanded, owner), ' data-scroller="true"');
    else body = scroller("", "");
    return `<div class="container_y4ZEM5"><div class="tabListScroller_y4ZEM5 thin_tqapBM scrollerBase_tqapBM fade_tqapBM" dir="ltr" style="overflow: scroll hidden;"><div class="top_6zZYhF" role="tablist" aria-orientation="horizontal">${tabBar}</div></div><div aria-label="${esc(label)}" class="tabBarPanel_y4ZEM5" role="tabpanel" id="${sel}-tab" tabindex="-1"><span class="hiddenVisually_FX8kaC"><h2>${esc(label)}</h2></span>${body}</div></div>`;
  }

  // ---------------------------------------------------------------- Board (Tablica): game widgets
  // widget types (module 540185): title, max games, layout; collapsed view shows `shown` items + "Pokaż więcej"
  const WIDGETS = {
    favorite_games: { title: "Ulubiona gra", max: 1, layout: "card", shown: 1 },
    current_games: { title: "Gry w rotacji", max: 5, layout: "cards", shown: 2 },
    want_to_play_games: { title: "Chcę zagrać", max: 20, layout: "grid", shown: 8 },
    played_games: { title: "Gry, które lubię", max: 20, layout: "grid", shown: 8 },
  };
  // game tags (module 126601 groups, module 394245 tag -> {getText, icon})
  const TAG_ICON = {
    ribbon: '<path fill="var(--interactive-icon-default)" d="M10.89 11.79A3 3 0 1 0 13.1 6.2a3 3 0 0 0-2.22 5.58Z" class=""></path><path fill="var(--interactive-icon-default)" fill-rule="evenodd" d="M11.91 16.43a.66.66 0 0 0-.16.08 3.16 3.16 0 0 1-2.85.27 3.14 3.14 0 0 1-1.88-2.16.67.67 0 0 0-.5-.49A3.14 3.14 0 0 1 4.5 9.45a.67.67 0 0 0 0-.7 3.14 3.14 0 0 1 1.88-4.73.67.67 0 0 0 .49-.5 3.14 3.14 0 0 1 4.68-2.02c.22.13.5.13.7 0a3.14 3.14 0 0 1 4.73 1.88c.07.24.26.44.5.49a3.14 3.14 0 0 1 2.02 4.68.67.67 0 0 0 0 .7 3.14 3.14 0 0 1-1.88 4.73.67.67 0 0 0-.49.5 3.14 3.14 0 0 1-4.68 2.02.66.66 0 0 0-.54-.07Zm-1.76-2.79a5 5 0 1 0 3.7-9.28 5 5 0 0 0-3.7 9.28Z" clip-rule="evenodd" class=""></path><path fill="var(--interactive-icon-default)" d="M12.11 17.46a4.13 4.13 0 0 1-5.35-1.1l-.57 5.5a1 1 0 0 0 1.47.99l4.1-2.22a.5.5 0 0 1 .48 0l4.1 2.22a1 1 0 0 0 1.47-.98l-.56-5.42a4.12 4.12 0 0 1-5.14 1Z" class=""></path>',
    thumbsUp: '<path fill="var(--interactive-icon-default)" d="M15 5a3 3 0 0 0-3-3 1 1 0 0 0-1 1v2a3 3 0 0 1-.19 1.05L6.55 8.93a7.9 7.9 0 0 0-3.26 8.4c.43 1.77 1.44 3.42 3.14 4.07.86.34 1.89.6 2.95.6h8.03a2.09 2.09 0 0 0 1.93-2.88l-.4-.97a.2.2 0 0 1 .08-.24l.54-.33a1.99 1.99 0 0 0 .8-2.44l-.43-1.02a.25.25 0 0 1 .03-.23l.6-.9a1.92 1.92 0 0 0-1.6-2.99h-5.39A8 8 0 0 0 15 5.44V5Z" class=""></path>',
    thumbsDown: '<path fill="var(--interactive-icon-default)" d="M9 19a3 3 0 0 0 3 3 1 1 0 0 0 1-1v-2a3 3 0 0 1 .19-1.05l4.26-2.88a7.9 7.9 0 0 0 3.26-8.4c-.43-1.77-1.44-3.42-3.14-4.07a8.3 8.3 0 0 0-2.95-.6H6.59a2.09 2.09 0 0 0-1.93 2.88l.4.97a.2.2 0 0 1-.08.24l-.54.33a1.99 1.99 0 0 0-.8 2.44l.43 1.02c.03.07.02.16-.03.23l-.6.9A1.92 1.92 0 0 0 5.04 14h5.39A8 8 0 0 0 9 18.56V19Z" class=""></path>',
    friends: '<path fill="var(--interactive-icon-default)" d="M13 10a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" class=""></path><path fill="var(--interactive-icon-default)" d="M3 5v-.75C3 3.56 3.56 3 4.25 3s1.24.56 1.33 1.25C6.12 8.65 9.46 12 13 12h1a8 8 0 0 1 8 8 2 2 0 0 1-2 2 .21.21 0 0 1-.2-.15 7.65 7.65 0 0 0-1.32-2.3c-.15-.2-.42-.06-.39.17l.25 2c.02.15-.1.28-.25.28H9a2 2 0 0 1-2-2v-2.22c0-1.57-.67-3.05-1.53-4.37A15.85 15.85 0 0 1 3 5Z" class=""></path>',
  };
  const TAG_GROUPS = [
    { id: "skill_level", label: "Poziom umiejętności", radio: true, tags: [["casual", "Casualowe", "ribbon"], ["intermediate", "Średnie", "ribbon"], ["expert", "Ekspert", "ribbon"], ["better_than_you", "Lepszy od ciebie", "ribbon"]] },
    { id: "rating", label: "Ocena", tags: [["obsessed", "Uwielbiam", "thumbsUp"], ["love_it", "Uwielbiam to", "thumbsUp"], ["kind_of_love_it", "Trochę mi się podoba", "thumbsUp"], ["kind_of_hate_it", "Trochę tego nienawidzę", "thumbsDown"], ["rage_quitting", "Wyjście z frustracji", "thumbsDown"]] },
    { id: "looking_for", label: "Szukam", tags: [["looking_for_group", "Szukam grupy", "friends"], ["open_to_play", "Chętny do gry", "friends"], ["looking_for_tips", "Szukam wskazówek", "friends"], ["open_to_teach", "Otwórz, aby uczyć", "friends"], ["looking_to_discuss", "Chcę rozmawiać", "friends"]] },
  ];
  const TAGS = Object.fromEntries(TAG_GROUPS.flatMap(g => g.tags.map(([id, text, icon]) => [id, { text, icon }])));
  const svgN = (n, body, cls = "") => `<svg${cls ? ` class="${cls}"` : ""} aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="${n}" height="${n}" fill="none" viewBox="0 0 24 24">${body}</svg>`;
  const QUOTE = '<path fill="var(--icon-muted)" d="M2.35 19.44A4.75 4.75 0 0 0 6.07 21c1.43 0 2.58-.43 3.44-1.3.9-.9 1.35-2.06 1.35-3.5 0-1.43-.43-2.58-1.3-3.45a4.63 4.63 0 0 0-3.5-1.34c.6-1.6 1.99-3.1 4.16-4.49a.8.8 0 0 0 .1-1.3l-2.68-2.2a.76.76 0 0 0-.98 0C2.89 6.78 1 10.64 1 15.02c0 1.9.45 3.38 1.35 4.42ZM14.16 19.44A4.75 4.75 0 0 0 17.88 21c1.43 0 2.58-.43 3.45-1.3.9-.9 1.34-2.06 1.34-3.5 0-1.43-.43-2.58-1.3-3.45a4.63 4.63 0 0 0-3.5-1.34c.6-1.6 1.99-3.1 4.16-4.49a.8.8 0 0 0 .1-1.3l-2.68-2.2a.76.76 0 0 0-.98 0c-3.77 3.36-5.66 7.22-5.66 11.6 0 1.9.45 3.38 1.35 4.42Z" class=""></path>';
  const CHEVRON_LEFT = '<path fill="currentColor" d="M14.7 5.3a1 1 0 0 1 0 1.4L9.42 12l5.3 5.3a1 1 0 0 1-1.42 1.4l-6-6a1 1 0 0 1 0-1.4l6-6a1 1 0 0 1 1.42 0Z" class=""></path>';

  // GameCover (module 788593) -> CoverArt COMPACT (module 459746 FQ): cover image | icon on blurred backdrop | name text
  function gameCover(g) {
    const name = esc(g.name);
    let art, hasArt = true;
    if (g.src) art = `<span class="cover_JeyAv- widgetArtwork_R0hw0B gameCoverImage_R0hw0B"><img alt="${name}" draggable="false" class="image_JeyAv-" src="${esc(g.src)}"></span>`;
    else if (g.icon) art = `<div class="iconFallback_JeyAv- widgetArtwork_R0hw0B"><span class="backdrop_JeyAv-" aria-hidden="true"><img alt="" draggable="false" class="backdropImage_JeyAv-" src="${esc(g.icon)}"></span><span class="icon_JeyAv- gameCoverImage_R0hw0B"><img alt="${name}" draggable="false" class="image_JeyAv-" src="${esc(g.icon)}"></span></div>`;
    else { hasArt = false; art = `<div role="img" aria-label="${name}" class="compactFallback_JeyAv- widgetArtwork_R0hw0B gameCoverImage_R0hw0B"><div class="lineClamp2Plus_MMUIw6 defaultColor_MMUIw6 footnote/medium_RAOoio" aria-hidden="true" data-text-variant="footnote/medium" style="-webkit-line-clamp: 3;">${name}</div></div>`; }
    return `<div class="clickable_R0hw0B coverContainer_R0hw0B gameCover_R0hw0B profileWidgetCover_R0hw0B${hasArt ? " hoverActiveEffect_R0hw0B" : ""}" aria-label="${name}, wyświetl profil gry" role="button" tabindex="0">${art}</div>`;
  }
  // tag list (module 132085 k); overflow ("+N") is measured after render by DiscordTemplates.layoutTags
  function tagList(tags) {
    const list = (tags || []).filter(t => TAGS[t]);
    if (!list.length) return "";
    return `<div class="tagListContainer_tqx5FD tags_2y0Mhw"><ul class="tagList_tqx5FD" aria-label="Tagi gry">${list.map(t => `<li class="tag_E5LDT0">${svgN(12, TAG_ICON[TAGS[t].icon])}<div class="footnote/medium_RAOoio" data-text-variant="footnote/medium" style="color: var(--text-subtle);">${esc(TAGS[t].text)}</div></li>`).join("")}</ul></div>`;
  }
  // GameDetailsCard (module 132085 z): cover | name, comment ("{name} mówi:"), tags
  function gameCard(g, owner, uid) {
    const comment = g.comment && g.comment.trim()
      ? `<div role="group" aria-labelledby="${uid}"><svg class="commentIcon_2y0Mhw" aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="12" height="12" fill="none" viewBox="0 0 24 24">${QUOTE}</svg><span id="${uid}" class="hiddenVisually_FX8kaC">${esc(owner)} mówi:</span><div class="body-sm/normal_RAOoio" data-text-variant="body-sm/normal" style="color: var(--text-muted);">${esc(g.comment)}</div></div>` : "";
    return `<div class="card_2y0Mhw gameWidgetGrid_--V09L">${gameCover(g)}<div class="details_2y0Mhw"><h4 class="heading-xs/medium_RAOoio defaultColor_HtJY5C" data-text-variant="heading-xs/medium" style="color: var(--text-default);"><div class="clickableText_2y0Mhw" role="button" tabindex="0">${esc(g.name)}</div></h4>${comment}${tagList(g.tags)}</div></div>`;
  }
  // board: [{type, games}] ; expanded: Set of widget indexes showing all games ; owner: display name for comments
  function boardPanel(board, expanded = new Set(), owner = "") {
    return board.map((w, wi) => {
      const spec = WIDGETS[w.type] || WIDGETS.want_to_play_games;
      const games = (w.games || []).slice(0, spec.max);
      if (!games.length) return ""; // empty widgets are hidden on the profile
      const open = expanded.has(wi), more = games.length > spec.shown;
      const shown = open || !more ? games : games.slice(0, spec.shown);
      let body;
      if (spec.layout === "card") body = gameCard(shown[0], owner, `uid_c${wi}_0`);
      else if (spec.layout === "cards") body = `<ul class="cardList_JPOF3d">${shown.map((g, gi) => `<li>${gameCard(g, owner, `uid_c${wi}_${gi}`)}</li>`).join("")}</ul>`;
      else body = `<ul class="grid_W5z7fj gameWidgetGrid_--V09L">${shown.map(g => `<li><div class="container_I0Hvcn">${gameCover(g)}</div></li>`).join("")}</ul>`;
      const toggle = more ? `<div class="button_zNz-f1" aria-expanded="${open}" role="button" tabindex="0" data-expand="${wi}"><div class="body-sm/medium_RAOoio" data-text-variant="body-sm/medium">${open ? "Pokaż mniej" : "Pokaż więcej"}</div></div>` : "";
      return `<section aria-labelledby="uid_w${wi}"><div class="container_FNEkcu"><div class="headerRow_ltNcM4"><div class="title_ltNcM4"><h3 class="heading-xs/medium_RAOoio defaultColor_HtJY5C" id="uid_w${wi}" data-text-variant="heading-xs/medium" style="color: var(--text-default);">${esc(spec.title)}</h3></div><div class="actions_ltNcM4"><div class="button_rOupvJ menuButton_ltNcM4" aria-expanded="false" aria-label="Działania widgetu" role="button" tabindex="0">${svgN(18, ICON.more)}</div></div></div>${body}${toggle}</div></section>`;
    }).join("");
  }
  // tag overflow, Discord's measurement (module 132085 G): row 1 = 296px, row 2 = 296 - button - 4.
  // Discord measures once on mount, before the "+N" button exists, so the button width is 0 there too.
  const tagsExpanded = new Set();
  function layoutTags(root) {
    root.querySelectorAll(".tagListContainer_tqx5FD").forEach((box, bi) => {
      const lis = [...box.querySelectorAll("li")];
      const key = (box.closest("section")?.getAttribute("aria-labelledby") || "") + ":" + bi;
      let d = 0, o = 0;
      for (; d < lis.length; d++) { if ((o += lis[d].offsetWidth + 4) > 296) break; }
      o = 0;
      for (let i = d; i < lis.length; i++) { if ((o += lis[i].offsetWidth + 4) > 296 - 0 - 0 - 4) break; d++; }
      const over = lis.length - d;
      if (over <= 0) return;
      const open = tagsExpanded.has(key);
      if (!open) lis.slice(d).forEach(li => li.remove());
      const b = document.createElement("div");
      b.className = open ? "collapseButton_tqx5FD tag_E5LDT0 button_E5LDT0" : "expandButton_tqx5FD tag_E5LDT0 button_E5LDT0";
      b.setAttribute("aria-label", open ? "Zwiń tagi gry" : `+ dodatkowo ${over}`);
      b.setAttribute("role", "button"); b.tabIndex = 0; b.dataset.tagsToggle = key;
      b.innerHTML = open ? svgN(12, CHEVRON_LEFT, "caret_tqx5FD") : `<div class="footnote/medium_RAOoio" data-text-variant="footnote/medium">+${over}</div>`;
      box.appendChild(b);
    });
  }
  const toggleTags = key => { tagsExpanded.has(key) ? tagsExpanded.delete(key) : tagsExpanded.add(key); };

  // Wishlist (module 717086: uC -> uy header + oX grid of aQ cards; empty -> ub)
  const WISHLIST_PLACEHOLDER_AVATAR = "assets/d11a9f2f62494f22.png"; // module 476324
  const EFFECT_PREVIEW_BG = "https://cdn.discordapp.com/assets/content/3e995a411944311d4d318143819ce2d6623bb74c0fc162d6726e0377c3c31a4f.png";
  // card (module 717086 aQ): container_K8U7Ed > 133px card; decoration preview uses the shop's static asset
  function wishlistCard(item) {
    let preview = "";
    if (item.type === "decoration") {
      preview = `<div class="wrapper_XpIUHy avatar_yvwYgE" role="img" aria-label="Podgląd dekoracji awatara: ${esc(item.label)}" aria-hidden="false" style="width: 80px; height: 80px;"><svg width="80" height="80" viewBox="0 0 80 80" class="mask_XpIUHy svg_XpIUHy" aria-hidden="true"><foreignObject x="0" y="0" width="80" height="80" mask="url(#svg-mask-avatar-default)"><div class="avatarStack_XpIUHy"><img alt=" " class="avatar_XpIUHy" aria-hidden="true" src="${WISHLIST_PLACEHOLDER_AVATAR}"></div></foreignObject></svg><svg width="96" height="96" viewBox="0 0 96 96" class="avatarDecorationContainer_XpIUHy" aria-hidden="true"><foreignObject x="0" y="0" width="96" height="96"><img class="avatarDecoration_XpIUHy" alt=" " aria-hidden="true" src="${esc(item.src)}"></foreignObject></svg></div>`;
    } else if (item.type === "effect") {
      preview = `<div class="profileEffectPreview_S0jKZK"><div class="previewContainer_lG0NAh hideBackground_lG0NAh"><img alt="" class="preview_lG0NAh" aria-hidden="true" draggable="false" src="${EFFECT_PREVIEW_BG}"><div class="profileEffects_ZjcCyW" aria-label="Podgląd efektu profilu: ${esc(item.label || item.name)}" role="img"><div class="inner_ZjcCyW"><img class="effect_ZjcCyW" alt="" aria-hidden="true" src="${esc(item.src)}" style="top: 0px;"></div></div></div></div>`;
    }
    const title = `${item.name}: ${item.type === "decoration" ? "dekoracja awatara" : "efekt profilu"}`;
    return `<li><div class="container_K8U7Ed"><div class="card_D1PiH5 card_K8U7Ed" style="width: 133px; height: 133px;"><div class="focusTarget_EEwkB0" aria-label="${esc(title)}" role="button" tabindex="0"></div><span class="hiddenVisually_FX8kaC"><h3>${esc(title)}</h3></span><div class="skuPreview_D1PiH5 skuPreview_K8U7Ed">${preview}</div></div></div></li>`;
  }
  const CHEVRON_DOWN = '<path fill="currentColor" d="M5.3 9.3a1 1 0 0 1 1.4 0l5.3 5.29 5.3-5.3a1 1 0 1 1 1.4 1.42l-6 6a1 1 0 0 1-1.4 0l-6-6a1 1 0 0 1 0-1.42Z" class=""></path>';
  function wishlistPanel(items) {
    if (!items.length) {
      return `<div class="emptyStateContainer_AI9GeR"><div class="emptyStateText_AI9GeR"><h3 class="heading-sm/medium_RAOoio defaultColor_HtJY5C" data-text-variant="heading-sm/medium" style="color: var(--text-strong);">Nie ma jeszcze serduszek 💔</h3><div class="body-sm/normal_RAOoio" data-text-variant="body-sm/normal" style="color: var(--text-default);">Przeglądaj sklep i polub przedmioty, które Ci się podobają, aby dodać je tutaj.</div></div></div>`;
    }
    const n = items.length;
    const count = n === 1 ? "1 przedmiot" : (n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20)) ? `${n} przedmioty` : `${n} przedmiotów`;
    return `<div class="headerRow_AI9GeR"><div class="body-xs/semibold_RAOoio" data-text-variant="body-xs/semibold" style="color: var(--text-subtle);">${count}</div>${button({ variant: "secondary", label: "Przeglądaj sklep", trail: CHEVRON_DOWN, extra: ' aria-expanded="false"' })}</div><ul class="grid_wsmVvi">${items.map(wishlistCard).join("")}</ul>`;
  }

  // ---------------------------------------------------------------- profile effect layer
  const profileEffect = label => `<div class="profileEffects_ZjcCyW" aria-label="${esc(label)}" role="img"><div class="inner_ZjcCyW"></div></div>`;

  // ---------------------------------------------------------------- root wrappers
  // client theme -> classes Discord puts on themed containers (observed: "theme-dark theme-darker", "theme-dark theme-midnight")
  const CLIENT_THEME = { dark: "theme-dark", darker: "theme-dark theme-darker", midnight: "theme-dark theme-midnight", light: "theme-light" };
  let clientTheme = "darker";
  function themeClasses(theme) {
    // profile custom theme decides dark/light; otherwise the client theme is inherited
    if (theme == null) theme = clientTheme === "light" ? "light" : "dark";
    if (theme === "light") return "theme-light images-light";
    return `${clientTheme === "light" ? "theme-dark" : CLIENT_THEME[clientTheme]} images-dark`;
  }
  // profileThemeClassName: custom-theme-background + custom-user-profile-theme (+ synced flag) when colours are set
  const customCls = th => th.theme == null ? "" : " custom-theme-background custom-user-profile-theme" + (th.synced ? " profile-theme-synced-with-user-theme" : "");
  function setClientTheme(t) { clientTheme = CLIENT_THEME[t] ? t : "darker"; }

  function modal(p) {
    const themed = p.theme.theme != null;
    const rootCls = `outer_P1YEjQ ${themeClasses(p.theme.theme)} user-profile-modal-v2${customCls(p.theme)} outer_ZhNJfE profileContentOuter_s3DB6Y`;
    const st = esc(styleAttr(p.theme.style));
    return `<div class="root_ZhNJfE root__KoJTP small__KoJTP" role="dialog" tabindex="-1" aria-modal="true"><div class=""><div class="layoutContainer_s3DB6Y">`
      + `<div class="${themeClasses(p.theme.theme)}${customCls(p.theme)}" style="${st}"><div class="modalHeaderButtons_ZhNJfE">${button({ aria: "Zamknij", icon: ICON.close })}<span class="hiddenVisually_FX8kaC"><h1>Pełny profil użytkownika</h1></span></div></div>`
      + `<div class="${rootCls}" style="${st}"><div class="inner_P1YEjQ profileContentInner_s3DB6Y"><div class="profileCardToastContainer_s3DB6Y"></div><div class="scrim_cNDDnH"></div><div class="profileContentColumns_s3DB6Y"><main class="profile_s3DB6Y" aria-busy="false">`
      + `<div class="profileHeader_s3DB6Y"><div class="profileHeaderBannerContainer_s3DB6Y">${banner({ height: 140, radius: 68, cx: 92, cy: "calc(100% - 0px)", image: p.bannerImage, color: p.bannerColor })}</div>`
      + avatar({ size: 120, src: p.avatar, status: p.status, name: p.username, decorationSrc: p.decoration(240), clickableLabel: "Wyświetl zdjęcie profilowe" })
      + customStatus({ text: p.statusText, emoji: p.statusEmoji, name: p.displayName })
      + `</div><div class="profileBody_s3DB6Y scrollbarGutterStable_tqapBM thin_tqapBM scrollerBase_tqapBM fade_tqapBM" dir="ltr" style="overflow: hidden scroll;"><div><div><div class="displayNameRow_C2XpHA lg_C2XpHA">${displayName({ name: p.displayName, variant: "heading-xl/semibold", style: p.nameStyle })}</div>${usernameRow({ username: p.username, pronouns: p.pronouns, tag: p.guildTag, badgeList: p.badges })}</div><div></div></div>`
      + `<div class="profileButtons_s3DB6Y">${button({ variant: "primary", label: "Wiadomość", icon: ICON.message })}<span>${button({ aria: "Znajomy", icon: ICON.friend, extra: ' aria-expanded="false"' })}</span><span>${button({ aria: "Więcej", icon: ICON.more, extra: ' aria-expanded="false"' })}</span></div>`
      + bioSection(p.bio) + memberSince(p.memberSince, p.guildContext, "uid_279") + textSection("Znajomi od", p.friendsSince, "uid_280")
      + connections(p.connections) + (p.showNote ? noteSection() : "")
      + `</div>${p.effect ? profileEffect(p.effect.label) : ""}</main>${p.rightColumn ? rightColumn(p.rightColumn) : ""}</div></div></div></div></div></div>`;
  }

  function popout(p) {
    const themed = p.theme.theme != null;
    const cls = `outer_P1YEjQ ${themeClasses(p.theme.theme)} user-profile-popout${customCls(p.theme)} themeContainer_NOlkhE`;
    return `<div class="${cls}" style="${esc(styleAttr(p.theme.style))}"><div class="inner_P1YEjQ">`
      + `<div class="wrapper_xpwejc"><span><div class="bannerButton_C4gRrZ" aria-label="Dodaj znajomego" aria-disabled="false" aria-busy="false" role="button" tabindex="0"><svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">${ICON.addFriend}</svg></div></span><div class="overflowButtonContainer_3gdX7C"><div><span><div class="bannerButton_C4gRrZ" aria-label="Więcej" aria-disabled="false" aria-busy="false" aria-expanded="false" role="button" tabindex="0"><svg aria-hidden="true" role="img" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24">${ICON.more}</svg></div></span></div></div></div>`
      + `<div class="header_NOlkhE">${banner({ height: 105, radius: 46, cx: 56, cy: "calc(100% - 4px)", image: p.bannerImage, color: p.bannerColor })}`
      + avatar({ size: 80, src: p.avatar, status: p.status, name: p.username, decorationSrc: p.decoration(160), clickableLabel: "Wyświetl pełny profil" })
      + customStatus({ text: p.statusText, emoji: p.statusEmoji, name: p.displayName })
      + `</div><div class="body_NOlkhE scrollbarGutterStable_tqapBM thin_tqapBM scrollerBase_tqapBM fade_tqapBM" dir="ltr" style="overflow: hidden scroll;"><div><div class="displayNameRow_C2XpHA">${displayName({ name: p.displayName, variant: "heading-lg/semibold", style: p.nameStyle, clickable: true })}<div class="displayNameTrailing_C2XpHA"><span><div class="button_AMrbh3" aria-label="Dodaj notkę (widoczną tylko dla Ciebie)" role="button" tabindex="0">${svg16(ICON.note)}</div></span></div></div>${usernameRow({ username: p.username, pronouns: p.pronouns, tag: p.guildTag, badgeList: p.badges, clickable: true })}</div>`
      + bioSection(p.bio) + memberSince(p.memberSince, p.guildContext, "uid_p279")
      + `</div><div class="footer_NOlkhE"></div></div>${p.effect ? profileEffect(p.effect.label) : ""}</div>`;
  }

  function masks() {
    // static masks copied from the live client + size-specific masks generated with Discord's own formulas
    // container exactly as Discord renders it (Masks component): 1x1 viewBox so "100%" in mask rects resolves to 1
    return `<svg viewBox="0 0 1 1" style="position: absolute; pointer-events: none; top: -1px; left: -1px; width: 1px; height: 1px;" aria-hidden="true"><defs>`
      + `<mask id="svg-mask-avatar-default" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle></mask>`
      + `<mask id="svg-mask-status-online" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle></mask>`
      + `<mask id="svg-mask-status-idle" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="0.25" cy="0.25" r="0.375"></circle></mask>`
      + `<mask id="svg-mask-status-dnd" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><rect fill="black" x="0.125" y="0.375" width="0.75" height="0.25" rx="0.125" ry="0.125"></rect></mask>`
      + `<mask id="svg-mask-status-offline" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><circle fill="black" cx="0.5" cy="0.5" r="0.25"></circle></mask>`
      + `<mask id="svg-mask-status-streaming" maskContentUnits="objectBoundingBox" viewBox="0 0 1 1"><circle fill="white" cx="0.5" cy="0.5" r="0.5"></circle><polygon fill="black" points="0.35,0.25 0.78301275,0.5 0.35,0.75"></polygon></mask>`
      + T.avatarStatusMask(80) + T.avatarStatusMask(120) + T.decorationStatusMask(80) + T.decorationStatusMask(120)
      + `</defs></svg>`;
  }

  global.DiscordTemplates = { modal, popout, masks, esc, STATUS_LABEL, CLIENT_THEME, setClientTheme, WIDGETS, TAG_GROUPS, TAGS, layoutTags, toggleTags };
})(window);
