const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const port = 3000;

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());

// Gemini APIの設定
const genAI = new GoogleGenerativeAI('AIzaSyCqDC2XtcMYTI3NLXx2gD_krEd3YIYC1YQ');
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/judge', async (req, res) => {
    try {
        const { chatHistory, topic } = req.body;
        const prompt = `
            次の議論を分析し、客観的に勝者を判断してください。議論のテーマは「${topic}」です。
            プレイヤーAとプレイヤーBの主張を評価し、より説得力のある議論を展開した方を勝者としてください。
            引き分けの場合は「引き分け」と判断してください。
            チャット履歴:
            ${chatHistory.map(msg => `プレイヤー${msg.player}: ${msg.message}`).join('\n')}

            判断結果を以下の形式で返してください：
            勝者: [プレイヤーA or プレイヤーB or 引き分け]
            理由: [簡潔な説明]
        `;

        const result = await model.generateContent(prompt);
        const judgement = result.response.text();

        res.json({ result: judgement });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});