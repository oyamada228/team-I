// ログインフォームを取得
const loginForm = document.getElementById("loginForm");

// ログインボタンが押されたとき
loginForm.addEventListener("submit", function(event) {

    // ページの再読み込みを防ぐ
    event.preventDefault();

    // 入力された情報を取得
    const account = document.getElementById("account").value;
    const password = document.getElementById("password").value;

    // 仮のアカウント情報
    const correctAccount = "test";
    const correctPassword = "1234";

    // 入力内容を確認
    if (account === correctAccount &&
        password === correctPassword) {

        alert("ログイン成功！");
        
        // ログイン状態を保存
        sessionStorage.setItem("isLogin", "true");


        // ログイン状態を保存
        sessionStorage.setItem("loggedIn", "true");

        // ホーム画面へ移動
        window.location.href = "index.html";

    } else {

        // エラーメッセージを表示
        document.getElementById("errorMessage").textContent =
            "アカウント名またはパスワードが違います。";

    }

});