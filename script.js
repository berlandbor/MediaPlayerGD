const playlistFile = document.getElementById("playlistFile");
const playlistUrl = document.getElementById("playlistUrl");
const loadUrlBtn = document.getElementById("loadUrlBtn");
const clearDbBtn = document.getElementById("clearDbBtn");
const playlistContainer = document.getElementById("playlist");
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

// 📂 Загрузка из файла
playlistFile.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const items = JSON.parse(reader.result);
      saveAndRender(items);
    } catch (err) {
      alert("❌ Ошибка чтения JSON-файла.");
    }
  };
  reader.readAsText(file);
});

// 🌐 Загрузка по ссылке
loadUrlBtn.addEventListener("click", () => {
  const url = playlistUrl.value.trim();
  if (!url) return alert("Введите ссылку на JSON-файл");

  fetch(url)
    .then(res => {
      if (!res.ok) throw new Error("Ошибка загрузки: " + res.status);
      return res.json();
    })
    .then(data => {
      saveAndRender(data);
    })
    .catch(err => {
      alert("❌ Не удалось загрузить JSON: " + err.message);
    });
});

// 🧹 Очистка базы
clearDbBtn.addEventListener("click", () => {
  localStorage.removeItem(STORAGE_KEY);
  currentPlaylist = [];
  playlistContainer.innerHTML = "<p>📭 Плейлист очищен.</p>";
  categoryFilter.innerHTML = `<option value="all">Все категории</option>`;
});

// 🧩 Фильтрация по категориям
categoryFilter.addEventListener("change", () => {
  const selected = categoryFilter.value;
  if (selected === "all") {
    renderPlaylist(currentPlaylist);
  } else {
    const filtered = currentPlaylist.filter(item => item.category === selected);
    renderPlaylist(filtered);
  }
});

// 🔄 Сохранить и отрисовать
function saveAndRender(items) {
  currentPlaylist = items;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  updateFilterOptions(items);
  renderPlaylist(items);
}

// 📦 Отрисовка плиток
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

// 🔃 Обновление списка категорий
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

