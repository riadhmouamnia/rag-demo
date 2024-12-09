/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";

import { Readability } from "@mozilla/readability";
import { JSDOM } from "jsdom";
import axios from "axios";

export async function scrapeWebContent(formData: FormData) {
  const url = formData.get("url");

  if (typeof url !== "string" || url.length === 0)
    return { error: { message: "URL is required" } };

  try {
    const response = await axios.get(url);
    const dom = new JSDOM(response.data, { url });
    const reader = new Readability(dom.window.document);
    const article = reader.parse();
    if (!article || article.textContent.includes("PAGE NOT FOUND404"))
      return { error: { message: "No article content found" } };
    return { success: true, data: { content: article?.textContent } };
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
