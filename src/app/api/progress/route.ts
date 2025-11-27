import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { studyProgress } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Handles GET requests to `/api/progress`.
 * Fetches the study progress for the authenticated user, with optional filtering by subject.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response containing the study progress or an error message.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');

    let query = db.select().from(studyProgress).where(eq(studyProgress.userId, session.user.id));

    if (subject) {
      query = query.where(and(eq(studyProgress.userId, session.user.id), eq(studyProgress.subject, subject)));
    }

    const results = await query;
    return NextResponse.json(results);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

/**
 * Handles POST requests to `/api/progress`.
 * Creates or updates a study progress entry for the authenticated user.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response containing the new or updated study progress entry, or an error message.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { subject, totalQuizzesTaken, averageScore } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!subject) {
      return NextResponse.json({ 
        error: "Subject is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Check if progress entry already exists for this user and subject
    const existingProgress = await db.select()
      .from(studyProgress)
      .where(and(eq(studyProgress.userId, session.user.id), eq(studyProgress.subject, subject)))
      .limit(1);

    const currentTimestamp = new Date().toISOString();
    const progressData = {
      userId: session.user.id,
      subject: subject.trim(),
      totalQuizzesTaken: totalQuizzesTaken || 0,
      averageScore: averageScore || 0,
      lastStudiedAt: currentTimestamp
    };

    if (existingProgress.length > 0) {
      // Update existing entry
      const updated = await db.update(studyProgress)
        .set({
          totalQuizzesTaken: totalQuizzesTaken || existingProgress[0].totalQuizzesTaken,
          averageScore: averageScore || existingProgress[0].averageScore,
          lastStudiedAt: currentTimestamp
        })
        .where(and(eq(studyProgress.userId, session.user.id), eq(studyProgress.subject, subject)))
        .returning();

      return NextResponse.json(updated[0], { status: 200 });
    } else {
      // Create new entry
      const newProgress = await db.insert(studyProgress)
        .values(progressData)
        .returning();

      return NextResponse.json(newProgress[0], { status: 201 });
    }
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

/**
 * Handles PUT requests to `/api/progress`.
 * Updates a specific study progress entry for the authenticated user.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response containing the updated study progress entry or an error message.
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
    const { totalQuizzesTaken, averageScore, lastStudiedAt } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Check if record exists and belongs to authenticated user
    const existingRecord = await db.select()
      .from(studyProgress)
      .where(and(eq(studyProgress.id, parseInt(id)), eq(studyProgress.userId, session.user.id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    // Build update object with only provided fields
    const updates: any = {
      lastStudiedAt: lastStudiedAt || new Date().toISOString()
    };

    if (totalQuizzesTaken !== undefined) {
      updates.totalQuizzesTaken = totalQuizzesTaken;
    }

    if (averageScore !== undefined) {
      updates.averageScore = averageScore;
    }

    const updated = await db.update(studyProgress)
      .set(updates)
      .where(and(eq(studyProgress.id, parseInt(id)), eq(studyProgress.userId, session.user.id)))
      .returning();

    if (updated.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to `/api/progress`.
 * Deletes a specific study progress entry for the authenticated user.
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

    // Check if record exists and belongs to authenticated user
    const existingRecord = await db.select()
      .from(studyProgress)
      .where(and(eq(studyProgress.id, parseInt(id)), eq(studyProgress.userId, session.user.id)))
      .limit(1);

    if (existingRecord.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    const deleted = await db.delete(studyProgress)
      .where(and(eq(studyProgress.id, parseInt(id)), eq(studyProgress.userId, session.user.id)))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ error: 'Record not found' }, { status: 404 });
    }

    return NextResponse.json({
      message: 'Study progress record deleted successfully',
      deletedRecord: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}