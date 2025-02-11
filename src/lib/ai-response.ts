"use server";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatOpenAI } from "@langchain/openai";
import { getCookie } from "./cookies";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import Retriever from "./retriver";
import combineDocuments from "./combine-documents";
import formatConversationHistory from "./format-conversation-history";

const conversationHistory: string[] = [];

export default async function aiResponse(
  question: string
): Promise<{ success: boolean; data?: string; error?: { message: string } }> {
  const openAiKey = await getCookie("openAiKey");

  try {
    const retriever = await Retriever();
    if (!openAiKey) {
      throw new Error("Missing openAiKey");
    } else {
      const llm = new ChatOpenAI({ apiKey: openAiKey, temperature: 0.75 });

      const standaloneQuestionTemplate = `Given some conversation history (if any) and a question, convert the question to a standalone question. 
        conversation history: {conversation_history}
        question: {question} 
        standalone question:`;
      const answerTemplate = `You are a helpful and enthusiastic support bot who can answer a given question based on the context provided and the conversation history.
        Try to find the answer in the context. If the answer is not given in the context, find the answer in the conversation history if possible.
        If you really don't know the answer, say "I'm sorry, I don't know the answer to that." And direct the questioner to email riad.sodmg@gmail.com. 
        Don't try to make up an answer or say that it has not been provided in the context. 
        Always speak as if you were chatting to a friend.
        conversation history: {conversation_history}
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
      const answerChain = answerPrompt
        .pipe(llm as any)
        .pipe(new StringOutputParser());

      const chain = RunnableSequence.from([
        {
          standalone_question: standaloneQuestionChain,
          original_input: new RunnablePassthrough(),
        },
        {
          context: retrieverChain,
          question: ({ original_input }) => original_input.question,
          conversation_history: ({ original_input }) =>
            original_input.conversation_history,
        },
        // (prevResult) => {
        //   console.log("Context:", prevResult);
        //   return prevResult;
        // },
        answerChain,
      ]);

      const response = await chain.invoke({
        question,
        conversation_history: formatConversationHistory(conversationHistory),
      });

      conversationHistory.push(question);
      conversationHistory.push(response);
      // console.log(conversationHistory);

      return { success: true, data: response };
    }
  } catch (error: any) {
    return { success: false, error: { message: error.message } };
  }
}
