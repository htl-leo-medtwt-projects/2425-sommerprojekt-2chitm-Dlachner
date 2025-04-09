let currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (!currentUser) {
    window.location.href = "../1_login-register/login-index.html";
}
let content = document.getElementById('content');

function loadPage() {
    content.innerHTML = `
            <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo">🐸 Froggo</div>
            <nav>
                <a href="#" class="active">Following</a>
            </nav>
            <div class="live-section">
                <h3>Live</h3>
            </div>
            <div class="offline-section">
                <h3>Offline</h3>
            </div>
        </aside>

        <!-- Main Content -->
        <main class="content">
            <header class="top-bar">
                <input type="text" placeholder="Search" class="search-bar">
                <div class="profile-icon" title="${currentUser.username}">
                    <img src="../Z-extra/pics/profilePic/${currentUser.pp}" alt="Profile Picture" class="profile-pic">
                </div>
            </header>

            <!-- For You Section -->
            <section class="section">
                <h2>For you</h2>
                <div class="stream-container">
                    <div class="stream-box">Stream 1</div>
                    <div class="stream-box">Stream 2</div>
                    <div class="stream-box">Stream 3</div>
                </div>
            </section>

            <!-- You Might Also Like -->
            <section class="section">
                <h2>You might also like:</h2>
                <div class="stream-container">
                    <div class="stream-box">Suggestion 1</div>
                    <div class="stream-box">Suggestion 2</div>
                    <div class="stream-box">Suggestion 3</div>
                </div>
            </section>

            <!-- Categories -->
            <section class="section">
                <h2>Categories</h2>
                <div class="category-container">
                    <div class="category-img"></div>
                    <div class="category-img"></div>
                </div>
            </section>
        </main>
    `
    document.querySelector('.profile-icon').addEventListener('click', loadSettingsPage);
}
loadPage();


/*******************************************************
 * 
 *                      Settings
 * 
 *******************************************************/
function loadSettingsPage() {
    content.innerHTML = `
        <header class="top-bar settings-header">
            <div class="logo">🐸 Froggo</div>
        </header>

        <main class="settings-main">
            <div class="profile-settings">
                <img src="../Z-extra/pics/profilePic/${currentUser.pp}" alt="Profilbild" class="settings-profile-pic" id="profile-pic-preview">

                <h2>${currentUser.username}</h2>

                <div class="settings-options">
                    <label>📝 Neuer Name:
                        <input type="text" id="new-username" placeholder="Neuer Name" value="${currentUser.username}">
                    </label>

                    <label>🔑 Neues Passwort:
                        <input type="password" id="new-password" placeholder="Mind. 4 Zeichen">
                    </label>

                    <label>🖼️ Neues Profilbild:
                        <select id="new-profile-pic">
                            ${[
                                "defaultPic.jpg",
                                "bruh.webp",
                                "face.webp",
                                "hogrider.webp",
                                "lebron.png",
                                "lowtaper.jpeg"
                            ].map(pic => `
                                <option value="${pic}" ${currentUser.pp === pic ? "selected" : ""}>${pic}</option>
                            `).join('')}
                        </select>
                    </label>

                    <button onclick="saveSettings()">✅ Änderungen speichern</button>
                    <button onclick="goBackToMain()">🔙 Zurück</button>

                    <div id="save-confirmation" style="display: none; margin-top: 2vh; color: green; font-weight: bold;">✅ Änderungen gespeichert!</div>
                </div>
            </div>
        </main>
    `;

    const profileSelect = document.getElementById("new-profile-pic");
    const previewImg = document.getElementById("profile-pic-preview");

    profileSelect.addEventListener("change", () => {
        previewImg.src = `../Z-extra/pics/profilePic/${profileSelect.value}`;
    });
}

function saveSettings() {
    let newUsername = document.getElementById("new-username").value.trim();
    let newPassword = document.getElementById("new-password").value;
    let newProfilePic = document.getElementById("new-profile-pic").value;

    if (newUsername) currentUser.username = newUsername;
    if (newPassword && newPassword.length >= 4) currentUser.password = newPassword;
    currentUser.pp = newProfilePic;

    AccountManager.saveCurrentUser(currentUser);

    const confirmation = document.getElementById("save-confirmation");
    confirmation.style.display = "block";

    setTimeout(() => {
        confirmation.style.display = "none";
    }, 3000);
}


function changeUsername() {
    let newName = prompt("Neuer Benutzername:");
    if (newName && newName.trim() !== "") {
        currentUser.username = newName.trim();
        AccountManager.saveCurrentUser(currentUser);
        loadSettingsPage();
    }
}

function changePassword() {
    let newPassword = prompt("Neues Passwort:");
    if (newPassword && newPassword.length >= 4) {
        currentUser.password = newPassword;
        AccountManager.saveCurrentUser(currentUser);
        alert("Passwort erfolgreich geändert.");
    } else {
        alert("Das Passwort muss mindestens 4 Zeichen lang sein.");
    }
}

function changeProfilePicture() {
    const availablePics = [
        "defaultPic.jpg",
        "bruh.webp",
        "face.webp",
        "hogrider.webp",
        "lebron.png",
        "lowtaper.jpeg"
    ];

    let list = availablePics.map((pic, index) => `${index + 1}: ${pic}`).join("\n");
    let choice = prompt("Wähle eine Nummer für das neue Profilbild:\n" + list);

    let index = parseInt(choice) - 1;
    if (!isNaN(index) && availablePics[index]) {
        currentUser.pp = availablePics[index];
        AccountManager.saveCurrentUser(currentUser);
        loadSettingsPage();
    } else {
        alert("Ungültige Auswahl.");
    }
}

function goBackToMain() {
    loadPage();
}



/*******************************************************
 * 
 *                  Account Management
 * 
 *******************************************************/

const AccountManager = {
    getAllUsers: function () {
        return JSON.parse(localStorage.getItem('users')) || [];
    },

    saveAllUsers: function (users) {
        localStorage.setItem('users', JSON.stringify(users));
    },

    getCurrentUser: function () {
        return JSON.parse(localStorage.getItem('loggedInUser'));
    },

    saveCurrentUser: function (user) {
        localStorage.setItem('loggedInUser', JSON.stringify(user));
        let users = this.getAllUsers();
        for (let i = 0; i < users.length; i++) {
            if (users[i].username === user.username) {
                users[i] = user;
                break;
            }
        }
        this.saveAllUsers(users);
    },

    addPoints: function (amount) {
        let user = this.getCurrentUser();
        if (!user.points) user.points = 0;
        user.points += amount;
        this.saveCurrentUser(user);
    },

    followStreamer: function (streamerName) {
        let user = this.getCurrentUser();
        if (!user.followers) user.followers = [];
        if (!user.followers.includes(streamerName)) {
            user.followers.push(streamerName);
            this.saveCurrentUser(user);
        }
    },

    isFollowing: function (streamerName) {
        let user = this.getCurrentUser();
        if (!user.followers) return false;
        return user.followers.includes(streamerName);
    },

    resetPoints: function () {
        let user = this.getCurrentUser();
        user.points = 0;
        this.saveCurrentUser(user);
    }
};
