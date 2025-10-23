const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user:  process.env.DB_USER,
  password: process.env.DB_PASSWORD, 
  host: 'postgres',
  port: process.env.DB_PORT,
  database: process.env.DB_NAME
});

function connectWithRetry() {
  pool.connect()
    .then(client => {
      console.log("You are connected to PostgreSQL!");
      client.release(); 
    })
    .catch(error => {
      console.error("PostgreSQL is not connected: ", error.message);
      setTimeout(connectWithRetry, 5000); 
    });
}


connectWithRetry();

module.exports = {
  pool
};