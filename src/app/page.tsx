"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, MessageSquare, FileQuestion, Users, Sparkles, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";

export default function Home() {
  const features = [
  {
    icon: MessageSquare,
    title: "AI Tutor",
    description: "Get instant help from Study AI v9.3, your personal AI tutor available 24/7",
    gradient: "from-purple-500 to-purple-700"
  },
  {
    icon: FileQuestion,
    title: "Interactive Quizzes",
    description: "Create, share, and take quizzes on any topic with instant feedback",
    gradient: "from-blue-500 to-blue-700"
  },
  {
    icon: Users,
    title: "Study Space",
    description: "Connect with peers, share knowledge, and collaborate on challenging topics",
    gradient: "from-green-500 to-green-700"
  }];


  const stats = [
  { label: "Students", value: "Unlimited", icon: Users },
  { label: "Quizzes", value: "User & AI Created", icon: FileQuestion },
  { label: "Success Rate", value: "98%", icon: TrendingUp }];


  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ultra Premium Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-purple-900/5 to-transparent animate-pulse" style={{ animationDuration: "8s" }} />
          
          {/* Animated Floating Orbs */}
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/30 via-purple-600/20 to-transparent rounded-full blur-[128px] animate-[float_20s_ease-in-out_infinite]" />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/25 via-indigo-500/15 to-transparent rounded-full blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-violet-500/20 via-fuchsia-500/10 to-transparent rounded-full blur-[120px] animate-[float_18s_ease-in-out_infinite]" style={{ animationDelay: "5s" }} />
          
          {/* Animated Grid Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf620_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf620_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-[gridSlide_30s_linear_infinite]" />
          
          {/* Second Animated Grid Layer */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf610_2px,transparent_2px),linear-gradient(to_bottom,#8b5cf610_2px,transparent_2px)] bg-[size:8rem_8rem] [mask-image:radial-gradient(ellipse_60%_40%_at_50%_0%,#000_60%,transparent_100%)] animate-[gridSlide_40s_linear_infinite_reverse]" />
          
          {/* Floating Particles */}
          <div className="absolute inset-0">
            {[...Array(20)].map((_, i) => (
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
        
        {/* Hero Section */}
        <section className="relative">
          <div className="relative max-w-7xl mx-auto px-6 py-32">
            <div className="text-center space-y-12">
              <div className="inline-flex items-center justify-center gap-4 mb-8 relative animate-[fadeInUp_0.8s_ease-out]">
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/50 to-purple-400/50 blur-3xl rounded-full scale-150 animate-pulse" style={{ animationDuration: "4s" }} />
                <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-0.5 shadow-2xl shadow-purple-500/50 animate-[bounce_3s_ease-in-out_infinite]">
                  <div className="h-full w-full rounded-3xl bg-black/90 backdrop-blur-xl flex items-center justify-center">
                    <GraduationCap className="text-purple-400 h-14 w-14 animate-[wiggle_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                <h1 className="relative text-7xl font-black bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl animate-[shimmer_3s_ease-in-out_infinite]">
                  Study Boi
                </h1>
              </div>

              <div className="space-y-6 relative animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
                <h2 className="text-7xl md:text-8xl font-black max-w-5xl mx-auto leading-tight bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl animate-[shimmer_3s_ease-in-out_infinite]">
                  Learn Smarter, Not Harder
                </h2>
                
                <p className="text-2xl text-purple-200/90 max-w-3xl mx-auto leading-relaxed font-medium">
                  Your AI-powered learning companion for grades 6-12. Get personalized tutoring 
                  and practice with interactive quizzes.
                </p>
              </div>
              
              <div className="flex gap-6 justify-center flex-wrap pt-8 animate-[fadeInUp_0.8s_ease-out_0.4s_both]">
                <Button
                  asChild
                  size="lg"
                  className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-xl px-12 py-8 shadow-2xl shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-110 hover:shadow-purple-500/70 hover:-translate-y-2">
                  <Link href="/sign-up">
                    <span className="relative z-10 flex items-center gap-3 font-bold">
                      Get Started Free
                      <Sparkles className="h-6 w-6 animate-[spin_3s_linear_infinite]" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl animate-[shimmerSweep_1.5s_ease-in-out_infinite]" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="relative text-xl px-12 py-8 border-2 border-purple-400/40 bg-black/40 backdrop-blur-xl hover:bg-purple-950/60 hover:border-purple-400/60 transition-all duration-300 hover:scale-110 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 font-bold hover:-translate-y-2">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section - Ultra Luxurious */}
        <section className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) =>
            <Card 
              key={index} 
              className="relative group bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl border-2 border-purple-400/30 rounded-3xl shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_80px_rgba(139,92,246,0.7)] transition-all duration-500 hover:scale-110 hover:-rotate-1 overflow-hidden animate-[fadeInUp_0.6s_ease-out_both]"
              style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Premium Shimmer Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                
                <CardContent className="relative pt-10 pb-10 text-center">
                  <div className="relative inline-flex items-center justify-center mb-6 animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDelay: `${index * 0.3}s` }}>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 blur-2xl opacity-60 rounded-full scale-150 animate-pulse" />
                    <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-purple-800/30 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/40 shadow-2xl shadow-purple-500/50 group-hover:rotate-12 transition-transform duration-500">
                      <stat.icon className="h-10 w-10 text-purple-300" />
                    </div>
                  </div>
                  <p className="text-6xl font-black mb-3 bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-lg animate-[pulse_2s_ease-in-out_infinite]">{stat.value}</p>
                  <p className="text-lg text-purple-300/90 font-semibold tracking-wide">{stat.label}</p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* Features Section - Museum Quality */}
        <section className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20 animate-[fadeInUp_0.8s_ease-out]">
            <h2 className="text-6xl font-black mb-6 bg-gradient-to-b from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-xl animate-[shimmer_3s_ease-in-out_infinite]">
              Everything You Need to Succeed
            </h2>
            <p className="text-2xl text-purple-200/80 max-w-3xl mx-auto font-medium leading-relaxed">
              Powerful tools designed to enhance your learning experience
            </p>
          </div>
          
          <div className="grid gap-10 md:grid-cols-3">
            {features.map((feature, index) =>
            <Card 
              key={index} 
              className="relative group border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-500 hover:scale-110 hover:-translate-y-2 bg-gradient-to-br from-black/50 via-purple-950/30 to-black/50 backdrop-blur-2xl rounded-3xl shadow-2xl hover:shadow-[0_30px_100px_rgba(139,92,246,0.6)] overflow-hidden animate-[fadeInUp_0.6s_ease-out_both]"
              style={{ animationDelay: `${index * 0.1}s` }}>
                {/* Animated Border Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-400/30 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl animate-[shimmerSweep_2s_ease-in-out_infinite]" />
                
                <CardContent className="relative pt-10">
                  <div className="relative inline-block mb-6 animate-[bounce_2s_ease-in-out_infinite]" style={{ animationDelay: `${index * 0.3}s` }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 blur-2xl opacity-70 rounded-2xl scale-125 animate-pulse" />
                    <div className={`relative h-20 w-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-white/20 group-hover:rotate-12 transition-transform duration-500`}>
                      <feature.icon className="h-10 w-10 text-white drop-shadow-lg" />
                    </div>
                  </div>
                  <h3 className="text-3xl font-black mb-4 text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">{feature.title}</h3>
                  <p className="text-lg text-purple-200/80 leading-relaxed font-medium">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </section>

        {/* CTA Section - Billionaire Vibes */}
        <section className="relative max-w-7xl mx-auto px-6 py-32">
          <Card className="relative border-2 border-purple-400/40 bg-gradient-to-br from-purple-950/40 via-black/60 to-purple-900/40 backdrop-blur-2xl rounded-[3rem] shadow-[0_32px_128px_rgba(139,92,246,0.6)] overflow-hidden hover:scale-[1.02] transition-all duration-500 animate-[fadeInUp_0.8s_ease-out_0.5s_both]">
            {/* Multiple Layered Glow Effects */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/40 via-purple-600/20 to-transparent rounded-full blur-[128px] animate-[float_15s_ease-in-out_infinite]" />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/30 via-indigo-600/15 to-transparent rounded-full blur-[128px] animate-[float_20s_ease-in-out_infinite_reverse]" />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
            
            <CardContent className="relative pt-24 pb-24 text-center z-10">
              <div className="relative inline-flex items-center justify-center mb-10 animate-[bounce_3s_ease-in-out_infinite]">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl opacity-80 rounded-full scale-150 animate-pulse" style={{ animationDuration: "4s" }} />
                <div className="relative h-28 w-28 rounded-3xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/50 shadow-2xl shadow-purple-500/60">
                  <Award className="h-16 w-16 text-purple-300 animate-[wiggle_2s_ease-in-out_infinite]" />
                </div>
              </div>
              <h2 className="text-6xl font-black mb-6 bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl animate-[shimmer_3s_ease-in-out_infinite]">
                Ready to Level Up Your Learning?
              </h2>
              <p className="text-2xl text-purple-200/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Join students who are already learning smarter with Study Boi
              </p>
              <Button
                asChild
                size="lg"
                className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-2xl px-16 py-10 shadow-2xl shadow-purple-500/60 border-2 border-purple-400/40 transition-all duration-300 hover:scale-110 hover:shadow-purple-500/80 rounded-2xl hover:-translate-y-2">
                <Link href="/sign-up">
                  <span className="relative z-10 flex items-center gap-3 font-black">
                    Start Learning Now
                    <Sparkles className="h-7 w-7 animate-[spin_3s_linear_infinite]" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/30 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl animate-[shimmerSweep_1.5s_ease-in-out_infinite]" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Footer - Premium Finish */}
        <footer className="relative border-t-2 border-purple-400/30 mt-32 bg-gradient-to-b from-transparent to-purple-950/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-6 animate-[fadeInUp_0.8s_ease-out]">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-2 shadow-lg shadow-purple-500/50 animate-pulse" style={{ animationDuration: "3s" }}>
                <GraduationCap className="h-full w-full text-white" />
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
                Study Boi
              </span>
            </div>
            <p className="text-lg text-purple-300/80 font-medium">© 2025 Study Boi. Empowering students to achieve their dreams.</p>
          </div>
        </footer>
      </div>

      {/* Custom Keyframes Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(30px, -30px) scale(1.05); }
          50% { transform: translate(-20px, -50px) scale(0.95); }
          75% { transform: translate(-40px, -20px) scale(1.02); }
        }
        
        @keyframes gridSlide {
          0% { background-position: 0 0; }
          100% { background-position: 64px 64px; }
        }
        
        @keyframes floatParticle {
          0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
          25% { transform: translate(20px, -40px) scale(1.5); opacity: 0.6; }
          50% { transform: translate(-30px, -80px) scale(1); opacity: 0.4; }
          75% { transform: translate(15px, -60px) scale(1.3); opacity: 0.7; }
        }
        
        @keyframes shimmer {
          0%, 100% { background-position: -200% center; }
          50% { background-position: 200% center; }
        }
        
        @keyframes shimmerSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-5deg); }
          75% { transform: rotate(5deg); }
        }
      `}</style>
    </>
  );
}