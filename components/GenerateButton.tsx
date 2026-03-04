"use client";

import { Loader2, Sparkles } from "lucide-react";

interface GenerateButtonProps {
  onClick: () => Promise<void> | void;
  isLoading: boolean;
}

export function GenerateButton({ onClick, isLoading }: GenerateButtonProps) {
  return (
    <button
      type="button"
      onClick={() => void onClick()}
      disabled={isLoading}
      className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 px-8 py-3 text-sm font-semibold text-white shadow-xl shadow-indigo-500/40 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Sparkles className="h-4 w-4" />
      )}
      {isLoading ? "Generating today's posts..." : "Generate Today's Posts"}
    </button>
  );
}

