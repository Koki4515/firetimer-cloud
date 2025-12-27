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
  level INTEGER,
  timestamp INTEGER
)
`).run();

// ➕ добавить пожар (ТОЛЬКО первый игрок)
app.post('/fire', (req, res) => {
  const { server, level, timestamp } = req.body;
  if (!server || !level || !timestamp) return res.sendStatus(400);

  // очистка старых
  const now = Date.now();
  db.prepare(`
    DELETE FROM fires
    WHERE (level < 3 AND ? - timestamp > 3600000)
       OR (level = 3 AND ? - timestamp > 28800000)
  `).run(now, now);

  // если уже есть свежий пожар — не дублируем
  const exists = db.prepare(`
    SELECT * FROM fires
    WHERE server = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `).get(server);

  if (exists && now - exists.timestamp < 60000) {
    return res.json({ status: 'skip' });
  }

  db.prepare(`
    INSERT INTO fires (server, level, timestamp)
    VALUES (?, ?, ?)
  `).run(server, level, timestamp);

  console.log('[CLOUD] Fire saved:', server, level);
  res.json({ status: 'ok' });
});

// 📥 получить последний пожар
app.get('/fire/latest', (req, res) => {
  const server = req.query.server;
  if (!server) return res.json(null);

  const fire = db.prepare(`
    SELECT level, timestamp
    FROM fires
    WHERE server = ?
    ORDER BY timestamp DESC
    LIMIT 1
  `).get(server);

  res.json(fire || null);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log('🔥 FireTimer Cloud running on port', PORT);
});
