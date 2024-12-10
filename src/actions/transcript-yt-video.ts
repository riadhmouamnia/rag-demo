/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { YoutubeTranscript } from "youtube-transcript";
export async function transcriptYoutubeVideo(url: string) {
  if (typeof url !== "string" || url.length === 0)
    return { error: { message: "URL is required" } };

  if (!url.startsWith("https://www.youtube.com/watch?v="))
    return {
      error: {
        message:
          "Invalid URL format for YouTube video, the URL must start with https://www.youtube.com/watch?v=",
      },
    };
  const content = { text: "", url };

  try {
    await YoutubeTranscript.fetchTranscript(url).then((transcript) => {
      transcript.forEach((entry) => {
        content.text += entry.text + " ";
      });
    });
    return { success: true, data: { content } };
  } catch (error: Error | any) {
    console.error(error);
    return {
      error: {
        message: error.message,
        name: error.name,
        cause: error.cause,
        stack: error.stack,
      },
    };
  }
}
