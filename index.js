const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');

// Получаем путь к директории, где находится этот файл
const moonloaderDir = path.join(__dirname, 'moonloader', 'config');  // Папка moonloader/config

// Путь к INI файлу
const cloudIniFilePath = path.join(moonloaderDir, 'FireTimerCloud.ini');

// Настройка Express для работы с JSON
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Запуск сервера
app.listen(10000, () => {
    console.log('Server is running on port 10000');
});

// Обработка POST запроса на загрузку INI
app.post('/upload_ini', (req, res) => {
    const fireData = req.body;  // Данные, полученные от Lua скрипта
    console.log('Received POST data:', fireData);

    // Проверка на наличие данных
    if (!fireData.lastNormal || !fireData.nextNormal || !fireData.lastLvl3 || !fireData.nextLvl3) {
        return res.status(400).send('Invalid data: Missing required fields');
    }

    // Формирование содержимого INI файла
    const iniContent = `[FireData]
lastNormal=${fireData.lastNormal}
nextNormal=${fireData.nextNormal}
lastLvl3=${fireData.lastLvl3}
nextLvl3=${fireData.nextLvl3}`;

    // Запись данных в INI файл
    fs.writeFile(cloudIniFilePath, iniContent, (err) => {
        if (err) {
            console.error('Error saving data to INI:', err);
            return res.status(500).send('Error saving data to INI');
        }
        res.send('Data successfully saved to cloud');
    });
});

// Обработка запроса на скачивание INI
app.get('/download_ini', (req, res) => {
    // Чтение содержимого INI файла
    fs.readFile(cloudIniFilePath, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading INI file:', err);
            return res.status(500).send('Error reading INI file');
        }
        res.send(data);  // Отправляем содержимое INI файла обратно клиенту
    });
});
