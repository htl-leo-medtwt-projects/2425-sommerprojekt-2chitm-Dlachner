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
                <div class="profile-icon">⚫</div>
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