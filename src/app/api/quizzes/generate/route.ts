import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizzes, quizQuestions, userProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

const VALID_DIFFICULTIES = ["easy", "medium", "hard"] as const;

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, difficulty, questionCount, additionalInfo, isPublic } = body || {};

    if (!topic || typeof topic !== "string") {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }
    if (!VALID_DIFFICULTIES.includes(difficulty)) {
      return NextResponse.json({ error: `Difficulty must be one of: ${VALID_DIFFICULTIES.join(", ")}` }, { status: 400 });
    }
    const count = Math.min(Math.max(parseInt(questionCount) || 10, 3), 25);

    // Get user's grade level from profile (fallback to 10)
    const [profile] = await db
      .select({ grade: userProfiles.grade })
      .from(userProfiles)
      .where(eq(userProfiles.userId, session.user.id))
      .limit(1);
    const gradeLevel = profile?.grade ?? 10;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "AI key not configured" }, { status: 500 });
    }

    // NCERT/CBSE-aligned prompt
    const prompt = `Generate an NCERT/CBSE-aligned quiz about "${topic}" with exactly ${count} multiple-choice questions for a Grade ${gradeLevel} student in India.
- The content must align with NCERT syllabus and terminology for Grades 6-12.
- Difficulty level: ${difficulty}.
- Each question must include exactly 4 options (A-D), with one clearly correct option.
- Provide a short explanation for each answer.
${additionalInfo ? `\nAdditional instructions from the teacher/student: ${additionalInfo}\n` : ""}
Return ONLY valid JSON (no markdown) in this exact shape:
{
  "title": "Quiz title",
  "description": "Brief description",
  "questions": [
    {
      "question": "Question text",
      "correctAnswer": "Correct answer text",
      "wrongAnswers": ["Wrong 1", "Wrong 2", "Wrong 3"],
      "explanation": "Why the answer is correct"
    }
  ]
}`;

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: { temperature: 0.7, topK: 40, topP: 0.95, maxOutputTokens: 4096 },
        }),
      }
    );

    if (!aiRes.ok) {
      return NextResponse.json({ error: "AI service unavailable" }, { status: 503 });
    }

    const data = await aiRes.json();
    let aiText: string = data?.candidates?.[0]?.content?.parts?.[0]?.text || "";
    aiText = aiText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();

    let quizData: any;
    try {
      quizData = JSON.parse(aiText);
    } catch {
      return NextResponse.json({ error: "Failed to parse AI output. Try again." }, { status: 500 });
    }

    if (!quizData?.questions || !Array.isArray(quizData.questions) || quizData.questions.length === 0) {
      return NextResponse.json({ error: "AI returned no questions" }, { status: 500 });
    }

    const now = new Date().toISOString();

    // Insert quiz
    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        title: (quizData.title || `${topic} Quiz`).slice(0, 200),
        description: quizData.description?.slice(0, 1000) || `AI-generated NCERT-aligned quiz on ${topic}`,
        subject: (typeof topic === "string" ? topic.toLowerCase() : "general").slice(0, 100),
        difficulty,
        createdBy: session.user.id,
        isPublic: Boolean(isPublic),
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    // Transform AI questions => options[] + correctAnswer index
    const transformed = quizData.questions.slice(0, count).map((q: any, idx: number) => {
      const correct = String(q.correctAnswer || "").trim();
      const wrongs: string[] = Array.isArray(q.wrongAnswers) ? q.wrongAnswers.map((w: any) => String(w).trim()) : [];
      const allOptions = [correct, ...wrongs].slice(0, 4);
      // Ensure exactly 4 options; pad if needed
      while (allOptions.length < 4) allOptions.push("None of the above");
      // Shuffle to avoid always index 0
      const shuffled = [...allOptions].map(v => ({ v, r: Math.random() }))
        .sort((a, b) => a.r - b.r)
        .map(o => o.v);
      const correctIndex = shuffled.findIndex((o) => o === correct);
      return {
        quizId: newQuiz.id,
        question: String(q.question || "").trim().slice(0, 1000),
        options: shuffled,
        correctAnswer: correctIndex >= 0 ? correctIndex : 0,
        explanation: q.explanation ? String(q.explanation).trim().slice(0, 1000) : null,
        order: idx,
      };
    });

    if (transformed.length > 0) {
      await db.insert(quizQuestions).values(transformed);
    }

    return NextResponse.json({ quiz: newQuiz }, { status: 201 });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json({ error: "Failed to generate quiz" }, { status: 500 });
  }
}