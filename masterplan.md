Build a full-stack Vercel app called "ResumeRoast Post Generator" — a daily marketing content tool that generates platform-specific social media posts for wouldIhireyou.com (Resume Roast). No placeholders. Everything must work end-to-end.

---

## PRODUCT OVERVIEW

The app generates 2–3 high-quality, copy-paste-ready social media posts per platform (Reddit, Twitter/X, Facebook Groups, LinkedIn, Instagram, TikTok) every day. Each post addresses real, platform-native concerns about resumes, hiring, or job searching — and softly plugs Resume Roast (wouldIhireyou.com) only at the end. The user opens the app, hits Generate, and gets a full day's content across all 6 platforms to copy-paste manually.

---

## TECH STACK

- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS + shadcn/ui
- **AI**: OpenAI API (gpt-4o) — called from Next.js API routes (never expose key to client)
- **Deployment**: Vercel
- **State**: React useState/useEffect — no database needed (stateless per session)
- **Env**: OPENAI_API_KEY in .env.local and Vercel env vars

---

## FILE STRUCTURE
/app
/api
/generate/route.ts       ← API route that calls OpenAI
/page.tsx                  ← Main UI
/layout.tsx
/components
/PlatformCard.tsx          ← Shows posts for one platform
/PostCard.tsx              ← Individual post with copy button
/GenerateButton.tsx
/lib
/prompts.ts                ← All platform prompt builders
/openai.ts                 ← OpenAI client wrapper
/types
/index.ts
.env.local

---

## PLATFORM SPECIFICATIONS

For each platform, generate exactly 3 posts per generation cycle. Each post must:
1. Lead with a real, platform-native pain point, question, or hot topic around resumes/job searching/hiring
2. Provide genuine value (insight, tip, story, debate) that fits the platform's culture
3. End with a natural, soft CTA plugging wouldIhireyou.com — never salesy, never first

### Platform Personas & Formats:

**Reddit** (`r/jobs`, `r/resumes`, `r/careerguidance`)
- Style: conversational, humble, community-question or story format
- Format: 150–300 words, paragraph form, no emojis, feels like a real user post
- Tone: "I've been thinking about this..." or "Hot take:" or "Genuine question:"
- CTA style: "Btw I've been using [Resume Roast](wouldIhireyou.com) to get brutal feedback — actually helped"

**Twitter/X**
- Style: punchy, opinionated, hook-first
- Format: Under 280 chars per tweet OR a thread of 4–6 numbered tweets
- Tone: Bold statements, controversial takes, listicles
- CTA style: short + link at end, e.g. "Get your resume roasted → wouldIhireyou.com"

**Facebook Groups** (job seekers, career advice groups)
- Style: warm, relatable, community-helper tone
- Format: 100–200 words, conversational, 1–2 emojis max
- Tone: "Sharing this in case it helps someone here..."
- CTA style: "If you want real feedback on your resume, I found this tool called Resume Roast (wouldIhireyou.com) — it's pretty eye-opening"

**LinkedIn**
- Style: professional storytelling, insight-driven
- Format: 150–300 words, uses line breaks for readability, 3–5 relevant hashtags at end
- Tone: First-person story or industry insight, not corporate-speak
- CTA style: "P.S. If you're curious how your resume actually reads to a hiring manager, wouldIhireyou.com is worth a look."
- Must feel authentic, not like an ad

**Instagram**
- Style: visual-first copywriting — the caption supports an implied image
- Format: 80–150 words + 10–15 relevant hashtags on a new line
- Tone: Motivational, relatable, slightly aesthetic
- Start with a hook line that works as a visual overlay text suggestion
- CTA: "Link in bio → wouldIhireyou.com | Get your resume roasted 🔥"

**TikTok**
- Style: script/hook for a talking-head or text-overlay video
- Format: Script format — Hook (first 3 seconds), Body (main content), CTA
- Tone: Gen Z/Millennial, energetic, direct-to-camera feel
- Each "post" is actually a video script with: [HOOK], [POINT 1], [POINT 2], [POINT 3], [CTA]
- CTA: "Check out Resume Roast at wouldIhireyou.com — link in bio"

---

## API ROUTE: `/app/api/generate/route.ts`

- Method: POST
- Accepts: `{ platforms: string[] }` (defaults to all 6)
- For each platform, makes a separate OpenAI call (parallel with Promise.all) using the platform-specific system + user prompt from `/lib/prompts.ts`
- Returns: `{ reddit: Post[], twitter: Post[], facebook: Post[], linkedin: Post[], instagram: Post[], tiktok: Post[] }`
- Each Post: `{ id: string, content: string, platform: string, index: number }`
- Handle errors gracefully — if one platform fails, others still return
- Temperature: 0.85 for variety, model: gpt-4o

---

## PROMPTS: `/lib/prompts.ts`

Build a `getPrompt(platform: string): { system: string, user: string }` function.

System prompt base (shared): 
"You are a social media marketing expert who deeply understands each platform's culture and what performs well organically. You write content that provides genuine value first — the product mention is always secondary and natural. The product is Resume Roast (wouldIhireyou.com), an AI tool that gives brutally honest, detailed feedback on resumes. Never mention Resume Roast in the first half of any post. Never be salesy. Always lead with real value. Write in a way that sounds authentically human — use natural phrasing, occasional informality, and imperfect sentence structures where appropriate. Avoid AI-sounding patterns like overly balanced lists, formulaic transitions (e.g. 'In conclusion', 'It's important to note'), and corporate-smooth language. Each post should feel like it was written by a real person who genuinely cares about the topic."

User prompt per platform should:
- Specify exact format, length, tone
- Rotate through different resume/career topic angles (ATS optimization, job gaps, overqualification, ghosting, resume length debates, portfolio links, career switching, etc.) — pick a fresh angle each call by instructing GPT to choose one from a list you provide
- Ask for exactly 3 posts, clearly separated by "---"
- Instruct it to return ONLY the posts, no preamble

Topic angles to include in prompts (rotate via prompt instruction):
"Choose one of these angles (pick whichever feels most timely and engaging, not the same one twice): ATS black holes, resume length debate (1 page vs 2), employment gaps, overqualification rejection, ghosting after interviews, generic objective statements, skills section formatting, tailoring vs generic resumes, portfolio/GitHub links, career pivots, name/photo bias, applicant tracking system tips, cover letter debate, references available upon request, job title inflation"

---

## UI: `/app/page.tsx`

Design a clean, dark-themed dashboard. High quality. Not generic.

Layout:
- Header: App name "ResumeRoast Daily" + subtitle "Generate your daily social posts for wouldIhireyou.com"
- A single large "Generate Today's Posts" button (prominent, center)
- Loading state: animated skeleton cards while generating
- Below: 6 platform sections, each in a collapsible card with platform icon/color
- Platform color coding: Reddit=orange, Twitter=black, Facebook=blue, LinkedIn=blue-dark, Instagram=gradient pink-purple, TikTok=black+teal
- Each platform section shows 3 PostCards

PostCard component:
- Shows the full post text in a readable textarea-like box (pre-wrap, scrollable)
- "Copy" button that copies to clipboard + shows "Copied!" confirmation for 2s
- Post number label (Post 1, Post 2, Post 3)
- Character count shown for Twitter posts

Platform section header:
- Platform logo/icon (use SVG icons or emoji as fallback)
- Platform name
- "Copy All 3" button that copies all 3 posts concatenated
- Collapse/expand toggle

Additional UI features:
- "Regenerate" button per platform to re-generate just that platform's posts without regenerating all
- Subtle "Generated at [time]" timestamp per session
- Toast notifications for copy actions
- Responsive: works on mobile too

---

## `/components/PlatformCard.tsx`

Props: `{ platform: Platform, posts: Post[], onRegenerate: () => void, isLoading: boolean }`
- Renders platform header with icon, color accent, regenerate button
- Maps over posts and renders PostCard for each
- Skeleton loading state when isLoading

## `/components/PostCard.tsx`

Props: `{ post: Post, index: number }`
- Textarea display (read-only, selectable)
- Copy to clipboard button with icon
- Character count (shown for all, highlighted red if Twitter >280)

---

## TYPES: `/types/index.ts`
```typescript
export interface Post {
  id: string;
  content: string;
  platform: PlatformKey;
  index: number;
}

export type PlatformKey = 'reddit' | 'twitter' | 'facebook' | 'linkedin' | 'instagram' | 'tiktok';

export interface PlatformConfig {
  key: PlatformKey;
  name: string;
  color: string;
  bgColor: string;
  icon: string; // emoji fallback
  charLimit?: number;
}

export interface GenerateResponse {
  [key: string]: Post[];
}
```

---

## SETUP FILES

**`.env.local`**:
OPENAI_API_KEY=your_key_here

**`package.json`** dependencies to include:
- next, react, react-dom
- openai
- tailwindcss, @tailwindcss/typography
- shadcn/ui (button, card, badge, skeleton, toast/sonner)
- lucide-react (icons)
- clsx, tailwind-merge

**`vercel.json`**: not needed, Next.js deploys automatically

**`README.md`**: Include setup instructions:
1. Clone repo
2. `npm install`
3. Add OPENAI_API_KEY to .env.local
4. `npm run dev`
5. Deploy: `vercel --prod` (add env var in Vercel dashboard)

---

## QUALITY REQUIREMENTS

- All 6 platforms generate simultaneously (Promise.all), not sequentially
- Each platform's 3 posts are genuinely different from each other (different angles, hooks, formats)
- No post should feel like an ad — the CTA is always a soft mention at the very end
- Copy button must work reliably across browsers (navigator.clipboard with fallback)
- Error states handled: show "Failed to generate — click Regenerate" per platform
- The app must work on first `npm run dev` with only OPENAI_API_KEY set

Do not use placeholder content anywhere. Write all prompts, all components, all API logic fully. The app should be immediately usable.