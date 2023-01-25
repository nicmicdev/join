/**
 * renders and shows all tasks devided by their status at page (mobile)
 */
function renderTasksMobile() {
    document.getElementById('tasks-todo-mobile').innerHTML = '';
    tasksToDo.forEach(task => {renderTaskMobile(task, 'tasks-todo-mobile')});
    document.getElementById('tasks-inprogress-mobile').innerHTML = '';
    tasksProgress.forEach(task => {renderTaskMobile(task, 'tasks-inprogress-mobile')});
    document.getElementById('tasks-feedback-mobile').innerHTML = '';
    tasksFeedback.forEach(task => {renderTaskMobile(task, 'tasks-feedback-mobile')});
    document.getElementById('tasks-done-mobile').innerHTML = '';
    tasksDone.forEach(task => {renderTaskMobile(task, 'tasks-done-mobile')});
}

/**
 * renders and shows each task with some important details in overview (mobile)
 */
function renderTaskMobile(task, taskStatus) {
    document.getElementById(taskStatus).innerHTML += taskCardTemplateMobile(task);
    renderContributorsContainerMobile(task);
    renderPrioritySymbolMobile(task);
}

/**
 * template to display a task as a card in task overview (mobile)
 * @param {task} task - task object(JSON)
 * @returns {HTMLElement} - task as card in overview 
 */
function taskCardTemplateMobile(task) {
    return /*html*/`
    <div onclick='openCard(${JSON.stringify(task)})' class="task-card" id="task-card${task['id']}-mobile">
        <span class="card-category" style="background-color: ${task['category']['color']};">${task['category']['name']}</span>
        <span class="card-title">${task['title']}</span>
        <span class="card-description">${task['description']}</span>
        <div class="card-bottom">
            <div class="contributors-container" id="contributers-container-${task['id']}-mobile">
            </div>
            <img id="prioritySymbol${task['id']}-mobile">
        </div>
    </div>
    `;
}

/**
 * checks priority of task and shows depending on it the symbol in taskoverview (mobile)
 * @param {object} task - task object(JSON)
 */
function renderPrioritySymbolMobile(task) {
    document.getElementById(`prioritySymbol${task['id']}-mobile`).src = `assets/img/${task['priority']}.svg`;
}

/**
 * checks assignedContacts to task and shows these in a task at taskoverview (mobile)
 * @param {object} task - task object(JSON)
 */
function renderContributorsContainerMobile(task) {
    let contacts = task['assigned-contacts'];
    document.getElementById(`contributers-container-${task['id']}-mobile`).innerHTML = '';
    contacts.forEach(contact => {
        document.getElementById(`contributers-container-${task['id']}-mobile`).innerHTML += contributorsContainerTemplate(contact);
    });
}


/**
 * saves dragged task into currentDraggedTask variable
 * @param {number} taskId - id of dragged task
 */
function startDragging(taskId) {
    let task = getTaskById(taskId);
    currentDraggedTask = task;
}

/**
 * allows to drop dragged task in different status divs
 * @param {event} ev - drop event
 */
function allowDrop(ev) {
    ev.preventDefault();
}

/**
 * gets called when dropped in status todo div to update status arrays and status of task, to display updated overview
 * @param {number} id - id of taskdragged and dropped
 */
async function moveToTodo(id) {
    currentDraggedTask['status'] = 'todo';
    removeHighlight(id);
    await backend.setItem('tasks', JSON.stringify(tasks));
    resetArrays();
    declareArrays();
    renderTasks();
}

/**
 * gets called when dropped in status progress div to update status arrays and status of task, to display updated overview
 * @param {number} id - id of taskdragged and dropped
 */
async function moveToProgress(id) {
    currentDraggedTask['status'] = 'progress';
    removeHighlight(id);
    await backend.setItem('tasks', JSON.stringify(tasks));
    resetArrays();
    declareArrays();
    renderTasks();
}

/**
 * gets called when dropped in status feedback div to update status arrays and status of task, to display updated overview
 * @param {number} id - id of taskdragged and dropped
 */
async function moveToFeedback(id) {
    currentDraggedTask['status'] = 'feedback';
    removeHighlight(id);
    await backend.setItem('tasks', JSON.stringify(tasks));
    resetArrays();
    declareArrays();
    renderTasks();
}

/**
 * gets called when dropped in status done div to update status arrays and status of task, to display updated overview
 * @param {number} id - id of taskdragged and dropped
 */
async function moveToDone(id) {
    currentDraggedTask['status'] = 'done';
    removeHighlight(id);
    await backend.setItem('tasks', JSON.stringify(tasks));
    resetArrays();
    declareArrays();
    renderTasks();
}

/**
 * highlights div, when task is dragged over it and it is possible to drop
 * @param {number} id - id of div overwhich it is allowed to drop the dragged element
 */
function highlight(id) {
    document.getElementById(id).classList.add('dragarea-highlight');
}

/**
 * removes highlight, when dragged task not above div anymore
 * @param {number} id - id of div overwhich it is allowed to drop the dragged element
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove('dragarea-highlight');
}