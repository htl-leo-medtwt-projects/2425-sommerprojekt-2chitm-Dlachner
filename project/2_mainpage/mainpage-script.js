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
                    ${renderStreamerBoxes(fn_streamer.slice(0, 3))}
                </div>
            </section>

            <!-- You Might Also Like -->
            <section class="section">
                <h2>You might also like:</h2>
                <div class="stream-container">
                    ${renderStreamerBoxes(r6_streamer.slice(0, 3))}
                </div>
            </section>

            <!-- Categories -->
            <section class="section">
                <h2>Categories</h2>
                <div class="category-container">
                    <div class="category-img" style="background-image: url('../Z-extra/pics/fortnite/category.jpg');"></div>
                    <div class="category-img" style="background-image: url('../Z-extra/pics/r6/category.jpg');"></div>
                </div>
            </section>
        </main>
    `
    document.querySelector('.profile-icon').addEventListener('click', loadSettingsPage);
}
loadPage();

/*******************************************************
 * 
 *                 Streams & Streamer
 * 
 *******************************************************/

function renderStreamerBoxes(streamerList) {
    return streamerList.map(s => `
        <div class="stream-box" onclick="loadStreamFullscreen('${s.Stream}', '${s.Name}', '${s.Streamtitle || "Cooler Stream"}', '${s.Pf}')">
            <div class="preview-wrapper">
                <img src="${s.Thumbnail}" alt="Thumbnail" class="preview-img">
                <video src="${s.Stream}" class="preview-video" muted loop></video>
            </div>
            <div class="stream-info">
                <img src="${s.Pf}" alt="${s.Name}" class="stream-profile">
                <div class="stream-texts">
                    <div class="stream-title">${s.Streamtitle}</div>
                    <div class="stream-name">@${s.Name}</div>
                </div>
            </div>
        </div>
    `).join('');
}

//Stream öffnen
function loadStreamFullscreen(videoUrl, streamerName, streamTitle, profilePic) {
    content.innerHTML = `
        <div class="fullscreen-container">
            <!-- Header -->
            <header class="fullscreen-header">
                <div id="frog-back" class="logo">🐸 Froggo</div>
                <div class="chat-header">Chat</div>
            </header>

            <div class="stream-chat-wrapper">
                <!-- Stream Video -->
                <div class="stream-full">
                    <video src="${videoUrl}" autoplay controls muted class="stream-video"></video>

                    <div class="stream-info-bar">
                        <img src="${profilePic}" class="stream-profile-icon">
                        <div class="streamer-info-text">
                            <h3>${streamTitle}</h3>
                            <p>@${streamerName} || Rainbow Six Siege</p>
                        </div>
                        <div class="stream-meta">
                            🔴 <span>20k viewers</span>
                            <button id="follow-btn" class="unfollow-btn"></button>
                        </div>
                    </div>
                </div>

                <!-- Chat -->
                <div class="chat-box">
                    <div class="chat-messages" id="chat-messages"></div>
                    <div class="chat-input">
                        <input type="text" id="chat-input-field" placeholder="Type message">
                    </div>
                </div>
            </div>
        </div>
    `;

    document.getElementById("frog-back").addEventListener("click", loadPage);

    // Follow/Unfollow Button initialisieren
    const btn = document.getElementById("follow-btn");
    function updateBtn() {
      if (AccountManager.isFollowing(streamerName)) {
        btn.textContent = "Unfollow";
      } else {
        btn.textContent = "Follow";
      }
    }
    updateBtn();

    btn.addEventListener("click", () => {
      if (AccountManager.isFollowing(streamerName)) {
        AccountManager.unfollowStreamer(streamerName);
      } else {
        AccountManager.followStreamer(streamerName);
      }
      updateBtn();
    });

    //Chat
    setInterval(() => {
        if (Math.random() < 0.25) { // 1 in 4 chance
            const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            addMessageToChat(randomUsername, randomMessage);
        }
    }, 2000);

    const chatInputField = document.getElementById("chat-input-field");
    chatInputField.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        const message = chatInputField.value.trim();
        if (message) {
            addMessageToChat(currentUser.username, message);
            chatInputField.value = "";
        }
    }
});
}

const messages = [
    "This is so cool!",
    "Wow, amazing play!",
    "Anyone else watching this?",
    "What a clutch!",
    "GG everyone!",
    "This streamer is awesome!",
    "Can't believe that just happened!",
    "Who's your favorite streamer?",
    "This map is insane!",
    "Let's gooo!",
    "Thats massive!",
    "Imagine",
    "1",
    "Thats crazy",
    "Dude what?",
    "Whats going on",
    "WHATS UP CHATTTTTT"
];

const usernames = [
    "CoolFrog123",
    "GamerPro",
    "StreamLover",
    "ChatMaster",
    "EpicViewer",
    "FrogFan",
    "RainbowSixFan",
    "ClutchKing",
    "Viewer123",
    "StreamerFanatic",
    "Gamemaster",
    "Fortnitekid123",
    "WhatAmIDoing_42",
    "Roland"
];

function addMessageToChat(username, message) {
    const chatMessages = document.getElementById("chat-messages");
    const newMessage = document.createElement("p");
    newMessage.innerHTML = `<span class="user">${username}:</span> ${message}`;
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll to the latest message
}

document.addEventListener("DOMContentLoaded", () => {
    setTimeout(() => {
        const videoBoxes = document.querySelectorAll(".preview-wrapper");

        videoBoxes.forEach(wrapper => {
            const video = wrapper.querySelector("video");

            wrapper.addEventListener("mouseenter", () => {
                video.currentTime = 0;
                video.play();
            });

            wrapper.addEventListener("mouseleave", () => {
                video.pause();
                video.currentTime = 0;
            });
        });
    }, 100);
});

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

    unfollowStreamer: function (streamerName) {
        let user = this.getCurrentUser();
        if (!user.followers) return;
        user.followers = user.followers.filter(name => name !== streamerName);
        this.saveCurrentUser(user);
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
