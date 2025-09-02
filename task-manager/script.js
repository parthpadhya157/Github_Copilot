// Task Manager App


document.addEventListener('DOMContentLoaded', () => {
  // Dark mode toggle logic
  const darkToggle = document.getElementById('dark-mode-toggle');
  const root = document.documentElement;
  const DARK_KEY = 'taskManagerDarkMode';

  function setDarkMode(on) {
    if (on) {
      root.classList.add('dark-mode');
      darkToggle.setAttribute('aria-pressed', 'true');
      darkToggle.querySelector('.dark-toggle-icon').textContent = '☀️';
    } else {
      root.classList.remove('dark-mode');
      darkToggle.setAttribute('aria-pressed', 'false');
      darkToggle.querySelector('.dark-toggle-icon').textContent = '🌙';
    }
    localStorage.setItem(DARK_KEY, on ? '1' : '0');
  }

  if (darkToggle) {
    // Initial state from localStorage
    const darkPref = localStorage.getItem(DARK_KEY);
    setDarkMode(darkPref === '1');
    darkToggle.addEventListener('click', () => {
      const isDark = root.classList.contains('dark-mode');
      setDarkMode(!isDark);
    });
  }
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');
  const filterNav = document.getElementById('filter-nav');
  const filterBtns = filterNav ? Array.from(filterNav.querySelectorAll('.filter-btn')) : [];

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
  let currentFilter = 'all';

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function getFilteredTasks() {
    if (currentFilter === 'completed') return tasks.filter(t => t.completed);
    if (currentFilter === 'pending') return tasks.filter(t => !t.completed);
    return tasks;
  }

  function renderTasks() {
    list.innerHTML = '';
    const filtered = getFilteredTasks();
    if (filtered.length === 0) {
      const li = document.createElement('li');
      li.textContent = tasks.length === 0 ? 'No tasks yet!' : 'No tasks to show.';
      li.style.textAlign = 'center';
      li.style.color = '#aaa';
      list.appendChild(li);
      return;
    }
    filtered.forEach((task, idxFiltered) => {
      // Find the real index in tasks array
      const idx = tasks.indexOf(task);
      const li = document.createElement('li');
      li.className = 'task-item' + (task.completed ? ' completed' : '');
      li.setAttribute('role', 'listitem');
      li.innerHTML = `
        <span>${task.text}</span>
        <div class="task-actions">
          <button class="complete-btn" aria-label="Mark as completed" title="Mark as completed">✔</button>
          <button class="delete-btn" aria-label="Delete task" title="Delete task">✖</button>
        </div>
      `;
      // Complete button
      li.querySelector('.complete-btn').onclick = () => {
        tasks[idx].completed = !tasks[idx].completed;
        saveTasks();
        renderTasks();
      };
      // Delete button
      li.querySelector('.delete-btn').onclick = () => {
        tasks.splice(idx, 1);
        saveTasks();
        renderTasks();
      };
      list.appendChild(li);
    });
  }

  if (filterNav) {
    filterNav.addEventListener('click', e => {
      if (e.target.classList.contains('filter-btn')) {
        const selected = e.target.getAttribute('data-filter');
        if (selected !== currentFilter) {
          currentFilter = selected;
          filterBtns.forEach(btn => {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === selected);
            btn.setAttribute('aria-pressed', btn.getAttribute('data-filter') === selected ? 'true' : 'false');
          });
          renderTasks();
        }
      }
    });
  }
// Input validation: prevent empty or whitespace-only tasks
input.addEventListener('input', () => {
    input.value = input.value.replace(/^\s+/, ''); // Prevent leading whitespace
});
  form.onsubmit = e => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    tasks.unshift({ text, completed: false });
    saveTasks();
    renderTasks();
    input.value = '';
    input.focus();
  };

  renderTasks();
});
