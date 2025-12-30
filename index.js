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

// Функция для сохранения данных в файл
function saveDataToServerFile(data) {
    fs.writeFile(SERVER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл timer.ini на сервере:', err);
            return;
        }
        console.log('Данные успешно сохранены в timer.ini на сервере');
    });
}

// Функция для чтения данных из файла
function loadDataFromServerFile() {
    try {
        const data = fs.readFileSync(SERVER_FILE_PATH, 'utf8');
        return JSON.parse(data); 
    } catch (err) {
        console.error('Ошибка при чтении файла timer.ini:', err);
        return null;
    }
}

// Эндпоинт для получения данных из файла
app.get('/download_ini', (req, res) => {
    if (!fs.existsSync(SERVER_FILE_PATH)) {
        console.log('Файл не найден!');
        return res.status(500).send('Файл не найден!');
    }

    const data = loadDataFromServerFile();
    if (data) {
        res.json(data); 
    } else {
        res.status(500).send('Ошибка при чтении данных из файла timer.ini');
    }
});

// Эндпоинт для загрузки данных на сервер
app.post('/upload_ini', (req, res) => {
    const data = req.body;

    console.log('Полученные данные для загрузки в серверный файл:', data);

    saveDataToServerFile(data);  // Сохраняем полученные данные в файл

    res.status(200).send('Данные успешно загружены в серверный файл timer.ini');
});

app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Доступен по URL: https://firetimer-cloud-1.onrender.com`);
});
