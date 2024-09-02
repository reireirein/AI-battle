document.addEventListener('DOMContentLoaded', () => {
    const topicList = document.getElementById('topic-list');

    async function fetchTopics() {
        try {
            const response = await fetch('/topics');
            const topics = await response.json();
            renderTopics(topics);
        } catch (error) {
            console.error('Error fetching topics:', error);
            alert('トピックの取得に失敗しました');
        }
    }

    function renderTopics(topics) {
        topicList.innerHTML = '';
        topics.forEach(topic => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${topic.title}</td>
                <td>${formatDate(topic.created_at)}</td>
                <td>
                    <a href="/debate.html?topic=${topic.id}" class="button">議論に参加</a>
                    <button class="button delete-btn" data-id="${topic.id}">削除</button>
                </td>
            `;
            topicList.appendChild(row);
        });

        // 削除ボタンにイベントリスナーを追加
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const topicId = e.target.getAttribute('data-id');
                deleteTopic(topicId);
            });
        });
    }

    function deleteTopic(topicId) {
        if (confirm('このスレッドを削除してもよろしいですか？')) {
            fetch('/delete-topic', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: topicId }),
            }).then(() => {
                fetchTopics(); // 削除後にトピックを再読込
            }).catch(error => {
                console.error('Error deleting topic:', error);
                alert('トピックの削除に失敗しました');
            });
        }
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let day = date.getDate();
        let hours = date.getHours();
        let minutes = date.getMinutes();

        // 1桁の場合は0埋めする
        month = month < 10 ? `0${month}` : month;
        day = day < 10 ? `0${day}` : day;
        hours = hours < 10 ? `0${hours}` : hours;
        minutes = minutes < 10 ? `0${minutes}` : minutes;

        return `${year}/${month}/${day} ${hours}:${minutes}`;
    }

    fetchTopics();
});
