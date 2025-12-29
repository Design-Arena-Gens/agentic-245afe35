declare module "ffprobe-static" {
  const ffprobe: {
    path: string;
  };
  export default ffprobe;
}

declare module "google-tts-api" {
  export interface GoogleTTSOptions {
    lang: string;
    slow?: boolean;
    host?: string;
    timeout?: number;
  }

  export function getAudioUrl(
    text: string,
    options: GoogleTTSOptions
  ): string;

  const googleTTS: {
    getAudioUrl: typeof getAudioUrl;
  };

  export default googleTTS;
}
