const express = require('express');
const mysql = require('mysql2/promise');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

// MySQL データベース接続
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_battle'
};

// トピックの取得
app.get('/topics', async (req, res) => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT id, title, created_at FROM thread ORDER BY created_at DESC');
    await connection.end();
    res.json(rows);
});

// トピックの作成
app.post('/create-topic', async (req, res) => {
    const { title } = req.body;
    const createdAtUTC = new Date().toISOString(); // UTC time
    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute('INSERT INTO thread (title, created_at) VALUES (?, ?)', [title, createdAtUTC]);
    await connection.end();
    const createdAtJP = new Date(createdAtUTC).toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }).replace(/\//g, '-');
    res.json({ success: true, id: result.insertId, title, date: createdAtJP });
});


// トピックの削除
app.delete('/delete-topic/:id', async (req, res) => {
    const { id } = req.params;
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('DELETE FROM thread WHERE id = ?', [id]);
    await connection.end();
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
