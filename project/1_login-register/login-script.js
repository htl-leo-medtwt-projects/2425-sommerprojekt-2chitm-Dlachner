let username = "";
let password = "";
let done = document.getElementById('doneButton');


function login() {
    
}

/*
    * ===== Check done button =====
*/
function checkDone() {
    username = document.getElementById('usernameInput').value;
    password = document.getElementById('passwordInput').value;

    if (username != "" && password != "") {
        done.disabled = false;
    } else {
        done.disabled = true;
    }
}

done.addEventListener("click", function () {
    if (!done.disabled) {
        window.location.href = "../2_mainpage/mainpage-index.html";
    }
});

/*
    * ===== Forgot password =====
*/
function forgotPassword() {

}