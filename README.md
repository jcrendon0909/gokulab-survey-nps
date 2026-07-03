# gokulab-survey-nps
Encuesta de satisfacción y NPS para GokuLab
# 📊 GokuLab - Encuesta de Satisfacción y NPS

Sistema de encuestas para medir la satisfacción de los alumnos y el NPS (Net Promoter Score) de GokuLab. Desarrollado con React, Node.js y MongoDB.

## 🚀 Tecnologías

### Frontend
- React 18 + Vite
- TypeScript
- React Router v6
- Framer Motion (Animaciones)
- Chart.js (Gráficos)

### Backend
- Node.js + Express
- MongoDB + Mongoose
- CORS
- Dotenv

### Despliegue
- Frontend: Cloudflare Pages
- Backend: Render
- Base de datos: MongoDB Atlas

## 📦 Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/jcrendon0909/gokulab-survey-nps.git
cd gokulab-survey-nps

2. **Backend**
cd backend
npm install
# Crear archivo .env con las variables (ver .env.example)
node src/index.js

2. **Frontend**
cd frontend
npm install
npm run dev

Acceder

Frontend: http://localhost:5173

Backend API: http://localhost:5001/api

🌐 Variables de Entorno
Backend (.env en /backend)
PORT=5001
MONGODB_URI=<tu_uri_de_mongodb_atlas>
Frontend (.env en /frontend)
text
VITE_API_URL=http://localhost:5001
📊 Endpoints de la API
POST /api/survey - Guardar una encuesta

GET /api/survey/stats - Obtener estadísticas completas (NPS, promedios, distribuciones)

🤝 Contribución
Haz un Fork del proyecto.

Crea tu rama de características (git checkout -b feature/AmazingFeature).

Realiza tus cambios y haz commit (git commit -m 'Add some AmazingFeature').

Sube tu rama (git push origin feature/AmazingFeature).

Abre un Pull Request.

📄 Licencia
Distribuido bajo la licencia MIT. Consulta LICENSE para más información.

✉️ Contacto
Juan Carlos Rendon - @jcrendon0909


### 3. Flujo de trabajo con Git

Después de hacer estos cambios:
1. Abre GitHub Desktop.
2. Verás los archivos modificados y los nuevos.
3. Escribe un mensaje de commit claro, por ejemplo:
4. Haz clic en "Commit to main".
5. Luego en "Push origin" para subir los cambios a GitHub.

### 4. Despliegue en Render (Backend)

1. Entra a [Render](https://render.com) y haz clic en "New +" → "Web Service".
2. Conecta tu repositorio de GitHub (`jcrendon0909/gokulab-survey-nps`).
3. Configura:
- **Name**: `gokulab-survey-api`
- **Root Directory**: `backend/`
- **Build Command**: `npm install`
- **Start Command**: `node src/index.js`
- **Environment Variables**: Agrega `MONGODB_URI` con tu URI de MongoDB Atlas.
4. Haz clic en "Create Web Service".
5. Espera a que se despliegue y obtén la URL (ej. `https://gokulab-survey-api.onrender.com`).
6. Prueba el endpoint: `https://gokulab-survey-api.onrender.com/api/survey/stats`

### 5. Despliegue en Cloudflare Pages (Frontend)

1. Entra a [Cloudflare Pages](https://pages.cloudflare.com) y haz clic en "Create a project".
2. Conecta tu repositorio de GitHub.
3. Configura:
- **Project name**: `gokulab-survey`
- **Root Directory**: `frontend/`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Agrega `VITE_API_URL` con la URL de Render (ej. `https://gokulab-survey-api.onrender.com`).
4. Haz clic en "Save and Deploy".
5. Espera a que se despliegue y obtén la URL (ej. `https://gokulab-survey.pages.dev`).

### 6. Verificación final

- Abre la URL del frontend.
- Rellena y envía una encuesta.
- Verifica en MongoDB Atlas que se haya guardado.
- Accede a `/dashboard` para ver las estadísticas.

---

## 📌 Resumen en una tabla

| Paso | Acción | Herramienta |
|------|--------|-------------|
| 1 | Limpiar archivos innecesarios | GitHub Desktop |
| 2 | Documentar con README y ejemplos de .env | VSC |
| 3 | Subir cambios a GitHub | GitHub Desktop |
| 4 | Desplegar backend | Render |
| 5 | Desplegar frontend | Cloudflare Pages |
| 6 | Probar en producción | Navegador |
