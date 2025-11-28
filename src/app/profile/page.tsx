"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { Navigation } from "@/components/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Loader2, UserCog } from "lucide-react";
import { toast } from "sonner";

interface Profile {
  id: number;
  userId: string;
  grade: number;
  bio: string | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * The profile page for the authenticated user.
 * It allows the user to view and update their profile information.
 */
export default function ProfilePage() {
  const { data: session, isPending } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [grade, setGrade] = useState<number | "">("");
  const [bio, setBio] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const hasProfile = useMemo(() => !!profile?.id, [profile]);

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push("/sign-in?redirect=" + encodeURIComponent("/profile"));
    }
  }, [session, isPending, router]);

  useEffect(() => {
    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  const fetchProfile = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const res = await fetch("/api/user/profile", {
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (res.status === 404) {
        // No profile yet
        setProfile(null);
        setGrade("");
        setBio("");
        return;
      }

      if (!res.ok) throw new Error("Failed to load profile");

      const data = (await res.json()) as Profile;
      setProfile(data);
      setGrade(data.grade);
      setBio(data.bio || "");
    } catch (e) {
      console.error(e);
      toast.error("Failed to load profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (grade === "" || typeof grade !== "number") {
      toast.error("Please select a grade (6-12)");
      return;
    }

    setIsSaving(true);
    try {
      const token = localStorage.getItem("bearer_token");
      const method = hasProfile ? "PUT" : "POST";
      const res = await fetch("/api/user/profile", {
        method,
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify({ grade, bio: bio.trim() || null }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to save profile");
      }

      const saved = (await res.json()) as Profile;
      setProfile(saved);
      toast.success("Profile saved");
    } catch (e: any) {
      toast.error(e.message || "Failed to save");
    } finally {
      setIsSaving(false);
    }
  };

  if (isPending || !session?.user || isLoading) {
    return (
      <>
        <Navigation />
        <div className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </>
    );
  }

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-background relative overflow-hidden">
        {/* Background accents */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-purple-600/20 via-purple-900/5 to-transparent animate-pulse" style={{ animationDuration: "8s" }} />
          <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-purple-500/25 via-purple-600/15 to-transparent rounded-full blur-[110px] animate-[float_20s_ease-in-out_infinite]" />
          <div className="absolute bottom-1/4 left-1/4 w-[500px] h-[500px] bg-gradient-to-br from-blue-500/20 via-indigo-500/10 to-transparent rounded-full blur-[90px] animate-[float_25s_ease-in-out_infinite_reverse]" />
        </div>

        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
          <div className="mb-8 flex items-center gap-4">
            <div className="relative h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 via-purple-500 to-purple-700 flex items-center justify-center border-2 border-purple-400/40 shadow-2xl shadow-purple-500/40">
              <UserCog className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-purple-200 to-purple-400 bg-clip-text text-transparent">Your Profile</h1>
              <p className="text-purple-200/80">Set your grade (6-12) to tailor AI quizzes (NCERT)</p>
            </div>
          </div>

          <Card className="relative border-2 border-purple-400/30 bg-gradient-to-br from-white/[0.08] via-purple-500/[0.05] to-transparent backdrop-blur-2xl rounded-2xl shadow-2xl">
            <CardHeader>
              <CardTitle className="text-white">Profile Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <Label className="text-purple-200">Grade *</Label>
                  <Select value={grade === "" ? "" : String(grade)} onValueChange={(v) => setGrade(parseInt(v) as number)}>
                    <SelectTrigger className="bg-black/40 border-purple-400/40 text-white mt-2">
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent className="bg-black/90 border-purple-400/40">
                      {Array.from({ length: 7 }).map((_, idx) => {
                        const g = 6 + idx;
                        return (
                          <SelectItem key={g} value={String(g)}>
                            Grade {g}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-purple-200">Name</Label>
                  <div className="mt-2 px-3 py-3 rounded-xl bg-black/40 border-2 border-purple-400/30 text-purple-200/90">
                    {session.user.name || "Anonymous"}
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-purple-200">Bio (Optional)</Label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about your interests or target exams"
                  className="mt-2 bg-black/40 border-purple-400/40 text-white min-h-[120px]"
                />
              </div>

              <div className="flex justify-end">
                <Button onClick={handleSave} disabled={isSaving} className="bg-gradient-to-r from-purple-600 via-purple-500 to-purple-700 border-2 border-purple-400/30">
                  {isSaving ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Saving
                    </>
                  ) : (
                    "Save"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
