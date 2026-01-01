# System Architecture

## Overview
The application is designed to scrape blog articles, enhance them using AI with external references, and display them in a responsive frontend.

## Components

### 1. Backend (Node.js/Express)
The backend manages data persistence, scraping logic, and AI integration.

- **Entry Point**: `index.js` - Sets up the Express server and connects to MongoDB.
- **Services**:
    - `scraperService.js`: Uses **Cheerio** to parse HTML from the target blog. It extracts specific selectors (e.g., article body, title).
    - `searchService.js`: Uses **Puppeteer** (or a custom Google Search scraper) to find related articles on the web based on the original article's title.
    - `llmService.js`: Integrates with **Google Gemini (Generative AI)**. It constructs a prompt containing the original article and scooped references to generate an "enhanced" version.
- **Data Storage**: **MongoDB** is used to store article metadata, original content, valid reference links, and the final enhanced text.
- **Scripts**:
    - `scripts/runEnhancement.js`: A standalone script that processes "pending" articles. It orchestrates the search -> scrape refs -> LLM enhancement pipeline.

### 2. Frontend (React/Vite)
A modern, responsive UI built with Tailwind CSS.

- **Pages**:
    - **Dashboard/List**: Displays a grid of scraped articles with their status (Pending/Completed).
    - **Article Detail**: A split-view (or toggled) interface showing the Original vs. Enhanced content side-by-side.
- **Tech Stack**: React 18, Vite, Tailwind CSS, Axios, Lucide React (icons).

## Data Flow

1.  **User Content Ingestion**:
    - User triggers `/api/articles/scrape`.
    - Backend fetches the blog list page, follows links, and saves raw HTML content to MongoDB with status `pending`.

2.  **AI Enhancement (Background Process)**:
    - Admin runs `node scripts/runEnhancement.js`.
    - The script queries MongoDB for `pending` articles.
    - For each article:
        - **Search**: Queries Google for the title.
        - **Reference Scraping**: Visits top results and extracts text.
        - **Generation**: Sends Original + References to Gemini AI.
        - **Save**: Updates the document with `updatedContent` and sets status to `completed`.

3.  **Consumption**:
    - User visits the Frontend.
    - React app fetches articles via `/api/articles`.
    - User selects an article to view the enhanced version.
