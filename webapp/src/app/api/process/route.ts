import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { generateVideo } from "@/lib/video/generator";
import { uploadToYoutube } from "@/lib/youtube/client";
import { promises as fs } from "fs";

const requestSchema = z.object({
  title: z.string().min(3).max(120),
  description: z.string().min(20).max(5000),
  script: z.string().min(50).max(8000),
  tags: z.array(z.string().trim()).max(30).optional(),
  keywords: z.array(z.string().trim()).max(30).optional(),
  privacyStatus: z.enum(["public", "unlisted", "private"]),
  languageCode: z.string().min(2).max(8).default("en"),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/),
});

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const payload = requestSchema.parse(await request.json());

    const video = await generateVideo({
      title: payload.title,
      script: payload.script,
      languageCode: payload.languageCode,
      backgroundColor: payload.backgroundColor,
    });

    try {
      const upload = await uploadToYoutube({
        title: payload.title,
        description: payload.description,
        tags: payload.tags ?? [],
        keywords: payload.keywords ?? [],
        privacyStatus: payload.privacyStatus,
        languageCode: payload.languageCode,
        videoPath: video.videoPath,
        thumbnailPath: video.thumbnailPath,
      });

      return NextResponse.json({
        success: true,
        videoId: upload.videoId,
        youtubeUrl: upload.url,
        duration: video.duration,
        segments: video.segments,
      });
    } finally {
      await fs.rm(video.tempDir, { recursive: true, force: true }).catch(
        () => {}
      );
    }
  } catch (error) {
    console.error("Processing failed", error);
    const message =
      error instanceof Error ? error.message : "Unknown error occurred";
    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    );
  }
}
