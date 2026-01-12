import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audioFile = formData.get('audio') as Blob;
    const question = formData.get('question') as string; // We now receive the question

    if (!audioFile) return NextResponse.json({ error: "No audio" }, { status: 400 });

    const buffer = Buffer.from(await audioFile.arrayBuffer());
    const base64Audio = buffer.toString('base64');

    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash-lite",
        generationConfig: { responseMimeType: "application/json" }
    });

    const prompt = `
    The user is answering this question: "${question}"
    
    TASK:
    1. Listen to the audio and transcribe it into natural text.
    2. STRICTLY DO NOT include timestamps.
    3. Evaluate the response and return a JSON object with:
        - "status": "Correct", "Incorrect", or "Incomplete".
        - "score": A number from 0 to 100 based on accuracy and English quality.
        - "analysis": Explain why (Grammar, facts, or if they missed part).
        - "suggestion": Provide a SHORT, one-sentence polished version. 
       Keep it under 30 to 60 words. Be direct and natural.
        - "transcript": The clean text of what the user said.

    Return ONLY a JSON object.
    `;

    const result = await model.generateContent([
      { inlineData: { mimeType: "audio/webm", data: base64Audio } },
      { text: prompt },
    ]);

    return NextResponse.json(JSON.parse(result.response.text()));
  } catch (error) {
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }
}