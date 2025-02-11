"use server";
import { YoutubeTranscript } from "youtube-transcript";
import { z } from "zod";
import { generateEmbeddings } from "./generate-embeddings";
const youtubeUrlSchema = z.object({
  url: z.string().url().min(1, "URL is required").includes("watch?v=", {
    message:
      "Invalid URL format for YouTube video, the URL must include 'watch?v='.",
  }),
});

export async function youtubeAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawUrl: WebUrlFormData = {
      url: formData.get("url") as string,
    };

    const validatedData = youtubeUrlSchema.safeParse(rawUrl);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the url field",
        errors: validatedData.error.flatten().fieldErrors,
        input: rawUrl,
      };
    }
    const url = validatedData.data.url;
    const videoId = url.split("v=")[1].split("&")[0];

    const content = { text: "", url };
    await YoutubeTranscript.fetchTranscript(url).then((transcript) => {
      transcript.forEach((entry) => {
        content.text += entry.text + " ";
      });
    });

    const embeddingsRes = await generateEmbeddings(content.text, {
      url,
      source: "youtube",
      videoId,
    });

    if (!embeddingsRes.success) {
      return {
        success: false,
        message: embeddingsRes.message,
        input: rawUrl,
      };
    }
    return {
      ...embeddingsRes,
    };
  } catch (error) {
    return {
      success: false,
      message: "An unexpected error occurred: " + error,
    };
  }
}
