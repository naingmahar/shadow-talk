import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { day, title, package: packageName, role } = await req.json();
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    // const prompt = `
    //   Act as a Senior React Native Mentor. Generate the deep technical details for:
    //   Day: ${day}
    //   Module: ${packageName}
    //   Specific Topic: ${title}
    //   Target Role: ${role}

    //   The output MUST be a JSON object with this exact structure:
    //   {
    //     "day": ${day},
    //     "theme": "${title}",
    //     "preparation_phase": {
    //       "flashcards": [
    //         {
    //           "term": "string",
    //           "meaning": "string",
    //           "normal_context": "string (junior/ordinary sentence)",
    //           "example": "string",
    //           "senior_context": "string (architectural/high-level context)",
    //           "mcq": {
    //             "question": "string",
    //             "options": [
    //               { "text": "string", "is_correct": boolean }
    //             ]
    //           }
    //         }
    //       ],
    //       "grammar_blueprint": { "title": "string", "formula": "string", "example": "string" },
    //       "audio_reference": { "type": "audio", "data": "string (Text for TTS)" }
    //     },
    //     "exercise_phase": {
    //       "task_1_voice": {
    //         "prompt": "string",
    //         "required_keywords": ["string"],
    //         "constraint": "string"
    //       }
    //     }
    //   }

    //   Focus on the most critical vocabulary for a ${role}. 
    //   Use high-impact verbs and ensure 'senior_context' reflects 2026 React Native best practices.
    //   Output valid JSON only.
    // `;


    const prompt = `
      Act as a Senior ${role}  Mentor and Linguistic Coach. 
      Generate a deep technical and linguistic training curriculum for:
      
      DAY: ${day}
      MODULE: ${packageName}
      TOPIC: ${title}
      TARGET ROLE: ${role}

      The output MUST be a valid JSON object with this exact structure:

      {
        "day": ${day},
        "theme": "${title}",
        "preparation_phase": {
          "flashcards": [
            {
              "term": "string",
              "meaning": "string",
              "normal_context": "string",
              "example": "string",
              "senior_context": "string",
              "mcq": {
                "question": "string",
                "options": [
                  { "text": "string", "is_correct": boolean }
                ]
              }
            }
          ],
          "grammar_blueprints": [
            { 
              "title": "string", 
              "formula": "string (Dynamic linguistic equation using [+])", 
              "example": "string" 
            },
            { 
              "title": "string", 
              "formula": "string (Dynamic linguistic equation using [+])", 
              "example": "string" 
            }
          ],
          "audio_reference": { "type": "audio", "data": "string (Text for TTS)" }
        },
        "exercise_phase": {
          "ai_vocal_drills": [
            {
              "target_term": "string (Must match a term from flashcards)",
              "question": "string (e.g., 'How do you [term] performance in the New Architecture?')",
              "hint": "string (Technical hint for the user)",
              "required_keywords": ["string", "string"]
            }
          ],
          "task_1_voice": {
            "prompt": "string (A final, high-level architectural challenge encompassing the whole topic)",
            "required_keywords": ["string", "string", "string"],
            "constraint": "string (e.g., 'Maintain a formal tone and avoid filler words')"
          }
        }
      }

      CRITICAL CONSTRAINTS:
      1. VOCAL DRILLS: Generate one specific question for EVERY term in the flashcards array.
      2. TASK 1 VOICE: This is the original capstone exercise. It should be a broader scenario than the individual vocal drills.
      3. DYNAMIC FORMULAS: In grammar_blueprints, use [+] to separate sentence parts (e.g., [Action] + [Preposition] + [Outcome]).
      4. REAL GRAMMAR: Ensure grammar_blueprints focus on REAL English syntax/sentence construction, not tech stacks.
      5. SENIORITY: All context, questions, and examples must reflect 2026 standards.
      6. FORMAT: Return valid JSON only. No markdown, no backticks.
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(text));
  } catch (error) {
    console.error("Detail Generation Error:", error);
    return NextResponse.json({ error: "Failed to generate details" }, { status: 500 });
  }
}