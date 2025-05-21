let currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

if (!currentUser) {
    window.location.href = "../1_login-register/login-index.html";
}
let content = document.getElementById('content');

function loadPage() {
    currentUser = JSON.parse(localStorage.getItem('loggedInUser'));

    const followed = currentUser.followers || [];
    const followedFn = fn_streamer.filter(s => followed.includes(s.Name));
    const followedR6 = r6_streamer.filter(s => followed.includes(s.Name));

    let forYouHtml, mightLikeHtml;
    if (followedFn.length > followedR6.length) {
        forYouHtml = renderStreamerBoxes(fn_streamer.filter(s => s.Status));
        mightLikeHtml = renderStreamerBoxes(r6_streamer.filter(s => s.Status));
    } else if (followedR6.length > followedFn.length) {
        forYouHtml = renderStreamerBoxes(r6_streamer.filter(s => s.Status));
        mightLikeHtml = renderStreamerBoxes(fn_streamer.filter(s => s.Status));
    } else {
        forYouHtml = renderStreamerBoxes(fn_streamer.filter(s => s.Status));
        mightLikeHtml = renderStreamerBoxes(r6_streamer.filter(s => s.Status));
    }

    content.innerHTML = `
        <!-- Sidebar -->
        <aside class="sidebar">
            <div class="logo" onclick="loadPage()">🐸 Froggo</div>
            <nav>
                <a href="#" class="active" id=following-link>Following</a>
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
                <input type="text" placeholder="Search" class="search-bar" id="main-search-bar">
                <div onclick="loadSettingsPage()" class="profile-icon" title="${currentUser.username}">
                    <img src="../Z-extra/pics/profilePic/${currentUser.pp}" alt="Profile Picture" class="profile-pic">
                </div>
            </header>

            <!-- For You Section -->
            <section class="section">
                <h2>For you</h2>
                <div class="owl-carousel foryou-carousel">
                    ${forYouHtml}
                </div>
            </section>

            <!-- You Might Also Like -->
            <section class="section">
                <h2>You might also like:</h2>
                <div class="owl-carousel mightlike-carousel">
                    ${mightLikeHtml}
                </div>
            </section>

            <!-- Categories -->
            <section class="section">
                <h2>Categories</h2>
                <div class="category-container">
                    <div id="fortnite" class="category-img" style="background-image: url('../Z-extra/pics/fortnite/category.jpg');"></div>
                    <div id="r6" class="category-img" style="background-image: url('../Z-extra/pics/r6/category.jpg');"></div>
                </div>
            </section>
        </main>
    `;

    document.getElementById("fortnite").addEventListener("click", loadFortniteCategoryPage);
    document.getElementById("r6").addEventListener("click", loadR6CategoryPage);

    updateStreamerBoxes();

    // Owl Carousel Initialisierung
    $(document).ready(function () {
        $('.foryou-carousel').owlCarousel({
            loop: true,
            margin: 15,
            nav: true,
            dots: false,
            responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 3 }
            }
        });

        $('.mightlike-carousel').owlCarousel({
            loop: true,
            margin: 15,
            nav: true,
            dots: false,
            responsive: {
                0: { items: 1 },
                600: { items: 2 },
                1000: { items: 3 }
            }
        });
    });

    document.getElementById("following-link").addEventListener("click", function(e) {
        e.preventDefault();
        showFollowingOverlay();
    });

    // Suchfunktion
    const searchInput = document.getElementById("main-search-bar");
    searchInput.addEventListener("keydown", function (e) {
        if (e.key === "Enter") {
            doSearch(searchInput.value.trim().toLowerCase());
        }
    });
}

loadPage();

function doSearch(query) {
    const main = document.querySelector("main.content");
    if (!query) {
        loadPage();
        return;
    }

    // Suche in allen Streamern
    const allStreamers = [...fn_streamer, ...r6_streamer];
    const channelResults = allStreamers.filter(s =>
        s.Name.toLowerCase().includes(query)
    );

    // Suche in allen Live-Streams
    const liveResults = allStreamers.filter(s =>
        s.Status && (
            s.Name.toLowerCase().includes(query) ||
            (s.Streamtitle && s.Streamtitle.toLowerCase().includes(query))
        )
    );

    let html = `<section class="section"><h2>Kanäle</h2>`;
    if (channelResults.length === 0) {
        html += `<div>Keine Kanäle gefunden.</div>`;
    } else {
        html += channelResults.map(s => `
            <div class="search-channel-result" style="display:flex;align-items:center;gap:1em;margin-bottom:1em;">
                <img src="${s.Pf}" style="width:40px;height:40px;border-radius:50%;border:1px solid #ccc;">
                <span>@${s.Name}</span>
                <button class="search-follow-btn" data-name="${s.Name}">
                    ${AccountManager.isFollowing(s.Name) ? "Unfollow" : "Follow"}
                </button>
            </div>
        `).join('');
    }
    html += `</section>`;

    html += `<section class="section"><h2>Live-Streams</h2>`;
    if (liveResults.length === 0) {
        html += `<div>Keine Live-Streams gefunden.</div>`;
    } else {
        html += liveResults.map(s => `
            <div class="search-stream-result stream-box" style="cursor:pointer;margin-bottom:1em;" onclick="loadStreamFullscreen('${s.Stream}', '${s.Name}', '${s.Streamtitle || "Cooler Stream"}', '${s.Pf}')">
                <div style="display:flex;align-items:center;gap:1em;">
                    <img src="${s.Pf}" style="width:40px;height:40px;border-radius:50%;border:1px solid #ccc;">
                    <div>
                        <div style="font-weight:bold;">@${s.Name}</div>
                        <div style="font-size:0.95em;color:#555;">${s.Streamtitle || ""}</div>
                    </div>
                    <span style="margin-left:auto;font-weight:bold;color:green;">LIVE</span>
                </div>
            </div>
        `).join('');
    }
    html += `</section>`;

    main.innerHTML = html;

    document.querySelectorAll(".search-follow-btn").forEach(btn => {
        btn.onclick = (e) => {
            e.stopPropagation();
            const name = btn.getAttribute("data-name");
            if (AccountManager.isFollowing(name)) {
                AccountManager.unfollowStreamer(name);
                btn.textContent = "Follow";
            } else {
                AccountManager.followStreamer(name);
                btn.textContent = "Unfollow";
            }
            updateStreamerBoxes();
        };
    });
}

function showFollowingOverlay() {
    const overlay = document.createElement('div');
    overlay.style.position = 'fixed';
    overlay.style.top = 0;
    overlay.style.left = 0;
    overlay.style.width = '100vw';
    overlay.style.height = '100vh';
    overlay.style.background = 'rgba(0,0,0,0.4)';
    overlay.style.zIndex = 9999;
    overlay.style.display = 'flex';
    overlay.style.justifyContent = 'center';
    overlay.style.alignItems = 'center';

    const box = document.createElement('div');
    box.style.background = '#fff';
    box.style.borderRadius = '16px';
    box.style.padding = '2rem';
    box.style.maxWidth = '90vw';
    box.style.maxHeight = '80vh';
    box.style.overflowY = 'auto';
    box.style.boxShadow = '0 4px 24px rgba(0,0,0,0.2)';
    box.innerHTML = `
        <h2 style="margin-top:0;">Following</h2>
        <div id="following-list"></div>
        <button style="margin-top:2rem; padding:0.7em 2em; border-radius:10px; background:#eee; border:none; cursor:pointer;" id="close-following">Schließen</button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    const list = document.getElementById('following-list');
    const followed = currentUser.followers || [];
    let html = '';
    [...fn_streamer, ...r6_streamer].forEach(s => {
        if (followed.includes(s.Name)) {
            html += `
                <div style="display:flex;align-items:center;gap:1em;margin-bottom:1em;">
                    <img src="${s.Pf}" style="width:40px;height:40px;border-radius:50%;border:1px solid #ccc;">
                    <span>@${s.Name}</span>
                    <span style="margin-left:auto;font-weight:bold;color:${s.Status ? 'green' : '#aaa'}">${s.Status ? 'LIVE' : 'offline'}</span>
                </div>
            `;
        }
    });
    list.innerHTML = html || '<div>Du folgst noch niemandem.</div>';

    document.getElementById('close-following').onclick = () => overlay.remove();
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
}

/*******************************************************
 * 
 *                 Fortnite Kategorie
 * 
 *******************************************************/
function loadFortniteCategoryPage() {
    content.innerHTML = `
        <!-- Sidebar bleibt erhalten -->
        <aside class="sidebar">
            <div class="logo" id="frog-back">🐸 Froggo</div>
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
                <div onclick="loadSettingsPage()" class="profile-icon" title="${currentUser.username}">
                    <img src="../Z-extra/pics/profilePic/${currentUser.pp}" alt="Profile Picture" class="profile-pic">
                </div>
            </header>

            <!-- Fortnite Kategorie -->
            <section class="fortnite-category">
                <div class="category-header">
                    <img src="../Z-extra/pics/fortnite/category.jpg" alt="Fortnite" class="category-image">
                    <div class="category-info">
                        <h2>Fortnite</h2>
                        <p>Fortnite is the completely free online game where you and your friends fight to be the last one standing in Battle Royale, join forces to make your own Creative games, or catch a live show at Party Royale.</p>
                        <p><strong>Think you know everything about Fortnite? Put your knowledge to the test with our ultimate quiz!</strong></p>
                        
                        <div class="quiz-wrapper">
                            <button class="quiz-button" onclick="loadQuizPageFn()">Quiz</button>
                        </div>
                    </div>
                </div>
                <div class="stream-container">
                    ${renderFortniteStreamers()}
                </div>
            </section>
        </main>
    `;

    // Event-Listener für das Frosch-Logo
    document.getElementById("frog-back").addEventListener("click", () => {
        loadPage();
    });

    updateStreamerBoxes();

    const searchInput = document.querySelector(".search-bar");
    if (searchInput) {
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                doSearch(searchInput.value.trim().toLowerCase());
            }
        });
    }
}

function renderFortniteStreamers() {
    return fn_streamer
        .filter(streamer => streamer.Status) // Nur Streamer, die live sind
        .map(streamer => `
            <div class="stream-box" onclick="loadStreamFullscreen('${streamer.Stream}', '${streamer.Name}', '${streamer.Streamtitle}', '${streamer.Pf}')">
                <div class="preview-wrapper">
                    <img src="${streamer.Thumbnail}" alt="Thumbnail" class="preview-img">
                    <video src="${streamer.Stream}" class="preview-video" muted loop></video>
                </div>
                <div class="stream-info">
                    <img src="${streamer.Pf}" alt="${streamer.Name}" class="stream-profile">
                    <div class="stream-texts">
                        <div class="stream-title">${streamer.Streamtitle}</div>
                        <div class="stream-name">@${streamer.Name}</div>
                    </div>
                </div>
            </div>
        `).join('');
}

/*******************************************************
 * 
 *                 R6 Kategorie
 * 
 *******************************************************/
function loadR6CategoryPage() {
    content.innerHTML = `
        <!-- Sidebar bleibt erhalten -->
        <aside class="sidebar">
            <div class="logo" id="frog-back">🐸 Froggo</div>
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
                <div onclick="loadSettingsPage()" class="profile-icon" title="${currentUser.username}">
                    <img src="../Z-extra/pics/profilePic/${currentUser.pp}" alt="Profile Picture" class="profile-pic">
                </div>
            </header>

            <!-- R6 Kategorie -->
            <section class="r6-category">
                <div class="category-header">
                    <img src="../Z-extra/pics/r6/category.jpg" alt="Rainbow Six Siege" class="category-image">
                    <div class="category-info">
                        <h2>Rainbow Six Siege</h2>
                        <p>Inspired by real counter-terrorist operations, Rainbow Six Siege delivers intense combat, tactical gameplay, and high-stakes teamwork.</p>
                        <p><strong>How well do you know Rainbow Six Siege? Test your tactical knowledge with our ultimate quiz!</strong></p>

                        <div class="quiz-wrapper">
                            <button class="quiz-button" onclick="loadQuizPageR6()">Quiz</button>
                        </div>
                    </div>
                </div>
                <div class="stream-container">
                    ${renderR6Streamers()}
                </div>
            </section>
        </main>
    `;

    // Event-Listener für das Frosch-Logo
    document.getElementById("frog-back").addEventListener("click", () => {
        loadPage();
    });

    // Aktualisiere die Sidebar
    updateStreamerBoxes();

    const searchInput = document.querySelector(".search-bar");
    if (searchInput) {
        searchInput.addEventListener("keydown", function (e) {
            if (e.key === "Enter") {
                doSearch(searchInput.value.trim().toLowerCase());
            }
        });
    }
}

function renderR6Streamers() {
    return r6_streamer
        .filter(streamer => streamer.Status) // Nur Streamer, die live sind
        .map(streamer => `
            <div class="stream-box" onclick="loadStreamFullscreen('${streamer.Stream}', '${streamer.Name}', '${streamer.Streamtitle}', '${streamer.Pf}')">
                <div class="preview-wrapper">
                    <img src="${streamer.Thumbnail}" alt="Thumbnail" class="preview-img">
                    <video src="${streamer.Stream}" class="preview-video" muted loop></video>
                </div>
                <div class="stream-info">
                    <img src="${streamer.Pf}" alt="${streamer.Name}" class="stream-profile">
                    <div class="stream-texts">
                        <div class="stream-title">${streamer.Streamtitle}</div>
                        <div class="stream-name">@${streamer.Name}</div>
                    </div>
                </div>
            </div>
        `).join('');
}

/*******************************************************
 * 
 *                 Streams & Streamer
 * 
 *******************************************************/

function renderStreamerBoxes(streamerList) {
    return streamerList.map(s => `
        <div class="item stream-box" onclick="loadStreamFullscreen('${s.Stream}', '${s.Name}', '${s.Streamtitle || "Cooler Stream"}', '${s.Pf}')">
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
let chatMessageInterval;

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
                    <video id="stream-video" src="${videoUrl}" autoplay controls muted class="stream-video"></video>

                    <div class="stream-info-bar">
                        <img src="${profilePic}" class="stream-profile-icon">
                        <div class="streamer-info-text">
                            <h3>${streamTitle}</h3>
                            <p>@${streamerName} || Rainbow Six Siege</p>
                        </div>
                        <div class="stream-meta">
                            <button id="sub-btn" class="sub-btn"></button>
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

    const video = document.getElementById("stream-video");
    let lastTime = 0;
    video.addEventListener("timeupdate", function () {
        if (video.currentTime > lastTime + 0.5) {
            video.currentTime = lastTime;
        } else {
            lastTime = video.currentTime;
        }
    });
    video.addEventListener("seeking", function () {
        if (video.currentTime > lastTime + 0.5) {
            video.currentTime = lastTime;
        }
    });

    document.getElementById("frog-back").addEventListener("click", () => {
        clearInterval(chatMessageInterval);
        loadPage();
        updateStreamerBoxes();
    });

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

    const subBtn = document.getElementById("sub-btn");
    function updateSubBtn() {
        if (currentUser.subs && currentUser.subs.includes(streamerName)) {
            subBtn.textContent = "Subscribed";
            subBtn.disabled = true;
        } else if (currentUser.points >= 100) {
            subBtn.textContent = "Sub (100 Punkte)";
            subBtn.disabled = false;
        } else {
            subBtn.textContent = "Sub (100 Punkte)";
            subBtn.disabled = true;
        }
    }
    updateSubBtn();

    subBtn.addEventListener("click", () => {
        if (currentUser.points >= 100 && (!currentUser.subs || !currentUser.subs.includes(streamerName))) {
            if (!currentUser.subs) currentUser.subs = [];
            currentUser.points -= 100;
            currentUser.subs.push(streamerName);
            AccountManager.saveCurrentUser(currentUser);
            updateSubBtn();
        }
    });

    // Chat-Nachrichten-Timer starten
    chatMessageInterval = setInterval(() => {
        if (Math.random() < 0.5) {
            const randomUsername = usernames[Math.floor(Math.random() * usernames.length)];
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            addMessageToChat(randomUsername, randomMessage);
        }
    }, 2000);

    // Chat-Eingabe
    const chatInputField = document.getElementById("chat-input-field");
    chatInputField.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            const message = chatInputField.value.trim();
            if (message) {
                let name = currentUser.username;
                let isSub = false;
                if (currentUser.subs && currentUser.subs.includes(streamerName)) {
                    name += "🔥";
                    isSub = true;
                }
                addMessageToChat(name, message, isSub);
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
    "WHATS UP CHATTTTTT",
    "Sub hype! 🔥",
    "Best stream ever!",
    "Love this community!",
    "Streamer deserves more subs!",
    "That play was insane!",
    "Froggo squad unite!",
    "Can we get some hype in the chat?",
    "If this website was a schoolproject I'd deffenitely rate it an A!!🐸"
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
    "Roland",
    "Giganinja🔥",
    "SubKing🔥",
    "NightOwl🔥",
    "VIPFrog🔥",
    "Legend27🔥",
    "EpicSub🔥",
    "ProViewer🔥",
    "HypeMaster🔥",
    "FroggoSub🔥",
    "SiegeSub🔥",
    "QuizChampion🔥"
];

function addMessageToChat(username, message, isSub = false) {
    const chatMessages = document.getElementById("chat-messages");
    const newMessage = document.createElement("p");
    // Prüfe, ob Username eine Flamme enthält oder isSub true ist
    if (isSub || username.includes("🔥")) {
        newMessage.classList.add("sub-message");
    }
    newMessage.innerHTML = `<span class="user">${username}:</span> ${message}`;
    chatMessages.appendChild(newMessage);
    chatMessages.scrollTop = chatMessages.scrollHeight;
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

//Streamer random live und offline gehen wenn die Seite geladen ist
function updateStreamerBoxes() {
    const liveSection = document.querySelector('.live-section');
    const offlineSection = document.querySelector('.offline-section');

    // Leere die Live- und Offline-Bereiche
    liveSection.innerHTML = '<h3>Live</h3>';
    offlineSection.innerHTML = '<h3>Offline</h3>';

    // Hole die Follower des aktuellen Benutzers
    const followedStreamers = currentUser.followers || [];

    // Füge nur die Streamer hinzu, denen der Benutzer folgt
    [...fn_streamer, ...r6_streamer].forEach(streamer => {
        if (!followedStreamers.includes(streamer.Name)) return;

        const streamerBox = document.createElement('div');
        streamerBox.className = 'stream-box';
        streamerBox.innerHTML = `
            <div class="stream-info">
                <img src="${streamer.Pf}" alt="${streamer.Name}" class="stream-profile">
                <div class="stream-texts">
                    <div class="stream-name">@${streamer.Name}</div>
                </div>
            </div>
        `;

        if (streamer.Status) {
            streamerBox.addEventListener('click', () => {
                loadStreamFullscreen(streamer.Stream, streamer.Name, streamer.Streamtitle || "Cooler Stream", streamer.Pf);
            });
            liveSection.appendChild(streamerBox);
        } else {
            offlineSection.appendChild(streamerBox);
        }
    });
}

// Funktion zum Aktualisieren des Streamer-Status
function updateStreamerStatus() {
    fn_streamer.forEach(streamer => {
        if (streamer.Status) {
            // Wenn der Streamer live ist, hat er eine 50% Chance offline zu gehen
            if (Math.random() < 0.5) {
                streamer.Status = false;
            }
        } else {
            // Wenn der Streamer offline ist, hat er eine 30% Chance live zu gehen
            if (Math.random() < 0.3) {
                streamer.Status = true;
            }
        }
    });

    r6_streamer.forEach(streamer => {
        if (streamer.Status) {
            // Wenn der Streamer live ist, hat er eine 50% Chance offline zu gehen
            if (Math.random() < 0.5) {
                streamer.Status = false;
            }
        } else {
            // Wenn der Streamer offline ist, hat er eine 30% Chance live zu gehen
            if (Math.random() < 0.3) {
                streamer.Status = true;
            }
        }
    });
    updateStreamerBoxes();
}

document.addEventListener("DOMContentLoaded", () => {
    // Setze den Status der Streamer beim Laden der Seite
    fn_streamer.forEach(streamer => {
        streamer.Status = Math.random() < 0.4;
    });
    r6_streamer.forEach(streamer => {
        streamer.Status = Math.random() < 0.4;
    });

    // Starte den Intervall, um den Status alle 2 Minuten zu aktualisieren
    setInterval(updateStreamerStatus, 2 * 60 * 1000);

    loadPage();
});

/*******************************************************
 * 
 *                       Quiz
 * 
 *******************************************************/
function loadQuizPageFn() {
    content.innerHTML = `
        <div class="quizfn-background">
            <div class="quiz-center">
                <img src="../Z-extra/pics/fortnite/Fortnite.png" alt="Fortnite Logo" class="quiz-logo">
                <button onclick="loadQuestionFn()" class="button" id="play"><span id="readyb">Ready</span></button>
                <button class="back-btn" onclick="loadPage()">Back</button>
            </div>
        </div>
    `;
}

function loadQuizPageR6() {
    content.innerHTML = `
        <div class="quizr6-background">
            <div class="quiz-center">
                <img src="../Z-extra/pics/r6/logo.png" alt="R6 Logo" class="quiz-logo">
                <button onclick="loadQuestionR6()" class="button" id="play"><span id="readyb">Ready</span></button>
                <button class="back-btn" onclick="loadPage()">Back</button>
            </div>
        </div>
    `;
}

let lastFnQuestionIndex = null;
let lastR6QuestionIndex = null;

function loadQuestionFn() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quizQuestionsFn.length);
    } while (quizQuestionsFn.length > 1 && randomIndex === lastFnQuestionIndex);
    lastFnQuestionIndex = randomIndex;
    const question = quizQuestionsFn[randomIndex];

    content.innerHTML = `
        <div class="quizfn-background">
            <div class="question-container">
                <h2 class="styled-question">${question.question}</h2>
                <div class="styled-options">
                    ${question.options.map((option, i) => `
                        <button class="styled-btn" onclick="checkAnswer(${randomIndex}, ${i}, 'fn')">${option}</button>
                    `).join('')}
                </div>
                <button class="back-btn styled-back" onclick="loadPage()">Back</button>
            </div>
        </div>
    `;
}

function loadQuestionR6() {
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * quizQuestionsR6.length);
    } while (quizQuestionsR6.length > 1 && randomIndex === lastR6QuestionIndex);
    lastR6QuestionIndex = randomIndex;
    const question = quizQuestionsR6[randomIndex];

    content.innerHTML = `
        <div class="quizr6-background">
            <div class="question-container">
                <h2 class="styled-question">${question.question}</h2>
                <div class="styled-options">
                    ${question.options.map((option, i) => `
                        <button class="styled-btn" onclick="checkAnswer(${randomIndex}, ${i}, 'r6')">${option}</button>
                    `).join('')}
                </div>
                <button class="back-btn styled-back" onclick="loadPage()">Back</button>
            </div>
        </div>
    `;
}

function checkAnswer(questionIndex, selectedOption, quizType) {
    const questionArray = quizType === 'fn' ? quizQuestionsFn : quizQuestionsR6;
    const question = questionArray[questionIndex];

    const buttons = document.querySelectorAll('.styled-btn');

    buttons.forEach((button, index) => {
        if (index === question.correctAnswer) {
            button.style.backgroundColor = 'green';
        } else if (index === selectedOption) {
            button.style.backgroundColor = 'red';
        }
        button.disabled = true;
    });

    if (selectedOption === question.correctAnswer) {
        AccountManager.addPoints(10);
    }

    setTimeout(() => {
        if (quizType === 'fn') {
            loadQuestionFn();
        } else {
            loadQuestionR6();
        }
    }, 3000);
}

/*******************************************************
 * 
 *                       Questions
 * 
 *******************************************************/
const quizQuestionsFn = [
    {
        question: "What is the maximum number of players in a Fortnite Battle Royale match?",
        options: ["50", "100", "150", "200"],
        correctAnswer: 1
    },
    {
        question: "What is the name of the in-game currency in Fortnite?",
        options: ["V-Bucks", "Coins", "Credits", "Tokens"],
        correctAnswer: 0
    },
    {
        question: "What year was Fortnite Battle Royale released?",
        options: ["2015", "2016", "2017", "2018"],
        correctAnswer: 2
    },
    {
        question: "What is the name of the storm in Fortnite?",
        options: ["The Circle", "The Eye", "The Storm", "The Zone"],
        correctAnswer: 2
    },
    {
        question: "What is the name of the creative mode in Fortnite?",
        options: ["Sandbox", "Creative", "Build Mode", "Free Play"],
        correctAnswer: 1
    },
    {
        question: "Which weapon rarity is the rarest in Fortnite?",
        options: ["Legendary", "Epic", "Rare", "Mythic"],
        correctAnswer: 3
    },
    {
        question: "What vehicle was vaulted and then returned in Chapter 2?",
        options: ["Shopping Cart", "Quadcrasher", "Baller", "Golf Cart"],
        correctAnswer: 2
    },
    {
        question: "Which of these is NOT a Fortnite location?",
        options: ["Tilted Towers", "Dusty Depot", "Pleasant Park", "Sunny Shores"],
        correctAnswer: 3
    },
    {
        question: "Which season introduced the Battle Pass?",
        options: ["Season 1", "Season 2", "Season 3", "Season 4"],
        correctAnswer: 1
    },
    {
        question: "What is the name of the Fortnite island?",
        options: ["Apollo", "Athena", "Artemis", "Olympus"],
        correctAnswer: 1
    }
];

const quizQuestionsR6 = [
    {
        question: "Which operator in Rainbow Six Siege is known for using a sledgehammer?",
        options: ["Sledge", "Thermite", "Ash", "Mute"],
        correctAnswer: 0
    },
    {
        question: "Which Rainbow Six Siege map is set on a plane?",
        options: ["Plane", "Airplane", "Presidential Plane", "Skyline"],
        correctAnswer: 2
    },
    {
        question: "Which Rainbow Six Siege operator can deploy a mounted LMG?",
        options: ["Tachanka", "Fuze", "Kapkan", "Blitz"],
        correctAnswer: 0
    },
    {
        question: "Which Rainbow Six Siege operator uses a drone to detect enemies?",
        options: ["Twitch", "IQ", "Echo", "Dokkaebi"],
        correctAnswer: 0
    },
    {
        question: "Which Rainbow Six Siege operator can hack enemy cameras?",
        options: ["Dokkaebi", "Vigil", "Mozzie", "Echo"],
        correctAnswer: 0
    },
    {
        question: "Which operator can place barbed wire?",
        options: ["Jäger", "Bandit", "Smoke", "All defenders"],
        correctAnswer: 3
    },
    {
        question: "What is the name of the in-game currency in Rainbow Six Siege?",
        options: ["Siege Points", "R6 Credits", "Rainbow Coins", "Siege Bucks"],
        correctAnswer: 1
    },
    {
        question: "Which operator has the gadget 'Black Eye'?",
        options: ["Pulse", "Valkyrie", "Frost", "Echo"],
        correctAnswer: 1
    },
    {
        question: "Which map is set in Japan?",
        options: ["Kanal", "Skyscraper", "Theme Park", "Villa"],
        correctAnswer: 1
    },
    {
        question: "Which attacker can breach reinforced walls?",
        options: ["Ash", "Thermite", "Twitch", "IQ"],
        correctAnswer: 1
    }
];
/*******************************************************
 * 
 *                      Settings
 * 
 *******************************************************/
function loadSettingsPage() {
    content.innerHTML = `
        <header class="top-bar settings-header">
            <div onclick="loadPage()" class="logo">🐸 Froggo</div>
        </header>

        <main class="settings-main">
            <div class="profile-settings">
                <img src="../Z-extra/pics/profilePic/${currentUser.pp}" alt="Profilbild" class="settings-profile-pic" id="profile-pic-preview">

                <h2>${currentUser.username}</h2>
                <div class="user-points" style="font-size:1.3em; margin-bottom:1em;">
                    🪙 Punkte: <span id="userPoints">${currentUser.points || 0}</span>
                </div>

                <div class="settings-options">
                    <label>📝 New name:
                        <input type="text" id="new-username" placeholder="Neuer Name" value="${currentUser.username}">
                    </label>

                    <label>🔑 New passwort:
                        <input type="password" id="new-password" placeholder="Mind. 4 Zeichen">
                    </label>

                    <label>🖼️ New Profilepic:
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

                    <button onclick="saveSettings()">✅ Save changes</button>
                    <button onclick="loadPage()">🔙 Back</button>
                    <button onclick="openMoreOptions()" style="background:#e0e0e0;color:#222;">⚙️ Mehr Optionen</button>

                    <div id="save-confirmation" style="display: none; margin-top: 2vh; color: green; font-weight: bold;">✅ Changes saved!</div>
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

function toggleDarkMode() {
    document.body.classList.toggle('darkmode');
    if (document.body.classList.contains('darkmode')) {
        localStorage.setItem('darkmode', '1');
    } else {
        localStorage.removeItem('darkmode');
    }

    const btn = document.getElementById('darkmode-btn') || document.getElementById('darkmode-toggle');
    if (btn) {
        btn.textContent = document.body.classList.contains('darkmode') ? "☀️ Light Mode" : "🌙 Dark Mode";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    if (localStorage.getItem('darkmode')) {
        document.body.classList.add('darkmode');
    }
});

function openMoreOptions() {
    const overlay = document.createElement('div');
    overlay.className = 'options-overlay';

    const box = document.createElement('div');
    box.className = 'options-box';
    box.innerHTML = `
        <h2 style="margin-top:0;">Mehr Optionen</h2>
        <button id="darkmode-toggle" class="darkmode-btn">
            ${document.body.classList.contains('darkmode') ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
        <button id="logout-btn" class="logout-btn">
            🚪 Logout
        </button>
        <button id="close-more-options" class="close-btn">
            Schließen
        </button>
    `;

    overlay.appendChild(box);
    document.body.appendChild(overlay);

    document.getElementById('darkmode-toggle').onclick = () => {
        toggleDarkMode();
        document.getElementById('darkmode-toggle').textContent =
            document.body.classList.contains('darkmode') ? "☀️ Light Mode" : "🌙 Dark Mode";
    };
    document.getElementById('logout-btn').onclick = () => logoutUser();
    document.getElementById('close-more-options').onclick = () => overlay.remove();
    overlay.onclick = e => { if (e.target === overlay) overlay.remove(); };
}

function logoutUser() {
    localStorage.removeItem('loggedInUser');
    window.location.href = "../1_login-register/login-index.html";
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
