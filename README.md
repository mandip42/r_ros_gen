# ResumeRoast Daily

Generate a full day of platform-native social posts for [wouldIhireyou.com](https://wouldIhireyou.com) in one click.

This is a Next.js 14 (App Router) app that calls OpenAI to create 3 posts each for Reddit, Twitter/X, Facebook Groups, LinkedIn, Instagram, and TikTok. Each post leads with real resume / job search pain points and ends with a soft plug for Resume Roast.

## Tech stack

- Next.js 14 (App Router)
- TypeScript + React 18
- Tailwind CSS
- OpenAI (gpt-4o)
- Sonner for toasts

## Getting started

1. Clone this repository.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create `.env.local` in the project root (if it doesn't exist yet) and add:

   ```bash
   OPENAI_API_KEY=your_key_here
   ```

4. Run the dev server:

   ```bash
   npm run dev
   ```

5. Open `http://localhost:3000` in your browser.

## Deployment

Deploy on Vercel:

1. Push this project to a Git repository (GitHub, GitLab, etc.).
2. Import the repo into Vercel.
3. In Vercel project settings, add an environment variable:

   - `OPENAI_API_KEY` = your OpenAI API key

4. Deploy (Vercel will detect Next.js automatically).

