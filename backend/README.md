# Activity Log App - Backend

## Local dev setup
1. Clone the repository
2. Open backend directory by running `cd backend`
3. Run `npm install`
4. Create a .env file in the backend directory based on the provided .env.example file and set the required environment variables such as database connection details.
5. Start the development server by running `npm start`
6. The backend server will be running at `http://localhost:8080`
7. For testing purposes, you can use the following admin credentials:
   - email: "admin@example.com"
   - password: "supersecurepassword"

## Running the server in docker
1. Clone the repository
2. Open the backend directory.
3. Create a .env file in the backend directory based on the provided .env.example file and set the required environment variables such as database connection details.
4. Run `docker-compose up -d` to start the server in docker.
5. The backend server will be running at `http://localhost:8080`