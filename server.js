/**
 * love-letter-app - Servidor Express
 * Puerto dinámico para Render (process.env.PORT)
 * Sin base de datos: archivos en carpetas físicas
 */

const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Crear carpetas de uploads si no existen
const uploadDirs = [
  path.join(__dirname, 'uploads', 'fotos'),
  path.join(__dirname, 'uploads', 'videos'),
  path.join(__dirname, 'uploads', 'audios')
];
uploadDirs.forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Configuración Multer: fotos
const photoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads', 'fotos')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.jpg';
    cb(null, unique + ext);
  }
});
const uploadPhoto = multer({ storage: photoStorage });

// Configuración Multer: videos
const videoStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads', 'videos')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.mp4';
    cb(null, unique + ext);
  }
});
const uploadVideo = multer({ storage: videoStorage });

// Configuración Multer: audios
const audioStorage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, 'uploads', 'audios')),
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname) || '.mp3';
    cb(null, unique + ext);
  }
});
const uploadAudio = multer({ storage: audioStorage });

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// --- Rutas POST: subida de archivos ---

app.post('/upload/photo', uploadPhoto.single('photo'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se envió ninguna foto' });
  res.json({ success: true, filename: req.file.filename });
});

app.post('/upload/video', uploadVideo.single('video'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se envió ningún video' });
  res.json({ success: true, filename: req.file.filename });
});

app.post('/upload/audio', uploadAudio.single('audio'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No se envió ningún audio' });
  res.json({ success: true, filename: req.file.filename });
});

// --- Rutas GET: listar archivos ---

function listFiles(dirPath, baseUrl) {
  try {
    if (!fs.existsSync(dirPath)) return [];
    const files = fs.readdirSync(dirPath);
    return files
      .filter(f => fs.statSync(path.join(dirPath, f)).isFile())
      .map(f => ({ name: f, url: `${baseUrl}/${f}` }));
  } catch (err) {
    return [];
  }
}

app.get('/photos', (req, res) => {
  const dir = path.join(__dirname, 'uploads', 'fotos');
  res.json(listFiles(dir, '/uploads/fotos'));
});

app.get('/videos', (req, res) => {
  const dir = path.join(__dirname, 'uploads', 'videos');
  res.json(listFiles(dir, '/uploads/videos'));
});

app.get('/audios', (req, res) => {
  const dir = path.join(__dirname, 'uploads', 'audios');
  res.json(listFiles(dir, '/uploads/audios'));
});

// SPA: cualquier ruta no API sirve el index
app.get('*', (req, res) => {
  if (req.path.startsWith('/uploads') || req.path.startsWith('/api')) return res.status(404).end();
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`💕 Love Letter App escuchando en http://localhost:${PORT}`);
});
