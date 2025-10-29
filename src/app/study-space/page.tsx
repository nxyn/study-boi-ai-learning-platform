"use client";

import { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, Plus, Users, MessageCircle, ThumbsUp, Sparkles, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { formatDistanceToNow } from "date-fns";

interface Discussion {
  id: number;
  title: string;
  content: string;
  user_id: string;
  user_name: string;
  user_grade: string;
  image_url: string | null;
  likes_count: number;
  replies_count: number;
  created_at: string;
}

export default function StudySpacePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [discussions, setDiscussions] = useState<Discussion[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=" + encodeURIComponent("/study-space"));
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchDiscussions();
    }
  }, [session]);

  const fetchDiscussions = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/discussions", {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        }
      });

      if (response.ok) {
        const data = await response.json();
        setDiscussions(data.discussions || []);
      }
    } catch (error) {
      console.error("Error fetching discussions:", error);
      toast.error("Failed to load discussions");
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
        {/* Ultra Premium Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-purple-900/5 to-transparent animate-pulse" style={{ animationDuration: "8s" }} />
          
          {/* Animated Floating Orbs */}
          <div className="absolute top-0 right-1/4 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/30 via-purple-600/15 to-transparent rounded-full blur-[128px] animate-[float_20s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-gradient-to-br from-pink-500/15 via-purple-500/10 to-transparent rounded-full blur-[90px] animate-[float_18s_ease-in-out_infinite]" style={{ animationDelay: "5s" }} />
          
          {/* Animated Grid */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf615_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf615_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] animate-[gridSlide_30s_linear_infinite]" />
          
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
          <div className="relative max-w-5xl mx-auto px-6 py-16">
            {/* Header - Premium Style */}
            <div className="mb-12 relative animate-[fadeInUp_0.8s_ease-out]">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-5">
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl opacity-80 rounded-full scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
                    <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-purple-400/40 animate-[bounce_3s_ease-in-out_infinite]">
                      <Users className="h-10 w-10 text-white drop-shadow-lg animate-[wiggle_2s_ease-in-out_infinite]" />
                    </div>
                  </div>
                  <div>
                    <h1 className="text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-[shimmer_3s_ease-in-out_infinite]">Study Space</h1>
                    <p className="text-xl text-purple-200/80 font-medium">Connect with fellow learners</p>
                  </div>
                </div>
                <Button
                  onClick={() => router.push("/study-space/create")}
                  className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 h-14 px-8 rounded-2xl shadow-2xl shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                >
                  <Plus className="h-5 w-5 mr-2 group-hover:rotate-90 transition-transform duration-300" />
                  New Discussion
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl animate-[shimmerSweep_1.5s_ease-in-out_infinite]" />
                </Button>
              </div>
            </div>

            {/* Discussions Feed */}
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-purple-400" />
              </div>
            ) : discussions.length === 0 ? (
              <Card className="relative border-2 border-purple-400/40 bg-gradient-to-br from-black/60 via-purple-950/30 to-black/60 backdrop-blur-2xl rounded-3xl shadow-[0_20px_80px_rgba(139,92,246,0.6)] overflow-hidden animate-[fadeInUp_0.8s_ease-out]">
                <CardContent className="py-20">
                  <div className="flex flex-col items-center justify-center text-center">
                    <div className="relative mb-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl opacity-70 rounded-full scale-150 animate-pulse" style={{ animationDuration: "4s" }} />
                      <div className="relative h-28 w-28 rounded-3xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/40 shadow-2xl shadow-purple-500/50 animate-[bounce_3s_ease-in-out_infinite]">
                        <Users className="h-14 w-14 text-purple-300 animate-[wiggle_2s_ease-in-out_infinite]" />
                      </div>
                    </div>
                    <h3 className="text-3xl font-black mb-4 bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent">No discussions yet</h3>
                    <p className="text-lg text-purple-200/70 max-w-md font-medium leading-relaxed mb-8">
                      Start the conversation! Share your questions, insights, or study tips with the community.
                    </p>
                    <Button
                      onClick={() => router.push("/study-space/create")}
                      className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 h-14 px-8 rounded-2xl shadow-2xl shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    >
                      <Plus className="h-5 w-5 mr-2" />
                      Create Discussion
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                {discussions.map((discussion, index) => (
                  <Card
                    key={discussion.id}
                    className="relative group bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl border-2 border-purple-400/30 rounded-2xl shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_16px_64px_rgba(139,92,246,0.6)] transition-all duration-500 hover:scale-[1.02] overflow-hidden cursor-pointer animate-[fadeInUp_0.6s_ease-out_both]"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    onClick={() => router.push(`/study-space/${discussion.id}`)}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                    <CardHeader className="relative">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border border-purple-400/40 shadow-lg shadow-purple-500/30 flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                          <Users className="h-6 w-6 text-purple-300" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="font-bold text-purple-200">{discussion.user_name}</span>
                            <span className="px-2 py-0.5 rounded-lg text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-400/40">
                              Grade {discussion.user_grade}
                            </span>
                            <span className="text-sm text-purple-300/60">
                              {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
                            </span>
                          </div>
                          <CardTitle className="text-xl font-black text-white mb-2 group-hover:text-purple-200 transition-colors">
                            {discussion.title}
                          </CardTitle>
                          <CardDescription className="text-purple-200/70 line-clamp-2 font-medium">
                            {discussion.content}
                          </CardDescription>
                        </div>
                      </div>
                      {discussion.image_url && (
                        <div className="mt-4 rounded-xl overflow-hidden border-2 border-purple-400/30 shadow-lg">
                          <img 
                            src={discussion.image_url} 
                            alt="Discussion" 
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="relative">
                      <div className="flex items-center gap-6 text-sm text-purple-300/70">
                        <div className="flex items-center gap-2">
                          <ThumbsUp className="h-4 w-4" />
                          <span className="font-medium">{discussion.likes_count} likes</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MessageCircle className="h-4 w-4" />
                          <span className="font-medium">{discussion.replies_count} replies</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Tips - Premium Cards */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { emoji: "💬", text: "Share your questions and get help from peers", delay: 0 },
                { emoji: "🤝", text: "Help others by sharing your knowledge", delay: 0.1 },
                { emoji: "📸", text: "Add images to your posts for better clarity", delay: 0.2 }
              ].map((tip, index) => (
                <Card key={index} className="relative group bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl border-2 border-purple-400/30 rounded-2xl shadow-[0_8px_32px_rgba(139,92,246,0.4)] hover:shadow-[0_16px_64px_rgba(139,92,246,0.6)] transition-all duration-500 hover:scale-105 hover:-translate-y-1 overflow-hidden animate-[fadeInUp_0.6s_ease-out_both]"
                  style={{ animationDelay: `${tip.delay}s` }}>
                  <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <CardContent className="relative pt-8 pb-8">
                    <p className="text-base text-purple-200/90 font-medium leading-relaxed">
                      {tip.emoji} <strong className="text-white">Tip:</strong> {tip.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
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
