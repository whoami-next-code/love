/**
 * Love Letter App — Frontend
 * Fetch para subir y listar archivos. Renderizado dinámico y animaciones.
 */

(function () {
  'use strict';

  const API = {
    uploadPhoto: '/upload/photo',
    uploadVideo: '/upload/video',
    uploadAudio: '/upload/audio',
    photos: '/photos',
    videos: '/videos',
    audios: '/audios'
  };

  // --- Referencias DOM ---
  const formPhoto = document.getElementById('formPhoto');
  const formVideo = document.getElementById('formVideo');
  const formAudio = document.getElementById('formAudio');
  const gallery = document.getElementById('gallery');
  const videoGrid = document.getElementById('videoGrid');
  const audioList = document.getElementById('audioList');
  const letter = document.getElementById('letter');

  // --- Utilidades ---
  function showMessage(container, text, type) {
    const existing = container.querySelector('.message');
    if (existing) existing.remove();
    const msg = document.createElement('div');
    msg.className = `message ${type}`;
    msg.textContent = text;
    container.insertBefore(msg, container.firstChild);
    setTimeout(() => msg.remove(), 4000);
  }

  function showError(container, text) {
    showMessage(container, text, 'error');
  }

  function showSuccess(container, text) {
    showMessage(container, text, 'success');
  }

  // --- Cargar y renderizar fotos ---
  async function loadPhotos() {
    try {
      const res = await fetch(API.photos);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar fotos');
      renderPhotos(Array.isArray(data) ? data : []);
    } catch (err) {
      renderPhotos([]);
      console.warn('loadPhotos:', err.message);
    }
  }

  function renderPhotos(list) {
    gallery.innerHTML = '';
    if (list.length === 0) {
      gallery.innerHTML = '<p class="empty-state">Aún no hay fotos. Sube la primera.</p>';
      return;
    }
    list.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'gallery-item';
      div.style.animationDelay = `${i * 0.05}s`;
      const img = document.createElement('img');
      img.src = item.url;
      img.alt = item.name;
      img.loading = 'lazy';
      img.onerror = () => { div.style.display = 'none'; };
      div.appendChild(img);
      gallery.appendChild(div);
    });
  }

  // --- Cargar y renderizar videos ---
  async function loadVideos() {
    try {
      const res = await fetch(API.videos);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar videos');
      renderVideos(Array.isArray(data) ? data : []);
    } catch (err) {
      renderVideos([]);
      console.warn('loadVideos:', err.message);
    }
  }

  function renderVideos(list) {
    videoGrid.innerHTML = '';
    if (list.length === 0) {
      videoGrid.innerHTML = '<p class="empty-state">Aún no hay videos. Sube el primero.</p>';
      return;
    }
    list.forEach((item, i) => {
      const card = document.createElement('div');
      card.className = 'video-card';
      card.style.animationDelay = `${i * 0.05}s`;
      const video = document.createElement('video');
      video.controls = true;
      video.preload = 'metadata';
      video.src = item.url;
      const label = document.createElement('div');
      label.className = 'video-label';
      label.textContent = item.name;
      card.appendChild(video);
      card.appendChild(label);
      videoGrid.appendChild(card);
    });
  }

  // --- Cargar y renderizar audios ---
  async function loadAudios() {
    try {
      const res = await fetch(API.audios);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Error al cargar audios');
      renderAudios(Array.isArray(data) ? data : []);
    } catch (err) {
      renderAudios([]);
      console.warn('loadAudios:', err.message);
    }
  }

  function renderAudios(list) {
    audioList.innerHTML = '';
    if (list.length === 0) {
      audioList.innerHTML = '<p class="empty-state">Aún no hay audios. Sube el primero.</p>';
      return;
    }
    list.forEach((item, i) => {
      const wrap = document.createElement('div');
      wrap.className = 'audio-item';
      wrap.style.animationDelay = `${i * 0.05}s`;
      const label = document.createElement('span');
      label.className = 'audio-label';
      label.textContent = item.name;
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = item.url;
      wrap.appendChild(label);
      wrap.appendChild(audio);
      audioList.appendChild(wrap);
    });
  }

  // --- Subida de archivos ---
  async function uploadFile(form, endpoint, listKey, loadFn, sectionEl) {
    const input = form.querySelector('input[type="file"]');
    const btn = form.querySelector('button[type="submit"]');
    if (!input.files.length) {
      showError(sectionEl, 'Elige un archivo antes de subir.');
      return;
    }
    const fd = new FormData(form);
    btn.disabled = true;
    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        body: fd
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error || 'Error al subir');
      showSuccess(sectionEl, '¡Subido correctamente!');
      input.value = '';
      loadFn();
    } catch (err) {
      showError(sectionEl, err.message || 'Error al subir. Intenta de nuevo.');
    } finally {
      btn.disabled = false;
    }
  }

  // --- Carta: abrir/cerrar al clic ---
  if (letter) {
    letter.addEventListener('click', function () {
      this.classList.toggle('open');
    });
  }

  // --- Formularios ---
  if (formPhoto) {
    formPhoto.addEventListener('submit', function (e) {
      e.preventDefault();
      uploadFile(formPhoto, API.uploadPhoto, 'photo', loadPhotos, document.getElementById('fotos'));
    });
  }

  if (formVideo) {
    formVideo.addEventListener('submit', function (e) {
      e.preventDefault();
      uploadFile(formVideo, API.uploadVideo, 'video', loadVideos, document.getElementById('videos'));
    });
  }

  if (formAudio) {
    formAudio.addEventListener('submit', function (e) {
      e.preventDefault();
      uploadFile(formAudio, API.uploadAudio, 'audio', loadAudios, document.getElementById('audios'));
    });
  }

  // --- Carga inicial y observador para animaciones al scroll ---
  function init() {
    loadPhotos();
    loadVideos();
    loadAudios();

    const sections = document.querySelectorAll('.section');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    sections.forEach((sec, i) => {
      sec.style.opacity = '0';
      sec.style.transform = 'translateY(20px)';
      sec.style.transition = `opacity 0.6s ease ${i * 0.1}s, transform 0.6s ease ${i * 0.1}s`;
      observer.observe(sec);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
