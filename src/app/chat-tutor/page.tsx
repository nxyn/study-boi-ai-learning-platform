"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Bot, User, Menu, Plus, MessageSquare, Settings, LogOut, GraduationCap, ChevronLeft, Trash2, Edit2 } from "lucide-react";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  timestamp: number;
  messages: Message[];
}

export default function ChatTutorPage() {
  const { data: session, isPending, refetch } = useSession();
  const router = useRouter();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=" + encodeURIComponent("/chat-tutor"));
    }
  }, [session, isPending, router]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Load chat sessions from localStorage
  useEffect(() => {
    if (session?.user) {
      const saved = localStorage.getItem(`chat_sessions_${session.user.id}`);
      if (saved) {
        const sessions = JSON.parse(saved);
        setChatSessions(sessions);
      }
    }
  }, [session]);

  // Save chat sessions to localStorage
  const saveSessions = (sessions: ChatSession[]) => {
    if (session?.user) {
      localStorage.setItem(`chat_sessions_${session.user.id}`, JSON.stringify(sessions));
      setChatSessions(sessions);
    }
  };

  if (isPending || !session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const handleNewChat = () => {
    setMessages([]);
    setCurrentSessionId(null);
  };

  const handleLoadSession = (sessionId: string) => {
    const session = chatSessions.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(sessionId);
    }
  };

  const handleDeleteSession = (sessionId: string) => {
    const updated = chatSessions.filter(s => s.id !== sessionId);
    saveSessions(updated);
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
  };

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: "user",
      content: input.trim()
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
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

      const updatedMessages = [...newMessages, assistantMessage];
      setMessages(updatedMessages);

      // Save or update session
      if (currentSessionId) {
        const updated = chatSessions.map(s => 
          s.id === currentSessionId 
            ? { ...s, messages: updatedMessages, timestamp: Date.now() }
            : s
        );
        saveSessions(updated);
      } else {
        const newSession: ChatSession = {
          id: Date.now().toString(),
          title: userMessage.content.slice(0, 50),
          timestamp: Date.now(),
          messages: updatedMessages
        };
        saveSessions([newSession, ...chatSessions]);
        setCurrentSessionId(newSession.id);
      }
    } catch (error) {
      console.error("Chat error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to send message. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-72" : "w-0"} transition-all duration-300 border-r border-purple-400/20 bg-gradient-to-b from-black/60 to-purple-950/20 backdrop-blur-xl flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-purple-400/20">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                <GraduationCap className="h-5 w-5 text-white" />
              </div>
              <span className="font-bold text-white">Study Boi</span>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="h-8 w-8 text-purple-300 hover:text-white hover:bg-purple-600/20"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </div>
          <Button
            onClick={handleNewChat}
            className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Chat
          </Button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          <div className="text-xs font-semibold text-purple-300/70 mb-2 px-2">RECENT CHATS</div>
          {chatSessions.map((chatSession) => (
            <div
              key={chatSession.id}
              className={`group relative flex items-start gap-2 p-3 rounded-lg cursor-pointer transition-all ${
                currentSessionId === chatSession.id
                  ? "bg-purple-600/30 border border-purple-400/40"
                  : "hover:bg-purple-600/10 border border-transparent"
              }`}
              onClick={() => handleLoadSession(chatSession.id)}
            >
              <MessageSquare className="h-4 w-4 text-purple-300 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{chatSession.title}</p>
                <p className="text-xs text-purple-300/60">
                  {new Date(chatSession.timestamp).toLocaleDateString()}
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity text-purple-300 hover:text-red-400 hover:bg-red-500/10"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDeleteSession(chatSession.id);
                }}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
          {chatSessions.length === 0 && (
            <div className="text-sm text-purple-300/50 text-center py-8">
              No chat history yet
            </div>
          )}
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-purple-400/20 space-y-2">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-600/10 border border-purple-400/20">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center text-white font-bold text-sm">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{session.user.name}</p>
              <p className="text-xs text-purple-300/60 truncate">{session.user.email}</p>
            </div>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start text-purple-300 hover:text-white hover:bg-purple-600/20"
            onClick={handleSignOut}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col relative">
        {/* Animated Background */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-purple-900/5 to-transparent" />
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-gradient-to-br from-purple-500/20 via-purple-600/10 to-transparent rounded-full blur-[100px] animate-[float_20s_ease-in-out_infinite]" />
        </div>

        {/* Header */}
        <div className="relative border-b border-purple-400/20 bg-black/20 backdrop-blur-xl">
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center gap-3">
              {!sidebarOpen && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="text-purple-300 hover:text-white hover:bg-purple-600/20"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center">
                  <Bot className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">Study AI v9.3</h1>
                  <p className="text-xs text-purple-300/70">Your personal AI tutor</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 relative">
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-3xl opacity-50 rounded-full" />
                  <div className="relative h-20 w-20 rounded-2xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center shadow-2xl">
                    <Bot className="h-10 w-10 text-white" />
                  </div>
                </div>
                <h2 className="text-2xl font-bold mb-3 text-white">How can I help you today?</h2>
                <p className="text-purple-300/70 max-w-md">
                  Ask me anything about your studies. I can explain concepts, solve problems, and guide you through challenging topics.
                </p>
              </div>
            )}

            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-4 ${message.role === "user" ? "flex-row-reverse" : ""}`}
              >
                <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                  message.role === "user" 
                    ? "bg-gradient-to-br from-blue-600 to-blue-700" 
                    : "bg-gradient-to-br from-purple-600 to-purple-700"
                }`}>
                  {message.role === "user" ? (
                    <User className="h-5 w-5 text-white" />
                  ) : (
                    <Bot className="h-5 w-5 text-white" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-medium mb-2 ${message.role === "user" ? "text-right text-blue-300" : "text-purple-300"}`}>
                    {message.role === "user" ? "You" : "Study AI"}
                  </div>
                  <div className={`prose prose-invert max-w-none ${message.role === "user" ? "text-right" : ""}`}>
                    <p className="text-white/90 whitespace-pre-wrap leading-relaxed">
                      {message.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex gap-4">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium mb-2 text-purple-300">Study AI</div>
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
                    <span className="text-sm text-purple-300/70">Thinking...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Form */}
        <div className="relative border-t border-purple-400/20 bg-black/20 backdrop-blur-xl p-4">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative flex items-end gap-3">
              <Textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Message Study AI..."
                className="flex-1 min-h-[56px] max-h-[200px] bg-purple-950/30 border-2 border-purple-400/30 focus:border-purple-400/60 resize-none rounded-xl backdrop-blur-xl pr-12"
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
                size="icon"
                className="absolute bottom-2 right-2 h-10 w-10 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800"
              >
                {isLoading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Send className="h-5 w-5" />
                )}
              </Button>
            </div>
            <p className="text-xs text-purple-300/50 mt-2 text-center">
              Study AI can make mistakes. Check important info.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}