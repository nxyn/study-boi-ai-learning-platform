"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";

/**
 * A form for generating a quiz using the AI.
 * It allows the user to specify the topic, difficulty, number of questions, and additional information.
 */
export const AiGeneratorForm = () => {
  const router = useRouter();
  const { data: session, isPending } = useSession();

  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState<string>("medium");
  const [questionCount, setQuestionCount] = useState<number>(10);
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  useEffect(() => {
    // If not loading session and user missing, redirect (middleware also guards, this is UX safety)
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=/quizzes/ai-generator");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) {
      toast.error("Please enter a topic");
      return;
    }
    if (!difficulty) {
      toast.error("Please select difficulty");
      return;
    }

    const count = Math.min(Math.max(Number(questionCount) || 10, 3), 25);

    try {
      setLoading(true);
      const token = typeof window !== "undefined" ? localStorage.getItem("bearer_token") : "";
      const res = await fetch("/api/quizzes/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token ?? ""}`,
        },
        body: JSON.stringify({ topic: topic.trim(), difficulty, questionCount: count, additionalInfo, isPublic }),
      });

      const data = await res.json();
      if (!res.ok) {
        toast.error(data?.error || "Failed to generate quiz");
        return;
      }

      toast.success("Quiz generated successfully");
      if (data?.quiz?.id) {
        router.push(`/quizzes/${data.quiz.id}`);
      } else {
        router.push("/quizzes");
      }
    } catch (err: any) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-gradient-to-br from-black/50 via-purple-950/20 to-black/40 border-2 border-purple-400/30 rounded-2xl p-5 sm:p-8 backdrop-blur-xl shadow-2xl">
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <Label htmlFor="topic" className="text-purple-200">Topic</Label>
          <Input
            id="topic"
            placeholder="e.g., Quadratic Equations, Motion in a Straight Line, Mughal Empire"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 bg-black/40 border-purple-400/30 focus-visible:ring-purple-500"
          />
        </div>
        <div>
          <Label className="text-purple-200">Difficulty</Label>
          <Select value={difficulty} onValueChange={(v) => setDifficulty(v)}>
            <SelectTrigger className="mt-2 bg-black/40 border-purple-400/30 focus-visible:ring-purple-500">
              <SelectValue placeholder="Select difficulty" />
            </SelectTrigger>
            <SelectContent className="bg-black/90 border-purple-400/30">
              <SelectItem value="easy">Easy</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="hard">Hard</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="count" className="text-purple-200">Questions</Label>
          <Input
            id="count"
            type="number"
            min={3}
            max={25}
            value={questionCount}
            onChange={(e) => setQuestionCount(parseInt(e.target.value || "10", 10))}
            className="mt-2 bg-black/40 border-purple-400/30 focus-visible:ring-purple-500"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="info" className="text-purple-200">Additional instructions (optional)</Label>
          <Textarea
            id="info"
            placeholder="Any specific NCERT chapter, subtopic, or constraints (e.g., numerical only, short explanations)"
            value={additionalInfo}
            onChange={(e) => setAdditionalInfo(e.target.value)}
            className="mt-2 bg-black/40 border-purple-400/30 focus-visible:ring-purple-500 min-h-28"
          />
        </div>
        <div className="sm:col-span-2 flex items-center gap-3">
          <input
            id="isPublic"
            type="checkbox"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-purple-400/40 bg-black/40 text-purple-600 focus:ring-purple-500"
          />
          <Label htmlFor="isPublic" className="text-purple-200 select-none">Publish to public</Label>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.push("/quizzes")}
          className="border-purple-400/40 bg-black/40 hover:bg-purple-900/40"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={loading}
          className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 border-2 border-purple-400/40"
        >
          {loading ? "Generating..." : "Generate Quiz"}
        </Button>
      </div>
    </form>
  );
};