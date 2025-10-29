import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user, userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user profile data
    const [profile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ error: "Failed to fetch profile" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { grade, bio } = body;

    // Validate required fields
    if (!grade) {
      return NextResponse.json({ 
        error: "Grade is required",
        code: "MISSING_REQUIRED_FIELD" 
      }, { status: 400 });
    }

    // Validate grade range
    if (grade < 6 || grade > 12) {
      return NextResponse.json({ 
        error: "Grade must be between 6 and 12",
        code: "INVALID_GRADE" 
      }, { status: 400 });
    }

    // Check if profile already exists
    const [existingProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    if (existingProfile) {
      return NextResponse.json({ 
        error: "Profile already exists. Use PUT to update.",
        code: "PROFILE_EXISTS" 
      }, { status: 400 });
    }

    const currentTime = new Date().toISOString();
    const [newProfile] = await db
      .insert(userProfiles)
      .values({
        userId: session.user.id,
        grade,
        bio: bio?.trim() || null,
        createdAt: currentTime,
        updatedAt: currentTime,
      })
      .returning();

    return NextResponse.json(newProfile, { status: 201 });
  } catch (error) {
    console.error("Error creating profile:", error);
    return NextResponse.json({ error: "Failed to create profile" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { grade, bio } = body;

    // Validate grade if provided
    if (grade !== undefined && (grade < 6 || grade > 12)) {
      return NextResponse.json({ 
        error: "Grade must be between 6 and 12",
        code: "INVALID_GRADE" 
      }, { status: 400 });
    }

    // Check if profile exists
    const [existingProfile] = await db
      .select()
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);

    if (!existingProfile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // Build update object
    const updateData: any = {
      updatedAt: new Date().toISOString(),
    };

    if (grade !== undefined) updateData.grade = grade;
    if (bio !== undefined) updateData.bio = bio?.trim() || null;

    const [updatedProfile] = await db
      .update(userProfiles)
      .set(updateData)
      .where(eq(userProfiles.userId, session.user.id))
      .returning();

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}