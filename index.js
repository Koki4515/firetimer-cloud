const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');  // Для поддержки CORS

const app = express();
const PORT = process.env.PORT || 10000;

// Используем bodyParser для парсинга JSON в теле запроса
app.use(bodyParser.json());

// Разрешаем запросы с любого источника (локальная машина, Postman, другие серверы)
app.use(cors());

// Путь к серверному файлу timer.ini на облаке (Render)
const SERVER_FILE_PATH = path.join(__dirname, 'timer.ini');  // Путь к файлу на облаке

// Функция для сохранения данных в файл timer.ini на сервере
function saveDataToServerFile(data) {
    fs.writeFile(SERVER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл timer.ini на сервере:', err);
            return;
        }
        console.log('Данные успешно сохранены в timer.ini на сервере');
    });
}

// Обработчик для загрузки данных с клиента (из файла FireTimerCloud.ini) и сохранения в серверный файл timer.ini
app.post('/upload_ini', (req, res) => {
    const data = req.body;

    // Логируем полученные данные
    console.log('Полученные данные для загрузки в серверный файл:', data);

    // Сохраняем данные в файл на сервере
    saveDataToServerFile(data);

    res.status(200).send('Данные успешно загружены в серверный файл timer.ini');
});

// Обработчик для получения данных с сервера (для запроса с локальной машины)
app.get('/download_ini', (req, res) => {
    // Читаем серверный файл timer.ini
    fs.readFile(SERVER_FILE_PATH, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла timer.ini на сервере:', err);
            return res.status(500).send('Ошибка чтения файла timer.ini');
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
