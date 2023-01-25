/**
 * defining global variables
 */
let statusTaskOnCreate = 'todo';
let tasks = [];
let tasksToDo = [];
let tasksProgress = [];
let tasksFeedback = [];
let tasksDone = [];
let users = [];
let activeUser;
let dueDate;
let searchTaskInput;
let matchingTasks = [];
let currentDraggedTask;
let taskJustCreated;


/**
 * function gets data from server and declares arrays with that data
 * @type {array<object>} users - array with all users
 * @type {array<object>} tasks - array with all tasks
 * @type {array<object>} contactsAddTask - array with all contacts to use in addTask.html and the tamplate
 * @type {array<object>} categories - array with all categories
 * @type {array<object>} contacts - array with all contacts
 * @type {string} activeUser - name of signed in user
 */
async function init() {
    setURL('https://niclas-michel.developerakademie.net/projects/join/smallest_backend_ever/');
    await downloadFromServer();
    users = JSON.parse(backend.getItem('users')) || [];
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    contactsAddTask = JSON.parse(backend.getItem('contact')) || [];
    categories = JSON.parse(backend.getItem('categories')) || [];
    contacts = JSON.parse(backend.getItem('contact')) || [];
    activeUser = JSON.parse(localStorage.getItem('activeUser')) || [];  
}

/**
 * function shows the remembered contact from local storage
 * 
 */
function showRememberMeContact(){
    let rememberMeEmailField = document.getElementById('email-login');
    let rememberMePasswordField = document.getElementById('password-login');

    rememberMeEmailField.value = localStorage.getItem('rememberMeEmail');
    rememberMePasswordField.value = localStorage.getItem('rememberMePassword');
}

/**
 * function renders templates (e.g. navigationbar, footer, topper, addTaskTemplate),
 * highlights current section in navbar and footer
 * @param {string} currentSection - name of the current section
 */
async function render(currentSection) {
    await includeHTML();
    setActiveSection(currentSection);
    renderUsernameTopper();
}

/**
 * function renders templates (footer, topper),
 * just used at mobile greeting, because it has no section
 * @param {string} currentSection - name of the current section
 */
async function renderWithoutActiveSection(){
    await includeHTML();
    renderUsernameTopper();
}


/**
 * includes all needed templates in page and renders those
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


/**
 * renders and sets the username of the logged in user in topper
 */
function renderUsernameTopper(){
    document.getElementById('topper-name-destop').innerHTML = `<strong>${activeUser}</strong>`;
    document.getElementById('topper-name-mobile').innerHTML = `<strong>${activeUser}</strong>`;
}


/**
 * highlights the current section in navbar and footer depending on in which section the user is
 *@param {string} currentSection - the current page the user is in
 */
function setActiveSection(currentSection){
    if(currentSection == 'summary'){
        document.getElementById('summary-section').classList.add('active-content-section');
        document.getElementById('summary-section-mobile').classList.add('active-content-section');
    }
    if (currentSection == 'board') {
        document.getElementById('board-section').classList.add('active-content-section');
        document.getElementById('board-section-mobile').classList.add('active-content-section');
    }
    if (currentSection == 'addtask') {
        document.getElementById('addtask-section').classList.add('active-content-section');
        document.getElementById('addtask-section-mobile').classList.add('active-content-section');
    }
    if (currentSection == 'contacts') {
        document.getElementById('contacts-section').classList.add('active-content-section');
        document.getElementById('contacts-section-mobile').classList.add('active-content-section');
    }
    if (currentSection == 'legalnotice') {
        document.getElementById('legalnotice-section').classList.add('active-content-section');
    }
}


/**
 * function shows the helppage on each page
 */
function showHelp(){
    document.getElementById('body').style = 'overflow-y: hidden;';
    document.getElementById('help-content').classList.remove('d-none');
    document.getElementById('help-button').classList.add('d-none');
}


/**
 * function hides help page
 */
function hideHelp(){
    document.getElementById('body').style = '';
    document.getElementById('help-content').classList.add('d-none');
    document.getElementById('help-button').classList.remove('d-none');
}


/**
 * function shows logout button when clicked on name in topper
 */
function showLogout(){
    document.getElementById('logout-button').classList.remove('d-none');
    document.getElementById('options-mobile').classList.remove('d-none');
}


/**
 * function hides logout button
 */
function hideLogout(){
    document.getElementById('logout-button').classList.add('d-none');
    document.getElementById('options-mobile').classList.add('d-none');
}


/**
 * shows addtask template to create new task
 * @type {string} statusTaskOnCreate - variable for different functions to know what status the task shown right now has
 * @param {string} statusPro - current status of task
 */
function showAddTask(statusPro){
    statusTaskOnCreate = statusPro;
    document.getElementById('add-task-overlay-board').classList.remove('d-none');
    document.getElementById('body').style = 'overflow-y: hidden !important;';
    document.getElementById('assignedContactsDiv').innerHTML = '';
    initDestop();
    renderCategories();
}


/**
 * hides addtask template
 */
function hideAddTask(){
    statusTaskOnCreate = 'todo';
    document.getElementById('add-task-overlay-board').classList.add('d-none');
    document.getElementById('body').style = '';
    if(document.getElementById('tasks-inprogress-mobile')){ //checks if mobile is extra (in add Task Template no -mobile IDs)
        closeCard();
        document.getElementById('formAddTask').setAttribute("onsubmit", `checkTaskToCreate(); return false;`);
    }
}


/**
 * prevents propagation
 * @param {event} event - onclickevent 
 */
function doNotClose(event) {
    event.stopPropagation();
}


/**
 * getting data from backend and rendering page afterwards
 * 
 */
async function initLegalNotice(){
    await init();
    render('legalnotice');
}


