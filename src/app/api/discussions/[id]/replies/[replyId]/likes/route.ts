import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { discussionReplies, replyLikes } from '@/db/schema';
import { eq, and, count } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; replyId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, replyId } = await params;

    // Validate IDs
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid discussion ID is required",
        code: "INVALID_DISCUSSION_ID" 
      }, { status: 400 });
    }

    if (!replyId || isNaN(parseInt(replyId))) {
      return NextResponse.json({ 
        error: "Valid reply ID is required",
        code: "INVALID_REPLY_ID" 
      }, { status: 400 });
    }

    const replyIdInt = parseInt(replyId);

    // Verify reply exists and belongs to the discussion
    const reply = await db.select()
      .from(discussionReplies)
      .where(and(
        eq(discussionReplies.id, replyIdInt),
        eq(discussionReplies.discussionId, parseInt(id))
      ))
      .limit(1);

    if (reply.length === 0) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    // Get like count for the reply
    const likeCountResult = await db.select({ count: count() })
      .from(replyLikes)
      .where(eq(replyLikes.replyId, replyIdInt));

    const likeCount = likeCountResult[0]?.count || 0;

    // Check if current user has liked this reply
    const userLike = await db.select()
      .from(replyLikes)
      .where(and(
        eq(replyLikes.replyId, replyIdInt),
        eq(replyLikes.userId, session.user.id)
      ))
      .limit(1);

    const userHasLiked = userLike.length > 0;

    return NextResponse.json({
      likeCount,
      userHasLiked
    });

  } catch (error) {
    console.error('GET reply likes error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; replyId: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, replyId } = await params;

    // Validate IDs
    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid discussion ID is required",
        code: "INVALID_DISCUSSION_ID" 
      }, { status: 400 });
    }

    if (!replyId || isNaN(parseInt(replyId))) {
      return NextResponse.json({ 
        error: "Valid reply ID is required",
        code: "INVALID_REPLY_ID" 
      }, { status: 400 });
    }

    const replyIdInt = parseInt(replyId);

    // Verify reply exists and belongs to the discussion
    const reply = await db.select()
      .from(discussionReplies)
      .where(and(
        eq(discussionReplies.id, replyIdInt),
        eq(discussionReplies.discussionId, parseInt(id))
      ))
      .limit(1);

    if (reply.length === 0) {
      return NextResponse.json({ error: 'Reply not found' }, { status: 404 });
    }

    // Check if user already liked this reply
    const existingLike = await db.select()
      .from(replyLikes)
      .where(and(
        eq(replyLikes.replyId, replyIdInt),
        eq(replyLikes.userId, session.user.id)
      ))
      .limit(1);

    let liked = false;

    if (existingLike.length > 0) {
      // User has already liked, so remove the like
      await db.delete(replyLikes)
        .where(and(
          eq(replyLikes.replyId, replyIdInt),
          eq(replyLikes.userId, session.user.id)
        ));
      liked = false;
    } else {
      // User hasn't liked, so add the like
      await db.insert(replyLikes)
        .values({
          replyId: replyIdInt,
          userId: session.user.id,
          createdAt: new Date()
        });
      liked = true;
    }

    // Get updated like count
    const likeCountResult = await db.select({ count: count() })
      .from(replyLikes)
      .where(eq(replyLikes.replyId, replyIdInt));

    const likeCount = likeCountResult[0]?.count || 0;

    return NextResponse.json({
      liked,
      likeCount
    });

  } catch (error) {
    console.error('POST reply likes error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}