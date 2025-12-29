const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(cors());  // Разрешаем CORS

const SERVER_FILE_PATH = path.join(__dirname, 'timer.ini');  // Путь к файлу на сервере
let lastUpdateTime = 0;  // Время последнего обновления файла (в миллисекундах)

const MIN_UPDATE_INTERVAL = 24 * 60 * 60 * 1000;  // 24 часа в миллисекундах

// Функция для сохранения данных в файл timer.ini на сервере
function saveDataToServerFile(data) {
    fs.writeFile(SERVER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл timer.ini на сервере:', err);
            return;
        }
        console.log('Данные успешно сохранены в timer.ini на сервере');
        lastUpdateTime = Date.now();  // Обновляем время последнего обновления
    });
}

// Функция для загрузки данных из файла timer.ini
function loadDataFromServerFile() {
    try {
        const data = fs.readFileSync(SERVER_FILE_PATH, 'utf8');
        return JSON.parse(data);  // Преобразуем JSON строку в объект
    } catch (err) {
        console.error('Ошибка при чтении файла timer.ini:', err);
        return null;
    }
}

// Функция для создания файла с дефолтными значениями
function createDefaultFile() {
    const defaultData = {
        fire: {
            nextLvl3: 0,
            lastLvl3: 0,
            lastNormal: 0,
            nextNormal: 0
        }
    };

    saveDataToServerFile(defaultData);
}

// Эндпоинт для обработки загрузки данных в файл timer.ini
app.post('/upload_ini', (req, res) => {
    const data = req.body;

    // Проверяем, прошло ли менее 24 часов с последнего обновления
    if (Date.now() - lastUpdateTime < MIN_UPDATE_INTERVAL) {
        return res.status(400).send('Ошибка: данные могут обновляться не чаще чем раз в 24 часа.');
    }

    // Логируем полученные данные
    console.log('Полученные данные для загрузки в серверный файл:', data);

    // Сохраняем данные в файл на сервере
    saveDataToServerFile(data);

    res.status(200).send('Данные успешно загружены в серверный файл timer.ini');
});

// Эндпоинт для получения данных из файла timer.ini
app.get('/download_ini', (req, res) => {
    // Проверяем, существует ли файл
    if (!fs.existsSync(SERVER_FILE_PATH)) {
        console.log('Файл не найден, создаём файл с дефолтными значениями.');
        createDefaultFile();
    }

    const data = loadDataFromServerFile();
    if (data) {
        res.json(data);  // Отправляем данные в ответ
    } else {
        res.status(500).send('Ошибка при чтении данных из файла timer.ini');
    }
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
    console.log(`Доступен по URL: https://firetimer-cloud-1.onrender.com`);
});
