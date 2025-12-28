const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());  // Для парсинга JSON в теле запроса

// Папка для хранения файлов FireTimer на сервере
const BASE_DIR = path.join(__dirname, 'FireTimer');  // Основная папка на сервере
const KOKI4_DIR = path.join(BASE_DIR, 'KOKI4');  // Папка KOKI4 на облаке

// Проверка и создание папки KOKI4
const createKoki4Folder = () => {
    if (!fs.existsSync(KOKI4_DIR)) {
        fs.mkdirSync(KOKI4_DIR, { recursive: true });  // Создаем папку KOKI4, если её нет
        console.log("Папка KOKI4 была создана.");
    }
};

// Загружаем данные из FireTimerCloud.ini на сервере
const loadFireTimerData = () => {
    const filePath = path.join(BASE_DIR, 'FireTimerCloud.ini');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);  // Возвращаем данные, если файл существует
    }
    return {
        fire: {
            lastNormal: Date.now(),
            nextNormal: Date.now() + 60 * 20 * 1000,  // Через 20 минут
            lastLvl3: Date.now(),
            nextLvl3: Date.now() + 60 * 180 * 1000  // Через 3 часа
        }
    };
};

// Сохраняем данные в папку KOKI4
const saveFireTimerDataToKoki4 = (data) => {
    createKoki4Folder();  // Создаем папку KOKI4, если её нет
    const filePath = path.join(KOKI4_DIR, 'FireTimerCloud.ini');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));  // Записываем данные в JSON формат
};

// Обработчик для получения данных с облака (из KOKI4)
app.get('/download_ini', (req, res) => {
    createKoki4Folder();  // Проверяем, что папка существует
    const fireTimerData = loadFireTimerData();  // Загружаем данные из FireTimerCloud.ini на сервере
    res.json(fireTimerData);  // Отправляем данные из папки KOKI4
});

// Обработчик для загрузки данных в облако
app.post('/upload_ini', express.json(), (req, res) => {
    createKoki4Folder();  // Проверяем, что папка существует
    const fireTimerData = req.body;  // Получаем данные из POST запроса

    // Сохраняем данные в папке KOKI4
    saveFireTimerDataToKoki4(fireTimerData);
    res.send('Данные успешно обновлены в облаке в папке KOKI4.');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
});
