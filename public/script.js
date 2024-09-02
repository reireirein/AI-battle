document.addEventListener('DOMContentLoaded', () => {
    const userInfo = document.getElementById('user-info');
    const userNameElement = document.getElementById('user-name');
    const logoutButton = document.getElementById('logout-btn');
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    // セッションチェック
    fetch('/session-check')
        .then(response => response.json())
        .then(data => {
            if (data.success && data.user) {
                currentUser = data.user;
                updateLoginStatus();
            }
        });

    // ログインフォームの送信処理
    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            currentUser = username;
            updateLoginStatus();
        } else {
            alert(data.message);
        }
    });

    // 新規登録フォームの送信処理
    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const username = document.getElementById('new-username').value;
        const password = document.getElementById('new-password').value;

        const response = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();
        if (data.success) {
            alert('ユーザー登録が完了しました');
        } else {
            alert(data.message);
        }
    });

    // ログアウトボタンのクリックイベント
    logoutButton.addEventListener('click', async () => {
        const response = await fetch('/logout', { method: 'POST' });
        const data = await response.json();
        if (data.success) {
            currentUser = null;
            updateLoginStatus();
        } else {
            alert('ログアウトに失敗しました');
        }
    });

    // ログイン状態の更新
    function updateLoginStatus() {
        if (currentUser) {
            userNameElement.textContent = currentUser;
            userInfo.style.display = 'block';
            logoutButton.style.display = 'block';
            loginForm.style.display = 'none';
            registerForm.style.display = 'none';
        } else {
            userNameElement.textContent = 'ログインしていません';
            userInfo.style.display = 'none';
            logoutButton.style.display = 'none';
            loginForm.style.display = 'block';
            registerForm.style.display = 'block';
        }
    }
});
