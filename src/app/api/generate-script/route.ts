// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   try {
//    const { category, position, language, subtopic } = await req.json();

//    if (!process.env.GEMINI_API_KEY) {
//       throw new Error("GEMINI_API_KEY is missing from environment variables");
//     }
//     const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });



//     const prompt = `
//       Generate a 100-150 word professional English monologue.

//       PARAMETERS:
//       - Role: ${position}
//       - Scenario: ${category} (Answer if Interview, Status Update if Standup)
//       - Tech: ${language} / ${subtopic}

//       SPEECH RULES (CRITICAL):
//       - Use natural, spoken English ONLY.
//       - NO code snippets or syntax (e.g., no semicolons, braces, or quotes).
//       - Replace dots with spaces (e.g., write "React memo" NOT "React.memo").
//       - Tone: Conversational professional.
//       - Output: Spoken text only. No intro/outro.
//       `;


//     console.log("Prompt for Gemini:", prompt);

//     const result = await model.generateContent(prompt);
//     console.log("Result from Gemini:", result);

//     const text = result.response.text();

//     return NextResponse.json({ script: text });
//   } catch (error: any) {

//     console.error("GENERATE_SCRIPT_ERROR:", error);
//     return NextResponse.json({ error: error.message }, { status: 500 });
//   }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    // 1. Map variables to your new UI state keys (sector, tool, etc.)
    const { sector, category, position, tool, subtopic } = await req.json();

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment variables");
    }

    // Using gemini-1.5-flash (stable) or your preferred version
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      ACT AS: A senior professional in the ${sector} industry.
      ROLE: ${position}
      SCENARIO: ${category}
      CONTEXT: Working with ${tool}
      SPECIFIC TOPIC: ${subtopic}

      TASK:
      Generate a 60-100 word professional English monologue for a shadowing exercise.
      
      SPEECH RULES (CRITICAL):
      - Use natural, professional spoken English only.
      - NO code snippets, NO backticks, NO symbols like { } [ ] / or ;.
      - Technical terms should be written as spoken (e.g., "React Native" instead of "react-native").
      - Replace dots with spaces for smooth reading (e.g., "Node JS" instead of "Node.js").
      - Tone: Conversational, high-level, and authoritative.
      - Output: Spoken text only. Do not include labels like "Speaker:" or intro/outro text.

      CONTENT STRATEGY:
      - If category is INTERVIEW: Answer a complex question about ${subtopic} using ${tool}.
      - If category is DAILY STANDUP: Provide a progress update on a task involving ${subtopic}.
      - If category is CLIENT MEETING: Explain the value proposition of ${subtopic} to a stakeholder.

      SCRIPT:
      `;

    console.log("Generating Script for:", { sector, position, category, subtopic });

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();

    return NextResponse.json({ script: text });
  } catch (error: any) {
    console.error("GENERATE_SCRIPT_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}