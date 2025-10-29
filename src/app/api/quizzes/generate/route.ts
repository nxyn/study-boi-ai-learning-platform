import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { quizzes, quizQuestions, user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { topic, difficulty, questionCount, additionalInfo } = body;

    // Get user's grade level and name
    const [userData] = await db
      .select({ gradeLevel: user.gradeLevel, name: user.name })
      .from(user)
      .where(eq(user.id, session.user.id))
      .limit(1);

    const gradeLevel = userData?.gradeLevel || 10;

    // Get Gemini API key
    const apiKey = process.env.GEMINI_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key not configured" },
        { status: 500 }
      );
    }

    const prompt = `Generate a ${difficulty} difficulty quiz about "${topic}" with exactly ${questionCount} multiple choice questions for a grade ${gradeLevel} student.

${additionalInfo ? `Additional context: ${additionalInfo}` : ''}

Return ONLY a valid JSON object (no markdown, no code blocks) in this exact format:
{
  "title": "Quiz title",
  "description": "Brief description",
  "questions": [
    {
      "question": "Question text",
      "correctAnswer": "Correct answer",
      "wrongAnswers": ["Wrong 1", "Wrong 2", "Wrong 3"],
      "explanation": "Why this is correct"
    }
  ]
}

Make questions appropriate for ${difficulty} level. Each question must have exactly 3 wrong answers.`;

    // Call Gemini 2.0 API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: prompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.9,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 4096,
          },
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("Gemini API error:", errorData);
      return NextResponse.json(
        { error: "AI service temporarily unavailable. Please try again." },
        { status: 503 }
      );
    }

    const data = await response.json();
    let aiResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Clean up the response - remove markdown code blocks if present
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    let quizData;
    try {
      quizData = JSON.parse(aiResponse);
    } catch (parseError) {
      console.error("Failed to parse AI response:", aiResponse);
      return NextResponse.json(
        { error: "Failed to generate quiz. Please try again with a different topic." },
        { status: 500 }
      );
    }

    // Create quiz in database
    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        title: quizData.title || `${topic} Quiz`,
        description: quizData.description || `AI-generated quiz about ${topic}`,
        difficulty,
        isPublic: false,
        createdBy: session.user.id,
        userName: userData?.name || session.user.name || "Anonymous",
        createdAt: new Date(),
      })
      .returning();

    // Create questions
    if (quizData.questions && quizData.questions.length > 0) {
      await db.insert(quizQuestions).values(
        quizData.questions.map((q: any) => ({
          quizId: newQuiz.id,
          question: q.question,
          correctAnswer: q.correctAnswer,
          wrongAnswers: JSON.stringify(q.wrongAnswers),
          explanation: q.explanation || "",
        }))
      );
    }

    return NextResponse.json({ quiz: newQuiz }, { status: 201 });
  } catch (error) {
    console.error("Error generating quiz:", error);
    return NextResponse.json(
      { error: "Failed to generate quiz. Please try again." },
      { status: 500 }
    );
  }
}