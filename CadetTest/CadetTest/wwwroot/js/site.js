const uri = 'api/Consents';
let consents = [];

async function displayConsents() {
    if (localStorage.getItem('token') == null) {
        await loginUser('User-5E638711-2D64-47B0-A8F5-1C5A9EADA966', 'Pass-E4A679C7-2F4B-40AE-9DC8-C967EF7215AE');
    }
    
    for (let i = 991; i > 0; i -= 10) {
        tenConsents = await getTheNextTenConsents(i);
        displayTenItems(tenConsents);
    }
}

async function getTheNextTenConsents(startId) {
    return await fetch('https://localhost:44338/api/Consents', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
            'startId': startId,
            'count': 10
        })
    })
        .then((response) => response.json())
        .then((data) => {
            data.forEach(item => {
                consents.push(item);
            });
            return data;
        })
        .catch(error => console.error('Unable to get items.', error));
}

function displayTenItems(data) {
    data.sort((a, b) => b.id - a.id);

    const tBody = document.getElementById('consents');
    const button = document.createElement('button');

    data.forEach(item => {
        let IdTd = document.createElement('td');
        IdTd.innerText = item.id;

        let RecipientTd = document.createElement('td');
        RecipientTd.innerText = item.recipient;

        let RecipientTypeTd = document.createElement('td');
        RecipientTypeTd.innerText = item.recipientType;

        let StatusTd = document.createElement('td');
        StatusTd.innerText = item.status;

        let TypeTd = document.createElement('td');
        TypeTd.innerText = item.type;

        let editButton = button.cloneNode(false);
        editButton.className = 'btn btn-primary';
        editButton.innerText = 'Güncelle';
        editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

        let deleteButton = button.cloneNode(false);
        deleteButton.className = 'btn btn-danger'
        deleteButton.innerText = 'Sil';
        deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

        let editTd = document.createElement('td');
        editTd.appendChild(editButton);

        let deleteTd = document.createElement('td');
        deleteTd.appendChild(deleteButton);

        let tr = tBody.insertRow();

        tr.appendChild(IdTd);
        tr.appendChild(RecipientTd);
        tr.appendChild(RecipientTypeTd);
        tr.appendChild(StatusTd);
        tr.appendChild(TypeTd);
        tr.appendChild(editTd);
        tr.appendChild(deleteTd);
    });

    let tr = tBody.insertRow();
    let td = tr.insertCell(0);
    td = tr.insertCell(1);
    td.innerHTML = new Date().toLocaleTimeString();
}

async function getTheMaxId() {
    return fetch(`${uri}/GetMaxId`)
        .then(response => response.json())
        .then(data => data)
        .catch(error => console.error('Unable to get the max id', error));
}

function addConsent() {
    const consent = {
        recipient: document.getElementById('add-recipient').value.trim(),
        recipientType: document.getElementById('add-recipient-type').value.toUpperCase().trim(),
        status: document.getElementById('add-status').value.toUpperCase().trim(),
        type: document.getElementById('add-type').value.toUpperCase().trim()
    };
    
    fetch(`${uri}/Add`, {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(consent)
    })
        .then(response => response.json())
        .then(res => {
            consents.push(res);
            toggleAddConsentForm();
            clearTable();
            displayItems(consents)
        })
        .catch(error => console.error('Unable to add item.', error));
}

function deleteItem(id) {
    fetch(`${uri}/${id}`, {
        method: 'DELETE',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then(res => {
            consents = consents.filter(item => item.id !== res.id);
            clearTable();
            displayItems(consents);
        })
        .catch(error => console.error('Unable to delete item.', error));
}

function clearTable() {
    const tBody = document.getElementById('consents');
    while (tBody.hasChildNodes()) {
        tBody.removeChild(tBody.lastChild);
    }
}

function displayEditForm(id) {
    const item = consents.find(item => item.id === id);

    document.getElementById('edit-id').value = item.id;
    document.getElementById('edit-recipient').value = item.recipient
    document.getElementById('edit-recipient-type').value = item.recipientType.toUpperCase();
    document.getElementById('edit-status').value = item.status.toUpperCase();
    document.getElementById('edit-type').value = item.type.toUpperCase();
    document.getElementById('editForm').style.display = 'block';
}

function updateItem() {
    const consentId = document.getElementById('edit-id').value;
    const consent = {
        id: parseInt(consentId, 10),
        recipient: document.getElementById('edit-recipient').value.trim(),
        recipientType: document.getElementById('edit-recipient-type').value.toUpperCase().trim(),
        status: document.getElementById('edit-status').value.toUpperCase().trim(),
        type: document.getElementById('edit-type').value.toUpperCase().trim()
    };

    fetch(`${uri}/${consentId}`, {
        method: 'PUT',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(consent)
    })
        .then(response => response.json())
        .then(res => {
            const index = consents.findIndex(item => item.id === res.id);
            consents[index] = res;
            clearTable();
            clearTable()
            displayItems(consents)
        })
        .catch(error => console.error('Unable to update item.', error));

    closeInput();

    return false;
}

function closeInput() {
    document.getElementById('editForm').style.display = 'none';
}

function displayItems(data) {
    data.sort((a, b) => a.id - b.id);
    
    const tBody = document.getElementById('consents');
    const button = document.createElement('button');

    for (let i = 0; i < data.length; i += 10) {
        for (let j = data.length - i - 1; j > data.length - i - 11; j--) {
            if (j < 0) { break; }
            item = data[j];

            let IdTd = document.createElement('td');
            IdTd.innerText = item.id;

            let RecipientTd = document.createElement('td');
            RecipientTd.innerText = item.recipient;

            let RecipientTypeTd = document.createElement('td');
            RecipientTypeTd.innerText = item.recipientType;

            let StatusTd = document.createElement('td');
            StatusTd.innerText = item.status;

            let TypeTd = document.createElement('td');
            TypeTd.innerText = item.type;

            let editButton = button.cloneNode(false);
            editButton.className = 'btn btn-primary';
            editButton.innerText = 'Güncelle';
            editButton.setAttribute('onclick', `displayEditForm(${item.id})`);

            let deleteButton = button.cloneNode(false);
            deleteButton.className = 'btn btn-danger'
            deleteButton.innerText = 'Sil';
            deleteButton.setAttribute('onclick', `deleteItem(${item.id})`);

            let editTd = document.createElement('td');
            editTd.appendChild(editButton);

            let deleteTd = document.createElement('td');
            deleteTd.appendChild(deleteButton);

            let tr = tBody.insertRow();

            tr.appendChild(IdTd);
            tr.appendChild(RecipientTd);
            tr.appendChild(RecipientTypeTd);
            tr.appendChild(StatusTd);
            tr.appendChild(TypeTd);
            tr.appendChild(editTd);
            tr.appendChild(deleteTd);
        }

        let tr = tBody.insertRow();
        let td = tr.insertCell(0);
        td = tr.insertCell(1);
        td.innerHTML = new Date().toLocaleTimeString();
    }
}

const btn = document.getElementById('displayAddConsentForm');
btn.addEventListener('click', () => toggleAddConsentForm());

function toggleAddConsentForm() {
    const form = document.getElementById('addForm');

    if (form.style.display === 'none') {
        form.style.display = 'block';
    } else {
        form.style.display = 'none';
    }
}

function loginUser(username, password) {
    fetch('https://localhost:44338/api/User/authenticate', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            username: username,
            password: password
        })
    })
        .then(response => response.json())
        .then(res => {
            localStorage.setItem('token', res.jwtToken);
        })
        .catch(error => console.error('Unable to login.', error));

    if (username === "User-5E638711-2D64-47B0-A8F5-1C5A9EADA966") {
        btnUser1 = document.getElementById('user1');
        btnUser1.disabled = true;
        document.getElementById('username').innerHTML = 'User-5E638711-2D64-47B0-A8F5-1C5A9EADA966';

        btnUser2 = document.getElementById('user2');
        btnUser3 = document.getElementById('user3');
        btnUser4 = document.getElementById('user4');

        btnUser2.disabled = false;
        btnUser3.disabled = false;
        btnUser4.disabled = false;
    } else if (username === "User-1A30567E-C121-44DF-8008-BCEBEC01BF0A") {
        btnUser2 = document.getElementById('user2');
        btnUser2.disabled = true;
        document.getElementById('username').innerHTML = 'User-1A30567E-C121-44DF-8008-BCEBEC01BF0A';

        btnUser1 = document.getElementById('user1');
        btnUser3 = document.getElementById('user3');
        btnUser4 = document.getElementById('user4');

        btnUser1.disabled = false;
        btnUser3.disabled = false;
        btnUser4.disabled = false;
    } else if (username === "User-58076950-C311-4DD1-88DE-E682C164E3BE") {
        btnUser3 = document.getElementById('user3');
        btnUser3.disabled = true;
        document.getElementById('username').innerHTML = 'User-58076950-C311-4DD1-88DE-E682C164E3BE';

        btnUser1 = document.getElementById('user1');
        btnUser2 = document.getElementById('user2');
        btnUser4 = document.getElementById('user4');

        btnUser1.disabled = false;
        btnUser2.disabled = false;
        btnUser4.disabled = false;
    } else if (username === "User-DB42737F-6AAA-453C-A5E8-72EB5229C18C") {
        btnUser4 = document.getElementById('user4');
        btnUser4.disabled = true;
        document.getElementById('username').innerHTML = 'User-DB42737F-6AAA-453C-A5E8-72EB5229C18C';

        btnUser1 = document.getElementById('user1');
        btnUser2 = document.getElementById('user2');
        btnUser3 = document.getElementById('user3');

        btnUser1.disabled = false;
        btnUser2.disabled = false;
        btnUser3.disabled = false;
    }
    
    
}