let contacts = [];
let alphabetList = [];
let sortedAlphabetList = [];
let activeContact;
let lastAddedContact;

/**
 * Read informations from display and implement to contacts-array
 * 
 * 
 */
function addNewContact() {
    let name = document.getElementById('contact-name');
    let email = document.getElementById('contact-email');
    let phone = document.getElementById('contact-phone');
    let randomColor = getRandomColor();
    let contact = {'name': name.value,'email': email.value,'phone': phone.value,'bg-color': randomColor}
    lastAddedContact = contact['name'];
    name.value = '';
    email.value = '';
    phone.value = '';
    contacts.push(contact);
    flyOutContact();
    pushAllContacts();
    checkContacts();
    showNewContact();
}

/**
 * Show the contact, which has been created
 * 
 * 
 */
function showNewContact() {
    document.getElementById('complete-contact').classList.remove('d-none');
    let placeInArray = findJSONInArray();

    activeContact = placeInArray;

    contactName = contacts[placeInArray]['name'];
    contactEmail = contacts[placeInArray]['email'];
    contactPhone = contacts[placeInArray]['phone'];
    let initials = getInitials(contactName);

    showThisContactInfos(contactName, contactEmail, contactPhone, initials);
}

/**
 * Find the right JSON in the contacts-array
 * 
 * 
 * @returns {number} - returns the place of the JSON in the array
 */
function findJSONInArray() {
    let i = -1;
    var index = contacts.findIndex(function (item, i) {
        return item.name === lastAddedContact
    });
    return index;
}

/**
 * Push the next letter into backend
 * 
 */
function pushAllContacts() {
    backend.setItem('contact', JSON.stringify(contacts));
}

/**
 * Create parameters the next functions need
 * 
 * 
 */
function checkContacts() {
    for (let i = 0; i < contacts.length; i++) {
        let thisContact = contacts[i];
        contactName = thisContact['name'];

        let firstLetter = getFirstLetter(contactName);

        checkAlphabetBox(firstLetter);
    }
    sortAlphabetList();
    createAlphabetBox();
    renderContacts();
    
}

/**
 * Check if the letter for alphabet-boxes already exists and if not, push him to array[alphabetList]
 * 
 * @param {string} firstLetter - The first letter of the name of the contact
 */
function checkAlphabetBox(firstLetter) {
    if (!alphabetList.includes(firstLetter)) {
        alphabetList.push(firstLetter)
    }
}

/**
 * Sort the letters in alphabetList by alphabet
 * 
 * 
 */
function sortAlphabetList() {
    alphabetList.sort();
    sortedAlphabetList = [];

    for (let i = 0; i < alphabetList.length; i++) {
        let letter = alphabetList[i];
        sortedAlphabetList.push(letter);
    }
}

/**
 * Create the contact-boxes with the right letters, where the contacts gets inserted
 * 
 * 
 */
function createAlphabetBox() {
    let contactList = document.getElementById('all-contacts');

    contactList.innerHTML = '';

    for (let i = 0; i < sortedAlphabetList.length; i++) {
        let letter = sortedAlphabetList[i];

        contactList.innerHTML += generateLetterBox(letter);
    }
}

/**
 * Return the html code for the boxes
 * 
 * @param {string} letter - The letter, the box will be created with
 * @returns {HTMLElement} - Returns letter-boxes with the right letter
 */
function generateLetterBox(letter) {
    return `
    <div class="alphabet-box">
        <div class="first-letter-box">
            <h3>${letter}</h3>
        </div>

        <div class="line"></div>

        <div style="width: 100%;" id="single-contact${letter}"></div>

    </div>`;
}


/**
 * Render all contacts to the list
 * 
 * 
 */
function renderContacts() {
    contacts.sort(sortContacts('name'));

    for (let i = 0; i < contacts.length; i++) {
        let thisContact = contacts[i];
        contactName = thisContact['name'];
        contactEmail = thisContact['email'];
        contactPhone = thisContact['phone'];

        let firstLetter = getFirstLetter(contactName);
        let initials = getInitials(contactName);

        document.getElementById('single-contact' + firstLetter).innerHTML += generateSingleContacts(i, contactName, contactEmail, contactPhone, initials);
        document.getElementById('initials' + i).style.backgroundColor = contacts[i]['bg-color'];
    }
}

/**
 * Render all contacts to the list
 * 
 * @param {number} i - Number of the selected contact
 * @param {string} contactName - Name of the contact
 * @param {string} contactEmail - Email-adress of the contact
 * @param {string} contactPhone - Phone-number of the contact
 * @param {string} initials - The first letters of the parts of name of the contact
 * @returns {HTMLElement} - Returns the HTML to create contacts
 */
function generateSingleContacts(i, contactName, contactEmail, contactPhone, initials) {
    return `
    <div id="single-contact${i}" onclick="openSingleContact(), setActiveUser(${i}), showThisContactInfos('${contactName}', '${contactEmail}', ${contactPhone}, '${initials}')" class="single-contact">
                            <div id="initials${i}" class="initials">${initials}</div>
                            <div class="name-email">
                                <div class="name-small">${contactName}</div>
                                <div class="email-small">${contactEmail}</div>
                            </div>
                        </div>`;
}

/**
 * Set active-user
 * 
 */
function setActiveUser(i){
    activeContact = i;
}

/**
 * Show the empty screen after loading 
 * 
 */
function showEmptyContact() {
    document.getElementById('complete-contact').classList.add('d-none');
}


/**
 * Sort the contacts by its names 
 * 
 * @param {string} contactName - Name of the contact
 * @returns {number} - Returns the number to sort the letters
 * 
 */
function sortContacts(contactName) {
    return function (a, b) {
        if (a[contactName] > b[contactName]) {
            return 1;
        } else if (a[contactName] < b[contactName]) {
            return -1;
        }
        return 0;
    }
}

/**
 * Get the first letters of all names 
 * 
 * @param {string} name - Name of the contact
 * @returns {string} - Returns the initials
 */
function getInitials(name) {
    let parts = name.split(' ');
    let initials = '';
    for (let i = 0; i < parts.length; i++) {
        if (parts[i].length > 0 && parts[i] !== '') {
            initials += parts[i][0]
        }
    }
    return initials;
}

/**
 * Get the first letter
 * 
 * @param {string} name - Name of the contact
 * @returns {string} - Returns the first letter
 */
function getFirstLetter(name) {
    return name.charAt(0);
}

/**
 * Get a random color
 * 
 * @returns {string} - Returns a random color
 * 
 */
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}


/**
 * Delete contacts
 * 
 * 
 */

async function deleteUser() {
    await backend.deleteItem('contact',);
}

/**
 * Get data for other functions
 * 
 * @param {string} name - Name of the contact
 * @param {string} email - Email-adress of the contact
 * @param {string} phone - Phone-number of the contact
 * @param {string} initials - The first letters of the parts of name of the contact
 */
function dataForShowInfo(){
    let name = contacts[activeContact]['name'];
    let email = contacts[activeContact]['email'];
    let phone = contacts[activeContact]['phone'];
    let initials = getInitials(name);

    showThisContactInfos(name, email, phone, initials);
}

/**
 * Show the contact on big screen you clicked on 
 * 
 * 
 * @param {string} contactEmail - Email-adress of the contact
 * @param {string} contactPhone - Phone-number of the contact
 * @param {string} initials - The first letters of the parts of name of the contact
 * @param {string} activeContact - Actual contact showed by details on big screen
 */
function showThisContactInfos(contactName, contactEmail, contactPhone, initials) {
        resetBGColor();

        document.getElementById('bigContactInitials').innerHTML = initials;
        document.getElementById('bigContactName').innerHTML = contactName;
        document.getElementById('bigContactEmail').innerHTML = contactEmail;
        document.getElementById('bigContactPhone').innerHTML = contactPhone;
        document.getElementById('bigInitials').style.backgroundColor = contacts[activeContact]['bg-color'];
        document.getElementById('addTask-button-contacts').setAttribute("onclick", `showAddTaskContactlist('${contactName}')`);

        changeColorBG(activeContact);
}

/**
 * Reset the color of the contact background in the contactlist
 * 
 * 
 */
function resetBGColor(){
    for (let j = 0; j < contacts.length; j++) {
        document.getElementById('single-contact'+j).style.backgroundColor = "rgb(255, 255, 255)";
        document.getElementById('single-contact'+j).style.color = "black";
    }
}

/**
 * Change the color of the contact background in the contactlist
 * 
 * @param {number} i - Number of the contacts-place in the array
 */
function changeColorBG(i){
    document.getElementById('single-contact'+i).style.backgroundColor = "rgb(42, 54, 71)";
    document.getElementById('single-contact'+i).style.color = "white";
}

/**
 * Edit contact infos after creating
 * 
 * 
 * 
 */
function editContact() {
    let newName = document.getElementById('edit-name');
    let newEmail = document.getElementById('edit-email');
    let newPhone = document.getElementById('edit-phone');
    contacts[activeContact]['name'] = newName.value;
    contacts[activeContact]['email'] = newEmail.value;
    contacts[activeContact]['phone'] = newPhone.value;
    pushAllContacts();
    checkContacts();
    flyOutContact();
    dataForShowInfo();
    newName.value = '';
    newEmail.value = '';
    newPhone.value = '';
}

/**
 * Change the contact-color 
 * 
 * 
 */
function changeContactColor() {
    contacts[activeContact]['bg-color'] = getRandomColor();

    let name = contacts[activeContact]['name'];
    let email = contacts[activeContact]['email'];
    let phone = contacts[activeContact]['phone'];
    let initials = getInitials(name);

    pushAllContacts();
    checkContacts();
    showThisContactInfos(name, email, phone, initials);
    updateColorContactsinTasks();
}

/**
 * Update the color of the assigned contacts depending on the colorchange in the contactsection
 * 
 * 
 */
async function updateColorContactsinTasks() {
    tasks.forEach(task => {
        let updatedContactsArray = [];
        task['assigned-contacts'].forEach(contactAssigned => {
            contacts.forEach(contact => {
                if (contact['name'] === contactAssigned['name']) {
                    updatedContactsArray.push(contact);
                }
            });
        });
        task['assigned-contacts'] = updatedContactsArray;
    });
    await backend.setItem('tasks', JSON.stringify(tasks));
}