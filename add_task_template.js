/**
 * 
 */
async function initAddTaskTemplate(){
    await init();
    sortContactsAddTask();
    initDestop();
}

/**
 * gets called when on editbutton clicked in detailed taskview at the boardpage,
 * shows addtask template (edit template) with the inputs from the task the user chose to edit,
 * overrides onclick method from createtask button to the spcifics of the edit function
 * @param {number} taskId - id from task to edit
 */
function showAddTaskEdit(taskId) {
    document.getElementById('add-edit-button').innerHTML = 'Edit Task<img src="assets/img/createTaskImg.svg">';
    document.getElementById('add-edit-task-headline').innerHTML = 'Edit task';
    let task = getTaskById(taskId);
    showAddTask(task['status']);
    document.getElementById('body').style = 'overflow-y: hidden;';
    document.getElementById('overlay').classList.add('d-none');
    document.getElementById('formAddTask').setAttribute("onsubmit", `onsubmitEdit(${task['id']}); return false;`);
    renderEditTask(task);
    displayAssignedContacts();
}

/**
 * function gets called when on createbutton clicked in edit template, removes old task from
 * the taskarray and creates new task with the users changes
 * @param {number} id - id from task to edit
 */
async function onsubmitEdit(id){
    tasks.splice(id, 1);
    tasks.forEach(task => {
        if(task['id'] > id){
            task['id'] = +task['id'] - 1;
        }
    });
    await checkTaskToCreate();
    document.getElementById('formAddTask').setAttribute("onsubmit", `checkTaskToCreate(); return false;`);
}

/**
 * this functions returns a task by the id asked for from within the tasksarray
 * @param {number} taskId - id from a task
 * @returns {object} task - returns task with the id 
 */
function getTaskById(taskId) {
    let task = tasks.filter(task => task['id'] === taskId);
    return task[0];
}

/**
 * this function renders the data in all the inputfields at the addtask template, 
 * so that the task, where the user clicked edit, is displayed
 * @param {object} task - task with all its data (JSON)
 */
function renderEditTask(task) {
    document.getElementById('input-title').value = task['title'];
    document.getElementById('input-description').value = task['description'];
    document.getElementById('input-date').value = task['due-date'];
    document.getElementById('selected-category-colorDiv').style = `background-color: ${task['category']['color']}`;
    statusTaskOnCreate = task['status'];
    renderPriorityBtnEdit(task);
    renderCategoryEdit(task);
    renderAssignedContactsEdit(task);
}

/**
 * function highlights the prioritybutton, which matches the priority of the task to edit,
 * also declares selectedPriority like that
 * @param {object} task - task with all its data (JSON)
 */
function renderPriorityBtnEdit(task) {
    selectedPriority = task['priority'];
    priorityBtnClicked(selectedPriority);
}

/**
 * function selects the category, which matches the category of the task to edit,
 * also declares selectedCategory like that
 * @param {object} task - task with all its data (JSON)
 */
function renderCategoryEdit(task) {
    document.getElementById('select-category').value = task['category']['name'];
    selectedCategory = task['category'];
}

/**
 * function selects those contacts, which match the assigned contacts of the task to edit,
 * also declares assignedContactsEdit like that
 * @type {Array <HTMLElement>} allContactsEditList - <li> where every contact is in
 * @type {Array <HTMLElement>} allContactsEditList - <input> connected to every contact is in
 * @type {Array <Object>} assignedContactsEdit - all contacts assigned to the task to edit
 * @param {object} task - task with all its data (JSON)
 */
function renderAssignedContactsEdit(task) {
    let counter = 0;
    let assignedContactsEdit = task['assigned-contacts'];
    let allContactsEditList = Array.from(document.getElementsByClassName('input-contact-listitem'));
    let allInputFieldsContactsEdit = Array.from(document.getElementsByClassName('input-contact'));
    allContactsEditList.forEach(listItem => {
        assignedContactsEdit.forEach(contactEdit => {
            if (contactEdit['name'] === listItem.innerText) {
                allInputFieldsContactsEdit[counter].checked = true;
            }
        });
        counter++;
    });
}

/**
 * function gets called in contactssection, when clicked on addTask button in contacts,
 * automaticaly checks name where function is called in "assign to" list 
 * @type {Array <HTMLElement>} allContactsEditList - <li> where every contact is in
 * @type {Array <HTMLElement>} allContactsEditList - <input> connected to every contact is in 
 * @param {string} name - name of contact where function is called
 */
function showAddTaskContactlist(name){
    let counter = 0;
    showAddTask('todo');
    let allInputFieldsContactsEdit = Array.from(document.getElementsByClassName('input-contact'));
    let allContactsEditList = Array.from(document.getElementsByClassName('input-contact-listitem'));
    allContactsEditList.forEach(listItem => {
        if(name === listItem.innerText){
            allInputFieldsContactsEdit[counter].checked = true;
        }
        counter++;
    });
    displayAssignedContacts();
}

/**
 * hides addTask template with an animation in board.html
 */
function hideAddTaskTemplate(){
    document.getElementById('content-addtask').classList.remove('flyIn');
    document.getElementById('content-addtask').classList.add('flyOut');

    clearTask();
    if((window.innerWidth > 1024)){
        setTimeout(hideDivTaskContactSection, 800);
    }
    else {
        hideDivTaskContactSection();
    }

}

/**
 * hides addTask template with an animation in contacts.html
 */
function hideDivTaskContactSection(){
    document.getElementById('content-addtask').classList.add('flyIn');
    document.getElementById('content-addtask').classList.remove('flyOut'); 
    hideAddTask();
}

function getThisActualDate() {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1; //January is 0!
    let yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("input-date").setAttribute("min", today);
}