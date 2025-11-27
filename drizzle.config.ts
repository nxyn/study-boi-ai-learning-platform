import { defineConfig } from 'drizzle-kit';
import type { Config } from 'drizzle-kit';

/**
 * The configuration for Drizzle Kit.
 * This is used to generate the database migrations.
 * @see https://orm.drizzle.team/kit-docs/overview
 */
const dbConfig: Config = defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'turso',
  dbCredentials: {
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
  },
});

export default dbConfig;