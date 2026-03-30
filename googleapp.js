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

function doGet(e) {
    const action = e.parameter.action
    let result

    try {
        if (!action || action === 'getAllLights') {
            result = { status: 'ok', data: getAllLights() }

        } else if (action === 'getLight') {
            const id = e.parameter.id
            const lights = getAllLights()
            const light = lights.find(l => String(l.id) === String(id))

            if (!light) {
                result = { status: 'error', message: `Світлофор з id=${id} не знайдено` }
            } else {
                result = { status: 'ok', data: light }
            }

        } else {
            result = {
                status: 'error',
                message: 'Невідома дія. Доступні: getAllLights, getLight',
            }
        }
    } catch (err) {
        result = { status: 'error', message: err.toString() }
    }

    return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
}

function doPost(e) {
    let body, result

    try {
        body = JSON.parse(e.postData.contents)
    } catch {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: 'Невалідний JSON' }))
            .setMimeType(ContentService.MimeType.JSON)
    }

    try {
        const { action, id } = body
        const sheet = getSheet()

        // ── Змінити орієнтацію ───────────────────────────────
        if (action === 'setOrientation') {
            const validOrientations = ['vertical', 'horizontal']
            if (!validOrientations.includes(body.orientation)) {
                result = { status: 'error', message: 'orientation має бути vertical або horizontal' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    sheet.getRange(row, 3).setValue(body.orientation)  // колонка 3 = orientation
                    result = { status: 'ok', message: `Орієнтацію змінено на ${body.orientation}` }
                }
            }

            // ── Змінити активний колір ───────────────────────────
        } else if (action === 'setColor') {
            const validColors = ['red', 'yellow', 'green']
            if (!validColors.includes(body.color)) {
                result = { status: 'error', message: 'color має бути red, yellow або green' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    sheet.getRange(row, 4).setValue(body.color)  // колонка 4 = activeColor
                    result = { status: 'ok', message: `Активний колір змінено на ${body.color}` }
                }
            }

            // ── Збільшити лічильник кліків ───────────────────────
        } else if (action === 'addClick') {
            const colorCol = { red: 5, yellow: 6, green: 7 }
            if (!colorCol[body.color]) {
                result = { status: 'error', message: 'color має бути red, yellow або green' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    const col = colorCol[body.color]
                    const current = sheet.getRange(row, col).getValue()
                    sheet.getRange(row, col).setValue(current + 1)
                    result = { status: 'ok', message: `Клік для ${body.color} збережено`, clicks: current + 1 }
                }
            }

            // ── Додати новий світлофор ───────────────────────────
        } else if (action === 'addLight') {
            const all = getAllLights()
            const newId = all.length > 0 ? Math.max(...all.map(l => Number(l.id))) + 1 : 1
            const name = body.name || `Світлофор #${newId}`
            const orientation = body.orientation || 'vertical'
            sheet.appendRow([newId, name, orientation, 'red', 0, 0, 0])
            result = { status: 'ok', message: 'Світлофор додано', id: newId }

            // ── Видалити світлофор ───────────────────────────────
        } else if (action === 'deleteLight') {
            const row = findRowById(id)
            if (row === -1) {
                result = { status: 'error', message: `id=${id} не знайдено` }
            } else {
                sheet.deleteRow(row)
                result = { status: 'ok', message: `Світлофор id=${id} видалено` }
            }

        } else {
            result = {
                status: 'error',
                message: 'Невідома дія. Доступні: setOrientation, setColor, addClick, addLight, deleteLight',
            }
        }
    } catch (err) {
        result = { status: 'error', message: err.toString() }
    }

    return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
}