const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
const port = 3000;

const pool = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'chat_battle',
});

app.use(express.static('public'));
app.use(express.json());

app.get('/topics', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM thread ORDER BY created_at DESC');
        res.json(rows);
    } catch (error) {
        console.error('Error fetching topics:', error);
        res.status(500).send('Server error');
    }
});

app.post('/new-topic', async (req, res) => {
    const { title } = req.body;

    if (!title) {
        return res.status(400).send('Title is required');
    }

    try {
        await pool.query('INSERT INTO thread (title, created_at) VALUES (?, NOW())', [title]);
        res.status(201).send('Topic created successfully');
    } catch (error) {
        console.error('Error creating topic:', error);
        res.status(500).send('Server error');
    }
});

app.delete('/delete-topic/:id', async (req, res) => {
    const topicId = req.params.id;

    try {
        const [result] = await pool.query('DELETE FROM thread WHERE id = ?', [topicId]);

        if (result.affectedRows > 0) {
            res.status(200).send('Topic deleted successfully');
        } else {
            res.status(404).send('Topic not found');
        }
    } catch (error) {
        console.error('Error deleting topic:', error);
        res.status(500).send('Server error');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
