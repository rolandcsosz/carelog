# Digital Logging with Voice Input and LLM-based Advisory in Social Care

This repository contains the source code for the thesis titled **"Digitális naplózás hangbevitellel és LLM-alapú tanácsadás a szociális ellátásban"** (Digital Logging with Voice Input and LLM-based Advisory in Social Care).

The system consists of three main components:

1. **Frontend:** Ionic + React mobile application.
1. **Backend:** Node.js + Express + PostgreSQL API server.
2. **RAG Module:** Python-based embedding generator for the AI advisory system.

## Project Structure

* **[frontend/](./frontend/README.md)** - Source code for the Mobile App.
* **[backend/](./backend/README.md)** - Source code for the API Server.
* **[backend/rag/](./backend/rag/README.md)** - Python scripts for document processing (RAG).

## Quick Start (Docker)

The project is configured to run easily using Docker Compose from the root directory.

### Prerequisites

* Docker & Docker Compose installed.
* A valid **Google Gemini API Key**.

### Setup With Seeded Data

1. **Configure Backend:**
    Go to `backend/` directory, create a `.env` file from the template, and **add your API Key**.

    ```bash
    cd backend
    cp .env.prod .env
    # Open .env and set GOOGLE_API_KEY=...
    ```

1. **Run the System:**
    Go back to the root directory and start the services.

    ```bash
    cd ..
    ./run.sh # On Windows, use run.bat
    ```

1. **Access:**
    * **App:** [http://localhost](http://localhost) (Frontned)
    * **API:** [http://localhost:8080](http://localhost:8080) (Backend)

For testing use the following default admin user credentials:
* **Username:** admin@admin.hu
* **Password:** pw123

For every seeded user, the password is `pw123`.

For detailed installation instructions (including manual setup and mobile builds), please refer to **[INSTALL.md](./INSTALL.md)**.

## License

Copyright © 2025 *Roland Csősz*. All rights reserved.

This project was developed as a BSc Thesis at the Budapest University of Technology and Economics (BME VIK).