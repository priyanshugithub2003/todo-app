// DOM Elements
const taskInput = document.getElementById('taskInput');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');
const filterBtns = document.querySelectorAll('.filter-btn');

// Event Listeners
document.addEventListener('DOMContentLoaded', loadTasksFromLocalStorage);
addTaskBtn.addEventListener('click', addTask);
taskList.addEventListener('click', handleTaskAction);
filterBtns.forEach(btn => btn.addEventListener('click', filterTasks));

// Load tasks from LocalStorage on page load
function loadTasksFromLocalStorage() {
    const tasks = getTasksFromLocalStorage();
    tasks.forEach(task => {
        createTaskElement(task);
    });
}

// Add a new task
function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === '') return;

    const task = {
        id: Date.now(),
        text: taskText,
        completed: false
    };

    createTaskElement(task);
    saveTaskToLocalStorage(task);
    taskInput.value = '';
}

// Create task HTML element and append to the list
function createTaskElement(task) {
    const li = document.createElement('li');
    li.setAttribute('data-id', task.id);
    li.classList.add('task-item');
    if (task.completed) li.classList.add('completed');

    li.innerHTML = `
        <span>${task.text}</span>
        <div class="actions">
            <button class="complete-btn">✔</button>
            <button class="delete-btn">✖</button>
        </div>
    `;

    taskList.appendChild(li);
}

// Handle task actions (complete or delete)
function handleTaskAction(e) {
    const taskItem = e.target.closest('.task-item');
    const taskId = taskItem.getAttribute('data-id');

    if (e.target.classList.contains('complete-btn')) {
        toggleTaskCompletion(taskItem, taskId);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTask(taskItem, taskId);
    }
}

// Toggle task completion
function toggleTaskCompletion(taskItem, taskId) {
    taskItem.classList.toggle('completed');
    updateTaskInLocalStorage(taskId, { completed: taskItem.classList.contains('completed') });
}

// Delete task
function deleteTask(taskItem, taskId) {
    taskItem.remove();
    removeTaskFromLocalStorage(taskId);
}

// Filter tasks based on the selected filter
function filterTasks(e) {
    const filter = e.target.getAttribute('data-filter');
    document.querySelectorAll('.task-item').forEach(taskItem => {
        switch (filter) {
            case 'all':
                taskItem.style.display = 'flex';
                break;
            case 'completed':
                taskItem.style.display = taskItem.classList.contains('completed') ? 'flex' : 'none';
                break;
            case 'incomplete':
                taskItem.style.display = !taskItem.classList.contains('completed') ? 'flex' : 'none';
                break;
        }
    });

    // Highlight the active filter button
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');
}

// LocalStorage functions
function getTasksFromLocalStorage() {
    return JSON.parse(localStorage.getItem('tasks')) || [];
}

function saveTaskToLocalStorage(task) {
    const tasks = getTasksFromLocalStorage();
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function updateTaskInLocalStorage(taskId, updates) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.map(task => task.id == taskId ? { ...task, ...updates } : task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskId) {
    let tasks = getTasksFromLocalStorage();
    tasks = tasks.filter(task => task.id != taskId);
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
