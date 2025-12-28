import { NextResponse } from 'next/server';
import textToSpeech from '@google-cloud/text-to-speech';

export async function POST(req: Request) {
  try {
    const { text, gender } = await req.json();

    if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
      return NextResponse.json({ error: "Cloud credentials missing" }, { status: 500 });
    }

    const client = new textToSpeech.TextToSpeechClient({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
      },
    });

    const request = {
      input: { text },
      voice: { 
        languageCode: 'en-US', 
        ssmlGender: gender,
        name: gender === 'FEMALE' ? 'en-US-Neural2-F' : 'en-US-Neural2-J'
      },
      audioConfig: { audioEncoding: 'MP3' as const },
    };

    const [response] = await client.synthesizeSpeech(request as any);

    //@ts-ignore
    return new NextResponse(response.audioContent as Uint8Array, {
      headers: { 'Content-Type': 'audio/mpeg' },
    });
  } catch (error: any) {
    console.error("TTS_ERROR:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}