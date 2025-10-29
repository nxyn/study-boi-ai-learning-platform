"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, MessageSquare, FileQuestion, Users, User, LogOut, Sparkles } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";

export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, refetch } = useSession();

  const handleSignOut = async () => {
    const { error } = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
      localStorage.removeItem("bearer_token");
      refetch();
      router.push("/");
      toast.success("Signed out successfully");
    }
  };

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: Home },
    { href: "/chat-tutor", label: "AI Tutor", icon: MessageSquare },
    { href: "/quizzes", label: "Quizzes", icon: FileQuestion },
    { href: "/study-space", label: "Study Space", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <nav className="relative border-b-2 border-purple-400/30 bg-black/80 backdrop-blur-2xl supports-[backdrop-filter]:bg-black/60 sticky top-0 z-50 shadow-[0_8px_32px_rgba(139,92,246,0.3)]">
      {/* Premium Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 via-transparent to-purple-600/10 pointer-events-none" />
      
      <div className="relative max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 blur-xl opacity-60 rounded-full scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="relative h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-0.5 shadow-lg shadow-purple-500/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                <div className="h-full w-full rounded-xl bg-black/90 backdrop-blur-xl flex items-center justify-center">
                  <GraduationCap className="text-purple-400 h-6 w-6" />
                </div>
              </div>
            </div>
            <span className="text-2xl font-black bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg transition-all duration-300 group-hover:scale-105">
              Study Boi
            </span>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-2">
              {/* Navigation Links */}
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`relative flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-purple-600/30 to-purple-500/30 text-purple-200 shadow-lg shadow-purple-500/30 border-2 border-purple-400/40"
                        : "text-purple-300/70 hover:text-purple-200 hover:bg-purple-500/10 border-2 border-transparent hover:border-purple-400/20"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 via-purple-400/20 to-purple-600/20 rounded-xl animate-pulse" />
                    )}
                    <Icon className={`h-5 w-5 relative z-10 transition-transform duration-300 ${isActive ? 'animate-pulse' : 'group-hover:scale-110'}`} />
                    <span className="hidden lg:inline relative z-10">{link.label}</span>
                  </Link>
                );
              })}
              
              {/* Sign Out Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="relative ml-2 border-2 border-purple-400/30 bg-black/40 backdrop-blur-xl hover:bg-purple-950/60 hover:border-purple-400/60 text-purple-300 hover:text-purple-200 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/30 font-semibold"
              >
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button 
                asChild 
                variant="outline" 
                className="relative border-2 border-purple-400/40 bg-black/40 backdrop-blur-xl hover:bg-purple-950/60 hover:border-purple-400/60 text-purple-300 hover:text-purple-200 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-purple-500/30 font-bold"
              >
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button 
                asChild 
                className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 shadow-lg shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-105 hover:shadow-purple-500/70 font-bold overflow-hidden"
              >
                <Link href="/sign-up">
                  <span className="relative z-10 flex items-center gap-2">
                    Get Started
                    <Sparkles className="h-4 w-4 animate-pulse" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-lg" />
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};