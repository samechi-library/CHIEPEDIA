document.addEventListener("DOMContentLoaded", () => {
      // アプリの状態管理
      const state = {
        searchQuery: "",
        selectedTag: "すべて",
        onlyWithImage: false,
        isImageZoomed: false,
        activeCodeTab: "index.html"
      };

      // DOM要素の取得
      const searchInput = document.getElementById("searchInput");
      const clearSearchBtn = document.getElementById("clearSearchBtn");
      const tagFilterContainer = document.getElementById("tagFilterContainer");
      const onlyWithImageCheckbox = document.getElementById("onlyWithImageCheckbox");
      const resultCountText = document.getElementById("resultCountText");
      const triviaGrid = document.getElementById("triviaGrid");
      const emptyState = document.getElementById("emptyState");
      const resetAllFiltersBtn = document.getElementById("resetAllFiltersBtn");

      // 画像フルスクリーンモーダル要素
      const imageModal = document.getElementById("imageModal");
      const modalBackdrop = document.getElementById("modalBackdrop");
      const modalFullImage = document.getElementById("modalFullImage");
      const modalImageTitle = document.getElementById("modalImageTitle");
      const modalImageCaption = document.getElementById("modalImageCaption");
      const closeImageModalBtn = document.getElementById("closeImageModalBtn");
      const toggleZoomBtn = document.getElementById("toggleZoomBtn");

      // 4ファイル構成モーダル要素
      const openCodeModalBtn = document.getElementById("openCodeModalBtn");
      const codeExportModal = document.getElementById("codeExportModal");
      const closeCodeModalBtn = document.getElementById("closeCodeModalBtn");
      const codeFileTabs = document.getElementById("codeFileTabs");
      const codeViewerPre = document.getElementById("codeViewerPre");
      const copyCodeBtn = document.getElementById("copyCodeBtn");

      /**
       * カタカナをひらがなへ正規化・小文字化して検索しやすくする
       */
      function normalizeText(str) {
        if (!str) return "";
        return str
          .toLowerCase()
          .trim()
          .replace(/[\u30a1-\u30f6]/g, (match) =>
            String.fromCharCode(match.charCodeAt(0) - 0x60)
          );
      }

      /**
       * 全データから重複なしのタグ一覧を抽出し、タグボタンを描画
       */
      function renderTagPills() {
        const tagCounts = new Map();
        TRIVIA_CONTENTS.forEach((item) => {
          item.tags.forEach((tag) => {
            tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
          });
        });

        const allTags = ["すべて", ...Array.from(tagCounts.keys())];
        tagFilterContainer.innerHTML = "";

        allTags.forEach((tag) => {
          const isSelected = state.selectedTag === tag;
          const btn = document.createElement("button");
          btn.type = "button";
          btn.setAttribute("role", "tab");
          btn.setAttribute("aria-selected", String(isSelected));
          btn.className = isSelected
            ? "shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold bg-amber-600 text-white shadow-xs transition"
            : "shrink-0 px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium bg-white text-slate-600 border border-slate-200 hover:bg-amber-50 hover:text-amber-800 hover:border-amber-200 transition";

          const count = tag === "すべて" ? TRIVIA_CONTENTS.length : tagCounts.get(tag);
          btn.textContent = tag === "すべて" ? `すべて (${count})` : `#${tag} (${count})`;

          btn.addEventListener("click", () => {
            state.selectedTag = tag;
            renderTagPills();
            renderTriviaList();
          });

          tagFilterContainer.appendChild(btn);
        });
      }

      /**
       * 検索条件・選択タグ・画像有無フィルターに基づいて豆知識一覧を抽出・描画
       */
      function renderTriviaList() {
        const rawQuery = state.searchQuery.trim();
        // 先頭の「#」を取り除いて検索できるように対応
        const cleanQuery = normalizeText(rawQuery.replace(/^[#＃]+/, ""));

        const filtered = TRIVIA_CONTENTS.filter((item) => {
          // 1. タグピル絞り込み
          if (state.selectedTag !== "すべて" && !item.tags.includes(state.selectedTag)) {
            return false;
          }

          // 2. 画像付きのみフィルター
          if (state.onlyWithImage && !item.image) {
            return false;
          }

          // 3. キーワード検索（豆知識名に含む OR 付随タグ名に含む）
          if (cleanQuery.length > 0) {
            const normTitle = normalizeText(item.title);
            const titleMatch = normTitle.includes(cleanQuery);
            const tagMatch = item.tags.some((t) => normalizeText(t).includes(cleanQuery));
            return titleMatch || tagMatch;
          }

          return true;
        });

        // 件数表示の更新
        resultCountText.textContent =
          filtered.length === TRIVIA_CONTENTS.length
            ? `全 ${filtered.length} 件の豆知識を表示中`
            : `該当 ${filtered.length} 件 / 全 ${TRIVIA_CONTENTS.length} 件`;

        // クリアボタンの表示切り替え
        if (rawQuery.length > 0) {
          clearSearchBtn.classList.remove("hidden");
        } else {
          clearSearchBtn.classList.add("hidden");
        }

        // 0件表示の制御
        if (filtered.length === 0) {
          triviaGrid.innerHTML = "";
          emptyState.classList.remove("hidden");
          return;
        }
        emptyState.classList.add("hidden");

        // カードDOMの構築
        triviaGrid.innerHTML = "";
        filtered.forEach((item) => {
          const card = document.createElement("article");
          card.className = "trivia-card p-5 sm:p-6 flex flex-col justify-between";

          // タグHTMLの生成（タグクリックでも検索絞り込み可能）
          const tagsHtml = item.tags
            .map(
              (tag) => `
              <button
                type="button"
                data-tag-click="${escapeHtml(tag)}"
                class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200/70 hover:bg-amber-100 transition"
              >
                #${escapeHtml(tag)}
              </button>`
            )
            .join("");

          // 画像セクションHTML（画像がある豆知識のみ表示）
          const imageSectionHtml = item.image
            ? `
              <div class="mt-4">
                <div
                  class="trivia-image-wrapper group"
                  role="button"
                  tabindex="0"
                  aria-label="${escapeHtml(item.title)}の画像を全画面で拡大表示"
                  data-open-modal-id="${item.id}"
                >
                  <img
                    src="${item.image}"
                    alt="${escapeHtml(item.title)}"
                    loading="lazy"
                    class="w-full h-48 sm:h-52 object-cover block"
                  />
                  <div class="absolute bottom-2.5 right-2.5 px-3 py-1.5 rounded-xl bg-slate-900/75 text-white text-xs font-medium backdrop-blur-xs flex items-center gap-1.5 shadow-sm group-hover:bg-amber-600 transition">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                    </svg>
                    <span>画面いっぱいに拡大</span>
                  </div>
                </div>
              </div>
            `
            : "";

          card.innerHTML = `
            <div>
              <div class="flex items-center justify-between gap-2 mb-2.5">
                <span class="text-xs font-bold tracking-wider text-amber-700 bg-amber-100/80 px-2.5 py-0.5 rounded-md">
                  No.${String(item.id).padStart(2, "0")}
                </span>
                ${
                  item.image
                    ? '<span class="text-[11px] font-medium text-slate-500 flex items-center gap-1">🖼️ 図解あり</span>'
                    : '<span class="text-[11px] font-medium text-slate-400">📖 読み物</span>'
                }
              </div>

              <h2 class="font-serif-title text-lg sm:text-xl font-bold text-slate-900 leading-snug mb-3">
                ${escapeHtml(item.title)}
              </h2>

              <p class="text-sm sm:text-[15px] text-slate-700 leading-relaxed">
                ${escapeHtml(item.content)}
              </p>

              ${imageSectionHtml}
            </div>

            <div class="mt-4 pt-3.5 border-t border-slate-100 flex flex-wrap gap-1.5">
              ${tagsHtml}
            </div>
          `;

          // カード内タグボタンのクリックイベント
          card.querySelectorAll("[data-tag-click]").forEach((tagBtn) => {
            tagBtn.addEventListener("click", () => {
              const clickedTag = tagBtn.getAttribute("data-tag-click");
              state.selectedTag = clickedTag;
              renderTagPills();
              renderTriviaList();
              window.scrollTo({ top: 0, behavior: "smooth" });
            });
          });

          // カード内画像クリックでフルスクリーンモーダルを開く
          const imgTrigger = card.querySelector("[data-open-modal-id]");
          if (imgTrigger) {
            const openHandler = () => openFullscreenImageModal(item);
            imgTrigger.addEventListener("click", openHandler);
            imgTrigger.addEventListener("keydown", (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openHandler();
              }
            });
          }

          triviaGrid.appendChild(card);
        });
      }

      /**
       * フルスクリーン画像モーダルを開く
       */
      function openFullscreenImageModal(item) {
        if (!item || !item.image) return;
        state.isImageZoomed = false;
        modalFullImage.classList.remove("is-zoomed");
        modalFullImage.src = item.image;
        modalFullImage.alt = item.title;
        modalImageTitle.textContent = item.title;
        modalImageCaption.textContent =
          item.imageCaption || "画像をタップで拡大・縮小 / 背景または「×」で閉じる";

        imageModal.classList.add("is-open");
        document.body.style.overflow = "hidden";
      }

      /**
       * フルスクリーン画像モーダルを閉じる
       */
      function closeFullscreenImageModal() {
        imageModal.classList.remove("is-open");
        state.isImageZoomed = false;
        modalFullImage.classList.remove("is-zoomed");
        document.body.style.overflow = "";
      }

      /**
       * モーダル内画像の拡大・縮小トグル
       */
      function toggleModalImageZoom() {
        state.isImageZoomed = !state.isImageZoomed;
        modalFullImage.classList.toggle("is-zoomed", state.isImageZoomed);
        toggleZoomBtn.textContent = state.isImageZoomed ? "🔎 元に戻す" : "🔍 拡大切替";
      }

      /**
       * HTMLエスケープ処理
       */
      function escapeHtml(text) {
        const div = document.createElement("div");
        div.textContent = text;
        return div.innerHTML;
      }

      // =========================================================
      // 検索・フィルターイベント登録
      // =========================================================
      searchInput.addEventListener("input", (e) => {
        state.searchQuery = e.target.value;
        renderTriviaList();
      });

      clearSearchBtn.addEventListener("click", () => {
        state.searchQuery = "";
        searchInput.value = "";
        searchInput.focus();
        renderTriviaList();
      });

      onlyWithImageCheckbox.addEventListener("change", (e) => {
        state.onlyWithImage = e.target.checked;
        renderTriviaList();
      });

      resetAllFiltersBtn.addEventListener("click", () => {
        state.searchQuery = "";
        state.selectedTag = "すべて";
        state.onlyWithImage = false;
        searchInput.value = "";
        onlyWithImageCheckbox.checked = false;
        renderTagPills();
        renderTriviaList();
      });

      // =========================================================
      // フルスクリーン画像モーダルのイベント登録
      // =========================================================
      closeImageModalBtn.addEventListener("click", closeFullscreenImageModal);
      toggleZoomBtn.addEventListener("click", toggleModalImageZoom);

      modalFullImage.addEventListener("click", (e) => {
        e.stopPropagation();
        toggleModalImageZoom();
      });

      modalBackdrop.addEventListener("click", (e) => {
        if (e.target === modalBackdrop) {
          closeFullscreenImageModal();
        }
      });

      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
          if (imageModal.classList.contains("is-open")) {
            closeFullscreenImageModal();
          }
          if (codeExportModal.classList.contains("is-open")) {
            closeCodeExportModal();
          }
        }
      });

      // =========================================================
      // 4ファイル構成（index.html / style.css / system.js / contents.js）
      // エクスポートモーダル制御
      // =========================================================
      function getSeparatedFileContents() {
        const styleCssCode = document.getElementById("app-style-css").textContent.trim();
        const contentsJsCode = document.getElementById("app-contents-js").textContent.trim();
        const systemJsCode = document.getElementById("app-system-js").textContent.trim();

        const indexHtmlCode = `<!DOCTYPE html>
<html lang="ja">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>まめちしき辞典 - ChiePedia</title>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Noto+Sans+JP:wght@400;500;700&family=Shippori+Mincho:wght@600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"><\/script>
  <!-- 分離したCSSファイルの読み込み -->
  <link rel="stylesheet" href="style.css" />
</head>
<body class="min-h-screen flex flex-col">
  <!-- ヘッダー・検索バー・メイングリッド・画像モーダル本体 -->
  ${document.querySelector("header").outerHTML}
  ${document.querySelector("main").outerHTML}
  ${document.querySelector("footer").outerHTML}
  ${document.getElementById("imageModal").outerHTML}

  <!-- 分離した2つのJSファイルの読み込み -->
  <script src="contents.js"><\/script>
  <script src="system.js"><\/script>
</body>
</html>`;

        return {
          "index.html": indexHtmlCode,
          "style.css": styleCssCode,
          "system.js": systemJsCode,
          "contents.js": contentsJsCode
        };
      }

      function renderCodeTab(fileName) {
        state.activeCodeTab = fileName;
        const files = getSeparatedFileContents();
        codeViewerPre.textContent = files[fileName] || "";

        codeFileTabs.querySelectorAll(".code-tab-btn").forEach((btn) => {
          const isMatch = btn.getAttribute("data-file") === fileName;
          btn.className = isMatch
            ? "code-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-600 text-white"
            : "code-tab-btn px-3 py-1.5 rounded-lg text-xs font-semibold bg-white text-slate-700 hover:bg-slate-50";
        });
      }

      function closeCodeExportModal() {
        codeExportModal.classList.remove("is-open");
        document.body.style.overflow = "";
      }

      openCodeModalBtn.addEventListener("click", () => {
        renderCodeTab(state.activeCodeTab);
        codeExportModal.classList.add("is-open");
        document.body.style.overflow = "hidden";
      });

      closeCodeModalBtn.addEventListener("click", closeCodeExportModal);

      codeExportModal.addEventListener("click", (e) => {
        if (e.target === codeExportModal) {
          closeCodeExportModal();
        }
      });

      codeFileTabs.querySelectorAll(".code-tab-btn").forEach((btn) => {
        btn.addEventListener("click", () => {
          renderCodeTab(btn.getAttribute("data-file"));
        });
      });

      copyCodeBtn.addEventListener("click", () => {
        const textToCopy = codeViewerPre.textContent;
        const tempTextarea = document.createElement("textarea");
        tempTextarea.value = textToCopy;
        document.body.appendChild(tempTextarea);
        tempTextarea.select();
        document.execCommand("copy");
        document.body.removeChild(tempTextarea);

        const originalLabel = copyCodeBtn.textContent;
        copyCodeBtn.textContent = "✅ コピーしました！";
        setTimeout(() => {
          copyCodeBtn.textContent = originalLabel;
        }, 1800);
      });

      // 初期描画の実行
      renderTagPills();
      renderTriviaList();
    });
