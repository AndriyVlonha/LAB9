const SHEET_NAME = 'TrafficLights'
const USERS_SHEET = 'Users'
const STATS_SHEET = 'Stats'

function getStatsSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(STATS_SHEET)

    if (!sheet) {
        sheet = ss.insertSheet(STATS_SHEET)
        sheet.appendRow(['f1Toggles', 'carCycles'])
        sheet.appendRow([0, 0])
    }
    return sheet
}

function getSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(SHEET_NAME)

    if (!sheet) {
        sheet = ss.insertSheet(SHEET_NAME)
        sheet.appendRow(['id', 'name', 'orientation', 'activeColor', 'redClicks', 'yellowClicks', 'greenClicks'])
        sheet.appendRow([1, 'Світлофор #1', 'vertical', 'red', 0, 0, 0])
        sheet.appendRow([2, 'Світлофор #2', 'horizontal', 'green', 0, 0, 0])
    }
    return sheet
}

// Аркуш користувачів
function getUsersSheet() {
    const ss = SpreadsheetApp.getActiveSpreadsheet()
    let sheet = ss.getSheetByName(USERS_SHEET)

    if (!sheet) {
        sheet = ss.insertSheet(USERS_SHEET)
        sheet.appendRow(['username', 'password', 'createdAt'])
    }
    return sheet
}

// Знайти користувача за логіном
function findUser(username) {
    const sheet = getUsersSheet()
    const data = sheet.getDataRange().getValues()
    for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(username)) {
            return { username: data[i][0], password: data[i][1], row: i + 1 }
        }
    }
    return null
}

// Читання всіх світлофорів
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

// Знайти рядок по id
function findRowById(id) {
    const sheet = getSheet()
    const data = sheet.getDataRange().getValues()
    for (let i = 1; i < data.length; i++) {
        if (String(data[i][0]) === String(id)) return i + 1
    }
    return -1
}

// Головний обробник
function doGet(e) {
    if (!e || !e.parameter) {
        return ContentService.createTextOutput("Бекенд працює!").setMimeType(ContentService.MimeType.TEXT);
    }

    const action = e.parameter.action
    let result

    try {
        const sheet = getSheet()

        // Реєстрація
        if (action === 'register') {
            const username = e.parameter.username
            const password = e.parameter.password

            if (!username || !password) {
                result = { status: 'error', message: 'Логін і пароль обовʼязкові' }
            } else if (findUser(username)) {
                result = { status: 'error', message: 'Користувач вже існує' }
            } else {
                const usersSheet = getUsersSheet()
                usersSheet.appendRow([username, password, new Date().toISOString()])
                result = { status: 'ok', message: 'Зареєстровано', user: { username } }
            }

        // Авторизація
        } else if (action === 'login') {
            const username = e.parameter.username
            const password = e.parameter.password

            if (!username || !password) {
                result = { status: 'error', message: 'Логін і пароль обовʼязкові' }
            } else {
                const user = findUser(username)
                if (!user || String(user.password) !== String(password)) {
                    result = { status: 'error', message: 'Невірний логін або пароль' }
                } else {
                    result = { status: 'ok', message: 'Авторизовано', user: { username: user.username } }
                }
            }

        // Отримати всі світлофори
        } else if (!action || action === 'getAllLights') {
            result = { status: 'ok', data: getAllLights() }

        // Отримати один світлофор
        } else if (action === 'getLight') {
            const id = e.parameter.id
            const lights = getAllLights()
            const light = lights.find(l => String(l.id) === String(id))

            if (!light) {
                result = { status: 'error', message: `Світлофор з id=${id} не знайдено` }
            } else {
                result = { status: 'ok', data: light }
            }

        // Змінити орієнтацію
        } else if (action === 'setOrientation') {
            const id = e.parameter.id
            const orientation = e.parameter.orientation

            if (!['vertical', 'horizontal'].includes(orientation)) {
                result = { status: 'error', message: 'orientation має бути vertical або horizontal' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    sheet.getRange(row, 3).setValue(orientation)
                    result = { status: 'ok', message: `Орієнтацію змінено на ${orientation}` }
                }
            }

        // Змінити колір
        } else if (action === 'setColor') {
            const id = e.parameter.id
            const color = e.parameter.color

            if (!['red', 'yellow', 'green'].includes(color)) {
                result = { status: 'error', message: 'color має бути red, yellow або green' }
            } else {
                const row = findRowById(id)
                if (row === -1) {
                    result = { status: 'error', message: `id=${id} не знайдено` }
                } else {
                    sheet.getRange(row, 4).setValue(color)
                    result = { status: 'ok', message: `Активний колір змінено на ${color}` }
                }
            }

        // Клік
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

        // Додати світлофор
        } else if (action === 'addLight') {
            const all = getAllLights()
            const newId = all.length > 0 ? Math.max(...all.map(l => Number(l.id))) + 1 : 1
            const name = e.parameter.name ? decodeURIComponent(e.parameter.name) : `Світлофор #${newId}`
            const orientation = e.parameter.orientation || 'vertical'

            sheet.appendRow([newId, name, orientation, 'red', 0, 0, 0])
            result = { status: 'ok', message: 'Світлофор додано', id: newId }

        // Видалити світлофор
        } else if (action === 'deleteLight') {
            const id = e.parameter.id
            const row = findRowById(id)

            if (row === -1) {
                result = { status: 'error', message: `id=${id} не знайдено` }
            } else {
                sheet.deleteRow(row)
                result = { status: 'ok', message: `Світлофор id=${id} видалено` }
            }

        // F1 Stats actions
        } else if (action === 'addF1Toggle') {
            const sheet = getStatsSheet()
            const val = Number(sheet.getRange(2, 1).getValue() || 0) + 1
            sheet.getRange(2, 1).setValue(val)
            result = { status: 'ok', message: 'F1 Toggles++', val }

        } else if (action === 'addCarCycle') {
            const sheet = getStatsSheet()
            const val = Number(sheet.getRange(2, 2).getValue() || 0) + 1
            sheet.getRange(2, 2).setValue(val)
            result = { status: 'ok', message: 'Car Cycles++', val }

        } else if (action === 'resetF1Stats') {
            const sheet = getStatsSheet()
            sheet.getRange(2, 1).setValue(0)
            sheet.getRange(2, 2).setValue(0)
            result = { status: 'ok', message: 'F1 Stats скинуто' }

        } else if (action === 'getF1Stats') {
            const sheet = getStatsSheet()
            const f1Toggles = Number(sheet.getRange(2, 1).getValue() || 0)
            const carCycles = Number(sheet.getRange(2, 2).getValue() || 0)
            result = { status: 'ok', data: { f1Toggles, carCycles } }

        // Невідома дія
        } else {
            result = {
                status: 'error',
                message: 'Невідома дія. Доступні: register, login, getAllLights, getLight, setOrientation, setColor, addClick, addLight, deleteLight',
            }
        }
    } catch (err) {
        result = { status: 'error', message: err.toString() }
    }

    return ContentService
        .createTextOutput(JSON.stringify(result))
        .setMimeType(ContentService.MimeType.JSON)
}
