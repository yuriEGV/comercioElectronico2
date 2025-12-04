# 🏃 Ejecutar el Proyecto Localmente

## 📋 Prerrequisitos

1. Node.js instalado (versión 24.x según package.json)
2. MongoDB (local o MongoDB Atlas)
3. Variables de entorno configuradas

---

## 🔧 Configuración Inicial

### 1. Instalar dependencias

```bash
# En la raíz del proyecto
npm install
```

### 2. Crear archivo `.env`

Crea un archivo `.env` en la raíz del proyecto con las siguientes variables:

```env
# MongoDB Connection String
MONGO_URL=mongodb://localhost:27017/ecommerce
# O si usas MongoDB Atlas:
# MONGO_URL=mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority

# JWT Secret (usa un string aleatorio largo)
JWT_SECRET=tu_jwt_secret_super_seguro_minimo_32_caracteres_aqui

# Frontend URL (para desarrollo local)
FRONTEND_URL=http://localhost:3000

# Puerto del servidor (opcional, por defecto 5000)
PORT=5000

# Node Environment
NODE_ENV=development
```

### 3. Instalar dependencias del frontend

```bash
cd frontend
npm install
cd ..
```

---

## 🚀 Ejecutar el Backend

### Desarrollo (con nodemon - auto-reload)

```bash
npm run dev
```

### Producción

```bash
npm start
```

El servidor estará disponible en: `http://localhost:5000`

API disponible en: `http://localhost:5000/api/v1`

---

## ⚛️ Ejecutar el Frontend

En una terminal separada:

```bash
cd frontend
npm start
```

El frontend estará disponible en: `http://localhost:3000`

---

## 🧪 Probar el Backend

### Con Postman

1. Importa la colección `Ecommerce_API.postman_collection.json`
2. Crea un environment llamado "Local Development"
3. Agrega la variable `base_url` con valor: `http://localhost:5000`
4. Prueba los endpoints

### Con cURL

```bash
# Health check - Obtener productos
curl http://localhost:5000/api/v1/products

# Registrar usuario
curl -X POST http://localhost:5000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123"}'
```

---

## 🔍 Verificar que todo funciona

1. **Backend:**
   - Abre `http://localhost:5000/api/v1/products`
   - Debe retornar un JSON (puede estar vacío si no hay productos)

2. **Frontend:**
   - Abre `http://localhost:3000`
   - Debe cargar sin errores en la consola
   - Debe poder hacer login/register

---

## ⚠️ Solución de Problemas

### Error: "Cannot find module"
```bash
# Reinstalar dependencias
rm -rf node_modules package-lock.json
npm install
```

### Error: "MONGO_URL no está definida"
- Verifica que el archivo `.env` existe en la raíz del proyecto
- Verifica que `MONGO_URL` esté correctamente escrita en el `.env`

### Error: "Port 5000 already in use"
- Cambia el puerto en el archivo `.env`: `PORT=5001`
- O cierra el proceso que está usando el puerto 5000

### Error: "MongoDB connection failed"
- Verifica que MongoDB esté ejecutándose (si es local)
- Verifica que la connection string sea correcta
- Si usas MongoDB Atlas, verifica que tu IP esté en la whitelist

### El servidor no inicia
- Verifica que todas las dependencias estén instaladas: `npm install`
- Verifica que Node.js sea la versión correcta: `node --version` (debe ser 24.x)
- Revisa los logs de error en la consola

---

## 📝 Notas

- El archivo `server.js` es para desarrollo local
- El archivo `app.js` se usa en Vercel (exporta la app sin iniciar servidor)
- En desarrollo, `server.js` maneja la conexión a MongoDB
- En Vercel, `app.js` maneja la conexión de forma serverless

---

## 🎯 Comandos Rápidos

```bash
# Backend
npm run dev          # Desarrollo con auto-reload
npm start           # Producción

# Frontend
cd frontend
npm start           # Desarrollo

# Ambos a la vez (en terminales separadas)
# Terminal 1:
npm run dev

# Terminal 2:
cd frontend && npm start
```

