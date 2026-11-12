/* =========================================================
   Outback Adventures · Best ATV Arenal Tours — interactions & animations
   ========================================================= */
(() => {
  "use strict";
  const WA = "50684674777";
  // Optional Supabase REST lead persistence (see supabase/schema.sql & DEPLOY.md)
  const SUPABASE_URL = window.OUTBACK_CONFIG?.supabaseUrl || "";
  const SUPABASE_ANON_KEY = window.OUTBACK_CONFIG?.supabaseAnonKey || "";
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  /* ---------- Tours: single source of truth ---------- */
  const TOURS = [
    {
      id: "discovery", price: 99, unit: "person", cats: ["land"], img: "assets/img/hd/01-atv-volcano-mirador.jpg?v=9", video: "assets/video/clip-1.mp4", reelIdx: 0,
      en: { name: "The Discovery Adventure", tag: "Signature", meta: "ATV · Base of Arenal Volcano", chip: "Only route to the volcano base",
        desc: "Our signature ride and the only ATV route that reaches the base of Arenal Volcano. Wide-open viewpoints, jungle tracks and plenty of mud.",
        high: ["Panoramic viewpoints at the foot of the volcano", "Jungle and pasture trails", "Photo stops with the volcano behind you"] },
      es: { name: "The Discovery Adventure", tag: "Insignia", meta: "Cuadra · Base del Volcán Arenal", chip: "Única ruta a la base del volcán",
        desc: "Nuestro tour estrella y la única ruta en cuadra que llega a la base del Volcán Arenal. Miradores abiertos, senderos de selva y mucho barro.",
        high: ["Miradores panorámicos al pie del volcán", "Senderos de selva y potreros", "Paradas para fotos con el volcán de fondo"] }
    },
    {
      id: "jetski", price: 109, unit: "person", cats: ["water"], img: "assets/img/hd/03-jetski-action-lake.jpg?v=9", video: "assets/video/clip-3.mp4", reelIdx: 2,
      en: { name: "Arenal Lake Jet Ski", tag: "On the water", meta: "Jet ski · Lake Arenal", chip: "Sunset rides available",
        desc: "Fly across Costa Rica's largest and deepest lake with the volcano on the horizon. Time it right and you'll ride into a sunset you won't forget.",
        high: ["Costa Rica's biggest lake", "Volcano views from the water", "Golden-hour departures"] },
      es: { name: "Jet Ski en el Lago Arenal", tag: "En el agua", meta: "Jet ski · Lago Arenal", chip: "Salidas al atardecer",
        desc: "Recorre el lago más grande y profundo de Costa Rica con el volcán en el horizonte. Elige bien la hora y te espera un atardecer inolvidable.",
        high: ["El lago más grande de Costa Rica", "Vistas del volcán desde el agua", "Salidas en la hora dorada"] }
    },
    {
      id: "maleku", price: 85, unit: "person", cats: ["land"], img: "assets/img/hd/02-atv-outback-volcano.jpg?v=9", video: "assets/video/clip-2.mp4", reelIdx: 1,
      en: { name: "Jungle & Maleku ATV Tour", tag: "Culture", meta: "ATV · Rainforest · Indigenous visit", chip: "Best value",
        desc: "Ride deep rainforest trails and meet the Maleku, one of Costa Rica's indigenous peoples, to learn about their traditions and way of life.",
        high: ["Dense rainforest trails", "Cultural visit with the Maleku community", "Rivers, mud and wildlife spotting"] },
      es: { name: "Tour en Cuadra Selva y Maleku", tag: "Cultura", meta: "Cuadra · Bosque · Visita indígena", chip: "Mejor precio",
        desc: "Recorre senderos de bosque lluvioso y conoce a los Maleku, uno de los pueblos indígenas de Costa Rica, sus tradiciones y forma de vida.",
        high: ["Senderos de bosque lluvioso", "Visita cultural a la comunidad Maleku", "Ríos, barro y avistamiento de fauna"] }
    },
    {
      id: "sbs", price: 300, unit: "vehicle", cats: ["land", "group"], img: "assets/img/hd/04-jetski-emerald-cove.jpg?v=9", video: "assets/video/clip-4.mp4", reelIdx: 3,
      en: { name: "Side by Side Tour", tag: "Families", meta: "3 hours · 1–6 riders per vehicle", chip: "Price per vehicle",
        desc: "Bring the whole crew. A 3-hour off-road adventure through lush rainforest in a side-by-side built for up to six riders — perfect for families.",
        high: ["3 hours of off-road trails", "Up to 6 riders in one vehicle", "Great for kids and mixed groups"] },
      es: { name: "Tour en Side by Side", tag: "Familias", meta: "3 hours · 1–6 personas por vehículo", chip: "Precio por vehículo",
        desc: "Trae a todo el grupo. Una aventura todoterreno de 3 horas por el bosque lluvioso en un side by side para hasta seis personas, ideal para familias.",
        high: ["3 horas de senderos todoterreno", "Hasta 6 personas en un vehículo", "Ideal para niños y grupos mixtos"] }
    }
  ];
  const INCLUDED = {
    en: ["Bilingual local guide", "Helmet and safety gear", "Safety & driving briefing"],
    es: ["Guía local bilingüe", "Casco y equipo de seguridad", "Charla de seguridad y manejo"]
  };

  /* ---------- Interactive Expedition Map Checkpoints ---------- */
  const STOPS = [
    {
      tour: "discovery", img: "assets/img/hd/01-atv-volcano-mirador.jpg?v=9",
      en: { kicker: "01 · Base Camp · La Fortuna", title: "Safety Briefing & Practice Track", desc: "Meet your bilingual local guide, get fitted with helmet and safety gear, and test your ATV or Side by Side before entering the rainforest trails." },
      es: { kicker: "01 · Campamento Base · La Fortuna", title: "Charla de Seguridad y Práctica", desc: "Conoce a tu guía local bilingüe, recibe casco y equipo de seguridad, y prueba tu cuadra o Side by Side antes de entrar a la selva." }
    },
    {
      tour: "sbs", img: "assets/img/hd/03-jetski-action-lake.jpg?v=9",
      en: { kicker: "02 · Rainforest & River Crossings", title: "Deep Mud & Jungle Streams", desc: "Splash across shallow rainforest rivers and muddy backcountry tracks surrounded by primary tropical forest and local wildlife." },
      es: { kicker: "02 · Ríos y Senderos de Selva", title: "Barro Profundo y Ríos de Bosque", desc: "Cruza ríos poco profundos y senderos de barro rodeados de bosque tropical primario y fauna local." }
    },
    {
      tour: "maleku", img: "assets/img/hd/04-jetski-emerald-cove.jpg?v=9",
      en: { kicker: "03 · Cultural Stop · $85 Tour", title: "Maleku Indigenous Territory", desc: "On our Jungle & Maleku ATV route, visit a Maleku community to learn about their ancestral language, art and rainforest traditions." },
      es: { kicker: "03 · Parada Cultural · Tour de $85", title: "Territorio Indígena Maleku", desc: "En la ruta Selva y Maleku visitamos a la comunidad Maleku para conocer de primera mano su lengua ancestral, arte y tradiciones." }
    },
    {
      tour: "discovery", img: "assets/img/hd/02-atv-outback-volcano.jpg?v=9",
      en: { kicker: "04 · Exclusive Viewpoint · $99 / $300", title: "Base of Arenal Volcano", desc: "Reach our private viewpoint at the foot of Arenal Volcano — the only ATV route in La Fortuna that gets you this close to the colossus." },
      es: { kicker: "04 · Mirador Exclusivo · $99 / $300", title: "Base del Volcán Arenal", desc: "Llega a nuestro mirador privado al pie del Volcán Arenal: la única ruta en cuadra de La Fortuna que se acerca tanto al coloso." }
    },
    {
      tour: "jetski", img: "assets/img/hd/05-jetski-arenal-volcano.jpg?v=9",
      en: { kicker: "05 · On the Water · $109 Tour", title: "Lake Arenal Sunset Bay", desc: "Launch onto Costa Rica's largest lake on a high-powered jet ski with uninterrupted views of Arenal Volcano's western cone." },
      es: { kicker: "05 · En el Agua · Tour de $109", title: "Bahía del Lago Arenal", desc: "Navega en jet ski por el lago más grande de Costa Rica con vistas despejadas al cono del Volcán Arenal, ideal al atardecer." }
    }
  ];

  /* ---------- i18n (EN lives in the HTML) ---------- */
  const ES = {
    "skip": "Saltar al contenido",
    "util.help": "Ayuda y preguntas", "util.group": "Organizar un grupo",
    "nav.tours": "Tours", "nav.reels": "Videos", "nav.deals": "Precios", "nav.map": "Mapa de ruta", "nav.exp": "La experiencia", "nav.faq": "Preguntas", "nav.book": "Reservar",
    "hero.kicker": "La Fortuna · Arenal · Costa Rica",
    "hero.h0": "Donde la selva<br/>se une al volcán", "hero.h1": "Atardeceres sobre<br/>el Lago Arenal", "hero.h2": "Trae a todo el grupo<br/>y llénate de barro",
    "hero.cta": "Ver todos los tours", "hero.vid": "Ver 4 videos reales", "hero.wa": "WhatsApp directo",
    "finder.what": "Aventura", "finder.when": "Fecha", "finder.who": "Personas", "finder.go": "Ver disponibilidad",
    "deals.kicker": "Tarifas oficiales · La Fortuna", "deals.pop": "El más popular",
    "deals.title": "Aventuras en Arenal, desde $85", "deals.sub": "Senderos al volcán, ríos de selva y el lago más grande de Costa Rica, a minutos de La Fortuna.",
    "deals.from": "Desde", "deals.vehicle": "Por vehículo · hasta 6", "deals.view": "Ver tour →",
    "deals.t1": "Cuadra Selva y Maleku", "deals.t2": "Base del volcán", "deals.t3": "Jet ski al atardecer", "deals.t4": "Side by side familiar",
    "deals.combo": "¿Planeas más de una aventura?", "deals.comboCta": "Arma un combo de 2 tours →",
    "tours.kicker": "Salidas diarias guiadas", "tours.title": "Nuestras aventuras más populares", "tours.sub": "Grupos pequeños, guías locales y senderos que no salen en ningún mapa.", "tours.all": "Reservar cualquier tour",
    "cmp.kicker": "Calculadora interactiva de tarifas", "cmp.title": "Compara los 4 tours para tu grupo", "cmp.riders": "Personas en tu grupo:",
    "cmp.colTour": "Aventura", "cmp.colTerrain": "Terreno y ruta", "cmp.colRate": "Tarifa oficial", "cmp.colGroup": "Total grupo (<span id=\"cmpQtyNum\">2</span>)",
    "f.all": "Todos", "f.land": "En tierra", "f.water": "En agua", "f.group": "Familias",
    "p.1t": "Única ruta a la base del volcán", "p.1p": "Senderos privados para nuestros clientes.",
    "p.2t": "Charla de seguridad siempre", "p.2p": "No necesitas experiencia, te enseñamos.",
    "p.3t": "Guías locales bilingües", "p.3p": "Inglés y español, nacidos en la zona.",
    "p.4t": "Travelers' Choice 2024", "p.4p": "Reconocidos por viajeros en TripAdvisor.",
    "map.kicker": "Territorio Arenal · Mapa de Expedición", "map.title": "Sigue la ruta de la selva al volcán",
    "map.sub": "Haz clic en cada punto de nuestras rutas privadas alrededor de La Fortuna, el Volcán Arenal y el Lago Arenal.",
    "map.lake": "LAGO ARENAL", "map.volc": "VOLCÁN ARENAL · 1.670m",
    "map.tag0": "Base La Fortuna", "map.tag1": "Ríos y Barro", "map.tag2": "Maleku · $85", "map.tag3": "Base Volcán · $99", "map.tag4": "Jet Ski · $109",
    "map.viewTour": "Ver detalles del tour", "map.next": "Siguiente parada",
    "reel.live": "Clientes reales · Lago Arenal",
    "reels.kicker": "Grabado en nuestros senderos · Sin videos de stock", "reels.title": "Míralo antes de vivirlo",
    "reels.sub": "Clientes reales, barro real, lago real. Toca cualquier video para verlo con sonido.", "reels.count": "videos desde La Fortuna",
    "reels.t1": "Cuadra por el campo", "reels.m1": "Discovery Adventure · $99",
    "reels.t2": "Hacia la selva", "reels.m2": "Cuadra Selva y Maleku · $85",
    "reels.t3": "A fondo en el lago", "reels.m3": "Jet Ski Lago Arenal · $109",
    "reels.t4": "Coladas de lava de 2010", "reels.m4": "Base del Volcán Arenal",
    "exp.cap": "Mirador al pie del Arenal · Discovery Adventure", "exp.kicker": "La experiencia",
    "exp.title": "Sin carreteras. Sin prisa. Solo tú, el motor y la selva.",
    "exp.p1": "Recorríamos estos senderos mucho antes de que fueran tours. Hoy los compartimos con viajeros que buscan más que una foto: cruces de río, barro profundo, miradores tranquilos y el rugido de un volcán vivo.",
    "exp.p2": "En la ruta Maleku también compartirás con una de las comunidades indígenas de Costa Rica y escucharás su historia de primera mano.",
    "exp.f1": "tours insignia", "exp.f2": "personas por side by side", "exp.f3": "experiencia necesaria",
    "book.kicker": "Reserva directa", "book.title": "Tu lugar en el sendero está a un mensaje.",
    "book.p": "Elige tour, fecha y tamaño del grupo. Te confirmamos disponibilidad y recogida por WhatsApp, normalmente en minutos.",
    "book.s1": "Arma tu viaje", "book.s2": "Envíalo por WhatsApp", "book.s3": "Rueda y llénate de barro",
    "book.ticket": "Pase de aventura", "book.tour": "Tour principal", "book.tour2": "2.º tour (Combo Outback opcional)", "book.date": "Fecha", "book.time": "Horario", "book.people": "Personas", "book.name": "Nombre",
    "book.morning": "Mañana", "book.afternoon": "Tarde", "book.flexible": "Flexible",
    "book.total": "Total estimado", "book.taxes": "+ impuestos · confirmado por nuestro equipo", "book.send": "Enviar por WhatsApp",
    "faq.kicker": "Bueno saber", "faq.title": "Preguntas antes de rodar", "faq.ask": "Pregúntanos lo que sea",
    "pack.title": "Checklist del viajero · Toca para empacar",
    "pack.1": "Zapatos cerrados", "pack.2": "Ropa extra de cambio", "pack.3": "Identificación o pasaporte", "pack.4": "Bloqueador y repelente", "pack.5": "Teléfono / cámara de acción",
    "faq.q1": "¿Necesito experiencia para manejar una cuadra?", "faq.a1": "Para nada. Cada tour empieza con una charla de seguridad y manejo, y el guía adapta el ritmo al grupo.",
    "faq.q2": "¿Qué debo llevar?", "faq.a2": "Zapatos cerrados, ropa que se pueda ensuciar, ropa de cambio, bloqueador, repelente y tu identificación o pasaporte.",
    "faq.q3": "¿Pueden participar niños?", "faq.a3": "Sí, los niños pueden ir como acompañantes y el Side by Side es ideal para familias de hasta 6. Escríbenos para confirmar edades.",
    "faq.q4": "¿Y si llueve?", "faq.a4": "Es el bosque lluvioso: la lluvia lo hace más divertido. Si las condiciones no son seguras, reprogramamos contigo.",
    "faq.q5": "¿Los precios son por persona?", "faq.a5": "Cuadra y jet ski son por persona. El Side by Side es por vehículo (hasta 6). Impuestos no incluidos.",
    "footer.claim": "Barro. Potencia. Volcán. Repetir.", "footer.tours": "Tours", "footer.contact": "Contacto", "footer.family": "Familia de aventura", "footer.follow": "Síguenos",
    "footer.note": "Precios en USD, impuestos no incluidos.",
    "d.high": "Lo mejor", "d.inc": "Incluye", "d.book": "Reservar este tour",
    "wa.tip": "Escríbenos",
    "mbar.from": "Tours desde", "mbar.cta": "Ver fechas",
    "search.ph": "Prueba “volcán”"
  };
  const UI = {
    en: { from: "From", pp: "per person", pv: "per vehicle", ppShort: "/ person", choose: "Select →", bestVal: "Best group value", view: "Details", quick: "Book →", taxes: "+ taxes", noRes: "No tours match — try “lake” or “jungle”.",
      errDate: "Please choose a date for your tour.", errPast: "Please choose a future date.", veh: "vehicle(s)", fav: "Save tour", none2: "— Single tour only —",
      ticker: ["Ride to the base of Arenal Volcano", "TRAVELERS' CHOICE 2024", "Sunset jet ski on Lake Arenal", "BOOK DIRECT ON WHATSAPP", "Side by side for families up to 6", "NO EXPERIENCE NEEDED"] },
    es: { from: "Desde", pp: "por persona", pv: "por vehículo", ppShort: "/ persona", choose: "Elegir →", bestVal: "Mejor valor grupal", view: "Detalles", quick: "Reservar →", taxes: "+ imp.", noRes: "Sin resultados — prueba “lago” o “selva”.",
      errDate: "Por favor elige una fecha.", errPast: "Elige una fecha futura.", veh: "vehículo(s)", fav: "Guardar tour", none2: "— Solo 1 tour —",
      ticker: ["Rueda hasta la base del Volcán Arenal", "TRAVELERS' CHOICE 2024", "Jet ski al atardecer en el Lago Arenal", "RESERVA DIRECTO POR WHATSAPP", "Side by side para familias de hasta 6", "SIN EXPERIENCIA PREVIA"] }
  };

  const GALLERY = [
    { src: "assets/img/hd/02-atv-outback-volcano.jpg", en: "Outback ATV facing Arenal Volcano · The Discovery Adventure ($99)", es: "Cuadra Outback frente al Volcán Arenal · The Discovery Adventure ($99)" },
    { src: "assets/img/hd/04-jetski-emerald-cove.jpg", en: "Emerald jungle cove on Lake Arenal · Arenal Lake Jet Ski ($109)", es: "Bahía esmeralda en el Lago Arenal · Jet Ski en el Lago ($109)" },
    { src: "assets/img/hd/05-jetski-arenal-volcano.jpg", en: "Riding Lake Arenal with the volcano behind · Jet Ski ($109)", es: "Recorriendo el Lago Arenal con el volcán de fondo · Jet Ski ($109)" },
    { src: "assets/img/hd/01-atv-volcano-mirador.jpg", en: "Trail viewpoint over Arenal Volcano · The Discovery Adventure ($99)", es: "Mirador del sendero sobre el Volcán Arenal · The Discovery Adventure ($99)" },
    { src: "assets/img/hd/03-jetski-action-lake.jpg", en: "Full throttle across Lake Arenal", es: "A toda velocidad por el Lago Arenal" }
  ];
  const REELS = [
    { src: "assets/video/clip-1.mp4", poster: "assets/video/clip-1-poster.jpg", en: "Countryside ATV ride · Discovery Adventure ($99)", es: "Paseo en cuadra por el campo · Discovery Adventure ($99)" },
    { src: "assets/video/clip-2.mp4", poster: "assets/video/clip-2-poster.jpg", en: "Into the rainforest · Jungle & Maleku ATV ($85)", es: "Hacia el bosque lluvioso · Cuadra Selva y Maleku ($85)" },
    { src: "assets/video/clip-3.mp4", poster: "assets/video/clip-3-poster.jpg", en: "Full throttle on Lake Arenal · Jet Ski ($109)", es: "A toda velocidad en el Lago Arenal · Jet Ski ($109)" },
    { src: "assets/video/clip-4.mp4", poster: "assets/video/clip-4-poster.jpg", en: "2010 lava fields · Base of Arenal Volcano", es: "Coladas de lava de 2010 · Base del Volcán Arenal" }
  ];

  const EN = {};
  $$("[data-i18n]").forEach(el => { EN[el.dataset.i18n] = el.innerHTML; });
  const EN_PH = {};
  $$("[data-i18n-ph]").forEach(el => { EN_PH[el.dataset.i18nPh] = el.placeholder; });

  let lang = localStorage.getItem("lang") || ((navigator.language || "en").startsWith("es") ? "es" : "en");
  const favs = new Set(JSON.parse(localStorage.getItem("favs") || "[]"));
  const money = n => "$" + n.toLocaleString("en-US");
  const unitTxt = t => t.unit === "vehicle" ? UI[lang].pv : UI[lang].pp;
  const byId = id => TOURS.find(t => t.id === id);

  /* ---------- Render ---------- */
  let filter = "all";
  function renderCards() {
    const u = UI[lang];
    $("#rail").innerHTML = TOURS.map(t => {
      const c = t[lang];
      return `<article class="card" id="tour-${t.id}" data-tour="${t.id}" data-cats="${t.cats.join(" ")}">
        <div class="card__media" data-open="${t.id}">
          <img src="${t.img}" alt="${c.name}" loading="lazy" width="600" height="450" />
          <video class="card__vid" src="${t.video}" muted loop playsinline preload="none"></video>
          <span class="badge">${c.tag}</span>
          <button type="button" class="card__vbtn" data-reel="${t.reelIdx}">▶ Video</button>
          <button type="button" class="card__fav ${favs.has(t.id) ? "is-on" : ""}" data-fav="${t.id}" aria-label="${u.fav}" aria-pressed="${favs.has(t.id)}">
            <svg viewBox="0 0 24 24"><path d="M12 21s-7.5-4.6-9.5-9.3C1.1 8.4 3.2 4.5 7 4.5c2.1 0 3.7 1.2 5 3 1.3-1.8 2.9-3 5-3 3.8 0 5.9 3.9 4.5 7.2C19.5 16.4 12 21 12 21Z"/></svg>
          </button>
        </div>
        <div class="card__body">
          <h3 class="card__title">${c.name}</h3>
          <p class="card__meta">${c.meta}</p>
          <ul class="card__high">${c.high.slice(0, 2).map(h => `<li>${h}</li>`).join("")}</ul>
          <p class="card__price">${u.from} <strong>${money(t.price)}</strong> ${unitTxt(t)}</p>
          <span class="card__chip">${c.chip}</span>
          <div class="card__actions">
            <a href="#tour-${t.id}" class="card__link" data-open="${t.id}">${u.view}</a>
            <a href="#book" class="card__quick" data-pick="${t.id}">${u.quick}</a>
          </div>
        </div>
      </article>`;
    }).join("");
    applyFilter(filter);
  }

  function renderSelects() {
    const opts = TOURS.map(t => `<option value="${t.id}">${t[lang].name} (${money(t.price)})</option>`).join("");
    $("#bTour").innerHTML = opts; $("#bTour").value = sel;
    const b2 = $("#bTour2");
    if (b2) {
      b2.innerHTML = `<option value="">${UI[lang].none2}</option>` + TOURS.filter(t => t.id !== sel).map(t => `<option value="${t.id}">+ ${t[lang].name} (${money(t.price)})</option>`).join("");
      b2.value = sel2 && sel2 !== sel ? sel2 : "";
    }
    $("#fTour").innerHTML = TOURS.map(t => `<option value="${t.id}">${t[lang].name}</option>`).join(""); $("#fTour").value = sel;
    $("#footerTours").innerHTML = TOURS.map(t => `<li><a href="#tour-${t.id}" data-open="${t.id}">${t[lang].name}</a></li>`).join("");
  }

  /* ---------- Interactive Group Price & Tour Comparator ---------- */
  let cmpQ = 2;
  function renderCompare() {
    const body = $("#cmpBody"), u = UI[lang];
    if (!body) return;
    const qEl = $("#cmpQtyNum");
    if (qEl) qEl.textContent = cmpQ;
    $$("#cmpQty .cmp__q").forEach(b => b.classList.toggle("is-on", +b.dataset.q === cmpQ));
    const rows = TOURS.map(t => {
      const units = t.unit === "vehicle" ? Math.ceil(cmpQ / 6) : cmpQ;
      const tot = t.price * units;
      const pp = Math.round(tot / cmpQ);
      return { t, tot, pp };
    });
    const minPp = Math.min(...rows.map(r => r.pp));
    body.innerHTML = rows.map(({ t, tot, pp }) => {
      const c = t[lang];
      const isBest = cmpQ >= 4 && pp === minPp;
      return `<tr>
        <td><div class="cmp__tour"><img src="${t.img}" alt="" loading="lazy" width="46" height="36" /><div>${c.name}<small>${c.chip}</small></div></div></td>
        <td class="cmp__terrain">${c.meta}</td>
        <td class="cmp__rate"><strong>${money(t.price)}</strong> ${unitTxt(t)}</td>
        <td class="cmp__total"><strong>${money(tot)}</strong> <span class="cmp__pp ${isBest ? "cmp__pp--best" : ""}">${money(pp)} ${u.ppShort}${isBest ? ` · ${u.bestVal}` : ""}</span></td>
        <td><a href="#book" class="cmp__pick" data-cmp-pick="${t.id}">${u.choose}</a></td>
      </tr>`;
    }).join("");
  }
  $("#cmpQty")?.addEventListener("click", e => {
    const b = e.target.closest("[data-q]");
    if (!b) return;
    cmpQ = +b.dataset.q;
    renderCompare();
  });

  /* ---------- Interactive Expedition Map ---------- */
  let curStop = 0;
  const STOP_COORDS = [[620, 355], [395, 315], [250, 340], [430, 205], [155, 162]];
  const STOP_PCTS = [0, 0.25, 0.48, 0.74, 1];
  function renderRouteTabs() {
    const tabs = $("#routeTabs");
    if (!tabs) return;
    tabs.innerHTML = STOPS.map((_, i) => `<button type="button" class="rstep ${i === curStop ? "is-on" : ""}" data-stop="${i}" aria-label="Checkpoint ${i + 1}">0${i + 1}</button>`).join("");
  }
  function setStop(idx, animate = true) {
    curStop = (idx + STOPS.length) % STOPS.length;
    const s = STOPS[curStop], c = s[lang], card = $("#routeCard");
    $$(".rnode").forEach((n, i) => n.classList.toggle("is-on", i === curStop));
    $$(".rstep").forEach((b, i) => b.classList.toggle("is-on", i === curStop));
    const rider = $("#trailRider"), activePath = $("#trailActive"), basePath = $("#trailPath");
    if (rider && STOP_COORDS[curStop]) {
      const [rx, ry] = STOP_COORDS[curStop];
      rider.setAttribute("transform", `translate(${rx}, ${ry})`);
    }
    if (activePath && basePath?.getTotalLength) {
      const len = basePath.getTotalLength();
      activePath.style.strokeDasharray = `${len}`;
      activePath.style.strokeDashoffset = `${len * (1 - (STOP_PCTS[curStop] ?? 0))}`;
    }
    if (!card) return;
    const apply = () => {
      $("#rcImg").src = s.img;
      $("#rcImg").alt = c.title;
      $("#rcBadge").textContent = `0${curStop + 1} / 0${STOPS.length}`;
      $("#rcKicker").textContent = c.kicker;
      $("#rcTitle").textContent = c.title;
      $("#rcDesc").textContent = c.desc;
      $("#rcOpen").dataset.open = s.tour;
      card.classList.remove("is-swap");
    };
    if (animate) {
      card.classList.add("is-swap");
      setTimeout(apply, 140);
    } else apply();
  }
  document.addEventListener("click", e => {
    const stopEl = e.target.closest("[data-stop]");
    if (stopEl) { setStop(+stopEl.dataset.stop); return; }
  });
  $$(".rnode").forEach(n => n.addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setStop(+n.dataset.stop); }
  }));
  $("#rcNext")?.addEventListener("click", () => setStop(curStop + 1));

  function renderTicker() {
    const items = UI[lang].ticker.map((s, i) => i % 2 ? `<b>${s}</b>` : `<span>${s}</span>`).join("<i>✺</i>") + "<i>✺</i>";
    $("#tickerTrack").innerHTML = items + items;
  }

  /* ---------- Filter chips ---------- */
  function applyFilter(f) {
    filter = f;
    $$(".card").forEach(c => c.classList.toggle("is-hidden", !(f === "all" || c.dataset.cats.split(" ").includes(f))));
    $$(".chip").forEach(ch => { const on = ch.dataset.filter === f; ch.classList.toggle("is-on", on); ch.setAttribute("aria-pressed", on); });
    $("#rail").scrollTo({ left: 0, behavior: "smooth" });
  }
  $$(".chip").forEach(ch => ch.addEventListener("click", () => applyFilter(ch.dataset.filter)));

  /* ---------- Rail arrows ---------- */
  const rail = $("#rail");
  const step = () => (rail.querySelector(".card:not(.is-hidden)")?.offsetWidth || 300) + 20;
  $("#railPrev").addEventListener("click", () => rail.scrollBy({ left: -step(), behavior: "smooth" }));
  $("#railNext").addEventListener("click", () => rail.scrollBy({ left: step(), behavior: "smooth" }));

  /* ---------- Hero slideshow ---------- */
  const slides = $$(".slide"), lines = $$(".hero__line"), dots = $$("#dots button");
  let cur = 0, timer = null, paused = matchMedia("(prefers-reduced-motion: reduce)").matches;
  function go(i) {
    cur = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle("is-active", k === cur));
    lines.forEach((l, k) => l.classList.toggle("is-active", k === cur));
    dots.forEach((d, k) => d.classList.toggle("is-active", k === cur));
  }
  const play = () => {
    clearInterval(timer);
    if (paused) return;
    timer = setInterval(() => go(cur + 1), 7500);
    // restart the active dot's progress fill so it matches the fresh timer
    const d = dots[cur]; if (d) { d.classList.remove("is-active"); void d.offsetWidth; d.classList.add("is-active"); }
  };
  /* split hero lines into masked words for the staggered reveal */
  function splitHero() {
    lines.forEach(l => {
      let i = 0;
      l.innerHTML = l.innerHTML.split(/<br\s*\/?>/i).map(row =>
        row.trim().split(/\s+/).map(w => `<span class="w"><span class="w__i" style="--i:${i++}">${w}</span></span>`).join(" ")
      ).join("<br/>");
    });
  }
  $("#nextSlide").addEventListener("click", () => { go(cur + 1); play(); });
  $("#prevSlide").addEventListener("click", () => { go(cur - 1); play(); });
  dots.forEach((d, k) => d.addEventListener("click", () => { go(k); play(); }));
  const pauseBtn = $("#pauseSlide"), heroEl = $(".hero");
  pauseBtn.addEventListener("click", () => {
    paused = !paused; pauseBtn.classList.toggle("is-paused", paused); heroEl.classList.toggle("is-paused", paused);
    pauseBtn.setAttribute("aria-label", paused ? "Play slideshow" : "Pause slideshow"); play();
  });
  pauseBtn.classList.toggle("is-paused", paused); heroEl.classList.toggle("is-paused", paused);

  /* ---------- Booking (Single & 2-Tour Outback Combo) ---------- */
  let sel = TOURS[0].id, sel2 = "", qty = 2;
  const bDate = $("#bDate"), fDate = $("#fDate"), bTotal = $("#bTotal"), bTour2 = $("#bTour2"), comboBadge = $("#comboBadge");
  const iso = d => new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  bDate.min = fDate.min = iso(new Date());

  function calc(bump = false) {
    const t = byId(sel);
    const units = t.unit === "vehicle" ? Math.ceil(qty / 6) : qty;
    let total = t.price * units;
    const t2 = sel2 && sel2 !== sel ? byId(sel2) : null;
    const units2 = t2 ? (t2.unit === "vehicle" ? Math.ceil(qty / 6) : qty) : 0;
    if (t2) total += t2.price * units2;
    if (comboBadge) comboBadge.hidden = !t2;
    $("#bQty").textContent = qty;
    bTotal.textContent = money(total);
    // Update live Adventure Pass Summary strip
    const tsImg = $("#tsImg"), tsName = $("#tsName"), tsBrk = $("#tsBreakdown"), tsPp = $("#tsPerPerson"), u = UI[lang];
    if (tsImg && tsName && tsBrk && tsPp) {
      tsImg.src = t.img;
      tsName.textContent = t2 ? `${t[lang].name} + ${t2[lang].name}` : t[lang].name;
      const part1 = t.unit === "vehicle" ? `${units} ${u.veh} × ${money(t.price)}` : `${qty} × ${money(t.price)}`;
      const part2 = t2 ? ` + ${t2.unit === "vehicle" ? `${units2} ${u.veh}` : qty} × ${money(t2.price)}` : "";
      tsBrk.textContent = `${part1}${part2} (${u.taxes})`;
      tsPp.textContent = `${money(Math.round(total / qty))} ${u.ppShort}`;
    }
    if (bump) {
      bTotal.classList.remove("is-bump");
      void bTotal.offsetWidth;
      bTotal.classList.add("is-bump");
      setTimeout(() => bTotal.classList.remove("is-bump"), 260);
    }
    return { t, units, t2, units2, total };
  }
  function pick(id) {
    sel = id;
    if (sel2 === sel) sel2 = "";
    renderSelects();
    calc(true);
  }

  $("#bTour").addEventListener("change", e => pick(e.target.value));
  bTour2?.addEventListener("change", e => { sel2 = e.target.value; calc(true); });
  $("#qMinus").addEventListener("click", () => { qty = Math.max(1, qty - 1); calc(true); });
  $("#qPlus").addEventListener("click", () => { qty = Math.min(12, qty + 1); calc(true); });
  bDate.addEventListener("input", () => { bDate.classList.remove("is-bad"); $("#bError").hidden = true; });

  $("#finder").addEventListener("submit", e => {
    e.preventDefault();
    pick($("#fTour").value);
    qty = +$("#fQty").value; calc(true);
    if (fDate.value) bDate.value = fDate.value;
    $("#book").scrollIntoView({ behavior: "smooth" });
    setTimeout(() => (bDate.value ? $("#bName") : bDate).focus({ preventScroll: true }), 700);
  });

  $("#booker").addEventListener("submit", e => {
    e.preventDefault();
    const u = UI[lang], err = $("#bError");
    const fail = m => { err.textContent = m; err.hidden = false; bDate.classList.add("is-bad"); bDate.focus(); };
    if (!bDate.value) return fail(u.errDate);
    if (bDate.value < bDate.min) return fail(u.errPast);
    const { t, units, t2, total } = calc();
    const name = $("#bName").value.trim();
    const time = $("#bTime").selectedOptions[0].text;
    const n = t2 ? `${t[lang].name} + ${t2[lang].name} (Outback Combo)` : t[lang].name;
    const veh = t.unit === "vehicle" ? ` (${units} ${u.veh})` : "";
    const msg = lang === "es"
      ? ["¡Hola Outback! Quiero reservar 🌋", `• Tour: ${n}`, `• Fecha: ${bDate.value}`, `• Horario: ${time}`, `• Personas: ${qty}${veh}`, `• Total estimado: ${money(total)} + impuestos`, name && `• Nombre: ${name}`]
      : ["Hi Outback! I'd like to book 🌋", `• Tour: ${n}`, `• Date: ${bDate.value}`, `• Time: ${time}`, `• Riders: ${qty}${veh}`, `• Estimated total: ${money(total)} + taxes`, name && `• Name: ${name}`];
    if (SUPABASE_URL && SUPABASE_ANON_KEY) {
      fetch(`${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/booking_leads`, {
        method: "POST",
        keepalive: true,
        headers: {
          "Content-Type": "application/json",
          "apikey": SUPABASE_ANON_KEY,
          "Authorization": `Bearer ${SUPABASE_ANON_KEY}`,
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          primary_tour: t.id,
          combo_tour: t2 ? t2.id : null,
          tour_date: bDate.value,
          time_slot: $("#bTime").value,
          riders: qty,
          estimated_total_usd: total,
          customer_name: name || null,
          lang
        })
      }).catch(() => {});
    }
    window.open(`https://wa.me/${WA}?text=${encodeURIComponent(msg.filter(Boolean).join("\n"))}`, "_blank", "noopener");
  });

  /* ---------- Drawer (tour detail) & Lightbox Carousel ---------- */
  const drawer = $("#drawer"), lb = $("#lightbox"), lbImg = $("#lbImg"), lbCap = $("#lbCap"), lbCount = $("#lbCount");
  let lastFocus = null, lbIdx = 0;
  function showLb(idx, fade = false) {
    lbIdx = (idx + GALLERY.length) % GALLERY.length;
    const item = GALLERY[lbIdx];
    const apply = () => {
      lbImg.src = item.src;
      lbImg.alt = item[lang];
      if (lbCap) lbCap.textContent = item[lang];
      if (lbCount) lbCount.textContent = `${lbIdx + 1} / ${GALLERY.length}`;
      lbImg.classList.remove("is-switching");
    };
    if (fade) {
      lbImg.classList.add("is-switching");
      setTimeout(apply, 130);
    } else apply();
  }
  function openDrawer(id) {
    const t = byId(id), c = t[lang], u = UI[lang];
    $("#dImg").style.backgroundImage = `url('${t.img}')`;
    $("#dTag").textContent = c.tag;
    $("#dTitle").textContent = c.name;
    $("#dDesc").textContent = c.desc;
    $("#dHigh").innerHTML = c.high.map(h => `<li>${h}</li>`).join("");
    $("#dInc").innerHTML = INCLUDED[lang].map(h => `<li>${h}</li>`).join("");
    $("#dFrom").textContent = `${u.from} · ${unitTxt(t)} ${u.taxes}`;
    $("#dPrice").textContent = money(t.price);
    $("#dBook").dataset.pick = id;
    lastFocus = document.activeElement;
    drawer.hidden = false;
    document.body.style.overflow = "hidden";
    $(".drawer__x").focus();
  }
  function closeDrawer() { drawer.hidden = true; document.body.style.overflow = ""; lastFocus?.focus?.(); }
  function closeLb() { lb.hidden = true; document.body.style.overflow = ""; lastFocus?.focus?.(); }
  $("#lbPrev")?.addEventListener("click", () => showLb(lbIdx - 1, true));
  $("#lbNext")?.addEventListener("click", () => showLb(lbIdx + 1, true));

  document.addEventListener("click", e => {
    if (e.target.closest("[data-reel]")) return;
    const fav = e.target.closest("[data-fav]");
    if (fav) {
      e.stopPropagation();
      const id = fav.dataset.fav;
      favs.has(id) ? favs.delete(id) : favs.add(id);
      localStorage.setItem("favs", JSON.stringify([...favs]));
      fav.classList.toggle("is-on", favs.has(id)); fav.setAttribute("aria-pressed", favs.has(id));
      return;
    }
    const lbBtn = e.target.closest("[data-lightbox]");
    if (lbBtn) {
      lastFocus = lbBtn;
      const found = GALLERY.findIndex(g => g.src === lbBtn.dataset.lightbox);
      showLb(found >= 0 ? found : 0, false);
      lb.hidden = false;
      document.body.style.overflow = "hidden";
      $("#lbClose").focus();
      return;
    }
    const cmpPick = e.target.closest("[data-cmp-pick]");
    if (cmpPick) {
      qty = cmpQ;
      pick(cmpPick.dataset.cmpPick);
      return;
    }
    const comboBtn = e.target.closest("[data-combo]");
    if (comboBtn) {
      sel = "discovery";
      sel2 = comboBtn.dataset.combo || "jetski";
      renderSelects();
      calc(true);
      return;
    }
    const pickBtn = e.target.closest("[data-pick]");
    if (pickBtn && !e.target.closest("[data-close]")) {
      pick(pickBtn.dataset.pick);
      return;
    }
    const op = e.target.closest("[data-open]");
    if (op) { e.preventDefault(); openDrawer(op.dataset.open); return; }
    if (e.target.closest("[data-close]")) {
      if (pickBtn) pick(pickBtn.dataset.pick);
      closeDrawer();
    }
  });
  $("#lbClose").addEventListener("click", closeLb);
  lb.addEventListener("click", e => { if (e.target === lb) closeLb(); });

  /* ---------- Search ---------- */
  const sIn = $("#searchInput"), sOut = $("#searchResults");
  const norm = s => s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  sIn.addEventListener("input", () => {
    const q = norm(sIn.value.trim());
    if (!q) { sOut.hidden = true; return; }
    const hits = TOURS.filter(t => norm([t.en.name, t.en.meta, t.en.desc, t.es.name, t.es.meta, t.es.desc].join(" ")).includes(q));
    sOut.innerHTML = hits.length
      ? hits.map(t => `<li><button type="button" data-open="${t.id}"><img src="${t.img}" alt="" /><span>${t[lang].name}<small>${UI[lang].from} ${money(t.price)}</small></span></button></li>`).join("")
      : `<li class="empty">${UI[lang].noRes}</li>`;
    sOut.hidden = false;
  });
  document.addEventListener("click", e => { if (!e.target.closest(".search")) sOut.hidden = true; });

  /* ---------- Interactive Packing Checklist ---------- */
  const packed = new Set(JSON.parse(localStorage.getItem("packed") || "[]"));
  function updatePackUI() {
    const chips = $$("[data-pack]");
    chips.forEach(ch => {
      const on = packed.has(ch.dataset.pack);
      ch.classList.toggle("is-packed", on);
      ch.setAttribute("aria-pressed", on);
    });
    const cnt = $("#packCount");
    if (cnt) cnt.textContent = `${packed.size} / ${chips.length}`;
  }
  $("#packList")?.addEventListener("click", e => {
    const ch = e.target.closest("[data-pack]");
    if (!ch) return;
    const id = ch.dataset.pack;
    packed.has(id) ? packed.delete(id) : packed.add(id);
    localStorage.setItem("packed", JSON.stringify([...packed]));
    updatePackUI();
  });

  /* ---------- Language ---------- */
  function setLang(l) {
    lang = l; localStorage.setItem("lang", l); document.documentElement.lang = l;
    $$("[data-i18n]").forEach(el => { const k = el.dataset.i18n; el.innerHTML = l === "es" ? (ES[k] ?? EN[k]) : EN[k]; });
    $$("[data-i18n-ph]").forEach(el => { const k = el.dataset.i18nPh; el.placeholder = l === "es" ? (ES[k] ?? EN_PH[k]) : EN_PH[k]; });
    const spans = $$("#langToggle span");
    spans[0].classList.toggle("lang__on", l === "en"); spans[1].classList.toggle("lang__on", l === "es");
    renderCards(); renderSelects(); renderCompare(); renderTicker(); renderRouteTabs(); setStop(curStop, false); updatePackUI(); calc();
    if (!lb.hidden) showLb(lbIdx, false);
    splitHero();
  }
  $("#langToggle").addEventListener("click", () => setLang(lang === "es" ? "en" : "es"));

  /* ---------- Header, Scroll Progress, Parallax & Scroll-Spy ---------- */
  const header = $("#header"), bar = $("#progressBar"), heroParallax = $("[data-parallax]");
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  let ticking = false, lastY = scrollY;
  function onScroll() {
    const y = scrollY;
    header.classList.toggle("is-solid", y > 60);
    // smart header: hide while reading down, return on any scroll up
    if (!header.classList.contains("menu-open")) {
      if (y > 420 && y > lastY + 6) header.classList.add("is-hidden");
      else if (y < lastY - 6 || y < 420) header.classList.remove("is-hidden");
    }
    document.body.classList.toggle("show-mbar", y > innerHeight * .8);
    lastY = y;
    const h = document.documentElement.scrollHeight - innerHeight;
    if (bar) bar.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    if (heroParallax && !reduce && y < innerHeight) {
      heroParallax.style.transform = `translate3d(0, ${y * 0.28}px, 0)`;
    }
    if (y < 260) {
      $$(".menu a.is-current").forEach(a => a.classList.remove("is-current"));
    }
    ticking = false;
  }
  addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
  onScroll();

  const navLinks = $$(".menu a[href^='#']:not(.menu__book)");
  const spy = new IntersectionObserver(entries => {
    if (scrollY < 260) return;
    entries.forEach(en => {
      if (en.isIntersecting) navLinks.forEach(a => a.classList.toggle("is-current", a.getAttribute("href") === "#" + en.target.id));
    });
  }, { rootMargin: "-42% 0px -50% 0px" });
  ["deals", "tours", "map", "experience", "faq", "book"].forEach(id => { const s = document.getElementById(id); if (s) spy.observe(s); });

  /* ---------- Mobile menu ---------- */
  const burger = $("#burger"), menu = $("#menu");
  const closeMenu = () => { menu.classList.remove("is-open"); header.classList.remove("menu-open"); burger.setAttribute("aria-expanded", "false"); document.body.style.overflow = ""; };
  burger.addEventListener("click", () => {
    const open = !menu.classList.contains("is-open");
    menu.classList.toggle("is-open", open); header.classList.toggle("menu-open", open); header.classList.remove("is-hidden");
    burger.setAttribute("aria-expanded", open);
    document.body.style.overflow = open ? "hidden" : "";
  });
  menu.addEventListener("click", e => { if (e.target.closest("a")) closeMenu(); });
  addEventListener("keydown", e => {
    if (e.key === "Escape") { if (!lb.hidden) closeLb(); if (!drawer.hidden) closeDrawer(); closeMenu(); sOut.hidden = true; }
    if (!lb.hidden && e.key === "ArrowRight") showLb(lbIdx + 1, true);
    if (!lb.hidden && e.key === "ArrowLeft") showLb(lbIdx - 1, true);
  });

  /* ---------- Reveal on scroll ---------- */
  const io = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }), { threshold: .12 });
  $$(".head, .tile, .cmp, .promise__item, .route__canvas, .route__card, .experience__photo, .experience__text, .mosaic__item, .book__intro, .ticket, .faq > div, .faq__list details").forEach((el, i) => {
    el.classList.add("rv"); el.style.transitionDelay = `${(i % 3) * 70}ms`; io.observe(el);
  });

  /* ---------- Iteration 6 & 7: counters, tilt, drag-rail, magnetic CTAs, intro ---------- */
  // Bento prices count up cleanly from 75% to 100% on first viewport entry
  const countIO = new IntersectionObserver(es => es.forEach(en => {
    if (!en.isIntersecting) return;
    const el = en.target, end = +el.dataset.to, start = Math.round(end * .72), t0 = performance.now(), dur = 360;
    countIO.unobserve(el);
    const step = now => {
      const p = Math.min(1, (now - t0) / dur);
      el.textContent = "$" + Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }), { threshold: .25 });
  if (!reduce) $$(".tile__price").forEach(el => { el.dataset.to = parseInt(el.textContent.replace(/\D/g, ""), 10); countIO.observe(el); });

  // Subtle 3D tilt on tour cards + magnetic pull on lava CTAs (mouse/trackpad only)
  if (!reduce && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    rail.addEventListener("pointermove", e => {
      const c = e.target.closest(".card"); if (!c) return;
      const r = c.getBoundingClientRect();
      c.style.setProperty("--ry", (((e.clientX - r.left) / r.width - .5) * 7).toFixed(2) + "deg");
      c.style.setProperty("--rx", ((.5 - (e.clientY - r.top) / r.height) * 7).toFixed(2) + "deg");
    });
    rail.addEventListener("pointerout", e => {
      const c = e.target.closest(".card");
      if (c && !c.contains(e.relatedTarget)) { c.style.removeProperty("--rx"); c.style.removeProperty("--ry"); }
    });
    $$(".pill--lava").forEach(btn => {
      btn.addEventListener("pointermove", e => {
        const r = btn.getBoundingClientRect();
        btn.style.setProperty("--mx", ((e.clientX - (r.left + r.width / 2)) * .16).toFixed(1) + "px");
        btn.style.setProperty("--my", ((e.clientY - (r.top + r.height / 2)) * .22).toFixed(1) + "px");
      });
      btn.addEventListener("pointerleave", () => { btn.style.removeProperty("--mx"); btn.style.removeProperty("--my"); });
    });
  }

  // Pointer drag-to-scroll on #rail when horizontal scrolling is active
  let isDown = false, startX = 0, scrollL = 0;
  rail.addEventListener("pointerdown", e => {
    if (rail.scrollWidth <= rail.clientWidth || e.target.closest("a, button")) return;
    isDown = true; startX = e.clientX; scrollL = rail.scrollLeft; rail.classList.add("is-drag");
  });
  addEventListener("pointermove", e => {
    if (!isDown) return;
    rail.scrollLeft = scrollL - (e.clientX - startX);
  });
  addEventListener("pointerup", () => { isDown = false; rail.classList.remove("is-drag"); });

  // Hide the sticky bar + floating WhatsApp while the booking ticket is on screen (mobile)
  const bookIO = new IntersectionObserver(([en]) => document.body.classList.toggle("at-book", en.isIntersecting), { threshold: .12 });
  bookIO.observe($("#book"));

  /* ---------- Iteration 8: real-footage reels ---------- */
  // Inline reels autoplay (muted) only while on screen, with a progress bar
  const inlineVids = $$("video[data-autoplay]");
  const vidIO = new IntersectionObserver(es => es.forEach(en => {
    const v = en.target;
    if (en.isIntersecting && !reduce && vm.hidden) { v.preload = "auto"; v.play().catch(() => {}); }
    else v.pause();
  }), { threshold: .35 });
  inlineVids.forEach(v => {
    vidIO.observe(v);
    const bar = v.parentElement.querySelector(".reel__bar i");
    if (bar) v.addEventListener("timeupdate", () => { if (v.duration) bar.style.setProperty("--p", (v.currentTime / v.duration).toFixed(3)); });
  });
  rail.addEventListener("pointerover", e => {
    const c = e.target.closest(".card");
    if (!c || reduce) return;
    const v = c.querySelector(".card__vid");
    if (v && v.paused) { v.preload = "auto"; v.play().catch(() => {}); c.classList.add("is-playing"); }
  });
  rail.addEventListener("pointerout", e => {
    const c = e.target.closest(".card");
    if (!c || c.contains(e.relatedTarget)) return;
    const v = c.querySelector(".card__vid");
    if (v) { v.pause(); c.classList.remove("is-playing"); }
  });

  // Fullscreen player with sound, prev/next, keyboard
  const vm = $("#vmodal"), vmVideo = $("#vmVideo");
  let vmIdx = 0, vmFocus = null;
  function showReel(i) {
    vmIdx = (i + REELS.length) % REELS.length;
    const r = REELS[vmIdx];
    vmVideo.poster = r.poster; vmVideo.src = r.src; vmVideo.muted = false;
    vmVideo.style.animation = "none"; void vmVideo.offsetWidth; vmVideo.style.animation = "";
    $("#vmCap").textContent = r[lang];
    $("#vmCount").textContent = `${vmIdx + 1} / ${REELS.length}`;
    vmVideo.play().catch(() => {});
  }
  function openReel(i, from) {
    vmFocus = from || document.activeElement;
    inlineVids.forEach(v => v.pause());
    vm.hidden = false; document.body.style.overflow = "hidden";
    showReel(i); $("#vmClose").focus();
  }
  function closeReel() {
    vmVideo.pause(); vmVideo.removeAttribute("src"); vmVideo.load();
    vm.hidden = true; document.body.style.overflow = "";
    inlineVids.forEach(v => { const r = v.getBoundingClientRect(); if (!reduce && r.bottom > 0 && r.top < innerHeight) v.play().catch(() => {}); });
    vmFocus?.focus?.();
  }
  document.addEventListener("click", e => { const b = e.target.closest("[data-reel]"); if (b) openReel(+b.dataset.reel, b); });
  $("#vmClose").addEventListener("click", closeReel);
  $("#vmPrev").addEventListener("click", () => showReel(vmIdx - 1));
  $("#vmNext").addEventListener("click", () => showReel(vmIdx + 1));
  vm.addEventListener("click", e => { if (e.target === vm) closeReel(); });
  vmVideo.addEventListener("ended", () => showReel(vmIdx + 1));
  addEventListener("keydown", e => {
    if (vm.hidden) return;
    if (e.key === "Escape") closeReel();
    if (e.key === "ArrowRight") showReel(vmIdx + 1);
    if (e.key === "ArrowLeft") showReel(vmIdx - 1);
  });
  spy.observe($("#reels"));

  /* ---------- Init ---------- */
  $("#year").textContent = new Date().getFullYear();
  setLang(lang);
  const intro = $("#intro");
  const seenIntro = sessionStorage.getItem("outback_intro");
  const startHero = () => { go(0); play(); };
  if (reduce || !intro || seenIntro) { intro?.remove(); startHero(); }
  else {
    sessionStorage.setItem("outback_intro", "1");
    lines.forEach(l => l.classList.remove("is-active"));
    setTimeout(() => intro.classList.add("is-done"), 850);
    setTimeout(startHero, 1080);
    setTimeout(() => intro.remove(), 1800);
  }
})();
