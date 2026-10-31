# 🍽️ TasteMatch AI
### Different Tastes. One Great Adventure.

**TasteMatch AI** is a cultural discovery application powered by the Qloo API that helps two people discover restaurants and shared experiences based on their individual preferences.

Instead of recommending places for just one person, TasteMatch AI compares two taste profiles, identifies shared interests, and helps users find experiences they can both enjoy.

Built for the **Qloo Agentic Hackathon 2026**.

## 🌐 Live Demo

**Try TasteMatch AI:** https://taste-match-snowy.vercel.app/

**GitHub Repository:** https://github.com/Mallikarjun-developer/TasteMatch

## 💡 The Problem

Planning an outing with someone who has different interests can be frustrating.

One person loves Indian food, while the other prefers Italian. One enjoys quiet cafés, while the other wants lively restaurants.

Most recommendation systems focus on individual preferences rather than shared experiences.

**TasteMatch AI aims to make discovering experiences together easier, fairer, and more enjoyable.**

## ✨ Features

### 🧬 Cultural Taste DNA

Compare two people's cultural preferences to understand their similarities and differences.

TasteMatch AI helps users discover where their interests overlap and where they might enjoy trying something new.

### 🍽️ Qloo-Powered Restaurant Discovery

Integrates the Qloo API to retrieve restaurant recommendations.

The application combines restaurant information with user preferences to help identify experiences that may appeal to both people.

### ⚖️ FairMatch Scoring

Evaluates recommendations from both users' perspectives.

The goal is to find balanced options instead of prioritizing only one person's preferences.

### 🤝 Taste Negotiation

Explore different ways to balance two people's preferences when they disagree.

Taste Negotiation encourages collaborative decision-making and helps users discover alternatives.

### 🗺️ Adventure Planner

Explore outing ideas inspired by the users' shared interests and restaurant recommendations.

### ❤️ Favorites and Sharing

Save interesting recommendations and share discoveries with others.

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite |
| Styling | CSS |
| Backend | Node.js, Express.js |
| Cultural Intelligence | Qloo API |
| API Communication | REST |
| Frontend Hosting | Vercel |
| Backend Hosting | Render |
| Version Control | Git, GitHub |

## 🏗️ System Architecture

```text
             ┌─────────────────────┐
             │        Users        │
             │   Person A and B    │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │   React Frontend    │
             │   TypeScript/Vite   │
             │      (Vercel)       │
             └──────────┬──────────┘
                        │
                        ▼
             ┌─────────────────────┐
             │   Express Backend   │
             │      (Render)       │
             └──────────┬──────────┘
                        │
             ┌──────────┴──────────┐
             ▼                     ▼
    ┌─────────────────┐   ┌──────────────────┐
    │    Qloo API     │   │ Taste Comparison │
    │ Cultural Data   │   │ FairMatch Logic  │
    └─────────────────┘   └──────────────────┘
```

### How It Works

1. Two users enter their cultural preferences.
2. TasteMatch AI compares their interests.
3. The backend requests restaurant information from Qloo.
4. The application evaluates recommendations using its preference-matching logic.
5. Users explore Cultural Taste DNA, FairMatch scores, and negotiation options.
6. Users can explore outing ideas and save or share recommendations.

## 📁 Project Structure

```text
TasteMatch/
│
├── frontend/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── backend/
│   ├── server.js
│   └── package.json
│
└── README.md
```

The structure above highlights the main application files; additional configuration files may also be present.

## 🚀 Getting Started

### Prerequisites

Before running the project locally, install:

- Node.js
- npm
- Git
- Visual Studio Code (recommended)
- A Qloo API key

### 1. Clone the Repository

```bash
git clone https://github.com/Mallikarjun-developer/TasteMatch.git
cd TasteMatch
```

### 2. Configure the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside the `backend` folder.

Add the following environment variables:

```env
QLOO_API_KEY=your_qloo_api_key_here
QLOO_BASE_URL=https://hackathon.api.qloo.com
PORT=3001
NODE_ENV=development
```

**Security:** Never commit your actual API key or `.env` file to GitHub.

Start the backend:

```bash
node server.js
```

The backend should run at:

```text
http://localhost:3001
```

### 3. Configure the Frontend

Open a second terminal.

Navigate to the frontend directory:

```bash
cd TasteMatch/frontend
```

If you're already inside the repository's root directory, use:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Create a `.env` file inside `frontend`:

```env
VITE_API_URL=http://localhost:3001
```

Start the frontend:

```bash
npm run dev
```

Open the local URL displayed by Vite, typically:

```text
http://localhost:5173
```

## 🔌 API Endpoints

The Express backend exposes the following endpoints:

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Check backend health |
| GET | `/api/restaurants?city=New%20York` | Retrieve restaurant recommendations |
| POST | `/api/match` | Process matching requests |

### Example Health Check

```bash
curl http://localhost:3001/api/health
```

### Example Restaurant Request

```bash
curl "http://localhost:3001/api/restaurants?city=New%20York"
```

## ☁️ Deployment

TasteMatch AI uses separate frontend and backend deployments.

### Frontend — Vercel

The React application is deployed using Vercel.

Production configuration:

```env
VITE_API_URL=https://tastematch-ai-backend.onrender.com
```

Build settings:

```text
Framework: Vite
Root Directory: frontend
Build Command: npm run build
Output Directory: dist
```

### Backend — Render

The Express API is deployed using Render.

Configuration:

```text
Root Directory: backend
Build Command: npm install
Start Command: node server.js
```

Backend environment variables:

```env
QLOO_API_KEY=your_qloo_api_key_here
QLOO_BASE_URL=https://hackathon.api.qloo.com
NODE_ENV=production
```

Store API credentials securely using Render's environment variable settings.

## 🔐 Security

TasteMatch AI follows several basic security practices:

- Qloo API credentials are stored on the backend.
- API keys are configured using environment variables.
- Frontend requests communicate with the Express API.
- Sensitive `.env` files should be excluded from version control.
- Production services use HTTPS.

## 🎯 Future Improvements

TasteMatch AI has several opportunities for further development:

- **Conversational AI assistant:** Allow users to describe their ideal outing in natural language.
- **Agentic planning:** Introduce an AI agent that can retrieve recommendations, evaluate options, and refine plans through multiple steps.
- **Group matching:** Support groups of friends and families.
- **Expanded cultural discovery:** Include movies, concerts, museums, and other experiences.
- **Improved explanations:** Explain why each recommendation matches both users.
- **More personalized itineraries:** Create richer plans based on location, time, and preferences.
- **Persistent user profiles:** Allow users to return to their saved preferences.

## 🏆 Hackathon

Developed for the **Qloo Agentic Hackathon 2026**.

TasteMatch AI explores how Qloo's cultural intelligence can support shared recommendations and collaborative decision-making.

The current application focuses on cultural preference matching and discovery. Autonomous agent-based planning is a proposed future enhancement.

## 👨‍💻 Developer

**Mallikarjun Hatti**

GitHub: https://github.com/Mallikarjun-developer

## 📄 License

See the repository's `LICENSE` file for the applicable terms, if a license has been added.

---

### ❤️ TasteMatch AI

**Different Tastes. One Great Adventure.**

Helping people discover experiences together, one match at a time.
