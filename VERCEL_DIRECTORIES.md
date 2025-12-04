# 📁 Directorios Raíz para Despliegue en Vercel

## 🎯 Resumen de Directorios

Tu proyecto tiene esta estructura:
```
ecommerce/                    ← Raíz del repositorio
├── app.js                    ← Backend entry point
├── package.json              ← Backend dependencies
├── vercel.json              ← Backend Vercel config
├── controllers/
├── routes/
├── models/
└── frontend/                 ← Carpeta del frontend
    ├── package.json         ← Frontend dependencies
    ├── vercel.json          ← Frontend Vercel config
    ├── src/
    └── public/
```

---

## 🔧 Backend - Directorio Raíz

**Raíz del Directorio:** `./` (raíz del proyecto)

**Ubicación completa:**
```
C:\Users\maritimo13\Desktop\ecommerce\
```

**Archivos clave en esta raíz:**
- ✅ `app.js` (entry point del backend)
- ✅ `package.json` (dependencias del backend)
- ✅ `vercel.json` (configuración de Vercel para backend)
- ✅ `routes/`, `controllers/`, `models/`, etc.

**Configuración en Vercel Dashboard:**
- **Root Directory:** `./` o dejar vacío (por defecto usa la raíz)
- **Framework Preset:** Other
- **Build Command:** (vacío)
- **Output Directory:** (vacío)

---

## ⚛️ Frontend - Directorio Raíz

**Raíz del Directorio:** `frontend/`

**Ubicación completa:**
```
C:\Users\maritimo13\Desktop\ecommerce\frontend\
```

**Archivos clave en esta raíz:**
- ✅ `package.json` (dependencias del frontend)
- ✅ `vercel.json` (configuración de Vercel para frontend)
- ✅ `src/` (código fuente React)
- ✅ `public/` (archivos estáticos)

**Configuración en Vercel Dashboard:**
- **Root Directory:** `frontend`
- **Framework Preset:** Create React App
- **Build Command:** `npm run build`
- **Output Directory:** `build`

---

## 🚀 Despliegue desde CLI

### Backend
```bash
# Desde la raíz del proyecto
cd C:\Users\maritimo13\Desktop\ecommerce
vercel
```

### Frontend
```bash
# Opción 1: Desde la carpeta frontend
cd C:\Users\maritimo13\Desktop\ecommerce\frontend
vercel

# Opción 2: Desde la raíz, especificando el directorio
cd C:\Users\maritimo13\Desktop\ecommerce
vercel --cwd frontend
```

---

## 📋 Verificación Rápida

### ✅ Backend está correcto si:
- El `vercel.json` está en la misma carpeta que `app.js`
- El `package.json` tiene `"main": "app.js"` o `"type": "module"`
- Puedes ejecutar `node app.js` desde esa carpeta

### ✅ Frontend está correcto si:
- El `vercel.json` está en la carpeta `frontend/`
- El `package.json` del frontend tiene el script `"build": "react-scripts build"`
- Puedes ejecutar `npm run build` desde la carpeta `frontend/`

---

## ⚠️ Errores Comunes

### ❌ Error: "Cannot find module 'app.js'"
- **Causa:** Estás desplegando desde la carpeta `frontend/` en lugar de la raíz
- **Solución:** Verifica que el Root Directory sea `./` para el backend

### ❌ Error: "Cannot find module 'react-scripts'"
- **Causa:** Estás desplegando desde la raíz en lugar de `frontend/`
- **Solución:** Verifica que el Root Directory sea `frontend` para el frontend

### ❌ Error: "Build failed"
- **Causa:** Root Directory incorrecto
- **Solución:** Revisa que estés usando el directorio correcto según la sección arriba

---

## 🎯 Resumen Visual

```
Proyecto en Vercel (2 proyectos separados):

1️⃣ Proyecto Backend:
   📂 Root: ecommerce/ (raíz)
   📄 Entry: app.js
   ⚙️ Config: vercel.json (raíz)

2️⃣ Proyecto Frontend:
   📂 Root: ecommerce/frontend/
   📄 Entry: src/index.js
   ⚙️ Config: vercel.json (en frontend/)
```

---

## 💡 Tip

Si tienes dudas sobre qué directorio usar, verifica:
1. ¿Dónde está el `package.json` que quieres usar?
2. ¿Dónde está el `vercel.json` correspondiente?
3. Esa es tu raíz del directorio para ese proyecto en Vercel.

