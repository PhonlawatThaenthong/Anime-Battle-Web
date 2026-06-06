# ⚔️ Anime Battle

A sleek, tournament-style "pick your favorite" web game featuring **130+ anime titles**. Two anime are presented side-by-side — choose the one you prefer, and the loser is eliminated. Keep picking until a single champion remains!

![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## ✨ Features

### 🎮 Core Gameplay
- **Tournament-style elimination** — two anime face off each round; the loser is permanently eliminated
- **Randomized pools** — each game draws a configurable subset (4–130) from the full database, so no two games are alike
- **Round tracking** — live round counter and remaining anime count displayed in the header
- **Winner celebration** — animated crown, glowing golden border, and pulsing effects when a champion is crowned

### 🎬 YouTube Trailer Previews
- **Hover-to-preview** — hover on any panel for 600ms to auto-load the anime's official trailer via YouTube embed
- **Multi-key API rotation** — supports multiple YouTube Data API v3 keys with automatic rotation when daily quota is exhausted
- **Volume control** — adjustable trailer volume with live slider and persistent settings

### 📊 Dashboard & History
- **Win leaderboard** — ranked list of all anime that have won a matchup, sorted by total wins
- **Recent picks** — timeline of most recently chosen anime with relative timestamps
- **Champion tracker** — dedicated tab for anime that have won an entire tournament, with championship counts
- **Aggregate stats** — total games played, total rounds, unique winners, and all-time champion
- **Persistent history** — all stats saved to `localStorage` and persist across sessions

### ⚙️ Settings
- **Pool size slider** — adjust how many anime are drawn per game (4 to full database)
- **Admin-gated API keys** — password-protected settings panel for managing YouTube API keys
- **Game log** — filterable log of all wins and losses per session

### 🎨 Design
- **Dark theme** — deep `#0a0a0f` background with glassmorphism modals and subtle gradients
- **Animated panels** — hover-expand effect, background zoom, brightness/saturation shifts
- **Color-coded sides** — left panel uses `#ff2d55` (red), right uses `#00e5ff` (cyan)
- **Google Fonts** — Bebas Neue for headings, Noto Sans JP for body text (supports Japanese titles)
- **Responsive layout** — adapts to various screen sizes with `clamp()` typography

---

## 🚀 Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Edge, Safari)
- *(Optional)* A [YouTube Data API v3](https://console.cloud.google.com/) key for trailer previews

### Run Locally

```bash
# Clone the repository
git clone https://github.com/your-username/animebattle.git
cd animebattle

# Open in browser — no build step needed!
# Simply open the HTML file directly:
start Anime-Battle-Web/anime-battle/index.html     # Windows
open Anime-Battle-Web/anime-battle/index.html       # macOS
xdg-open Anime-Battle-Web/anime-battle/index.html   # Linux
```

Or serve with any static file server:

```bash
# Using Python
python -m http.server 8080 -d Anime-Battle-Web/anime-battle

# Using Node.js (npx)
npx serve Anime-Battle-Web/anime-battle
```

Then open `http://localhost:8080` in your browser.

---

## 📁 Project Structure

```
Anime-Battle-Web/
└── anime-battle/
    ├── index.html          # Main HTML — arena, modals (settings, dashboard, log)
    ├── css/
    │   └── style.css       # Full design system — dark theme, animations, responsive
    └── js/
        ├── anime-data.js   # Database of 130+ anime (title, Japanese name, genre)
        ├── auth.js         # Admin password gate (SHA-256 via Web Crypto API)
        ├── settings.js     # Volume control, API key management, pool size config
        ├── dashboard.js    # Win history, champion tracking, stats rendering
        ├── ui.js           # Panel rendering, choose logic, toast, game log
        └── game.js         # Core engine — image fetching (Jikan API), YouTube
                            # trailer loading, pool management, game flow
```

---

## 🔑 YouTube Trailer Setup (Optional)

Trailer previews require a YouTube Data API v3 key. Each key provides **~100 search requests per day** (free tier).

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable **YouTube Data API v3**
3. Create an API key under **Credentials**
4. In the game, click ⚙️ **Settings** → unlock with admin password → add your key(s)

> **Tip:** Add multiple API keys for more daily quota. The game automatically rotates to the next available key when one is exhausted.

---

## 🛠️ Tech Stack

| Layer       | Technology                                                      |
| ----------- | --------------------------------------------------------------- |
| Structure   | HTML5 (semantic elements)                                       |
| Styling     | Vanilla CSS (custom properties, `clamp()`, animations, glassmorphism) |
| Logic       | Vanilla JavaScript (ES6+ modules, `async`/`await`)              |
| Fonts       | Google Fonts (Bebas Neue, Noto Sans JP)                         |
| Images      | [Jikan API](https://jikan.moe/) (unofficial MyAnimeList API)    |
| Trailers    | YouTube Data API v3 + YouTube IFrame embed                      |
| Storage     | `localStorage` for history, settings, and API keys              |
| Auth        | Web Crypto API (SHA-256 password hashing)                       |

---

## 📜 API Usage

| API | Purpose | Rate Limit |
|-----|---------|------------|
| [Jikan v4](https://docs.api.jikan.moe/) | Fetches anime cover images | 3 req/s (with automatic retry on 429) |
| [YouTube Data API v3](https://developers.google.com/youtube/v3) | Searches for official trailers | 100 req/day per key (free tier) |

---

## 🎮 How to Play

1. **Open the game** — two random anime appear side by side
2. **Choose your favorite** — click on a panel or the "▶ เลือกฝั่งนี้" button
3. **The loser is eliminated** — they won't appear again this game
4. **Keep picking** — rounds continue until only one anime remains
5. **👑 Champion!** — the final survivor is crowned the ultimate winner
6. **Check the dashboard** — click 🏆 to see your win history and stats
7. **Play again** — hit "▶ เล่นใหม่อีกครั้ง" for a fresh randomized tournament

---

## 📝 License

This project is open source. Feel free to fork, modify, and share.

---

<p align="center">
  Made with ❤️ for anime fans everywhere
</p>
