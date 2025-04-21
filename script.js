document.addEventListener('DOMContentLoaded', function() {
  // Cargar Clippy
  clippy.load('Merlin', function(agent) {
    agent.show();
    agent.moveTo(100, 100);
    agent.speak('¡Hola, soy Clippy!');
  });

  // Hacemos todas las ventanas arrastrables
  document.querySelectorAll('.window').forEach(makeDraggable);

  // Actualizar reloj
  setInterval(updateClock, 1000);
  updateClock();
});

// Funciones de ventanas
function openWindow(id) {
  const windowElement = document.getElementById(id);
  windowElement.style.display = 'block';

  if (id === 'calculator' && !document.getElementById('taskbar-calculator')) {
    const taskbar = document.querySelector('.taskbar-apps');
    const button = document.createElement('div');
    button.id = 'taskbar-calculator';
    button.classList.add('taskbar-item');

    // Crear contenedor para icono y texto
    const itemContent = document.createElement('div');
    itemContent.classList.add('taskbar-item-content');
    
    // Crear icono
    const icon = document.createElement('img');
    icon.src = 'https://win98icons.alexmeub.com/icons/png/accessibility_big_keys.png'; // Ruta del ícono
    icon.alt = 'Calculadora';
    icon.style.width = '16px';  // Ajustar el tamaño del icono

    // Crear texto
    const text = document.createElement('span');
    text.textContent = 'Calculadora';

    // Añadir icono y texto al contenedor
    itemContent.appendChild(icon);
    itemContent.appendChild(text);

    // Añadir el contenedor al botón
    button.appendChild(itemContent);

    button.onclick = () => openWindow('calculator');
    taskbar.appendChild(button);
  }
}



function minimizeWindow(id) {
  const windowElement = document.getElementById(id);
  windowElement.style.display = 'none';

  if (id === 'calculator' && !document.getElementById('taskbar-calculator')) {
    const taskbar = document.querySelector('.taskbar-apps');
    const button = document.createElement('button');
    button.id = 'taskbar-calculator';
    button.textContent = 'Calculadora';
    button.onclick = () => openWindow('calculator');
    taskbar.appendChild(button);
  }
}

function closeWindow(id) {
  const windowElement = document.getElementById(id);
  windowElement.style.display = 'none';

  if (id === 'calculator') {
    const taskbarButton = document.getElementById('taskbar-calculator');
    if (taskbarButton) {
      taskbarButton.remove();
    }
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

  // Detectar el inicio del arrastre (mouse o tactil)
  titleBar.addEventListener('mousedown', function(e) {
    startDrag(e);
  });

  titleBar.addEventListener('touchstart', function(e) {
    startDrag(e);
  });

  // Función para iniciar el arrastre
  function startDrag(e) {
    isDragging = true;
    if (e.type === 'mousedown') {
      offsetX = e.clientX - element.getBoundingClientRect().left;
      offsetY = e.clientY - element.getBoundingClientRect().top;
    } else if (e.type === 'touchstart') {
      offsetX = e.touches[0].clientX - element.getBoundingClientRect().left;
      offsetY = e.touches[0].clientY - element.getBoundingClientRect().top;
    }
    element.style.position = 'absolute';
    element.style.zIndex = 1000;
  }

  // Detectar movimiento del arrastre (mouse o tactil)
  document.addEventListener('mousemove', function(e) {
    if (isDragging) {
      moveElement(e);
    }
  });

  document.addEventListener('touchmove', function(e) {
    if (isDragging) {
      moveElement(e);
    }
  });

  // Función para mover la ventana
  function moveElement(e) {
    let clientX, clientY;
    if (e.type === 'mousemove') {
      clientX = e.clientX;
      clientY = e.clientY;
    } else if (e.type === 'touchmove') {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    }
    element.style.left = (clientX - offsetX) + 'px';
    element.style.top = (clientY - offsetY) + 'px';
  }

  // Detectar el final del arrastre (mouse o tactil)
  document.addEventListener('mouseup', function() {
    isDragging = false;
  });

  document.addEventListener('touchend', function() {
    isDragging = false;
  });

  document.addEventListener('touchcancel', function() {
    isDragging = false;
  });
}
