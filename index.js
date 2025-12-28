const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();


const fireTimerDir = path.resolve(__dirname, 'FireTimer'); 
const cloudIniFilePath = path.join(fireTimerDir, 'FireTimerCloud.ini'); 


if (!fs.existsSync(fireTimerDir)) {
    fs.mkdirSync(fireTimerDir); 
}


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.listen(10000, () => {
    console.log('Server is running on port 10000');
});


app.post('/upload_ini', (req, res) => {
    const fireData = req.body;
    console.log('Received POST data:', fireData);

  
    if (!fireData.lastNormal || !fireData.nextNormal || !fireData.lastLvl3 || !fireData.nextLvl3) {
        return res.status(400).send('Invalid data: Missing required fields');
    }


    const iniContent = `[FireData]
lastNormal=${fireData.lastNormal}
nextNormal=${fireData.nextNormal}
lastLvl3=${fireData.lastLvl3}
nextLvl3=${fireData.nextLvl3}`;

  
    fs.writeFile(cloudIniFilePath, iniContent, (err) => {
        if (err) {
            console.error('Error saving data to INI:', err);
            return res.status(500).send('Error saving data to INI');
        }
        res.send('Data successfully saved to cloud');
    });
});


app.get('/download_ini', (req, res) => {
    fs.readFile(cloudIniFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading INI file:', err);
            return res.status(500).send('Error reading INI file');
        }
        res.send(data);  
    });
});

console.log('Cloud server is running and waiting for incoming requests.');
