/**
 * each contact in contactsSorted gets displayed in an li HTMLElement with an inputfield to uncheck and check this contact (for mobileversion)
 * (checked contacts are getting assigned to the task)
 */
function renderContactsMobile() {
    document.getElementById('contacts-to-assign-mobile').innerHTML = '';
    for (let i = 0; i < contactsSorted.length; i++) {
        document.getElementById('contacts-to-assign-mobile').innerHTML += `
        <li class="input-contact-listitem-mobile" onclick="assignContactOnClick(${i})" style="background-color: ${contactsSorted[i]['bg-color']};" value="${[i]}"><input onclick="stopPropagationInput(event)" class="input-contact-mobile" id="input-contact-mobile${i}"
            type="checkbox" style="margin-right: 42px" />${contactsSorted[i]['name']}</li>
        `;
    }
}


/**
 * checks from the li HTMLElements from renderContactsMobile() which ones are checked and collects all assigned contacts in an array, which will be returned (for mobileversion)
 * @returns {Array} assignedContacts - array with all contacts assigned to the tasks
 */
function getAssignedContactsMobile() {
    let assignedContacts = [];
    let counter = 0;
    let contactsSelection = Array.from(document.getElementsByClassName('input-contact-mobile'));
    contactsSelection.forEach(contact => {
        if (contact.checked) {
            assignedContacts.push(contactsSorted[counter]);
        }
        counter++;
    });
    return assignedContacts;
}

/**
 * each category in categories gets displayed in an <option> HTMLElement(gets it from categoriesDropdowntemplate()) to select a category (for mobileversion)
 * when on <option> "create a new category" selected, user can create new category
 * (selected category is the tasks category then)
 */
function renderCategoriesMobile() {
    document.getElementById('select-category-mobile').innerHTML = '';
    document.getElementById('select-category-mobile').innerHTML = `
        <option disabled selected style="background-color:grey;">Select task category</option>
        <option style="color: black;">Create a new Category</option>
    `;
    categories.forEach(category => {
        document.getElementById('select-category-mobile').innerHTML += categoriesDropdownTemplate(category);
    });
}

/**(mobileversion)
 * gets called when a category is selected
 * if first <option> selected (create category) create new category div is shown and select HTMLElement is removed from display, else
 * selected category for the task is shown as selected
 * 
 */
function showAddCategoryMobile() {
    let selectedIndex = document.getElementById('select-category-mobile').selectedIndex;
    if (selectedIndex === 1) {
        document.getElementById('select-category-mobile').classList.add('d-none');
        document.getElementById('create-category-mobile').classList.remove('d-none');
        document.getElementById('selected-category-colorDiv-mobile').classList.add('d-none');
    } else {
        selectedCategory = categories[selectedIndex - 2];
        document.getElementById('selected-category-colorDiv-mobile').style = `background-color: ${selectedCategory['color']}`;
    }
}


/**(mobile)
 * gets called when user wants to create new Category,
 * checks if user gave all needed information, else alert
 */
function checkNewCategoryMobile() {
    if (selectedColor && document.getElementById('new-category-mobile').value != '') {
        createNewCategoryMobile();
    } else {
        alert('Please insert a categoryname and a color!');
    }
    selectedColor = null;
}

/** (mobile)
 * creates new category object with a name and a color and adds it to aray of all categories, also updates
 * categories array in backend, then cleares and closes add category div
 */
async function createNewCategoryMobile() {
    let category = {
        'name': document.getElementById('new-category-mobile').value,
        'color': selectedColor
    }
    categories.push(category);
    await backend.setItem('categories', JSON.stringify(categories));
    selectedCategory = categories[categories.length - 1];
    document.getElementById('selected-category-colorDiv-mobile').style = `background-color: ${categories[categories.length - 1]['color']}`;
    dismissCategoryMobile();
    renderCategoriesMobile();
    renderCategories();
    document.getElementById('select-category-mobile').value = selectedCategory['name'];
    document.getElementById('selected-category-colorDiv-mobile').classList.remove('d-none');
}

/** (mobile)
 * clears all inputs and selections made by user on create new category 
 * gets called when user dismisses or category has been succesfully created
 * 
 */
function dismissCategoryMobile() {
    document.getElementById('new-category-mobile').value = '';
    for (let i = 1; i < 8; i++) {
        document.getElementById(`color${i}-mobile`).classList.remove('selected-color');
    }
    document.getElementById('select-category-mobile').classList.remove('d-none');
    document.getElementById('create-category-mobile').classList.add('d-none');
    if (selectedCategory) {
        document.getElementById('select-category-mobile').value = selectedCategory['name'];
        document.getElementById('selected-category-colorDiv-mobile').classList.remove('d-none');
    }
    selectedColor = null;
}


/**
 * function clears task mobileversion specificly
 */
function clearTaskMobile() {
    document.getElementById('input-title-mobile').value = '';
    document.getElementById('input-description-mobile').value = '';
    document.getElementById('select-category-mobile').selectedIndex = 0;
    document.getElementById('assign-to-list-mobile').classList.remove('visible');
    document.getElementById('input-date-mobile').value = '';
    document.getElementById('selected-category-colorDiv-mobile').style = `background-color: white`;
}



/**
 * upload and save Task in database (mobile)
 */
async function saveTaskMobile() {
    let task = {
        'id': tasks.length,
        'title': document.getElementById('input-title-mobile').value,
        'description': document.getElementById('input-description-mobile').value,
        'category': selectedCategory,
        'assigned-contacts': getAssignedContactsMobile(),
        'due-date': document.getElementById('input-date-mobile').value,
        'priority': selectedPriority,
        'status': statusTaskOnCreate
    }
    tasks.push(task);
    await backend.setItem('tasks', JSON.stringify(tasks));
}
