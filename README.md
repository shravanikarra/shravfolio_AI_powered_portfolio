<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1TcAFspUUC8WO3EWG8PYNjZratLGcBqAy

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Add your Gemini key in a local env file: create `.env.local` with `VITE_GEMINI_API_KEY=your_key_here`
3. Run the app:
   `npm run dev`

On Vercel: set `VITE_GEMINI_API_KEY` in Project Settings → Environment Variables (no server-side key needed since this is a client-only app).
