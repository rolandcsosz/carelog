# Installation & Setup Guide

This guide describes how to set up and run the "Activity Log App" system.

## System Requirements

* **Docker Desktop** (Recommended for easiest setup)
* **Node.js v18+** (Only for local development without Docker)
* **Python 3.9+** (Only for RAG module data processing)
* **Google Gemini API Key** (Required for AI features)

---

## Running with Docker (Recommended)

The root `docker-compose.yml` orchestrates both the Frontend and Backend services using the configuration defined in their respective directories.

### Step 1: Backend Configuration

The backend needs environment variables to function (Database URL, API Keys).

1. Navigate to the backend directory:

    ```bash
        cd backend
    ```

1. Create the `.env` file based on the Docker template:
    * **Linux/Mac:** `cp .env.example .env`
    * **Windows:** Copy `.env.example` and rename it to `.env`.

1. Open the `.env` file and set your `GOOGLE_API_KEY`.

1. Update the `.env.prod` or `.env.dev` files if you need to change database connection settings.

### Step 2: Start the Application

1. Navigate back to the **root directory** of the project.

1. Run the compose command:

    ```bash
    docker-compose up -d --build
    ```

    *This command uses the `extends` feature to pull service definitions from `frontend/docker-compose.yml` and `backend/docker-compose.yml`.*

### Step 3: Access the Application

* **Frontend (App):** Open [http://localhost](http://localhost) in your browser.
* **Backend (API):** Accessible at [http://localhost:8080](http://localhost:8080).

---

## Local Development (Manual Setup)

If you wish to run the services individually without Docker.

### 1. Backend Setup

1. `cd backend`
1. `npm install`
1. `cp .env.example .env` (and fill in the variables, including DB connection)
1. `npm run generate:client` (Prisma generation)
1. `npm run generate:migration` (DB init)
1. `npm run dev`

### 2. Frontend Setup

1. `cd frontend`
1. `npm install`
1. Check `src/env.ts` to ensure `API_URL` points to your backend (default `http://localhost:8080`).
1. `npm run dev` -> App opens at `http://localhost:5173`.

---

## RAG Module (Data Processing)

The RAG module (Python) is responsible for processing PDF documents into vector embeddings. The project comes with pre-generated embeddings in `backend/rag/data/embeddings`. You only need to run this if you want to add new documents.

1. Navigate to `backend/rag`.
1. Install requirements: `pip install -r requirements.txt`.
1. Create `.env` and add `GOOGLE_API_KEY`.
1. Run `python generate.py` to regenerate embeddings.

For detailed instructions, see [backend/rag/README.md](./backend/rag/README.md).

---

## Mobile Build (iOS / Android)

To build the native mobile applications, you need the native SDKs (Xcode for iOS, Android Studio for Android).

1. Navigate to `frontend`.
1. **iOS:** `npm run generate:ios` (then open `ios/App/App.xcworkspace` in Xcode).
1. **Android:** `npm run generate:android` (then open `android/` in Android Studio).

For detailed signing and release instructions, see [frontend/README.md](./frontend/README.md).