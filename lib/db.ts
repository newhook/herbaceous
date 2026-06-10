import { sql } from "@vercel/postgres";

export type DbUser = {
  id: number;
  name: string;
  email: string;
  password_hash: string;
  created_at: string;
};

let schemaReady: Promise<void> | null = null;

// Create the users table on first use. Idempotent and cached per runtime.
export function ensureSchema(): Promise<void> {
  if (!schemaReady) {
    schemaReady = sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password_hash TEXT NOT NULL,
        created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      );
    `.then(() => undefined);
  }
  return schemaReady;
}

export async function getUserByEmail(email: string): Promise<DbUser | null> {
  await ensureSchema();
  const { rows } = await sql<DbUser>`
    SELECT * FROM users WHERE email = ${email.toLowerCase()} LIMIT 1;
  `;
  return rows[0] ?? null;
}

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
): Promise<Pick<DbUser, "id" | "name" | "email">> {
  await ensureSchema();
  const { rows } = await sql<DbUser>`
    INSERT INTO users (name, email, password_hash)
    VALUES (${name}, ${email.toLowerCase()}, ${passwordHash})
    RETURNING id, name, email;
  `;
  return rows[0];
}
