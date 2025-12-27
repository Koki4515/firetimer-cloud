const express = require("express");
const app = express();

app.use(express.json());

const fires = {}; 
// fires[server] = { normal: timestamp, rank3: timestamp }

app.post("/fire", (req, res) => {
    const { server, type, timestamp } = req.body;

    if (!server || !type || !timestamp) {
        return res.status(400).json({ error: "bad_request" });
    }

    if (!fires[server]) {
        fires[server] = { normal: null, rank3: null };
    }

    fires[server][type] = timestamp;

    console.log("[FIRE]", server, type, timestamp);
    res.json({ status: "ok" });
});

app.get("/fire", (req, res) => {
    const server = req.query.server;
    if (!server || !fires[server]) {
        return res.json({ normal: null, rank3: null });
    }

    res.json(fires[server]);
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
    console.log("FireTimer cloud online on port", PORT);
});
