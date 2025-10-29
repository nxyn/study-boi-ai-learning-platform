import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizzes, user } from "@/db/schema";
import { eq, and, like, or, desc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const VALID_DIFFICULTIES = ['easy', 'medium', 'hard'];

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const difficulty = searchParams.get('difficulty');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query
    let whereConditions = [eq(quizzes.isPublic, true)];

    if (subject) {
      whereConditions.push(eq(quizzes.subject, subject));
    }

    if (difficulty && VALID_DIFFICULTIES.includes(difficulty)) {
      whereConditions.push(eq(quizzes.difficulty, difficulty));
    }

    if (search) {
      whereConditions.push(
        or(
          like(quizzes.title, `%${search}%`),
          like(quizzes.description, `%${search}%`)
        )
      );
    }

    // Fetch quizzes with creator information
    const results = await db
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
      .where(and(...whereConditions))
      .orderBy(desc(quizzes.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ quizzes: results });
  } catch (error) {
    console.error("Error fetching quizzes:", error);
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
    const { title, description, subject, difficulty, isPublic } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!subject?.trim()) {
      return NextResponse.json({ 
        error: "Subject is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!difficulty || !VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json({ 
        error: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(', ')}`,
        code: "INVALID_DIFFICULTY" 
      }, { status: 400 });
    }

    const currentTime = new Date().toISOString();
    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        title: title.trim(),
        description: description?.trim() || null,
        subject: subject.trim(),
        difficulty,
        createdBy: session.user.id,
        isPublic: isPublic !== undefined ? isPublic : true,
        createdAt: currentTime,
        updatedAt: currentTime,
      })
      .returning();

    return NextResponse.json(newQuiz, { status: 201 });
  } catch (error) {
    console.error("Error creating quiz:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}