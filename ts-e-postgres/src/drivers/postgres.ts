import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const conn = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT),
  ssl: { rejectUnauthorized: false },
});

const queryExecute = async <T>(text: string, params?: any[]): Promise<T[]> => {
  const { rows } = await conn.query<T>(text, params);
  return rows;
};

export default queryExecute;
