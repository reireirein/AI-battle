// script.js
document.addEventListener('DOMContentLoaded', () => {
    const chatForm = document.getElementById('chat-form');
    const userInput = document.getElementById('user-input');
    const chatMessages = document.getElementById('chat-messages');
    const playerSelect = document.getElementById('player-select');
    const judgeButton = document.getElementById('judge-button');
    const resultDiv = document.getElementById('result');
    const debateTopicElement = document.getElementById('debate-topic');

    let chatHistory = [];
    let currentTopic = '';

    // URLからトピックを取得
    const urlParams = new URLSearchParams(window.location.search);
<<<<<<< HEAD
    const topicId = urlParams.get('topic');

    // トピックを設定
    const topics = JSON.parse(localStorage.getItem('topics')) || [];
    const topic = topics.find(t => t.id === topicId);
    if (topic) {
        currentTopic = topic.title;
    } else {
        currentTopic = 'トピックが見つかりません';
    }

    // トピックを表示
    debateTopicElement.textContent = `議論：${currentTopic}`;
=======
    const topicTitle = urlParams.get('title') || 'トピックが見つかりません';

    // トピックを表示
    debateTopicElement.textContent = `議論：${decodeURIComponent(topicTitle)}`;
>>>>>>> 98bdaaf2196d5411a2fc68562712a5030974a427

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
<<<<<<< HEAD
                body: JSON.stringify({ chatHistory, topic: currentTopic }),
=======
                body: JSON.stringify({ chatHistory, topic: topicTitle }),
>>>>>>> 98bdaaf2196d5411a2fc68562712a5030974a427
            });
            const data = await response.json();
            return data.result;
        } catch (error) {
            console.error('Error:', error);
            return 'エラーが発生しました。もう一度お試しください。';
        }
    }
});
