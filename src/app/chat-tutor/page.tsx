"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Navigation } from "@/components/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Bot, User, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatTutorPage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=" + encodeURIComponent("/chat-tutor"));
    }
  }, [session, isPending, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("bearer_token");
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: messages
        })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to get response");
      }

      const data = await response.json();
      
      const assistantMessage: Message = {
        role: "assistant",
        content: data.response
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
              <div className="flex items-center gap-5 mb-4">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl opacity-80 rounded-full scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
                  <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center shadow-2xl shadow-purple-500/50 border-2 border-purple-400/40 animate-[bounce_3s_ease-in-out_infinite]">
                    <Bot className="h-10 w-10 text-white drop-shadow-lg animate-[wiggle_2s_ease-in-out_infinite]" />
                  </div>
                </div>
                <div>
                  <h1 className="text-5xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent drop-shadow-2xl animate-[shimmer_3s_ease-in-out_infinite]">Study AI v9.3</h1>
                  <p className="text-xl text-purple-200/80 font-medium">Your personal AI tutor</p>
                </div>
              </div>
            </div>

            {/* Chat Container - Museum Quality */}
            <Card className="relative border-2 border-purple-400/40 bg-gradient-to-br from-black/60 via-purple-950/30 to-black/60 backdrop-blur-2xl rounded-3xl shadow-[0_20px_80px_rgba(139,92,246,0.6)] overflow-hidden hover:scale-[1.01] transition-all duration-500 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-[100px] animate-pulse" style={{ animationDuration: "5s" }} />
              
              <CardHeader className="relative border-b-2 border-purple-400/30">
                <CardTitle className="flex items-center gap-3 text-2xl font-black text-white">
                  <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border border-purple-400/40 shadow-lg shadow-purple-500/30 animate-[bounce_2s_ease-in-out_infinite]">
                    <Sparkles className="h-5 w-5 text-purple-300 animate-[spin_4s_linear_infinite]" />
                  </div>
                  Chat Session
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                {/* Messages */}
                <div className="h-[500px] overflow-y-auto p-8 space-y-8">
                  {messages.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center animate-[fadeInUp_1s_ease-out]">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl opacity-70 rounded-full scale-150 animate-pulse" style={{ animationDuration: "4s" }} />
                        <div className="relative h-28 w-28 rounded-3xl bg-gradient-to-br from-purple-600/40 to-purple-800/40 backdrop-blur-xl flex items-center justify-center border-2 border-purple-400/40 shadow-2xl shadow-purple-500/50 animate-[bounce_3s_ease-in-out_infinite]">
                          <Bot className="h-14 w-14 text-purple-300 animate-[wiggle_2s_ease-in-out_infinite]" />
                        </div>
                      </div>
                      <h3 className="text-3xl font-black mb-4 bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent animate-[shimmer_3s_ease-in-out_infinite]">Start a conversation</h3>
                      <p className="text-lg text-purple-200/70 max-w-md font-medium leading-relaxed">
                        Ask me anything about your studies! I can help explain concepts, 
                        solve problems, and guide you through challenging topics.
                      </p>
                    </div>
                  )}

                  {messages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex gap-5 ${message.role === "user" ? "flex-row-reverse" : ""} animate-[fadeInUp_0.5s_ease-out]`}
                    >
                      <div className={`h-14 w-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-xl border-2 transition-all duration-300 hover:scale-110 hover:rotate-6 ${
                        message.role === "user" 
                          ? "bg-gradient-to-br from-blue-600 to-blue-700 border-blue-400/40 shadow-blue-500/50" 
                          : "bg-gradient-to-br from-purple-600 to-purple-700 border-purple-400/40 shadow-purple-500/50"
                      }`}>
                        {message.role === "user" ? (
                          <User className="h-7 w-7 text-white drop-shadow-lg" />
                        ) : (
                          <Bot className="h-7 w-7 text-white drop-shadow-lg" />
                        )}
                      </div>
                      <div className={`flex-1 ${message.role === "user" ? "text-right" : ""}`}>
                        <div className={`inline-block p-6 rounded-3xl backdrop-blur-xl border-2 shadow-xl transition-all duration-300 hover:scale-[1.02] ${
                          message.role === "user"
                            ? "bg-gradient-to-br from-blue-600/30 to-blue-700/20 border-blue-400/40 shadow-blue-500/30"
                            : "bg-gradient-to-br from-purple-600/20 to-purple-700/10 border-purple-400/30 shadow-purple-500/20"
                        }`}>
                          <p className="whitespace-pre-wrap text-base leading-relaxed text-white font-medium">
                            {message.content}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}

                  {isLoading && (
                    <div className="flex gap-5 animate-[fadeInUp_0.5s_ease-out]">
                      <div className="h-14 w-14 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-xl border-2 border-purple-400/40 shadow-purple-500/50 animate-[bounce_1s_ease-in-out_infinite]">
                        <Bot className="h-7 w-7 text-white drop-shadow-lg" />
                      </div>
                      <div className="flex-1">
                        <div className="inline-block p-6 rounded-3xl bg-gradient-to-br from-purple-600/20 to-purple-700/10 border-2 border-purple-400/30 backdrop-blur-xl shadow-xl shadow-purple-500/20">
                          <div className="flex items-center gap-3">
                            <Loader2 className="h-5 w-5 animate-spin text-purple-300" />
                            <span className="text-base text-purple-200/80 font-medium">Thinking...</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Input Form - Billionaire Style */}
                <form onSubmit={handleSubmit} className="p-8 border-t-2 border-purple-400/30 bg-gradient-to-b from-transparent to-purple-950/20 backdrop-blur-xl">
                  <div className="flex gap-4">
                    <Textarea
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Ask me anything about your studies..."
                      className="flex-1 min-h-[80px] max-h-[160px] bg-black/50 border-2 border-purple-400/30 focus:border-purple-400/60 resize-none rounded-2xl text-base backdrop-blur-xl font-medium transition-all duration-300 focus:scale-[1.01]"
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSubmit(e);
                        }
                      }}
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 h-[80px] w-[80px] rounded-2xl shadow-2xl shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-110 hover:-translate-y-1"
                    >
                      {isLoading ? (
                        <Loader2 className="h-7 w-7 animate-spin" />
                      ) : (
                        <Send className="h-7 w-7 group-hover:rotate-12 transition-transform duration-300" />
                      )}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl animate-[shimmerSweep_1.5s_ease-in-out_infinite]" />
                    </Button>
                  </div>
                  <p className="text-sm text-purple-300/70 mt-4 font-medium">
                    Press Enter to send, Shift + Enter for new line
                  </p>
                </form>
              </CardContent>
            </Card>

            {/* Tips - Premium Cards */}
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {[
                { emoji: "💡", text: "Ask specific questions for better explanations", delay: 0 },
                { emoji: "📚", text: "Request step-by-step solutions for complex problems", delay: 0.1 },
                { emoji: "🎯", text: "Ask for practice problems to test your understanding", delay: 0.2 }
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