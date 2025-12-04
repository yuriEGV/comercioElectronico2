# 🚀 Guía de Despliegue en Vercel - Ecommerce Backend y Frontend

Esta guía te ayudará a desplegar tu proyecto ecommerce en Vercel, separando el backend y frontend.

## 📋 Prerrequisitos

1. Cuenta en [Vercel](https://vercel.com)
2. Cuenta en [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (o base de datos MongoDB)
3. Git configurado en tu máquina
4. Node.js instalado (versión 24.x según tu package.json)

---

## 🔧 Paso 1: Preparar el Backend

### 1.1 Verificar archivos necesarios

Asegúrate de tener:
- ✅ `vercel.json` (ya creado)
- ✅ `package.json` con `"type": "module"`
- ✅ `app.js` exportando por defecto (ya está configurado)

### 1.2 Variables de Entorno

Crea un archivo `.env` local con estas variables (NO lo subas a Git):

```env
MONGO_URL=tu_connection_string_de_mongodb
JWT_SECRET=tu_jwt_secret_super_seguro
FRONTEND_URL=https://tu-frontend.vercel.app
NODE_ENV=production
```

### 1.3 Crear archivo `.gitignore` (si no existe)

```gitignore
node_modules/
.env
.vercel
*.log
.DS_Store
```

---

## 🌐 Paso 2: Desplegar Backend en Vercel

### Opción A: Desde la CLI de Vercel (Recomendado)

1. **Instalar Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Iniciar sesión:**
   ```bash
   vercel login
   ```

3. **Navegar a la raíz del proyecto:**
   ```bash
   cd C:\Users\maritimo13\Desktop\ecommerce
   ```

4. **Desplegar:**
   ```bash
   vercel
   ```
   - Sigue las instrucciones:
     - ¿Set up and deploy? → **Y**
     - ¿Which scope? → Selecciona tu cuenta
     - ¿Link to existing project? → **N** (primera vez)
     - ¿What's your project's name? → `ecommerce-backend` (o el nombre que prefieras)
     - ¿In which directory is your code located? → **./** (raíz)
     - ¿Override settings? → **N**

5. **Agregar variables de entorno:**
   ```bash
   vercel env add MONGO_URL
   vercel env add JWT_SECRET
   vercel env add FRONTEND_URL
   ```
   - Ingresa los valores cuando se te solicite

6. **Desplegar a producción:**
   ```bash
   vercel --prod
   ```

### Opción B: Desde el Dashboard de Vercel

1. **Ir a [vercel.com](https://vercel.com) y hacer login**

2. **Click en "Add New Project"**

3. **Importar desde Git:**
   - Conecta tu repositorio de GitHub/GitLab/Bitbucket
   - O arrastra la carpeta del proyecto

4. **Configurar el proyecto:**
   - **Framework Preset:** Other
   - **Root Directory:** `./` (raíz del proyecto - donde está app.js)
   - **Build Command:** (dejar vacío)
   - **Output Directory:** (dejar vacío)
   - **Install Command:** `npm install`
   
   ⚠️ **IMPORTANTE:** La raíz del directorio para el backend es la carpeta principal donde está `app.js`, `package.json` y `vercel.json` (la raíz del proyecto, NO la carpeta frontend)

5. **Agregar Variables de Entorno:**
   - Click en "Environment Variables"
   - Agregar:
     - `MONGO_URL` → Tu connection string de MongoDB
     - `JWT_SECRET` → Un string aleatorio seguro
     - `FRONTEND_URL` → URL de tu frontend (la agregarás después)
     - `NODE_ENV` → `production`

6. **Click en "Deploy"**

7. **Copiar la URL del backend** (ejemplo: `https://ecommerce-backend.vercel.app`)

---

## ⚛️ Paso 3: Preparar el Frontend

### 3.1 Configurar variables de entorno del frontend

1. **Navegar a la carpeta frontend:**
   ```bash
   cd frontend
   ```

2. **Crear archivo `.env` en la carpeta frontend:**
   ```env
   REACT_APP_API_URL=https://tu-backend.vercel.app/api/v1
   ```

3. **Verificar que `frontend/src/api.js` use la variable de entorno** (ya está configurado)

### 3.2 Crear `vercel.json` para el frontend

Crea un archivo `vercel.json` en la carpeta `frontend/`:

```json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/static-build",
      "config": {
        "distDir": "build"
      }
    }
  ],
  "routes": [
    {
      "src": "/static/(.*)",
      "headers": {
        "cache-control": "public, max-age=31536000, immutable"
      }
    },
    {
      "src": "/(.*)",
      "dest": "/index.html"
    }
  ]
}
```

### 3.3 Actualizar `package.json` del frontend

Agrega el script de build si no existe:

```json
{
  "scripts": {
    "build": "react-scripts build",
    "vercel-build": "react-scripts build"
  }
}
```

---

## 🎨 Paso 4: Desplegar Frontend en Vercel

### Opción A: Desde la CLI

1. **Navegar a la carpeta frontend:**
   ```bash
   cd frontend
   ```

2. **Desplegar:**
   ```bash
   vercel
   ```
   - Sigue las instrucciones similares al backend

3. **Agregar variable de entorno:**
   ```bash
   vercel env add REACT_APP_API_URL
   ```
   - Ingresa: `https://tu-backend.vercel.app/api/v1`

4. **Desplegar a producción:**
   ```bash
   vercel --prod
   ```

### Opción B: Desde el Dashboard

1. **Crear nuevo proyecto en Vercel**

2. **Importar el repositorio** (o subir la carpeta `frontend/`)

3. **Configurar:**
   - **Framework Preset:** Create React App
   - **Root Directory:** `frontend` (carpeta frontend dentro del proyecto)
   - **Build Command:** `npm run build`
   - **Output Directory:** `build`
   
   ⚠️ **IMPORTANTE:** La raíz del directorio para el frontend es la carpeta `frontend/` dentro del proyecto (donde está el `package.json` del frontend y `vercel.json` del frontend)

4. **Agregar Variable de Entorno:**
   - `REACT_APP_API_URL` → `https://tu-backend.vercel.app/api/v1`

5. **Click en "Deploy"**

6. **Copiar la URL del frontend** (ejemplo: `https://ecommerce-frontend.vercel.app`)

---

## 🔄 Paso 5: Actualizar URLs

### 5.1 Actualizar FRONTEND_URL en el backend

1. **Ir al dashboard de Vercel del backend**

2. **Settings → Environment Variables**

3. **Actualizar `FRONTEND_URL`** con la URL de tu frontend:
   ```
   https://ecommerce-frontend.vercel.app
   ```

4. **Redeploy el backend** (Vercel lo hace automáticamente o puedes hacerlo manualmente)

### 5.2 Verificar CORS

El backend ya está configurado para aceptar requests del frontend gracias a:
```javascript
cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
})
```

---

## 🧪 Paso 6: Probar con Postman

### 6.1 Importar la colección

1. **Abrir Postman**

2. **File → Import**

3. **Seleccionar el archivo:** `Ecommerce_API.postman_collection.json`

4. **Configurar variable de entorno:**
   - Click en el ícono de "Environments" (ojo)
   - Crear nuevo environment: "Vercel Production"
   - Agregar variable:
     - `base_url` → `https://tu-backend.vercel.app`
   - Seleccionar este environment

### 6.2 Flujo de prueba recomendado

1. **Register** → Crea un usuario (el primero será admin)
2. **Login** → Inicia sesión (guarda las cookies automáticamente)
3. **Create Product** → Crea un producto (necesitas el USER_ID del paso 1)
4. **Get All Products** → Verifica que se creó
5. **Create Order** → Crea una orden con el producto
6. **Get Current User Orders** → Verifica tu orden
7. **Create Review** → Crea una review del producto

### 6.3 Notas importantes

- **Cookies:** Postman guarda las cookies automáticamente después de login
- **IDs:** Reemplaza `PRODUCT_ID_AQUI`, `USER_ID_AQUI`, etc. con IDs reales de las respuestas
- **Autenticación:** Algunos endpoints requieren estar autenticado (cookies)
- **Admin:** Solo el primer usuario registrado es admin

---

## 📝 Paso 7: Verificar que todo funciona

### Backend
- ✅ URL: `https://tu-backend.vercel.app`
- ✅ Health check: `https://tu-backend.vercel.app/api/v1/products` (debe retornar productos o array vacío)

### Frontend
- ✅ URL: `https://tu-frontend.vercel.app`
- ✅ Debe cargar sin errores en la consola
- ✅ Debe poder hacer login/register
- ✅ Debe poder ver productos

---

## 🔍 Troubleshooting

### Error: "MongoDB connection failed"
- Verifica que `MONGO_URL` esté correctamente configurada en Vercel
- Asegúrate de que tu IP esté en la whitelist de MongoDB Atlas (o usa `0.0.0.0/0` para desarrollo)

### Error: "CORS policy"
- Verifica que `FRONTEND_URL` en el backend coincida exactamente con la URL del frontend
- Incluye el protocolo `https://`

### Error: "Module not found"
- Verifica que `package.json` tenga todas las dependencias
- Asegúrate de que `"type": "module"` esté en el package.json del backend

### Frontend no carga
- Verifica que `REACT_APP_API_URL` esté configurada correctamente
- Revisa la consola del navegador para errores
- Verifica que el build se haya completado correctamente

### Cookies no funcionan
- Vercel usa HTTPS, asegúrate de que las cookies estén configuradas para HTTPS
- Verifica que `credentials: 'include'` esté en las peticiones del frontend

---

## 🎉 ¡Listo!

Tu ecommerce debería estar funcionando en producción. Puedes:
- Acceder al frontend desde la URL de Vercel
- Probar todos los endpoints con Postman
- Compartir las URLs con otros usuarios

---

## 📚 Recursos adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Postman Documentation](https://learning.postman.com/docs/)

---

## 🔐 Seguridad en Producción

⚠️ **Importante:**
- Nunca subas archivos `.env` a Git
- Usa variables de entorno en Vercel
- Usa JWT secrets fuertes
- Configura rate limiting (ya está configurado)
- Mantén las dependencias actualizadas

