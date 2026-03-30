const SHEET_NAME = 'TrafficLights'

function getSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(SHEET_NAME)

    // Якщо аркуша немає — створити з початковими даними
    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME)
        sheet.appendRow(['id', 'name', 'orientation', 'activeColor', 'redClicks', 'yellowClicks', 'greenClicks'])
        sheet.appendRow([1, 'Світлофор #1', 'vertical', 'red', 0, 0, 0])
        sheet.appendRow([2, 'Світлофор #2', 'horizontal', 'green', 0, 0, 0])
    }
    return sheet
}

// ── Читання всіх рядків як масив об'єктів ───────────────────
function getAllLights() {
    const sheet = getSheet()
    const rows = sheet.getDataRange().getValues()
    const headers = rows[0]
    return rows.slice(1).map(row => {
        const obj = {}
        headers.forEach((h, i) => obj[h] = row[i])
        return obj
    })
}

// ── Знайти рядок по id (повертає номер рядка, 1-based) ──────
function findRowById(id) {
    const sheet = getSheet()
    const data = sheet.getDataRange().getValues()
    for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(id)) return i + 1
    }
    return -1
}

// ── ЄДИНА ТОЧКА ВХОДУ ДЛЯ ВСІХ ЗАПИТІВ (GET) ────────────────
function doGet(e) {
    // Захист на випадок прямого відкриття лінки
    if (!e || !e.parameter) {
        return ContentService.createTextOutput("Бекенд працює!").setMimeType(ContentService.MimeType.TEXT);
    }

    const action = e.parameter.action
    let result

    try {
        const sheet = getSheet()

        // ── Отримати всі ─────────────────────────────────────────
        if (!action || action === 'getAllLights') {
            result = { status: 'ok', data: getAllLights() }

            // ── Отримати один ────────────────────────────────────────
        } else if (action === 'getLight') {
            const id = e.parameter.id
            const lights = getAllLights()
            const light = lights.find(l => String(l.id) === String(id))

            if (!light) {
                result = { status: 'error', message: `Світлофор з id=${id} не знайдено` }
            } else {
                result = { status: 'ok', data: light }
            }

            // ── Змінити орієнтацію ───────────────────────────────────
        } else if (action === 'setOrientation') {
            const id = e.parameter.id
            const orientation = e.parameter.orientation
            const validOrientations = ['vertical', 'horizontal']

            if (!validOrientations.includes(orientation)) {
                result = { status: 'error', message: 'orientation має бути vertical або horizontal' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    sheet.getRange(row, 3).setValue(orientation)  // колонка 3 = orientation
                    result = { status: 'ok', message: `Орієнтацію змінено на ${orientation}` }
                }
            }

            // ── Змінити активний колір ───────────────────────────────
        } else if (action === 'setColor') {
            const id = e.parameter.id
            const color = e.parameter.color
            const validColors = ['red', 'yellow', 'green']

            if (!validColors.includes(color)) {
                result = { status: 'error', message: 'color має бути red, yellow або green' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    sheet.getRange(row, 4).setValue(color)  // колонка 4 = activeColor
                    result = { status: 'ok', message: `Активний колір змінено на ${color}` }
                }
            }

            // ── Збільшити лічильник кліків ───────────────────────────
        } else if (action === 'addClick') {
            const id = e.parameter.id
            const color = e.parameter.color
            const colorCol = { red: 5, yellow: 6, green: 7 }

            if (!colorCol[color]) {
                result = { status: 'error', message: 'color має бути red, yellow або green' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    const col = colorCol[color]
                    const current = sheet.getRange(row, col).getValue()
                    sheet.getRange(row, col).setValue(current + 1)
                    result = { status: 'ok', message: `Клік для ${color} збережено`, clicks: current + 1 }
                }
            }

            // ── Додати новий світлофор ───────────────────────────────
        } else if (action === 'addLight') {
            const all = getAllLights()
            const newId = all.length > 0 ? Math.max(...all.map(l => Number(l.id))) + 1 : 1
            const name = e.parameter.name ? decodeURIComponent(e.parameter.name) : `Світлофор #${newId}`
            const orientation = e.parameter.orientation || 'vertical'

            sheet.appendRow([newId, name, orientation, 'red', 0, 0, 0])
            result = { status: 'ok', message: 'Світлофор додано', id: newId }

            // ── Видалити світлофор ───────────────────────────────────
        } else if (action === 'deleteLight') {
            const id = e.parameter.id
            const row = findRowById(id)

            if (row === -1) {
                result = { status: 'error', message: `id=${id} не знайдено` }
            } else {
                sheet.deleteRow(row)
                result = { status: 'ok', message: `Світлофор id=${id} видалено` }
            }

            // ── Невідома дія ─────────────────────────────────────────
        } else {
            result = {
                status: 'error',
                message: 'Невідома дія. Доступні: getAllLights, getLight, setOrientation, setColor, addClick, addLight, deleteLight',
            }
        }
    } catch (err) {
        result = { status: 'error', message: err.toString() }
    }

    return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
}
