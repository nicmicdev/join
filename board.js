/**
 * This function calls important functions on onload of the body to get and render the needed data
 */
async function initBoard() {
    await init();
    render('board');
    declareArrays();
    renderTasks();
    renderSuccessMessage();
}

/**
 * when a new tasks has been successfully created, this method shows successmessage
 */
function renderSuccessMessage() {
    taskJustCreated = localStorage.getItem('taskJustCreated');
    if (taskJustCreated === 'true') {
        showSuccessMessage();
    }
}

/**
 * hides detailed view of task
 */
function closeCard() {
    document.getElementById('card-container').classList.add('d-none');
    document.getElementById('overlay').classList.add('d-none');
    document.getElementById('body').classList.add('oflow-y-unset');
    document.getElementById('body').classList.remove('oflow-y-hidden');
    document.getElementById('add-edit-button').innerHTML = 'Add Task<img src="assets/img/createTaskImg.svg">';
    document.getElementById('add-edit-task-headline').innerHTML = 'Add task';
}

/**
 * hides detailes taskview by clicking escape
 */
document.addEventListener('keydown', function (event) {
    if (event.key === "Escape") {
        closeCard();        // an der Stelle die Funktion einsetzen, die das Fenster schließen soll
    }
});

/**
 * resets array which devide tasks array after their status
 */
function resetArrays() {
    tasksToDo = [];
    tasksProgress = [];
    tasksFeedback = [];
    tasksDone = [];
}

/**
 * declares arrays which devide all tasks in tasks array after their status (todo, progress, feedback, done), 
 * for each status one array
 */
function declareArrays() {
    tasks.forEach(task => {
        if (task['status'] === 'todo') {
            tasksToDo.push(task);
        }
        if (task['status'] === 'progress') {
            tasksProgress.push(task);
        }
        if (task['status'] === 'feedback') {
            tasksFeedback.push(task);
        }
        if (task['status'] === 'done') {
            tasksDone.push(task);
        }
    });
}

/**
 * calls function to render and show all tasks devided by their status at page
 */
function renderTasks() {
    renderTasksDestop();
    renderTasksMobile();
}

/**
 * renders and shows all tasks devided by their status at page (destop)
 */
function renderTasksDestop() {
    document.getElementById('tasks-todo').innerHTML = '';
    tasksToDo.forEach(task => { renderTaskDestop(task, 'tasks-todo') });
    document.getElementById('tasks-inprogress').innerHTML = '';
    tasksProgress.forEach(task => { renderTaskDestop(task, 'tasks-inprogress') });
    document.getElementById('tasks-feedback').innerHTML = '';
    tasksFeedback.forEach(task => { renderTaskDestop(task, 'tasks-feedback') });
    document.getElementById('tasks-done').innerHTML = '';
    tasksDone.forEach(task => { renderTaskDestop(task, 'tasks-done') });
}

/**
 * renders and shows each task with some important details in overview (destop)
 */
function renderTaskDestop(task, taskStatus) {
    document.getElementById(taskStatus).innerHTML += taskCardTemplate(task);
    renderContributorsContainer(task);
    renderPrioritySymbol(task);
}

/**
 * template to display a task as a card in task overview (destop)
 * @param {task} task - task object(JSON)
 * @returns {HTMLElement} - task as card in overview 
 */
function taskCardTemplate(task) {
    return /*html*/`
    <div onclick='openCard(${JSON.stringify(task)})' draggable="true" ondragstart="startDragging(${task['id']})" class="task-card" id="task-card${task['id']}">
        <span class="card-category" style="background-color: ${task['category']['color']};">${task['category']['name']}</span>
        <span class="card-title">${task['title']}</span>
        <span class="card-description">${task['description']}</span>
        <div class="card-bottom">
            <div class="contributors-container" id="contributers-container-${task['id']}">
            </div>
            <img id="prioritySymbol${task['id']}">
        </div>
    </div>
    `;
}

/**
 * checks priority of task and shows depending on it the symbol in taskoverview (destop)
 * @param {object} task - task object(JSON)
 */
function renderPrioritySymbol(task) {
    document.getElementById(`prioritySymbol${task['id']}`).src = `assets/img/${task['priority']}.svg`;
}

/**
 * checks assignedContacts to task and shows these in taskoverview (desop)
 * @param {object} task - task object(JSON)
 */
function renderContributorsContainer(task) {
    let contacts = task['assigned-contacts'];
    document.getElementById(`contributers-container-${task['id']}`).innerHTML = '';
    contacts.forEach(contact => {
        document.getElementById(`contributers-container-${task['id']}`).innerHTML += contributorsContainerTemplate(contact);
    });
}

/**
 * template to display a contact in a task at taskoverview
 * @param {object} contact - contact object(JSON)
 */
function contributorsContainerTemplate(contact) {
    let lettersContactCircle = getInitials(contact['name']);
    return `<span class="contributors-circle" style="background-color: ${contact['bg-color']}">${lettersContactCircle}</span>`;
}

/**
 * opens taskcard as an overlay with more details
 * @param {object} task - task object(JSON)
 */
function openCard(task) {
    document.getElementById('card-container').classList.remove('d-none');
    document.getElementById('overlay').classList.remove('d-none');
    document.getElementById('body').classList.add('oflow-y-hid');
    document.getElementById('body').classList.remove('oflow-y-unset');
    convertDueDate(task);
    renderTaskDetails(task);
    renderContributorsContainerDetails(task)
    renderPriorityTagBig(task);
    renderButtons(task);
}

/**
 * converts duedate date form into german dateform
 * @param {object} task - task object(JSON)
 */
function convertDueDate(task) {
    let numbersDueDate = task['due-date'].split("-");
    dueDate = numbersDueDate[2] + "." + numbersDueDate[1] + "." + numbersDueDate[0];
}

/**
 * prevents overlay from closing when clicked on card
 * @param {event} event - onclick
 */
function doNotClose(event) {
    event.stopPropagation();

}

/**
 * resets innerHtml in cardview, then shows onclicked tasks details
 * @param {object} task - task object(JSON)
 */
function renderTaskDetails(task) {
    document.getElementById('task-overly-details').innerHTML = '';
    document.getElementById('task-overly-details').innerHTML = showTaskDetailsTemplate(task);
}

/**
 * shows all assigned Contacts in detailed taskview
 * @param {object} task - task object(JSON)
 */
function renderContributorsContainerDetails(task) {
    let contacts = task['assigned-contacts'];
    document.getElementById('contributor-container-container-big').innerHTML = '';
    contacts.forEach(contact => {
        document.getElementById('contributor-container-container-big').innerHTML += contributorContainerBigTemplate(contact);
    });
}

/**
 * template which shows all assigned Contacts in detailed taskview
 * @param {object} task - task object(JSON)
 */
function contributorContainerBigTemplate(contact) {
    let firstLetters = getInitials(contact['name']);
    return /*html*/ `
        <div class="contributor-container">
            <span class="contributors-circle-big " style="margin-right: 32px; background-color: ${contact['bg-color']};">${firstLetters}</span>
            <span class="due-date-prio" style="margin-bottom: 0 !important ;">${contact['name']}</span>
        </div>
    `;
}

/**
 * shows priority of task in detailed taskview
 * @param {object} task - task object(JSON)
 */
function renderPriorityTagBig(task) {
    document.getElementById('priority-tag').src = `assets/img/${task['priority']}-filled.svg`;
}

/**
 * shows buttons to move task to last or next status
 * @param {object} task - task object(JSON)
 */
function renderButtons(task) {
    if (task['status'] === 'todo') {
        document.getElementById('edit-overlay-btn-statusnext').innerText = 'Progress';
        document.getElementById('edit-overlay-btn-statuslast').classList.add('d-none');
    }
    if (task['status'] === 'progress') {
        document.getElementById('edit-overlay-btn-statusnext').innerText = 'Feedback';
        document.getElementById('edit-overlay-btn-statusnext').style = 'margin-left: 24px';
        document.getElementById('edit-overlay-btn-statuslast').innerText = 'To do';
    }
    if (task['status'] === 'feedback') {
        document.getElementById('edit-overlay-btn-statusnext').innerText = 'Done';
        document.getElementById('edit-overlay-btn-statusnext').style = 'margin-left: 24px';
        document.getElementById('edit-overlay-btn-statuslast').innerText = 'Progress';
    }
    if (task['status'] === 'done') {
        document.getElementById('edit-overlay-btn-statusnext').classList.add('d-none');
        document.getElementById('edit-overlay-btn-statuslast').innerText = 'Feedback';
    }
}

/**
 * cardview overlay template for view of taskdetails
 * @param {object} task - task object(JSON)
 */
function showTaskDetailsTemplate(task) {
    return /*html*/ `
    <button class="edit-overlay-btn" onclick="showAddTaskEdit(${task['id']})"><img src="assets/img/pencil.svg" ></button>
    <button class="edit-overlay-btn-delete" onclick="showDeleteTaskAlert(${task['id']})"><img src="assets/img/trash.png" ></button>
    <span class="directionLTR"><span class="card-category-big" style="background-color: ${task['category']['color']};">${task['category']['name']}</span></span>
    <span class="card-title-big directionLTR">${task['title']}</span>
    <span class="card-description-big directionLTR">${task['description']}</span>
    <div class="due-date-prio directionLTR">
        <span style="font-weight:bold; margin-right: 50px;">Due date:</span>
        <span> ${dueDate} </span>
    </div>
    <div class="due-date-prio directionLTR">
        <span style="font-weight:bold; margin-right: 50px;">Priority:</span>
        <span style="display:flex"><img class="priority-tag" id="priority-tag"></span>
    </div>
    <span class="headingMoveStatusBtns directionLTR">Move Task to:</span>
    <div class="moveStatusBtns">
        <button class="edit-overlay-btn-statuslast" id="edit-overlay-btn-statuslast" onclick="lastStatus(${task['id']})"></button>
        <button class="edit-overlay-btn-statusnext" id="edit-overlay-btn-statusnext" onclick="nextStatus(${task['id']})"></button>
    </div>
    <div class="assigned directionLTR">
        <span class="due-date-prio" style="font-weight:bold;">Assigned to:</span>
        <div id="contributor-container-container-big"></div>
    </div>
    `;
}

/**
 * gets called when user clicks on teash button in detailed cardview and shows dialod asking user if he is sure to delete the task
 * @param {number} id - id of task which user wants to delete 
 */
function showDeleteTaskAlert(id) {
    document.getElementById('alert-delete-task-container').classList.remove('d-none');
    document.getElementById('alert-delete-delete-btn').onclick = () => deleteTask(id);
}

/**
 * hides delete alert
 */
function closeAlertDelete() {
    document.getElementById('alert-delete-task-container').classList.add('d-none');
}

/**
 * removes tasks from all arrays and updates database (task is deleted after), 
 * then closes all overlays and shows task overview of all tasks
 * @param {number} id - id of task to delete
 */
async function deleteTask(id) {
    tasks.splice(id, 1);
    tasks.forEach(task => {
        if (task['id'] > id) {
            task['id'] = +task['id'] - 1;
        }
    });
    await backend.setItem('tasks', JSON.stringify(tasks));
    resetArrays();
    declareArrays();
    renderTasks();
    closeCard();
    closeAlertDelete();
}

/**
 * gets called on keyup in searchfield, 
 * checks for each task if it includes the searchinput in description or title, if it does it will be pushed into matchingTasks Array,
 * then calls function removeSearchTask
 * @type {Array} matchingTasks - array with all tasks, which include searchinput
 */
function searchTask() {
    showAllTasksSearch();
    matchingTasks = [];
    updateSearchDestopMobile();
    if (searchTaskInput != '') {
        tasks.forEach(task => {
            let taskTitleLowerCase = task['title'].toLowerCase();
            let taskDescriptionLowerCase = task['description'].toLowerCase();
            if (taskTitleLowerCase.includes(searchTaskInput) || taskDescriptionLowerCase.includes(searchTaskInput)) {
                matchingTasks.push(task);
            }
        });
        removeTasksSearch();
    }
}

/**
 * updates input in search at mobileversion when put into destop and the other way around
 */
function updateSearchDestopMobile(){
    if (document.body.clientWidth > 1024) {
        searchTaskInput = document.getElementById('searchTaskDestop').value;
        document.getElementById('searchTaskMobile').value = searchTaskInput;
        searchTaskInput = searchTaskInput.toLowerCase();
    } else {
        searchTaskInput = document.getElementById('searchTaskMobile').value;
        document.getElementById('searchTaskDestop').value = searchTaskInput;
        searchTaskInput = searchTaskInput.toLowerCase();
    }
}

/**
 * hides all tasks who are not in matchingtasks array
 */
function removeTasksSearch() {
    tasks.forEach(task => {
        if (!matchingTasks.includes(task)) {
            document.getElementById(`task-card${task['id']}`).classList.add('d-none');
            document.getElementById(`task-card${task['id']}-mobile`).classList.add('d-none');
        }
    });
}

/**
 * function shows all tasks again
 */
function showAllTasksSearch() {
    tasks.forEach(task => {
        document.getElementById(`task-card${task['id']}`).classList.remove('d-none');
        document.getElementById(`task-card${task['id']}-mobile`).classList.remove('d-none');
    });
}

/**
 * gets called when in detailed task view (overlay) clicked on move to last status button,
 * checks status of the task, then updates its status and updates database, 
 * then closes cardview and resets arrays, to update also overview
 * @param {number} taskId - id of task
 */
async function lastStatus(taskId) {
    let task = getTaskById(taskId);
    let currentStatus = task['status'];
    if (currentStatus === 'done') {
        task['status'] = 'feedback';
    }
    if (currentStatus === 'feedback') {
        task['status'] = 'progress';
    }
    if (currentStatus === 'progress') {
        task['status'] = 'todo';
    }
    await backend.setItem('tasks', JSON.stringify(tasks));
    resetArrays();
    declareArrays();
    renderTasks();
    closeCard();
}

/**
 * gets called when in detailed task view (overlay) clicked on move to next status button,
 * checks status of the task, then updates its status and updates database, 
 * then closes cardview and resets arrays, to update also overview
 * @param {number} taskId - id of task
 */
async function nextStatus(taskId) {
    let task = getTaskById(taskId);
    let currentStatus = task['status'];
    if (currentStatus === 'todo') {
        task['status'] = 'progress';
    }
    if (currentStatus === 'progress') {
        task['status'] = 'feedback';
    }
    if (currentStatus === 'feedback') {
        task['status'] = 'done';
    }
    await backend.setItem('tasks', JSON.stringify(tasks));
    resetArrays();
    declareArrays();
    renderTasks();
    closeCard();
}

/**
 * shows successmassege, that the task is successfully created for 3 seconds
 */
function showSuccessMessage() {
    document.getElementById("dialog-taskadded").classList.remove('d-none');
    setTimeout(function () {
        document.getElementById("dialog-taskadded").classList.add('d-none');
        localStorage.setItem('taskJustCreated', 'false');
    }, 2000);
}