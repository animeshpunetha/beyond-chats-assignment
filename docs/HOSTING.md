# Hosting Guide (Free Tier)

This application can be hosted for free using the following stack:
- **Database**: MongoDB Atlas (Cloud Database)
- **Backend (API)**: Render (using Docker)
- **Frontend (UI)**: Vercel

## 1. Database Setup (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and sign up.
2.  Create a new **Cluster** (select the **Free/Shared** tier, Provider: AWS, Region: closest to you).
3.  **Network Access**: Allow access from anywhere (`0.0.0.0/0`).
4.  **Database Access**: Create a database user (username/password).
5.  **Connect**: Get the connection string (Choose "Drivers" -> "Node.js").
    -   Format: `mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

## 2. Backend Hosting (Render)
We use Render to host the Node.js backend. Because we use Puppeteer (which needs Chrome), we will deploy using **Docker**.

1.  Push your code to **GitHub**.
2.  Sign up at [Render](https://render.com).
3.  Click **New +** -> **Web Service**.
4.  Connect your GitHub repository.
5.  **Settings**:
    -   **Root Directory**: `backend` (Important! We are deploying the backend folder).
    -   **Runtime**: **Docker** (Render should auto-detect the `Dockerfile` inside `backend/`).
    -   **Instance Type**: Free.
6.  **Environment Variables** (Add these):
    -   `MONGO_URI`: Your MongoDB connection string (from Step 1).
    -   `GEMINI_API_KEY`: Your Google Gemini API Key.
    -   `PORT`: `5000` (Optional, Render usually sets its own or expects 10000, but our code uses `process.env.PORT`).
7.  Click **Create Web Service**.
8.  Wait for the build to finish. Once live, copy the **Service URL** (e.g., `https://my-backend.onrender.com`).

**Note on Free Tier**: Render's free tier spins down after 15 minutes of inactivity. The first request will take about 30 seconds to wake it up.

## 3. Frontend Hosting (Vercel)
1.  Sign up at [Vercel](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Configure Project**:
    -   **Framework Preset**: Vite (should be auto-detected).
    -   **Root Directory**: Click "Edit" and select `frontend`.
5.  **Environment Variables**:
    -   The frontend needs to know where the backend is.
    -   If your React code hardcoded `localhost:5000`, you must change it to use an environment variable.
    -   **Action Required**: Ensure your Frontend API calls use `import.meta.env.VITE_API_URL`.
    -   Add `VITE_API_URL` -> The generic Render URL from Step 2 (e.g., `https://my-backend.onrender.com`).
6.  Click **Deploy**.

## 4. Final Configuration
If you haven't already, update your Frontend code to use the environment variable for the API URL instead of `localhost`.

**Example `frontend/src/config.js` or similar:**
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
export default API_BASE_URL;
```
Then use this `API_BASE_URL` in your Axios calls.
