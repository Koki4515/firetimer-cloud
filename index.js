const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 10000;

app.use(express.json());  // Для парсинга JSON в теле запроса

// Папка для хранения файлов FireTimer на сервере
const FIRE_TIMER_DIR = path.join(__dirname, 'FireTimer');  // Локальный путь к папке FireTimer на сервере

// Проверка и создание папки FireTimer
const createFireTimerFolder = () => {
    if (!fs.existsSync(FIRE_TIMER_DIR)) {
        fs.mkdirSync(FIRE_TIMER_DIR, { recursive: true });  // Создаем папку, если ее нет
        console.log("Папка FireTimer была создана.");
    }
};

// Загружаем данные из FireTimerCloud.ini
const loadFireTimerData = () => {
    const filePath = path.join(FIRE_TIMER_DIR, 'FireTimerCloud.ini');
    if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf-8');
        return JSON.parse(data);
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

// Сохраняем данные в FireTimerCloud.ini
const saveFireTimerData = (data) => {
    const filePath = path.join(FIRE_TIMER_DIR, 'FireTimerCloud.ini');
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));  // Записываем данные в форматированный JSON
};

// Обработчик для получения данных с облака
app.get('/download_ini', (req, res) => {
    createFireTimerFolder();  // Проверяем, что папка существует
    const fireTimerData = loadFireTimerData();
    res.json(fireTimerData);  // Возвращаем данные
});

// Обработчик для загрузки данных в облако
app.post('/upload_ini', express.json(), (req, res) => {
    createFireTimerFolder();  // Проверяем, что папка существует
    const fireTimerData = req.body;
    saveFireTimerData(fireTimerData);  // Сохраняем обновленные данные в FireTimerCloud.ini
    res.send('Данные успешно обновлены.');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
});
