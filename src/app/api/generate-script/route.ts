import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
   const { category, position, language, subtopic } = await req.json();

   if (!process.env.GEMINI_API_KEY) {
      throw new Error("GEMINI_API_KEY is missing from environment variables");
    }
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    // const prompt = `
    //     Context: Professional Shadowing Practice
    //     Target Role: ${position}
    //     Situation Type: ${category}
    //     Technical Context: ${language}
    //     Specific Focus: ${subtopic}

    //     Task: Write a natural English monologue for a ${position}. 
    //     If Category is 'Interview', the script should sound like an answer to an interview question. 
    //     If Category is 'Daily Standup', it should sound like a status update.

    //     Length: 100-110 words.
    //     Tone: Professional but conversational.

    //     --- SPEECH CONSTRAINTS ---
    //     1. Use only standard English words and basic punctuation (periods and commas).
    //     2. DO NOT include code snippets, special symbols (like ; : " ' { }), or technical file paths.
    //     3. If referencing a technical concept like 'React.memo', write it as 'React memo' (no dot).
    //     4. Do not use quotes for emphasis.
    //     5. Return ONLY the spoken text.
    //     `;

    const prompt = `
      Generate a 100-150 word professional English monologue.

      PARAMETERS:
      - Role: ${position}
      - Scenario: ${category} (Answer if Interview, Status Update if Standup)
      - Tech: ${language} / ${subtopic}

      SPEECH RULES (CRITICAL):
      - Use natural, spoken English ONLY.
      - NO code snippets or syntax (e.g., no semicolons, braces, or quotes).
      - Replace dots with spaces (e.g., write "React memo" NOT "React.memo").
      - Tone: Conversational professional.
      - Output: Spoken text only. No intro/outro.
      `;

    console.log("Prompt for Gemini:", prompt);

    const result = await model.generateContent(prompt);
    console.log("Result from Gemini:", result);

    const text = result.response.text();

    return NextResponse.json({ script: text });
  } catch (error: any) {

    console.error("GENERATE_SCRIPT_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}