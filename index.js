const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs = require('fs');

app.use(bodyParser.json());  // Для обработки JSON-данных

// Путь для загрузки данных в FireTimerCloud.ini
app.post('/upload_ini', (req, res) => {
    const data = req.body; // Получаем данные из запроса
    fs.writeFile('FireTimerCloud.ini', JSON.stringify(data), 'utf8', (err) => {
        if (err) {
            return res.status(500).send('Ошибка записи в файл');
        }
        res.status(200).send('Данные успешно загружены');
    });
});

// Путь для скачивания данных из FireTimerCloud.ini
app.get('/download_ini', (req, res) => {
    fs.readFile('FireTimerCloud.ini', 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Ошибка чтения файла');
        }
        res.json(JSON.parse(data));  // Отправляем данные клиенту
    });
});

// Запуск сервера на порту 10000
app.listen(10000, () => {
    console.log('Сервер запущен на порту 10000');
});
