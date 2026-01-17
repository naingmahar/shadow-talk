import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

export async function POST(req: Request) {
  try {
    const { sentence, targetTerm } = await req.json();

    if (!sentence || sentence.length < 5) {
      return NextResponse.json(
        { score: 0, advice: "Sentence is too short for a professional analysis." },
        { status: 400 }
      );
    }

    const prompt = `
      You are a Staff Software Engineer conducting a code review and technical briefing assessment.
      
      TASK: Evaluate the user's sentence for "Seniority" and "Architectural Precision".
      TARGET TERM TO USE: "${targetTerm}"
      USER INPUT: "${sentence}"

      EVALUATION GUIDELINES:
      - 0-40%: Junior level. Uses generic verbs (e.g., "make it fast", "fix the bug").
      - 40-75%: Mid-level. Correct usage but lacks architectural depth.
      - 75-100%: Senior/Staff level. Uses precise verbs (e.g., "mitigate", "orchestrate", "decouple", "optimize"). 

      INSTRUCTIONS:
      Return ONLY a valid JSON object. Do not include markdown formatting or backticks.
      
      FORMAT:
      {
        "score": number,
        "advice": "specific feedback on how to improve technical weight"
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean the response in case the AI included markdown code blocks
    const cleanJson = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const data = JSON.parse(cleanJson);

    return NextResponse.json(data);

  } catch (error) {
    console.error("Gemini API Error:", error);
    return NextResponse.json(
      { 
        score: 0, 
        advice: "The AI evaluator is currently unavailable. Please check your network or API key." 
      },
      { status: 500 }
    );
  }
}