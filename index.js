const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

// Используем bodyParser для парсинга JSON в теле запроса
app.use(bodyParser.json());  // Для парсинга JSON в теле запроса

// Путь к файлу FireTimerCloud.ini, который будет находиться на клиенте, где firetimer.lua
const CLIENT_FILE_PATH = path.join(__dirname, 'FireTimerCloud.ini');  // Убедитесь, что это путь к файлу на клиенте

// Путь к файлу timer.ini, который будет храниться на сервере
const SERVER_FILE_PATH = path.join(__dirname, 'KOKI4', 'timer.ini');  // Папка KOKI4 на сервере

// Обработчик для загрузки данных в файл на сервере
app.post('/upload_ini', (req, res) => {
    const data = req.body;

    // Логируем полученные данные
    console.log('Полученные данные:', data);

    // Сохраняем данные в серверный файл timer.ini
    fs.writeFile(SERVER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл:', err);
            return res.status(500).send('Ошибка записи в файл');
        }

        console.log('Данные успешно сохранены в timer.ini');
        res.status(200).send('Данные успешно загружены');
    });
});

// Обработчик для получения данных из файла на сервере (GET запрос)
app.get('/download_ini', (req, res) => {
    // Читаем файл timer.ini на сервере
    fs.readFile(SERVER_FILE_PATH, 'utf8', (err, data) => {
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
});
