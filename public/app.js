

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


let loginButton = document.querySelector('#loginButton')
loginButton.addEventListener('click', login)

function login() {
    let inputUserName = document.querySelector('#username')
    console.log(inputUserName.value);
    let inputPassword = document.querySelector('#password')
    console.log(inputPassword.value);

    fetch('http://localhost:8000/api/users')
        .then(response => response.json())
        .then(data => authenticate(data))

    for (let i = 0; i < data.length; i++) {
        const element = data[i];

    }



    // let homePage = document.querySelector('#homePage')
    // homePage.classList.remove('hide')

    // let loginPage = document.querySelector('#loginPage')
    // loginPage.classList.add('hide')
}

function authenticate(data) {

}