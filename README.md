# Agentic YouTube Automation

End-to-end automation pipeline that turns a text script into a faceless video, uploads it to YouTube, and applies metadata automatically. Built with Next.js and deployable on Vercel.

## Features
- AI-powered voice generation using Google Translate TTS
- Slide-based 1280×720 video render with adaptive pacing
- Automatic thumbnail creation from the opening slide
- One-click upload to YouTube with tags, keywords, and privacy controls
- Modern dashboard UI to manage and launch video jobs

## Local Development
```bash
cd webapp
npm install
npm run dev
```
Visit `http://localhost:3000`.

## Environment Variables
Set the following in `.env.local` (or on Vercel):
```
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
GOOGLE_REFRESH_TOKEN=
# Optional: provide a custom redirect URI, defaults to Google API playground
GOOGLE_REDIRECT_URI=
```
- Generate OAuth credentials in Google Cloud Console (YouTube Data API v3 enabled).
- Create a refresh token with `https://www.googleapis.com/auth/youtube.upload` scope.

## How It Works
1. The UI posts to `/api/process`.
2. `generateVideo` (Node runtime):
   - Splits the script into narrative segments.
   - Fetches MP3 audio for each segment via Google TTS.
   - Merges the narration, designs scene slides with SVG+Sharp, and renders an MP4 using ffmpeg.
   - Saves a high-quality JPEG thumbnail.
3. `uploadToYoutube` streams the video and thumbnail using the YouTube Data API.
4. Temporary artifacts are removed once the upload completes.

## Production Build
```bash
cd webapp
npm run build
npm start
```

## Deployment
Deploy the `webapp` directory to Vercel. After deployment, run:
```bash
vercel deploy --prod --yes --token $VERCEL_TOKEN --name agentic-245afe35
```
Then verify:
```bash
curl https://agentic-245afe35.vercel.app
```

## Notes
- ffmpeg, ffprobe, and Sharp binaries are bundled via npm packages (`ffmpeg-static`, `ffprobe-static`, `sharp`).
- Google TTS has request limits; long scripts are chunked to comply.
- YouTube may need a brief processing window before the video becomes playable.
