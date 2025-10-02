const taskTitle = document.getElementById('taskTitle');
const taskDate = document.getElementById('taskDate');
const taskDesc = document.getElementById('taskDesc');
const addTaskBtn = document.getElementById('addTaskBtn');
const taskList = document.getElementById('taskList');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = task.completed ? 'completed' : '';
        li.innerHTML = `
            <div>
                <strong>${task.title}</strong> (${task.date})<br>
                ${task.desc}
            </div>
            <div class="task-actions">
                <button class="complete-btn">${task.completed ? 'Undo' : 'Complete'}</button>
                <button class="delete-btn">Delete</button>
            </div>
        `;

        // Complete task
        li.querySelector('.complete-btn').addEventListener('click', () => {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        // Delete task
        li.querySelector('.delete-btn').addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        taskList.appendChild(li);
    });
}

addTaskBtn.addEventListener('click', () => {
    if (!taskTitle.value || !taskDate.value) return alert('Please enter title and date!');
    tasks.push({
        title: taskTitle.value,
        date: taskDate.value,
        desc: taskDesc.value,
        completed: false
    });
    taskTitle.value = '';
    taskDate.value = '';
    taskDesc.value = '';
    saveTasks();
    renderTasks();
});

renderTasks();
