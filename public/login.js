document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await response.json();
            if (data.success) {
                window.location.href = 'list.html';
            } else {
                alert('ログインに失敗しました。ユーザー名とパスワードを確認してください。');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('エラーが発生しました。もう一度お試しください。');
        }
    });
});
