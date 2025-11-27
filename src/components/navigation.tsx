"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, MessageSquare, FileQuestion, Users, User, LogOut, Menu, X, Sparkles } from "lucide-react";
import { useSession, authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useState } from "react";

/**
 * The main navigation component for the application.
 * It displays a list of links to different pages and handles user authentication.
 */
export const Navigation = () => {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const [isNavVisible, setIsNavVisible] = useState(true);

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
    { href: "/quizzes/ai-generator", label: "AI Generator", icon: Sparkles },
    { href: "/study-space", label: "Study Space", icon: Users },
    { href: "/profile", label: "Profile", icon: User },
  ];

  return (
    <>
      {/* Toggle Button - Ultra Premium Fixed Position */}
      <button
        onClick={() => setIsNavVisible(!isNavVisible)}
        className="fixed top-3 right-3 sm:top-4 sm:right-4 z-[60] p-2.5 sm:p-3 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 border-2 border-purple-400/50 shadow-2xl shadow-purple-500/60 transition-all duration-300 hover:scale-110 hover:shadow-purple-500/80 backdrop-blur-xl"
        aria-label={isNavVisible ? "Hide navigation" : "Show navigation"}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 hover:opacity-100 transition-opacity blur-xl rounded-xl sm:rounded-2xl" />
        {isNavVisible ? (
          <X className="relative h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" />
        ) : (
          <Menu className="relative h-5 w-5 sm:h-6 sm:w-6 text-white drop-shadow-lg" />
        )}
      </button>

      {/* Navigation Bar - Ultra Premium Design */}
      <nav 
        className={`relative border-b-2 border-purple-400/30 bg-gradient-to-b from-black/95 via-purple-950/30 to-black/90 backdrop-blur-2xl supports-[backdrop-filter]:bg-background/80 sticky top-0 z-50 transition-all duration-500 ease-in-out shadow-2xl shadow-purple-500/20 ${
          isNavVisible 
            ? "translate-y-0 opacity-100" 
            : "-translate-y-full opacity-0 pointer-events-none"
        }`}
      >
        {/* Premium Background Glow Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/10 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-purple-500/20 to-transparent rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative max-w-7xl mx-auto px-3 sm:px-4 md:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* Logo - Premium with Glow */}
            <Link href="/" className="flex items-center gap-2 sm:gap-3 group">
              <div className="relative">
                {/* Animated Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-600 blur-xl opacity-60 group-hover:opacity-100 group-hover:blur-2xl transition-all duration-500 rounded-full scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
                
                {/* Icon Container */}
                <div className="relative h-8 w-8 sm:h-10 sm:w-10 rounded-xl sm:rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-0.5 shadow-2xl shadow-purple-500/50 group-hover:scale-110 transition-transform duration-300">
                  <div className="h-full w-full rounded-xl sm:rounded-2xl bg-black/90 backdrop-blur-xl flex items-center justify-center">
                    <GraduationCap className="text-purple-400 h-5 w-5 sm:h-6 sm:w-6 group-hover:rotate-12 transition-transform duration-500" />
                  </div>
                </div>
              </div>
              <span className="text-lg sm:text-xl md:text-2xl font-black bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent group-hover:from-purple-200 group-hover:via-purple-300 group-hover:to-purple-500 transition-all duration-300 drop-shadow-lg">
                Study Boi
              </span>
            </Link>

            {session?.user ? (
              // Authenticated Navigation - Mobile & Desktop Optimized
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4 lg:gap-6">
                {navLinks.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`group relative flex items-center gap-1.5 sm:gap-2 px-2 sm:px-3 py-1.5 sm:py-2 rounded-lg sm:rounded-xl transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-purple-600/30 to-purple-800/30 border-2 border-purple-400/50 text-purple-200 font-bold shadow-lg shadow-purple-500/40 scale-105"
                          : "border-2 border-transparent hover:border-purple-400/30 hover:bg-purple-500/10 text-purple-300/70 hover:text-purple-200 hover:scale-105 hover:shadow-lg hover:shadow-purple-500/20"
                      }`}
                    >
                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/20 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg sm:rounded-xl blur-sm" />
                      
                      <Icon className={`relative h-4 w-4 sm:h-5 sm:w-5 ${isActive ? "animate-pulse" : ""}`} style={isActive ? { animationDuration: "2s" } : {}} />
                      <span className="relative hidden md:inline text-xs sm:text-sm font-semibold">{link.label}</span>
                    </Link>
                  );
                })}
                
                {/* Sign Out Button - Premium */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSignOut}
                  className="relative group border-2 border-purple-400/40 bg-black/40 hover:bg-purple-900/40 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 backdrop-blur-xl text-xs sm:text-sm px-2 sm:px-3 py-1.5 sm:py-2"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-sm" />
                  <LogOut className="relative h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span className="relative hidden sm:inline">Sign Out</span>
                </Button>
              </div>
            ) : (
              // Guest Navigation - Mobile & Desktop Optimized
              <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
                <Button 
                  asChild 
                  variant="outline" 
                  size="sm"
                  className="relative group border-2 border-purple-400/40 bg-black/40 hover:bg-purple-900/40 hover:border-purple-400/60 transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-purple-500/30 backdrop-blur-xl text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2"
                >
                  <Link href="/sign-in">
                    <span className="relative">Sign In</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/0 via-purple-400/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg blur-sm" />
                  </Link>
                </Button>
                <Button 
                  asChild
                  size="sm"
                  className="relative group bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 shadow-xl shadow-purple-500/40 hover:shadow-2xl hover:shadow-purple-500/60 border-2 border-purple-400/30 transition-all duration-300 hover:scale-105 backdrop-blur-xl text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 font-bold"
                >
                  <Link href="/sign-up">
                    <span className="relative z-10">Get Started</span>
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-lg rounded-lg" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </nav>
    </>
  );
};