import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';

/**
 * The database client.
 * This is used to connect to the Turso database.
 */
const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

/**
 * The Drizzle ORM instance.
 * This is used to interact with the database.
 */
export const db = drizzle(client, { schema });

/**
 * The type of the database instance.
 * This is useful for type-checking database queries.
 */
export type Database = typeof db;