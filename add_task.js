let selectedPriority;
let contactAssigned = false;
let selectedColor;
let selectedCategory;
let contactsAddTask;
let contactsSorted;
let categories = [];

/**
 * This function is used to call important functions on onload of the body to get and render the needed data
 */
async function initAddTask() {
    await init();
    initDestop();
    initMobile();
    render('addtask');
}

/**
 * This function is used to to call all methods to render the destop view
 * 
 * @type {HTMLElement} checkList - list of contacts to choose from to assign to the task
 */
function initDestop() {
    sortContactsAddTask();
    let checkList = document.getElementById('assign-to-list');
    checkList.getElementsByClassName('anchor')[0].onclick = function () {
        if (checkList.classList.contains('visible'))
            checkList.classList.remove('visible');
        else
            checkList.classList.add('visible');
    }
    renderCategories();
    renderContactsAddTask()
}


/**
 * This function is used to to call all methods to render the mobile view;
 * @type {HTMLElement} checkList - list of contacts to choose from to assign to the task
 */
function initMobile() {
    sortContactsAddTask();
    if (document.getElementById('assign-to-list-mobile')) { //checks if mobile is extra (in add Task Template no -mobile IDs)
        let checkList = document.getElementById('assign-to-list-mobile');
        checkList.getElementsByClassName('anchor')[0].onclick = function (evt) {
            if (checkList.classList.contains('visible'))
                checkList.classList.remove('visible');
            else
                checkList.classList.add('visible');
        }
        renderCategoriesMobile();
        renderContactsMobile();
    }
}

/**
 * declares contactsSorted, sorts the list of all contacts alphabetically
 * @type {Array} contactsSorted
 */
function sortContactsAddTask() {
    contactsSorted = contactsAddTask.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * each contact in contactsSorted gets displayed in an <li> HTMLElement with an inputfield to uncheck and check this contact (for destopversion)
 * (checked contacts are getting assigned to the task)
 */
function renderContactsAddTask() {
    document.getElementById('contacts-to-assign').innerHTML = '';
    for (let i = 0; i < contactsSorted.length; i++) {
        document.getElementById('contacts-to-assign').innerHTML += `
        <li class="input-contact-listitem" onclick="assignContactOnClick(${i})" style="background-color: ${contactsSorted[i]['bg-color']};" value="${[i]}"><input onclick="stopPropagationInput(event)" class="input-contact" id="input-contact-destop${i}"
        type="checkbox" style="margin-right: 42px"/>${contactsSorted[i]['name']}</li>
        `;
    }
}

/**
 * checks from the li HTMLElements from renderContactsMobile() which ones are checked and collects all assigned contacts in an array, which will be returned (for destopversion)
 * @returns {Array} assignedContacts - array with all contacts assigned to the tasks
 */
function getAssignedContacts() {
    let assignedContacts = [];
    let counter = 0;
    let contactsSelection = Array.from(document.getElementsByClassName('input-contact'));
    contactsSelection.forEach(contact => {
        if (contact.checked) {
            assignedContacts.push(contactsSorted[counter]);
        }
        counter++;
    });
    return assignedContacts;
}

/**
 * onclick method when on li contact item clicked to check and uncheck inputfield in li item
 * @param {number} i - number in array to identify which contacts has been clicked
 */
function assignContactOnClick(i) {
    if (document.getElementById(`input-contact-destop${i}`).checked) {
        document.getElementById(`input-contact-destop${i}`).checked = false;
        if (document.getElementById(`input-contact-mobile${i}`)) { //checks if mobile is extra (in add Task Template no -mobile IDs)
            document.getElementById(`input-contact-mobile${i}`).checked = false;
        }
    } else {
        document.getElementById(`input-contact-destop${i}`).checked = true;
        if (document.getElementById(`input-contact-mobile${i}`)) { //checks if mobile is extra (in add Task Template no -mobile IDs)
            document.getElementById(`input-contact-mobile${i}`).checked = true;
        }
    }
    displayAssignedContacts();
}

/**
 * prevents when on input clicked that onclickfunction of parent gets triggerd
 * @param {event} event - onclick event
 */
function stopPropagationInput(event) {
    event.stopPropagation();
}

/**
 * each category in categories gets displayed in an <option> HTMLElement to select a category (for destopversion)
 * when on <option> "create a new category" selected, user can create new category
 * (selected category is the tasks category then)
 */
function renderCategories() {
    document.getElementById('select-category').innerHTML = '';
    document.getElementById('select-category').innerHTML = `
    <option disabled selected style="background-color:grey;">Select task category</option>
    <option style="color: black;">Create a new Category</option>
    `;
    categories.forEach(category => {
        document.getElementById('select-category').innerHTML += categoriesDropdownTemplate(category);
    });
}

/**
 * Template for category to be displayed in
 * @param {object} category - category from categories do be displayed in the template within the <option> Element
 * @returns {HTMLElement} <option> - 
 */
function categoriesDropdownTemplate(category) {
    return `<option style="background-color: ${category['color']}" value="${category['name']}">${category['name']}</option>`;
}

/** (destopversion)
 * gets called when a category is selected
 * if first <option> selected (create category) create new category div is shown and select HTMLElement is removed from display, else
 * selected category for the task is shown as selected
 * @type {number} selectedIndex - index of selected option
 * @type {object} selectedCategory - from user selected Category
 */
function showAddCategory() {
    let selectedIndex = document.getElementById('select-category').selectedIndex;
    if (selectedIndex === 1) {
        document.getElementById('select-category').classList.add('d-none');
        document.getElementById('create-category').classList.remove('d-none');
        document.getElementById('selected-category-colorDiv').classList.add('d-none');
    } else {
        selectedCategory = categories[selectedIndex - 2];
        document.getElementById('selected-category-colorDiv').style = `background-color: ${selectedCategory['color']}`;
    }
}

/**
 * when new categrory is getting created user has to choose a color for it,
 * function is called onclick when user selects a color,
 *  first all colors are getting reset, because a color could have been selected already,
 *  then by user selected color gets highlighted and saved in selectedColor
 * @type {string} selectedColor - by user selected color for new category in creation
 * @param {number} id - number in id of a coloroption selected in <div class="select-color-category">
 */
function selectColor(id) {
    for (let i = 1; i < 8; i++) {
        document.getElementById(`color${i}`).classList.remove('selected-color');
        if (document.getElementById(`color${i}-mobile`)) { //checks if mobile is extra (in add Task Template no -mobile IDs)
            document.getElementById(`color${i}-mobile`).classList.remove('selected-color');
        }
    }
    document.getElementById(`color${id}`).classList.add('selected-color');
    if (document.getElementById(`color${id}-mobile`)) { //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById(`color${id}-mobile`).classList.add('selected-color');
    }
    selectedColor = document.getElementById(`color${id}`).style.backgroundColor;
}

/** (destop)
 * gets called when user wants to create new Category,
 * checks if user gave all needed information, else alert
 */
function checkNewCategory() {
    if (selectedColor && document.getElementById('new-category').value != '') {
        createNewCategory();
    } else {
        alert('Please insert category name and a color!');
    }
}

/** (destop)
 * creates new category object with a name and a color and adds it to aray of all categories, also updates
 * categories array in backend, then cleares and closes add category div
 */
async function createNewCategory() {
    let category = {
        'name': document.getElementById('new-category').value,
        'color': selectedColor
    }
    categories.push(category);
    await backend.setItem('categories', JSON.stringify(categories));
    selectedCategory = categories[categories.length - 1];
    document.getElementById('selected-category-colorDiv').style = `background-color: ${categories[categories.length - 1]['color']}`;
    dismissCategory();
    renderCategories();
    document.getElementById('select-category').value = selectedCategory['name'];
    document.getElementById('selected-category-colorDiv').classList.remove('d-none');
    if (document.getElementById(`urgent-btn-mobile`)) { //checks if mobile is extra (in add Task Template no -mobile IDs)
        renderCategoriesMobile();
    }
}

/** (destop)
 * clears all inputs and selections made by user on create new category 
 * gets called when user dismisses or category has been succesfully created
 * @type {string} selectedColor - resets selected color
 */
function dismissCategory() {
    if (document.getElementsByClassName('selected-color').length > 0) {
        document.getElementsByClassName('selected-color')[0].classList.remove('selected-color');
    }
    document.getElementById('select-category').classList.remove('d-none');
    document.getElementById('create-category').classList.add('d-none');
    if (selectedCategory) {
        document.getElementById('select-category').value = selectedCategory['name'];
        document.getElementById('selected-category-colorDiv').classList.remove('d-none');
    }
    selectedColor = null;
}

/**
 * gets called when the priority is selected by user within clicking on a button,
 * function checks by id, which button was clicked and which priority has been selected
 * @param {string} id - id from clicked Button
 */
function clickPriorityButton(id) {
    unsetBtnClicked();
    priorityBtnClicked(id);
    selectedPriority = id;
    defineSelectedPriority(id);
}

/**
 * function declares selectedPriority after user selected a priority
 * @type {string} selectedPriority - while task is in creation the selected priority by user
 * @param {id} id - id from clicked Button
 */
function defineSelectedPriority(id) {
    if (id == 'urgent-btn-mobile' || id == 'urgent-btn') {
        selectedPriority = 'urgent';
    }
    if (id == 'medium-btn-mobile' || id == 'medium-btn') {
        selectedPriority = 'medium';
    }
    if (id == 'low-btn-mobile' || id == 'low-btn') {
        selectedPriority = 'low';
    }
}

/**
 * resets all priority Buttons, by calling functions, so that no priority is selected
 */
function unsetBtnClicked() {
    resetBtnClickedUrgent();
    resetBtnClickedMedium();
    resetBtnClickedLow();
}

/**
 * resets priority button "urgent"
 */
function resetBtnClickedUrgent() {
    document.getElementById('urgent-btn').classList.remove('choosePriorityPicked');
    document.getElementById('urgent-btn').classList.remove('urgent');
    if (document.getElementById('urgent-btn-mobile')) {  //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById('urgent-btn-mobile').classList.remove('urgent');
        document.getElementById('urgent-btn-mobile').classList.remove('choosePriorityPicked');
    }
}

/**
 * resets priority button "medium"
 */
function resetBtnClickedMedium() {
    document.getElementById('medium-btn').classList.remove('choosePriorityPicked');
    document.getElementById('medium-btn').classList.remove('medium');
    if (document.getElementById('medium-btn-mobile')) {  //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById('medium-btn-mobile').classList.remove('medium');
        document.getElementById('medium-btn-mobile').classList.remove('choosePriorityPicked');
    }
}

/**
 * resets priority button "low"
 */
function resetBtnClickedLow() {
    document.getElementById('low-btn').classList.remove('choosePriorityPicked');
    document.getElementById('low-btn').classList.remove('low');
    if (document.getElementById('low-btn-mobile')) {  //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById('low-btn-mobile').classList.remove('low');
        document.getElementById('low-btn-mobile').classList.remove('choosePriorityPicked');
    }
}

function priorityBtnClicked(selectedPriority) {
    document.getElementById(`${selectedPriority}-btn`).classList.add('choosePriorityPicked');
    document.getElementById(`${selectedPriority}-btn`).classList.add(`${selectedPriority}`);
    if (document.getElementById(`${selectedPriority}-btn-mobile`)) {  //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById(`${selectedPriority}-btn-mobile`).classList.add(`${selectedPriority}`);
        document.getElementById(`${selectedPriority}-btn-mobile`).classList.add('choosePriorityPicked');
    }
}

/*
/**
 * highlights priority button "urgent" when selected
 */
function urgentBtnclicked() {
    document.getElementById('urgent-btn').classList.add('choosePriorityPicked');
    document.getElementById('urgent-btn').style = 'background-color: red;';
    if (document.getElementById('urgent-btn-mobile')) {  //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById('urgent-btn-mobile').style = 'background-color: red;';
        document.getElementById('urgent-btn-mobile').classList.add('choosePriorityPicked');
    }
}

/**
 * highlights priority button "medium" when selected
 */
function mediumBtnclicked() {
    document.getElementById('medium-btn').classList.add('choosePriorityPicked');
    document.getElementById('medium-btn').style = 'background-color: orange;';
    if (document.getElementById('medium-btn-mobile')) {  //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById('medium-btn-mobile').style = 'background-color: orange;';
        document.getElementById('medium-btn-mobile').classList.add('choosePriorityPicked');
    }
}

/**
 * highlights priority button "low" when selected
 */
function lowBtnclicked() {
    document.getElementById('low-btn').classList.add('choosePriorityPicked');
    document.getElementById('low-btn').style = 'background-color: green;';
    if (document.getElementById('low-btn-mobile')) {  //checks if mobile is extra (in add Task Template no -mobile IDs)
        document.getElementById('low-btn-mobile').style = 'background-color: green;';
        document.getElementById('low-btn-mobile').classList.add('choosePriorityPicked');
    }
}

/**
 * checks if a contacts has been assigned to do the task by the user
 * @type {Array} contactsSelection - all contacts user could have chosen from to assign (destop)
 * @type {Array} contactsSelectionMobile - all contacts user could have chosen from to assign (mobile)
 */
function checkAssignedTo() {
    let contactsSelection = Array.from(document.getElementsByClassName('input-contact'));
    let contactsSelectionMobile = Array.from(document.getElementsByClassName('input-contact-mobile'));
    contactsSelection.forEach(contact => {
        if (contact.checked) {
            contactAssigned = true;
        }
    });
    contactsSelectionMobile.forEach(contact => {
        if (contact.checked) {
            contactAssigned = true;
        }
    });
}

/**
 * checks if user gave all input to create a task
 */
async function checkTaskToCreate() {
    checkAssignedTo();
    if (selectedPriority && contactAssigned && selectedCategory) {
        await createTask();
    } else {
        alert('Please make sure to select a priority, a category and to assign a contact!');
    }
}

/**
 * displays assigned contacts
 */
function displayAssignedContacts(){
    let assignedContacts = getAssignedContacts();
    document.getElementById('assignedContactsDiv').innerHTML = '';
    assignedContacts.forEach(contact => {
        document.getElementById('assignedContactsDiv').innerHTML += assignedContactsDivContact(contact)
    });
    if(document.getElementById('assignedContactsDivMobile')){
        document.getElementById('assignedContactsDivMobile').innerHTML = '';
    assignedContacts.forEach(contact => {
        document.getElementById('assignedContactsDivMobile').innerHTML += assignedContactsDivContact(contact)
    });
    }
}

function assignedContactsDivContact(contact) {
    let lettersContactCircle = getInitials(contact['name']);
    return `<span class="contributors-circle-addtask" style="background-color: ${contact['bg-color']}">${lettersContactCircle}</span>`;
}

/**
 * creates the task and updates tasks array and backend,
 * then resets all inputs made by the user in the form,
 * then sends user to board,
 * 
 * if task is created in template in board.html, it updates all the taskarrays and closes templateoverlay to show all
 * tasks in the usual board overview
 */
async function createTask() {
    if (document.getElementById('input-title').value != '') {
        await saveTask();
    } else {
        await saveTaskMobile();
    }
    clearTask();
    if (document.getElementById('tasks-inprogress-mobile')) { // checks, if task is created in template in board.html
        resetArrays();
        declareArrays();
        renderTasks();
        hideAddTask();
        showSuccessMessage();
    } else {
        window.location.href = 'board.html';
    }
    localStorage.setItem('taskJustCreated', 'true');
}

/**
 * function clears all input the user made and resets taskpage aswall as templates
 * @type {string} statusTaskOnCreate - status of the task (todo, progress, feedback, done) by default its todo
 */
function clearTask() {
    document.getElementById('input-title').value = '';
    document.getElementById('input-description').value = '';
    document.getElementById('select-category').selectedIndex = 0;
    document.getElementById('assign-to-list').classList.remove('visible');
    document.getElementById('selected-category-colorDiv').style = `background-color: white`;
    document.getElementById('assignedContactsDiv').innerHTML = '';
    clearAssignedContacts();
    contactAssigned = false;
    selectedPriority = false;
    selectedCategory = null;
    statusTaskOnCreate = 'todo';
    document.getElementById('input-date').value = '';
    unsetBtnClicked();
    if (document.getElementById('low-btn-mobile')) { //checks if mobile is extra (in add Task Template no -mobile IDs)
        clearTaskMobile();
    }
}

/**
 * uncheck all checked contacts
 */
function clearAssignedContacts() {
    let contactsSelection = Array.from(document.getElementsByClassName('input-contact'));
    contactsSelection.forEach(contact => {
        contact.checked = false;
    });
    let contactsSelectionMobile = Array.from(document.getElementsByClassName('input-contact-mobile'));
    contactsSelectionMobile.forEach(contact => {
        contact.checked = false;
    });
}

/**
 * upload and save Task in database (desktop)
 */
async function saveTask() {
    let task = {
        'id': tasks.length,
        'title': document.getElementById('input-title').value,
        'description': document.getElementById('input-description').value,
        'category': selectedCategory,
        'assigned-contacts': getAssignedContacts(),
        'due-date': document.getElementById('input-date').value,
        'priority': selectedPriority,
        'status': statusTaskOnCreate
    }
    tasks.push(task);
    await backend.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Get the actual date 
 */
function getActualDate() {
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth() + 1; //January is 0!
    var yyyy = today.getFullYear();

    if (dd < 10) {
        dd = '0' + dd;
    }

    if (mm < 10) {
        mm = '0' + mm;
    }

    today = yyyy + '-' + mm + '-' + dd;
    document.getElementById("input-date").setAttribute("min", today);
}