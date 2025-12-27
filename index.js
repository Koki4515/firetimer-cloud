const express = require("express");
const app = express();

let lastFire = {};

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.post("/fire", (req, res) => {
    const { server, level, timestamp } = req.body;

    if (!server || !level || !timestamp) {
        console.log("❌ Bad request:", req.body);
        return res.status(400).send("BAD_REQUEST");
    }

    lastFire[server] = {
        level: Number(level),
        timestamp: Number(timestamp)
    };

    console.log("🔥 Fire saved:", server, lastFire[server]);
    res.send("OK");
});

app.get("/fire", (req, res) => {
    const server = req.query.server;
    if (!server || !lastFire[server]) {
        return res.status(404).send("NO_FIRE");
    }

    const fire = lastFire[server];
    res.send(`${fire.level};${fire.timestamp}`);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log("🔥 FireTimer cloud online on port", PORT);
});
