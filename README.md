# BeyondChats Enhancer
## Project Overview
This project is a submission for the BeyondChats Full Stack Developer Intern assignment. It consists of a Node.js backend for scraping and AI enhancement, and a React frontend for displaying the articles.

## Architecture
- **Backend**: Node.js, Express, MongoDB
  - **Scraper**: Cheerio (Generic + Blog specific), Puppeteer (Google Search fallback)
  - **AI**: Google Gemini (via `@google/generative-ai`)
- **Frontend**: React (Vite), Tailwind CSS

## Prerequisites
- Node.js (v14+)
- MongoDB (running locally or URI)
- Google Gemini API Key

## Setup Instructions

### 1. clone the repository
```bash
git clone <repo-url>
cd beyondchats-assignment
```

### 2. Backend Setup
1. Navigate to backend:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment:
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - **Database Setup**:
     - If using **MongoDB Atlas**, get your connection string from the Atlas dashboard (Driver: Node.js) and paste it into `MONGO_URI`.
     - Example: `mongodb+srv://user:pass@cluster...`
   - **Crucial**: Add your `GEMINI_API_KEY` to `.env`.

4. Start the Server:
   ```bash
   npm start
   ```
   Server runs on `http://localhost:5000`.

### 3. Frontend Setup
1. Navigate to frontend:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Development Server:
   ```bash
   npm run dev
   ```
   Access the app at `http://localhost:5173`.

## Documentation
- [**API Documentation**](docs/API.md): Detailed endpoints and usage.
- [**Architecture Overview**](docs/ARCHITECTURE.md): System components and data flow explanation.
- [**Hosting Guide**](docs/HOSTING.md): Instructions for deploying for free.

## Features
- **Phase 1**: Scrapes 5 oldest articles from BeyondChats blogs.
- **Phase 2**: AI Enhancement.
  - Run the enhancement script:
    ```bash
    cd backend
    node scripts/runEnhancement.js
    ```
  - This searches Google for the article title, scrapes top external results, and uses Gemini to rewrite the article with citations.
- **Phase 3**: Responsive Frontend to view Original vs Enhanced content.

## Project Structure
```
beyondchats-assignment/
├── backend/
│   ├── config/         # DB setup
│   ├── controllers/    # API logic
│   ├── models/         # Mongoose models
│   ├── routes/         # Express routes
│   ├── scripts/        # Phase 2 Enhancement Script
│   ├── services/       # Scraper, Search, LLM services
│   └── index.js        # Entry point
└── frontend/
    ├── src/
    │   ├── components/ # ArticleList, ArticleDetail
    │   └── App.jsx     # Routing
    └── ...
```
