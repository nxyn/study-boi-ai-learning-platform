import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discussions, discussionReplies, user } from "@/db/schema";
import { eq, like, or, desc, sql } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const subject = searchParams.get('subject');
    const search = searchParams.get('search');
    const limit = Math.min(parseInt(searchParams.get('limit') || '20'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build where conditions
    let whereConditions = [];

    if (subject) {
      whereConditions.push(eq(discussions.subject, subject));
    }

    if (search) {
      whereConditions.push(
        or(
          like(discussions.title, `%${search}%`),
          like(discussions.content, `%${search}%`)
        )
      );
    }

    // Fetch discussions with creator info and reply count
    const allDiscussions = await db
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
        replyCount: sql<number>`(SELECT COUNT(*) FROM ${discussionReplies} WHERE ${discussionReplies.discussionId} = ${discussions.id})`,
      })
      .from(discussions)
      .leftJoin(user, eq(discussions.createdBy, user.id))
      .where(whereConditions.length > 0 ? sql`${whereConditions.join(' AND ')}` : undefined)
      .orderBy(desc(discussions.createdAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({ discussions: allDiscussions });
  } catch (error) {
    console.error("Error fetching discussions:", error);
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
    const { title, content, subject, imageUrl } = body;

    // Validate required fields
    if (!title?.trim()) {
      return NextResponse.json({ 
        error: "Title is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!content?.trim()) {
      return NextResponse.json({ 
        error: "Content is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    if (!subject?.trim()) {
      return NextResponse.json({ 
        error: "Subject is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    const currentTime = new Date().toISOString();
    const [newDiscussion] = await db
      .insert(discussions)
      .values({
        title: title.trim(),
        content: content.trim(),
        subject: subject.trim(),
        imageUrl: imageUrl?.trim() || null,
        createdBy: session.user.id,
        likes: 0,
        createdAt: currentTime,
        updatedAt: currentTime,
      })
      .returning();

    return NextResponse.json(newDiscussion, { status: 201 });
  } catch (error) {
    console.error("Error creating discussion:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}