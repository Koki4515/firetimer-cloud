const express = require("express");
const cors = require("cors");
const Database = require("better-sqlite3");

const app = express();
app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`[HTTP] ${req.method} ${req.url}`);
  next();
});

const db = new Database("fires.db");

db.prepare(`
CREATE TABLE IF NOT EXISTS fires (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  level INTEGER,
  timestamp INTEGER
)
`).run();

/* очистка старых пожаров */
function cleanup() {
  const now = Math.floor(Date.now() / 1000);
  db.prepare(`
    DELETE FROM fires
    WHERE (level < 3 AND timestamp < ?)
       OR (level = 3 AND timestamp < ?)
  `).run(now - 3600, now - 8 * 3600);
}

/* добавить пожар */
app.post("/fire", (req, res) => {
  const { level, timestamp } = req.body;
  if (!level || !timestamp) return res.status(400).end();

  cleanup();

  const last = db.prepare(
    "SELECT timestamp FROM fires ORDER BY id DESC LIMIT 1"
  ).get();

  // защита от дублей (30 секунд)
  if (last && Math.abs(last.timestamp - timestamp) < 30) {
    return res.json({ status: "duplicate" });
  }

  db.prepare(
    "INSERT INTO fires (level, timestamp) VALUES (?, ?)"
  ).run(level, timestamp);

  res.json({ status: "ok" });
});

/* получить последний пожар */
app.get("/fire", (req, res) => {
  cleanup();
  const row = db.prepare(
    "SELECT level, timestamp FROM fires ORDER BY id DESC LIMIT 1"
  ).get();
  res.json(row || {});
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log("FireTimer Cloud started on port", PORT);
});
