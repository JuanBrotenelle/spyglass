# SpyGlass

## О проекте

**SpyGlass** – это браузерное расширение и серверная панель для удаленного мониторинга активности пользователей. Функционал включает:

- Получение скриншотов активной вкладки браузера.
- Извлечение истории посещений.
- Доступ к cookie-файлам (в формате JSON).
- Возможность внедрения удаленных скриптов, срабатывающих при посещении определенных доменов (встроенный редактор).
- Отслеживание онлайн-статуса пользователя.

![UI главной страницы](https://dl.imgdrop.io/file/aed8b140-8472-4813-922b-7ce35ef93c9e/2025/02/04/image97b0e8dd706b7a1e.png)

## Установка и запуск

### 1️⃣ Подготовка окружения

Перед установкой убедитесь, что у вас установлены:

- [Node.js](https://nodejs.org/en/download/)
- [MongoDB](https://www.mongodb.com/)

### 2️⃣ Настройка базы данных

Разверните **MongoDB** (локально или через Atlas). По умолчанию используется база `emt`, но это можно изменить в `.env` (NestJS) или `src/db.js` (ws-сервер).

Создайте первого пользователя в коллекции `users`:

```json
{
  "login": "your_login",
  "password": "your_hashed_password"
}
```

Пароль должен быть **захеширован с помощью bcrypt**.

### 3️⃣ Запуск серверов

Выполните команды:

```sh
cd nest_server && npm install && npm start
cd ws_server && npm install && npm start
```

### 4️⃣ Запуск панели управления

```sh
cd vue_panel && npm install && npm run dev  # Для разработки
npm run build && npm start  # Для продакшена
```

### 5️⃣ Установка браузерного расширения

Загрузите расширение в браузер через режим **разработчика**. После подключения новый пользователь появится в панели через ~1 секунду (используется **SSE Stream**).

## Стек технологий

- **Frontend:** Vue.js, Vue Router, Pinia
- **Backend:** Nest.js, Express.js, Mongoose
- **Коммуникация:** WebSocket, ChromeAPI

## Основные фичи

### 🔹 История посещений

История браузера обновляется при каждом подключении пользователя. Передача данных происходит **пакетами** для оптимизации.

### 🔹 Cookie-файлы

Аналогично истории – передача данных осуществляется **частями**.

### 🔹 Скриншоты

Система отправляет **только текущий экран активной вкладки**. Захват экрана выполняется через **очередь в MongoDB**, поэтому процесс может занять **до 30 секунд**.

### 🔹 Внедрение удаленных скриптов

Вы можете указать домен, при заходе на который сработает скрипт. Встроенный редактор кода позволяет удобно управлять скриптами.

### 🔹 Отслеживание онлайн-статуса

Система в реальном времени показывает, **находится ли пользователь в сети**.

## TODO

✅ Улучшить структуру базы данных
⬜ Добавить **Docker Compose** для быстрого развертывания
⬜ Оптимизировать конфигурационные файлы
⬜ Добавить тесты

## Разработка: Истории и решения

### 🔹 Оптимизация сортировки пользователей (Mongoose Pipeline)

Из-за неоптимального проектирования коллекций, мне пришлось написать **pipeline** на 60 строк для корректной сортировки. Основная проблема заключалась в том, что статусы пользователей (**онлайн/офлайн**) хранились в отдельной коллекции. Первоначально `match` стоял **выше** `lookup`, из-за чего сортировка работала некорректно. Решение оказалось простым, но потребовало времени для осмысления.

### 🔹 ChromeAPI и получение скриншотов

При проектировании расширения я допустил ошибку в архитектуре: **весь код находился в одном файле**. После рефакторинга возникла проблема – сервер пинговал пользователя через **WebSocket**, но `content.js` не реагировал. Оказалось, что я **неправильно использовал runtime.onMessage** между `content` и `background`. Исправил, добавив корректный listener.

### 🔹 Разделение данных на чанки

При тестировании передачи cookie и истории возникла проблема: **не все данные сохранялись в базе**. Решение оказалось простым – отправлять массив **по частям**. Для этого я использовал **временный стек** и отправлял данные через **WebSocket** пакетами.
