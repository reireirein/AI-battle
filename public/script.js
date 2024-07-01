document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const playerSelect = document.getElementById('player-select');
    const judgeButton = document.getElementById('judge-button');
    const resultDiv = document.getElementById('result');

    let chatHistory = [];

    chatForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const message = userInput.value.trim();
        const player = playerSelect.value;
        if (message) {
            addMessage(player, message);
            userInput.value = '';
        }
    });

    judgeButton.addEventListener('click', async () => {
        const result = await getJudgement();
        resultDiv.textContent = result;
    });

    function addMessage(player, message) {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `player-${player}`);
        messageElement.textContent = `プレイヤー${player}: ${message}`;
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        chatHistory.push({ player, message });
    }

    async function getJudgement() {
        try {
            const response = await fetch('/judge', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ chatHistory }),
            });
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error:', error);
            return 'エラーが発生しました。もう一度お試しください。';
        }
    }
});