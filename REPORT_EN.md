# Lab Work Report №9

**Student:** Andriy Vlonha  
**Group:** 42-KN  
**Date:** 29/03/2026

---

## Objective

To migrate the project logic from the previous lab work (interaction with Google Apps Script API), integrate the DaisyUI component library for UI styling, and deploy the finished web application to the Netlify platform.

---

## Progress of Work

### 1. Project Migration Based on Lab 8

The work began by creating a new directory and copying the source code from the previous lab, which included a configured React application and connection to the Google Sheets API.

```bash
# Copy lab8 as a base
xcopy /E /I LAB8\lab8 LAB9\lab9
cd LAB9\lab9
git init
```

### 2. Installing Tailwind CSS and DaisyUI

Tailwind CSS framework and DaisyUI component plugin were selected for styling. Installation was performed using npm.

```bash
# Install Tailwind CSS and dependencies
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# Install DaisyUI
npm i -D daisyui@latest
```

### 3. Styling Configuration

The `tailwind.config.js` file was updated to support React files and include the DaisyUI plugin.

**File:** `tailwind.config.js`

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
  daisyui: {
    themes: ["light", "dark", "cupcake"],
  },
}
```

The main stylesheet `index.css` was cleared of old CSS and updated with Tailwind directives:

**File:** `index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### 4. Styling with DaisyUI

Old CSS classes were replaced with Tailwind utilities and DaisyUI components.

Examples:

- **Buttons:** `btn`, `btn-primary`, `btn-outline`
- **Cards:** `card`, `bg-base-100`, `shadow-xl`
- **Layout:** `container`, `mx-auto`, `grid`, `flex`, `gap-4`

Example component:

```javascript
<div className="card w-96 bg-base-100 shadow-xl">
  <div className="card-body items-center text-center">
    <h2 className="card-title">{light.name}</h2>
    <div className="flex gap-2">
      <button className="btn btn-error" onClick={() => clickColor(light.id, 'red')}>Red</button>
      <button className="btn btn-warning" onClick={() => clickColor(light.id, 'yellow')}>Yellow</button>
      <button className="btn btn-success" onClick={() => clickColor(light.id, 'green')}>Green</button>
    </div>
  </div>
</div>
```

### 5. Deployment to Netlify

The application was deployed using Netlify.

Steps:

1. Build the project:

```bash
npm run build
```

2. Upload the `dist` (or `build`) folder to Netlify (via drag-and-drop or GitHub integration).

3. Configure redirects for React Router (if needed).

4. Obtain a public URL for the deployed application.

### 6. Uploading Code to GitHub Classroom

After successful testing, all changes were committed and pushed to GitHub Classroom.

```bash
git add .
git commit -m "feat: added daisyui, styled components and prepared for netlify deploy"
git push origin main
```

---

## Results

Implemented features and improvements:

- **Logic Migration:** full preservation of API functionality (reading, adding, deleting traffic lights, saving clicks to Google Sheets).
- **DaisyUI & Tailwind CSS:** UI fully rewritten using modern component-based approach without raw CSS.
- **Responsiveness:** application works correctly on mobile and desktop devices.
- **Deployment:** application is available online 24/7 via Netlify, all API requests work correctly, CORS issues resolved.

---

## Conclusions

During the lab work, the following was achieved:

- gained practical experience with DaisyUI and Tailwind CSS;
- refactored the UI while preserving business logic;
- learned the process of deploying frontend applications to Netlify;
- reinforced skills in Git and GitHub Classroom.

---

## Links

- **Deployed App (Netlify):** [https://lab9webprogramming.netlify.app/](https://lab9webprogramming.netlify.app/)
- **GitHub Repository:** [https://github.com/AndriyVlonha/LAB9](https://github.com/AndriyVlonha/LAB9)
- **DaisyUI Docs:** https://daisyui.com/
- **Tailwind CSS Docs:** https://tailwindcss.com/
