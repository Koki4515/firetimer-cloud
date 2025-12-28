const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

// Используем переменную окружения для порта (это нужно для Render)
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());

// Обработчик для скачивания файла с данными
app.get('/download_ini', (req, res) => {
    fs.readFile(path.join(__dirname, 'FireTimerCloud.ini'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        res.json(JSON.parse(data));  // Отправляем данные клиенту
    });
});

// Обработчик для загрузки данных в файл
app.post('/upload_ini', (req, res) => {
    const data = req.body; // Получаем данные из запроса
    fs.writeFile(path.join(__dirname, 'FireTimerCloud.ini'), JSON.stringify(data), 'utf8', (err) => {
        if (err) {
            return res.status(500).send('Ошибка записи в файл');
        }
        res.status(200).send('Данные успешно загружены');
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
