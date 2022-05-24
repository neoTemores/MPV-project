

let loginButton = document.querySelector('#loginButton')
loginButton.addEventListener('click', login)

let passwordBox = document.querySelector('#password')
passwordBox.addEventListener('keypress', (e) => {
    if (e.key == 'Enter') { return login() }
})

function login() {
    let inputUserName = document.querySelector('#username')
    let inputPassword = document.querySelector('#password')
    // https://project-howler.herokuapp.com/api/users
    fetch('https://project-howler.herokuapp.com/api/users')
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
        return signUpMessage("Error: Passwords do not match!")
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
            return signUpMessage("Error: That Username is already taken!")
        }
    }

    let accountCreationData = {
        firstName: signUpfirstName.value,
        lastName: signUplastName.value,
        userName: desiredUserName.value,
        email: signUpemail.value,
        password: password.value
    }

    fetch('http://localhost:8000/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountCreationData),
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => { console.error(error); })

    signUpMessage('Account successfuly created! Please sign in')

    ///? split into diff function???
    let signUpMsg = document.querySelector('#signUpErrors')
    let goBackToSignInButton = document.createElement('button')
    goBackToSignInButton.id = 'goBackToSignInButton'
    goBackToSignInButton.textContent = "Go back to sign in"
    goBackToSignInButton.addEventListener('click', () => {
        window.location.reload();
    })
    signUpMsg.appendChild(goBackToSignInButton)

}

function signUpMessage(msg) {
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
    resultContainer.textContent = ""

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
    resultContainer.textContent = ""

    for (let i = 0; i < data.length; i++) {
        console.log(data[i].user_name);
        let div = document.createElement('div')
        div.textContent = data[i].email;
        resultContainer.appendChild(div)
    }
}
