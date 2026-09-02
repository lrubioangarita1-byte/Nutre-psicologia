// Arma la página de videos a partir de la lista definida en videos-data.js
document.addEventListener("DOMContentLoaded", () => {
  const emptyState = document.querySelector("#video-empty-state");
  const content = document.querySelector("#video-content");
  const grid = document.querySelector("#video-grid");
  const player = document.querySelector("#video-player");
  const featuredTag = document.querySelector("#video-featured-tag");
  const featuredTitle = document.querySelector("#video-featured-title");
  const featuredDesc = document.querySelector("#video-featured-desc");

  if (!content || typeof VIDEOS === "undefined") return;

  if (!VIDEOS.length) {
    emptyState.hidden = false;
    return;
  }

  content.hidden = false;

  function playVideo(index) {
    const video = VIDEOS[index];
    player.src = `https://www.youtube.com/embed/${video.youtubeId}`;
    featuredTag.textContent = video.categoria || "Video";
    featuredTitle.textContent = video.titulo;
    featuredDesc.textContent = video.descripcion || "";

    grid.querySelectorAll(".video-card").forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === index);
    });
  }

  VIDEOS.forEach((video, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "video-card";
    card.innerHTML = `
      <div class="video-thumb" style="background-image:url('https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg')">
        <div class="video-thumb-play">
          <span>
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 2.5L15 9L4 15.5V2.5Z" fill="#fff"/>
            </svg>
          </span>
        </div>
        ${video.duracion ? `<span class="video-duration">${video.duracion}</span>` : ""}
      </div>
      <div class="video-card-body">
        <h4>${video.titulo}</h4>
        <p>${video.descripcion || ""}</p>
      </div>
    `;
    card.addEventListener("click", () => {
      playVideo(index);
      document.querySelector(".video-player-wrap").scrollIntoView({ behavior: "smooth", block: "start" });
    });
    grid.appendChild(card);
  });

  playVideo(0);
});
