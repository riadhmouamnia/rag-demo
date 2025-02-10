"use server";

import { z } from "zod";
import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import axios from "axios";
import { generateEmbeddings } from "./generate-embeddings";

const webUrlSchema = z.object({
  url: z.string().url().min(1, "URL is required"),
});

export async function webContentAction(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawUrl: WebUrlFormData = {
      url: formData.get("url") as string,
    };
    const validatedData = webUrlSchema.safeParse(rawUrl);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Please fix the errors in the url field",
        errors: validatedData.error.flatten().fieldErrors,
        input: rawUrl,
      };
    }
    const url = validatedData.data.url;
    const response = await axios.get(url);
    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article || article.textContent.includes("PAGE NOT FOUND404")) {
      return {
        success: false,
        message: "No article content found: " + article?.content,
        input: rawUrl,
      };
    }

    const embeddingsRes = await generateEmbeddings(article.textContent, {
      url,
      source: "web",
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
