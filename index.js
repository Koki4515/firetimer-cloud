const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const mkdirp = require('mkdirp');  // Для создания директорий

const app = express();
const PORT = process.env.PORT || 10000;

// Используем bodyParser для парсинга JSON в теле запроса
app.use(bodyParser.json());  // Для парсинга JSON в теле запроса

// Путь к файлу FireTimerCloud.ini, который будет находиться в той же папке, где и index.js
const CLIENT_FILE_PATH = path.join(__dirname, 'FireTimerCloud.ini');  // Убедитесь, что это путь к файлу на клиенте

// Путь к папке KOKI4 и файлу timer.ini
const KOKI4_FOLDER_PATH = path.join(__dirname, 'KOKI4');
const SERVER_FILE_PATH = path.join(KOKI4_FOLDER_PATH, 'timer.ini');

// Функция для создания папки KOKI4 (если она не существует)
function createKoki4Folder() {
    if (!fs.existsSync(KOKI4_FOLDER_PATH)) {
        mkdirp.sync(KOKI4_FOLDER_PATH);  // Создание папки и всех промежуточных папок
        console.log('Папка KOKI4 успешно создана');
    }
}

// Функция для сохранения данных в файл на сервере (timer.ini)
function saveDataToServerFile(data) {
    fs.writeFile(SERVER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл:', err);
            return;
        }
        console.log('Данные успешно сохранены в файл timer.ini');
    });
}

// Обработчик для загрузки данных в файл на сервере
app.post('/upload_ini', (req, res) => {
    const data = req.body;

    // Логируем полученные данные
    console.log('Полученные данные:', data);

    // Сохраняем данные в серверный файл timer.ini
    saveDataToServerFile(data);

    res.status(200).send('Данные успешно загружены');
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
    // Создаем папку KOKI4 и файл, если они не существуют
    createKoki4Folder();

    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Доступен по URL: https://firetimer-cloud-1.onrender.com`);
});
