// Arma la página de guías a partir de la lista definida en guias-data.js
document.addEventListener("DOMContentLoaded", () => {
  const emptyState = document.querySelector("#guia-empty-state");
  const grid = document.querySelector("#guia-grid");

  if (!grid || typeof GUIAS === "undefined") return;

  if (!GUIAS.length) {
    emptyState.hidden = false;
    grid.hidden = true;
    return;
  }

  GUIAS.forEach((guia) => {
    const card = document.createElement("div");
    card.className = "guia-card";

    const disponible = Boolean(guia.linkPago);
    const accion = disponible
      ? `<a href="${guia.linkPago}" class="btn btn-accent" target="_blank" rel="noopener">Comprar guía</a>`
      : `<span class="badge-soon">Próximamente</span>`;

    card.innerHTML = `
      <div class="guia-card-top">
        <h3>${guia.titulo}</h3>
        ${guia.precio ? `<span class="guia-price">${guia.precio}</span>` : ""}
      </div>
      <p class="guia-desc">${guia.descripcion || ""}</p>
      ${guia.formato ? `<p class="guia-format">${guia.formato}</p>` : ""}
      ${accion}
    `;
    grid.appendChild(card);
  });
});
