import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { getCookie } from "./cookies";
import { OpenAIEmbeddings } from "@langchain/openai";

export default async function Retriever() {
  try {
    const openAiKey = await getCookie("openAiKey");
    const dbConnectionString = await getCookie("dbConnectionString");
    const tableName = await getCookie("tableName");
    if (!openAiKey) {
      throw new Error("Missing openAiKey");
    } else if (!dbConnectionString) {
      throw new Error("Missing dbConnectionString");
    } else if (!tableName) {
      throw new Error("Missing tableName");
    }
    const embeddings = new OpenAIEmbeddings({ apiKey: openAiKey });
    const vectorStore = await NeonPostgres.initialize(embeddings, {
      connectionString: dbConnectionString,
      tableName: tableName.toLowerCase().replace(/\s/g, "_"),
    });

    const retriever = vectorStore.asRetriever();
    return retriever;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(error);
  }
}
