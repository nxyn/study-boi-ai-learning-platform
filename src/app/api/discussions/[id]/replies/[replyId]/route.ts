import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { discussionReplies } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; replyId: string } }
) {
  try {
    // Authentication check
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ 
        error: 'Unauthorized',
        code: 'AUTH_REQUIRED' 
      }, { status: 401 });
    }

    const { id, replyId } = params;

    // Validate replyId parameter
    if (!replyId || isNaN(parseInt(replyId))) {
      return NextResponse.json({ 
        error: 'Valid reply ID is required',
        code: 'INVALID_REPLY_ID' 
      }, { status: 400 });
    }

    const replyIdInt = parseInt(replyId);

    // Fetch the reply to verify existence and ownership
    const reply = await db.select()
      .from(discussionReplies)
      .where(eq(discussionReplies.id, replyIdInt))
      .limit(1);

    if (reply.length === 0) {
      return NextResponse.json({ 
        error: 'Reply not found',
        code: 'REPLY_NOT_FOUND' 
      }, { status: 404 });
    }

    // Verify the current user owns the reply
    if (reply[0].userId !== session.user.id) {
      return NextResponse.json({ 
        error: 'You do not have permission to delete this reply',
        code: 'FORBIDDEN' 
      }, { status: 403 });
    }

    // Delete the reply
    const deleted = await db.delete(discussionReplies)
      .where(and(
        eq(discussionReplies.id, replyIdInt),
        eq(discussionReplies.userId, session.user.id)
      ))
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json({ 
        error: 'Failed to delete reply',
        code: 'DELETE_FAILED' 
      }, { status: 500 });
    }

    return NextResponse.json({ 
      message: 'Reply deleted successfully',
      deletedReply: deleted[0]
    }, { status: 200 });

  } catch (error) {
    console.error('DELETE reply error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + error 
    }, { status: 500 });
  }
}