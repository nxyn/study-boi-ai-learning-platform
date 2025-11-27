import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { bearer } from "better-auth/plugins";
import { NextRequest } from 'next/server';
import { headers } from "next/headers"
import { db } from "@/db";
 
/**
 * The main configuration object for the `better-auth` library.
 * It specifies the database adapter (Drizzle) and the enabled authentication methods (email and password, bearer token).
 */
export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "sqlite",
	}),
	emailAndPassword: {    
		enabled: true
	},
	plugins: [bearer()]
});

/**
 * Retrieves the current user's session from the request headers.
 * @param {NextRequest} request - The Next.js request object.
 * @returns {Promise<any | null>} A promise that resolves to the user object if the session is valid, or null otherwise.
 */
export async function getCurrentUser(request: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });
  return session?.user || null;
}
