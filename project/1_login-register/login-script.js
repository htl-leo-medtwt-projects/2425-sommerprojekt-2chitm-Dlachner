let users = JSON.parse(localStorage.getItem('users')) || [];

login();

/* ======== Login ======== */

function login() {
    document.body.innerHTML = `
        <div class="login-box">
            <div class="frog">🐸</div>
            <h2>Log in</h2>
            <label>Username:</label>
            <input oninput="checkDoneLogin()" id="usernameInput" type="text" placeholder="Your username">
            <label>Password:</label>
            <input oninput="checkDoneLogin()" id="passwordInput" type="password" placeholder="Your password">
            <br>
            <a onclick="forgotPassword()" class="link">Forgot password?</a>
            <br><br>
            <button id ="doneButton" class="button" disabled>Done</button>
            <br><br>
            <a onclick="register()" class="link">Register for free</a>
            <br><br>
            <span id="errorMessage" style="color: red; display: none;">Benutzername oder Passwort sind falsch.</span>
        </div>
    `;

    document.getElementById("doneButton").addEventListener("click", function () {
        if (!this.disabled) {
            authenticateUser();
        }
    });
}

function authenticateUser() {
    let username = document.getElementById('usernameInput').value.toLowerCase();
    let password = document.getElementById('passwordInput').value;

    let userFound = false;
    let errorMessage = document.getElementById('errorMessage');

    errorMessage.style.display = "none";

    for (let i = 0; i < users.length; i++) {
        let user = users[i];

        if (user.username.toLowerCase() === username && user.password === password) {
            userFound = true;
            window.location.href = "../2_mainpage/mainpage-index.html";
            break;
        }
    }

    if (!userFound) {
        errorMessage.style.display = "inline";
    }
}


/* ======== Registrieren ======== */

function register() {
    document.body.innerHTML = `
        <div class="login-box">
            <div class="frog">🐸</div>
            <h2>Register</h2>
            <label>Username:</label>
            <input oninput="checkDoneRegister()" id="usernameInput" type="text" placeholder="Your username">
            <span id="usernameError" style="color: red; display: none;">Username is already taken.</span>
            <br>
            <label>Email:</label>
            <input oninput="checkDoneRegister()" id="emailInput" type="email" placeholder="Your email">
            <label>Password:</label>
            <input oninput="checkDoneRegister()" id="passwordInput" type="password" placeholder="Your password">
            <label>Phone number:</label>
            <input oninput="checkDoneRegister()" id="phoneInput" type="tel" placeholder="Your number">
            <br><br>
            <button id="doneButton" class="button" disabled>Done</button>
            <br><br>
            <a onclick="login()" class="link">Sign in</a>
        </div>
    `;

    document.getElementById("doneButton").addEventListener("click", function () {
        if (!this.disabled) {
            if (!isUsernameTaken()) {
                saveUser();
                window.location.href = "../2_mainpage/mainpage-index.html";
            }
        }
    });
}

function isUsernameTaken() {
    let username = document.getElementById('usernameInput').value;
    let usernameError = document.getElementById('usernameError');

    for (let i = 0; i < users.length; i++) {
        if (users[i].username === username) {
            usernameError.style.display = "inline";
            return true;
        }
    }

    usernameError.style.display = "none";
    return false;
}

function saveUser() {
    let username = document.getElementById('usernameInput').value;
    let email = document.getElementById('emailInput').value;
    let password = document.getElementById('passwordInput').value;
    let phone = document.getElementById('phoneInput').value;

    let newUser = {
        username: username,
        email: email,
        password: password,
        phone: phone
    };

    users.push(newUser);

    localStorage.setItem('users', JSON.stringify(users));
}

/* ======== Registrieren ======== */

function forgotPassword() {
    document.body.innerHTML = `
        <div class="login-box">
            <div class="frog">🐸</div>
            <h2>Forgot password</h2>
            <label>Username:</label>
            <input oninput="checkDoneForgot()" id="usernameInput" type="text" placeholder="Your username">
            <span id="usernameError" style="color: red; display: none;">Username not found.</span>
            <br><br>
            <button id="doneButton" class="button" disabled onclick="validateUsername()">Done</button>
            <br><br>
            <a onclick="login()" class="link">Back to sign in</a>
        </div>
    `;
}

function validateUsername() {
    let username = document.getElementById('usernameInput').value.toLowerCase();
    let usernameError = document.getElementById('usernameError');
    let userFound = false;
    let foundUser = "";

    for (let i = 0; i < users.length; i++) {
        if (users[i].username.toLowerCase() === username) {
            userFound = true;
            foundUser = users[i].username;
            break;
        }
    }

    if (userFound) {
        resetPassword(foundUser);
    } else {
        usernameError.style.display = "inline";
    }
}


function resetPassword(username) {
    document.body.innerHTML = `
        <div class="login-box">
            <div class="frog">🐸</div>
            <h2>New Password</h2>
            <label>Enter new password:</label>
            <input type="password" id="newPassword" placeholder="New password">
            <label>Confirm password:</label>
            <input type="password" id="confirmPassword" placeholder="Confirm password">
            <br><br>
            <button id="saveButton" class="button" onclick="saveNewPassword('${username}')">Save</button>
            <br><br>
            <span id="errorMessage" style="color: red; display: none;">Passwords do not match. Please try again.</span>
            <br><br>
            <a onclick="login()" class="link">Back to sign in</a>
        </div>
    `;
}

function saveNewPassword(username) {
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;
    let errorMessage = document.getElementById('errorMessage');

    if (newPassword === confirmPassword && newPassword.trim() !== "") {
        let userFound = false;

        for (let i = 0; i < users.length; i++) {
            if (users[i].username.toLowerCase() === username.toLowerCase()) {
                users[i].password = newPassword;
                userFound = true;
                break;
            }
        }

        if (userFound) {
            localStorage.setItem('users', JSON.stringify(users));
            login();
        } else {
            errorMessage.textContent = "User not found!";
            errorMessage.style.display = "inline";
        }
    } else {
        errorMessage.style.display = "inline";
    }
}

/*
    * ======== Check buttons ========
*/
function checkDoneLogin() {
    let username = document.getElementById('usernameInput').value;
    let password = document.getElementById('passwordInput').value;
    let done = document.getElementById('doneButton');

    if (username != "" && password != "") {
        done.disabled = false;
    } else {
        done.disabled = true;
    }
}

function checkDoneRegister() {
    let username = document.getElementById('usernameInput').value;
    let email = document.getElementById('emailInput').value;
    let password = document.getElementById('passwordInput').value;
    let phone = document.getElementById('phoneInput').value;
    let done = document.getElementById('doneButton');

    if (username !== "" && email !== "" && password !== "" && phone !== "") {
        done.disabled = false;
    } else {
        done.disabled = true;
    }
}

function checkDoneForgot() {
    let username = document.getElementById('usernameInput').value;
    let doneButton = document.getElementById('doneButton');

    doneButton.disabled = username.trim() === "";
}