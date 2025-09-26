document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('task-input');
    const prioritySelect = document.getElementById('priority-select');
    const addBtn = document.getElementById('add-btn');
    const clearAllBtn = document.getElementById('clear-all-btn');
    const taskList = document.getElementById('task-list');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Migrate old string tasks to objects if necessary
    if (tasks.length > 0 && typeof tasks[0] === 'string') {
        tasks = tasks.map(task => ({ text: task, priority: 'Medium' }));
        saveTasks();
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        tasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.priority.toLowerCase()}`;

            const priorityDropdown = document.createElement('select');
            priorityDropdown.className = 'priority-dropdown';
            const options = ['Low', 'Medium', 'High'];
            options.forEach(opt => {
                const option = document.createElement('option');
                option.value = opt;
                option.textContent = opt;
                if (opt === task.priority) option.selected = true;
                priorityDropdown.appendChild(option);
            });
            priorityDropdown.addEventListener('change', function() {
                tasks[index].priority = this.value;
                saveTasks();
                renderTasks();
            });

            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;

            const updateBtn = document.createElement('button');
            updateBtn.className = 'update-btn';
            updateBtn.textContent = 'Update';

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';

            updateBtn.addEventListener('click', function() {
                const input = document.createElement('input');
                input.className = 'edit-input';
                input.value = task.text;
                li.replaceChild(input, span);
                input.focus();

                function saveEdit() {
                    const newText = input.value.trim();
                    if (newText) {
                        tasks[index].text = newText;
                        saveTasks();
                        renderTasks();
                    } else {
                        renderTasks();
                    }
                }

                input.addEventListener('blur', saveEdit);
                input.addEventListener('keypress', function(e) {
                    if (e.key === 'Enter') {
                        saveEdit();
                    }
                });
            });

            deleteBtn.addEventListener('click', function() {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            li.appendChild(priorityDropdown);
            li.appendChild(span);
            li.appendChild(updateBtn);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
    }

    addBtn.addEventListener('click', function() {
        const taskText = taskInput.value.trim();
        const priority = prioritySelect.value;
        if (taskText) {
            tasks.push({ text: taskText, priority: priority });
            saveTasks();
            taskInput.value = '';
            renderTasks();
        }
    });

    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    clearAllBtn.addEventListener('click', function() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            tasks = [];
            saveTasks();
            renderTasks();
        }
    });

    renderTasks();
});
