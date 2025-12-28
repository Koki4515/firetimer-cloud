const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000; // Используем переменную окружения для порта или по умолчанию 3000

// Используем body-parser для обработки JSON и URL encoded данных
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Путь к INI файлу на сервере
const cloudIniFilePath = path.join(__dirname, 'FireTimerCloud.ini');

// Загружаем файл INI
app.get('/download_ini', (req, res) => {
    fs.readFile(cloudIniFilePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Error reading INI file');  // Сообщение на английском
        }
        res.setHeader('Content-Type', 'application/octet-stream');
        res.send(data); // Отправляем INI файл обратно клиенту
    });
});

// Загружаем данные из файла INI и отправляем их в ответ
app.post('/upload_ini', (req, res) => {
    console.log('Received POST data:', req.body);  // Логируем полученные данные

    const fireData = req.body;

    if (!fireData.lastNormal || !fireData.nextNormal || !fireData.lastLvl3 || !fireData.nextLvl3) {
        return res.status(400).send('Invalid data received');
    }

    // Формируем данные для INI файла
    const iniContent = `[FireData]
lastNormal=${fireData.lastNormal}
nextNormal=${fireData.nextNormal}
lastLvl3=${fireData.lastLvl3}
nextLvl3=${fireData.nextLvl3}
`;

    fs.writeFile(cloudIniFilePath, iniContent, (err) => {
        if (err) {
            return res.status(500).send('Error writing to INI file');
        }
        res.send('Data successfully saved to cloud');
    });
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port 10000`);
});
