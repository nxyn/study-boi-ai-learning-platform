import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { discussions, discussionLikes } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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
    const discussionId = parseInt(id);
    if (!discussionId || isNaN(discussionId)) {
      return NextResponse.json({ 
        error: "Valid discussion ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Verify discussion exists
    const discussion = await db.select()
      .from(discussions)
      .where(eq(discussions.id, discussionId))
      .limit(1);

    if (discussion.length === 0) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    // Get like count for the discussion
    const likeCountResult = await db.select({ count: count() })
      .from(discussionLikes)
      .where(eq(discussionLikes.discussionId, discussionId));

    const likeCount = likeCountResult[0]?.count || 0;

    // Check if current user has liked this discussion
    const userLike = await db.select()
      .from(discussionLikes)
      .where(and(
        eq(discussionLikes.discussionId, discussionId),
        eq(discussionLikes.userId, session.user.id)
      ))
      .limit(1);

    const userHasLiked = userLike.length > 0;

    return NextResponse.json({
      likeCount,
      userHasLiked
    });

  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

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
    const discussionId = parseInt(id);
    if (!discussionId || isNaN(discussionId)) {
      return NextResponse.json({ 
        error: "Valid discussion ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Verify discussion exists
    const discussion = await db.select()
      .from(discussions)
      .where(eq(discussions.id, discussionId))
      .limit(1);

    if (discussion.length === 0) {
      return NextResponse.json({ error: 'Discussion not found' }, { status: 404 });
    }

    // Check if user already liked this discussion
    const existingLike = await db.select()
      .from(discussionLikes)
      .where(and(
        eq(discussionLikes.discussionId, discussionId),
        eq(discussionLikes.userId, session.user.id)
      ))
      .limit(1);

    let liked: boolean;

    if (existingLike.length > 0) {
      // User has already liked, so remove the like (unlike)
      await db.delete(discussionLikes)
        .where(and(
          eq(discussionLikes.discussionId, discussionId),
          eq(discussionLikes.userId, session.user.id)
        ));
      liked = false;
    } else {
      // User hasn't liked, so create new like
      await db.insert(discussionLikes)
        .values({
          discussionId,
          userId: session.user.id,
          createdAt: new Date()
        });
      liked = true;
    }

    // Get updated like count
    const likeCountResult = await db.select({ count: count() })
      .from(discussionLikes)
      .where(eq(discussionLikes.discussionId, discussionId));

    const likeCount = likeCountResult[0]?.count || 0;

    return NextResponse.json({
      liked,
      likeCount
    });

  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}