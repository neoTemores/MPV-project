

let button = document.querySelector('#names')

button.addEventListener('click', () => {
    fetch('http://localhost:8000/api/users')
        .then(response => response.json())
        .then(data => displayUser(data));
})

function displayUser(data) {

    let resultContainer = document.querySelector('#resultContainer')
    resultContainer.innerHTML = ""

    for (let i = 0; i < data.length; i++) {
        console.log(data[i].user_name);
        let div = document.createElement('div')
        div.textContent = data[i].user_name;
        resultContainer.appendChild(div)
    }
}

let button2 = document.querySelector('#emails')
button2.addEventListener('click', () => {
    fetch('http://localhost:8000/api/users')
        .then(response => response.json())
        .then(data => displayEmails(data));
})

function displayEmails(data) {

    let resultContainer = document.querySelector('#resultContainer')
    resultContainer.innerHTML = ""

    for (let i = 0; i < data.length; i++) {
        console.log(data[i].user_name);
        let div = document.createElement('div')
        div.textContent = data[i].email;
        resultContainer.appendChild(div)
    }
}
