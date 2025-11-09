"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, Trash2, Save, Brain, ArrowLeft } from "lucide-react";
import { toast } from "sonner";

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  order: number;
}

export default function CreateQuizPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [subject, setSubject] = useState("");
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isPublic, setIsPublic] = useState<boolean>(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=" + encodeURIComponent("/quizzes/create"));
    }
  }, [session, isPending, router]);

  const addQuestion = () => {
    const newQuestion: Question = {
      id: Date.now().toString(),
      question: "",
      options: ["", "", "", ""],
      correctAnswer: 0,
      explanation: "",
      order: questions.length,
    };
    setQuestions([...questions, newQuestion]);
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
  };

  const updateQuestion = (id: string, field: keyof Question, value: any) => {
    setQuestions(questions.map(q => 
      q.id === id ? { ...q, [field]: value } : q
    ));
  };

  const updateOption = (questionId: string, optionIndex: number, value: string) => {
    setQuestions(questions.map(q => {
      if (q.id === questionId) {
        const newOptions = [...q.options];
        newOptions[optionIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Please enter a quiz title");
      return;
    }
    
    if (!subject.trim()) {
      toast.error("Please select a subject");
      return;
    }
    
    if (questions.length === 0) {
      toast.error("Please add at least one question");
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      if (q.options.some(opt => !opt.trim())) {
        toast.error(`Question ${i + 1} has empty options`);
        return;
      }
    }

    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      
      // Create quiz
      const quizRes = await fetch("/api/quizzes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim() || null,
          subject: subject.trim(),
          difficulty,
          isPublic: isPublic,
        })
      });

      if (!quizRes.ok) {
        const error = await quizRes.json();
        throw new Error(error.error || "Failed to create quiz");
      }

      const quiz = await quizRes.json();

      // Add questions
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        const questionRes = await fetch(`/api/quizzes/${quiz.id}/questions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` })
          },
          body: JSON.stringify({
            question: q.question.trim(),
            options: q.options.map(opt => opt.trim()),
            correctAnswer: q.correctAnswer,
            explanation: q.explanation.trim() || null,
            order: i,
          })
        });

        if (!questionRes.ok) {
          throw new Error(`Failed to add question ${i + 1}`);
        }
      }

      toast.success("Quiz created successfully!");
      router.push("/quizzes");
    } catch (error: any) {
      console.error("Error creating quiz:", error);
      toast.error(error.message || "Failed to create quiz");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Premium Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-purple-900/5 to-transparent animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/30 via-purple-600/15 to-transparent rounded-full blur-[128px] animate-[float_20s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
          {/* Header */}
          <div className="mb-8 animate-[fadeInUp_0.8s_ease-out]">
            <Button
              variant="ghost"
              onClick={() => router.push("/quizzes")}
              className="mb-4 text-purple-200 hover:text-white hover:bg-purple-500/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Button>
            <div className="flex items-center gap-4 mb-2">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-2xl opacity-80 rounded-full scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
                <div className="relative h-16 w-16 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-purple-400/40">
                  <Brain className="h-8 w-8 text-white drop-shadow-lg" />
                </div>
              </div>
              <div>
                <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">Create Quiz</h1>
                <p className="text-lg text-purple-200/80">Design your custom quiz</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            {/* Quiz Details Card */}
            <Card className="relative border-2 border-purple-400/30 bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl rounded-2xl shadow-2xl mb-6 animate-[fadeInUp_0.6s_ease-out]">
              <CardHeader>
                <CardTitle className="text-2xl font-black text-white">Quiz Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="title" className="text-purple-200">Title *</Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter quiz title"
                    className="bg-black/40 border-purple-400/40 text-white placeholder:text-purple-300/50"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="text-purple-200">Description</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Enter quiz description (optional)"
                    className="bg-black/40 border-purple-400/40 text-white placeholder:text-purple-300/50 min-h-[100px]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="subject" className="text-purple-200">Subject *</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="e.g., Math, Science"
                      className="bg-black/40 border-purple-400/40 text-white placeholder:text-purple-300/50"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="difficulty" className="text-purple-200">Difficulty *</Label>
                    <Select value={difficulty} onValueChange={(value: any) => setDifficulty(value)}>
                      <SelectTrigger className="bg-black/40 border-purple-400/40 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-black/90 border-purple-400/40">
                        <SelectItem value="easy">Easy</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Publish Toggle */}
                <div className="flex items-center gap-3 pt-2">
                  <input
                    id="isPublic"
                    type="checkbox"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-4 w-4 rounded border-purple-400/40 bg-black/40 text-purple-600 focus:ring-purple-500"
                  />
                  <Label htmlFor="isPublic" className="text-purple-200 select-none">Publish to public</Label>
                </div>
              </CardContent>
            </Card>

            {/* Questions */}
            <div className="space-y-4 mb-6">
              {questions.map((question, qIndex) => (
                <Card key={question.id} className="relative border-2 border-purple-400/30 bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl rounded-2xl shadow-xl animate-[fadeInUp_0.6s_ease-out]">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-black text-white">Question {qIndex + 1}</CardTitle>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeQuestion(question.id)}
                      className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-purple-200">Question *</Label>
                      <Textarea
                        value={question.question}
                        onChange={(e) => updateQuestion(question.id, "question", e.target.value)}
                        placeholder="Enter your question"
                        className="bg-black/40 border-purple-400/40 text-white placeholder:text-purple-300/50"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-purple-200">Options *</Label>
                      {question.options.map((option, optIndex) => (
                        <div key={optIndex} className="flex items-center gap-2">
                          <Input
                            value={option}
                            onChange={(e) => updateOption(question.id, optIndex, e.target.value)}
                            placeholder={`Option ${optIndex + 1}`}
                            className="bg-black/40 border-purple-400/40 text-white placeholder:text-purple-300/50"
                            required
                          />
                          <Button
                            type="button"
                            variant={question.correctAnswer === optIndex ? "default" : "outline"}
                            size="sm"
                            onClick={() => updateQuestion(question.id, "correctAnswer", optIndex)}
                            className={question.correctAnswer === optIndex 
                              ? "bg-green-600 hover:bg-green-700 text-white" 
                              : "border-purple-400/40 text-purple-200"}
                          >
                            {question.correctAnswer === optIndex ? "✓" : optIndex + 1}
                          </Button>
                        </div>
                      ))}
                      <p className="text-xs text-purple-300/70">Click the button to mark the correct answer</p>
                    </div>

                    <div>
                      <Label className="text-purple-200">Explanation (Optional)</Label>
                      <Textarea
                        value={question.explanation}
                        onChange={(e) => updateQuestion(question.id, "explanation", e.target.value)}
                        placeholder="Explain the correct answer"
                        className="bg-black/40 border-purple-400/40 text-white placeholder:text-purple-300/50"
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="button"
                onClick={addQuestion}
                variant="outline"
                className="flex-1 border-2 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 hover:text-white h-12"
              >
                <Plus className="h-5 w-5 mr-2" />
                Add Question
              </Button>

              <Button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 h-12 shadow-2xl shadow-purple-500/50 border-2 border-purple-400/30"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-5 w-5 mr-2" />
                    Create Quiz
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}