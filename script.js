/* =========================================================
   ごちたま — 郡山グルメアプリ
   画面: ホーム / みつける / コース / マイページ + シート2つ
   ========================================================= */

   // ログイン状態を確認
if (sessionStorage.getItem("isLogin") !== "true") {

    // ログインしていなければログイン画面へ
    window.location.href = "login.html";
}

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
course: { time: "90分", mood: "さっぱり", move: "徒歩" }  ,
stats:   { lamp: 0, courses: 0 },
review: {
    rating: 0,
    comment: ""
},
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
  {
    key: "time",
    title: "どのくらい時間がある？",
    options: ["10分", "30分", "60分", "90分", "半日"]
  },
  {
    key: "mood",
    title: "今日はどんな気分？",
    options: [
      "さっぱり",
      "がっつり",
      "甘いもの",
      "珍しいもの",
      "ほっとするもの",
      "少しだけ食べたい"
    ]
  },
  {
    key: "move",
    title: "移動方法は？",
    options: ["徒歩", "車", "公共交通"]
  }
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

function getCurrentLocation() {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ lat: 37.3981, lng: 140.3886 }); // 非対応ブラウザ用
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      },
      (err) => {
        console.warn("位置情報の取得が拒否されたため郡山駅を使用します:", err);
        resolve({ lat: 37.3981, lng: 140.3886 }); // 拒否・エラー時のフォールバック
      },
      { timeout: 5000 }
    );
  });
}

async function generateCourse() {
  const btn = $("#generate");
  btn.disabled = true;
  btn.textContent = "現在地とコースを検索中…";
  $("#result").hidden = true;
  $("#loading").hidden = false;

  try {
    const { time, mood, move } = state.course;

    // ① まずブラウザから現在地を取得する
    const currentPos = await getCurrentLocation();

    // ② 3つの条件＋現在地をサーバー（Gemini API）へ送信
    const response = await fetch("/api/course", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        time,
        mood,
        move,
        lat: currentPos.lat,
        lng: currentPos.lng,
      }),
    });

    if (!response.ok) throw new Error("サーバーエラー");
    const c = await response.json();

    // ③ HTMLの組み立て
    $("#result").innerHTML = `
      <div class="result-top">
        <div class="row"><span class="tagb">AI PICK</span><span class="meta">${esc(time)} · ${esc(move)}</span></div>
        <h2>${esc(c.title)}</h2><p>${esc(c.description)}</p>
      </div>
      <div class="result-body">
        <div class="spot"><span class="num">START</span>
          <div><h3>現在地</h3><p>ここからスタート</p></div></div>
        ${c.spots.map((spot, i) => `
          <div class="spot"><span class="num">0${i + 1}</span>
            <div><h3>${esc(spot.name)}</h3><p>${esc(spot.access)}</p></div></div>`).join("")}
        <button class="btn-dark" id="openGoogleMaps">Googleマップアプリでナビ開始 <span>→</span></button>
        <div id="map" style="height: 300px; width: 100%; margin: 16px 0; border-radius: 8px;"></div>
        <button class="retry" id="retry">別のコースを提案してもらう</button>
      </div>`;

    $("#loading").hidden = true;
    $("#result").hidden = false;

    // ④ 地図の生成とルート線の描画
    const mapElement = document.getElementById("map");
    if (mapElement && window.google && c.spots.length > 0) {
      const map = new google.maps.Map(mapElement, {
        center: currentPos,
        zoom: 14,
      });

      const lastSpot = c.spots[c.spots.length - 1];
      const waypoints = c.spots.slice(0, -1).map((spot) => spot.name);

      // 自前サーバーの /api/route を呼び出す
      const routeRes = await fetch("/api/route", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          origin: currentPos,
          destination: lastSpot.name,
          waypoints: waypoints,
          move: move,
        }),
      });

      const routeData = await routeRes.json();

      if (routeRes.ok && routeData.encodedPolyline) {
        // 1. ポリライン（ルート線）を地図に描画
        const decodedPath = google.maps.geometry.encoding.decodePath(
          routeData.encodedPolyline
        );
        new google.maps.Polyline({
          path: decodedPath,
          geodesic: true,
          strokeColor: "#1a73e8",
          strokeOpacity: 0.9,
          strokeWeight: 5,
          map: map,
        });

        // 2. スタート地点と各スポットにピンを立てる
        new google.maps.Marker({
          position: currentPos,
          map: map,
          label: "S",
          title: "現在地",
        });

        if (routeData.legs) {
          routeData.legs.forEach((leg, index) => {
            const pos = {
              lat: leg.endLocation.latLng.latitude,
              lng: leg.endLocation.latLng.longitude,
            };
            new google.maps.Marker({
              position: pos,
              map: map,
              label: `${index + 1}`,
              title: c.spots[index]?.name || `スポット${index + 1}`,
            });
          });
        }

        // 3. ルート全体が収まるようにズーム調整
        if (routeData.viewport) {
          const bounds = new google.maps.LatLngBounds(
            {
              lat: routeData.viewport.low.latitude,
              lng: routeData.viewport.low.longitude,
            },
            {
              lat: routeData.viewport.high.latitude,
              lng: routeData.viewport.high.longitude,
            }
          );
          map.fitBounds(bounds);
        }
      } else {
        console.error("ルート描画失敗:", routeData);
        alert("ルート線の描画に失敗しました。");
      }
    }

    // 再生成ボタンの再設定
    const retryBtn = document.getElementById("retry");
    if (retryBtn) retryBtn.addEventListener("click", generateCourse);

  } catch (error) {
    console.error(error);
    $("#loading").hidden = true;
    alert("コースの提案中にエラーが発生しました。");
  } finally {
    btn.disabled = false;
    btn.textContent = "✦ AIにコースを提案してもらう";
  }
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
  $$("#stats b").forEach((b) => countUp(b, Number(b.textContent)));
}
/* ---------- 店舗レビュー ---------- */

function submitReview() {
    const rating = state.review.rating;
    const comment = $("#review-comment").value.trim();

    if (rating === 0) {
        alert("星評価を選択してください。");
        return;
    }

    if (comment === "") {
        alert("感想を入力してください。");
        return;
    }

    alert(
        "レビューを投稿しました！\n" +
        "評価：" + rating + "点\n" +
        "感想：" + comment
    );

    // 入力内容をリセット
    state.review.rating = 0;
    state.review.comment = "";
    $("#review-comment").value = "";

    // 星の表示もリセット
    $$(".review-stars button").forEach(button => {
        button.classList.remove("selected");
    });

    showScreen("home");
}
/* ---------- QRスキャナー ---------- */

let qrScanner = null;

async function openScanner() {
    const el = $("#scanner");
    el.hidden = false;
    el.classList.remove("error");

    $("#scan-msg").textContent = "カメラを起動しています…";
    $("#scan-result").textContent = "";

    if (typeof Html5Qrcode === "undefined") {
        showScanError("QRコード読み取りライブラリを読み込めませんでした。");
        return;
    }

    try {
        qrScanner = new Html5Qrcode("reader");

        await qrScanner.start(
            { facingMode: "environment" },
            {
                fps: 10,
                qrbox: { width: 250, height: 250 }
            },

            (decodedText) => {
    // QRコードから店舗IDを取得
    let shopId = "";

    try {
        const url = new URL(decodedText);
        shopId = url.searchParams.get("shop_id");
    } catch (err) {
        // URLではない場合は読み取った文字列を店舗IDとして扱う
        shopId = decodedText;
    }

    // 店舗情報を確認
    const shops = {
        "001": "大友パン店",
        "002": "ベーカリーロミオ",
        "003": "郡山ブラックのお店"
    };

    const shopName = shops[shopId];

    if (!shopName) {
        $("#scan-msg").textContent = "登録されていない店舗です。";
        return;
    }

    // 店舗名をレビュー画面に表示
    $("#review-shop-name").textContent = shopName;

    // スキャナーを閉じてレビュー画面へ移動
    closeScanner().then(() => {
        showScreen("review");
    });
},
            () => {
                // 読み取り途中のエラーは無視します
            }
        );

        $("#scan-msg").textContent = "QRコードを枠に合わせてください";

    } catch (err) {
        showScanError("カメラを起動できませんでした。カメラの使用を許可してください。");
        console.error(err);
    }
}

async function closeScanner() {
    if (qrScanner) {
        try {
            if (qrScanner.isScanning) {
                await qrScanner.stop();
            }
            qrScanner.clear();
        } catch (err) {
            console.error(err);
        }

        qrScanner = null;
    }

    $("#scanner").hidden = true;
}

function showScanError(text) {
    $("#scanner").classList.add("error");
    $("#scan-msg").textContent = text;
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

  // 星評価
const star = e.target.closest("[data-rating]");

if (star) {
    state.review.rating = Number(star.dataset.rating);

    $$(".review-stars button").forEach(button => {
        const rating = Number(button.dataset.rating);

        button.classList.toggle(
            "selected",
            rating <= state.review.rating
        );
    });

    return;
}

// レビュー投稿
if (e.target.closest("#review-submit")) {
    return submitReview();
}

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

function countUp(el, to, ms = 600) {
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min((now - start) / ms, 1);
    el.textContent = Math.round(to * (1 - Math.pow(1 - t, 3)));
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

// ログアウトボタンを取得
const logoutButton = document.getElementById("logoutButton");

// ログアウトボタンが押されたとき
if (logoutButton) {
    logoutButton.addEventListener("click", function() {

        // ログイン状態を削除
        sessionStorage.removeItem("isLogin");
        
        // ログイン画面に戻る
        window.location.href = "login.html";

    });
}

// QRコード読み取り機能に対応しているか確認
if ("BarcodeDetector" in window) {
    console.log("QRコード読み取りに対応しています");
} else {
    console.log("QRコード読み取りに対応していません");
}