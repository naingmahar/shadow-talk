import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  try {
    const { role, challenge } = await req.json();

    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" });

    const prompt = `
      You are a Senior Recruiter. Based on the following user profile, generate 20 professional "Focus Titles" (Packages) for a learning roadmap.
      
      User Role: ${role}
      User Challenge: ${challenge}

      Constraints:
      - Titles must be senior-level and professional and short text.
      - Please make sure Personility and Relationship title
      - Mix technical expertise (e.g., "Mobile Infrastructure Lead") with leadership traits (e.g., "Strategic Technical Thinker").
      - Output MUST be a flat JSON array of strings only.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Clean JSON response (removing markdown code blocks if present)
    const cleanedJson = text.replace(/```json|```/g, "").trim();
    
    return NextResponse.json(JSON.parse(cleanedJson));
  } catch (error) {
    return NextResponse.json({ error: "Failed to generate titles" }, { status: 500 });
  }
}