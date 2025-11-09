"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, MessageSquare, FileQuestion, Users, Award, TrendingUp, Sparkles } from "lucide-react";
import Link from "next/link";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in");
    }
  }, [session, isPending, router]);

  // Fetch user stats from DB-backed APIs
  const [quizCount, setQuizCount] = useState<number>(0);
  const [avgScore, setAvgScore] = useState<number | null>(null);
  const [achievementsCount, setAchievementsCount] = useState<number>(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const token = localStorage.getItem("bearer_token");
        const headers: HeadersInit = {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        };

        const [attemptsRes, achievementsRes] = await Promise.all([
          fetch("/api/quiz-attempts", { headers }),
          fetch("/api/achievements", { headers }),
        ]);

        if (attemptsRes.ok) {
          const data = await attemptsRes.json();
          const attempts = Array.isArray(data?.attempts) ? data.attempts : [];
          setQuizCount(attempts.length);
          if (attempts.length > 0) {
            const avg = Math.round(
              (attempts.reduce((acc: number, a: any) => acc + (a.totalQuestions ? (a.score / a.totalQuestions) * 100 : 0), 0) /
                attempts.length)
            );
            setAvgScore(Number.isFinite(avg) ? avg : 0);
          } else {
            setAvgScore(null);
          }
        }

        if (achievementsRes.ok) {
          const achievements = await achievementsRes.json();
          setAchievementsCount(Array.isArray(achievements) ? achievements.length : 0);
        }
      } catch (e) {
        // Swallow errors to avoid breaking the dashboard UI
        console.error("Failed to load stats", e);
      }
    };

    if (session?.user) loadStats();
  }, [session]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const quickActions = [
    {
      title: "Chat with AI Tutor",
      description: "Get instant help with any subject",
      icon: MessageSquare,
      href: "/chat-tutor",
      gradient: "from-purple-500 to-purple-700"
    },
    {
      title: "Browse Quizzes",
      description: "Practice with interactive quizzes",
      icon: FileQuestion,
      href: "/quizzes",
      gradient: "from-blue-500 to-blue-700"
    },
    {
      title: "Study Space",
      description: "Collaborate with peers",
      icon: Users,
      href: "/study-space",
      gradient: "from-green-500 to-green-700"
    }
  ];

  // Dynamic stats bound to DB
  const dashboardStats = [
    { title: "Quizzes Taken", value: String(quizCount), icon: FileQuestion, delay: 0 },
    { title: "Average Score", value: avgScore !== null ? `${avgScore}%` : "-", icon: TrendingUp, delay: 0.1 },
    { title: "Achievements", value: String(achievementsCount), icon: Award, delay: 0.2 }
  ];

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ultra Premium Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-purple-900/5 to-transparent animate-pulse" style={{ animationDuration: "8s" }} />
          
          {/* Animated Floating Orbs - Billionaire Style */}
          <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/30 via-purple-600/15 to-transparent rounded-full blur-[128px] animate-[float_20s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 right-1/3 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-transparent rounded-full blur-[90px] animate-[float_18s_ease-in-out_infinite]" style={{ animationDelay: "5s" }} />
          
          {/* Animated Grid - Luxury Edition with Movement */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf620_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf620_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-[gridSlide_30s_linear_infinite]" />
          
          {/* Additional Animated Grid Layer for Depth */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf610_2px,transparent_2px),linear-gradient(to_bottom,#8b5cf610_2px,transparent_2px)] bg-[size:8rem_8rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_60%,transparent_100%)] animate-[gridSlide_40s_linear_infinite_reverse]" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(15)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-purple-400/40 rounded-full animate-[floatParticle_15s_ease-in-out_infinite]"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 10}s`,
                  animationDuration: `${15 + Math.random() * 10}s`
                }}
              />
            ))}
          </div>
        </div>
        
        <div className="relative">
          <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12 md:py-16">
            {/* Welcome Section - Billionaire Style with Animation */}
            <div className="mb-8 sm:mb-12 md:mb-16 relative animate-[fadeInUp_0.8s_ease-out]">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl animate-pulse" />
              <h1 className="text-3xl sm:text-5xl md:text-6xl font-black mb-2 sm:mb-4 bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-[shimmer_3s_ease-in-out_infinite]">
                Welcome back, {session.user.name}!
              </h1>
              <p className="text-base sm:text-xl md:text-2xl text-purple-200/80 font-medium animate-[fadeIn_1s_ease-out_0.3s_both]">
                Ready to continue your learning journey?
              </p>
            </div>

            {/* Quick Actions - Museum Quality with Staggered Animation */}
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mb-8 sm:mb-12 md:mb-16">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Link key={index} href={action.href}>
                    <Card 
                      className="relative group border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 sm:hover:-translate-y-2 bg-gradient-to-br from-black/50 via-purple-950/30 to-black/50 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-2xl hover:shadow-[0_30px_100px_rgba(139,92,246,0.6)] h-full cursor-pointer overflow-hidden animate-[fadeInUp_0.6s_ease-out_both]"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-400/30 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl animate-[shimmerSweep_2s_ease-in-out_infinite]" />
                      
                      <CardContent className="relative pt-6 sm:pt-8 md:pt-10 pb-6 sm:pb-8 md:pb-10">
                        <div className="relative inline-block mb-4 sm:mb-6 animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDelay: `${index * 0.3}s` }}>
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 blur-2xl opacity-70 rounded-2xl scale-125 animate-pulse" />
                          <div className={`relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-white/20 group-hover:rotate-12 transition-transform duration-500`}>
                            <Icon className="h-8 w-8 sm:h-10 sm:w-10 text-white drop-shadow-lg" />
                          </div>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black mb-2 sm:mb-3 text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">{action.title}</h3>
                        <p className="text-sm sm:text-base md:text-lg text-purple-200/70 font-medium">{action.description}</p>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Stats Grid - Ultra Luxurious with Animations */}
            <div className="grid gap-4 sm:gap-6 md:gap-8 grid-cols-1 sm:grid-cols-3 mb-8 sm:mb-12 md:mb-16">
              {dashboardStats.map((stat, index) => (
                <Card 
                  key={index}
                  className="relative group bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl border-2 border-purple-400/30 rounded-2xl sm:rounded-3xl shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_80px_rgba(139,92,246,0.7)] transition-all duration-500 hover:scale-105 sm:hover:scale-110 hover:-rotate-1 overflow-hidden animate-[fadeInUp_0.6s_ease-out_both]"
                  style={{ animationDelay: `${stat.delay}s` }}
                >
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <CardHeader className="relative flex flex-row items-center justify-between pb-3 sm:pb-4">
                    <CardTitle className="text-sm sm:text-base md:text-lg font-bold text-purple-200/90">
                      {stat.title}
                    </CardTitle>
                    <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-600/30 to-purple-800/30 backdrop-blur-xl flex items-center justify-center border border-purple-400/40 shadow-lg shadow-purple-500/30 group-hover:rotate-12 group-hover:scale-110 transition-all duration-500">
                      <stat.icon className="h-5 w-5 sm:h-6 sm:w-6 text-purple-300" />
                    </div>
                  </CardHeader>
                  <CardContent className="relative">
                    <div className="text-4xl sm:text-5xl font-black mb-2 bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent animate-[pulse_2s_ease-in-out_infinite]">{stat.value}</div>
                    <p className="text-xs sm:text-sm text-purple-300/80 font-medium">
                      {index === 0 && "Start taking quizzes to see your progress"}
                      {index === 1 && "Complete quizzes to track your performance"}
                      {index === 2 && "Unlock achievements as you learn"}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Section - Premium with Animation */}
            <Card className="relative border-2 border-purple-400/40 bg-gradient-to-br from-purple-950/40 via-black/60 to-purple-900/40 backdrop-blur-2xl rounded-2xl sm:rounded-3xl shadow-[0_20px_80px_rgba(139,92,246,0.6)] overflow-hidden hover:scale-[1.01] transition-all duration-500 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
              <div className="absolute top-0 right-0 w-[300px] sm:w-[500px] h-[300px] sm:h-[500px] bg-gradient-to-br from-purple-500/40 via-purple-600/20 to-transparent rounded-full blur-[80px] sm:blur-[128px] animate-[float_15s_ease-in-out_infinite]" />
              <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
              
              <CardContent className="relative pt-8 sm:pt-10 md:pt-12 pb-8 sm:pb-10 md:pb-12 z-10">
                <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
                  <div className="relative inline-flex items-center justify-center animate-[bounce_3s_ease-in-out_infinite] mx-auto sm:mx-0">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-xl sm:blur-2xl opacity-70 rounded-full scale-150 animate-pulse" />
                    <div className="relative h-16 w-16 sm:h-20 sm:w-20 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/40 shadow-2xl shadow-purple-500/50 flex-shrink-0">
                      <Sparkles className="h-8 w-8 sm:h-10 sm:w-10 text-purple-300 animate-[spin_4s_linear_infinite]" />
                    </div>
                  </div>
                  <div className="flex-1 text-center sm:text-left">
                    <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-3 sm:mb-4 text-white drop-shadow-lg animate-[shimmer_3s_ease-in-out_infinite]">New to Study Boi?</h3>
                    <p className="text-base sm:text-lg md:text-xl text-purple-200/80 mb-4 sm:mb-6 leading-relaxed font-medium">
                      Start with AI Tutor to get personalized help, or browse quizzes to practice what you've learned. Join Study Space to connect with other students!
                    </p>
                    <Button
                      asChild
                      className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 shadow-xl shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-105 sm:hover:scale-110 hover:-translate-y-1 rounded-xl w-full sm:w-auto"
                    >
                      <Link href="/chat-tutor">
                        <span className="relative z-10 flex items-center justify-center gap-2 font-bold">
                          Get Started with AI Tutor
                          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 group-hover:rotate-12 transition-transform duration-300" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/30 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl animate-[shimmerSweep_1.5s_ease-in-out_infinite]" />
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}