// Task Manager App

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const input = document.getElementById('task-input');
  const list = document.getElementById('task-list');

  // Load tasks from localStorage
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }

  function renderTasks() {
    list.innerHTML = '';
    if (tasks.length === 0) {
      const li = document.createElement('li');
      li.textContent = 'No tasks yet!';
      li.style.textAlign = 'center';
      li.style.color = '#aaa';
      list.appendChild(li);
      return;
    }
    tasks.forEach((task, idx) => {
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
