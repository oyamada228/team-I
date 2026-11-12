/* =========================================================
   ごちたま — 郡山グルメアプリ
   画面: ホーム / みつける / コース / マイページ + シート2つ
   ========================================================= */

/* ---------- データ ---------- */
const IMG = {
  bakery:     "https://images.unsplash.com/photo-1610963812725-3945efe1009f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=900",
  bread:      "https://images.unsplash.com/photo-1624878358939-4f0ff98eb2a4?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=900",
  restaurant: "https://images.unsplash.com/photo-1782625513915-62bf808045b9?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=900",
  sweets:     "https://images.unsplash.com/photo-1758634553966-09a34168cc12?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=88&w=900",
};

const state = {
  posts: [
    { id: 1, user: "こおりやま食べ歩き部", avatar: "こ", place: "郡山駅前",   image: IMG.bakery,     caption: "今日のクリームボックス。ふわふわパンにミルククリームがたっぷり。郡山に来たらまず食べてほしい味。", time: "2時間前" },
    { id: 2, user: "まちの台所",           avatar: "ま", place: "郡山市中町", image: IMG.restaurant, caption: "見た目は真っ黒、味はすっきり。昔ながらの郡山ブラックであたたまりました。", time: "5時間前" },
    { id: 3, user: "ふくしまローカル",     avatar: "ふ", place: "郡山市",     image: IMG.sweets,     caption: "まち歩きの途中で見つけた季節の甘いもの。ごちそうさまでした。", time: "昨日" },
  ],
  compose: { image: IMG.bread, text: "" },
  course:  { time: "90分", mood: "郡山らしさ", move: "徒歩" },
  stats:   { lamp: 12, courses: 4 },
};

const TAGS = ["#クリームボックス", "#郡山ブラック", "#駅前ランチ", "#ごちそうさま"];

const SOUL_FOOD = [
  { name: "郡山ブラック", desc: "濃口醤油ラーメン",     image: IMG.restaurant, color: "#ff7567" },
  { name: "鯉料理",       desc: "伝統のうま煮・あらい", image: IMG.bread,      color: "#b9a6ff" },
  { name: "キャベツ餅",   desc: "県中エリアの郷土食",   image: IMG.sweets,     color: "#dfff3f" },
];

const DETAIL_SPOTS = [
  { name: "大友パン店",       note: "郡山駅から徒歩12分" },
  { name: "ベーカリーロミオ", note: "前のスポットから徒歩8分" },
  { name: "街なかベーカリー", note: "前のスポットから徒歩8分" },
];

const QUESTIONS = [
  { key: "time", title: "どのくらい時間がある？", options: ["60分", "90分", "半日"] },
  { key: "mood", title: "今日はどんな気分？",     options: ["郡山らしさ", "甘いもの", "ゆっくり"] },
  { key: "move", title: "移動方法は？",           options: ["徒歩", "車", "公共交通"] },
];

const COURSES = {
  "郡山らしさ": { title: "郡山の定番、いいとこ取りコース",   description: "発祥グルメと昔ながらの味を、無理なく楽しめる順番にしました。", spots: ["クリームボックス", "郡山ブラック", "地元喫茶でひと休み"] },
  "甘いもの":   { title: "ごほうびスイーツさんぽ",           description: "パンと季節の甘いものを中心に、写真も撮りたくなるコースです。", spots: ["クリームボックス", "季節のフルーツ菓子", "レトロ喫茶"] },
  "ゆっくり":   { title: "のんびり、まちなか味わいコース",   description: "歩く距離を抑え、落ち着いて郡山の食文化に触れるプランです。",   spots: ["老舗ベーカリー", "鯉料理の小鉢", "駅前カフェ"] },
};

/* ---------- ユーティリティ ---------- */
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

/* ---------- 画面切り替え ---------- */
function showScreen(name) {
  $$(".screen").forEach((el) => el.classList.toggle("active", el.id === `screen-${name}`));
  $$("#tabbar button").forEach((b) => b.classList.toggle("active", b.dataset.go === name));
  window.scrollTo(0, 0);
  if (name === "mypage") renderMyPage();
}

/* ---------- シート開閉 ---------- */
function openSheet(name) {
  $(`#sheet-${name}`).hidden = false;
  if (name === "compose") $("#compose-text").focus();
}
function closeSheets() {
  $$(".backdrop").forEach((el) => (el.hidden = true));
}

/* =========================================================
   ① ホーム
   ========================================================= */
function postHTML(p) {
  return `
    <article class="post">
      <span class="avatar">${esc(p.avatar)}</span>
      <div class="post-body">
        <div class="post-head">
          <h2>${esc(p.user)}</h2><span class="time">· ${esc(p.time)}</span>
          <button class="more" aria-label="メニュー">•••</button>
        </div>
        <p class="place">📍 ${esc(p.place)}</p>
        <p class="caption">${esc(p.caption)}</p>
        <img src="${esc(p.image)}" alt="${esc(p.caption)}">
      </div>
    </article>`;
}
function renderHome() {
  $("#tags").innerHTML = TAGS.map((t) => `<span>${esc(t)}</span>`).join("");
  $("#feed").innerHTML = state.posts.map(postHTML).join("");
}

/* ---------- 新しい投稿 ---------- */
function renderCompose() {
  $("#compose-preview").src = state.compose.image;
  $("#share").disabled = !state.compose.text.trim();
  $("#presets").innerHTML = [IMG.bread, IMG.restaurant, IMG.sweets]
    .map((src) => `<button data-src="${src}" class="${state.compose.image === src ? "on" : ""}"><img src="${src}" alt=""></button>`)
    .join("");
}
function submitPost() {
  const text = state.compose.text.trim();
  if (!text) return;
  state.posts.unshift({
    id: Date.now(), user: "あなた", avatar: "G", place: "郡山市",
    image: state.compose.image, caption: text, time: "たった今",
  });
  state.compose.text = "";
  $("#compose-text").value = "";
  closeSheets();
  renderHome();
}

/* =========================================================
   ② みつける
   ========================================================= */
function renderDiscover() {
  $("#hero").style.backgroundImage = `url(${IMG.bakery})`;
  $("#soulfood").innerHTML = SOUL_FOOD.map((f) => `
    <button class="food" data-open="detail">
      <img src="${f.image}" alt="">
      <div><i style="background:${f.color}"></i><h4>${esc(f.name)}</h4><p>${esc(f.desc)}</p></div>
    </button>`).join("");
  $("#detail-spots").innerHTML = DETAIL_SPOTS.map((s, i) => `
    <div class="detail-spot"><span class="n">0${i + 1}</span><div><h3>${esc(s.name)}</h3><p>${esc(s.note)}</p></div></div>`).join("");
}

/* =========================================================
   ③ コース
   ========================================================= */
function renderQuestions() {
  $("#questions").innerHTML = QUESTIONS.map((q, i) => `
    <section class="q">
      <p class="no">0${i + 1}</p>
      <h2>${esc(q.title)}</h2>
      <div class="opts">
        ${q.options.map((o) => `<button class="opt ${state.course[q.key] === o ? "on" : ""}" data-key="${q.key}" data-value="${o}">${o}</button>`).join("")}
      </div>
    </section>`).join("");
}
function generateCourse() {
  const btn = $("#generate");
  btn.disabled = true;
  btn.textContent = "AIがコースを考えています…";
  $("#result").hidden = true;
  $("#loading").hidden = false;

  setTimeout(() => {
    const { time, mood, move } = state.course;
    const c = COURSES[mood];
    const minutes = move === "徒歩" ? 8 : 5;
    $("#result").innerHTML = `
      <div class="result-top">
        <div class="row"><span class="tagb">AI PICK</span><span class="meta">${esc(time)} · ${esc(move)}</span></div>
        <h2>${esc(c.title)}</h2><p>${esc(c.description)}</p>
      </div>
      <div class="result-body">
        ${c.spots.map((name, i) => `
          <div class="spot"><span class="num">0${i + 1}</span>
            <div><h3>${esc(name)}</h3><p>${i === 0 ? "郡山駅からスタート" : `${esc(move)}で約${minutes}分`}</p></div></div>`).join("")}
        <button class="btn-dark">このコースではじめる <span>→</span></button>
        <button class="retry" id="retry">別のコースを提案してもらう</button>
      </div>`;
    $("#loading").hidden = true;
    $("#result").hidden = false;
    btn.disabled = false;
    btn.textContent = "✦ AIにコースを提案してもらう";
    state.stats.courses += 0; // ← コースを保存したいときはここで更新
  }, 900);
}

/* =========================================================
   ④ マイページ
   ========================================================= */
function renderMyPage() {
  $("#stats").innerHTML = [
    [state.stats.lamp, "灯"],
    [state.stats.courses, "コース"],
    [state.posts.length, "投稿"],
  ].map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join("");
  $("#my-posts").innerHTML = state.posts.slice(0, 6).map((p) => `<img src="${esc(p.image)}" alt="">`).join("");
}
/* ---------- QRスキャナー(カメラ起動まで) ---------- */
let scanStream = null;

function stopCamera() {
  if (scanStream) scanStream.getTracks().forEach((t) => t.stop());
  scanStream = null;
  $("#scan-video").srcObject = null;
}
function showScanError(text) {
  $("#scanner").classList.add("error");
  $("#scan-msg").textContent = text;
}
async function openScanner() {
  const el = $("#scanner");
  el.hidden = false;
  el.classList.remove("error");
  $("#scan-msg").textContent = "カメラを起動しています…";

  if (!window.isSecureContext) {
    return showScanError("カメラは HTTPS か localhost のページでしか使えません。\nスマホの標準カメラでQRを読むこともできます。");
  }
  if (!navigator.mediaDevices?.getUserMedia) {
    return showScanError("このブラウザではカメラを使えません。\nスマホの標準カメラでQRを読んでください。");
  }
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
      audio: false,
    });
    if (el.hidden) { stream.getTracks().forEach((t) => t.stop()); return; }
    scanStream = stream;
    const video = $("#scan-video");
    video.srcObject = stream;
    await video.play();
    $("#scan-msg").textContent = "QRコードを枠に合わせてください";
    /* ここに「QRを読み取る処理」を追加する(次のステップ)*/
  } catch (err) {
    const msg = {
      NotAllowedError: "カメラの使用が許可されていません。\nブラウザの設定でカメラを許可してください。",
      NotFoundError: "カメラが見つかりませんでした。",
      NotReadableError: "ほかのアプリがカメラを使っています。",
    }[err.name] || "カメラを起動できませんでした。";
    showScanError(msg);
  }
}
function closeScanner() {
  stopCamera();
  $("#scanner").hidden = true;
}
/* =========================================================
   イベント(クリックはまとめて委譲)
   ========================================================= */
document.addEventListener("click", (e) => {
  if (e.target.closest("[data-scan]")) return openScanner();    
  if (e.target.closest("#scan-close")) return closeScanner();   
  const go    = e.target.closest("[data-go]");
  const open  = e.target.closest("[data-open]");
  const close = e.target.closest("[data-close]");
  const opt   = e.target.closest(".opt");
  const preset = e.target.closest("#presets button");

  if (go)    return showScreen(go.dataset.go);
  if (open)  return openSheet(open.dataset.open);
  if (close) return closeSheets();
  if (e.target.classList.contains("backdrop")) return closeSheets();
  if (opt)   { state.course[opt.dataset.key] = opt.dataset.value; return renderQuestions(); }
  if (preset){ state.compose.image = preset.dataset.src; return renderCompose(); }
  if (e.target.id === "share")    return submitPost();
  if (e.target.id === "generate" || e.target.id === "retry") return generateCourse();
});

$("#compose-text").addEventListener("input", (e) => { state.compose.text = e.target.value; renderCompose(); });

$("#photo").addEventListener("change", (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => { state.compose.image = reader.result; renderCompose(); };
  reader.readAsDataURL(file);
});

document.addEventListener("keydown", (e) => { if (e.key === "Escape") { closeSheets(); closeScanner(); } });
/* ---------- 起動 ---------- */
renderHome();
renderDiscover();
renderQuestions();
renderCompose();
renderMyPage();
