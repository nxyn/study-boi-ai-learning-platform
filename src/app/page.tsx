"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { GraduationCap, MessageSquare, FileQuestion, Users, Sparkles, TrendingUp, Award } from "lucide-react";
import Link from "next/link";
import { Navigation } from "@/components/navigation";
import { memo, useMemo } from "react";
import { useInView } from "react-intersection-observer";

// Memoized stat card component for better performance
const StatCard = memo(({ stat, index }: { stat: any; index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Card
      ref={ref}
      className={`relative group bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-xl border-2 border-purple-400/30 rounded-3xl shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_20px_80px_rgba(139,92,246,0.7)] transition-all duration-300 hover:scale-105 overflow-hidden ${inView ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: 'translateZ(0)',
        willChange: inView ? 'auto' : 'transform'
      }}>
      
      <CardContent className="relative pt-10 pb-10 text-center">
        <div className="relative inline-flex items-center justify-center mb-6">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 blur-xl opacity-40 rounded-full" />
          <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600/30 to-purple-800/30 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/40 shadow-2xl shadow-purple-500/50 group-hover:rotate-6 transition-transform duration-300">
            <stat.icon className="h-10 w-10 text-purple-300" />
          </div>
        </div>
        <p className="text-6xl font-black mb-3 bg-gradient-to-br from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-lg">{stat.value}</p>
        <p className="text-lg text-purple-300/90 font-semibold tracking-wide">{stat.label}</p>
      </CardContent>
    </Card>
  );
});
StatCard.displayName = "StatCard";

// Memoized feature card component
const FeatureCard = memo(({ feature, index }: { feature: any; index: number }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <Card
      ref={ref}
      className={`relative group border-2 border-purple-400/30 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 hover:-translate-y-2 bg-gradient-to-br from-black/50 via-purple-950/30 to-black/50 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-[0_30px_100px_rgba(139,92,246,0.6)] overflow-hidden ${inView ? 'opacity-100' : 'opacity-0'}`}
      style={{ 
        animationDelay: `${index * 0.1}s`,
        transform: 'translateZ(0)',
        willChange: inView ? 'auto' : 'transform'
      }}>
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-400/20 to-purple-600/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <CardContent className="relative pt-10">
        <div className="relative inline-block mb-6">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500 to-purple-700 blur-xl opacity-50 rounded-2xl" />
          <div className={`relative h-20 w-20 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-white/20 group-hover:rotate-6 transition-transform duration-300`}>
            <feature.icon className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
        </div>
        <h3 className="text-3xl font-black mb-4 text-white drop-shadow-lg group-hover:scale-105 transition-transform duration-300">{feature.title}</h3>
        <p className="text-lg text-purple-200/80 leading-relaxed font-medium">
          {feature.description}
        </p>
      </CardContent>
    </Card>
  );
});
FeatureCard.displayName = "FeatureCard";

// Optimized floating particles with GPU acceleration - fewer particles, lazy loaded
const FloatingParticles = memo(() => {
  const particles = useMemo(() => 
    Array.from({ length: 5 }, (_, i) => ({
      key: i,
      left: `${Math.random() * 100}%`,
      top: `${Math.random() * 100}%`,
      delay: `${Math.random() * 8}s`,
      duration: `${25 + Math.random() * 15}s`
    })), []
  );

  return (
    <div className="absolute inset-0 pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.key}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          style={{
            left: particle.left,
            top: particle.top,
            animation: `floatParticle ${particle.duration} ease-in-out infinite`,
            animationDelay: particle.delay,
            transform: 'translateZ(0)',
            willChange: 'transform'
          }}
        />
      ))}
    </div>
  );
});
FloatingParticles.displayName = "FloatingParticles";

export default function Home() {
  const features = useMemo(() => [
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
    }
  ], []);

  const stats = useMemo(() => [
    { label: "Students", value: "Unlimited", icon: Users },
    { label: "Quizzes", value: "User & AI Created", icon: FileQuestion },
    { label: "Success Rate", value: "98%", icon: TrendingUp }
  ], []);

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Ultra Premium Animated Background */}
        <div className="fixed inset-0 pointer-events-none" style={{ transform: 'translateZ(0)' }}>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-purple-900/5 to-transparent opacity-80" />
          
          {/* Animated Floating Orbs - Optimized with slower animations */}
          <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-gradient-to-br from-purple-500/15 via-purple-600/10 to-transparent rounded-full blur-[120px] animate-[float_40s_ease-in-out_infinite]" style={{ transform: 'translateZ(0)', willChange: 'transform' }} />
          <div className="absolute top-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/10 via-indigo-500/8 to-transparent rounded-full blur-[100px] animate-[float_45s_ease-in-out_infinite_reverse]" style={{ transform: 'translateZ(0)', willChange: 'transform' }} />
          <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] bg-gradient-to-br from-violet-500/10 via-fuchsia-500/6 to-transparent rounded-full blur-[110px] animate-[float_38s_ease-in-out_infinite]" style={{ animationDelay: "5s", transform: 'translateZ(0)', willChange: 'transform' }} />
          
          {/* Animated Grid Overlay - Slower */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf610_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf610_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-[gridSlide_60s_linear_infinite]" style={{ transform: 'translateZ(0)', willChange: 'background-position' }} />
          
          {/* Floating Particles - Reduced count */}
          <FloatingParticles />
        </div>
        
        {/* Hero Section */}
        <section className="relative">
          <div className="relative max-w-7xl mx-auto px-6 py-32">
            <div className="text-center space-y-12">
              <div className="inline-flex items-center justify-center gap-4 mb-8 relative">
                {/* Premium Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600/40 to-purple-400/40 blur-2xl rounded-full" />
                <div className="relative h-24 w-24 rounded-3xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-0.5 shadow-2xl shadow-purple-500/50">
                  <div className="h-full w-full rounded-3xl bg-black/90 backdrop-blur-xl flex items-center justify-center">
                    <GraduationCap className="text-purple-400 h-14 w-14" />
                  </div>
                </div>
                <h1 className="relative text-7xl font-black bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent drop-shadow-2xl">
                  Study Boi
                </h1>
              </div>

              <div className="space-y-6 relative">
                <h2 className="text-7xl md:text-8xl font-black max-w-5xl mx-auto leading-tight bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
                  Learn Smarter, Not Harder
                </h2>
                
                <p className="text-2xl text-purple-200/90 max-w-3xl mx-auto leading-relaxed font-medium">
                  Your AI-powered learning companion for grades 6-12. Get personalized tutoring 
                  and practice with interactive quizzes.
                </p>
              </div>
              
              <div className="flex gap-6 justify-center flex-wrap pt-8">
                <Button
                  asChild
                  size="lg"
                  className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-xl px-12 py-8 shadow-2xl shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/70 hover:-translate-y-1">
                  <Link href="/sign-up">
                    <span className="relative z-10 flex items-center gap-3 font-bold">
                      Get Started Free
                      <Sparkles className="h-6 w-6" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="relative text-xl px-12 py-8 border-2 border-purple-400/40 bg-black/40 backdrop-blur-xl hover:bg-purple-950/60 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 shadow-xl hover:shadow-2xl hover:shadow-purple-500/30 font-bold hover:-translate-y-1">
                  <Link href="/sign-in">Sign In</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-24">
          <div className="grid gap-8 md:grid-cols-3">
            {stats.map((stat, index) => (
              <StatCard key={index} stat={stat} index={index} />
            ))}
          </div>
        </section>

        {/* Features Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-32">
          <div className="text-center mb-20">
            <h2 className="text-6xl font-black mb-6 bg-gradient-to-b from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-xl">
              Everything You Need to Succeed
            </h2>
            <p className="text-2xl text-purple-200/80 max-w-3xl mx-auto font-medium leading-relaxed">
              Powerful tools designed to enhance your learning experience
            </p>
          </div>
          
          <div className="grid gap-10 md:grid-cols-3">
            {features.map((feature, index) => (
              <FeatureCard key={index} feature={feature} index={index} />
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="relative max-w-7xl mx-auto px-6 py-32">
          <Card className="relative border-2 border-purple-400/40 bg-gradient-to-br from-purple-950/40 via-black/60 to-purple-900/40 backdrop-blur-xl rounded-[3rem] shadow-[0_32px_128px_rgba(139,92,246,0.6)] overflow-hidden hover:scale-[1.01] transition-all duration-300">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent rounded-full blur-[120px] animate-[float_35s_ease-in-out_infinite]" style={{ transform: 'translateZ(0)', willChange: 'transform' }} />
            <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-gradient-to-tr from-blue-500/15 via-indigo-600/8 to-transparent rounded-full blur-[120px] animate-[float_40s_ease-in-out_infinite_reverse]" style={{ transform: 'translateZ(0)', willChange: 'transform' }} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/[0.03] to-transparent" />
            
            <CardContent className="relative pt-24 pb-24 text-center z-10">
              <div className="relative inline-flex items-center justify-center mb-10">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-2xl opacity-60 rounded-full" />
                <div className="relative h-28 w-28 rounded-3xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/50 shadow-2xl shadow-purple-500/60">
                  <Award className="h-16 w-16 text-purple-300" />
                </div>
              </div>
              <h2 className="text-6xl font-black mb-6 bg-gradient-to-b from-white via-purple-100 to-purple-300 bg-clip-text text-transparent drop-shadow-2xl">
                Ready to Level Up Your Learning?
              </h2>
              <p className="text-2xl text-purple-200/90 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                Join students who are already learning smarter with Study Boi
              </p>
              <Button
                asChild
                size="lg"
                className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-2xl px-16 py-10 shadow-2xl shadow-purple-500/60 border-2 border-purple-400/40 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/80 rounded-2xl hover:-translate-y-1">
                <Link href="/sign-up">
                  <span className="relative z-10 flex items-center gap-3 font-black">
                    Start Learning Now
                    <Sparkles className="h-7 w-7" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/30 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </section>

        {/* Footer */}
        <footer className="relative border-t-2 border-purple-400/30 mt-32 bg-gradient-to-b from-transparent to-purple-950/20 backdrop-blur-xl">
          <div className="max-w-7xl mx-auto px-6 py-16 text-center">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 p-2 shadow-lg shadow-purple-500/50">
                <GraduationCap className="h-full w-full text-white" />
              </div>
              <span className="font-black text-2xl bg-gradient-to-r from-purple-300 to-purple-500 bg-clip-text text-transparent">
                Study Boi
              </span>
            </div>
            <p className="text-lg text-purple-300/80 font-medium mb-4">© 2025 Study Boi. Empowering students to achieve their dreams.</p>
            
            {/* Powered by Compyle Watermark */}
            <div className="pt-6 border-t border-purple-400/20">
              <p className="text-sm text-purple-400/60 font-medium">
                Powered by <span className="font-bold text-purple-400/80">Compyle</span>
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}