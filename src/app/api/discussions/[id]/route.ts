import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discussions, discussionReplies, user } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

/**
 * Handles GET requests to `/api/discussions/[id]`.
 * Fetches a specific discussion and its replies.
 * @param {NextRequest} request - The incoming request object.
 * @param {{ params: { id: string } }} context - The context object, containing the dynamic route parameters.
 * @returns {NextResponse} A response containing the discussion and its replies, or an error message.
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
    const discussionId = parseInt(id);
    if (!discussionId || isNaN(discussionId)) {
      return NextResponse.json({ 
        error: "Valid discussion ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Fetch discussion with creator info
    const [discussion] = await db
      .select({
        id: discussions.id,
        title: discussions.title,
        content: discussions.content,
        subject: discussions.subject,
        imageUrl: discussions.imageUrl,
        createdBy: discussions.createdBy,
        likes: discussions.likes,
        createdAt: discussions.createdAt,
        updatedAt: discussions.updatedAt,
        creatorName: user.name,
      })
      .from(discussions)
      .leftJoin(user, eq(discussions.createdBy, user.id))
      .where(eq(discussions.id, discussionId))
      .limit(1);

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    // Fetch replies with creator info
    const replies = await db
      .select({
        id: discussionReplies.id,
        discussionId: discussionReplies.discussionId,
        content: discussionReplies.content,
        createdBy: discussionReplies.createdBy,
        likes: discussionReplies.likes,
        createdAt: discussionReplies.createdAt,
        creatorName: user.name,
      })
      .from(discussionReplies)
      .leftJoin(user, eq(discussionReplies.createdBy, user.id))
      .where(eq(discussionReplies.discussionId, discussionId))
      .orderBy(asc(discussionReplies.createdAt));

    return NextResponse.json({ discussion, replies });
  } catch (error) {
    console.error("Error fetching discussion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles PUT requests to `/api/discussions/[id]`.
 * Updates a specific discussion.
 * @param {NextRequest} request - The incoming request object.
 * @param {{ params: { id: string } }} context - The context object, containing the dynamic route parameters.
 * @returns {NextResponse} A response containing the updated discussion or an error message.
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
    const discussionId = parseInt(id);
    if (!discussionId || isNaN(discussionId)) {
      return NextResponse.json({ 
        error: "Valid discussion ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { title, content, subject, imageUrl } = body;

    // Fetch discussion to verify ownership
    const [discussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, discussionId))
      .limit(1);

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    if (discussion.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to update this discussion" }, { status: 403 });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (title !== undefined) updateData.title = title.trim();
    if (content !== undefined) updateData.content = content.trim();
    if (subject !== undefined) updateData.subject = subject.trim();
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl?.trim() || null;

    const [updatedDiscussion] = await db
      .update(discussions)
      .set(updateData)
      .where(eq(discussions.id, discussionId))
      .returning();

    return NextResponse.json(updatedDiscussion);
  } catch (error) {
    console.error("Error updating discussion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

/**
 * Handles DELETE requests to `/api/discussions/[id]`.
 * Deletes a specific discussion.
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
    const discussionId = parseInt(id);
    if (!discussionId || isNaN(discussionId)) {
      return NextResponse.json({ 
        error: "Valid discussion ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    // Fetch discussion to verify ownership
    const [discussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, discussionId))
      .limit(1);

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    if (discussion.createdBy !== session.user.id) {
      return NextResponse.json({ error: "Not authorized to delete this discussion" }, { status: 403 });
    }

    // Delete discussion (cascade will handle replies)
    await db
      .delete(discussions)
      .where(eq(discussions.id, discussionId));

    return NextResponse.json({ message: "Discussion deleted successfully" });
  } catch (error) {
    console.error("Error deleting discussion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}