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

  function whatsappMessage(dealer, text) {
    return `https://wa.me/${dealer.whatsapp}?text=${encodeURIComponent(text)}`;
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

  function buildInventorySlide(vehicle) {
    return `
      <article class="inventory-slide">
        <div class="inventory-slide__media">
          ${buildVehicleVisual(vehicle, true)}
          <span class="inventory-slide__badge">${vehicle.badge}</span>
        </div>
        <div class="inventory-slide__body">
          <div class="inventory-slide__heading">
            <div>
              <p class="micro-copy">${vehicle.year} · ${vehicle.km}</p>
              <h3>${vehicle.name}</h3>
            </div>
            ${currencyTag(vehicle.price)}
          </div>
          <p class="inventory-slide__meta">${vehicle.segment} · ${vehicle.transmission} · ${vehicle.fuel}</p>
          <p class="inventory-slide__copy">${vehicle.description}</p>
          <div class="inventory-slide__footer">
            <a class="button" href="./vehiculo.html?modelo=${vehicle.id}">Ver fotos y detalles</a>
            <span class="inventory-slide__hook">${vehicle.hook}</span>
          </div>
        </div>
      </article>
    `;
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
          <li>Inicio con stock destacado</li>
          <li>Carrusel comercial de unidades</li>
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
            <a href="#hero">Inicio</a>
            <a href="#stock">Stock</a>
            <a href="#servicios">Servicios</a>
            <a href="#contacto">Contacto</a>
            <a href="#ia">Asesor online</a>
            <a href="${dealer.mapUrl}" target="_blank" rel="noreferrer">Ubicacion</a>
          </nav>
          <a class="button" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">WhatsApp</a>
        </header>

        <main>
          <section class="intro-strip" id="hero">
            <div class="intro-strip__copy">
              <p class="eyebrow">${dealer.eyebrow}</p>
              <h1>${dealer.heroTitle}</h1>
              <p class="lead">${dealer.heroLead}</p>
              <div class="hero-trust">
                <span>${dealer.promise}</span>
              </div>
            </div>
            <div class="intro-strip__side">
              <div class="hero-actions">
                <a class="button" href="#stock">Ver vehiculos</a>
                <a class="button button--ghost" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">Hablar por WhatsApp</a>
              </div>
              <div class="intro-strip__stats">
                ${dealer.stats
                  .map(
                    (stat) => `
                      <article class="quick-stat">
                        <strong>${stat.value}</strong>
                        <p>${stat.label}</p>
                      </article>
                    `
                  )
                  .join("")}
              </div>
            </div>
          </section>

          <section class="stock-showcase" id="stock">
            <div class="section-heading section-heading--split">
              <div>
                <p class="eyebrow">Stock destacado</p>
                <h2>Unidades disponibles ahora</h2>
                <p>Cada unidad con foto, precio y datos reales. Si te interesa, seguimos por WhatsApp.</p>
              </div>
              <a class="button button--ghost" href="https://wa.me/${dealer.whatsapp}" target="_blank" rel="noreferrer">Consultar stock</a>
            </div>
            <div class="carousel-shell">
              <button class="carousel-button" type="button" data-carousel-prev="stock-carousel" aria-label="Ver vehiculos anteriores">‹</button>
              <div class="inventory-carousel" id="stock-carousel">
                ${dealer.inventory.map((vehicle) => buildInventorySlide(vehicle)).join("")}
              </div>
              <button class="carousel-button" type="button" data-carousel-next="stock-carousel" aria-label="Ver mas vehiculos">›</button>
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

          <section class="services-section" id="servicios">
            <div class="section-heading">
              <p class="eyebrow">Te ayudamos a avanzar</p>
              <h2>Cómo es el proceso de compra con nosotros.</h2>
              <p>La idea es que el comprador encuentre rápido cómo seguir: consultar financiación, pedir más fotos, coordinar visita o ver si toman su usado.</p>
            </div>
            <div class="service-grid">
              ${dealer.services
                .map(
                  (service, index) => `
                    <article class="service-card">
                      <span class="service-card__index">0${index + 1}</span>
                      <h3>${index === 0 ? "Elegís lo que se ajusta a vos" : index === 1 ? "Consultás por WhatsApp en minutos" : "Coordinamos visita o entrega"}</h3>
                      <p>${service}</p>
                    </article>
                  `
                )
                .join("")}
            </div>
          </section>

          <section class="contact-band" id="contacto">
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
          <strong>Listo para recibir fotos reales</strong>
          <p>Cuando cargues imagenes de esta unidad, aca se mostraran la principal y sus miniaturas para venderla mejor.</p>
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
      .slice(0, 3)
      .map(
        (vehicle) => `
          <article class="related-card">
            <div class="related-card__media">
              ${buildVehicleVisual(vehicle, true)}
            </div>
            <div class="related-card__body">
              <p class="micro-copy">${vehicle.year} · ${vehicle.km}</p>
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
          <section class="vehicle-hero-head">
            <div class="vehicle-hero-head__copy">
              <a class="back-link" href="./index.html#stock">← Volver al stock</a>
              <p class="eyebrow">${vehicle.badge}</p>
              <h1>${vehicle.name}</h1>
              <p class="lead">${vehicle.salesPitch}</p>
              <div class="feature-chips">
                ${vehicle.features.slice(0, 4).map((feature) => `<span class="feature-chip">${feature}</span>`).join("")}
              </div>
            </div>
            <div class="vehicle-hero-head__price">
              ${currencyTag(vehicle.price, vehicle.priceNote)}
              <p>${vehicle.year} · ${vehicle.km} · ${vehicle.color}</p>
              <div class="contact-band__actions">
                <a class="button" href="${whatsappMessage(dealer, `Hola, me interesa el ${vehicle.name}`)}" target="_blank" rel="noreferrer">Consultar ahora</a>
                <a class="button button--ghost" href="${whatsappMessage(dealer, `Hola, quiero consultar financiacion para el ${vehicle.name}`)}" target="_blank" rel="noreferrer">Consultar financiación</a>
              </div>
            </div>
          </section>

          <section class="vehicle-detail-grid">
            ${buildVehicleGallery(vehicle)}

            <aside class="vehicle-summary">
              <div class="vehicle-summary__top">
                <p class="eyebrow">Informacion rapida</p>
                <h2>Todo lo que normalmente mirás antes de avanzar con una unidad.</h2>
                <p class="lead">${vehicle.description}</p>
              </div>

              <div class="vehicle-summary__cta">
                <a class="button" href="${whatsappMessage(dealer, `Hola, quiero mas informacion del ${vehicle.name}`)}" target="_blank" rel="noreferrer">Quiero mas informacion</a>
                <a class="button button--ghost" href="${whatsappMessage(dealer, `Hola, me gustaria pedir fotos y video del ${vehicle.name}`)}" target="_blank" rel="noreferrer">Pedir fotos y video</a>
                <a class="button button--ghost" href="${whatsappMessage(dealer, `Hola, quiero saber si toman mi usado por el ${vehicle.name}`)}" target="_blank" rel="noreferrer">Consultar usado en parte de pago</a>
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
              <p class="eyebrow">¿Por qué puede ir con vos?</p>
              <h2>Una lectura rápida para decidir si vale la pena venir a verlo o pedir más material.</h2>
              <p>${vehicle.descriptionLong}</p>
              <p>${vehicle.hook}</p>
              <div class="detail-points">
                <div class="point-card">
                  <strong>Qué ofrece esta unidad</strong>
                  <p>${vehicle.segment} con una presentación clara, precio visible y una ficha que te deja comparar sin perder tiempo.</p>
                </div>
                <div class="point-card">
                  <strong>Datos fáciles de leer</strong>
                  <p>Año, kilometraje, caja, combustible, color y equipamiento principal en un vistazo.</p>
                </div>
                <div class="point-card">
                  <strong>Cómo seguís</strong>
                  <p>Si te interesa, podés pedir fotos, video, financiación o consultar si toman tu usado.</p>
                </div>
              </div>
            </article>

            <article class="detail-card">
              <p class="eyebrow">Equipamiento destacado</p>
              <h2>Lo que más suele inclinar la balanza</h2>
              <ul class="detail-list">
                ${vehicle.features.map((feature) => `<li>${feature}</li>`).join("")}
              </ul>
            </article>
          </section>

          <section class="sales-steps">
            <article class="step-card">
              <span>01</span>
              <h3>Mirá si encaja con lo que buscás</h3>
              <p>Fotos, datos clave y equipamiento para saber rápido si esta unidad va con vos.</p>
            </article>
            <article class="step-card">
              <span>02</span>
              <h3>Pedí más fotos, video o financiación</h3>
              <p>Con un clic podés pedir más material, consultar cuotas o averiguar por entrega de usado.</p>
            </article>
            <article class="step-card">
              <span>03</span>
              <h3>Coordiná el siguiente paso</h3>
              <p>Si te cierra, seguís por WhatsApp para reservar, visitar o avanzar con la operación.</p>
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
              <a class="button" href="${whatsappMessage(dealer, `Hola, quiero avanzar con el ${vehicle.name}`)}" target="_blank" rel="noreferrer">Quiero avanzar con esta unidad</a>
              <a class="button button--ghost" href="${whatsappMessage(dealer, `Hola, quiero consultar si reciben un usado por el ${vehicle.name}`)}" target="_blank" rel="noreferrer">Consultar usado en parte de pago</a>
              <a class="button button--ghost" href="${phoneHref(dealer.phone)}">Llamar</a>
            </div>
          </section>

          <section class="related-section">
            <div class="section-heading">
              <p class="eyebrow">Seguí mirando</p>
              <h2>Otras opciones del mismo concesionario que te pueden interesar.</h2>
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
      return `Perfecto. Podes escribirnos ahora mismo al ${dealer.phone} o tocar el boton verde para seguir la charla con ventas.`;
    }
    if (text.includes("pickup")) {
      const pickup = dealer.inventory.find((vehicle) => vehicle.segment === "Pickup");
      return pickup
        ? `Si estas mirando una pickup, arrancaria por la ${pickup.name}. Es una opcion fuerte para trabajar y moverte comodo.`
        : "Contame para que la necesitas y te orientamos con una opcion de ese perfil.";
    }
    if (text.includes("suv")) {
      const suv = dealer.inventory.find((vehicle) => vehicle.segment === "SUV" || vehicle.segment === "Crossover");
      return suv
        ? `Si queres una SUV, la ${suv.name} es una muy buena candidata. Tiene una presencia que llama mucho la atencion.`
        : "Tenemos alternativas interesantes para ese perfil. Si queres, seguimos la charla por WhatsApp.";
    }
    if (text.includes("financi")) {
      return "Podemos orientarte con opciones para avanzar y contarte que camino te conviene segun la unidad que te guste.";
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

  function setupCarousels() {
    const controls = document.querySelectorAll("[data-carousel-prev], [data-carousel-next]");
    controls.forEach((control) => {
      control.addEventListener("click", function () {
        const targetId = control.dataset.carouselPrev || control.dataset.carouselNext;
        const direction = control.dataset.carouselPrev ? -1 : 1;
        const carousel = document.getElementById(targetId);
        if (!carousel) return;
        const firstCard = carousel.querySelector(".inventory-slide");
        const step = firstCard ? firstCard.getBoundingClientRect().width + 18 : carousel.clientWidth * 0.9;
        carousel.scrollBy({ left: step * direction, behavior: "smooth" });
      });
    });
  }

  function setupHeaderScroll() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = function () {
      header.classList.toggle("is-scrolled", window.scrollY > 10);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
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
    setupCarousels();
    setupHeaderScroll();
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
    setupHeaderScroll();
  }

  if (page === "hub") renderHub();
  if (page === "dealer") renderDealer();
  if (page === "vehicle") renderVehicle();
})();
