// utils/pool.ts
import { Pool } from "pg";

declare global {
  var _pool: Pool | undefined;
}

if (!global._pool) {
  global._pool = new Pool({
    connectionString: process.env.SUPABASE_DB_URL,
    max: 5,
    idleTimeoutMillis: 10_000,
    connectionTimeoutMillis: 5_000,
    ssl: {
      rejectUnauthorized: false,
    },
  });

  // 👇 Force schema explicitly after connection
  const schema = process.env.SUPABASE_SCHEMA;
  global._pool.on('connect', (client) => {
    client.query(`SET search_path TO ${schema}, public;`).catch(console.error);
  });
}

export const pool = global._pool;
