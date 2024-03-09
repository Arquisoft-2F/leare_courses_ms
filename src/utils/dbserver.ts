import { Pool } from "pg";
import dotenv from "dotenv";
dotenv.config();

let db: Pool;

declare global{
    var __db: Pool | undefined;
}

if (!global.__db){

    global.__db = new Pool({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        port: parseInt(process.env.DB_PORT || "") // Parse the DB_PORT value as a number
    });
}

db = global.__db;

export { db }