import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { quizQuestions, quizzes } from '@/db/schema';
import { eq, and, asc } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Handles GET requests to `/api/quizzes/[id]/questions`.
 * Fetches all questions for a specific quiz.
 * @param {NextRequest} request - The incoming request object.
 * @param {{ params: { id: string } }} context - The context object, containing the dynamic route parameters.
 * @returns {NextResponse} A response containing the questions for the quiz, or an error message.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const quizId = parseInt(id);
    if (!quizId || isNaN(quizId)) {
      return NextResponse.json({ 
        error: "Valid quiz ID is required",
        code: "INVALID_QUIZ_ID" 
      }, { status: 400 });
    }

    // Verify quiz exists and user has access (either owns it or it's public)
    const quiz = await db.select()
      .from(quizzes)
      .where(eq(quizzes.id, quizId))
      .limit(1);

    if (quiz.length === 0) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 });
    }

    if (quiz[0].createdBy !== session.user.id && !quiz[0].isPublic) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Get all questions for the quiz, ordered by order field
    const questions = await db.select()
      .from(quizQuestions)
      .where(eq(quizQuestions.quizId, quizId))
      .orderBy(asc(quizQuestions.order));

    return NextResponse.json(questions);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

/**
 * Handles POST requests to `/api/quizzes/[id]/questions`.
 * Creates a new question for a specific quiz.
 * @param {NextRequest} request - The incoming request object.
 * @param {{ params: { id: string } }} context - The context object, containing the dynamic route parameters.
 * @returns {NextResponse} A response containing the new question or an error message.
 */
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const quizId = parseInt(id);
    if (!quizId || isNaN(quizId)) {
      return NextResponse.json({ 
        error: "Valid quiz ID is required",
        code: "INVALID_QUIZ_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const { question, options, correctAnswer, explanation, order } = requestBody;

    // Security check: reject if user ID provided in body
    if ('userId' in requestBody || 'user_id' in requestBody || 'createdBy' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!question || question.trim() === '') {
      return NextResponse.json({ 
        error: "Question is required",
        code: "MISSING_QUESTION" 
      }, { status: 400 });
    }

    if (!options || !Array.isArray(options)) {
      return NextResponse.json({ 
        error: "Options must be an array",
        code: "INVALID_OPTIONS" 
      }, { status: 400 });
    }

    if (options.length !== 4) {
      return NextResponse.json({ 
        error: "Options array must contain exactly 4 items",
        code: "INVALID_OPTIONS_LENGTH" 
      }, { status: 400 });
    }

    if (correctAnswer === undefined || correctAnswer === null || !Number.isInteger(correctAnswer)) {
      return NextResponse.json({ 
        error: "Correct answer is required and must be an integer",
        code: "MISSING_CORRECT_ANSWER" 
      }, { status: 400 });
    }

    if (correctAnswer < 0 || correctAnswer > 3) {
      return NextResponse.json({ 
        error: "Correct answer must be between 0 and 3",
        code: "INVALID_CORRECT_ANSWER" 
      }, { status: 400 });
    }

    if (order === undefined || order === null || !Number.isInteger(order)) {
      return NextResponse.json({ 
        error: "Order is required and must be an integer",
        code: "MISSING_ORDER" 
      }, { status: 400 });
    }

    // Verify quiz exists and user owns it
    const quiz = await db.select()
      .from(quizzes)
      .where(and(eq(quizzes.id, quizId), eq(quizzes.createdBy, session.user.id)))
      .limit(1);

    if (quiz.length === 0) {
      return NextResponse.json({ error: 'Quiz not found or access denied' }, { status: 404 });
    }

    // Validate all options are non-empty strings
    for (let i = 0; i < options.length; i++) {
      if (typeof options[i] !== 'string' || options[i].trim() === '') {
        return NextResponse.json({ 
          error: `Option ${i + 1} must be a non-empty string`,
          code: "INVALID_OPTION" 
        }, { status: 400 });
      }
    }

    const newQuestion = await db.insert(quizQuestions)
      .values({
        quizId: quizId,
        question: question.trim(),
        options: options.map((opt: string) => opt.trim()),
        correctAnswer,
        explanation: explanation ? explanation.trim() : null,
        order
      })
      .returning();

    return NextResponse.json(newQuestion[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

/**
 * Handles PUT requests to `/api/quizzes/[id]/questions`.
 * Updates a specific question.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response containing the updated question or an error message.
 */
export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const requestBody = await request.json();
    const { question, options, correctAnswer, explanation, order } = requestBody;

    // Security check: reject if user ID provided in body
    if ('userId' in requestBody || 'user_id' in requestBody || 'createdBy' in requestBody || 'quizId' in requestBody) {
      return NextResponse.json({ 
        error: "User ID or quiz ID cannot be provided in request body",
        code: "FORBIDDEN_FIELDS" 
      }, { status: 400 });
    }

    // Get the question and verify ownership through quiz
    const questionWithQuiz = await db.select({
      question: quizQuestions,
      quiz: quizzes
    })
      .from(quizQuestions)
      .innerJoin(quizzes, eq(quizQuestions.quizId, quizzes.id))
      .where(eq(quizQuestions.id, parseInt(id)))
      .limit(1);

    if (questionWithQuiz.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (questionWithQuiz[0].quiz.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    // Build update object with validation
    const updates: any = {};

    if (question !== undefined) {
      if (!question || question.trim() === '') {
        return NextResponse.json({ 
          error: "Question cannot be empty",
          code: "INVALID_QUESTION" 
        }, { status: 400 });
      }
      updates.question = question.trim();
    }

    if (options !== undefined) {
      if (!Array.isArray(options) || options.length !== 4) {
        return NextResponse.json({ 
          error: "Options must be an array with exactly 4 items",
          code: "INVALID_OPTIONS" 
        }, { status: 400 });
      }
      
      for (let i = 0; i < options.length; i++) {
        if (typeof options[i] !== 'string' || options[i].trim() === '') {
          return NextResponse.json({ 
            error: `Option ${i + 1} must be a non-empty string`,
            code: "INVALID_OPTION" 
          }, { status: 400 });
        }
      }
      updates.options = options.map((opt: string) => opt.trim());
    }

    if (correctAnswer !== undefined) {
      if (!Number.isInteger(correctAnswer) || correctAnswer < 0 || correctAnswer > 3) {
        return NextResponse.json({ 
          error: "Correct answer must be an integer between 0 and 3",
          code: "INVALID_CORRECT_ANSWER" 
        }, { status: 400 });
      }
      updates.correctAnswer = correctAnswer;
    }

    if (explanation !== undefined) {
      updates.explanation = explanation ? explanation.trim() : null;
    }

    if (order !== undefined) {
      if (!Number.isInteger(order)) {
        return NextResponse.json({ 
          error: "Order must be an integer",
          code: "INVALID_ORDER" 
        }, { status: 400 });
      }
      updates.order = order;
    }

    const updated = await db.update(quizQuestions)
      .set(updates)
      .where(eq(quizQuestions.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to `/api/quizzes/[id]/questions`.
 * Deletes a specific question.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response confirming the deletion or an error message.
 */
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Get the question and verify ownership through quiz
    const questionWithQuiz = await db.select({
      question: quizQuestions,
      quiz: quizzes
    })
      .from(quizQuestions)
      .innerJoin(quizzes, eq(quizQuestions.quizId, quizzes.id))
      .where(eq(quizQuestions.id, parseInt(id)))
      .limit(1);

    if (questionWithQuiz.length === 0) {
      return NextResponse.json({ error: 'Question not found' }, { status: 404 });
    }

    if (questionWithQuiz[0].quiz.createdBy !== session.user.id) {
      return NextResponse.json({ error: 'Access denied' }, { status: 403 });
    }

    const deleted = await db.delete(quizQuestions)
      .where(eq(quizQuestions.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Question deleted successfully',
      deletedQuestion: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}