# 🎯 Шпаргалка для захисту Lab 8

---

## Що нового відносно Lab 7

| Lab 7 | Lab 8 |
|-------|-------|
| json-server (локальний) | Google Apps Script (хмарний) |
| db.json (файл на комп'ютері) | Google Sheets (хмарна БД) |
| працює тільки локально | доступний з будь-якого місця за URL |
| новий файл — context/ | новий файл — googleapp.js в корені |

---

## 1 головна нова річ

### googleapp.js — це весь Lab 8

```js
// GET — читати дані
function doGet(e) {
  if (e.parameter.action === 'getAllLights') {
    return jsonResponse(getAllLights())  // повертає всі світлофори
  }
}

// POST — змінювати дані
function doPost(e) {
  const body = JSON.parse(e.postData.contents)

  if (body.action === 'setColor') {
    sheet.getRange(row, 4).setValue(body.color)  // пишемо в Google Sheets
  }
}
```
**Скажи:** *"doGet і doPost — це вбудовані функції Apps Script. Google автоматично викликає їх при GET і POST запитах до URL"*

---

## Де що знаходиться

| Що | Де |
|----|-----|
| Весь код API | `googleapp.js` в корені проєкту |
| База даних | Google Sheets → аркуш `TrafficLights` |
| URL API | `https://script.google.com/a/macros/chnu.edu.ua/s/AKfyc.../exec` |

---

## Всі endpoints

| Метод | Параметри | Що робить |
|-------|-----------|-----------|
| GET | `?action=getAllLights` | список всіх світлофорів |
| GET | `?action=getLight&id=1` | один світлофор |
| POST | `setOrientation`, `id`, `orientation` | змінити vertical/horizontal |
| POST | `setColor`, `id`, `color` | змінити red/yellow/green |
| POST | `addClick`, `id`, `color` | +1 до лічильника кліків |
| POST | `addLight`, `name` | додати світлофор |
| POST | `deleteLight`, `id` | видалити світлофор |

---

## Питання і відповіді

**"Що таке Google Apps Script?"**
→ Платформа від Google для написання скриптів на JavaScript. Може підключатись до Google Sheets, Gmail, Drive тощо. Деплоїться як Web App і отримує публічний URL

**"Як працює doGet / doPost?"**
→ Це зарезервовані назви функцій в Apps Script. Коли хтось робить GET запит до URL — автоматично викликається doGet(e). POST → doPost(e). Параметр `e` містить всі дані запиту

**"Де зберігаються дані?"**
→ В Google Sheets. SpreadsheetApp.getActiveSpreadsheet() відкриває таблицю, getSheetByName() знаходить аркуш, appendRow() додає рядок

**"Як задеплоїти?"**
→ Apps Script → Deploy → New deployment → Web App → Execute as Me / Anyone → копіюєш URL

**"Чим відрізняється від json-server?"**
→ json-server працює локально на своєму комп'ютері. Google Apps Script — хмарний сервіс, доступний з будь-якого пристрою за публічним URL без запущеного сервера

**"Що змінилось відносно Lab 7?"**
→ Тільки додано один файл googleapp.js в корінь. Сам React-додаток не чіпали