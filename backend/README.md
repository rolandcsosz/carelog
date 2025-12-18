# Activity Log App - Backend

## Local dev setup

1. Clone the repository
1. Open backend directory by running `cd backend`
1. Run `npm install`
1. Create a .env file in the backend directory based on the provided .env.example file and set the required environment variables. Other variables can be find in .env.dev file if you want to change the default db settings from localhost to something else.
1. To generate prism client run `npm run generate:client`
1. To init empty databse or create init migration file run `npm run generate:migration`
1. Start the server by running `npm run dev`
1. The backend server will be running at `http://localhost:8080`

## Running the server in docker

1. Clone the repository
1. Open the backend directory.
1. Create a .env file in the backend directory based on the provided .env.prod file and set the required environment variables. Other variables can be find in .env.prod file if you want to change the default db settings from containerized access to something else.
1. Run `docker-compose up -d` to start the server in docker.
1. The backend server will be running at `http://localhost:8080`
