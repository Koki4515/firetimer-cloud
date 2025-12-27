const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

const FILE = path.join(__dirname, "FireTimerCloud.ini");

let lastUpdate = 0;

function ensureIni() {
    if (!fs.existsSync(FILE)) {
        fs.writeFileSync(FILE,
`[fire]
lastNormal=0
nextNormal=0
lastLvl3=0
nextLvl3=0
`);
    }
}

app.get("/update", (req, res) => {
    ensureIni();

    const ln = Number(req.query.lastNormal || 0);
    const nn = Number(req.query.nextNormal || 0);
    const l3 = Number(req.query.lastLvl3 || 0);
    const n3 = Number(req.query.nextLvl3 || 0);

    const newest = Math.max(ln, l3);

    if (newest <= lastUpdate) {
        return res.send("SKIP");
    }

    lastUpdate = newest;

    const data =
`[fire]
lastNormal=${ln}
nextNormal=${nn}
lastLvl3=${l3}
nextLvl3=${n3}
`;

    fs.writeFileSync(FILE, data, "utf8");
    res.send("OK");
});

app.get("/FireTimerCloud.ini", (req, res) => {
    ensureIni();
    res.sendFile(FILE);
});

app.listen(PORT, () => {
    console.log("FireTimer Cloud started on port", PORT);
});
