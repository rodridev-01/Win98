let isSelecting = false;
let startX, startY;
const selectionBox = document.createElement('div');
selectionBox.id = 'selectionBox';
document.body.appendChild(selectionBox);

document.addEventListener('mousedown', (e) => {
  if (e.button !== 0 || e.target.closest('.window')) return;

  isSelecting = true;
  startX = e.pageX;
  startY = e.pageY;
  selectionBox.style.left = `${startX}px`;
  selectionBox.style.top = `${startY}px`;
  selectionBox.style.width = '0px';
  selectionBox.style.height = '0px';
  selectionBox.style.display = 'block';
});

document.addEventListener('mousemove', (e) => {
  if (!isSelecting) return;

  const currentX = e.pageX;
  const currentY = e.pageY;

  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  selectionBox.style.width = `${width}px`;
  selectionBox.style.height = `${height}px`;
  selectionBox.style.left = `${Math.min(currentX, startX)}px`;
  selectionBox.style.top = `${Math.min(currentY, startY)}px`;
});

document.addEventListener('mouseup', () => {
  if (isSelecting) {
    isSelecting = false;
    selectionBox.style.display = 'none';
  }
});

//CLICK EN ICONOS
const icons = document.querySelectorAll('.desktop .icon');

icons.forEach(icon => {
  icon.addEventListener('click', () => {
    if (icon.classList.contains('selected')) {
      icon.classList.remove('selected'); 
    } else {
      icons.forEach(i => i.classList.remove('selected')); 
      icon.classList.add('selected'); 
    }
  });

  icon.addEventListener('dblclick', () => {
    const id = icon.getAttribute('data-window');
    const iconSrc = icon.getAttribute('data-icon');
    openWindow(id, iconSrc);
  });
});

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.window').forEach(makeDraggable);

  // Actualizar reloj
  setInterval(updateClock, 1000);
  updateClock();
});

// Funciones para abrir, minimizar y cerrar ventanas
function openWindow(id, iconSrc) {
  const windowElement = document.getElementById(id);
  windowElement.style.display = 'block';

  let taskbarButton = document.getElementById('taskbar-' + id);

  if (!taskbarButton) {
    const taskbar = document.querySelector('.taskbar-apps');
    taskbarButton = document.createElement('div');
    taskbarButton.id = 'taskbar-' + id;
    taskbarButton.classList.add('taskbar-item');

    const icon = document.createElement('img');
    icon.src = iconSrc;
    icon.alt = '';
    icon.style.width = '25px';
    icon.style.height = '25px';

    taskbarButton.appendChild(icon);
    taskbar.appendChild(taskbarButton);
  }

  taskbarButton.onclick = () => {
    if (windowElement.style.display === 'none' || windowElement.style.display === '') {
      windowElement.style.display = 'block';
    } else {
      windowElement.style.display = 'none';
    }
  };
}

function minimizeWindow(id) {
  const windowElement = document.getElementById(id);
  windowElement.style.display = 'none';
}

function closeWindow(id) {
  const windowElement = document.getElementById(id);
  windowElement.style.display = 'none';

  if (id === 'musicPlayer') {
    const audio = windowElement.querySelector('audio');
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  const taskbarButton = document.getElementById('taskbar-' + id);
  if (taskbarButton) {
    taskbarButton.remove();
  }
}

// Menú Inicio
function toggleStartMenu() {
  const menu = document.getElementById('startMenu');
  menu.style.display = (menu.style.display === 'block') ? 'none' : 'block';
}

// Reloj
function updateClock() {
  const now = new Date();
  let hours = now.getHours();
  let minutes = now.getMinutes();
  if (minutes < 10) minutes = '0' + minutes;
  document.getElementById('clock').textContent = `${hours}:${minutes}`;
}

// Funciones del calendario
let currentDate = new Date();
const today = new Date();

function toggleCalendar() {
  const calendar = document.getElementById('calendar');
  calendar.classList.toggle('hidden');
  renderCalendar();
}

function renderCalendar() {
  const calendarBody = document.getElementById('calendar-body');
  const monthDisplay = document.getElementById('calendar-month');
  calendarBody.innerHTML = '';

  const month = currentDate.getMonth();
  const year = currentDate.getFullYear();

  monthDisplay.textContent = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDay; i++) {
    calendarBody.innerHTML += `<div></div>`;
  }

  for (let i = 1; i <= daysInMonth; i++) {
    let isToday = (i === today.getDate() && month === today.getMonth() && year === today.getFullYear());
    calendarBody.innerHTML += `<div class="${isToday ? 'today' : ''}">${i}</div>`;
  }
}

function prevMonth() {
  currentDate.setMonth(currentDate.getMonth() - 1);
  renderCalendar();
}

function nextMonth() {
  currentDate.setMonth(currentDate.getMonth() + 1);
  renderCalendar();
}

// Funciones de la calculadora
function appendToDisplay(value) {
  document.getElementById('calc-display').value += value;
}

function clearDisplay() {
  document.getElementById('calc-display').value = '';
}

function calculateResult() {
  const display = document.getElementById('calc-display');
  try {
    display.value = eval(display.value);
  } catch (e) {
    display.value = 'Error';
  }
}

// Función para hacer ventanas arrastrables
function makeDraggable(element) {
  const titleBar = element.querySelector('.title-bar');
  let isDragging = false;
  let offsetX = 0;
  let offsetY = 0;

  titleBar.addEventListener('mousedown', function (e) {
    isDragging = true;
    offsetX = e.clientX - element.getBoundingClientRect().left;
    offsetY = e.clientY - element.getBoundingClientRect().top;
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
  });

  document.addEventListener('mousemove', function (e) {
    if (isDragging) {
      element.style.left = (e.clientX - offsetX) + 'px';
      element.style.top = (e.clientY - offsetY) + 'px';
    }
  });

  document.addEventListener('mouseup', function () {
    isDragging = false;
  });
}

const audio = document.getElementById('audioPlayer');
const progressBar = document.getElementById('progressBar');
const timeDisplay = document.getElementById('timeDisplay');
const volumeControl = document.getElementById('volumeControl');

function playMusic() {
  audio.play();
}

function pauseMusic() {
  audio.pause();
}

function stopMusic() {
  audio.pause();
  audio.currentTime = 0;
}

audio.addEventListener('timeupdate', () => {
  const progress = (audio.currentTime / audio.duration) * 100;
  progressBar.value = progress;
  
  const currentMinutes = Math.floor(audio.currentTime / 60);
  const currentSeconds = Math.floor(audio.currentTime % 60).toString().padStart(2, '0');
  
  const durationMinutes = Math.floor(audio.duration / 60);
  const durationSeconds = Math.floor(audio.duration % 60).toString().padStart(2, '0');

  timeDisplay.textContent = `${currentMinutes}:${currentSeconds} / ${durationMinutes}:${durationSeconds}`;
});

progressBar.addEventListener('input', () => {
  const seekTime = (progressBar.value / 100) * audio.duration;
  audio.currentTime = seekTime;
});

volumeControl.addEventListener('input', () => {
  audio.volume = volumeControl.value;
});

fetch('Social/data.json')
  .then(response => response.json())
  .then(data => {
    const gallery = document.getElementById('gallery');
    data.forEach(post => {
      const img = document.createElement('img');
      img.src = post.image;
      gallery.appendChild(img);
    });
  })
  .catch(error => {
    console.error('Error cargando imágenes:', error);
  });
