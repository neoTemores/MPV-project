

let loginButton = document.querySelector('#loginButton')
loginButton.addEventListener('click', login)

let passwordBox = document.querySelector('#password')
passwordBox.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') { return login() }
})

function login() {
    let inputUserName = document.querySelector('#username')
    let inputPassword = document.querySelector('#password')

    fetch('http://localhost:8000/api/users')
        .then(response => response.json())
        .then(data => authenticate(data, inputUserName, inputPassword))
}

function authenticate(data, inputUserName, inputPassword) {
    let username = inputUserName.value
    let password = inputPassword.value

    for (let i = 0; i < data.length; i++) {
        if (data[i].user_name === username && data[i].password === password) {
            console.log('logged in');
            return showHomePage();
        }
    }
    return showSignUpMsg()
}

function showHomePage() {
    let homePage = document.querySelector('#homePage')
    homePage.classList.remove('hide')

    let loginPage = document.querySelector('#loginPage')
    loginPage.classList.add('hide')
}

function showSignUpMsg() {
    let signUpMessage = document.querySelector('#signUpMessage')
    signUpMessage.classList.remove('hide');
}

let signUpLink = document.querySelector('#signUpLink')
signUpLink.addEventListener('click', showSignUpPage);

function showSignUpPage() {
    let loginDisplay = document.querySelector('#loginDisplay');
    loginDisplay.classList.add('hide');

    let signUpPage = document.querySelector('#signUpPage');
    signUpPage.classList.remove('hide')
}

let signUpButton = document.querySelector('#signUpButton');
signUpButton.addEventListener('click', checkPassword);

let verifyPassword = document.querySelector('#verifyPassword')
verifyPassword.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') { return checkPassword() }
})

function checkPassword() {

    let desiredPassword = document.querySelector('#desiredPassword')
    let verifyPassword = document.querySelector('#verifyPassword')

    if (desiredPassword.value !== verifyPassword.value || desiredPassword.value.length === 0) {
        loginError("Error: Passwords do not match!")
    }

    fetch('http://localhost:8000/api/users')
        .then(response => response.json())
        .then(data => createAccount(data, verifyPassword))

}


function createAccount(data, password) {
    let signUpfirstName = document.querySelector('#signUpfirstName')
    let signUplastName = document.querySelector('#signUplastName');
    let desiredUserName = document.querySelector('#desiredUserName')
    let signUpemail = document.querySelector('#signUpemail')


    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        if (current.user_name === desiredUserName.value) {
            loginError("Error: That Username is already taken!")

        }
    }

    console.log(data);
    console.log(password.value);
}

function loginError(msg) {
    let signUpErrors = document.querySelector('#signUpErrors');
    signUpErrors.textContent = ""
    let passwordP = document.createElement('p')
    passwordP.textContent = msg
    return signUpErrors.appendChild(passwordP)
}





//! proof of concept =================================

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
