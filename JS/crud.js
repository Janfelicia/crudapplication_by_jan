//Set up refernces to the foem and table element
document.addEventListener("DOMContentLoaded", initialization);

let contacts = [];
let contactId = 1;
let contactTable;

//Getting contacts form and table
function initialization(){
    const contactForm = document.getElementById('contactForm');

    contactTable = document.getElementById('contactTable').getElementsByTagName('tbody')[0];

    //loading contacts from local storage
    contacts = JSON.parse(localStorage.getItem('contacts')) || [];
    //Setting Id
    contactId = contacts.length > 0 ? contacts[contacts.length - 1].id + 1 : 1;

    //To contacts form submit
    contactForm.addEventListener('submit', handleFromSubmit);
    //Display the contacts in the table
    renderContacts(contactTable);
}

//Input values when the form is submit (handle the new contact)
function handleFromSubmit(event){
    event.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const email = document.getElementById('email').value.trim();
    
    if (name && email) {
        //Generated date 
        const now = new Date();
        const dateString = now.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });

        //Create new object
        const newContact = { id: contactId++, name, phone, email, date: dateString };
        contacts.push(newContact);
        saveContacts();
        renderContacts();
        clearForm();
    } else {
        alert('Please fill out all fields.');
    }
}

//Update the table with contact row
function renderContacts(){
    //Clearing exist contacts
    contactTable.innerHTML = '';
    //Iterates over each contact
    contacts.forEach((contact, index) => {
        //Create new row
        const newRow = `
            <tr id="contact-${contact.id}">
                <td>${index + 1}</td>
                <td><span class="view-mode">${contact.name}</span>
                    <input 
                        class="edit-mode" 
                        type="text" 
                        value="${contact.name}" 
                        style="display:none;">
                </td>

                <td><span class="view-mode">${contact.phone}</span>
                    <input 
                        class="edit-mode" 
                        type="text" 
                        value="${contact.phone}" 
                        style="display:none;">
                </td>

                <td><span class="view-mode">${contact.email}</span>
                    <input 
                        class="edit-mode" 
                        type="text" 
                        value="${contact.email}" 
                        style="display:none;">
                </td>

                <td>${contact.date}</td>

                <td>
                    <button 
                        type="button" 
                        class="btn btn-primary btn-sm edit-btn" 
                        onclick="editContact(${contact.id})">
                        Edit
                    </button>

                    <button 
                        type="button" 
                        class="btn btn-success btn-sm save-btn" 
                        onclick="saveContact(${contact.id})" 
                        style="display:none;">
                        Update
                    </button>

                    <button 
                        type="button" 
                        class="btn btn-danger btn-sm" 
                        onclick="removeContact(${contact.id})">
                        Delete
                    </button>
                </td>
            </tr>
        `;
        //insert new row
        contactTable.insertAdjacentHTML('beforeend', newRow);
    });
}

//Store the contacts
function saveContacts(){
    localStorage.setItem('contacts', JSON.stringify(contacts));
}

//Clearing the input fields
function clearForm(){
    document.getElementById('name').value = '';
    document.getElementById('phone').value = '';
    document.getElementById('email').value = '';
}

//Edit contacts
function editContact(id){
    const row = document.getElementById(`contact-${id}`);

    row.querySelectorAll('.view-mode').forEach(el => el.style.display = 'none');
    row.querySelectorAll('.edit-mode').forEach(el => el.style.display = 'inline');
    row.querySelector('.edit-btn').style.display = 'none';
    row.querySelector('.save-btn').style.display = 'inline';
}

//Update contacts
function saveContact(id){
    const row = document.getElementById(`contact-${id}`);
    const name = row.querySelectorAll('.edit-mode')[0].value.trim();
    const phone = row.querySelectorAll('.edit-mode')[1].value.trim();
    const email = row.querySelectorAll('.edit-mode')[2].value.trim();
    
    if (name && email) {
        const index = contacts.findIndex(contact => contact.id === id);
        if (index !== -1) {
            contacts[index].name = name;
            contacts[index].phone = phone;
            contacts[index].email = email;
            const now = new Date();
            contacts[index].date = now.toLocaleDateString('en-US', { year: 'numeric', month: 'numeric', day: 'numeric' });
            saveContacts();
            renderContacts();
        }
    } else {
        alert('Please fill out all fields.');
    }
}

//Delete contacts
function removeContact(id){
    const index = contacts.findIndex(contact => contact.id === id);

    if (index !== -1) {
        contacts.splice(index, 1);
        saveContacts();
        renderContacts();
    }
}
