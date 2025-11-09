import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const session = await auth.api.getSession({
    headers: request.headers,
  });

  if (!session) {
    const redirectUrl = new URL("/sign-in", request.url);
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return NextResponse.next();
}

export const config = {
  runtime: "edge",
  matcher: [
    "/dashboard",
    "/chat-tutor",
    "/profile",
    "/quizzes/create",
    "/quizzes/ai-generator",
    "/study-space/new",
  ],
};