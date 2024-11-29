"use server";

import { streamText } from "ai";
import { createStreamableValue } from "ai/rsc";
import { auth } from "@clerk/nextjs/server";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateEmbedding } from "../../lib/gemini.ts";
import db from "../../lib/db.ts";
const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function askQuestion(question: string, projectId: string) {
  const stream = createStreamableValue();
  const queryVector = await generateEmbedding(question);
  const vectorQuery = `[${queryVector.join(",")}]`;

  let result = [];
  try {
    result = (await db.$queryRaw`
      SELECT "filename", "sourceCode", "summary",
      1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) AS similarity
      FROM "SourceCodeEmbeddings"
      WHERE 1 - ("summaryEmbedding" <=> ${vectorQuery}::vector) > 0.5
      AND "projectId" = ${projectId}
      ORDER BY similarity DESC
      LIMIT 10
    `) as { filename: string; sourceCode: string; summary: string }[];
  } catch (error) {
    console.error("Error querying database:", error);
  }

  let context = "";
  console.log("result", result.length);
  for (const doc of result) {
    context += `Source: 
    ${doc.filename}
   \n code content  ${doc.sourceCode}
   \n summary of file: ${doc.summary}
    \n\n`;
  }

  (async () => {
    const { textStream } = await streamText({
      model: google("gemini-1.5-flash"),
      prompt: `
          You are a helpful assistant that can answer questions about the code.Ai assistant can only answer questions based on the context provided.
          You are helpful,brand new,human like,and always provide helpful answers.Ai is a well behaved and nice assistant.If a question is not related to the context, just say "I don't know".
           if  it is about a specific file or code ai will provide detailed answer.
           START OF CONTEXT
           ${context}
        END OF CONTEXT

        START OF QUESTION
        ${question}
        END OF QUESTION
        Ai assistant will take account of the context and answer the question.
        if the context is not related to the question, just say "I don't know".
        Answer in markdown syntax, with code snippets if needed.Be as detailed as possible when answering, make sure to explain the code in detail.
          `,
    });

    for await (const chunk of textStream) {
      stream.update(chunk);
    }
    console.log("stream done");
    stream.done();
  })();

  return { output: stream.value, filesReferenced: result };
}

export async function saveQuestion(
  question: string,
  answer: string,
  filesReferences: { filename: string; sourceCode: string }[],
  projectId: string
) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };
  await db.question.create({
    data: { question, answer, filesReferences, projectId, userId },
  });

  return { success: true };
}

export async function getQuestions(projectId: string) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };
  return await db.question.findMany({
    where: { projectId, userId },
    include: { user: true },
  });
}
