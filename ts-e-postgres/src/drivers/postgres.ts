import { Pool } from "pg";

const conn = new Pool({
  host: process.env.PG_HOST,
  database: process.env.PG_DATABASE,
  user: process.env.PG_USER,
  password: process.env.PG_PASSWORD,
  port: parseInt(process.env.PG_PORT),
});

const query = async <T>(text: string, params?: any[]): Promise<T[]> => {
  const { rows } = await conn.query<T>(text, params);
  return rows;
};

export default query;
