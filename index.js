const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(cors());  

const SERVER_FILE_PATH = path.join(__dirname, 'timer.ini');  
let lastUpdateTime = 0;  

const MIN_UPDATE_INTERVAL = 24 * 60 * 60 * 1000;  

function saveDataToServerFile(data) {
    fs.writeFile(SERVER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл timer.ini на сервере:', err);
            return;
        }
        console.log('Данные успешно сохранены в timer.ini на сервере');
        lastUpdateTime = Date.now(); 
    });
}

function loadDataFromServerFile() {
    try {
        const data = fs.readFileSync(SERVER_FILE_PATH, 'utf8');
        return JSON.parse(data); 
    } catch (err) {
        console.error('Ошибка при чтении файла timer.ini:', err);
        return null;
    }
}

function restoreFileWithLatestData() {
    const lastKnownData = {
        fire: {
            nextLvl3: 1767020648,
            lastLvl3: 1767021848,
            lastNormal: 1767020648,
            nextNormal: 1767021848
        }
    };
    saveDataToServerFile(lastKnownData);
}

app.post('/upload_ini', (req, res) => {
    const data = req.body;

    if (Date.now() - lastUpdateTime < MIN_UPDATE_INTERVAL) {
        return res.status(400).send('Ошибка: данные могут обновляться не чаще чем раз в 24 часа.');
    }

    console.log('Полученные данные для загрузки в серверный файл:', data);

    saveDataToServerFile(data);

    res.status(200).send('Данные успешно загружены в серверный файл timer.ini');
});

app.get('/download_ini', (req, res) => {
    if (!fs.existsSync(SERVER_FILE_PATH)) {
        console.log('Файл не найден, восстанавливаем файл с последними значениями.');
        restoreFileWithLatestData();  
    }

    const data = loadDataFromServerFile();
    if (data) {
        res.json(data); 
    } else {
        res.status(500).send('Ошибка при чтении данных из файла timer.ini');
    }
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Доступен по URL: https://firetimer-cloud-1.onrender.com`);
});
