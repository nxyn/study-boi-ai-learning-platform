import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { achievements } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const VALID_TYPES = ['quiz_master', 'discussion_starter', 'helpful_peer'];

/**
 * Handles GET requests to `/api/achievements`.
 * Fetches the achievements for the authenticated user.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response containing the user's achievements or an error message.
 */
export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userAchievements = await db.select()
      .from(achievements)
      .where(eq(achievements.userId, session.user.id))
      .orderBy(desc(achievements.unlockedAt));

    return NextResponse.json(userAchievements, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

/**
 * Handles POST requests to `/api/achievements`.
 * Creates a new achievement for the authenticated user.
 * @param {NextRequest} request - The incoming request object.
 * @returns {NextResponse} A response containing the new achievement or an error message.
 */
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const requestBody = await request.json();
    const { type, title, description } = requestBody;

    // Security check: reject if userId provided in body
    if ('userId' in requestBody || 'user_id' in requestBody) {
      return NextResponse.json({ 
        error: "User ID cannot be provided in request body",
        code: "USER_ID_NOT_ALLOWED" 
      }, { status: 400 });
    }

    // Validate required fields
    if (!type) {
      return NextResponse.json({ 
        error: "Type is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!title) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!description) {
      return NextResponse.json({ 
        error: "Description is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate type
    if (!VALID_TYPES.includes(type)) {
      return NextResponse.json({ 
        error: `Type must be one of: ${VALID_TYPES.join(', ')}`,
        code: "INVALID_TYPE" 
      }, { status: 400 });
    }

    // Sanitize inputs
    const sanitizedTitle = title.trim();
    const sanitizedDescription = description.trim();

    if (!sanitizedTitle) {
      return NextResponse.json({ 
        error: "Title cannot be empty",
        code: "INVALID_FIELD" 
      }, { status: 400 });
    }

    if (!sanitizedDescription) {
      return NextResponse.json({ 
        error: "Description cannot be empty",
        code: "INVALID_FIELD" 
      }, { status: 400 });
    }

    const newAchievement = await db.insert(achievements)
      .values({
        userId: session.user.id,
        type,
        title: sanitizedTitle,
        description: sanitizedDescription,
        unlockedAt: new Date().toISOString()
      })
      .returning();

    return NextResponse.json(newAchievement[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}