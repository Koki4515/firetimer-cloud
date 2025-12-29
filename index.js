const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Используем bodyParser для парсинга JSON в теле запроса
app.use(bodyParser.json());

// Путь к локальному файлу FireTimerCloud.ini
const CLIENT_FILE_PATH = path.join(__dirname, 'FireTimerCloud.ini');  // Путь к файлу в той же папке, где и index.js

// Функция для сохранения данных в файл FireTimerCloud.ini
function saveDataToFile(data) {
    fs.writeFile(CLIENT_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл:', err);
            return;
        }
        console.log('Данные успешно сохранены в FireTimerCloud.ini');
    });
}

// Обработчик для загрузки данных с клиента и сохранения их в FireTimerCloud.ini
app.post('/upload_ini', (req, res) => {
    const data = req.body;

    // Логируем полученные данные
    console.log('Полученные данные:', data);

    // Сохраняем данные в файл
    saveDataToFile(data);

    res.status(200).send('Данные успешно загружены');
});

// Обработчик для получения данных из файла (GET запрос)
app.get('/download_ini', (req, res) => {
    // Читаем файл FireTimerCloud.ini
    fs.readFile(CLIENT_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).send('Ошибка чтения файла');
        }

        // Отправляем содержимое файла как JSON
        res.json(JSON.parse(data));
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Доступен по URL: https://firetimer-cloud-1.onrender.com`);
});
