const express = require('express');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 10000;  // Убедись, что порт корректно задан

app.use(express.json());  // Для парсинга JSON в теле запроса

// Папка для хранения файлов
const FIRE_TIMER_DIR = './FireTimer';

// Загружаем данные INI
const loadFireTimerData = () => {
    const filePath = `${FIRE_TIMER_DIR}/FireTimerCloud.ini`;
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

// Сохраняем данные INI
const saveFireTimerData = (data) => {
    const filePath = `${FIRE_TIMER_DIR}/FireTimerCloud.ini`;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 4));  // Записываем данные в форматированный JSON
};

// Обработчик для получения данных с облака
app.get('/download_ini', (req, res) => {
    const fireTimerData = loadFireTimerData();
    res.json(fireTimerData);  // Возвращаем данные
});

// Обработчик для загрузки данных в облако
app.post('/upload_ini', express.json(), (req, res) => {
    const fireTimerData = req.body;
    saveFireTimerData(fireTimerData);  // Сохраняем обновленные данные
    res.send('Данные успешно обновлены.');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Сервер работает на порту ${port}`);
});
