# 💕 Love Letter App

Aplicación romántica para guardar fotos, videos, audios y cartas de amor. Sin base de datos: todo se guarda en carpetas.

## Stack

- **Backend:** Node.js + Express  
- **Subida de archivos:** Multer  
- **Frontend:** HTML, CSS, JavaScript (sin frameworks)  
- **Despliegue:** Compatible con Render  

## Estructura

```
love-letter-app/
├── server.js           # Servidor Express + Multer
├── package.json
├── uploads/
│   ├── fotos/
│   ├── videos/
│   └── audios/
├── public/
│   ├── index.html
│   ├── styles.css
│   └── script.js
└── README.md
```

## Cómo ejecutarlo en local

1. **Clona o descarga** el proyecto y entra en la carpeta:
   ```bash
   cd love-letter-app
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Arranca el servidor:**
   ```bash
   npm start
   ```

4. Abre el navegador en: **http://localhost:3000**  
   (Si usas otro puerto en tu sistema, el mensaje en consola indicará la URL.)

## Cómo desplegarlo en Render

### Paso 1: Subir el código

- Crea un repositorio en **GitHub** (o GitLab/Bitbucket) y sube este proyecto.
- Si no usas Git aún:
  ```bash
  git init
  git add .
  git commit -m "Initial commit - Love Letter App"
  git branch -M main
  git remote add origin https://github.com/TU_USUARIO/TU_REPO.git
  git push -u origin main
  ```

### Paso 2: Crear el servicio en Render

1. Entra en [render.com](https://render.com) e inicia sesión.
2. **New +** → **Web Service**.
3. Conecta tu repositorio (GitHub/GitLab) y selecciona el repo de **love-letter-app**.
4. Configura el servicio:
   - **Name:** `love-letter-app` (o el que quieras).
   - **Region:** la más cercana a ti.
   - **Branch:** `main` (o la rama que uses).
   - **Runtime:** **Node**.
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Instance type:** Free (o el plan que prefieras).

5. En **Advanced** (opcional):
   - **Environment:** Render asigna `PORT` automáticamente; no hace falta que lo pongas tú.

6. Pulsa **Create Web Service**.

### Paso 3: Comprobar el despliegue

- Render construirá la app y la desplegará.
- Al terminar te dará una URL tipo: `https://love-letter-app-xxxx.onrender.com`.
- Abre esa URL: deberías ver la app (hero, fotos, videos, audios, cartas).

### Nota importante sobre Render (plan gratuito)

- Los archivos subidos se guardan en el disco del contenedor. En el **plan gratuito**, el contenedor se reinicia tras un tiempo de inactividad y **se pierden los archivos** de `uploads/`.  
- Para conservar archivos de forma persistente necesitarías un disco persistente de pago o un almacenamiento externo (por ejemplo S3). Este proyecto está pensado para uso local o como base para añadir ese almacenamiento después.

## API (referencia)

| Método | Ruta            | Descripción              |
|--------|-----------------|--------------------------|
| POST   | `/upload/photo` | Subir una imagen         |
| POST   | `/upload/video` | Subir un video           |
| POST   | `/upload/audio` | Subir un audio           |
| GET    | `/photos`       | Lista de fotos (JSON)    |
| GET    | `/videos`       | Lista de videos (JSON)   |
| GET    | `/audios`       | Lista de audios (JSON)   |

Los archivos se sirven en `/uploads/fotos/`, `/uploads/videos/`, `/uploads/audios/`.

## Licencia

MIT.
