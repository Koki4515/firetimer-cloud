import express from "express";
const app = express();

let lastFire = {};

app.use(express.urlencoded({ extended: true }));

app.post("/fire", (req, res) => {
    const { server, level, timestamp } = req.body;
    if (!server || !level || !timestamp) {
        return res.status(400).send("Bad request");
    }

    lastFire[server] = {
        level: Number(level),
        timestamp: Number(timestamp)
    };

    console.log("🔥 Fire saved:", lastFire[server]);
    res.send("OK");
});

app.get("/fire", (req, res) => {
    const fire = lastFire[req.query.server];
    if (!fire) return res.status(404).send("NO_FIRE");
    res.send(`${fire.level};${fire.timestamp}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🔥 FireTimer cloud online on port", PORT);
});
