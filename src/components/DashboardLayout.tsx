"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  GraduationCap,
  Home,
  MessageSquare,
  FileQuestion,
  Users,
  Menu,
  LogOut,
  User,
  Sparkles,
} from "lucide-react";
import { authClient, useSession } from "@/lib/auth-client";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: Home },
  { name: "AI Tutor", href: "/chat-tutor", icon: MessageSquare },
  { name: "Quizzes", href: "/quizzes", icon: FileQuestion },
  { name: "Study Space", href: "/study-space", icon: Users },
];

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, refetch } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleSignOut = async () => {
    const token = localStorage.getItem("bearer_token");
    await authClient.signOut({
      fetchOptions: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });
    localStorage.removeItem("bearer_token");
    refetch();
    router.push("/sign-in");
  };

  const userInitials = session?.user?.name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase() || "U";

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar for desktop */}
      <aside className="fixed inset-y-0 left-0 z-50 w-64 border border-white/20 dark:border-black/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-r-2xl shadow-[0_8px_32px_rgba(139,92,246,0.1)] hidden lg:block overflow-hidden">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center gap-2 h-16 px-6 border-b border-white/20 dark:border-black/20 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
            <GraduationCap className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Study-Boi
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all backdrop-blur-sm border border-white/10 dark:border-black/10 ${
                    isActive
                      ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-primary backdrop-blur-md shadow-lg shadow-purple-500/10"
                      : "text-muted-foreground hover:bg-white/5 dark:hover:bg-black/5 hover:shadow-md hover:shadow-purple-500/5"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* User menu */}
          <div className="p-4 border-t border-white/20 dark:border-black/20 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="w-full justify-start gap-3 px-4 rounded-xl backdrop-blur-sm border border-white/10 dark:border-black/10 bg-white/10 dark:bg-black/10 hover:bg-white/20 dark:hover:bg-black/20 transition-all">
                  <Avatar className="h-8 w-8 border-2 border-primary/50">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 text-white backdrop-blur-sm">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start overflow-hidden">
                    <span className="text-sm font-medium truncate w-full">
                      {session?.user?.name || "User"}
                    </span>
                    <span className="text-xs text-muted-foreground truncate w-full">
                      {session?.user?.email}
                    </span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-black/20 rounded-xl">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile" className="cursor-pointer hover:bg-white/5 dark:hover:bg-black/5 rounded-lg">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:bg-white/5 dark:hover:bg-black/5 rounded-lg">
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </aside>

      {/* Mobile header */}
      <header className="fixed top-0 left-0 right-0 z-40 h-16 border-b border-white/20 dark:border-black/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl lg:hidden">
        <div className="flex items-center justify-between h-full px-4">
          <div className="flex items-center gap-2">
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-full border border-white/10 dark:border-black/10">
                  <Menu className="h-6 w-6 text-muted-foreground" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-64 p-0 border-r border-white/20 dark:border-black/20 bg-white/10 dark:bg-black/20 backdrop-blur-xl rounded-r-2xl shadow-[0_8px_32px_rgba(139,92,246,0.1)]">
                <div className="flex flex-col h-full">
                  <div className="flex items-center gap-2 h-16 px-6 border-b border-white/20 dark:border-black/20 bg-white/5 dark:bg-black/5 backdrop-blur-sm">
                    <GraduationCap className="h-8 w-8 text-primary" />
                    <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
                      Study-Boi
                    </span>
                  </div>
                  <nav className="flex-1 px-4 py-6 space-y-2">
                    {navigation.map((item) => {
                      const isActive = pathname === item.href;
                      return (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all backdrop-blur-sm border border-white/10 dark:border-black/10 ${
                            isActive
                              ? "bg-gradient-to-r from-purple-500/20 to-purple-600/20 text-primary backdrop-blur-md shadow-lg shadow-purple-500/10"
                              : "text-muted-foreground hover:bg-white/5 dark:hover:bg-black/5 hover:shadow-md hover:shadow-purple-500/5"
                          }`}
                        >
                          <item.icon className="h-5 w-5" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Study-Boi
            </span>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="bg-white/5 dark:bg-black/5 backdrop-blur-sm rounded-full border border-white/10 dark:border-black/10">
                <Avatar className="h-8 w-8 border-2 border-primary/50">
                  <AvatarFallback className="bg-gradient-to-br from-purple-500/20 to-purple-700/20 text-white backdrop-blur-sm">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 bg-white/10 dark:bg-black/20 backdrop-blur-xl border border-white/20 dark:border-black/20 rounded-xl">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/profile" className="cursor-pointer hover:bg-white/5 dark:hover:bg-black/5 rounded-lg">
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-red-500 hover:bg-white/5 dark:hover:bg-black/5 rounded-lg">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Main content */}
      <main className="lg:pl-64 pt-16 lg:pt-0">
        <div className="min-h-screen">{children}</div>
      </main>
    </div>
  );
}