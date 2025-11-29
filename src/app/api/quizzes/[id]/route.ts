import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizzes, quizQuestions, user } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

/**
 * Handles GET requests to `/api/quizzes/[id]`.
 * Fetches a specific quiz and its questions.
 * @param {NextRequest} request - The incoming request object.
 * @param {{ params: { id: string } }} context - The context object, containing the dynamic route parameters.
 * @returns {NextResponse} A response containing the quiz and its questions, or an error message.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const quizId = parseInt(id);
    if (!quizId || isNaN(quizId)) {
      return NextResponse.json({ 
        error: "Valid quiz ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Fetch quiz with creator information
    const [quiz] = await db
      .select({
        id: quizzes.id,
        title: quizzes.title,
        description: quizzes.description,
        subject: quizzes.subject,
        difficulty: quizzes.difficulty,
        createdBy: quizzes.createdBy,
        isPublic: quizzes.isPublic,
        createdAt: quizzes.createdAt,
        updatedAt: quizzes.updatedAt,
        creatorName: user.name,
      })
      .from(quizzes)
      .leftJoin(user, eq(quizzes.createdBy, user.id))
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    // Fetch questions
    const questions = await db
      .select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.order));

    return NextResponse.json({ quiz: { ...quiz, questions } });
  } catch (error) {
    console.error("Error fetching quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles PUT requests to `/api/quizzes/[id]`.
 * Updates a specific quiz.
 * @param {NextRequest} request - The incoming request object.
 * @param {{ params: { id: string } }} context - The context object, containing the dynamic route parameters.
 * @returns {NextResponse} A response containing the updated quiz or an error message.
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const quizId = parseInt(id);
    if (!quizId || isNaN(quizId)) {
      return NextResponse.json({ 
        error: "Valid quiz ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, subject, difficulty, isPublic } = body;

    // Fetch quiz to verify ownership
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this quiz" }, { status: 403 });
    }

    // Validate difficulty if provided
    if (difficulty && !VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json({ 
        error: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
        code: "INVALID_DIFFICULTY" 
      }, { status: 400 });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (description !== undefined) updateData.description = description?.trim() || null;
    if (subject !== undefined) updateData.subject = subject.trim();
    if (difficulty !== undefined) updateData.difficulty = difficulty;
    if (isPublic !== undefined) updateData.isPublic = isPublic;

    const [updatedQuiz] = await db
      .update(quizzes)
      .set(updateData)
      .where(eq(quizzes.id, quizId))
      .returning();

    return NextResponse.json(updatedQuiz);
  } catch (error) {
    console.error("Error updating quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to `/api/quizzes/[id]`.
 * Deletes a specific quiz.
 * @param {NextRequest} request - The incoming request object.
 * @param {{ params: { id: string } }} context - The context object, containing the dynamic route parameters.
 * @returns {NextResponse} A response confirming the deletion or an error message.
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const quizId = parseInt(id);
    if (!quizId || isNaN(quizId)) {
      return NextResponse.json({ 
        error: "Valid quiz ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Fetch quiz to verify ownership
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (!quiz) {
      return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
    }

    if (quiz.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this quiz" }, { status: 403 });
    }

    // Delete quiz (cascade will handle questions and attempts)
    await db
      .delete(quizzes)
      .where(eq(quizzes.id, quizId));

    return NextResponse.json({ message: "Quiz deleted successfully" });
  } catch (error) {
    console.error("Error deleting quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}