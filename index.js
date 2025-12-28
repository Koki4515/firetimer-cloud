const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());  // Для парсинга JSON в теле запроса

// Обработчик для загрузки данных в файл
app.post('/upload_ini', (req, res) => {
    const data = req.body;
    console.log('Полученные данные:', data);  // Логируем полученные данные

    const filePath = path.join(__dirname, 'FireTimerCloud.ini');
    
    fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8', (err) => {
        if (err) {
            console.error('Ошибка записи в файл:', err);
            return res.status(500).send('Ошибка записи в файл');
        }

        console.log('Данные успешно сохранены в FireTimerCloud.ini');
        res.status(200).send('Данные успешно загружены');
    });
});

// Обработчик для получения данных из файла (GET запрос)
app.get('/download_ini', (req, res) => {
    const filePath = path.join(__dirname, 'FireTimerCloud.ini');

    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Ошибка чтения файла:', err);
            return res.status(500).send('Ошибка чтения файла');
        }

        res.json(JSON.parse(data));
    });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на порту ${PORT}`);
});
