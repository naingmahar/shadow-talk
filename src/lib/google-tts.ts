import textToSpeech from '@google-cloud/text-to-speech';

// Check if we are on the server side to prevent client-side leaks
const isServer = typeof window === 'undefined';

const credentials = {
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

// Only initialize the client if we have credentials (server-side)
export const ttsClient = isServer 
  ? new textToSpeech.TextToSpeechClient({ credentials }) 
  : null;

/**
 * Helper to transform text to audio bytes
 */
export async function synthesizeSpeech(text: string) {
  if (!ttsClient) throw new Error("TTS Client can only run on the server");

  const request = {
    input: { text },
    voice: { languageCode: 'en-US', ssmlGender: 'NEUTRAL' as const },
    audioConfig: { audioEncoding: 'MP3' as const },
  };

  const [response] = await ttsClient.synthesizeSpeech(request);
  return response.audioContent as Uint8Array;
}