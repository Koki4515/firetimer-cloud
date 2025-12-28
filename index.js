const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const axios = require('axios'); // Для HTTP запросов

const app = express();
const port = process.env.PORT || 10000;  

const fireTimerDir = path.join(__dirname, '../FireTimer'); 
const cloudFilePath = path.join(fireTimerDir, 'FireTimerCloud.ini');  

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/download_ini', (req, res) => {

    if (fs.existsSync(cloudFilePath)) {
        res.setHeader('Content-Type', 'application/octet-stream');
        res.sendFile(cloudFilePath); 
    } else {
        res.status(404).send('INI file not found in FireTimer directory');
    }
});

app.post('/upload_ini', (req, res) => {
    const data = req.body;

    if (!data) {
        return res.status(400).send('No data received');
    }

    try {
        fs.writeFileSync(cloudFilePath, data, 'utf8'); 
        res.status(200).send('Data successfully saved to cloud');
    } catch (err) {
        console.error('Error writing INI file:', err);
        res.status(500).send('Error saving data');
    }
});

app.post('/upload_ini', (req, res) => {
    try {
        const iniData = fs.readFileSync(cloudFilePath, 'utf8');  
        console.log("INI data to upload: ", iniData);

        axios.post('https://firetimer-cloud-1.onrender.com/upload_ini', iniData, {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(response => {
            console.log("Data uploaded successfully!");
            res.send(response.data);
        })
        .catch(error => {
            console.error("Error while uploading data: ", error);
            res.status(500).send('Error uploading data');
        });
    } catch (err) {
        console.error('Error reading INI file: ', err);
        res.status(500).send('Error reading INI file');
    }
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
