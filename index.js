const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 10000;

app.use(bodyParser.json());
app.use(cors());  // Разрешаем кросс-доменные запросы

// Путь к файлу с данными
const SERVER_FILE_PATH = path.join(__dirname, 'timer.ini');  // Теперь работаем с timer.ini

// Функция для сохранения данных в файл
function saveDataToServerFile(data) {
  fs.writeFile(SERVER_FILE_PATH, JSON.stringify(data, null, 2), 'utf8', (err) => {
    if (err) {
      console.error('Ошибка записи в файл timer.ini:', err);
      return;
    }
    console.log('Данные успешно сохранены в timer.ini');
  });
}

// Функция для чтения данных из файла
function loadDataFromServerFile() {
  try {
    const data = fs.readFileSync(SERVER_FILE_PATH, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error('Ошибка при чтении файла timer.ini:', err);
    return null;
  }
}

// Эндпоинт для получения данных о пожаре
app.get('/download_ini', (req, res) => {
  if (!fs.existsSync(SERVER_FILE_PATH)) {
    console.log('Файл timer.ini не найден!');
    return res.status(404).send('Файл не найден!');
  }

  const data = loadDataFromServerFile();
  if (data) {
    res.json(data);  // Отправляем данные в формате JSON
  } else {
    res.status(500).send('Ошибка при чтении данных из файла timer.ini');
  }
});

// Эндпоинт для загрузки данных на сервер
app.post('/upload_ini', (req, res) => {
  const data = req.body;  // Получаем данные из запроса
  console.log('Полученные данные для загрузки в серверный файл:', data);

  // Сохраняем данные в timer.ini
  saveDataToServerFile(data);
  res.status(200).send('Данные успешно загружены в серверный файл timer.ini');
});

// Обработчик для всех остальных запросов
app.get('*', (req, res) => {
  res.status(200).send('FireTimer Cloud API работает!');
});

// Запуск сервера
app.listen(PORT, () => {
  console.log(`Сервер работает на порту ${PORT}`);
  console.log(`Сервер доступен по адресу: http://localhost:${PORT}`);
});
