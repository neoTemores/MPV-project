listenForLogin();
function listenForLogin() {
    let loginButton = document.querySelector('#loginButton')
    loginButton.addEventListener('click', login)

    let passwordBox = document.querySelector('#password')
    passwordBox.addEventListener('keypress', (e) => {
        if (e.key == 'Enter') { return login() }
    })
}

let currentUser = {
    id: null,
    firstName: null,
    lastName: null,
    userName: null,
    email: null
}

async function login() {
    let inputUserName = document.querySelector('#username')
    let inputPassword = document.querySelector('#password')
    // https://project-howler.herokuapp.com/api/users
    await fetch('http://localhost:8000/api/users')
        .then(response => response.json())
        .then(data => authenticate(data, inputUserName, inputPassword))
        .catch(error => console.error(error))
}

function authenticate(data, inputUserName, inputPassword) {
    let username = inputUserName.value
    let password = inputPassword.value

    for (let i = 0; i < data.length; i++) {
        if (data[i].user_name === username && data[i].password === password) {
            currentUser.id = data[i].user_id;
            currentUser.firstName = data[i].first_name;
            currentUser.lastName = data[i].last_name;
            currentUser.userName = data[i].user_name;
            currentUser.email = data[i].email;

            return loadMainPage()
        }
    }
    return showSignUpMsg()
}

function loadMainPage() {
    showHomePage()
    fetchAllPosts()
    createNavPanel()
}

function showHomePage() {
    let homePageContainer = document.querySelector('#homePageContainer')
    homePageContainer.classList.remove('hide')

    let loginPageContainer = document.querySelector('#loginPageContainer')
    loginPageContainer.classList.add('hide')

    return true;
}

function showSignUpMsg() {
    let signUpMessage = document.querySelector('#signUpMessage')
    signUpMessage.classList.remove('hide');

    let signUpLink = document.querySelector('#signUpLink')
    signUpLink.addEventListener('click', showSignUpPage);
}



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

async function checkPassword() {

    let desiredPassword = document.querySelector('#desiredPassword')
    let verifyPassword = document.querySelector('#verifyPassword')

    if (desiredPassword.value !== verifyPassword.value || desiredPassword.value.length === 0) {
        return signUpMessage("Error: Passwords do not match!")
    }
    // https://project-howler.herokuapp.com/api/users
    await fetch('http://localhost:8000/api/users')
        .then(response => response.json())
        .then(data => createAccount(data, verifyPassword))
        .catch(error => console.error(error))
}


async function createAccount(data, password) {
    let signUpfirstName = document.querySelector('#signUpfirstName')
    let signUplastName = document.querySelector('#signUplastName');
    let desiredUserName = document.querySelector('#desiredUserName')
    let signUpemail = document.querySelector('#signUpemail')

    if (signUpfirstName.value.length === 0 || signUplastName.value.length === 0 || desiredUserName.value.length === 0 || signUpemail.value.length === 0) { return signUpMessage("Error: Missing value!") }

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

    // https://project-howler.herokuapp.com/api/users/create
    await fetch('http://localhost:8000/api/users/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accountCreationData),
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => { console.error(error) })

    signUpMessage('Account successfully created! Please sign in')

    return returnToLoginPage();
}

function signUpMessage(msg) {
    let signUpErrors = document.querySelector('#signUpErrors');
    signUpErrors.textContent = ""
    let popUpMessage = document.createElement('p')
    popUpMessage.textContent = msg
    return signUpErrors.appendChild(popUpMessage)
}

function returnToLoginPage() {
    let signUpMsg = document.querySelector('#signUpErrors')
    let goBackToSignInButton = document.createElement('button')
    goBackToSignInButton.id = 'goBackToSignInButton'
    goBackToSignInButton.textContent = "Go back to sign in"
    goBackToSignInButton.addEventListener('click', () => {
        window.location.reload();
    })
    signUpMsg.appendChild(goBackToSignInButton)
}


//! main page ============================================
async function fetchAllPosts() {
    await fetch('http://localhost:8000/api/posts/all')
        .then(response => response.json())
        .then(data => displayAllPosts(data))
        .catch(error => console.error(error))
}

function displayAllPosts(data) {
    let resultContainer = document.querySelector('#resultContainer');
    resultContainer.textContent = ""
    createNewPost(resultContainer)

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        let userId = current.user_id
        let userName = current.user_name
        let postContent = current.post_content
        let postId = current.post_id
        createCards(userId, userName, postContent, resultContainer, postId)
    }
}

function createNewPost(container) {
    let newPostDiv = document.createElement('div');
    newPostDiv.id = "newPostDiv"

    let newPostTextBox = document.createElement('textarea');
    newPostTextBox.id = 'newPostTextBox'
    newPostTextBox.setAttribute('maxlength', 150)
    newPostTextBox.setAttribute('placeholder', 'Go ahead and Howl away!')
    newPostDiv.appendChild(newPostTextBox)

    let submitNewPostButton = document.createElement('button')
    submitNewPostButton.textContent = "Howl!"
    submitNewPostButton.id = "submitNewPostButton"
    submitNewPostButton.addEventListener('click', () => { uploadNewPost(newPostTextBox.value) })
    newPostDiv.appendChild(submitNewPostButton)

    container.appendChild(newPostDiv)
}

async function uploadNewPost(textContent) {

    let postCreationData = {
        postContent: textContent,
        userId: currentUser.id
    }
    // https://project-howler.herokuapp.com/api/users/create
    await fetch('http://localhost:8000/api/posts/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postCreationData),
    })
        .then(response => response.json())
        .then(data => console.log('Success:', data))
        .catch(error => { console.error(error) })

    return fetchAllPosts();
}

//????
function createCards(userId, userName, postContent, container, postId) {
    let postDiv = document.createElement('div')
    postDiv.id = userId
    postDiv.classList.add('userPostDiv')
    postDiv.addEventListener('click', (e) => { fetchThatUsersPosts(e) })

    let optionsBar = document.createElement('div');
    optionsBar.classList.add('optionsBar')
    optionsBar.classList.add('hide')

    let updateButton = document.createElement('button')
    updateButton.id = postId
    updateButton.classList.add('updatePostButton')
    updateButton.textContent = 'Update post'
    optionsBar.appendChild(updateButton)

    let deletePostButton = document.createElement('button')
    deletePostButton.id = postId
    deletePostButton.classList.add('deletePostButton')
    deletePostButton.textContent = 'Delete post'
    optionsBar.appendChild(deletePostButton)

    postDiv.appendChild(optionsBar)


    let postCreator = document.createElement('p')
    postCreator.textContent = (`@${userName}`)
    postCreator.classList.add('postCreatorName')
    postCreator.id = userId
    postDiv.appendChild(postCreator)

    let postText = document.createElement('p')
    postText.classList.add('postText')
    postText.id = userId
    postText.textContent = postContent
    postDiv.appendChild(postText)

    container.appendChild(postDiv)
}

//! NAV panel =================================

function createNavPanel() {
    let resultContainer = document.querySelector('#resultContainer');
    let individualPostContainer = document.querySelector('#individualPostContainer')

    let goHomeButton = document.querySelector('#goHomeButton')

    goHomeButton.addEventListener('click', () => {
        individualPostContainer.classList.add('hide')
        resultContainer.classList.remove('hide');
        fetchAllPosts()
    })


}

//! individual post container =============================
async function fetchThatUsersPosts(e) {
    let userId = +e.target.id;

    await fetch(`http://localhost:8000/api/posts/${userId}`)
        .then(response => response.json())
        .then(data => displayPostsByUser(data));
}

function displayPostsByUser(data) {
    let resultContainer = document.querySelector('#resultContainer');
    resultContainer.classList.add('hide');

    let individualPostContainer = document.querySelector('#individualPostContainer')
    individualPostContainer.classList.remove('hide')
    individualPostContainer.textContent = ""

    // let deletePostButton = document.createElement('button')
    // deletePostButton.id = 'deletePostButton'
    // deletePostButton.textContent = "Delete Post"
    // deletePostButton.classList.add('hide')

    // individualPostContainer.appendChild(deletePostButton)

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        let userId = current.user_id
        let userName = current.user_name
        let postContent = current.post_content
        let postId = current.post_id
        createCards(userId, userName, postContent, individualPostContainer, postId)
    }

    let postedByUser = data[0].user_id

    return deletePostOption(postedByUser)
}

function deletePostOption(postedByUser) {

    let currentLoggedInUser = currentUser.id

    if (postedByUser === currentLoggedInUser) {
        // let deletePostButton = document.querySelector('#deletePostButton')
        // deletePostButton.classList.remove('hide')
        // deletePostButton.addEventListener('click', () => {
        //     console.log('clicked');
        // })
        let optionsBarArr = document.querySelectorAll('.optionsBar');
        console.log(optionsBarArr);
        for (let i = 0; i < optionsBarArr.length; i++) {
            const current = optionsBarArr[i];
            current.classList.remove('hide')
        }
        return console.log('you can delete posts');

    }

    console.log('you cant DELETE Bro!');
}