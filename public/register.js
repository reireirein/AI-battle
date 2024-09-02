document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('register-form');

    registerForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        try {
            const response = await fetch('/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, password }),
            });
            
            const data = await response.json();
            if (data.success) {
                alert('ユーザー登録が完了しました。ログインしてください。');
                window.location.href = 'index.html';
            } else {
                alert('ユーザー登録に失敗しました。もう一度お試しください。');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('エラーが発生しました。もう一度お試しください。');
        }
    });
});
