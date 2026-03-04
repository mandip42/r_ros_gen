 "use client";

import { useState } from "react";
import { RefreshCcw, ChevronDown, ChevronRight, Copy } from "lucide-react";
import type { PlatformConfig, Post } from "@/types";
import { PostCard } from "@/components/PostCard";
import { toast } from "sonner";

interface PlatformCardProps {
  platform: PlatformConfig;
  posts: Post[];
  onRegenerate: () => Promise<void> | void;
  isLoading: boolean;
  generatedAt?: string | null;
  error?: string | null;
}

async function copyAll(posts: Post[]) {
  const text = posts
    .map((p, i) => `Post ${i + 1}\n\n${p.content}`)
    .join("\n\n---\n\n");

  if (!text.trim()) return false;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const textarea = document.createElement("textarea");
      textarea.value = text;
      textarea.style.position = "fixed";
      textarea.style.left = "-9999px";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    return true;
  } catch {
    return false;
  }
}

export function PlatformCard({
  platform,
  posts,
  onRegenerate,
  isLoading,
  generatedAt,
  error
}: PlatformCardProps) {
  const [open, setOpen] = useState(true);

  const handleCopyAll = async () => {
    const ok = await copyAll(posts);
    if (ok) {
      toast.success(`Copied all ${platform.name} posts`);
    } else {
      toast.error("Failed to copy posts");
    }
  };

  const hasPosts = posts && posts.length > 0;

  return (
    <section
      className="rounded-xl border bg-card/70 p-4 shadow-lg shadow-black/40"
      style={{ borderColor: platform.color }}
    >
      <header className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-2 rounded-md bg-black/40 px-2 py-1 text-sm font-medium text-foreground/90 ring-1 ring-slate-700/70 hover:bg-black/60"
        >
          {open ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
          <span
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-lg"
            style={{ background: platform.bgColor }}
          >
            {platform.icon}
          </span>
          <span>{platform.name}</span>
        </button>

        <div className="ml-auto flex flex-wrap items-center gap-2 text-xs">
          {generatedAt && (
            <span className="rounded-full bg-black/40 px-2 py-1 text-[11px] text-muted-foreground">
              Generated at {generatedAt}
            </span>
          )}

          <button
            type="button"
            disabled={!hasPosts || isLoading}
            onClick={handleCopyAll}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100/5 px-3 py-1.5 text-[11px] font-medium text-foreground/90 ring-1 ring-slate-600/60 transition hover:bg-slate-100/10 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Copy className="h-3.5 w-3.5" />
            Copy all 3
          </button>

          <button
            type="button"
            disabled={isLoading}
            onClick={() => void onRegenerate()}
            className="inline-flex items-center gap-1 rounded-md bg-slate-100/10 px-3 py-1.5 text-[11px] font-medium text-foreground/90 ring-1 ring-slate-500/70 transition hover:bg-slate-100/20 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <RefreshCcw className="h-3.5 w-3.5" />
            {isLoading ? "Regenerating..." : "Regenerate"}
          </button>
        </div>
      </header>

      {error && !isLoading && !hasPosts && (
        <p className="mt-3 text-xs text-red-400">
          Failed to generate — click Regenerate.
        </p>
      )}

      {open && (
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          {isLoading && !hasPosts ? (
            <>
              <div className="h-40 animate-pulse rounded-lg bg-muted/40" />
              <div className="h-40 animate-pulse rounded-lg bg-muted/40" />
              <div className="h-40 animate-pulse rounded-lg bg-muted/40" />
            </>
          ) : hasPosts ? (
            posts.map((post, idx) => (
              <PostCard
                key={post.id}
                post={post}
                index={idx}
                platform={platform.key}
                charLimit={platform.charLimit}
              />
            ))
          ) : (
            <p className="col-span-full text-sm text-muted-foreground">
              No posts yet. Generate to see content here.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

