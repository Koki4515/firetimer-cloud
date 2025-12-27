const express = require('express');
const cors = require('cors');
const Database = require('better-sqlite3');

const app = express();
app.use(cors());
app.use(express.json());

const db = new Database('fires.db');

db.prepare(`
  CREATE TABLE IF NOT EXISTS fires (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    server TEXT,
    type TEXT,
    time TEXT,
    timestamp INTEGER
  )
`).run();

// ➕ добавить пожар
app.post('/fire', (req, res) => {
  const { server, type, time, timestamp } = req.body;
  if (!server || !type || !time || !timestamp) {
    return res.status(400).json({ error: 'Bad data' });
  }

  db.prepare(
    `INSERT INTO fires (server, type, time, timestamp)
     VALUES (?, ?, ?, ?)`
  ).run(server, type, time, timestamp);

  res.json({ status: 'ok' });
});

// 📥 получить последние пожары
app.get('/fires', (req, res) => {
  const server = req.query.server;
  if (!server) return res.status(400).json([]);

  const rows = db.prepare(
    `SELECT type, time FROM fires
     WHERE server = ?
     ORDER BY timestamp DESC
     LIMIT 10`
  ).all(server);

  res.json(rows.reverse());
});

// 🩺 health check
app.get('/', (_, res) => {
  res.send('FireTimer Cloud is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log('FireTimer Cloud started on port', PORT);
});
