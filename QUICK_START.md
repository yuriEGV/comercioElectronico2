# ⚡ Inicio Rápido - Despliegue en Vercel

## 🎯 Resumen de Pasos

### 1️⃣ Backend
```bash
# En la raíz del proyecto
vercel login
vercel
# Agregar variables de entorno:
vercel env add MONGO_URL
vercel env add JWT_SECRET
vercel env add FRONTEND_URL
vercel --prod
```

### 2️⃣ Frontend
```bash
# En la carpeta frontend
cd frontend
vercel
# Agregar variable de entorno:
vercel env add REACT_APP_API_URL
# Valor: https://tu-backend.vercel.app/api/v1
vercel --prod
```

### 3️⃣ Actualizar URLs
- Actualizar `FRONTEND_URL` en el backend con la URL del frontend
- Vercel redeploy automáticamente

### 4️⃣ Probar con Postman
1. Importar `Ecommerce_API.postman_collection.json`
2. Crear environment con `base_url` = URL de tu backend
3. Probar endpoints

## 📋 Variables de Entorno Necesarias

### Backend (Vercel)
- `MONGO_URL` - Connection string de MongoDB
- `JWT_SECRET` - String aleatorio seguro
- `FRONTEND_URL` - URL del frontend (https://...)
- `NODE_ENV` - `production`

### Frontend (Vercel)
- `REACT_APP_API_URL` - URL del backend + `/api/v1`

## 🔗 URLs después del despliegue

- Backend: `https://tu-backend.vercel.app`
- Frontend: `https://tu-frontend.vercel.app`

## 📖 Documentación Completa

Ver `DEPLOY_VERCEL.md` para instrucciones detalladas.

