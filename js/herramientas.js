// Arma la página de Herramientas a partir de la lista en herramientas-data.js
document.addEventListener("DOMContentLoaded", () => {
  const list = document.querySelector("#tool-list");
  if (!list || typeof HERRAMIENTAS === "undefined") return;

  HERRAMIENTAS.forEach((tool, index) => {
    const card = document.createElement("div");
    card.className = "tool-card";

    const panelId = `tool-panel-${index}`;
    const hasAudio = Boolean(tool.audioSrc);

    const audioOrPending = hasAudio
      ? `<audio controls src="${tool.audioSrc}">Tu navegador no puede reproducir este audio.</audio>`
      : `<span class="tool-pending">Audio en camino</span>`;

    card.innerHTML = `
      <button type="button" class="tool-trigger" aria-expanded="false" aria-controls="${panelId}">
        <p class="tool-situation">${tool.situacion}</p>
        <span class="tool-meta">
          ${tool.duracion ? `<span class="tool-duration">${tool.duracion}</span>` : ""}
          <span class="tool-play">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M2 1.5L12 7L2 12.5V1.5Z" fill="#46603f"/>
            </svg>
          </span>
        </span>
      </button>
      <div class="tool-panel" id="${panelId}">
        <div class="tool-panel-inner">
          <p>${tool.descripcion || ""}</p>
          ${audioOrPending}
        </div>
      </div>
    `;

    const trigger = card.querySelector(".tool-trigger");
    trigger.addEventListener("click", () => {
      const isOpen = card.classList.toggle("is-open");
      trigger.setAttribute("aria-expanded", String(isOpen));
    });

    list.appendChild(card);
  });
});
