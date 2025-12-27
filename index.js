const express = require("express");
const fs = require("fs");

const app = express();
app.use(express.json());

const DATA_FILE = "fire.json";

/* ===== utils ===== */
function load() {
    if (!fs.existsSync(DATA_FILE)) return null;
    return JSON.parse(fs.readFileSync(DATA_FILE));
}

function save(data) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

function isExpired(fire) {
    const now = Math.floor(Date.now() / 1000);

    if (fire.type === "normal") {
        return (now - fire.timestamp) > 3600; // 1 час
    }

    if (fire.type === "lvl3") {
        return (now - fire.timestamp) > 8 * 3600; // 8 часов
    }

    return true;
}

/* ===== routes ===== */
app.post("/fire", (req, res) => {
    const { type, timestamp } = req.body;
    if (!type || !timestamp) {
        return res.json({ accepted: false });
    }

    const current = load();

    // если есть актуальный пожар — не перезаписываем
    if (current && !isExpired(current)) {
        return res.json({
            accepted: false,
            type: current.type,
            timestamp: current.timestamp
        });
    }

    save({ type, timestamp });

    return res.json({
        accepted: true,
        type,
        timestamp
    });
});

app.get("/fires", (req, res) => {
    const fire = load();

    if (!fire) {
        return res.json({ exists: false });
    }

    if (isExpired(fire)) {
        fs.unlinkSync(DATA_FILE);
        return res.json({ exists: false });
    }

    res.json({
        exists: true,
        type: fire.type,
        timestamp: fire.timestamp
    });
});

/* ===== start ===== */
app.listen(process.env.PORT || 3000, () => {
    console.log("🔥 FireTimer cloud running");
});
