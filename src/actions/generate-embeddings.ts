/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { getCookie } from "@/lib/cookies";

export async function generateEmbeddings(
  text: string,
  info?: { [key: string]: string }
): Promise<ActionResponse> {
  try {
    const openAiKey = await getCookie("openAiKey");
    const dbConnectionString = await getCookie("dbConnectionString");
    const tableName = await getCookie("tableName");

    if (!openAiKey) {
      return {
        success: false,
        message: "Missing OpenAI API Key",
      };
    }
    if (!dbConnectionString) {
      return {
        success: false,
        message: "Missing Database Connection String",
      };
    }

    const embeddings = new OpenAIEmbeddings({
      apiKey: openAiKey,
    });
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      chunkOverlap: 50,
    });
    const splittedDocs = await splitter.createDocuments([text], [{ info }]);

    const vectorStore = await NeonPostgres.initialize(embeddings, {
      connectionString: dbConnectionString,
      tableName: tableName?.toLowerCase().replace(/\s/g, "_") || "embeddings",
    });

    const idsInserted = await vectorStore.addDocuments(splittedDocs);
    if (!idsInserted.length) {
      return {
        success: false,
        message: "Failed to generate embeddings",
      };
    }
    return {
      success: true,
      message: "Embeddings generated and stored to the database successfully",
    };
  } catch (error) {
    console.error(error);
    return { success: false, message: "Failed to generate embeddings" };
  }
}
