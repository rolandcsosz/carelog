# Activity Log App - Backend

## Local dev setup
1. Clone the repository
2. Open backend directory by running `cd backend`
3. Run `npm install`
4. Create a .env file in the backend directory based on the provided .env.dev file and set the required environment variables such as database connection details. Set `DB_HOST` and `ES_NODE` to `localhost` and `https://localhost:9200` for local development.
5. Build and start the server by running `npm run dev`
6. The backend server will be running at `http://localhost:8080`
7. For testing purposes, you can use the following admin credentials:
   - email: "admin@example.com"
   - password: "supersecurepassword"

## Running the server in docker
1. Clone the repository
2. Open the backend directory.
3. Create a .env file in the backend directory based on the provided .env.docker file and set the required environment variables such as database connection details. Remove or comment out the `DB_HOST` and `ES_NODE` variables to use the default service names defined in the docker-compose file.
4. Run `docker-compose up -d` to start the server in docker.
5. The backend server will be running at `http://localhost:8080`