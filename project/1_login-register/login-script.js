let username = "";
let password = "";
login();


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
        </div>
    `;
    document.getElementById("doneButton").addEventListener("click", function () {
        if (!this.disabled) {
            window.location.href = "../2_mainpage/mainpage-index.html";
        }
    });
}

function register() {
    document.body.innerHTML = `
        <div class="login-box">
            <div class="frog">🐸</div>
            <h2>Register</h2>
            <label>Username:</label>
            <input oninput="checkDoneRegister()" id="usernameInput" type="text" placeholder="Your username">
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
            window.location.href = "../2_mainpage/mainpage-index.html";
        }
    });
}

function forgotPassword() {
    document.body.innerHTML = `
        <div class="login-box">
            <div class="frog">🐸</div>
            <h2>Forgot password</h2>
            <label>Username:</label>
            <input oninput="checkDoneForgot()" id="usernameInput" type="text" placeholder="Your username">
            <br><br>
            <button id="doneButton" class="button" disabled onclick="resetPassword()">Done</button>
            <br><br>
            <a onclick="login()" class="link">Back to sign in</a>
        </div>
    `;
}
function resetPassword() {
    document.body.innerHTML = `
        <div class="login-box">
            <div class="frog">🐸</div>
            <h2>New Password</h2>
            <label>Enter new password:</label>
            <input type="password" id="newPassword" placeholder="New password">
            <label>Confirm password:</label>
            <input type="password" id="confirmPassword" placeholder="Confirm password">
            <br><br>
            <button id="saveButton" class="button" onclick="saveNewPassword()">Save</button>
            <br><br>
            <a onclick="login()" class="link">Back to sign in</a>
        </div>
    `;
}
/*
    * ===== Check done button =====
*/
function checkDoneLogin() {
    username = document.getElementById('usernameInput').value;
    password = document.getElementById('passwordInput').value;
    let done = document.getElementById('doneButton');

    if (username != "" && password != "") {
        done.disabled = false;
    } else {
        done.disabled = true;
    }
}

function checkDoneRegister() {
    username = document.getElementById('usernameInput').value;
    let email = document.getElementById('emailInput').value;
    password = document.getElementById('passwordInput').value;
    let phone = document.getElementById('phoneInput').value;
    let done = document.getElementById('doneButton');

    if (username !== "" && email !== "" && password !== "" && phone !== "") {
        done.disabled = false;
    } else {
        done.disabled = true;
    }
    
    /* Account hinzufügen noch machen */
}

function checkDoneForgot() {
    let username = document.getElementById('usernameInput').value;
    let doneButton = document.getElementById('doneButton');

    doneButton.disabled = username.trim() === "";
}

function saveNewPassword() {
    let newPassword = document.getElementById('newPassword').value;
    let confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword === confirmPassword && newPassword.trim() !== "") {
        alert("Password successfully changed!");
        login();
    } else {
        alert("Passwords do not match. Please try again.");
    }
}

/*
    * ===== Forgot password =====
*/
