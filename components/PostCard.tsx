"use client";

import { useState } from "react";
import { Copy } from "lucide-react";
import { toast } from "sonner";
import type { Post, PlatformKey } from "@/types";

interface PostCardProps {
  post: Post;
  index: number;
  platform: PlatformKey;
  charLimit?: number;
}

async function copyToClipboard(text: string) {
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

export function PostCard({ post, index, platform, charLimit }: PostCardProps) {
  const [copied, setCopied] = useState(false);
  const length = post.content.length;
  const overLimit = charLimit && length > charLimit;

  const handleCopy = async () => {
    const ok = await copyToClipboard(post.content);
    if (ok) {
      setCopied(true);
      toast.success("Post copied to clipboard");
      setTimeout(() => setCopied(false), 2000);
    } else {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-card/60 p-3 shadow-sm">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="font-medium uppercase tracking-wide">
          Post {index + 1}
        </span>
        <span
          className={
            "tabular-nums " +
            (platform === "twitter" && overLimit ? "text-red-400" : "")
          }
        >
          {length}
          {charLimit && platform === "twitter" ? ` / ${charLimit}` : ""} chars
        </span>
      </div>

      <div className="rounded-md bg-black/40 p-3 text-sm leading-relaxed text-foreground/95 whitespace-pre-wrap max-h-64 overflow-y-auto">
        {post.content}
      </div>

      <button
        type="button"
        onClick={handleCopy}
        className="inline-flex items-center justify-center gap-2 rounded-md bg-slate-100/5 px-3 py-1.5 text-xs font-medium text-foreground ring-1 ring-slate-500/40 transition hover:bg-slate-100/10 hover:ring-slate-300/60"
      >
        <Copy className="h-3.5 w-3.5" />
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}

