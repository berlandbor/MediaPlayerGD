const playlistInput = document.getElementById("playlistFile");
const playlistContainer = document.getElementById("playlist");
const clearDbBtn = document.getElementById("clearDbBtn");
const categoryFilter = document.getElementById("categoryFilter");

const STORAGE_KEY = "gdrive_playlist";
let currentPlaylist = [];

window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      currentPlaylist = JSON.parse(saved);
      updateFilterOptions(currentPlaylist);
      renderPlaylist(currentPlaylist);
    } catch (e) {
      console.warn("Ошибка чтения localStorage:", e);
    }
  }
});

playlistInput.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const items = JSON.parse(reader.result);
      currentPlaylist = items;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      updateFilterOptions(items);
      renderPlaylist(items);
    } catch {
      alert("Ошибка чтения JSON.");
    }
  };
  reader.readAsText(file);
});

clearDbBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  currentPlaylist = [];
  playlistContainer.innerHTML = "<p>📭 Плейлист очищен.</p>";
  categoryFilter.innerHTML = `<option value="all">Все категории</option>`;
});

categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;
  if (selected === "all") {
    renderPlaylist(currentPlaylist);
  } else {
    const filtered = currentPlaylist.filter(item => item.category === selected);
    renderPlaylist(filtered);
  }
});

function renderPlaylist(items) {
  playlistContainer.innerHTML = "";
  items.forEach(item => {
    const { title, id, poster, category } = item;
    const imageSrc = poster || `https://drive.google.com/thumbnail?id=${id}`;

    const tile = document.createElement("div");
    tile.className = "tile";
    tile.innerHTML = `
      <img src="${imageSrc}" />
      <div class="tile-title">${title}</div>
      <div class="tile-category">📁 ${category || "Без категории"}</div>
    `;
    tile.addEventListener("click", () => {
      window.open(`player.html?id=${id}`, "_blank");
    });
    playlistContainer.appendChild(tile);
  });
}

function updateFilterOptions(items) {
  const categories = Array.from(new Set(items.map(i => i.category).filter(Boolean)));
  categoryFilter.innerHTML = `<option value="all">Все категории</option>`;
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Модальное окно "О проекте"
const aboutBtn = document.getElementById("aboutBtn");
const aboutModal = document.getElementById("aboutModal");
const closeModal = document.getElementById("closeModal");

aboutBtn.addEventListener("click", () => {
  aboutModal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  aboutModal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === aboutModal) {
    aboutModal.style.display = "none";
  }
});

// Автооткрытие при первом запуске
window.addEventListener("DOMContentLoaded", () => {
  const shown = localStorage.getItem("about_shown");
  if (!shown) {
    aboutModal.style.display = "block";
    localStorage.setItem("about_shown", "true");
  }
});

