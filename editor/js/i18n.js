/* UI language (pl / en). The editor is written in Polish; this layer translates the rendered DOM (text nodes and
   aria-label / placeholder / title / alt attributes) by exact match, so user content is left alone.
   Strings of Discord's own profile UI use Discord's en-US translations (same intl keys as the Polish client). */
(function (global) {
  "use strict";
  const LANGS = { pl: "Polski", en: "English" };
  let lang;
  try { lang = localStorage.getItem("dpe-lang"); } catch (e) { }
  if (!LANGS[lang]) lang = "en"; // English by default; the choice in the language menu is remembered
  document.documentElement.lang = lang;

  const EN = {
    // ---- Discord profile UI (Discord's en-US strings)
    "Członek od": "Member Since", "Członek Discorda od": "Discord Member Since", "Połączone konta": "Connected Accounts",
    "Notka": "Note", "Notka (widoczna wyłącznie dla Ciebie)": "Note (only visible to you)", "Kliknij, aby dodać notkę": "Click to add a note",
    "Kliknij, aby dodać notkę​": "Click to add a note​", "Dodaj notkę (widoczną tylko dla Ciebie)": "Add Note (only visible to you)",
    "Wiadomość": "Message", "Znajomy": "Friend", "Więcej": "More", "Dodaj znajomego": "Add Friend", "Zamknij": "Close",
    "Wyświetl pełny profil": "View Full Profile", "Wyświetl zdjęcie profilowe": "View Profile Picture", "Pełny profil użytkownika": "Full User Profile",
    "Odznaki użytkownika": "User Badges", "Odpowiedz na status": "Reply to status", "Zareaguj na status": "React to status",
    "Edytuj profil": "Edit Profile", "Tablica": "Board", "Aktywność": "Activity", "Lista życzeń": "Wishlist",
    "Ulubiona gra": "Favorite Game", "Gry w rotacji": "Games in Rotation", "Chcę zagrać": "Want to Play", "Gry, które lubię": "Games I Like",
    "Działania widgetu": "Widget Actions", "Pokaż więcej": "Show More", "Pokaż mniej": "Show Less", "Zwiń tagi gry": "Collapse Game Tags",
    "Poziom umiejętności": "Skill level", "Ocena": "Rating", "Szukam": "Looking for", "Tagi gry": "Game Tags", "Tagi": "Tags",
    "Casualowe": "Casual", "Średnie": "Intermediate", "Ekspert": "Expert", "Lepszy od ciebie": "Better than you", "Nowa gra": "New release",
    "Uwielbiam to": "Love it", "Trochę mi się podoba": "Kind of love it", "Trochę tego nienawidzę": "Kind of hate it", "Uwielbiam": "Obsessed",
    "Wyjście z frustracji": "Rage quitting", "Szukam grupy": "Looking for group", "Chętny do gry": "Open to play",
    "Szukam wskazówek": "Looking for tips", "Otwórz, aby uczyć": "Open to teach", "Chcę rozmawiać": "Looking to discuss",
    "Przeglądaj sklep": "Browse the Shop", "Nie ma jeszcze serduszek 💔": "No hearts yet 💔",
    "Przeglądaj sklep i polub przedmioty, które Ci się podobają, aby dodać je tutaj.": "Browse the Shop and heart the items you love to add them here.",
    "Dostępny": "Online", "Zaraz wracam": "Idle", "Nie przeszkadzać": "Do Not Disturb", "Niedostępny": "Offline", "Niewidoczny": "Invisible", "Na żywo": "Streaming",
    "Subskrybent od": "Subscriber since", "Ulepsza serwer od": "Server boosting since", "Wiek konta": "Account Age",
    // ---- badges (Discord's English badge descriptions)
    "Pracownik Discorda": "Discord Staff", "Właściciel serwera partnerskiego": "Partnered Server Owner",
    "Absolwent programów dla moderatorów": "Moderator Programs Alumni", "Wydarzenia HypeSquad": "HypeSquad Events",
    "HypeSquad – odwaga": "HypeSquad Bravery", "HypeSquad – błyskotliwość": "HypeSquad Brilliance", "HypeSquad – równowaga": "HypeSquad Balance",
    "Łowca błędów Discorda": "Discord Bug Hunter", "Aktywny deweloper": "Active Developer", "Wczesny sponsor": "Early Supporter",
    "Wczesny zweryfikowany twórca botów": "Early Verified Bot Developer", "Użytkownik znany wcześniej jako": "Originally known as",
    "Ukończono misję": "Completed a Quest", "Osiągnięto poziom 100": "Reached Level 100", "Zdobyto odznakę profilową „Orbs”": "Earned the Orbs profile badge",
    "Nitro (staż)": "Nitro (tenure)",
    "Seed (1 rok)": "Seed (1 yr)", "Sprout (2 lata)": "Sprout (2 yrs)", "Sapling (3 lata)": "Sapling (3 yrs)", "Bud (4 lata)": "Bud (4 yrs)",
    "Blossom (5 lat)": "Blossom (5 yrs)", "Redwood (6 lat)": "Redwood (6 yrs)", "Sequoia (7 lat)": "Sequoia (7 yrs)",
    "Bristlecone (8 lat)": "Bristlecone (8 yrs)", "Stromatolite (9 lat)": "Stromatolite (9 yrs)", "Primordial (10+ lat)": "Primordial (10+ yrs)", "Boost serwera (staż)": "Server boost (tenure)", "brak": "none", "Brąz (1 mies.)": "Bronze (1 mo)",
    "Srebro (3 mies.)": "Silver (3 mo)", "Złoto (6 mies.)": "Gold (6 mo)", "Platyna (1 rok)": "Platinum (1 yr)", "Diament (2 lata)": "Diamond (2 yrs)",
    "Szmaragd (3 lata)": "Emerald (3 yrs)", "Rubin (5 lat)": "Ruby (5 yrs)", "Opal (6 lat)": "Opal (6 yrs)",
    "1 mies.": "1 mo", "2 mies.": "2 mo", "3 mies.": "3 mo", "6 mies.": "6 mo", "9 mies.": "9 mo", "12 mies.": "12 mo", "15 mies.": "15 mo", "18 mies.": "18 mo", "24 mies.": "24 mo",
    "Własna odznaka (URL)": "Custom badge (URL)", "Opis odznaki": "Badge description", "Dodaj odznakę": "Add badge",
    // ---- client themes
    "Jasny": "Light", "Popielaty": "Ash", "Ciemny": "Dark", "Onyks": "Onyx", "Motyw": "Theme", "Kolor": "Color", "Własny motyw": "Custom theme",
    "Jabłko i mięta": "Mint Apple", "Cytrusowy sorbet": "Citrus Sherbert", "Chmura deszczowa retro": "Retro Raincloud", "Hanami": "Hanami",
    "Wschód słońca": "Sunrise", "Wata cukrowa": "Cotton Candy", "Klimat LoFi": "LoFi Vibes", "Pustynny kamuflaż": "Desert Khaki",
    "Zachód słońca": "Sunset", "Chromatyczny blask": "Chroma Glow", "Las": "Forest", "Karmazynowy księżyc": "Crimson Moon",
    "Ciemny niebieskofioletowy": "Midnight Blurple", "Mars": "Mars", "Zmrok": "Dusk", "Pod wodą": "Under the Sea", "Burza retro": "Retro Storm",
    "Neonowe noce": "Neon Nights", "Truskawkowa lemoniada": "Strawberry Lemonade", "Aurora": "Aurora", "Sepia": "Sepia",
    "Niebieskofioletowy zmierzch": "Blurple Twilight",
    "Kąt gradientu": "Gradient angle", "Intensywność koloru": "Color intensity", "Tryb": "Mode",
    // ---- editor panel
    "Edytor profilu": "Profile Editor", "Widok": "View", "Pełny profil": "Full profile", "Wyskakujące okno": "Popout", "Język": "Language",
    "Zaloguj przez Discord": "Log in with Discord",
    "Pobiera nazwę, awatar, baner, dekorację, tag serwera, styl nazwy, odznaki i połączenia. Token zostaje tylko w tej karcie.":
      "Imports your name, avatar, banner, decoration, server tag, name style, badges and connections. The token stays in this tab only.",
    "Nieoficjalne narzędzie fanowskie, niezwiązane z Discord Inc. Tylko podgląd – niczego nie zmienia na koncie.":
      "Unofficial fan-made tool, not affiliated with Discord Inc. Preview only – it changes nothing on your account.",
    "Tego Discord nie udostępnia przez logowanie. Uzupełnij ręcznie:": "Discord doesn't share these through login. Fill them in yourself:",
    "Diagnostyka logowania": "Login diagnostics", "Co dokładnie zwrócił Discord (true = pole jest i ma wartość):": "What Discord returned (true = field present and set):",
    "Kopiuj wyniki": "Copy results", "Surowa odpowiedź API": "Raw API response", "Skopiowano": "Copied", "Zaznacz tekst poniżej i skopiuj": "Select the text below and copy it",
    "O mnie, zaimki i status": "About me, pronouns and status", "Odznaki (staż Nitro, boost, inne)": "Badges (Nitro tenure, boost, others)",
    "Motyw profilu": "Profile theme", "Efekt profilu": "Profile effect",
    "Podstawowe": "Basics", "Wyświetlana nazwa": "Display Name", "Nazwa użytkownika": "Username", "Zaimki": "Pronouns", "O mnie": "About Me",
    "Status": "Status", "Emoji": "Emoji", "Status własny": "Custom Status", "Awatar": "Avatar", "URL obrazu": "Image URL",
    "Prześlij plik (PNG/JPG/GIF/WEBP)": "Upload a file (PNG/JPG/GIF/WEBP)", "Dekoracja awatara": "Avatar Decoration", "Animacja": "Animation",
    "Szukaj dekoracji…": "Search decorations…", "Własny URL dekoracji (APNG/PNG)": "Custom decoration URL (APNG/PNG)", "Baner": "Banner",
    "Prześlij plik": "Upload a file", "Usuń baner": "Remove Banner", "Kolor z awatara": "Color from avatar", "Motyw profilu (Nitro)": "Profile theme (Nitro)",
    "Włącz kolory motywu": "Enable theme colors", "Główny": "Primary", "Akcent": "Accent", "Synchronizuj z motywem klienta": "Sync with client theme",
    "Ustawienie oglądającego: Wygląd → Synchronizuj motywy profili": "Viewer setting: Appearance → Sync profile themes",
    "Szukaj efektu…": "Search effects…", "Odtwórz": "Replay", "Styl wyświetlanej nazwy": "Display name style", "Włącz styl nazwy": "Enable name style",
    "Czcionka": "Font", "Efekt": "Effect", "Odznaki i tag serwera": "Badges and server tag", "Odznaki": "Badges", "Tag serwera": "Server Tag",
    "Tekst tagu": "Tag text", "Ikona": "Icon", "Kolory": "Colors", "Drugi": "Secondary", "Własna ikona (URL)": "Custom icon (URL)",
    "…lub prześlij plik": "…or upload a file", "Tablica i karty": "Board and tabs", "Pokaż prawą kolumnę": "Show right column",
    "Karta „Aktywność”": "“Activity” tab", "Wspólni znajomi": "Mutual Friends", "Wspólne serwery": "Mutual Servers", "Widżety tablicy": "Board widgets",
    "Dodaj widżet": "Add widget", "Dekoracje": "Decorations", "Efekty profilu": "Profile effects", "Szukaj w sklepie…": "Search the shop…",
    "Sekcje": "Sections", "Oglądane na serwerze (pokaż „Członek od” serwera)": "Viewed in a server (show the server's “Member Since”)",
    "Nazwa serwera": "Server Name", "Dołączono": "Joined", "Ikona serwera (URL)": "Server icon (URL)", "Usuń ikonę": "Remove Icon",
    "Znajomi od": "Friends Since", "(puste = ukryte)": "(empty = hidden)", "Dodaj połączenie": "Add Connection", "Wygląd aplikacji": "App appearance",
    "Podgląd": "Preview", "Tło sceny": "Stage background", "Aplikacja (z motywem)": "App (with theme)", "Przyciemnione": "Dimmed",
    "Szachownica": "Checkerboard", "Eksport JSON": "Export JSON", "Import JSON": "Import JSON", "Reset": "Reset",
    "Przywrócić ustawienia domyślne?": "Restore default settings?", "Nazwa gry": "Game name", "Szukaj": "Search", "Przeglądaj gry": "Browse games",
    "Komentarz": "Comment", "Brak wyników.": "No results found.", "Nie udało się połączyć z Discordem.": "Couldn't reach Discord.", "Szukam…": "Searching…",
    "W górę": "Move up", "W dół": "Move down", "Usuń": "Remove", "Dodaj własną grę": "Add a custom game", "Prześlij okładkę": "Upload cover",
    "Pusta lista (Discord pokaże stan pusty).": "Empty list (Discord shows the empty state).",
    "Typ widżetu": "Widget type", "Usuń widżet": "Remove widget", "Domyślna": "Default", "Jednolity": "Solid", "Gradient": "Gradient",
    "Pryzmat": "Prism", "Aplikacja": "App",
    "Logowanie anulowane.": "Login cancelled.", "Odrzucono logowanie (nieprawidłowy state).": "Login rejected (invalid state).",
    "Pobieram profil…": "Fetching profile…", "Logowanie działa tylko z serwera http(s), nie z pliku.": "Login only works from an http(s) server, not from a file.",
    "Użytkownik": "User", "uzytkownik": "user", "Edytuję profil": "Editing my profile", "Mój serwer": "My server",
    "Cześć! **To jest bio** z *formatowaniem* Discorda.\nhttps://discord.com": "Hi! **This is a bio** with Discord *formatting*.\nhttps://discord.com",
    "Wybierz kolor": "Pick a color", "Wybierz plik": "Choose file", "Gotowe": "Done", "Pipeta": "Eyedropper", "Brak": "None", "URL okładki": "Cover URL", "Usuń grę": "Remove game", "Komentarz (opcjonalnie)": "Comment (optional)",
    "Klasyka, do której zawsze wracam": "A classic I always come back to",
  };
  // dynamic strings: [regex, replacement]
  const PATTERNS = [
    [/^(\d+) przedmiot(?:y|ów)?$/, (m, n) => n === "1" ? "1 item" : `${n} items`],
    [/^(\d+) więcej odznak$/, (m, n) => `${n} more badges`],
    [/^Tagi \((\d+)\)$/, (m, n) => `Tags (${n})`],
    [/^\+ dodatkowo (\d+)$/, (m, n) => `+${n} more`],
    [/^(.+) mówi:$/, (m, n) => `${n} says:`],
    [/^(\d+) wspóln(?:y znajomy|ych znajomych)$/, (m, n) => n === "1" ? "1 Mutual Friend" : `${n} Mutual Friends`],
    [/^(\d+) wspóln(?:y serwer|e serwery|ych serwerów)$/, (m, n) => n === "1" ? "1 Mutual Server" : `${n} Mutual Servers`],
    [/^Podgląd dekoracji awatara: (.*)$/, (m, n) => `Avatar decoration preview: ${n}`],
    [/^Podgląd efektu profilu: (.*)$/, (m, n) => `Profile effect preview: ${n}`],
    [/^(.*): dekoracja awatara$/, (m, n) => `${n}: avatar decoration`],
    [/^(.*): efekt profilu$/, (m, n) => `${n}: profile effect`],
    [/^Logo (.*)$/, (m, n) => `${n} logo`],
    [/^(.*), Otwórz w przeglądarce$/, (m, n) => `${n}, Open in browser`],
    [/^(.*), wyświetl profil gry$/, (m, n) => `${n}, view game profile`],
    [/^Status własny użytkownika (.*)$/, (m, n) => `Custom status for ${n}`],
    [/^Domyślny awatar (\d+)$/, (m, n) => `Default avatar ${n}`],
    [/^Limit gier w tym widżecie: (\d+)\.$/, (m, n) => `Game limit for this widget: ${n}.`],
    [/^Zaimportowano profil (.*)$/, (m, n) => `Imported profile ${n}`],
    [/^Błąd logowania: (.*)$/, (m, n) => `Login error: ${n}`],
    [/^Nie udało się pobrać profilu \((.*)\)\.$/, (m, n) => `Couldn't fetch the profile (${n}).`],
    [/^Nieprawidłowy plik: (.*)$/, (m, n) => `Invalid file: ${n}`],
    [/^(Nitro \(staż\)|Boost serwera \(staż\)|Wiek konta): (.*)$/, (m, a, b) => `${EN[a]}: ${EN[b] || b}`],
    [/^Kolor (\d+)$/, (m, n) => `Color ${n}`],
    [/^(.*) \(maks\. (\d+)\)$/, (m, a, n) => `${t(a)} (max ${n})`],
    [/^Zaimki: (.*)$/, (m, n) => `Pronouns: ${n}`],
  ];

  function t(s) {
    if (lang === "pl" || s == null) return s;
    if (Object.prototype.hasOwnProperty.call(EN, s)) return EN[s];
    for (const [re, fn] of PATTERNS) { const m = s.match(re); if (m) return fn(...m); }
    return s;
  }
  // user content (display name, status, game names...) must never be translated, even if it equals a UI phrase
  let protectFn = () => [], protectedSet = new Set();
  const refreshProtected = () => { try { protectedSet = new Set(protectFn().filter(Boolean).map(x => String(x).trim())); } catch (e) { } };
  const ATTRS = ["aria-label", "placeholder", "title", "alt"];
  const SKIP = new Set(["SCRIPT", "STYLE", "TEXTAREA"]);
  function trText(node) {
    const v = node.nodeValue, s = v.trim();
    if (!s || s.length > 200 || protectedSet.has(s)) return;
    const r = t(s);
    if (r !== s) node.nodeValue = v.replace(s, r);
  }
  function trEl(el) {
    for (const a of ATTRS) { const v = el.getAttribute(a); if (v && !protectedSet.has(v.trim())) { const r = t(v); if (r !== v) el.setAttribute(a, r); } }
  }
  function apply(root) {
    if (lang === "pl" || !root) return;
    refreshProtected();
    if (root.nodeType === 3) { trText(root); return; }
    if (root.nodeType !== 1) return;
    trEl(root); // attributes even on <textarea> (placeholder)
    if (SKIP.has(root.tagName)) return;
    const w = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT, {
      acceptNode: n => n.nodeType === 1 && SKIP.has(n.tagName) ? (trEl(n), NodeFilter.FILTER_REJECT) : NodeFilter.FILTER_ACCEPT,
    });
    for (let n = w.nextNode(); n; n = w.nextNode()) n.nodeType === 3 ? (n.parentNode && !SKIP.has(n.parentNode.tagName) && trText(n)) : trEl(n);
  }
  function watch() {
    if (lang === "pl") return;
    apply(document.body); document.title = t(document.title);
    new MutationObserver(list => {
      for (const m of list) {
        if (m.type === "childList") m.addedNodes.forEach(apply);
        else if (m.type === "characterData") trText(m.target);
        else if (m.type === "attributes") trEl(m.target);
      }
    }).observe(document.body, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ATTRS });
  }
  function setLang(l) { if (!LANGS[l]) return; try { localStorage.setItem("dpe-lang", l); } catch (e) { } location.reload(); }
  // dates as Discord shows them: "19 lis 2026" / "Nov 19, 2026"
  const fmtDate = d => lang === "pl"
    ? d.toLocaleDateString("pl-PL", { day: "numeric", month: "short", year: "numeric" }).replace(".", "")
    : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  // saved profiles keep the default texts in the language they were created in: bring a known default (given by its
  // Polish source) into the current language, leave anything the user typed alone
  const relocalize = (v, defaults) => {
    for (const pl of defaults) if (v === pl || v === EN[pl]) return t(pl);
    return v;
  };
  // re-format a stored "19 lis 2026" / "Nov 19, 2026" date in the current language; other text is left as typed
  const PL_MONTHS = ["sty", "lut", "mar", "kwi", "maj", "cze", "lip", "sie", "wrz", "paź", "lis", "gru"];
  const EN_MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const relocalizeDate = v => {
    let m = /^(\d{1,2}) (\S+) (\d{4})$/.exec(v || ""), mi;
    if (m && (mi = PL_MONTHS.indexOf(m[2])) >= 0) return fmtDate(new Date(+m[3], mi, +m[1]));
    m = /^(\w{3}) (\d{1,2}), (\d{4})$/.exec(v || "");
    if (m && (mi = EN_MONTHS.indexOf(m[1])) >= 0) return fmtDate(new Date(+m[3], mi, +m[2]));
    return v;
  };

  const protect = fn => { protectFn = fn; };
  global.I18N = { LANGS, get lang() { return lang; }, t, apply, watch, setLang, fmtDate, protect, relocalize, relocalizeDate };
})(window);
