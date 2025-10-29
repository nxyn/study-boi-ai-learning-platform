"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GraduationCap, Home, MessageSquare, FileQuestion, Users, User, LogOut } from "lucide-react";
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
    <nav className="border-b border-purple-500/20 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <GraduationCap className="text-primary h-8 w-8" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Study Boi
            </span>
          </Link>

          {session?.user ? (
            <div className="flex items-center gap-6">
              {navLinks.map((link) => {
                const Icon = link.icon;
                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      isActive
                        ? "bg-purple-500/20 text-primary font-semibold"
                        : "hover:bg-purple-500/10 text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden md:inline">{link.label}</span>
                  </Link>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="border-purple-500/20"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Button asChild variant="outline" className="border-purple-500/20">
                <Link href="/sign-in">Sign In</Link>
              </Button>
              <Button asChild className="bg-gradient-to-r from-purple-600 to-purple-700">
                <Link href="/sign-up">Get Started</Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};