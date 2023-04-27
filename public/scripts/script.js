const formPlayers = document.querySelector('.form-search-player');
const formTeams = document.querySelector('.form-search-team');
const buttonPrev = document.querySelector('.btn-previous-bar');
const buttonNext = document.querySelector('.btn-next-bar');

buttonPrev.addEventListener('click', function() {
    if (formPlayers.classList.contains('active')) {
        formPlayers.classList.remove('active')
        formTeams.classList.add('active')
    } else {
        formTeams.classList.remove('active')
        formPlayers.classList.add('active')
    }
})

buttonNext.addEventListener('click', function() {
    if (formPlayers.classList.contains('active')) {
        formPlayers.classList.remove('active')
        formTeams.classList.add('active')
    } else {
        formTeams.classList.remove('active')
        formPlayers.classList.add('active')
    }
})

// const form = document.querySelector('#myForm');
// const input = form.querySelector(".myInput")
// const submitButton = document.querySelector('button[type="submit"]');

// submitButton.addEventListener('click', async function(event) {
//     event.preventDefault();
//     inputValue = input.value
//     const url = `http://localhost:4000/matches/${inputValue}`
//     window.location.href = url
// });

// const formPlayers = document.querySelector('.form-search-player');
// const inputPLayers = formPlayers.querySelector(".input-proplayer")
// const submitButtonPLayers = document.querySelector('.btn-searchpro-submit');

// submitButtonPLayers.addEventListener('click', async function(event) {
//     event.preventDefault();
//     inputValue = inputPLayers.value
//     const url = `http://localhost:4000/proplayers/${inputValue}`
//     window.location.href = url
// });

// const formSignup = document.querySelector('.form-signup');
// const inputSignup = form.querySelector(".input-signup")
// const submitButtonSignup = document.querySelector(".btn-signup-submit");

// const loginField = document.querySelector(".login")
// const passwordField = document.querySelector(".password")
// const usernameField = document.querySelector(".username")

// function isLoginValid(login) {
//     const loginRegex = /^[a-zA-Z0-9]{3,15}$/
//     return loginRegex.test(login)
// }

// function isPasswordValid(password) {
//     const passwordRegex = /^[a-zA-Z!@#$%0-9]{8,15}$/
//     return passwordRegex.test(password)
// }

// function isUsernameValid(username) {
//     const usernameRegex = /^[a-zA-Z0-9]{3,15}$/
//     return usernameRegex.test(username)
// }

// submitButtonSignup.addEventListener('click', async function(event) {
//     event.preventDefault();
//     const inputFields = document.querySelectorAll(".input-signup")
//     let hasEmptyField = false
//     let hasInvalidLogin = false
//     let hasInvalidPassword = false
//     let hasInvalidUsername = false
//     inputFields.forEach(function(field) {
//         if (field.value === "") {
//             hasEmptyField = true
//             console.log("Empty field!")
//         } else if (field === loginField && !isLoginValid(field.value)) {
//             hasInvalidLogin = true
//             console.log("Invalid characters in login")
//         } else if (field === passwordField && !isPasswordValid(field.value)) {
//             hasInvalidPassword = true
//             console.log("Invalid characters in password")
//         } else if (field === usernameField && !isUsernameValid(field.value)) {
//             hasInvalidUsername = true
//             console.log("Invalid characters in username")
//         } 
//     })
//     if (!hasEmptyField && !hasInvalidLogin && !hasInvalidPassword && !hasInvalidUsername) {
//         formSignup.submit()
//     }
// });