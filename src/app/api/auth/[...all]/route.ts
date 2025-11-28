import { auth } from "@/lib/auth";

import { toNextJsHandler } from "better-auth/next-js";

/**
 * This file exports the `POST` and `GET` handlers for the authentication API routes.
 * It uses the `better-auth` library to handle authentication.
 * @see https://www.npmjs.com/package/better-auth
 */
export const { POST, GET } = toNextJsHandler(auth);