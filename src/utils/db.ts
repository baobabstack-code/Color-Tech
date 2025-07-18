import { Pool } from "pg";
import { dbConfig } from "@/config/database";

// Create a PostgreSQL connection pool
const pool = new Pool(dbConfig);

export default pool;
