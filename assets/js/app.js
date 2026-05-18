(function () {
  const data = window.DEALERSHIP_DATA || {};
  const body = document.body;
  const page = body.dataset.page;
  const dealerKey = body.dataset.dealer;
  const basePath = body.dataset.basePath || "./";

  function resolveAssetPath(path) {
    if (!path) return "";
    if (/^(https?:|data:|file:)/i.test(path)) return path;
    return `${basePath}${path.replace(/^\.\//, "")}`;
  }

  function phoneHref(phone) {
    return `tel:${phone.replace(/[^\d+]/g, "")}`;
  }

  function currencyTag(price, note) {
    return `
      <div class="price-stack">
        <span class="price-pill">${price}</span>
        ${note ? `<small>${note}</small>` : ""}
      </div>
    `;
  }

  function getVehicleImages(vehicle) {
    return Array.isArray(vehicle.images) ? vehicle.images.filter(Boolean) : [];
  }

  function buildBrandMark(dealer, detailLabel) {
    const secondaryLabel = detailLabel || dealer.wordmarkSecondary || dealer.eyebrow;
    const logo = dealer.logo
      ? `<img class="brand-mark__logo" src="${resolveAssetPath(dealer.logo)}" alt="${dealer.logoAlt || dealer.name}" />`
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

  function buildVehicleVisual(vehicle, compact) {
    const images = getVehicleImages(vehicle);
    if (images.length > 0) {
      return `
        <div class="vehicle-photo ${compact ? "vehicle-photo--compact" : ""}">
          <img src="${resolveAssetPath(images[0])}" alt="${vehicle.name}" loading="lazy" />
        </div>
      `;
    }

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
              ${buildVehicleVisual(vehicle, true)}
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
              <a class="button button--ghost" href="./vehiculo.html?modelo=${vehicle.id}">Ver este vehiculo</a>
            </div>
          </article>
        `
      )
      .join("");
  }

  function buildHubCard(dealer) {
    return `
      <article class="hub-card" style="--card-brand:${dealer.accent}; --card-surface:${dealer.surface};">
        <div class="hub-card__brand">
          <img class="hub-card__logo" src="${resolveAssetPath(dealer.logo)}" alt="${dealer.logoAlt || dealer.name}" />
        </div>
        <p class="eyebrow">${dealer.eyebrow}</p>
        <h2>${dealer.name}</h2>
        <p>${dealer.tagline}</p>
        <ul class="hub-card__list">
          <li>Inicio comercial</li>
          <li>Destacados del stock</li>
          <li>Ficha completa del vehiculo</li>
          <li>Asesor virtual 24/7</li>
        </ul>
        <div class="hub-card__actions">
          <a class="button" href="./${dealer.slug}/index.html">Abrir prototipo</a>
          <a class="button button--ghost" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">Ir a WhatsApp</a>
        </div>
      </article>
    `;
  }

  function buildChat(dealer) {
    return `
      <aside class="chat-widget" id="ia" data-chat-slug="${dealer.slug}">
        <div class="chat-widget__header">
          <div class="chat-widget__identity">
            <img class="chat-widget__avatar" src="${resolveAssetPath(dealer.logo)}" alt="${dealer.logoAlt || dealer.name}" />
            <div>
              <small>Asesor virtual 24/7</small>
              <strong>${dealer.name}</strong>
            </div>
          </div>
          <div class="chat-widget__header-actions">
            <span class="chat-widget__status">En linea</span>
            <button class="chat-widget__toggle" id="chat-toggle" type="button" aria-label="Minimizar chat">-</button>
          </div>
        </div>
        <div class="chat-widget__body" id="chat-body">
          <div class="chat-messages" id="chat-messages"></div>
          <div class="chat-suggestions" id="chat-suggestions"></div>
          <form class="chat-form" id="chat-form">
            <input id="chat-input" type="text" placeholder="Escribi tu consulta..." />
            <button class="button" type="submit">Enviar</button>
          </form>
        </div>
      </aside>
    `;
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
            <a href="#ia">Asesor online</a>
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
                  <a class="button button--ghost" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">Hablar con ventas</a>
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
                ${buildVehicleVisual(dealer.inventory[0], false)}
                <div class="hero-stage__panel">
                  <p>${dealer.supportMessage}</p>
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
              <p class="eyebrow">Destacados</p>
              <h2>Vehiculos listos para llamar la atencion.</h2>
              <p>Elegimos una muestra del tipo de unidades que mejor se pueden presentar online para generar consultas.</p>
            </div>
            <div class="inventory-grid">
              ${buildInventoryCards(dealer)}
            </div>
          </section>

          <section class="services-section" id="servicios">
            <div class="section-heading">
              <p class="eyebrow">Atencion y servicio</p>
              <h2>Una web que acompana la venta desde el primer mensaje.</h2>
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

        ${buildChat(dealer)}
      </div>
    `;
  }

  function buildVehicleGallery(vehicle) {
    const images = getVehicleImages(vehicle);
    const firstImage = images[0];

    const mainVisual = firstImage
      ? `
        <div class="vehicle-gallery__main">
          <img id="vehicle-main-image" src="${resolveAssetPath(firstImage)}" alt="${vehicle.name}" />
        </div>
      `
      : `
        <div class="vehicle-gallery__main vehicle-gallery__main--visual">
          <div class="vehicle-gallery__fallback">
            ${buildVehicleVisual(vehicle, false)}
          </div>
        </div>
      `;

    const thumbs = images.length
      ? `
        <div class="vehicle-gallery__thumbs">
          ${images
            .map(
              (image, index) => `
                <button
                  class="vehicle-thumb ${index === 0 ? "is-active" : ""}"
                  type="button"
                  data-gallery-thumb
                  data-image="${resolveAssetPath(image)}"
                >
                  <img src="${resolveAssetPath(image)}" alt="${vehicle.name} foto ${index + 1}" loading="lazy" />
                </button>
              `
            )
            .join("")}
        </div>
      `
      : `
        <div class="vehicle-gallery__hint">
          <strong>Listo para fotos reales</strong>
          <p>Cuando sumes imagenes en este vehiculo, aca va a aparecer la galeria principal con miniaturas.</p>
        </div>
      `;

    return `
      <section class="vehicle-gallery">
        ${mainVisual}
        ${thumbs}
      </section>
    `;
  }

  function buildSummaryItems(vehicle) {
    return [
      { label: "Ano", value: vehicle.year },
      { label: "Kilometraje", value: vehicle.km },
      { label: "Caja", value: vehicle.transmission },
      { label: "Combustible", value: vehicle.fuel },
      { label: "Segmento", value: vehicle.segment },
      { label: "Color", value: vehicle.color }
    ];
  }

  function buildRelatedVehicles(dealer, currentVehicleId) {
    return dealer.inventory
      .filter((vehicle) => vehicle.id !== currentVehicleId)
      .slice(0, 2)
      .map(
        (vehicle) => `
          <article class="related-card">
            <div class="related-card__media">
              ${buildVehicleVisual(vehicle, true)}
            </div>
            <div class="related-card__body">
              <p class="micro-copy">${vehicle.year} | ${vehicle.km}</p>
              <h3>${vehicle.name}</h3>
              <p>${vehicle.description}</p>
              <a class="button button--ghost" href="./vehiculo.html?modelo=${vehicle.id}">Ver detalle</a>
            </div>
          </article>
        `
      )
      .join("");
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
          <a class="button button--ghost" href="./index.html">Volver al inicio</a>
        </header>

        <main class="vehicle-page">
          <section class="vehicle-detail-grid">
            ${buildVehicleGallery(vehicle)}

            <aside class="vehicle-summary">
              <div class="vehicle-summary__top">
                <p class="eyebrow">${vehicle.badge}</p>
                <h1>${vehicle.name}</h1>
                <p class="lead">${vehicle.salesPitch}</p>
              </div>

              <div class="vehicle-summary__price">
                ${currencyTag(vehicle.price, vehicle.priceNote)}
                <span class="vehicle-summary__meta">${vehicle.year} | ${vehicle.km}</span>
              </div>

              <div class="vehicle-summary__cta">
                <a class="button" href="https://wa.me/${dealer.whatsapp}?text=Hola%2C%20me%20interesa%20el%20${encodeURIComponent(vehicle.name)}" target="_blank" rel="noreferrer">Consultar por WhatsApp</a>
                <a class="button button--ghost" href="${dealer.mapUrl}" target="_blank" rel="noreferrer">Ver ubicacion</a>
              </div>

              <div class="vehicle-summary__seller">
                <img class="vehicle-summary__seller-logo" src="${resolveAssetPath(dealer.logo)}" alt="${dealer.logoAlt || dealer.name}" />
                <div>
                  <strong>${dealer.name}</strong>
                  <p>${dealer.promise}</p>
                </div>
              </div>

              <ul class="vehicle-summary__list">
                ${buildSummaryItems(vehicle)
                  .map((item) => `<li><span>${item.label}</span><strong>${item.value}</strong></li>`)
                  .join("")}
              </ul>
            </aside>
          </section>

          <section class="vehicle-info-grid">
            <article class="detail-card detail-card--wide">
              <p class="eyebrow">Sobre este vehiculo</p>
              <h2>Una presentacion pensada para vender mejor.</h2>
              <p>${vehicle.descriptionLong}</p>
              <p>${vehicle.hook}</p>
            </article>

            <article class="detail-card">
              <p class="eyebrow">Equipamiento</p>
              <h2>Lo que mas mira el cliente</h2>
              <ul class="detail-list">
                ${vehicle.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
            </article>
          </section>

          <section class="vehicle-commercial-band">
            <div>
              <p class="eyebrow">Atencion directa</p>
              <h2>${dealer.phone}</h2>
              <p>${dealer.address}</p>
              <p>${dealer.hours}</p>
            </div>
            <div class="contact-band__actions">
              <a class="button" href="https://wa.me/${dealer.whatsapp}?text=Hola%2C%20quiero%20mas%20info%20del%20${encodeURIComponent(vehicle.name)}" target="_blank" rel="noreferrer">Quiero mas informacion</a>
              <a class="button button--ghost" href="${phoneHref(dealer.phone)}">Llamar ahora</a>
            </div>
          </section>

          <section class="related-section">
            <div class="section-heading">
              <p class="eyebrow">Tambien te puede interesar</p>
              <h2>Otras opciones para seguir mirando.</h2>
            </div>
            <div class="related-grid">
              ${buildRelatedVehicles(dealer, vehicle.id)}
            </div>
          </section>
        </main>
      </div>
    `;
  }

  function botReply(dealer, message) {
    const text = message.toLowerCase();
    if (text.includes("whatsapp") || text.includes("ventas") || text.includes("hablar")) {
      return `Perfecto. Podes escribirnos ahora mismo al ${dealer.phone} o tocar el boton verde para seguir la charla con el equipo de ventas.`;
    }
    if (text.includes("pickup")) {
      const pickup = dealer.inventory.find((vehicle) => vehicle.segment === "Pickup");
      return pickup
        ? `Si buscas una pickup, miraria primero la ${pickup.name}. Tiene ${pickup.km} y es una opcion muy fuerte para trabajo y uso diario.`
        : "Contame un poco mas que uso le queres dar y te orientamos con una opcion de ese perfil.";
    }
    if (text.includes("suv")) {
      const suv = dealer.inventory.find((vehicle) => vehicle.segment === "SUV" || vehicle.segment === "Crossover");
      return suv
        ? `Si queres una SUV, la ${suv.name} es una muy buena candidata. Tiene ${suv.km} y una presencia que gusta mucho.`
        : "Tenemos alternativas interesantes para ese perfil. Si queres, seguimos la charla por WhatsApp.";
    }
    if (text.includes("financi")) {
      return "Podemos orientarte con opciones para avanzar y contarte que camino te conviene segun el vehiculo que te guste.";
    }
    if (text.includes("usado") || text.includes("entregar")) {
      return "Si tenes un usado, tambien podemos tomar tus datos y ayudarte a ver como encarar el cambio.";
    }
    if (text.includes("precio") || text.includes("valor")) {
      return "Si queres, te contamos el valor de referencia y seguimos la conversacion para ver disponibilidad y condiciones.";
    }
    return "Decime que tipo de vehiculo estas buscando y te acompano con una recomendacion rapida para seguir la charla.";
  }

  function appendMessage(target, dealer, text, role) {
    const row = document.createElement("div");
    row.className = `chat-row chat-row--${role}`;

    if (role === "bot") {
      const avatar = document.createElement("img");
      avatar.className = "chat-avatar";
      avatar.src = resolveAssetPath(dealer.logo);
      avatar.alt = dealer.logoAlt || dealer.name;
      row.appendChild(avatar);
    }

    const bubble = document.createElement("div");
    bubble.className = `chat-bubble chat-bubble--${role}`;
    bubble.textContent = text;
    row.appendChild(bubble);

    target.appendChild(row);
    target.scrollTop = target.scrollHeight;
  }

  function setupChat(dealer) {
    const widget = document.getElementById("ia");
    const toggle = document.getElementById("chat-toggle");
    const form = document.getElementById("chat-form");
    const input = document.getElementById("chat-input");
    const messages = document.getElementById("chat-messages");
    const suggestions = document.getElementById("chat-suggestions");
    const storageKey = `chat-collapsed-${dealer.slug}`;
    if (!widget || !toggle || !form || !input || !messages || !suggestions) return;

    function setCollapsed(collapsed) {
      widget.classList.toggle("chat-widget--collapsed", collapsed);
      toggle.textContent = collapsed ? "+" : "-";
      toggle.setAttribute("aria-label", collapsed ? "Abrir chat" : "Minimizar chat");
      window.localStorage.setItem(storageKey, collapsed ? "1" : "0");
    }

    const storedState = window.localStorage.getItem(storageKey);
    if (storedState === "1") {
      setCollapsed(true);
    } else if (storedState === "0") {
      setCollapsed(false);
    } else {
      setCollapsed(window.innerWidth < 860);
    }

    toggle.addEventListener("click", function () {
      setCollapsed(!widget.classList.contains("chat-widget--collapsed"));
    });

    appendMessage(messages, dealer, dealer.chat.welcome, "bot");

    dealer.chat.suggestions.forEach((suggestion) => {
      const button = document.createElement("button");
      button.className = "suggestion-pill";
      button.type = "button";
      button.textContent = suggestion;
      button.addEventListener("click", function () {
        appendMessage(messages, dealer, suggestion, "user");
        window.setTimeout(function () {
          appendMessage(messages, dealer, botReply(dealer, suggestion), "bot");
        }, 220);
      });
      suggestions.appendChild(button);
    });

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      const value = input.value.trim();
      if (!value) return;
      appendMessage(messages, dealer, value, "user");
      input.value = "";
      window.setTimeout(function () {
        appendMessage(messages, dealer, botReply(dealer, value), "bot");
      }, 220);
    });
  }

  function setupVehicleGallery() {
    const mainImage = document.getElementById("vehicle-main-image");
    const thumbs = document.querySelectorAll("[data-gallery-thumb]");
    if (!mainImage || thumbs.length === 0) return;

    thumbs.forEach((thumb) => {
      thumb.addEventListener("click", function () {
        mainImage.src = thumb.dataset.image;
        thumbs.forEach((item) => item.classList.remove("is-active"));
        thumb.classList.add("is-active");
      });
    });
  }

  function renderHub() {
    const grid = document.getElementById("hub-grid");
    if (!grid) return;
    grid.innerHTML = Object.values(data)
      .map((dealer) => buildHubCard(dealer))
      .join("");
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
    setupVehicleGallery();
  }

  if (page === "hub") renderHub();
  if (page === "dealer") renderDealer();
  if (page === "vehicle") renderVehicle();
})();
