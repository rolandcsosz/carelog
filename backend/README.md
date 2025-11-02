# Activity Log App - Backend

## Local dev setup

1. Clone the repository
2. Open backend directory by running `cd backend`
3. Run `npm install`
4. Create a .env file in the backend directory based on the provided .env.example file and set the required environment variables. Other variables can be find in .env.dev file if you want to change the default db settings from localhost to something else.
5. To generate prism client run `npm run generate:client`
6. To init empty databse or create init migration file run `npm run generate:migration`
7. Start the server by running `npm run dev`
8. The backend server will be running at `http://localhost:8080`

## Running the server in docker

1. Clone the repository
2. Open the backend directory.
3. Create a .env file in the backend directory based on the provided .env.docker file and set the required environment variables. Other variables can be find in .env.prod file if you want to change the default db settings from containerized access to something else.
4. Run `docker-compose up -d` to start the server in docker.
5. The backend server will be running at `http://localhost:8080`

## Getting Access Tokens

1. OpenAI Access Token
   - Go to your OpenAI account settings.
   - Find your API key (it acts as the access token).
   - Copy it — you’ll need it for your application.
2. Google OAuth Credentials
    - Go to the Google Cloud Console and create a new project.
    - In the APIs & Services → Credentials section, create OAuth 2.0 Client IDs.
    - Download the credentials file — it should be named `google.json` and placed in your backend directory.
    - Run the following command: `node ./scripts/getGoogleToken.js`
    - The OAuth 2.0 access token will be printed in the console.
