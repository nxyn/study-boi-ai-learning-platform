import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discussionReplies, discussions, user } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

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

    // Verify discussion exists
    const [discussion] = await db
      .select()
      .from(discussions)
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

    return NextResponse.json({ replies });
  } catch (error) {
    console.error("Error fetching replies:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(
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
    const { content } = body;

    // Validate required fields
    if (!content?.trim()) {
      return NextResponse.json({ 
        error: "Content is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Verify discussion exists
    const [discussion] = await db
      .select()
      .from(discussions)
      .where(eq(discussions.id, discussionId))
      .limit(1);

    if (!discussion) {
      return NextResponse.json({ error: "Discussion not found" }, { status: 404 });
    }

    const [reply] = await db
      .insert(discussionReplies)
      .values({
        discussionId,
        content: content.trim(),
        createdBy: session.user.id,
        likes: 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(reply, { status: 201 });
  } catch (error) {
    console.error("Error creating reply:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}