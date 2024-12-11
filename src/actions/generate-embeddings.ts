/* eslint-disable @typescript-eslint/no-explicit-any */
"use server";
import { OpenAIEmbeddings } from "@langchain/openai";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { getCookie } from "@/lib/cookies";

export async function generateEmbeddings(
  text: string,
  info?: { [key: string]: string }
) {
  const openAiKey = await getCookie("openAiKey");
  const dbConnectionString = await getCookie("dbConnectionString");
  const tableName = await getCookie("tableName");

  if (!openAiKey || !dbConnectionString || !tableName) {
    return { error: { message: "Missing openAiKey or dbConnectionString" } };
  }

  const embeddings = new OpenAIEmbeddings({
    apiKey: openAiKey,
  });
  try {
    const splitter = new RecursiveCharacterTextSplitter();
    const splittedDocs = await splitter.createDocuments([text], [{ info }]);

    const vectorStore = await NeonPostgres.initialize(embeddings, {
      connectionString: dbConnectionString,
      tableName: tableName.toLowerCase().replace(/\s/g, "_"),
    });

    const idsInserted = await vectorStore.addDocuments(splittedDocs);
    if (idsInserted.length) {
      return { success: true };
    }
  } catch (error: Error | any) {
    console.error(error);
    return { success: false, error: { message: error.message } };
  }
}
