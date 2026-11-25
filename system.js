let activeTag = "";

document.addEventListener("DOMContentLoaded", () => {
  bindSystemEvents();
  initApp();
});

async function initApp() {
  const countEl = document.getElementById("result-count");
  const gridEl = document.getElementById("trivia-grid");
  countEl.textContent = "スプレッドシートから読み込み中...";
  gridEl.innerHTML = "";

  try {
    await loadTriviaContents();
    renderTagFilterBar();
    filterAndRender();
  } catch (err) {
    console.error(err);
    countEl.textContent = "読み込みエラー";
    gridEl.innerHTML = `
      <div class="trivia-card">
        <div class="card-title">データの取得に失敗しました</div>
        <p class="card-content">contents.js の TRIVIA_GAS_URL が正しく設定されているか、GASのアクセス権限が「全員」になっているか確認してください。</p>
      </div>
    `;
  }
}

// ひらがな・カタカナ・大文字小文字を統一して検索しやすくする正規化関数
function normalizeText(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

// 全タグ一覧を生成して上部に描画
function renderTagFilterBar() {
  const bar = document.getElementById("tag-filter-bar");
  const tagSet = new Set();
  TRIVIA_CONTENTS.forEach(item => {
    (item.tags || []).forEach(tag => tagSet.add(tag));
  });

  const allTags = ["すべて", ...Array.from(tagSet)];
  bar.innerHTML = allTags.map(tag => {
    const isAll = tag === "すべて";
    const isActive = isAll ? activeTag === "" : activeTag === tag;
    return `
      <button class="filter-chip ${isActive ? "active" : ""}" data-tag="${isAll ? "" : tag}">
        ${isAll ? "すべて" : "#" + tag}
      </button>
    `;
  }).join("");

  bar.querySelectorAll(".filter-chip").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag;
      renderTagFilterBar();
      filterAndRender();
    });
  });
}

// 検索ワード＆選択中タグで絞り込み描画
function filterAndRender() {
  const inputVal = document.getElementById("search-input").value.trim();
  const query = normalizeText(inputVal);
  document.getElementById("btn-clear-search").hidden = inputVal === "";

  const filtered = TRIVIA_CONTENTS.filter(item => {
    // タグチップでの絞り込み
    if (activeTag && !(item.tags || []).includes(activeTag)) {
      return false;
    }
    // テキスト検索（豆知識名 または タグ名）
    if (!query) return true;
    const matchTitle = normalizeText(item.title).includes(query);
    const matchTag = (item.tags || []).some(t => normalizeText(t).includes(query));
    return matchTitle || matchTag;
  });

  document.getElementById("result-count").textContent =
    `全 ${TRIVIA_CONTENTS.length} 件中 ${filtered.length} 件を表示`;

  const grid = document.getElementById("trivia-grid");
  if (filtered.length === 0) {
    grid.innerHTML = `
      <div class="trivia-card">
        <div class="card-title">該当する豆知識が見つかりませんでした</div>
        <p class="card-content">別のキーワードやタグでお試しください。</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = filtered.map(item => `
    <article class="trivia-card">
      <h2 class="card-title">${escapeHtml(item.title)}</h2>
      <p class="card-content">${escapeHtml(item.content)}</p>
      ${item.imageUrl ? `
        <div class="card-image-wrap" data-img="${escapeHtml(item.imageUrl)}" data-caption="${escapeHtml(item.imageCaption || item.title)}">
          <img src="${escapeHtml(item.imageUrl)}" alt="${escapeHtml(item.title)}" loading="lazy">
          <span class="zoom-hint">🔍 タップで全画面表示</span>
        </div>
      ` : ""}
      <div class="card-tags">
        ${(item.tags || []).map(tag => `
          <button class="card-tag" data-tag="${escapeHtml(tag)}">#${escapeHtml(tag)}</button>
        `).join("")}
      </div>
    </article>
  `).join("");

  // 画像タップで全画面モーダル起動
  grid.querySelectorAll(".card-image-wrap").forEach(wrap => {
    wrap.addEventListener("click", () => {
      openImageModal(wrap.dataset.img, wrap.dataset.caption);
    });
  });

  // カード内タグタップで絞り込み
  grid.querySelectorAll(".card-tag").forEach(btn => {
    btn.addEventListener("click", () => {
      activeTag = btn.dataset.tag;
      renderTagFilterBar();
      filterAndRender();
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  });
}

// フルスクリーン画像モーダル
function openImageModal(src, caption) {
  const modal = document.getElementById("image-modal");
  const img = document.getElementById("modal-image");
  img.src = src;
  img.classList.remove("zoomed");
  document.getElementById("modal-caption").textContent = caption || "";
  modal.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  document.getElementById("image-modal").hidden = true;
  document.body.style.overflow = "";
}

function bindSystemEvents() {
  const searchInput = document.getElementById("search-input");
  searchInput.addEventListener("input", filterAndRender);

  document.getElementById("btn-clear-search").addEventListener("click", () => {
    searchInput.value = "";
    filterAndRender();
    searchInput.focus();
  });

  document.getElementById("btn-reload").addEventListener("click", initApp);

  // モーダル操作
  document.getElementById("btn-close-modal").addEventListener("click", closeImageModal);
  document.getElementById("modal-backdrop").addEventListener("click", closeImageModal);

  const modalImg = document.getElementById("modal-image");
  const toggleZoom = () => modalImg.classList.toggle("zoomed");
  modalImg.addEventListener("click", toggleZoom);
  document.getElementById("btn-toggle-zoom").addEventListener("click", toggleZoom);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeImageModal();
  });
}

function escapeHtml(str) {
  return String(str || "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
