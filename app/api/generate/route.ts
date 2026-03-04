import { NextResponse } from "next/server";
import { getOpenAIClient } from "@/lib/openai";
import { getPrompt } from "@/lib/prompts";
import type { PlatformKey, Post } from "@/types";

const ALL_PLATFORMS: PlatformKey[] = [
  "reddit",
  "twitter",
  "facebook",
  "linkedin",
  "instagram",
  "tiktok"
];

function parsePosts(raw: string, platform: PlatformKey): Post[] {
  const blocks = raw
    .split(/^-{3,}$/m)
    .map((b) => b.trim())
    .filter(Boolean);

  return blocks.map((content, index) => ({
    id: `${platform}-${index}-${Date.now()}`,
    content,
    platform,
    index
  }));
}

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const requested: string[] | undefined = body.platforms;

    const platforms: PlatformKey[] =
      (requested && requested.length
        ? requested
        : ALL_PLATFORMS
      ).filter((p): p is PlatformKey =>
        ALL_PLATFORMS.includes(p as PlatformKey)
      );

    if (!platforms.length) {
      return NextResponse.json(
        { error: "No valid platforms requested" },
        { status: 400 }
      );
    }

    const results = await Promise.all(
      platforms.map(async (platform) => {
        const { system, user } = getPrompt(platform);
        try {
          const openai = getOpenAIClient();
          const completion = await openai.chat.completions.create({
            model: "gpt-4o",
            temperature: 0.85,
            messages: [
              { role: "system", content: system },
              { role: "user", content: user }
            ]
          });

          const content =
            completion.choices[0]?.message?.content?.toString().trim() ?? "";

          if (!content) {
            return { platform, posts: [] as Post[] };
          }

          const posts = parsePosts(content, platform);
          return { platform, posts };
        } catch (error) {
          console.error(`Error generating posts for ${platform}:`, error);
          return { platform, posts: [] as Post[] };
        }
      })
    );

    const payload: Record<string, Post[]> = {};
    for (const { platform, posts } of results) {
      payload[platform] = posts;
    }

    return NextResponse.json(payload);
  } catch (error) {
    console.error("Unexpected error in /api/generate:", error);
    return NextResponse.json(
      { error: "Failed to generate posts" },
      { status: 500 }
    );
  }
}

