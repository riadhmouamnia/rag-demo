"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { getCookie } from "./cookies";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { NeonPostgres } from "@langchain/community/vectorstores/neon";
import { OpenAIEmbeddings } from "@langchain/openai";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

type Docs = {
  Document: {
    pageContent: string;
    metadata: any;
    id?: string;
  }[];
};

export default async function aiResponse(
  question: string
): Promise<{ success: boolean; data?: string; error?: { message: string } }> {
  const openAiKey = await getCookie("openAiKey");
  const dbConnectionString = await getCookie("dbConnectionString");
  const tableName = await getCookie("tableName");

  try {
    if (!openAiKey) {
      return { success: false, error: { message: "Missing openAiKey" } };
    } else if (!dbConnectionString) {
      return {
        success: false,
        error: { message: "Missing dbConnectionString" },
      };
    } else if (!tableName) {
      return {
        success: false,
        error: { message: "Missing tableName" },
      };
    } else {
      const embeddings = new OpenAIEmbeddings({ apiKey: openAiKey });
      const llm = new ChatOpenAI({ apiKey: openAiKey });
      const vectorStore = await NeonPostgres.initialize(embeddings, {
        connectionString: dbConnectionString,
        tableName: tableName.toLowerCase().replace(/\s/g, "_"),
      });

      const standaloneQuestionTemplate =
        "Given a question, convert it to a standalone question. question: {question} standalone question:";

      const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question based on the context provided. Try to find the answer in the context. If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email riad.sodmg@gmail.com. Don't try to make up an answer. Always speak as if you were chatting to a friend.
        context: {context}
        question: {question}
        answer:
        `;

      const standaloneQuestionPrompt = PromptTemplate.fromTemplate(
        standaloneQuestionTemplate
      );
      const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

      const standaloneQuestionChain = standaloneQuestionPrompt
        .pipe(llm as any)
        .pipe(new StringOutputParser());

      const answerChain = answerPrompt
        .pipe(llm as any)
        .pipe(new StringOutputParser());

      const retriever = vectorStore.asRetriever();

      const retrieverChain = RunnableSequence.from([
        (prevResult) => {
          console.log(
            "Standalone question:",
            prevResult.standalone_question,
            "\n\n"
          );
          return prevResult.standalone_question;
        },
        retriever as any,
        combineDocuments,
      ]);

      const chain = RunnableSequence.from([
        {
          standalone_question: standaloneQuestionChain,
          original_input: new RunnablePassthrough(),
        },
        {
          context: retrieverChain,
          question: ({ original_input }) => original_input.question,
        },
        answerChain,
      ]);

      const response = await chain.invoke({ question });
      console.log("Response:", response);

      return { success: true, data: response };
    }
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}

function combineDocuments(docs: Docs["Document"]) {
  console.log("Relevant docs:", docs);
  return docs.map((doc) => doc.pageContent).join("\n\n");
}
