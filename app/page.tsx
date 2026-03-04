"use client";

import { useMemo, useState } from "react";
import { Toaster, toast } from "sonner";
import { GenerateButton } from "@/components/GenerateButton";
import { PlatformCard } from "@/components/PlatformCard";
import type { GenerateResponse, PlatformConfig, PlatformKey, Post } from "@/types";

const PLATFORM_CONFIGS: PlatformConfig[] = [
  {
    key: "reddit",
    name: "Reddit",
    color: "#FF4500",
    bgColor: "#FF4500",
    icon: "👾"
  },
  {
    key: "twitter",
    name: "Twitter / X",
    color: "#000000",
    bgColor: "#0F172A",
    icon: "🐦",
    charLimit: 280
  },
  {
    key: "facebook",
    name: "Facebook Groups",
    color: "#1877F2",
    bgColor: "#1E3A8A",
    icon: "📘"
  },
  {
    key: "linkedin",
    name: "LinkedIn",
    color: "#0A66C2",
    bgColor: "#1D4ED8",
    icon: "💼"
  },
  {
    key: "instagram",
    name: "Instagram",
    color: "#E1306C",
    bgColor: "linear-gradient(135deg,#F58529,#DD2A7B,#8134AF,#515BD4)",
    icon: "📸"
  },
  {
    key: "tiktok",
    name: "TikTok",
    color: "#25F4EE",
    bgColor: "#020617",
    icon: "🎵"
  }
];

type PlatformState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
};

const INITIAL_STATE: Record<PlatformKey, PlatformState> = {
  reddit: { posts: [], loading: false, error: null },
  twitter: { posts: [], loading: false, error: null },
  facebook: { posts: [], loading: false, error: null },
  linkedin: { posts: [], loading: false, error: null },
  instagram: { posts: [], loading: false, error: null },
  tiktok: { posts: [], loading: false, error: null }
};

export default function HomePage() {
  const [state, setState] = useState<Record<PlatformKey, PlatformState>>(INITIAL_STATE);
  const [isGeneratingAll, setIsGeneratingAll] = useState(false);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);

  const anyLoading = useMemo(
    () => isGeneratingAll || Object.values(state).some((s) => s.loading),
    [isGeneratingAll, state]
  );

  const updatePlatform = (key: PlatformKey, patch: Partial<PlatformState>) => {
    setState((prev) => ({
      ...prev,
      [key]: { ...prev[key], ...patch }
    }));
  };

  const handleGenerateAll = async () => {
    setIsGeneratingAll(true);
    setGeneratedAt(null);
    setState((prev) => {
      const next: typeof prev = { ...prev };
      (Object.keys(next) as PlatformKey[]).forEach((key) => {
        next[key] = { ...next[key], loading: true, error: null };
      });
      return next;
    });

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms: PLATFORM_CONFIGS.map((p) => p.key) })
      });

      if (!res.ok) {
        throw new Error("Failed to generate posts");
      }

      const data: GenerateResponse = await res.json();

      setState((prev) => {
        const next: typeof prev = { ...prev };
        (Object.keys(next) as PlatformKey[]).forEach((key) => {
          const posts = (data[key] ?? []) as Post[];
          next[key] = {
            posts,
            loading: false,
            error: posts.length === 0 ? "No posts generated" : null
          };
        });
        return next;
      });

      const now = new Date();
      setGeneratedAt(
        now.toLocaleTimeString(undefined, {
          hour: "2-digit",
          minute: "2-digit"
        })
      );
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate posts. Please try again.");
      setState((prev) => {
        const next: typeof prev = { ...prev };
        (Object.keys(next) as PlatformKey[]).forEach((key) => {
          next[key] = { ...next[key], loading: false, error: "Failed to generate — click Regenerate." };
        });
        return next;
      });
    } finally {
      setIsGeneratingAll(false);
    }
  };

  const handleRegenerate = async (platform: PlatformKey) => {
    updatePlatform(platform, { loading: true, error: null });
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ platforms: [platform] })
      });

      if (!res.ok) {
        throw new Error("Failed to regenerate posts");
      }

      const data: GenerateResponse = await res.json();
      const posts = (data[platform] ?? []) as Post[];
      updatePlatform(platform, {
        posts,
        loading: false,
        error: posts.length === 0 ? "Failed to generate — click Regenerate." : null
      });

      if (posts.length) {
        const now = new Date();
        setGeneratedAt(
          now.toLocaleTimeString(undefined, {
            hour: "2-digit",
            minute: "2-digit"
          })
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(`Failed to regenerate ${platform} posts.`);
      updatePlatform(platform, {
        loading: false,
        error: "Failed to generate — click Regenerate."
      });
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-950 to-slate-900 text-foreground">
      <Toaster richColors position="top-right" />
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-8 md:py-12">
        <header className="flex flex-col items-center gap-3 text-center md:gap-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-slate-900/70 px-4 py-1 text-xs font-medium text-slate-300 ring-1 ring-slate-700/70">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            ResumeRoast Daily · wouldIhireyou.com
          </div>
          <h1 className="bg-gradient-to-r from-sky-400 via-violet-400 to-pink-400 bg-clip-text text-3xl font-bold tracking-tight text-transparent md:text-4xl">
            Generate your daily social posts
          </h1>
          <p className="max-w-2xl text-sm text-slate-300 md:text-base">
            One click, six platforms. Authentic, high-signal posts about resumes, hiring, and job hunting —
            with a soft plug for Resume Roast at the end of each.
          </p>

          <div className="mt-2">
            <GenerateButton onClick={handleGenerateAll} isLoading={anyLoading && isGeneratingAll} />
          </div>

          {generatedAt && (
            <p className="mt-1 text-xs text-slate-400">
              Generated at <span className="font-mono">{generatedAt}</span>
            </p>
          )}
        </header>

        <section className="grid gap-4 md:grid-cols-2">
          {PLATFORM_CONFIGS.map((platform) => (
            <PlatformCard
              key={platform.key}
              platform={platform}
              posts={state[platform.key].posts}
              isLoading={state[platform.key].loading}
              error={state[platform.key].error}
              generatedAt={generatedAt}
              onRegenerate={() => handleRegenerate(platform.key)}
            />
          ))}
        </section>
      </div>
    </main>
  );
}

