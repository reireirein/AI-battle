document.addEventListener('DOMContentLoaded', () => {
    const newThreadBtn = document.getElementById('new-thread-btn');
    const newThreadForm = document.getElementById('new-thread-form');
    const newTopicInput = document.getElementById('new-topic-input');
    const createThreadBtn = document.getElementById('create-thread-btn');
    const topicList = document.getElementById('topic-list');

    let topics = [];

    newThreadBtn.addEventListener('click', () => {
        newThreadForm.style.display = 'block';
    });

    createThreadBtn.addEventListener('click', createTopic);

    async function createTopic() {
        const newTopic = newTopicInput.value.trim();
        if (newTopic) {
            try {
                const response = await fetch('/create-topic', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title: newTopic }),
                });
                if (!response.ok) {
                    throw new Error('ネットワークエラーが発生しました');
                }
                const data = await response.json();
                if (data.success) {
                    topics.unshift({ id: data.id, title: data.title, created_at: data.date });
                    renderTopics();
                    newTopicInput.value = '';
                    newThreadForm.style.display = 'none';
                } else {
                    alert('トピックの作成に失敗しました');
                }
            } catch (error) {
                console.error('エラー:', error);
                alert('エラーが発生しました: ' + error.message);
            }
        } else {
            alert('お題を入力してください');
        }
    }

    async function fetchTopics() {
        try {
            const response = await fetch('/topics');
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました');
            }
            topics = await response.json();
            renderTopics();
        } catch (error) {
            console.error('トピック取得エラー:', error);
            alert('トピックの取得に失敗しました: ' + error.message);
        }
    }

    function renderTopics() {
        topicList.innerHTML = '';
        topics.forEach(topic => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${topic.title}</td>
                <td>${formatDate(topic.created_at)}</td>
                <td>
                    <a href="/debate.html?topic=${topic.id}&title=${encodeURIComponent(topic.title)}" class="button">議論に参加</a>
                    <button class="button delete-btn" data-id="${topic.id}">削除</button>
                </td>
            `;
            topicList.appendChild(row);
        });
        setupEventListeners();
    }

    function setupEventListeners() {
        topicList.addEventListener('click', async (e) => {
            if (e.target.classList.contains('delete-btn')) {
                const topicId = e.target.getAttribute('data-id');
                if (confirm('このスレッドを削除してもよろしいですか？')) {
                    await deleteTopic(topicId);
                }
            }
        });
    }

    async function deleteTopic(topicId) {
        try {
            const response = await fetch(`/delete-topic/${topicId}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('ネットワークエラーが発生しました');
            }
            const data = await response.json();
            if (data.success) {
                topics = topics.filter(topic => topic.id !== parseInt(topicId));
                renderTopics();
            } else {
                alert('トピックの削除に失敗しました');
            }
        } catch (error) {
            console.error('エラー:', error);
            alert('エラーが発生しました: ' + error.message);
        }
    }

    function formatDate(dateTimeStr) {
        const dateTime = new Date(dateTimeStr);
        const year = dateTime.getFullYear();
        const month = ('0' + (dateTime.getMonth() + 1)).slice(-2);
        const day = ('0' + dateTime.getDate()).slice(-2);
        const hours = ('0' + dateTime.getHours()).slice(-2);
        const minutes = ('0' + dateTime.getMinutes()).slice(-2);
        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    fetchTopics();
});
