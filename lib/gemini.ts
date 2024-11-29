import { GoogleGenerativeAI } from "@google/generative-ai";
import { Document } from "@langchain/core/documents";
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const generateAiSummary = async (diff: string) => {
  // https://github.com/username/repository/commit/commit_hash.diff

  const response = await model.generateContent(
    `You are an expert software engineer and technical documentation specialist with:

Deep understanding of code version control
Ability to extract meaningful insights from code changes
Skill in translating technical modifications into clear, human-readable summaries

Your objective is to:
Generate a concise, informative summary of a GitHub commit based on the provided diff, capturing key change .

Input Processing
Diff Analysis Criteria

Identify type of changes:

File additions
File modifications
File deletions
Code insertions
Code deletions


Categorize Changes:

Structural changes
Content updates
Configuration modifications
Documentation updates



Summary Generation Guidelines

Focus on the PURPOSE of changes
Highlight significant modifications
Provide context for why changes were made
Use active, precise language
Avoid technical jargon where possible

Output Format
 
  * Change 1: [Specific detail]
  * Change 2: [Specific detail]
 
Examples
Example 1: Simple File Addition
Diff:
Copydiff --git a/author b/author
new file mode 100644
index 0000000..e20a3b6
--- /dev/null
+++ b/author
@@ -0,0 +1,4 @@ 
+Name : dfd cs,dfd, dfd
+College : s d
+Branch : Electronics and Communication
+Year : 2012-2016
Expected Output:
 
* Added new author file with team member details
  * Created 'author' file with 4 lines of information
  * Recorded team member names, college, branch, and graduation year
Example 2: More Complex Diff
Diff:
Copydiff --git a/config.json b/config.json
index 5f4a3d1..9b2e7f3 100644
--- a/config.json
+++ b/config.json
@@ -10,7 +10,8 @@
     "database": {
         "host": "localhost",
-        "port": 5432
+        "port": 5433,
+        "ssl": true
     }
 }
Expected Output:
 
 * Updated database configuration settings
  * Changed database port from 5432 to 5433
  * Added SSL configuration for database connection
Evaluation Criteria

Accuracy of change interpretation
Clarity of language
Conciseness
Contextual understanding

Special Instructions

If diff is ambiguous, note areas requiring clarification
Prioritize explaining the INTENT behind changes
Maintain a neutral, professional tone

please summarize the following diff file: \n\n ${diff} \n\n`
  );
  return response.response.text();
};

export const summarizeCode = async (doc: Document) => {
  console.log("generating summary for code");

  try {
    const code = doc.pageContent.slice(0, 10000);
    const response = await model.generateContent(
      `You are an experienced software engineer helping a junior developer understand a code snippet in the file ${doc.metadata.source}. Provide a concise, professional summary of the code.
please summarize the following code: \n\n ${code} \n\n
---

give a summary no more than 100 words of the code above`
    );
    return response.response.text();
  } catch (error) {
    console.log("error generating summary for code", error);
    return "";
  }
};

export const generateEmbedding = async (summary: string) => {
  const model = await genAI.getGenerativeModel({
    model: "text-embedding-004",
  });

  const result = await model.embedContent(summary);
  const embedding = result.embedding;
  return embedding.values;
};
