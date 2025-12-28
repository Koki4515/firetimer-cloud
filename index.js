const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 10000;

const fireTimerDir = path.join(__dirname, '..', 'FireTimer');
const cloudIniPath = path.join(fireTimerDir, 'FireTimerCloud.ini');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/download_ini', (req, res) => {
    fs.readFile(cloudIniPath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading INI file');
        }
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(data);
    });
});

app.post('/upload_ini', (req, res) => {
    const { lastNormal, nextNormal, lastLvl3, nextLvl3 } = req.body;

    if (!lastNormal || !nextNormal || !lastLvl3 || !nextLvl3) {
        return res.status(400).send('Missing data');
    }

    const fireData = `lastNormal=${lastNormal}\nnextNormal=${nextNormal}\nlastLvl3=${lastLvl3}\nnextLvl3=${nextLvl3}\n`;

    fs.writeFile(cloudIniPath, fireData, 'utf8', (err) => {
        if (err) {
            return res.status(500).send('Error writing INI file');
        }
        res.status(200).send('Data saved to cloud');
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
