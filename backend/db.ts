import pkg from "pg";
const { Pool } = pkg;
import pgTypes from "pg-types";
import dotenv from "dotenv";
import { seed, initAdminIfNeeded, initMimeTypesIfNeeded } from "./prisma/seed.js";
import { getErrorMessage } from "./utils.js";

dotenv.config();

pgTypes.setTypeParser(pkg.types.builtins.INT2, (val) => parseInt(val, 10));
pgTypes.setTypeParser(pkg.types.builtins.INT4, (val) => parseInt(val, 10));
pgTypes.setTypeParser(pkg.types.builtins.INT8, (val) => parseInt(val, 10));
pgTypes.setTypeParser(pkg.types.builtins.FLOAT4, (val) => parseFloat(val));
pgTypes.setTypeParser(pkg.types.builtins.FLOAT8, (val) => parseFloat(val));
pgTypes.setTypeParser(pkg.types.builtins.NUMERIC, (val) => parseFloat(val));

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    host: process.env.DB_HOST || "postgres",
    port: process.env.POSTGRES_PORT ? parseInt(process.env.POSTGRES_PORT, 10) : 5432,
    database: process.env.POSTGRES_DB,
});

async function connectWithRetry(): Promise<void> {
    try {
        const client = await pool.connect();
        console.log("✔ Connected to PostgreSQL!");
        await initAdminIfNeeded();
        await initMimeTypesIfNeeded();

        if (process.env.INIT_PG_DATA === "true") {
            try {
                seed();
                console.log("✔ Seeding completed successfully.");
            } catch (seedError) {
                console.error("✖ Seeding failed:", seedError);
            }
        }

        client.release();
    } catch (err) {
        console.error("✖ PostgreSQL connection failed:", getErrorMessage(err));
        setTimeout(connectWithRetry, 5000);
    }
}

connectWithRetry();

export default pool;
