import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizAttempts, quizzes } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const quizId = searchParams.get('quizId');

    let whereConditions = [eq(quizAttempts.userId, session.user.id)];

    if (quizId && !isNaN(parseInt(quizId))) {
      whereConditions.push(eq(quizAttempts.quizId, parseInt(quizId)));
    }

    // Fetch user's quiz attempts with quiz details
    const attempts = await db
      .select({
        id: quizAttempts.id,
        quizId: quizAttempts.quizId,
        userId: quizAttempts.userId,
        score: quizAttempts.score,
        totalQuestions: quizAttempts.totalQuestions,
        completedAt: quizAttempts.completedAt,
        quizTitle: quizzes.title,
        quizSubject: quizzes.subject,
        quizDifficulty: quizzes.difficulty,
      })
      .from(quizAttempts)
      .leftJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
      .where(and(...whereConditions))
      .orderBy(desc(quizAttempts.completedAt));

    return NextResponse.json({ attempts });
  } catch (error) {
    console.error("Error fetching quiz attempts:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { quizId, score, totalQuestions } = body;

    // Validate required fields
    if (!quizId || isNaN(parseInt(quizId))) {
      return NextResponse.json({ 
        error: "Valid quiz ID is required",
        code: "INVALID_QUIZ_ID" 
      }, { status: 400 });
    }

    if (score === undefined || score < 0) {
      return NextResponse.json({ 
        error: "Valid score is required",
        code: "INVALID_SCORE" 
      }, { status: 400 });
    }

    if (!totalQuestions || totalQuestions <= 0) {
      return NextResponse.json({ 
        error: "Valid total questions count is required",
        code: "INVALID_TOTAL_QUESTIONS" 
      }, { status: 400 });
    }

    if (score > totalQuestions) {
      return NextResponse.json({ 
        error: "Score cannot exceed total questions",
        code: "INVALID_SCORE_RANGE" 
      }, { status: 400 });
    }

    // Verify quiz exists
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, parseInt(quizId)))
      .limit(1);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    const [attempt] = await db
      .insert(quizAttempts)
      .values({
        quizId: parseInt(quizId),
        userId: session.user.id,
        score,
        totalQuestions,
        completedAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(attempt, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz attempt:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}