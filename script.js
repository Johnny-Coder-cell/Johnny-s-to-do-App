const STORAGE_KEY = 'todo-app.tasks';

const taskInput = document.getElementById('taskInput');
const addTaskButton = document.getElementById('addTaskButton');
const taskList = document.getElementById('taskList');
const taskCount = document.getElementById('taskCount');
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = loadTasks();
let currentFilter = 'all';

function loadTasks() {
  try {
    const storedTasks = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(storedTasks) ? storedTasks : [];
  } catch (error) {
    console.error('Could not load tasks:', error);
    return [];
  }
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function updateTaskCount() {
  const remainingTasks = tasks.filter((task) => !task.completed).length;
  taskCount.textContent = `${remainingTasks} task${remainingTasks === 1 ? '' : 's'} left`;
}

function updateFilterButtons() {
  filterButtons.forEach((button) => {
    const isActive = button.dataset.filter === currentFilter;
    button.classList.toggle('active', isActive);
  });
}

function createTaskElement(task) {
  const listItem = document.createElement('li');
  listItem.className = 'task-item';

  if (task.completed) {
    listItem.classList.add('completed');
  }

  const checkbox = document.createElement('input');
  checkbox.type = 'checkbox';
  checkbox.checked = task.completed;
  checkbox.setAttribute('aria-label', 'Mark task as completed');

  const taskTextElement = document.createElement('span');
  taskTextElement.className = 'task-text';
  taskTextElement.textContent = task.text;

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'delete-btn';
  deleteButton.textContent = 'Delete';

  checkbox.addEventListener('change', () => {
    toggleTask(task.id);
  });

  deleteButton.addEventListener('click', () => {
    deleteTask(task.id);
  });

  listItem.appendChild(checkbox);
  listItem.appendChild(taskTextElement);
  listItem.appendChild(deleteButton);

  return listItem;
}

function renderTasks() {
  const filteredTasks = tasks.filter((task) => {
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
    return true;
  });

  taskList.innerHTML = '';
  filteredTasks.forEach((task) => {
    taskList.appendChild(createTaskElement(task));
  });

  updateTaskCount();
  updateFilterButtons();
}

function addTask() {
  const taskText = taskInput.value.trim();

  if (!taskText) {
    alert('Please enter a task before adding.');
    taskInput.focus();
    return;
  }

  tasks.push({
    id: Date.now() + Math.random(),
    text: taskText,
    completed: false,
  });

  saveTasks();
  taskInput.value = '';
  taskInput.focus();
  renderTasks();
}

function toggleTask(taskId) {
  tasks = tasks.map((task) => {
    if (task.id === taskId) {
      return { ...task, completed: !task.completed };
    }
    return task;
  });

  saveTasks();
  renderTasks();
}

function deleteTask(taskId) {
  tasks = tasks.filter((task) => task.id !== taskId);
  saveTasks();
  renderTasks();
}

function handleFilterChange(event) {
  currentFilter = event.currentTarget.dataset.filter;
  renderTasks();
}

addTaskButton.addEventListener('click', addTask);

taskInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTask();
  }
});

filterButtons.forEach((button) => {
  button.addEventListener('click', handleFilterChange);
});

renderTasks();
