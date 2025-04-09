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
}

loadPage();


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
