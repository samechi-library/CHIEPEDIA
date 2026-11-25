// ★ここに豆知識スプレッドシートでデプロイしたGASのURL（末尾 /exec）を貼る
const TRIVIA_GAS_URL = "https://script.google.com/macros/s/AKfycbyRFZGZlBPJtvLjx6WtAXPMSnwEYKg6eS3FHirWmebezB9xRCVpPDm7Y6QW-oBzWbsZ1A/exec";

// 画像格納フォルダのパス
const IMAGE_BASE_DIR = "images/";

// スプレッドシートから取得した豆知識データを格納する配列
let TRIVIA_CONTENTS = [];

// ファイル名のみが指定されていた場合に "images/" を自動付与する
function resolveImagePath(rawPath) {
  const path = String(rawPath || "").trim();
  if (!path) return "";
  if (/^(https?:\/\/|data:|images\/|\.\/)/i.test(path)) {
    return path;
  }
  return IMAGE_BASE_DIR + path;
}

// スプレッドシートから最新データを取得する関数
async function loadTriviaContents() {
  const res = await fetch(TRIVIA_GAS_URL);
  const data = await res.json();
  if (data.status === "ok" && Array.isArray(data.contents)) {
    TRIVIA_CONTENTS = data.contents.map(item => ({
      ...item,
      imageUrl: resolveImagePath(item.imageUrl)
    }));
    return TRIVIA_CONTENTS;
  }
  throw new Error("データの形式が不正です");
}
