// script.js
/*
  Wedding Website Script (No build tools)
  What to edit:
  - Edit only the CONFIG object below to update all content (names, date, venue, schedule, registry, FAQs, etc.).
  - Optional: set FORM_ENDPOINT to a URL (like Formspree) to also POST RSVPs online.

  Notes:
  - RSVP submissions always store locally in this browser (localStorage). If FORM_ENDPOINT is set, the site also tries to POST there.
  - Export RSVPs (CSV) downloads what is stored locally.
*/

const FORM_ENDPOINT = ""; // Example: "https://formspree.io/f/yourId" (leave blank to disable POST)

const THEME_STORAGE_KEY = "wedding-theme"; // "light" | "dark"

/** Single source of truth for editable content */
const CONFIG = {
  coupleNames: "John Anthony & Rioanne",
  shortLine: "A warm, intimate celebration with our favorite people.",
  /** Hero background: single video (loops). */
  heroVideoUrls: ["assets/vid-1.mp4"],
  dateISO: "2026-08-10", // YYYY-MM-DD
  startTime: "14:30", // 24h local time (for countdown/calendar)
  endTime: "23:00",   // 24h local time (for calendar)
  rsvpDeadlineISO: "2026-07-30",

  ceremonyVenue: {
    name: "St. Gregory the Great Cathedral",
    address: "Legazpi City, Albay, Philippines",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.3796285161407!2d123.73067727536424!3d13.138437311198038!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a103dcc0fd8a15%3A0x63566804d7407a4e!2sSt.%20Gregory%20the%20Great%20Cathedral%20(Catedral%20de%20San%20Gregorio%20Magno)!5e0!3m2!1sen!2suk!4v1768402655085!5m2!1sen!2suk"
  },
  receptionVenue: {
    name: "The Marison Hotel",
    address: "Corner Imelda Roces Ave, Legazpi City, Albay, Philippines",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.097830427158!2d123.74062589070937!3d13.156228724561213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a1017a9d2443d9%3A0x7b86f973d84c8d20!2sThe%20Marison%20Hotel!5e0!3m2!1sen!2suk!4v1768399723109!5m2!1sen!2suk"
  },
  // Legacy fields for backward compatibility (uses ceremony venue)
  venueName: "St. Gregory the Great Cathedral",
  address: "Legazpi City, Albay, Philippines",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3885.097830427158!2d123.74062589070937!3d13.156228724561213!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33a1017a9d2443d9%3A0x7b86f973d84c8d20!2sSt.%20Gregory%20the%20Great%20Cathedral!5e0!3m2!1sen!2suk!4v1768399723109!5m2!1sen!2suk",

  scheduleItems: [
    { time: "2:00 PM", title: "Arrival", details: "Please arrive at St. Gregory the Great Cathedral 30 mins earlier.", location: "ceremony" },
    { time: "3:00 PM", title: "Ceremony", details: "Unplugged ceremony. Please keep phones away.", location: "ceremony" },
    { time: "5:00 PM", title: "Cocktail hour", details: "Light bites, photos, and good conversation at The Marison Hotel.", location: "reception" },
    { time: "6:30 PM", title: "Reception", details: "Dinner, toasts, and dancing at The Marison Hotel.", location: "reception" },
    { time: "10:45 PM", title: "Last dance", details: "One more song together before goodbye.", location: "reception" }
  ],

  dressCode: {
    subtitle: "Cocktail attire.",
    guidance:
      "Aim for elevated, comfortable looks suited to our hotel venue.",
    good: [
      "Cocktail dresses, midi dresses, polished jumpsuits",
      "Suit and tie optional, dress shirts welcome",
      "Heels, flats, or dressy boots (block heels recommended)"
    ],
    avoid: [
      "All-white outfits (save that for the couple)",
      "Athleisure, ripped denim, graphic tees",
      "Very tall stilettos (for comfort)"
    ],
    colorPalette: [
      { name: "Deep Navy", hex: "#1a3a52", description: "Sophisticated and timeless" },
      { name: "Warm Taupe", hex: "#b8a082", description: "Neutral and versatile" }
    ],
    notes: "Neutral tones welcome. Soft patterns are great. Comfortable shoes recommended."
  },

  registryLinks: [
    {
      name: "Home essentials",
      url: "https://example.com/registry-home",
      description: "Items we’ll use every day as we build our home together—from kitchen basics to things that make a house feel like ours.",
      note: "View our list and ship to our address"
    },
    {
      name: "Monetary gift",
      url: "https://example.com/registry-monetary",
      description: "A contribution toward our future—helping us build our family and our home. Any amount is deeply appreciated.",
      note: "Secure and optional"
    }
  ],

  storyItems: [
    { kicker: "The beginning", title: "John courted Rioanne for 3 months", text: "Three months of courting led to something special." },
    { kicker: "April 10, 2022", title: "We became official", text: "Rioanne said yes—we were officially together from that day on." },
    { kicker: "June 29, 2025", title: "John proposed at Hong Kong Disneyland", text: "John popped the question at Hong Kong Disneyland. A magical yes." },
    { kicker: "Our family", title: "Meet Pluto", text: "We have a child dog named Pluto who is so cute." }
  ],

  gallery: {
    count: 9,
    caption: "Placeholder gallery image"
  },

  childrenPolicy: {
    allowed: false,
    subtitle: "Adults-only celebration.",
    title: "Adults-only",
    text: "We love your little ones. For this day, we’re keeping the celebration adults-only so everyone can fully relax."
  },

  faqItems: [
    { q: "What time should I arrive?", a: "Plan to arrive 20 to 30 minutes before the ceremony so you can park, settle in, and find your seat." },
    { q: "Is there parking?", a: "Yes. On-site parking is available. If you can, carpool or use a ride share for the easiest exit." },
    { q: "Can I bring a plus-one?", a: "If your invitation includes a guest, you’re covered. If you’re unsure, reach out and we’ll confirm." },
    { q: "What about gifts?", a: "Your presence is the best gift. If you’d like, our registry links are above." },
    { q: "What if the weather changes?", a: "The plan works in most weather. We’ll communicate any updates by email the day before." },
    { q: "Who can I contact with questions?", a: "Email us anytime and we’ll get back to you as soon as we can." }
  ],

  rsvpNotes: [],

  contactEmail: "jananriowedding@gmail.com",
  socials: [
    { label: "Instagram", url: "#" },
    { label: "Updates", url: "#" }
  ],

  disclaimer:
    ""
};

/* -----------------------------
   Helpers
------------------------------ */
const LS_KEY = "wedding_rsvps_v1";

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

function safeText(str) {
  return String(str ?? "").trim();
}

function pad2(n) {
  return String(n).padStart(2, "0");
}

function makeLocalDateTime(dateISO, time24) {
  return new Date(`${dateISO}T${time24}:00`);
}

function formatWeekday(dateISO) {
  const d = new Date(`${dateISO}T12:00:00`);
  return new Intl.DateTimeFormat(undefined, { weekday: "long" }).format(d);
}

function formatMonthDayYear(dateISO) {
  const d = new Date(`${dateISO}T12:00:00`);
  const fmt = new Intl.DateTimeFormat(undefined, { year: "numeric", month: "long", day: "numeric" });
  return fmt.format(d);
}

function toUtcIcsStamp(date) {
  const y = date.getUTCFullYear();
  const m = pad2(date.getUTCMonth() + 1);
  const d = pad2(date.getUTCDate());
  const hh = pad2(date.getUTCHours());
  const mm = pad2(date.getUTCMinutes());
  const ss = pad2(date.getUTCSeconds());
  return `${y}${m}${d}T${hh}${mm}${ss}Z`;
}

function escapeIcsText(text) {
  return String(text ?? "")
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function csvEscape(value) {
  const s = String(value ?? "");
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

function uid() {
  try {
    return crypto.randomUUID();
  } catch {
    return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }
}

function initialsPairFromNames(names) {
  const parts = String(names).split("&").map((s) => s.trim()).filter(Boolean);
  const a = parts[0]?.[0]?.toUpperCase() || "J";
  const b = parts[1]?.[0]?.toUpperCase() || "R";
  return `${a} & ${b}`;
}

/* -----------------------------
   Rendering
------------------------------ */
function safeSetText(selector, text) {
  const el = $(selector);
  if (el) el.textContent = text;
}

function safeSetAttr(selector, attr, value) {
  const el = $(selector);
  if (el) el[attr] = value;
}

function applyConfigToStatic() {
  try {
    const brandLogo = $("#brandLogo");
    if (brandLogo) brandLogo.textContent = initialsPairFromNames(CONFIG.coupleNames);

    safeSetText("#footerNames", CONFIG.coupleNames);
    safeSetText("#footerNamesInline", CONFIG.coupleNames);

    safeSetText("#heroNames", CONFIG.coupleNames);
    safeSetText("#heroLine", CONFIG.shortLine);

    const dow = formatWeekday(CONFIG.dateISO);
    const fullDate = formatMonthDayYear(CONFIG.dateISO);

    safeSetText("#heroDow", dow);
    safeSetText("#heroDateText", fullDate);

    safeSetText("#dateDow", dow);
    safeSetText("#dateFull", fullDate);
    safeSetText("#dateTimeLine", `Ceremony starts at ${time24To12(CONFIG.startTime)}`);

    // Hero shows ceremony venue (main event)
    safeSetText("#heroVenueLine", `At ${CONFIG.ceremonyVenue.name}`);
    
    // Ceremony venue
    safeSetText("#ceremonyVenueName", CONFIG.ceremonyVenue.name);
    safeSetText("#ceremonyAddress", CONFIG.ceremonyVenue.address);
    safeSetAttr("#ceremonyMapFrame", "src", CONFIG.ceremonyVenue.mapEmbedUrl);
    const ceremonyDirections = $("#ceremonyDirectionsLink");
    if (ceremonyDirections) ceremonyDirections.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.ceremonyVenue.address)}`;
    
    // Reception venue
    safeSetText("#receptionVenueName", CONFIG.receptionVenue.name);
    safeSetText("#receptionAddress", CONFIG.receptionVenue.address);
    safeSetAttr("#receptionMapFrame", "src", CONFIG.receptionVenue.mapEmbedUrl);
    const receptionDirections = $("#receptionDirectionsLink");
    if (receptionDirections) receptionDirections.href = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.receptionVenue.address)}`;
    
    // Legacy support (for calendar links, etc.)
    safeSetText("#venueName", CONFIG.venueName);
    safeSetText("#venueAddress", CONFIG.address);

    safeSetText("#dressCodeSubtitle", CONFIG.dressCode.subtitle);
    safeSetText("#dressCodeGuidance", CONFIG.dressCode.guidance);
    safeSetText("#dressNotes", CONFIG.dressCode.notes);

    safeSetText("#childrenPolicySubtitle", CONFIG.childrenPolicy.subtitle);
    safeSetText("#childrenPolicyTitle", CONFIG.childrenPolicy.title);
    safeSetText("#childrenPolicyText", CONFIG.childrenPolicy.text);
    safeSetText("#childrenPolicyBadge", CONFIG.childrenPolicy.allowed ? "Yes" : "No");

    const contactEmailLink = $("#contactEmailLink");
    if (contactEmailLink) {
      contactEmailLink.textContent = CONFIG.contactEmail;
      contactEmailLink.href = `mailto:${CONFIG.contactEmail}`;
    }

    safeSetText("#footerDisclaimer", CONFIG.disclaimer);

    safeSetText("#rsvpDeadlineText", formatMonthDayYear(CONFIG.rsvpDeadlineISO));

    // Notes list
    const notes = $("#rsvpNotesList");
    if (notes) {
      notes.innerHTML = "";
      CONFIG.rsvpNotes.forEach((n) => {
        const li = document.createElement("li");
        li.textContent = n;
        notes.appendChild(li);
      });
    }

    // Social links
    const socials = $("#socialLinks");
    if (socials) {
      socials.innerHTML = "";
      CONFIG.socials.forEach((s) => {
        const a = document.createElement("a");
        a.href = s.url;
        a.target = "_blank";
        a.rel = "noopener noreferrer";
        a.textContent = s.label;
        socials.appendChild(a);
      });
    }

    // Dress lists
    const good = $("#dressGoodList");
    const avoid = $("#dressAvoidList");
    if (good && avoid) {
      good.innerHTML = "";
      avoid.innerHTML = "";
      CONFIG.dressCode.good.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        good.appendChild(li);
      });
      CONFIG.dressCode.avoid.forEach((t) => {
        const li = document.createElement("li");
        li.textContent = t;
        avoid.appendChild(li);
      });
    }

    // Color palette
    const colorPalette = $("#dressColorPalette");
    if (colorPalette) {
      colorPalette.innerHTML = "";
      CONFIG.dressCode.colorPalette.forEach((color) => {
        const colorSwatch = document.createElement("div");
        colorSwatch.className = "color-swatch";
        colorSwatch.innerHTML = `
          <div class="color-circle" style="background-color: ${escapeAttr(color.hex)};"></div>
          <div class="color-info">
            <div class="color-name">${escapeHtml(color.name)}</div>
            <div class="color-hex">${escapeHtml(color.hex)}</div>
            <div class="color-description">${escapeHtml(color.description)}</div>
          </div>
        `;
        colorPalette.appendChild(colorSwatch);
      });
    }

  } catch (error) {
    console.error("Error in applyConfigToStatic:", error);
  }
}

function renderSchedule() {
  const list = $("#scheduleList");
  list.innerHTML = "";
  CONFIG.scheduleItems.forEach((item) => {
    const li = document.createElement("li");
    li.className = "timeline-item";
    li.innerHTML = `
      <div class="timeline-time">${escapeHtml(item.time)}</div>
      <div>
        <h3 class="timeline-title">${escapeHtml(item.title)}</h3>
        <p class="timeline-details">${escapeHtml(item.details)}</p>
        <span class="timeline-badge">Wedding day</span>
      </div>
    `;
    list.appendChild(li);
  });
}

function renderRegistry() {
  const grid = $("#registryGrid");
  grid.innerHTML = "";
  CONFIG.registryLinks.forEach((r) => {
    const card = document.createElement("div");
    card.className = "registry-card";
    card.innerHTML = `
      <h3 class="registry-title">${escapeHtml(r.name)}</h3>
      <p class="registry-desc">${escapeHtml(r.description)}</p>
    `;
    grid.appendChild(card);
  });
}

function renderFAQ() {
  const root = $("#faqAccordion");
  root.innerHTML = "";
  CONFIG.faqItems.forEach((item, idx) => {
    const idBtn = `faq-btn-${idx}`;
    const idPanel = `faq-panel-${idx}`;

    const wrap = document.createElement("div");
    wrap.className = "accordion-item";

    wrap.innerHTML = `
      <h3 style="margin:0;">
        <button class="accordion-button" type="button" id="${idBtn}" aria-expanded="false" aria-controls="${idPanel}">
          <span class="accordion-question">${escapeHtml(item.q)}</span>
          <span class="accordion-icon" aria-hidden="true"><span></span></span>
        </button>
      </h3>
      <div class="accordion-panel" id="${idPanel}" role="region" aria-labelledby="${idBtn}" hidden>
        <p style="margin:0;">${escapeHtml(item.a)}</p>
      </div>
    `;
    root.appendChild(wrap);
  });

  $$(".accordion-button", root).forEach((btn) => {
    btn.addEventListener("click", () => {
      const expanded = btn.getAttribute("aria-expanded") === "true";
      const panel = $("#" + btn.getAttribute("aria-controls"));
      if (!panel) return;

      btn.setAttribute("aria-expanded", String(!expanded));
      panel.hidden = expanded;
    });
  });
}

function renderStory() {
  const list = $("#storyList");
  list.innerHTML = "";
  CONFIG.storyItems.forEach((s) => {
    const li = document.createElement("li");
    li.className = "story-item";
    li.innerHTML = `
      <div class="story-kicker">${escapeHtml(s.kicker)}</div>
      <h3 class="story-title">${escapeHtml(s.title)}</h3>
      <p class="story-text">${escapeHtml(s.text)}</p>
    `;
    list.appendChild(li);
  });
}

function renderGallery() {
  const grid = $("#galleryGrid");
  grid.innerHTML = "";

  for (let i = 1; i <= CONFIG.gallery.count; i++) {
    const fig = document.createElement("figure");
    fig.className = "gallery-item";

    const svg = placeholderSvg(monogramFromNames(CONFIG.coupleNames), i);
    const src = `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;

    const img = document.createElement("img");
    img.src = src;
    img.alt = `${CONFIG.gallery.caption} ${i}`;

    fig.appendChild(img);
    grid.appendChild(fig);
  }
}

/* -----------------------------
   Interactions
------------------------------ */
function getPreferredTheme() {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === "light" || stored === "dark") return stored;
    if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) return "dark";
  } catch (_) {}
  return "light";
}

function applyTheme(theme) {
  const root = document.documentElement;
  root.setAttribute("data-theme", theme === "dark" ? "dark" : "light");
  try {
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch (_) {}
  const toggle = $("#themeToggle");
  if (toggle) {
    toggle.setAttribute("aria-checked", theme === "dark" ? "true" : "false");
    toggle.setAttribute("title", theme === "dark" ? "Switch to light mode" : "Switch to dark mode");
  }
}

function initTheme() {
  const theme = getPreferredTheme();
  applyTheme(theme);
  const toggle = $("#themeToggle");
  if (toggle) {
    toggle.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
      applyTheme(next);
    });
  }
}

function initNav() {
  const toggle = $("#navToggle");
  const nav = $("#siteNav");

  function closeNav() {
    document.body.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }

  function openNav() {
    document.body.classList.add("nav-open");
    toggle.setAttribute("aria-expanded", "true");
  }

  toggle.addEventListener("click", () => {
    const isOpen = document.body.classList.contains("nav-open");
    isOpen ? closeNav() : openNav();
  });

  $$('a[href^="#"]', nav).forEach((a) => a.addEventListener("click", () => closeNav()));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") closeNav(); });

  // Scrollspy: highlight current section (no default "pre-selected" link on load)
  const links = $$("[data-navlink]");
  const sections = links.map((a) => $(a.getAttribute("href"))).filter(Boolean);
  const byId = new Map(links.map((a) => [a.getAttribute("href"), a]));

  function setActive(id) {
    links.forEach((a) => {
      const active = a.getAttribute("href") === id;
      a.classList.toggle("is-active", active);
      if (active) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  }

  const io = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((e) => e.isIntersecting)
        .sort((a, b) => (b.intersectionRatio ?? 0) - (a.intersectionRatio ?? 0))[0];

      if (!visible) return;
      const id = "#" + visible.target.id;
      if (byId.has(id)) setActive(id);
    },
    { root: null, threshold: [0.25, 0.5, 0.75], rootMargin: "-30% 0px -55% 0px" }
  );

  sections.forEach((s) => io.observe(s));
}

function initCopyAddress() {
  // Ceremony address copy
  const ceremonyBtn = $("#copyCeremonyAddressBtn");
  const ceremonyToast = $("#copyCeremonyToast");
  let ceremonyToastTimer = null;

  ceremonyBtn?.addEventListener("click", async () => {
    const text = safeText(CONFIG.ceremonyVenue.address);
    if (!text) return;

    const showToast = (msg) => {
      ceremonyToast.textContent = msg;
      ceremonyToast.hidden = false;
      window.clearTimeout(ceremonyToastTimer);
      ceremonyToastTimer = window.setTimeout(() => (ceremonyToast.hidden = true), 1800);
    };

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        showToast("Address copied.");
        return;
      }
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Address copied.");
    } catch {
      showToast("Copy failed. Select and copy manually.");
    }
  });

  // Reception address copy
  const receptionBtn = $("#copyReceptionAddressBtn");
  const receptionToast = $("#copyReceptionToast");
  let receptionToastTimer = null;

  receptionBtn?.addEventListener("click", async () => {
    const text = safeText(CONFIG.receptionVenue.address);
    if (!text) return;

    const showToast = (msg) => {
      receptionToast.textContent = msg;
      receptionToast.hidden = false;
      window.clearTimeout(receptionToastTimer);
      receptionToastTimer = window.setTimeout(() => (receptionToast.hidden = true), 1800);
    };

    try {
      if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
        await navigator.clipboard.writeText(text);
        showToast("Address copied.");
        return;
      }
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.setAttribute("readonly", "");
      ta.style.position = "absolute";
      ta.style.left = "-9999px";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      showToast("Address copied.");
    } catch {
      showToast("Copy failed. Select and copy manually.");
    }
  });
}

function initCountdown() {
  const start = makeLocalDateTime(CONFIG.dateISO, CONFIG.startTime);

  const elDays = $("#cdDays");
  const elHours = $("#cdHours");
  const elMinutes = $("#cdMinutes");
  const elSeconds = $("#cdSeconds");

  function tick() {
    const now = new Date();
    const diff = start.getTime() - now.getTime();

    if (diff <= 0) {
      elDays.textContent = "0";
      elHours.textContent = "0";
      elMinutes.textContent = "0";
      elSeconds.textContent = "0";
      return;
    }

    const totalSeconds = Math.floor(diff / 1000);
    const days = Math.floor(totalSeconds / (24 * 3600));
    const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    elDays.textContent = String(days);
    elHours.textContent = String(hours);
    elMinutes.textContent = String(minutes);
    elSeconds.textContent = String(seconds);
  }

  tick();
  window.setInterval(tick, 1000);
}

function initHeroVideo() {
  const video = $("#heroVideo");
  const source = $("#heroVideoSource");
  const urls = CONFIG.heroVideoUrls;
  if (!video || !source || !urls || !urls.length) return;

  let index = 0;
  const singleVideo = urls.length === 1;

  function play() {
    video.play().catch(() => {});
  }

  function playNext() {
    if (singleVideo) {
      video.src = urls[0];
    } else {
      source.src = urls[index];
      source.removeAttribute("type");
    }
    video.loop = singleVideo;
    video.load();
    index = (index + 1) % urls.length;
  }

  video.addEventListener("ended", () => {
    if (singleVideo) {
      video.currentTime = 0;
      play();
    } else {
      playNext();
    }
  });

  video.addEventListener("loadeddata", play);
  video.addEventListener("canplay", play);
  video.addEventListener("canplaythrough", play);

  video.addEventListener("stalled", () => {
    if (video.paused && !video.ended) setTimeout(play, 200);
  });
  video.addEventListener("waiting", () => {
    if (video.paused && !video.ended) setTimeout(play, 200);
  });
  video.addEventListener("pause", () => {
    if (video.ended) return;
    const d = video.duration;
    if (Number.isFinite(d) && video.currentTime > 0.5 && video.currentTime < d - 0.5) {
      setTimeout(play, 150);
    }
  });

  video.addEventListener("error", () => {
    if (index > 0) return;
    console.warn("Hero video failed to load. Use .mp4 for best support.");
  });

  playNext();
  setTimeout(play, 500);
  setTimeout(play, 1500);
}

function initCalendarLinks() {
  const start = makeLocalDateTime(CONFIG.dateISO, CONFIG.startTime);
  const end = makeLocalDateTime(CONFIG.dateISO, CONFIG.endTime);

  const title = `${CONFIG.coupleNames} Wedding`;
  const description = `Join us for the wedding celebration.\n\nCeremony: ${CONFIG.ceremonyVenue.name}\n${CONFIG.ceremonyVenue.address}\n\nReception: ${CONFIG.receptionVenue.name}\n${CONFIG.receptionVenue.address}`;
  const location = `${CONFIG.ceremonyVenue.name} & ${CONFIG.receptionVenue.name}`;

  const ics = buildIcs(title, start, end, location, description);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  $("#icsDownload").href = url;

  $("#googleCalendarLink").href = buildGoogleCalendarUrl(title, start, end, location, description);
}

function initRevealOnScroll() {
  const els = $$("[data-reveal]");
  if (!("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  els.forEach((el) => io.observe(el));
}

function initHeroIntro() {
  const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const add = () => document.documentElement.classList.add("hero-loaded");
  if (reduce) { add(); return; }
  requestAnimationFrame(() => requestAnimationFrame(add));
}

/* -----------------------------
   RSVP logic
------------------------------ */
function initRSVP() {
  const form = $("#rsvpForm");
  const success = $("#rsvpSuccess");
  const successText = $("#rsvpSuccessText");

  const exportBtn1 = $("#exportRsvpsBtn");
  const exportBtn2 = $("#exportRsvpsBtn2");
  const submitAnotherBtn = $("#submitAnotherBtn");

  const guestsGroup = $("#guestsGroup");

  function getAttendanceValue() {
    const checked = $('input[name="attendance"]:checked');
    return checked ? checked.value : "";
  }

  function setGuestsVisibility() {
    const attendance = getAttendanceValue();
    const show = attendance !== "no";
    guestsGroup.style.display = show ? "" : "none";
  }

  $$('input[name="attendance"]').forEach((r) => r.addEventListener("change", setGuestsVisibility));
  setGuestsVisibility();

  renderChildPolicyField();

  function showForm() {
    form.hidden = false;
    success.hidden = true;
    form.reset();
    clearErrors();
    setGuestsVisibility();
    renderChildPolicyField();
    $("#fullName").focus();
  }

  submitAnotherBtn.addEventListener("click", showForm);
  exportBtn2.addEventListener("click", exportRsvps);
  exportBtn1.addEventListener("click", exportRsvps);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    clearErrors();

    const payload = collectAndValidate();
    if (!payload) return;

    const storedOk = storeRsvp(payload);

    let postedOk = false;
    if (safeText(FORM_ENDPOINT)) {
      postedOk = await postRsvp(payload);
    }

    form.hidden = true;
    success.hidden = false;

    const statusBits = [];
    statusBits.push(storedOk ? "Saved locally." : "Local save failed.");
    if (safeText(FORM_ENDPOINT)) statusBits.push(postedOk ? "Sent online." : "Online submit failed.");
    successText.textContent = `Thank you. ${statusBits.join(" ")}`;
    $("#submitAnotherBtn").focus();
  });

  function collectAndValidate() {
    const fullName = safeText($("#fullName").value);
    const email = safeText($("#email").value);
    const attendance = getAttendanceValue();

    const guestsRaw = $("#guests").value;
    const guests = Number.parseInt(guestsRaw, 10);

    const message = safeText($("#message").value);

    const childValue = readChildFieldValue();

    let ok = true;

    if (fullName.length < 2) { setError("fullName", "Please enter your full name."); ok = false; }
    if (!isValidEmail(email)) { setError("email", "Please enter a valid email address."); ok = false; }
    if (!attendance) { setError("attendance", "Please select Yes or No."); ok = false; }

    if (attendance !== "no") {
      if (!Number.isFinite(guests) || guests < 1 || guests > 4) {
        setError("guests", "Guests must be between 1 and 4.");
        ok = false;
      }
    }

    if (!CONFIG.childrenPolicy.allowed && attendance !== "no") {
      const ack = $("#childAck");
      if (ack && !ack.checked) {
        setError("childAck", "Please acknowledge the adults-only policy.");
        ok = false;
      }
    }

    if (!ok) return null;

    return {
      id: uid(),
      timestampISO: new Date().toISOString(),
      fullName,
      email,
      attendance,
      guests: attendance === "no" ? 0 : guests,
      dietary,
      message,
      song,
      childAttendance: childValue
    };
  }

  function readChildFieldValue() {
    if (CONFIG.childrenPolicy.allowed) {
      const sel = $("#childAttendance");
      return sel ? safeText(sel.value) : "";
    }
    const ack = $("#childAck");
    return ack ? (ack.checked ? "acknowledged" : "not_acknowledged") : "";
  }

  function renderChildPolicyField() {
    const root = $("#childPolicyField");
    root.innerHTML = "";

    if (CONFIG.childrenPolicy.allowed) {
      root.innerHTML = `
        <label for="childAttendance">Will children attend? (optional)</label>
        <select id="childAttendance" name="childAttendance">
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </select>
        <p class="field-hint">Let us know so we can plan seating and meals.</p>
      `;
      return;
    }

    root.innerHTML = `
      <label class="radio" style="border-radius: var(--radius-md); display:flex; align-items:flex-start; gap: 0.6rem;">
        <input id="childAck" type="checkbox" />
        <span>
          I understand this is an adults-only celebration.
          <span class="req" aria-hidden="true">*</span>
        </span>
      </label>
      <p class="field-error" id="error-childAck" aria-live="polite"></p>
    `;
  }

  function postRsvp(payload) {
    return fetch(FORM_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    }).then((res) => res.ok).catch(() => false);
  }

  function storeRsvp(payload) {
    try {
      const all = loadRsvps();
      all.push(payload);
      localStorage.setItem(LS_KEY, JSON.stringify(all));
      return true;
    } catch {
      return false;
    }
  }

  function loadRsvps() {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function exportRsvps() {
    const rows = loadRsvps();
    if (!rows.length) {
      alert("No RSVPs stored in this browser yet.");
      return;
    }

    const headers = ["id","timestampISO","fullName","email","attendance","guests","message","childAttendance"];
    const lines = [headers.join(","), ...rows.map((r) => headers.map((h) => csvEscape(r[h])).join(","))];

    const csv = lines.join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "rsvps.csv";
    document.body.appendChild(a);
    a.click();
    a.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  }

  function setError(field, msg) {
    if (field === "attendance") { $("#error-attendance").textContent = msg; return; }

    if (field === "childAck") {
      const p = $("#error-childAck");
      if (p) p.textContent = msg;
      const ack = $("#childAck");
      if (ack) ack.setAttribute("aria-invalid", "true");
      return;
    }

    const input = $("#" + field);
    const p = $("#error-" + field);
    if (p) p.textContent = msg;
    if (input) input.setAttribute("aria-invalid", "true");
  }

  function clearErrors() {
    ["fullName", "email", "guests"].forEach((id) => {
      const input = $("#" + id);
      const p = $("#error-" + id);
      if (input) input.removeAttribute("aria-invalid");
      if (p) p.textContent = "";
    });
    $("#error-attendance").textContent = "";
    const ack = $("#childAck");
    if (ack) ack.removeAttribute("aria-invalid");
    const ackErr = $("#error-childAck");
    if (ackErr) ackErr.textContent = "";
  }
}

/* -----------------------------
   Utilities
------------------------------ */
function buildIcs(title, start, end, location, description) {
  const dtStamp = toUtcIcsStamp(new Date());
  const dtStart = toUtcIcsStamp(start);
  const dtEnd = toUtcIcsStamp(end);

  const uidValue = `${uid()}@wedding-site`;
  const icsLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding Website//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uidValue}`,
    `DTSTAMP:${dtStamp}`,
    `DTSTART:${dtStart}`,
    `DTEND:${dtEnd}`,
    `SUMMARY:${escapeIcsText(title)}`,
    `LOCATION:${escapeIcsText(location)}`,
    `DESCRIPTION:${escapeIcsText(description)}`,
    "END:VEVENT",
    "END:VCALENDAR"
  ];

  return icsLines.join("\r\n");
}

function buildGoogleCalendarUrl(title, start, end, location, description) {
  const startUtc = toUtcIcsStamp(start);
  const endUtc = toUtcIcsStamp(end);

  const dates = `${startUtc}/${endUtc}`;
  const url = new URL("https://calendar.google.com/calendar/render");
  url.searchParams.set("action", "TEMPLATE");
  url.searchParams.set("text", title);
  url.searchParams.set("dates", dates);
  url.searchParams.set("details", description);
  url.searchParams.set("location", location);
  return url.toString();
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i.test(email);
}

function time24To12(t) {
  const [hStr, mStr] = String(t).split(":");
  const h = Number.parseInt(hStr, 10);
  const m = Number.parseInt(mStr, 10);
  if (!Number.isFinite(h) || !Number.isFinite(m)) return t;

  const suffix = h >= 12 ? "PM" : "AM";
  const hh = h % 12 === 0 ? 12 : h % 12;
  return `${hh}:${pad2(m)} ${suffix}`;
}

function monogramFromNames(names) {
  const parts = names.split("&").map((s) => s.trim()).filter(Boolean);
  const a = parts[0]?.[0]?.toUpperCase() || "J";
  const b = parts[1]?.[0]?.toUpperCase() || "R";
  return `${a} ♥ ${b}`;
}

function escapeHtml(str) {
  return String(str ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function escapeAttr(str) {
  return escapeHtml(str).replace(/"/g, "&quot;");
}

function placeholderSvg(monogram, index) {
  const bg1 = "#fff3e4";
  const bg2 = "#fbf7f0";
  const acc = "#b08b57";
  const ink = "#1f241f";

  const label = `Placeholder ${index}`;
  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" width="900" height="900" viewBox="0 0 900 900" role="img" aria-label="${escapeAttr(label)}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${bg1}"/>
      <stop offset="1" stop-color="${bg2}"/>
    </linearGradient>
    <radialGradient id="r" cx="30%" cy="20%" r="70%">
      <stop offset="0" stop-color="${acc}" stop-opacity="0.18"/>
      <stop offset="1" stop-color="${acc}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="900" height="900" fill="url(#g)"/>
  <rect width="900" height="900" fill="url(#r)"/>

  <circle cx="450" cy="430" r="220" fill="none" stroke="${acc}" stroke-opacity="0.35" stroke-width="3"/>
  <circle cx="450" cy="430" r="190" fill="none" stroke="${ink}" stroke-opacity="0.12" stroke-width="2"/>

  <text x="450" y="455" text-anchor="middle" font-size="68" font-family="Playfair Display, Georgia, serif" fill="${ink}" fill-opacity="0.92" letter-spacing="4">
    ${escapeHtml(monogram)}
  </text>

  <text x="450" y="510" text-anchor="middle" font-size="20" font-family="Inter, Arial, sans-serif" fill="${ink}" fill-opacity="0.55" letter-spacing="6">
    ${escapeHtml(label)}
  </text>
</svg>`;
  return svg.trim();
}

/* -----------------------------
   Initialization
------------------------------ */
function init() {
  try {
    applyConfigToStatic();
    renderSchedule();
    renderRegistry();
    renderFAQ();
    renderStory();
    renderGallery();

    initTheme();
    initNav();
    initHeroVideo();
    initCopyAddress();
    initCountdown();
    initCalendarLinks();
    initRevealOnScroll();
    initHeroIntro();
    initRSVP();

    // Set current year in footer
    const yearEl = $("#year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  } catch (error) {
    console.error("Error initializing wedding website:", error);
    // Try to show at least basic content even if there's an error
    const heroNames = $("#heroNames");
    if (heroNames && !heroNames.textContent) {
      heroNames.textContent = CONFIG?.coupleNames || "John Anthony & Rioanne";
    }
  }
}

// Initialize when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
