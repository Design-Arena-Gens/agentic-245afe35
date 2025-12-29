"use client";

import { FormEvent, useMemo, useState } from "react";
import styles from "./page.module.css";

type PrivacyStatus = "public" | "unlisted" | "private";

type ApiResponse =
  | {
      success: true;
      videoId: string;
      youtubeUrl: string;
      duration: number;
      segments: string[];
    }
  | {
      success: false;
      error: string;
    };

const defaultScript = `In this video, we'll explore three powerful productivity habits that can transform how you manage your time.

First, we will set a clear intention for the day using the rule of three. You will pick the three outcomes that matter most and commit to finishing them.

Second, we will build momentum with a ninety minute deep work block. By silencing distractions and working with focus, you can double or even triple your output.

Third, we will end the day with a fast reflection ritual. This takes less than five minutes and helps you celebrate wins, capture lessons, and reset for tomorrow.

Let's dive in.`;

export default function Home() {
  const [title, setTitle] = useState("3 Productivity Habits That Stick");
  const [description, setDescription] = useState(
    "Discover three powerful productivity habits that will help you focus, move faster, and feel more in control of your day. We'll cover intention setting, deep work, and fast reflection rituals you can put into action immediately."
  );
  const [script, setScript] = useState(defaultScript);
  const [tags, setTags] = useState("productivity, focus, habits, motivation");
  const [keywords, setKeywords] = useState(
    "time management, productivity tips, habit building"
  );
  const [privacy, setPrivacy] = useState<PrivacyStatus>("unlisted");
  const [languageCode, setLanguageCode] = useState("en");
  const [backgroundColor, setBackgroundColor] = useState("#1f2937");
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const parsedTags = useMemo(
    () =>
      tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    [tags]
  );

  const parsedKeywords = useMemo(
    () =>
      keywords
        .split(",")
        .map((keyword) => keyword.trim())
        .filter(Boolean),
    [keywords]
  );

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsProcessing(true);
    setStatus("Generating video assets…");
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/process", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          script,
          tags: parsedTags,
          keywords: parsedKeywords,
          privacyStatus: privacy,
          languageCode,
          backgroundColor,
        }),
      });

      const json: ApiResponse = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(
          "error" in json ? json.error : "Failed to process request"
        );
      }
      setStatus("Upload completed");
      setResult(json);
    } catch (uploadError) {
      setError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unexpected failure"
      );
      setStatus(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div>
            <h1>YouTube Automation Studio</h1>
            <p>
              Generate faceless videos with AI voiceover, clean visuals, and
              publish them directly to your YouTube channel in a single click.
            </p>
          </div>
          <div className={styles.statusCard}>
            <h2>Status</h2>
            <p>{status ?? "Idle"}</p>
            {isProcessing && <div className={styles.spinner} />}
            {error && <p className={styles.error}>{error}</p>}
            {result?.success && (
              <div className={styles.result}>
                <p>
                  Video ID: <strong>{result.videoId}</strong>
                </p>
                <a
                  href={result.youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.resultLink}
                >
                  View on YouTube
                </a>
                <p>Duration: {result.duration.toFixed(1)}s</p>
                <details>
                  <summary>Segments</summary>
                  <ul>
                    {result.segments.map((segment, index) => (
                      <li key={index}>{segment}</li>
                    ))}
                  </ul>
                </details>
              </div>
            )}
          </div>
        </section>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.fieldGroup}>
            <label htmlFor="title">Video title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              required
              maxLength={120}
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              rows={6}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <label htmlFor="script">Narration script</label>
            <textarea
              id="script"
              value={script}
              onChange={(event) => setScript(event.target.value)}
              rows={14}
              required
            />
            <small>
              The generator splits the script into scenes automatically and
              synthesizes voiceover along with animated slides.
            </small>
          </div>

          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="tags">Tags (comma separated)</label>
              <input
                id="tags"
                type="text"
                value={tags}
                onChange={(event) => setTags(event.target.value)}
              />
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="keywords">Keywords (comma separated)</label>
              <input
                id="keywords"
                type="text"
                value={keywords}
                onChange={(event) => setKeywords(event.target.value)}
              />
            </div>
          </div>

          <div className={styles.grid}>
            <div className={styles.fieldGroup}>
              <label htmlFor="privacy">Privacy</label>
              <select
                id="privacy"
                value={privacy}
                onChange={(event) =>
                  setPrivacy(event.target.value as PrivacyStatus)
                }
              >
                <option value="public">Public</option>
                <option value="unlisted">Unlisted</option>
                <option value="private">Private</option>
              </select>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="language">Narration language</label>
              <input
                id="language"
                type="text"
                value={languageCode}
                onChange={(event) => setLanguageCode(event.target.value)}
              />
              <small>Use ISO language codes like en, es, fr.</small>
            </div>

            <div className={styles.fieldGroup}>
              <label htmlFor="color">Background color</label>
              <input
                id="color"
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            className={styles.submit}
            disabled={isProcessing}
          >
            {isProcessing ? "Building & uploading…" : "Generate & upload"}
          </button>
        </form>
      </main>
    </div>
  );
}
