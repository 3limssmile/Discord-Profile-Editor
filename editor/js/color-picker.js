/* Colour picker for every <input type="color"> in the editor, so it looks the same in every browser (Firefox opens the
   OS dialog, which has no hex field). Layout follows Discord's custom colour picker (module 374190 "customColorPicker",
   react-color saturation + hue, then a "#" hex input with an eyedropper where the browser supports it).
   The native input stays the value holder: picking sets .value and dispatches input/change like the native picker. */
(function () {
  "use strict";
  const t = s => (window.I18N ? I18N.t(s) : s);
  let pop = null, target = null, hsv = { h: 0, s: 0, v: 0 };

  const clamp = (x, a, b) => Math.min(b, Math.max(a, x));
  function hexToHsv(hex) {
    const n = parseInt(hex.slice(1), 16), r = (n >> 16 & 255) / 255, g = (n >> 8 & 255) / 255, b = (n & 255) / 255;
    const max = Math.max(r, g, b), d = max - Math.min(r, g, b);
    let h = 0;
    if (d) h = max === r ? ((g - b) / d) % 6 : max === g ? (b - r) / d + 2 : (r - g) / d + 4;
    return { h: (h * 60 + 360) % 360, s: max ? d / max : 0, v: max };
  }
  function hsvToHex({ h, s, v }) {
    const f = n => { const k = (n + h / 60) % 6; return Math.round(255 * (v - v * s * Math.max(0, Math.min(k, 4 - k, 1)))); };
    return "#" + [f(5), f(3), f(1)].map(x => x.toString(16).padStart(2, "0")).join("");
  }

  function build() {
    pop = document.createElement("div");
    pop.className = "customColorPicker_BorJ2C dpe-picker";
    pop.setAttribute("role", "dialog");
    pop.setAttribute("aria-label", t("Wybierz kolor"));
    pop.innerHTML = `<div class="dpe-sat"><div class="dpe-sat-white"></div><div class="dpe-sat-black"></div><div class="dpe-sat-ptr"></div></div>
      <div class="dpe-hue"><div class="dpe-hue-ptr"></div></div>
      <div class="customColorPickerInputContainer_BorJ2C"><label class="dpe-hex"><span aria-hidden="true">#</span><input maxlength="6" spellcheck="false" aria-label="Hex"></label>${
        window.EyeDropper ? `<button type="button" class="customColorPickerEyeDropper_BorJ2C dpe-drop" aria-label="${t("Pipeta")}"><svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="m15.93 3.04-1.82 1.83-.58-.58a2.74 2.74 0 0 0-3.87 0l-.78.78a.69.69 0 0 0 0 .97l9.08 9.08c.27.27.7.27.97 0l.78-.78a2.74 2.74 0 0 0 0-3.87l-.58-.58 1.83-1.82a3.55 3.55 0 0 0-5.03-5.03ZM9.58 9.85a.91.91 0 0 1 1.29 0l3.28 3.28c.35.36.35.94 0 1.3l-4.42 4.4a4.57 4.57 0 0 1-2.47 1.28 1.5 1.5 0 0 0-1 .75 2.28 2.28 0 1 1-3.12-3.12c.37-.22.68-.58.75-1 .16-.93.6-1.8 1.28-2.47l4.4-4.42Z"/></svg></button>` : ""}</div>`;
    document.body.appendChild(pop);
    drag(pop.querySelector(".dpe-sat"), (x, y) => { hsv.s = x; hsv.v = 1 - y; });
    drag(pop.querySelector(".dpe-hue"), x => { hsv.h = x * 359.99; });
    const hex = pop.querySelector(".dpe-hex input");
    hex.addEventListener("input", () => {
      const v = hex.value.replace(/[^0-9a-f]/gi, "");
      const full = v.length === 3 ? v.split("").map(c => c + c).join("") : v;
      if (full.length === 6) { hsv = hexToHsv("#" + full); commit(false); }
    });
    hex.addEventListener("keydown", e => { if (e.key === "Enter") close(); });
    const drop = pop.querySelector(".dpe-drop");
    if (drop) drop.addEventListener("click", async () => { try { const { sRGBHex } = await new EyeDropper().open(); hsv = hexToHsv(sRGBHex); commit(); } catch (e) { } });
  }
  function drag(el, set) {
    const move = e => {
      const r = el.getBoundingClientRect(), p = e.touches ? e.touches[0] : e;
      set(clamp((p.clientX - r.left) / r.width, 0, 1), clamp((p.clientY - r.top) / r.height, 0, 1));
      commit();
    };
    el.addEventListener("pointerdown", e => {
      e.preventDefault(); el.setPointerCapture(e.pointerId); move(e);
      const up = () => { el.removeEventListener("pointermove", move); el.removeEventListener("pointerup", up); fire("change"); };
      el.addEventListener("pointermove", move); el.addEventListener("pointerup", up);
    });
  }
  function paint(updateHex = true) {
    const hex = hsvToHex(hsv);
    pop.querySelector(".dpe-sat").style.background = hsvToHex({ h: hsv.h, s: 1, v: 1 });
    Object.assign(pop.querySelector(".dpe-sat-ptr").style, { left: hsv.s * 100 + "%", top: (1 - hsv.v) * 100 + "%" });
    pop.querySelector(".dpe-hue-ptr").style.left = hsv.h / 360 * 100 + "%";
    if (updateHex) pop.querySelector(".dpe-hex input").value = hex.slice(1).toUpperCase();
    return hex;
  }
  const fire = type => target && target.dispatchEvent(new Event(type, { bubbles: true }));
  function commit(updateHex = true) {
    if (!target) return;
    target.value = paint(updateHex);
    fire("input");
  }
  function open(input) {
    if (!pop) build();
    target = input;
    hsv = hexToHsv(input.value || "#000000");
    paint();
    pop.hidden = false;
    const r = input.getBoundingClientRect(), w = pop.offsetWidth, h = pop.offsetHeight;
    let left = r.left, top = r.bottom + 8;
    if (top + h > innerHeight - 8) top = Math.max(8, r.top - h - 8);
    left = clamp(left, 8, innerWidth - w - 8);
    Object.assign(pop.style, { left: left + "px", top: top + "px" });
    pop.querySelector(".dpe-hex input").focus({ preventScroll: true });
  }
  function close() {
    if (!pop || pop.hidden) return;
    pop.hidden = true;
    const t0 = target; target = null;
    if (t0) { t0.dispatchEvent(new Event("change", { bubbles: true })); t0.focus({ preventScroll: true }); }
  }

  document.addEventListener("click", e => {
    const inp = e.target.closest && e.target.closest('input[type="color"]');
    if (inp) { e.preventDefault(); if (target === inp && !pop.hidden) close(); else open(inp); return; }
    if (pop && !pop.hidden && !pop.contains(e.target)) close();
  }, true);
  document.addEventListener("keydown", e => {
    const inp = e.target.closest && e.target.closest('input[type="color"]');
    if (inp && (e.key === "Enter" || e.key === " ")) { e.preventDefault(); open(inp); }
    if (e.key === "Escape") close();
  }, true);
  // scrolling the panel would leave the popover floating away from its input
  document.addEventListener("scroll", e => { const sc = e.target === document ? document.documentElement : e.target; if (pop && !pop.hidden && target && sc.contains && sc.contains(target)) close(); }, true);
})();
