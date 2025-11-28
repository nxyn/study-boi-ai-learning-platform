"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter, useParams } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle2, XCircle, Trophy, ArrowLeft, ArrowRight, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

interface Question {
  id: number;
  quizId: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string | null;
  order: number;
}

interface Quiz {
  id: number;
  title: string;
  description: string | null;
  subject: string;
  difficulty: string;
  createdBy: string;
  creatorName: string;
  questions: Question[];
}

/**
 * The page for taking a specific quiz.
 * It fetches the quiz and its questions, and handles the quiz-taking logic.
 */
export default function QuizPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const params = useParams();
  const quizId = params.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=" + encodeURIComponent(`/quizzes/${quizId}`));
    }
  }, [session, isPending, router, quizId]);

  useEffect(() => {
    if (session?.user) {
      fetchQuiz();
    }
  }, [session, quizId]);

  const fetchQuiz = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch(`/api/quizzes/${quizId}`, {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (!res.ok) {
        throw new Error("Failed to load quiz");
      }

      const data = await res.json();
      
      // Validate quiz has questions
      if (!data.quiz || !data.quiz.questions || data.quiz.questions.length === 0) {
        toast.error("This quiz has no questions");
        router.push("/quizzes");
        return;
      }
      
      setQuiz(data.quiz);
      setSelectedAnswers(new Array(data.quiz.questions.length).fill(-1));
    } catch (error) {
      console.error("Error fetching quiz:", error);
      toast.error("Failed to load quiz");
      router.push("/quizzes");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestionIndex] = answerIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < (quiz?.questions.length || 0) - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmit = async () => {
    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      toast.error("Quiz has no questions");
      return;
    }
    
    if (selectedAnswers.some(ans => ans === -1)) {
      toast.error("Please answer all questions before submitting");
      return;
    }

    setIsSubmitting(true);
    try {
      const score = selectedAnswers.reduce((acc, answer, index) => {
        return answer === quiz.questions[index].correctAnswer ? acc + 1 : acc;
      }, 0);

      const token = localStorage.getItem("bearer_token");
      await fetch("/api/quiz-attempts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          quizId: parseInt(quizId),
          score,
          totalQuestions: quiz.questions.length,
        })
      });

      setShowResults(true);
      toast.success("Quiz completed!");
    } catch (error) {
      console.error("Error submitting quiz:", error);
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRetry = () => {
    setSelectedAnswers(new Array(quiz?.questions.length || 0).fill(-1));
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  if (isPending || isLoading || !session?.user) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-purple-200/80 mb-4">This quiz has no questions</p>
            <Button onClick={() => router.push("/quizzes")}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center">
            <p className="text-purple-200/80 mb-4">Error loading question</p>
            <Button onClick={() => router.push("/quizzes")}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      </>
    );
  }
  
  const score = selectedAnswers.reduce((acc, answer, index) => {
    return answer === quiz.questions[index].correctAnswer ? acc + 1 : acc;
  }, 0);
  const percentage = Math.round((score / quiz.questions.length) * 100);

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
            <div className="space-y-2">
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">{quiz.title}</h1>
              {quiz.description && (
                <p className="text-lg text-purple-200/80">{quiz.description}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">
                  {quiz.subject}
                </span>
                <span className={`px-3 py-1 rounded-lg text-xs font-bold border ${
                  quiz.difficulty === "easy" 
                    ? "bg-green-500/20 text-green-300 border-green-400/40"
                    : quiz.difficulty === "medium"
                    ? "bg-yellow-500/20 text-yellow-300 border-yellow-400/40"
                    : "bg-red-500/20 text-red-300 border-red-400/40"
                }`}>
                  {quiz.difficulty}
                </span>
              </div>
            </div>
          </div>

          {!showResults ? (
            <>
              {/* Progress Bar */}
              <div className="mb-6 animate-[fadeInUp_0.6s_ease-out]">
                <div className="flex justify-between text-sm text-purple-200/80 mb-2">
                  <span>Question {currentQuestionIndex + 1} of {quiz.questions.length}</span>
                  <span>{selectedAnswers.filter(a => a !== -1).length} answered</span>
                </div>
                <Progress value={((currentQuestionIndex + 1) / quiz.questions.length) * 100} className="h-2" />
              </div>

              {/* Question Card */}
              <Card className="relative border-2 border-purple-400/30 bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl rounded-2xl shadow-2xl mb-6 animate-[fadeInUp_0.6s_ease-out_0.1s_both]">
                <CardHeader>
                  <CardTitle className="text-2xl font-black text-white">{currentQuestion.question}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(index)}
                      className={`w-full p-4 rounded-xl text-left transition-all duration-300 border-2 ${
                        selectedAnswers[currentQuestionIndex] === index
                          ? "bg-purple-600/40 border-purple-400 text-white shadow-lg shadow-purple-500/30"
                          : "bg-black/40 border-purple-400/30 text-purple-200 hover:bg-purple-500/20 hover:border-purple-400/50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                          selectedAnswers[currentQuestionIndex] === index
                            ? "bg-purple-500 text-white"
                            : "bg-purple-500/20 text-purple-300"
                        }`}>
                          {index + 1}
                        </div>
                        <span className="flex-1">{option}</span>
                      </div>
                    </button>
                  ))}
                </CardContent>
              </Card>

              {/* Navigation Buttons */}
              <div className="flex gap-4">
                <Button
                  onClick={handlePrevious}
                  disabled={currentQuestionIndex === 0}
                  variant="outline"
                  className="flex-1 border-2 border-purple-400/40 text-purple-200 hover:bg-purple-500/20 h-12"
                >
                  <ArrowLeft className="h-5 w-5 mr-2" />
                  Previous
                </Button>

                {currentQuestionIndex === quiz.questions.length - 1 ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 h-12 shadow-2xl shadow-purple-500/50"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      <>
                        Submit Quiz
                        <Trophy className="h-5 w-5 ml-2" />
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={handleNext}
                    className="flex-1 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 h-12 shadow-2xl shadow-purple-500/50"
                  >
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                  </Button>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Results Card */}
              <Card className="relative border-2 border-purple-400/40 bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl rounded-2xl shadow-2xl mb-6 animate-[fadeInUp_0.8s_ease-out]">
                <CardContent className="py-12 text-center">
                  <div className="relative inline-flex items-center justify-center mb-6">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl opacity-80 rounded-full scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
                    <div className="relative h-24 w-24 rounded-2xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/40 shadow-2xl shadow-purple-500/50">
                      <Trophy className="h-12 w-12 text-purple-300" />
                    </div>
                  </div>
                  <h2 className="text-4xl font-black mb-4 bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent">Quiz Complete!</h2>
                  <p className="text-6xl font-black mb-6 bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent">
                    {percentage}%
                  </p>
                  <p className="text-xl text-purple-200/80 mb-8">
                    You scored {score} out of {quiz.questions.length}
                  </p>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button
                      onClick={handleRetry}
                      variant="outline"
                      className="border-2 border-purple-400/40 text-purple-200 hover:bg-purple-500/20"
                    >
                      <RotateCcw className="h-5 w-5 mr-2" />
                      Retry Quiz
                    </Button>
                    <Button
                      onClick={() => router.push("/quizzes")}
                      className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 shadow-2xl shadow-purple-500/50"
                    >
                      Back to Quizzes
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Answer Review */}
              <div className="space-y-4">
                <h3 className="text-2xl font-black text-white mb-4">Review Answers</h3>
                {quiz.questions.map((question, index) => {
                  const userAnswer = selectedAnswers[index];
                  const isCorrect = userAnswer === question.correctAnswer;
                  
                  return (
                    <Card key={question.id} className="relative border-2 border-purple-400/30 bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl rounded-2xl shadow-xl">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-4">
                          <CardTitle className="text-lg font-black text-white flex-1">
                            {index + 1}. {question.question}
                          </CardTitle>
                          {isCorrect ? (
                            <CheckCircle2 className="h-6 w-6 text-green-400 flex-shrink-0" />
                          ) : (
                            <XCircle className="h-6 w-6 text-red-400 flex-shrink-0" />
                          )}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-2">
                        {question.options.map((option, optIndex) => (
                          <div
                            key={optIndex}
                            className={`p-3 rounded-lg border-2 ${
                              optIndex === question.correctAnswer
                                ? "bg-green-500/20 border-green-400/40 text-green-200"
                                : optIndex === userAnswer
                                ? "bg-red-500/20 border-red-400/40 text-red-200"
                                : "bg-black/20 border-purple-400/20 text-purple-200/60"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-bold">{optIndex + 1}.</span>
                              <span>{option}</span>
                              {optIndex === question.correctAnswer && (
                                <span className="ml-auto text-xs font-bold">(Correct)</span>
                              )}
                              {optIndex === userAnswer && optIndex !== question.correctAnswer && (
                                <span className="ml-auto text-xs font-bold">(Your answer)</span>
                              )}
                            </div>
                          </div>
                        ))}
                        {question.explanation && (
                          <div className="mt-4 p-4 rounded-lg bg-purple-500/10 border border-purple-400/30">
                            <p className="text-sm font-bold text-purple-200 mb-1">Explanation:</p>
                            <p className="text-sm text-purple-200/80">{question.explanation}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}