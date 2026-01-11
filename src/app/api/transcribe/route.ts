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
        2. STRICTLY DO NOT include timestamps (like 00:00 or [00:01]).
        3. Evaluate the response in 3 parts:
            - "status": Is the answer "Correct", "Incorrect", or "Incomplete"?
            - "analysis": Explain why (Grammar, facts, or if they missed part of the question).
            - "suggestion": Provide a polished, complete version.
            - "transcript": The clean text of what the user said (No timestamps).

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