(function () {
  const data = window.DEALERSHIP_DATA || {};
  const body = document.body;
  const page = body.dataset.page;
  const dealerKey = body.dataset.dealer;
  const basePath = body.dataset.basePath || "./";

  function assetPath(path) {
    return `${basePath}${path}`;
  }

  function buildBrandMark(dealer, detailLabel) {
    const secondaryLabel = detailLabel || dealer.wordmarkSecondary || dealer.eyebrow;
    const logo = dealer.logo
      ? `
        <img
          class="brand-mark__logo"
          src="${assetPath(dealer.logo)}"
          alt="${dealer.logoAlt || dealer.name}"
        />
      `
      : `<span class="brand-mark__icon">${dealer.shortName}</span>`;

    return `
      <a class="brand-mark" href="./index.html">
        <span class="brand-mark__media">${logo}</span>
        <span class="brand-mark__text">
          <strong>${dealer.wordmarkPrimary || dealer.name}</strong>
          <small>${secondaryLabel}</small>
        </span>
      </a>
    `;
  }

  function currencyTag(price) {
    return `<span class="price-pill">${price}</span>`;
  }

  function vehicleVisual(vehicle, compact) {
    return `
      <div class="vehicle-visual ${compact ? "compact" : ""}">
        <div class="vehicle-visual__glow"></div>
        <div class="vehicle-visual__panel">
          <span>${vehicle.segment}</span>
          <strong>${vehicle.name}</strong>
          <small>${vehicle.color}</small>
        </div>
        <div class="vehicle-visual__road"></div>
      </div>
    `;
  }

  function buildInventoryCards(dealer) {
    return dealer.inventory
      .map(
        (vehicle) => `
          <article class="inventory-card">
            <div class="inventory-card__media">
              ${vehicleVisual(vehicle, true)}
              <span class="inventory-card__badge">${vehicle.badge}</span>
            </div>
            <div class="inventory-card__body">
              <div class="inventory-card__head">
                <div>
                  <p class="micro-copy">${vehicle.year} | ${vehicle.km}</p>
                  <h3>${vehicle.name}</h3>
                </div>
                ${currencyTag(vehicle.price)}
              </div>
              <p>${vehicle.description}</p>
              <ul class="spec-list">
                <li>${vehicle.transmission}</li>
                <li>${vehicle.fuel}</li>
                <li>${vehicle.segment}</li>
              </ul>
              <a class="button button--ghost" href="./vehiculo.html?modelo=${vehicle.id}">Ver ficha completa</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function buildDealerPage(dealer) {
    body.style.setProperty("--brand", dealer.accent);
    body.style.setProperty("--brand-secondary", dealer.brandSecondary || dealer.accentDark);
    body.style.setProperty("--brand-contrast", dealer.brandContrast || "#ffffff");
    body.style.setProperty("--brand-soft", dealer.accentSoft);
    body.style.setProperty("--brand-dark", dealer.accentDark);
    body.style.setProperty("--surface", dealer.surface);

    return `
      <div class="site-shell">
        <header class="site-header">
          ${buildBrandMark(dealer)}
          <nav class="main-nav">
            <a href="#stock">Stock</a>
            <a href="#servicios">Servicios</a>
            <a href="#ia">Asistente IA</a>
            <a href="${dealer.mapUrl}" target="_blank" rel="noreferrer">Ubicacion</a>
          </nav>
          <a class="button" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">WhatsApp</a>
        </header>

        <main>
          <section class="hero-section">
            <div class="hero-grid">
              <div class="hero-copy">
                <p class="eyebrow">${dealer.eyebrow}</p>
                <h1>${dealer.heroTitle}</h1>
                <p class="lead">${dealer.heroLead}</p>
                <div class="hero-actions">
                  <a class="button" href="#stock">Ver destacados</a>
                  <a class="button button--ghost" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">Consultar ahora</a>
                </div>
                <div class="stats-row">
                  ${dealer.stats
                    .map(
                      (stat) => `
                        <article class="stat-card">
                          <strong>${stat.value}</strong>
                          <p>${stat.label}</p>
                        </article>
                      `
                    )
                    .join("")}
                </div>
              </div>
              <div class="hero-stage">
                ${vehicleVisual(dealer.inventory[0], false)}
                <div class="hero-stage__panel">
                  <p>Hoy la propuesta digital puede verse asi:</p>
                  <strong>${dealer.promise}</strong>
                  <small>${dealer.address}</small>
                </div>
              </div>
            </div>
          </section>

          <section class="trust-strip">
            ${dealer.highlights
              .map(
                (item) => `
                  <div class="trust-strip__item">
                    <span></span>
                    <p>${item}</p>
                  </div>
                `
              )
              .join("")}
          </section>

          <section class="inventory-section" id="stock">
            <div class="section-heading">
              <p class="eyebrow">Stock destacado</p>
              <h2>Vehiculos preparados para generar consulta.</h2>
              <p>La estructura permite destacar usados, oportunidades de entrega y unidades de perfil premium segun la marca.</p>
            </div>
            <div class="inventory-grid">
              ${buildInventoryCards(dealer)}
            </div>
          </section>

          <section class="services-section" id="servicios">
            <div class="section-heading">
              <p class="eyebrow">Servicios</p>
              <h2>Una web pensada para vender mejor, no solo para existir.</h2>
            </div>
            <div class="service-grid">
              ${dealer.services
                .map(
                  (service) => `
                    <article class="service-card">
                      <h3>${dealer.name}</h3>
                      <p>${service}</p>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>

          <section class="contact-band">
            <div>
              <p class="eyebrow">Contacto directo</p>
              <h2>${dealer.phone}</h2>
              <p>${dealer.address}</p>
              <p>${dealer.hours}</p>
            </div>
            <div class="contact-band__actions">
              <a class="button" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">Hablar por WhatsApp</a>
              <a class="button button--ghost" href="${dealer.mapUrl}" target="_blank" rel="noreferrer">Como llegar</a>
            </div>
          </section>

          <section class="testimonial-section">
            ${dealer.testimonials
              .map(
                (item) => `
                  <article class="quote-card">
                    <p>"${item.quote}"</p>
                    <strong>${item.author}</strong>
                  </article>
                `
              )
              .join("")}
          </section>
        </main>

        <aside class="chat-widget" id="ia">
          <div class="chat-widget__header">
            <div>
              <small>Asistente IA 24/7</small>
              <strong>${dealer.name}</strong>
            </div>
            <span class="chat-widget__status">En linea</span>
          </div>
          <div class="chat-messages" id="chat-messages"></div>
          <div class="chat-suggestions" id="chat-suggestions"></div>
          <form class="chat-form" id="chat-form">
            <input id="chat-input" type="text" placeholder="Escribi tu consulta..." />
            <button class="button" type="submit">Enviar</button>
          </form>
        </aside>
      </div>
    `;
  }

  function buildVehiclePage(dealer, vehicle) {
    body.style.setProperty("--brand", dealer.accent);
    body.style.setProperty("--brand-secondary", dealer.brandSecondary || dealer.accentDark);
    body.style.setProperty("--brand-contrast", dealer.brandContrast || "#ffffff");
    body.style.setProperty("--brand-soft", dealer.accentSoft);
    body.style.setProperty("--brand-dark", dealer.accentDark);
    body.style.setProperty("--surface", dealer.surface);

    return `
      <div class="site-shell detail-shell">
        <header class="site-header">
          ${buildBrandMark(dealer, "Ficha del vehiculo")}
          <a class="button button--ghost" href="./index.html">Volver al stock</a>
        </header>

        <main class="vehicle-page">
          <section class="vehicle-hero">
            <div class="vehicle-hero__copy">
              <p class="eyebrow">${vehicle.badge}</p>
              <h1>${vehicle.name}</h1>
              <p class="lead">${vehicle.description}</p>
              <div class="price-row">
                ${currencyTag(vehicle.price)}
                <span class="micro-copy">${vehicle.year} | ${vehicle.km}</span>
              </div>
              <div class="hero-actions">
                <a class="button" href="https://wa.me/${dealer.whatsapp}?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(vehicle.name)}" target="_blank" rel="noreferrer">Consultar este vehiculo</a>
                <a class="button button--ghost" href="${dealer.mapUrl}" target="_blank" rel="noreferrer">Ver ubicacion</a>
              </div>
            </div>
            <div class="vehicle-stage-large">
              ${vehicleVisual(vehicle, false)}
            </div>
          </section>

          <section class="detail-grid">
            <article class="detail-card">
              <p class="eyebrow">Ficha tecnica</p>
              <h2>Datos principales</h2>
              <ul class="detail-list">
                <li><strong>Ano:</strong> ${vehicle.year}</li>
                <li><strong>Kilometraje:</strong> ${vehicle.km}</li>
                <li><strong>Transmision:</strong> ${vehicle.transmission}</li>
                <li><strong>Combustible:</strong> ${vehicle.fuel}</li>
                <li><strong>Segmento:</strong> ${vehicle.segment}</li>
                <li><strong>Color:</strong> ${vehicle.color}</li>
              </ul>
            </article>

            <article class="detail-card">
              <p class="eyebrow">Equipamiento</p>
              <h2>Lo que destaca</h2>
              <ul class="detail-list">
                ${vehicle.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
            </article>

            <article class="detail-card">
              <p class="eyebrow">Por que suma</p>
              <h2>Perfil comercial</h2>
              <p>${vehicle.hook}</p>
              <p>${dealer.promise}</p>
            </article>
          </section>

          <section class="contact-band">
            <div>
              <p class="eyebrow">Seguimos por aca</p>
              <h2>${dealer.name}</h2>
              <p>${dealer.address}</p>
              <p>${dealer.hours}</p>
            </div>
            <div class="contact-band__actions">
              <a class="button" href="https://wa.me/${dealer.whatsapp}?text=Hola%2C%20quiero%20mas%20info%20sobre%20el%20${encodeURIComponent(vehicle.name)}" target="_blank" rel="noreferrer">Hablar con ventas</a>
              <a class="button button--ghost" href="tel:${dealer.phone.replace(/\s+/g, "")}">Llamar ahora</a>
            </div>
          </section>
        </main>
      </div>
    `;
  }

  function buildHubCard(dealer) {
    return `
      <article class="hub-card" style="--card-brand:${dealer.accent}; --card-surface:${dealer.surface};">
        <div class="hub-card__brand">
          <img
            class="hub-card__logo"
            src="${assetPath(dealer.logo)}"
            alt="${dealer.logoAlt || dealer.name}"
          />
        </div>
        <p class="eyebrow">${dealer.eyebrow}</p>
        <h2>${dealer.name}</h2>
        <p>${dealer.tagline}</p>
        <ul class="hub-card__list">
          <li>Landing comercial</li>
          <li>Stock destacado</li>
          <li>Ficha individual</li>
          <li>Demo de asistente IA</li>
        </ul>
        <div class="hub-card__actions">
          <a class="button" href="./${dealer.slug}/index.html">Abrir prototipo</a>
          <a class="button button--ghost" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">Ver CTA real</a>
        </div>
      </article>
    `;
  }

  function renderHub() {
    const grid = document.getElementById("hub-grid");
    if (!grid) return;
    grid.innerHTML = Object.values(data)
      .map((dealer) => buildHubCard(dealer))
      .join("");
  }

  function botReply(dealer, message) {
    const text = message.toLowerCase();
    if (text.includes("whatsapp") || text.includes("contacto")) {
      return `Podes escribirnos ahora mismo al ${dealer.phone} o tocar el boton de WhatsApp para seguir la consulta con el equipo comercial.`;
    }
    if (text.includes("pickup")) {
      const pickup = dealer.inventory.find((vehicle) => vehicle.segment === "Pickup");
      return pickup
        ? `Tenemos una opcion que encaja muy bien: ${pickup.name}, ${pickup.year}, ${pickup.km}. Si queres, te llevo directo a la ficha o armamos una consulta para coordinar visita.`
        : "En este momento te conviene dejarnos tu consulta y te mostramos las opciones disponibles segun ingreso y uso.";
    }
    if (text.includes("suv")) {
      const suv = dealer.inventory.find((vehicle) => vehicle.segment === "SUV" || vehicle.segment === "Crossover");
      return suv
        ? `Para perfil SUV te destacaria ${suv.name}. Tiene ${suv.transmission.toLowerCase()}, ${suv.km} y una presentacion muy fuerte para uso familiar o diario.`
        : "Podemos ayudarte a encontrar una opcion comoda para ciudad o familia segun presupuesto y disponibilidad.";
    }
    if (text.includes("usado")) {
      return "Si tenes un usado, podemos tomar tus datos y orientar la operacion para avanzar mas rapido con el cambio.";
    }
    if (text.includes("papeles") || text.includes("tramite") || text.includes("document")) {
      return "La idea de este sitio es que tambien pueda explicar pasos, documentacion y tiempos para que la compra se sienta mucho mas simple.";
    }
    if (text.includes("precio") || text.includes("cuota") || text.includes("financi")) {
      return "Podemos trabajar valores de referencia, opciones de financiacion y seguimiento por WhatsApp para que el cliente no se quede con dudas en el medio.";
    }
    return "Puedo ayudarte con stock, financiacion, ubicacion o contacto directo. Si queres, contame que tipo de vehiculo buscas y te oriento con una opcion.";
  }

  function appendMessage(target, text, role) {
    const item = document.createElement("div");
    item.className = `chat-bubble chat-bubble--${role}`;
    item.textContent = text;
    target.appendChild(item);
    target.scrollTop = target.scrollHeight;
  }

  function setupChat(dealer) {
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    const messages = document.getElementById("chat-messages");
    const suggestions = document.getElementById("chat-suggestions");
    if (!form || !input || !messages || !suggestions) return;

    appendMessage(messages, dealer.chat.welcome, "bot");

    dealer.chat.suggestions.forEach((suggestion) => {
      const button = document.createElement("button");
      button.className = "suggestion-pill";
      button.type = "button";
      button.textContent = suggestion;
      button.addEventListener("click", function () {
        appendMessage(messages, suggestion, "user");
        window.setTimeout(function () {
          appendMessage(messages, botReply(dealer, suggestion), "bot");
        }, 300);
      });
      suggestions.appendChild(button);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      appendMessage(messages, value, "user");
      input.value = "";
      window.setTimeout(function () {
        appendMessage(messages, botReply(dealer, value), "bot");
      }, 340);
    });
  }

  function renderDealer() {
    const dealer = data[dealerKey];
    const root = document.getElementById("site-root");
    if (!dealer || !root) return;
    root.innerHTML = buildDealerPage(dealer);
    setupChat(dealer);
  }

  function renderVehicle() {
    const dealer = data[dealerKey];
    const root = document.getElementById("site-root");
    if (!dealer || !root) return;
    const params = new URLSearchParams(window.location.search);
    const vehicleId = params.get("modelo") || dealer.inventory[0].id;
    const vehicle = dealer.inventory.find((item) => item.id === vehicleId) || dealer.inventory[0];
    root.innerHTML = buildVehiclePage(dealer, vehicle);
  }

  if (page === "hub") {
    renderHub();
  }

  if (page === "dealer") {
    renderDealer();
  }

  if (page === "vehicle") {
    renderVehicle();
  }
})();
