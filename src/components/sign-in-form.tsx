"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { GraduationCap, Loader2 } from "lucide-react";
import Link from "next/link";
import { authClient, useSession } from "@/lib/auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export const SignInForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPending && session?.user) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: searchParams.get("redirect") || "/dashboard"
      });

      if (error?.code) {
        toast.error("Invalid email or password. Please make sure you have already registered an account and try again.");
        return;
      }

      toast.success("Welcome back!");
      router.push(searchParams.get("redirect") || "/dashboard");
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isPending || session?.user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative overflow-hidden flex items-center justify-center p-6">
      {/* Ultra Premium Animated Background */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-purple-600/20 via-purple-900/5 to-transparent animate-pulse" style={{ animationDuration: "8s" }} />
        
        {/* Animated Floating Orbs */}
        <div className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-gradient-to-br from-purple-500/30 via-purple-600/15 to-transparent rounded-full blur-[128px] animate-[float_20s_ease-in-out_infinite]" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-blue-500/25 via-indigo-500/15 to-transparent rounded-full blur-[100px] animate-[float_25s_ease-in-out_infinite_reverse]" />
        
        {/* Animated Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8b5cf615_1px,transparent_1px),linear-gradient(to_bottom,#8b5cf615_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] animate-[gridSlide_30s_linear_infinite]" />
        
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

      <Card className="relative w-full max-w-md border-2 border-purple-400/40 bg-gradient-to-br from-black/70 via-purple-950/40 to-black/70 backdrop-blur-2xl rounded-3xl shadow-[0_20px_80px_rgba(139,92,246,0.6)] z-10 overflow-hidden animate-[fadeInUp_0.8s_ease-out]">
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-purple-500/30 to-transparent rounded-full blur-3xl animate-pulse" style={{ animationDuration: "5s" }} />
        
        <CardHeader className="relative text-center space-y-4 pt-10">
          <div className="flex items-center justify-center gap-3 mb-4 animate-[fadeInUp_0.8s_ease-out_0.2s_both]">
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500 to-purple-700 blur-2xl opacity-70 rounded-full scale-150 animate-pulse" style={{ animationDuration: "3s" }} />
              <div className="relative h-16 w-16 rounded-2xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 p-0.5 shadow-2xl shadow-purple-500/50 animate-[bounce_3s_ease-in-out_infinite]">
                <div className="h-full w-full rounded-2xl bg-black/80 backdrop-blur-xl flex items-center justify-center">
                  <GraduationCap className="text-purple-400 h-9 w-9 animate-[wiggle_2s_ease-in-out_infinite]" />
                </div>
              </div>
            </div>
            <span className="text-3xl font-black bg-gradient-to-r from-purple-300 via-purple-400 to-purple-600 bg-clip-text text-transparent drop-shadow-lg animate-[shimmer_3s_ease-in-out_infinite]">
              Study Boi
            </span>
          </div>
          <CardTitle className="text-4xl font-black bg-gradient-to-b from-white to-purple-200 bg-clip-text text-transparent drop-shadow-xl animate-[fadeInUp_0.8s_ease-out_0.3s_both]">Sign In</CardTitle>
          <p className="text-lg text-purple-200/80 font-medium animate-[fadeInUp_0.8s_ease-out_0.4s_both]">Welcome back! Let's continue learning.</p>
        </CardHeader>
        <CardContent className="relative pt-6 pb-10">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email" className="text-purple-200/90 font-semibold text-base">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
                className="h-12 bg-black/40 border-2 border-purple-400/30 focus:border-purple-400/60 rounded-xl text-base backdrop-blur-xl transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="space-y-3">
              <Label htmlFor="password" className="text-purple-200/90 font-semibold text-base">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                autoComplete="off"
                className="h-12 bg-black/40 border-2 border-purple-400/30 focus:border-purple-400/60 rounded-xl text-base backdrop-blur-xl transition-all duration-300 focus:scale-[1.02]"
              />
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remember"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                disabled={isLoading}
                className="border-2 border-purple-400/40"
              />
              <Label htmlFor="remember" className="text-base font-medium cursor-pointer text-purple-200/90">
                Remember me
              </Label>
            </div>
            <Button
              type="submit"
              className="relative group w-full h-14 bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 hover:from-purple-700 hover:via-purple-600 hover:to-purple-800 text-lg font-bold shadow-xl shadow-purple-500/50 border-2 border-purple-400/30 transition-all duration-300 hover:scale-105 rounded-xl hover:-translate-y-1"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-400/0 via-white/20 to-purple-400/0 opacity-0 group-hover:opacity-100 transition-opacity blur-xl animate-[shimmerSweep_1.5s_ease-in-out_infinite]" />
            </Button>
          </form>

          <div className="mt-8 text-center text-base">
            <p className="text-purple-200/70 font-medium">
              Don't have an account?{" "}
              <Link href="/sign-up" className="text-purple-300 hover:text-purple-200 underline underline-offset-4 font-bold transition-all duration-300 hover:scale-105 inline-block">
                Sign up
              </Link>
            </p>
          </div>

          <div className="mt-6 p-5 bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-400/30 rounded-2xl text-base text-center backdrop-blur-xl animate-pulse" style={{ animationDuration: "3s" }}>
            <p className="text-purple-200/90 font-medium">
              New user? Please create an account first before signing in.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};