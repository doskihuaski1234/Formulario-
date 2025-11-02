
# Formulario React + TypeScript + Node (Excel)

Este proyecto crea un formulario en **React + TypeScript** y un backend en **Node.js (Express)** que guarda cada envío como **nueva fila** en un archivo **Excel (.xlsx)**.

## Estructura
```
react-ts-node-excel-form/
  ├─ backend/
  │   ├─ index.js
  │   ├─ package.json
  │   └─ data/  (aquí se genera submissions.xlsx)
  └─ frontend/
      ├─ index.html
      ├─ package.json
      ├─ tsconfig.json
      ├─ vite.config.ts
      └─ src/
          ├─ main.tsx
          ├─ App.tsx
          └─ styles.css
```

## Cómo correr
### 1) Backend
```bash
cd backend
npm install
npm run dev   # o npm start
# Servirá en http://localhost:4000
```

### 2) Frontend
En otra terminal:
```bash
cd frontend
npm install
npm run dev
# Abrir http://localhost:5173
```

> El botón **"Save Changes"** envía los datos a `POST http://localhost:4000/api/submit`.  
> El backend guarda/crea `backend/data/submissions.xlsx` y **agrega una fila por cada registro**.  
> Puedes descargar el Excel en `http://localhost:4000/api/export` (botón "Descargar Excel").

## Notas
- Cambia los valores por defecto del formulario en `App.tsx` (const `initialData`).
- Si deseas desplegar el backend, asegúrate de configurar CORS o un proxy.
- Puedes agregar validaciones adicionales según tu rúbrica.
