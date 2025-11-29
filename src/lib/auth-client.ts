
"use client"
import { createAuthClient } from "better-auth/react"
import { useEffect, useState } from "react"

/**
 * The client-side authentication client for `better-auth`.
 * It's configured to use the current window's origin as the base URL and to handle bearer token authentication.
 */
export const authClient = createAuthClient({
   baseURL: typeof window !== 'undefined' ? window.location.origin : process.env.NEXT_PUBLIC_SITE_URL,
  fetchOptions: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem("bearer_token") : ""}`,
      },
      onSuccess: (ctx) => {
          const authToken = ctx.response.headers.get("set-auth-token")
          // Store the token securely (e.g., in localStorage)
          if(authToken){
            localStorage.setItem("bearer_token", authToken);
          }
      }
  }
});

type SessionData = ReturnType<typeof authClient.useSession>

/**
 * A custom React hook for managing user sessions on the client side.
 * It provides the session data, a pending state, an error state, and a function to refetch the session.
 * @returns {SessionData} An object containing the session data, pending state, error state, and a refetch function.
 */
export function useSession(): SessionData {
   const [session, setSession] = useState<any>(null);
   const [isPending, setIsPending] = useState(true);
   const [error, setError] = useState<any>(null);

   const refetch = async () => {
      setIsPending(true);
      setError(null);
      await fetchSession();
   };

   const fetchSession = async () => {
      try {
         const res = await authClient.getSession({
            fetchOptions: {
               auth: {
                  type: "Bearer",
                  token: typeof window !== 'undefined' ? localStorage.getItem("bearer_token") || "" : "",
               },
            },
         });
         setSession(res.data);
         setError(null);
      } catch (err) {
         setSession(null);
         setError(err);
      } finally {
         setIsPending(false);
      }
   };

   useEffect(() => {
      fetchSession();
   }, []);

   return { data: session, isPending, isRefetching: false, error, refetch };
}