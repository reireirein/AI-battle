const express = require('express');
const mysql = require('mysql2/promise'); // mysql2/promise を追加
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // bcrypt を追加

const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(bodyParser.json());

const pool = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'chat_battle',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

app.get('/topics', async (req, res) => {
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('SELECT * FROM threads ORDER BY created_at DESC');
        connection.release();

        res.json(rows);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).json({ message: 'トピックの取得に失敗しました' });
    }
});

app.post('/delete-topic', async (req, res) => {
    const { id } = req.body;
    try {
        const connection = await pool.getConnection();
        await connection.execute('DELETE FROM threads WHERE id = ?', [id]);
        connection.release();

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).json({ message: 'トピックの削除に失敗しました' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
