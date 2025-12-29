declare namespace NodeJS {
  interface ProcessEnv {
    GOOGLE_CLIENT_ID?: string;
    GOOGLE_CLIENT_SECRET?: string;
    GOOGLE_REFRESH_TOKEN?: string;
    GOOGLE_REDIRECT_URI?: string;
  }
}
