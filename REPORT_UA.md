# Звіт з лабораторної роботи №9

**Студент:** Влонга Андрій  
**Група:** 42-КН  
**Дата:** 29/03/2026

---

## Мета роботи

Перенести логіку проєкту з попередньої лабораторної роботи (взаємодія з Google Apps Script API), інтегрувати бібліотеку компонентів DaisyUI для стилізації інтерфейсу та здійснити розгортання (деплой) готового веб-додатка на платформі Netlify.

---

## Хід виконання роботи

### 1. Перенесення проєкту на основі Lab 8

Роботу розпочато зі створення нової директорії та копіювання вихідного коду попередньої лабораторної роботи, яка містить налаштований React-додаток та підключення до Google Sheets API.

```bash
# Скопіювати lab8 як основу
xcopy /E /I LAB8\lab8 LAB9\lab9
cd LAB9\lab9
git init
```

### 2. Встановлення Tailwind CSS та DaisyUI

Для стилізації проєкту було обрано фреймворк Tailwind CSS та плагін компонентів DaisyUI. Встановлення здійснено через менеджер пакетів npm.

```bash
# Встановлення Tailwind CSS та його залежностей
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Встановлення DaisyUI
npm i -D daisyui@latest
```

### 3. Налаштування конфігурації стилів

Файл `tailwind.config.js` було оновлено для підтримки файлів React та підключення плагіну DaisyUI.

**Файл:** `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('daisyui'),
  ],
  // Налаштування теми DaisyUI (за бажанням)
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}
```

Головний файл стилів `index.css` було очищено від старого CSS і додано директиви Tailwind:

**Файл:** `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Стилізація проєкту за допомогою DaisyUI

Старі CSS-класи були замінені на утиліти Tailwind та готові компоненти DaisyUI. Наприклад, для кнопок, карток та контейнерів використано такі класи:

- **Кнопки:** `btn`, `btn-primary`, `btn-outline`
- **Картки світлофорів:** `card`, `bg-base-100`, `shadow-xl`
- **Лейаут:** `container`, `mx-auto`, `grid`, `flex`, `gap-4`

Приклад оновленого компонента:

```javascript
<div className="card w-96 bg-base-100 shadow-xl">
  <div className="card-body items-center text-center">
    <h2 className="card-title">{light.name}</h2>
    <div className="flex gap-2">
      <button className="btn btn-error" onClick={() => clickColor(light.id, 'red')}>Червоний</button>
      <button className="btn btn-warning" onClick={() => clickColor(light.id, 'yellow')}>Жовтий</button>
      <button className="btn btn-success" onClick={() => clickColor(light.id, 'green')}>Зелений</button>
    </div>
  </div>
</div>
```

### 5. Розгортання (деплой) на Netlify

Для публікації додатка в інтернеті використано платформу Netlify.

Кроки розгортання:

1. Створено фінальну збірку проєкту локально за допомогою команди:

```bash
npm run build
```

2. Утворену папку `dist` (або `build`) завантажено на платформу Netlify (шляхом drag-and-drop або через прив'язку GitHub репозиторію).

3. Налаштовано перенаправлення (`Redirects`) для коректної роботи React Router (за необхідності).

4. Отримано публічне посилання на робочий додаток.

### 6. Завантаження коду в GitHub Classroom

Після успішного тестування задеплоєного додатка всі зміни були збережені та відправлені у віддалений репозиторій GitHub Classroom.

```bash
git add .
git commit -m "feat: added daisyui, styled components and prepared for netlify deploy"
git push origin main
```

---

## Результати роботи

Реалізовані функції та покращення:

- **Міграція логіки:** повністю збережено працездатність API (зчитування, додавання, видалення світлофорів, збереження кліків у Google Sheets).
- **DaisyUI & Tailwind CSS:** інтерфейс додатка повністю переписано з використанням сучасних компонентних підходів без написання "сирого" CSS.
- **Адаптивність:** завдяки утилітам Tailwind додаток коректно відображається на мобільних та десктопних пристроях.
- **Публікація:** додаток доступний онлайн 24/7 на платформі Netlify. Усі запити до Google Apps Script працюють коректно, проблеми з CORS налаштовані.

---

## Висновки

У ході виконання лабораторної роботи було успішно:

- набутo практичних навичок роботи з UI-бібліотекою DaisyUI та фреймворком Tailwind CSS;
- проведено рефакторинг візуальної частини проєкту зі збереженням бізнес-логіки (роботи з API);
- опановано процес розгортання (деплою) frontend-додатка на платформі Netlify;
- закріплено навички роботи з системою контролю версій Git та GitHub Classroom.

---

## Посилання

- **Опублікований додаток (Netlify):** [https://lab9webprogramming.netlify.app/](https://lab9webprogramming.netlify.app/)
- **Репозиторій GitHub:** [https://github.com/AndriyVlonha/LAB9](https://github.com/AndriyVlonha/LAB9)
- **Документація DaisyUI:** https://daisyui.com/
- **Документація Tailwind CSS:** https://tailwindcss.com/
