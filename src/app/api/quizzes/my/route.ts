import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizzes } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch user's created quizzes
    const userQuizzes = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.createdBy, session.user.id))
      .orderBy(desc(quizzes.createdAt));

    return NextResponse.json({ quizzes: userQuizzes });
  } catch (error) {
    console.error("Error fetching user quizzes:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}