// // src/app/api/generate-plan/route.ts
// import { GoogleGenerativeAI } from "@google/generative-ai";
// import { NextResponse } from "next/server";

// const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// export async function POST(req: Request) {
//   try {
//     const surveyData = await req.json();
//     const { goal, role, levelDescription, duration, timePerDay } = surveyData;

//     const model = genAI.getGenerativeModel({ 
//       model: "gemini-2.0-flash-lite",
//       generationConfig: { responseMimeType: "application/json" } 
//     });

//     const prompt = `
//       You are an expert English Coach for Senior Tech Professionals.
//       Generate a ${duration} personalized English learning cycle for the following persona:
//       - Role: ${role}
//       - Goal: ${goal}
//       - Current Problem: ${levelDescription}
//       - Commitment: ${timePerDay} per day for ${duration}
      
//       The output MUST be a JSON object with this exact structure:
//       {
//         "plan_id": "string",
//         "days": [
//           {
//             "day": 1,
//             "theme": "string",
//             "preparation_phase": {
//               "flashcards": [
//                 {
//                   "term": "string",
//                   "meaning": "string",
//                   "normal_context": "string (without using this meaning and making junior or oridinary sentence)",
//                   "example": "string",
//                   "senior_context": "string",
//                   "mcq": {
//                     "question": "string",
//                     "options": [
//                       { "text": "string", "is_correct": boolean }
//                     ]
//                   }
//                 }
//               ],
//               "grammar_blueprint": { "title": "string", "formula": "string", "example": "string" },
//               "audio_reference": { "type": "audio", "data": "string (The text to be spoken by TTS)" }
//             },
//             "exercise_phase": {
//               "task_1_voice": {
//                 "prompt": "string",
//                 "required_keywords": ["string"],
//                 "constraint": "string"
//               }
//             }
//           }
//         ]
//       }

//       Focus Day 1 on the most critical vocabulary for a ${role}. 
//       Use high-impact verbs like 'Leverage', 'Orchestrate', or 'Mitigate'.
//     `;

//     const result = await model.generateContent(prompt);
//     const responseText = result.response.text();
    
//     // Parse the AI response to ensure it's valid JSON
//     const plan = JSON.parse(responseText);

//     return NextResponse.json(plan);
//   } catch (error) {
//     console.error("Gemini API Error:", error);
//     return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
//   }
// }


import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { role, duration, timePerDay, selectedTitles } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      Act as a Senior Learning Architect. Create a custom learning roadmap for a ${role}.
      
      Parameters:
      - Total Duration: ${duration}
      - Daily Commitment: ${timePerDay}
      - Selected Focus Packages: ${selectedTitles.join(", ")}

      Logic:
      1. Distribute the total days across the selected packages.
      2. Every package must conclude with a "Pre-test" and an "Exam".
      3. For each day, provide ONLY a professional technical title.
      
      Return a JSON object with this exact structure:
      {
        "plan_metadata": { "total_days": number, "hours_per_day": string },
        "roadmap": [
          {
            "package_name": "string",
            "days": [
              { "day": number, "title": "string", "type": "lesson" | "revision" | "exam" }
            ]
          }
        ]
      }
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    const cleanedJson = text.replace(/```json|```/g, "").trim();

    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    console.error("Plan Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate plan" }, { status: 500 });
  }
}