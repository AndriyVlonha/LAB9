# Laboratory Report No. 8

**Student:** Andriy Vlonha  
**Group:** 42-CS  
**Date:** 23/03/2026

---

## Objective

Create an API using Google Apps Script. Implement traffic light state management and retrieval of all traffic lights list. This work is a continuation of Laboratory Work No. 7.

---

## Procedure

---

### 1. Creating the Project Based on Lab 7

```bash
xcopy /E /I LAB7\lab7 LAB8\lab8
cd LAB8\lab8
git init
```

Created `googleapp.js` in the project root with the API code.

---

### 2. Project Structure

```
lab8/
├── googleapp.js          ← API CODE (Google Apps Script)
├── README.md
├── db.json
├── src/
│   ├── context/
│   │   └── TrafficLightsContext.jsx
│   ├── components/
│   └── Pages/
```

**Screenshot:**
<div align="center">
  <figure>
    <img src="Images/project_structure.png" width="60%" alt="Project Structure"/>
    <br/>
    <sub><b>Fig. 1:</b> Project structure with googleapp.js</sub>
  </figure>
</div>

---

### 3. Database — Google Sheets

Data is stored in Google Sheets. The `TrafficLights` sheet is created automatically on first run.

**Table structure:**

| id | name | orientation | activeColor | redClicks | yellowClicks | greenClicks |
|----|------|-------------|-------------|-----------|--------------|-------------|
| 1 | Traffic Light #1 | vertical | red | 0 | 0 | 0 |
| 2 | Traffic Light #2 | horizontal | green | 0 | 0 | 0 |

**Screenshot:**
<div align="center">
  <figure>
    <img src="Images/google_sheets.png" width="80%" alt="Google Sheets"/>
    <br/>
    <sub><b>Fig. 2:</b> Google Sheets as database</sub>
  </figure>
</div>

---

### 4. API Implementation (googleapp.js)

**File: `googleapp.js`**

#### GET requests — `doGet(e)`

```javascript
function doGet(e) {
  const action = e.parameter.action

  if (action === 'getAllLights') {
    // Returns list of all traffic lights
    return jsonResponse({ status: 'ok', data: getAllLights() })

  } else if (action === 'getLight') {
    // Returns one traffic light by id
    const light = getAllLights().find(l => String(l.id) === e.parameter.id)
    return jsonResponse({ status: 'ok', data: light })
  }
}
```

#### POST requests — `doPost(e)`

```javascript
function doPost(e) {
  const body = JSON.parse(e.postData.contents)

  if (body.action === 'setOrientation') {
    // Changes orientation: vertical / horizontal
    sheet.getRange(row, 3).setValue(body.orientation)

  } else if (body.action === 'setColor') {
    // Changes active color: red / yellow / green
    sheet.getRange(row, 4).setValue(body.color)

  } else if (body.action === 'addClick') {
    // Increments click counter for color
    const current = sheet.getRange(row, col).getValue()
    sheet.getRange(row, col).setValue(current + 1)

  } else if (body.action === 'addLight') {
    // Adds a new traffic light
    sheet.appendRow([newId, name, orientation, 'red', 0, 0, 0])

  } else if (body.action === 'deleteLight') {
    // Deletes a traffic light
    sheet.deleteRow(row)
  }
}
```

**Screenshot:**
<div align="center">
  <figure>
    <img src="Images/apps_script_code.png" width="80%" alt="Apps Script Code"/>
    <br/>
    <sub><b>Fig. 3:</b> API code in Google Apps Script editor</sub>
  </figure>
</div>

---

### 5. Deploying the API

**Steps:**
1. Google Sheets → Extensions → Apps Script
2. Paste contents of `googleapp.js`
3. Deploy → New deployment → Web App
4. Execute as: **Me** | Who has access: **Anyone**
5. Copy the deployment URL

**Screenshot:**
<div align="center">
  <figure>
    <img src="Images/deploy.png" width="80%" alt="Deploy"/>
    <br/>
    <sub><b>Fig. 4:</b> Deploying Web App in Google Apps Script</sub>
  </figure>
</div>

---

### 6. API Testing

**GET — list all traffic lights:**

```
https://script.google.com/a/macros/chnu.edu.ua/s/AKfycbxEDUmu8naNeY7D4gtwN1xtg3Qyxp3z1s98TaT7LEECjds3yQ9VBukQsKn2x1u7OvOe/exec?action=getAllLights
```

**Response:**
```json
{
  "status": "ok",
  "data": [
    {
      "id": 1,
      "name": "Traffic Light #1",
      "orientation": "vertical",
      "activeColor": "red",
      "redClicks": 5,
      "yellowClicks": 3,
      "greenClicks": 7
    }
  ]
}
```

**POST — change orientation:**
```json
{ "action": "setOrientation", "id": 1, "orientation": "horizontal" }
```

**POST — change active color:**
```json
{ "action": "setColor", "id": 1, "color": "green" }
```

**Screenshot:**
<div align="center">
  <figure>
    <img src="Images/api_test.png" width="80%" alt="API Test"/>
    <br/>
    <sub><b>Fig. 5:</b> API testing in browser</sub>
  </figure>
</div>

---

### 7. Running the Project

```bash
npm run start
```

**Screenshot:**
<div align="center">
  <figure>
    <img src="Images/run_dev.png" width="80%" alt="Running"/>
    <br/>
    <sub><b>Fig. 6:</b> Running the project</sub>
  </figure>
</div>

---

## Results

### Implemented Features:

1. **GET /getAllLights** — list all traffic lights with current state
2. **GET /getLight?id=1** — get one traffic light by id
3. **POST setOrientation** — change orientation (vertical/horizontal)
4. **POST setColor** — change active color (red/yellow/green)
5. **POST addClick** — increment click counter
6. **POST addLight** — add new traffic light
7. **POST deleteLight** — delete traffic light

### Technical Details:

- **Google Apps Script:** `doGet(e)`, `doPost(e)`, `ContentService`
- **Google Sheets:** `SpreadsheetApp`, `getSheet()`, `appendRow()`, `deleteRow()`
- **REST API:** JSON responses with `status`, `data`, `message` fields
- **Validation:** checking valid values for orientation and color

---

## Conclusion

During this laboratory work, I successfully:
- Created an API using Google Apps Script
- Implemented GET and POST handlers
- Implemented traffic light state management (orientation, color)
- Implemented list of all traffic lights with current state
- Deployed Web App and tested the API
- Used Google Sheets as a database

---

## References

- GitHub Repository: [link](https://github.com/AndriyVlonha/Lab8_WEB)
- Published API: [link](https://script.google.com/a/macros/chnu.edu.ua/s/AKfycbxEDUmu8naNeY7D4gtwN1xtg3Qyxp3z1s98TaT7LEECjds3yQ9VBukQsKn2x1u7OvOe/exec?action=getAllLights)
- Google Apps Script: https://developers.google.com/apps-script
- ContentService: https://developers.google.com/apps-script/reference/content

---