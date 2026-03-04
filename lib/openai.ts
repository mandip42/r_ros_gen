import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  // We intentionally don't throw here to allow the app to build,
  // but API calls will fail with a clear error.
  console.warn("OPENAI_API_KEY is not set. API routes will fail.");
}

export const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

