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
    email: null,
    password: null
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
            currentUser.password = data[i].password;

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
    resultContainer.innerHTML = ""
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
    container.innerHTML = ""
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

    fetchAllPosts();
}


function createCards(userId, userName, postContent, container, postId) {
    let postDiv = document.createElement('div')
    postDiv.id = userId
    postDiv.setAttribute('postId', postId)
    postDiv.classList.add('userPostDiv')
    if (container.id === 'resultContainer') {
        postDiv.addEventListener('click', (e) => { fetchThatUsersPosts(+e.target.id) })
    }

    let optionsBar = document.createElement('div');
    optionsBar.classList.add('hide')
    optionsBar.classList.add('optionsBar')

    let updateButton = document.createElement('button')
    updateButton.id = postId
    updateButton.classList.add('updatePostButton')
    updateButton.textContent = 'Update post'
    updateButton.addEventListener('click', (e) => { updateThePost(e.target) })
    optionsBar.appendChild(updateButton)

    let deletePostButton = document.createElement('button')
    deletePostButton.id = postId
    deletePostButton.classList.add('deletePostButton')
    deletePostButton.textContent = 'Delete post'
    deletePostButton.addEventListener('click', (e) => { deleteThePost(e.target) })
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
    let navPanelContainer = document.querySelector('#navPanelContainer')

    let navPanelDiv = document.createElement('div')
    navPanelDiv.id = "navPanelDiv"

    let goHomeButton = document.createElement('button')
    goHomeButton.id = 'goHomeButton'
    goHomeButton.textContent = "Home"
    goHomeButton.addEventListener('click', navigateToHomePage)
    navPanelDiv.appendChild(goHomeButton)

    let myPostsButton = document.createElement('button')
    myPostsButton.id = 'myPostsButton'
    myPostsButton.textContent = "My Posts"
    myPostsButton.addEventListener('click', () => { fetchThatUsersPosts(currentUser.id) })
    navPanelDiv.appendChild(myPostsButton)

    let myProfileButton = document.createElement('button')
    myProfileButton.id = 'myProfileButton'
    myProfileButton.textContent = "Profile Settings"
    myProfileButton.addEventListener('click', () => { showMyProfilePage() })
    navPanelDiv.appendChild(myProfileButton)

    let logOutButton = document.createElement('button')
    logOutButton.id = 'logOutButton'
    logOutButton.textContent = "Log Out"
    logOutButton.addEventListener('click', () => { window.location.reload() })
    navPanelDiv.appendChild(logOutButton)

    navPanelContainer.appendChild(navPanelDiv)
}

function navigateToHomePage() {
    let resultContainer = document.querySelector('#resultContainer');
    let individualPostContainer = document.querySelector('#individualPostContainer')

    individualPostContainer.classList.add('hide')
    resultContainer.classList.remove('hide');
    fetchAllPosts()
}

function showMyProfilePage() {
    let resultContainer = document.querySelector('#resultContainer')
    resultContainer.classList.add('hide')

    let individualPostContainer = document.querySelector('#individualPostContainer')
    individualPostContainer.classList.add('hide')
    // individualPostContainer.innerHTML = ""

    displayProfileSettings()
}

function displayProfileSettings() {
    console.log(currentUser);
    let profileSettingsContainer = document.querySelector('#profileSettingsContainer')
    profileSettingsContainer.classList.remove('hide')

    let currentFirstName = document.querySelector('#currentFirstName')
    currentFirstName.textContent = `First Name on file: ${currentUser.firstName} `

    let currentLastName = document.querySelector('#currentLastName')
    currentLastName.textContent = `Last Name on file: ${currentUser.lastName}`

    let currentEmail = document.querySelector('#currentEmail')
    currentEmail.textContent = `Email on file: ${currentUser.email}`

    listenForUpdatedProfileSettings()
}

function listenForUpdatedProfileSettings() {
    let updateFirstName = document.querySelector('#updateFirstName')
    let updateLastName = document.querySelector('#updateLastName')
    let updateEmail = document.querySelector('#updateEmail')
    let newPassword = document.querySelector('#newPassword')
    let verifyNewPassword = document.querySelector('#verifyNewPassword')

    let updateProfileButton = document.querySelector('#updateProfileButton')
    updateProfileButton.addEventListener('click', () => {
        if (newPassword.value !== verifyNewPassword.value) {
            return alert('Passwords do not match')
        }
        checkForNewUserData(updateFirstName.value, updateLastName.value, updateEmail.value, newPassword.value)
    })
}

function checkForNewUserData(newFirstName, newLastName, newEmail, newPassword) {

    let userData = {
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        email: currentUser.email,
        password: currentUser.password,
    }

    if (newFirstName.length !== 0) { userData.firstName = newFirstName }
    if (newLastName.length !== 0) { userData.lastName = newLastName }
    if (newEmail.length !== 0) { userData.email = newEmail }
    if (newPassword.length !== 0) { userData.password = newPassword }

    updateUserDatabase(userData)
}

async function updateUserDatabase(userData) {
    console.log(userData);

}
//! individual post container =============================
async function fetchThatUsersPosts(e) {
    let userId = e;

    await fetch(`http://localhost:8000/api/posts/${userId}`)
        .then(response => response.json())
        .then(data => displayPostsByUser(data))
        .catch(error => console.error(error))
}

function displayPostsByUser(data) {
    let resultContainer = document.querySelector('#resultContainer');
    resultContainer.classList.add('hide');

    let individualPostContainer = document.querySelector('#individualPostContainer')
    individualPostContainer.classList.remove('hide')
    individualPostContainer.textContent = ""

    for (let i = 0; i < data.length; i++) {
        const current = data[i];
        let userId = current.user_id
        let userName = current.user_name
        let postContent = current.post_content
        let postId = current.post_id
        createCards(userId, userName, postContent, individualPostContainer, postId)
    }

    let postedByUser = data[0].user_id

    return showPostOptionsBar(postedByUser)
}

function showPostOptionsBar(postedByUser) {

    let currentLoggedInUser = currentUser.id

    if (postedByUser === currentLoggedInUser) {

        let optionsBarArr = document.querySelectorAll('.optionsBar');
        for (let i = 0; i < optionsBarArr.length; i++) {
            const current = optionsBarArr[i];
            current.classList.remove('hide');
        }
    }
}

function updateThePost(target) {

    let postId = +target.id

    let submitUpdateButton = document.createElement('button')
    submitUpdateButton.textContent = "UPDATE!"
    submitUpdateButton.classList.add('updatePostButton')
    submitUpdateButton.id = postId

    target.parentNode.appendChild(submitUpdateButton)

    let newTextArea = document.createElement('textarea')
    newTextArea.classList.add('updatePostTextArea')
    submitUpdateButton.setAttribute('maxlength', 150)


    target.classList.add('hide');
    target.nextSibling.classList.add('hide')

    target.parentNode.appendChild(newTextArea)

    submitUpdateButton.addEventListener('click', () => {
        sendPostUpdate(postId, newTextArea.value)
    })
}

async function sendPostUpdate(postId, textContent) {
    let updatePost = {
        text: textContent,
    }
    console.log(typeof postId);
    // https://project-howler.herokuapp.com/api/users/create
    await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatePost)
    })
        .then(response => response.json())
        .then(() => fetchThatUsersPosts(currentUser.id))
        .catch(error => console.error(error))
}

async function deleteThePost(target) {
    let postId = +target.id

    if (!confirm('Are you sure you want to delete this post?')) { return }

    // https://project-howler.herokuapp.com/api/users/create
    await fetch(`http://localhost:8000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(() => fetchThatUsersPosts(currentUser.id))
        .catch(error => console.error(error))
}