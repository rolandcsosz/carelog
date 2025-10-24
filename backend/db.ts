import pkg from "pg";
const { Pool } = pkg;
import pgTypes from "pg-types";
import dotenv from "dotenv";

dotenv.config();

pgTypes.setTypeParser(pkg.types.builtins.INT2, (val) => parseInt(val, 10));
pgTypes.setTypeParser(pkg.types.builtins.INT4, (val) => parseInt(val, 10));
pgTypes.setTypeParser(pkg.types.builtins.INT8, (val) => parseInt(val, 10));
pgTypes.setTypeParser(pkg.types.builtins.FLOAT4, (val) => parseFloat(val));
pgTypes.setTypeParser(pkg.types.builtins.FLOAT8, (val) => parseFloat(val));
pgTypes.setTypeParser(pkg.types.builtins.NUMERIC, (val) => parseFloat(val));

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: process.env.DB_HOST || "postgres",
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    database: process.env.DB_NAME,
});

function connectWithRetry(): void {
    pool.connect()
        .then((client) => {
            console.log("✔ Connected to PostgreSQL!");
            client.release();
        })
        .catch((error) => {
            console.error("✖ PostgreSQL connection failed:", error.message);
            setTimeout(connectWithRetry, 5000);
        });
}

connectWithRetry();

export default pool;
