import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({ text: z.string().trim().min(1).max(5000) });

export async function POST(request: Request) {
  try {
    const { text } = requestSchema.parse(await request.json());
    const apiKey = process.env.ELEVENLABS_API_KEY;
    const voiceId = process.env.ELEVENLABS_VOICE_ID;
    if (!apiKey || !voiceId) return NextResponse.json({ error: "Banyeli's voice is not connected yet." }, { status: 503 });

    const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}/stream`, {
      method: "POST",
      headers: { "xi-api-key": apiKey, "content-type": "application/json", accept: "audio/mpeg" },
      body: JSON.stringify({ text, model_id: "eleven_flash_v2_5", voice_settings: { stability: 0.55, similarity_boost: 0.75, style: 0.2, use_speaker_boost: true } }),
    });
    if (!response.ok) return NextResponse.json({ error: "Banyeli's voice could not play right now." }, { status: response.status });
    return new NextResponse(response.body, { headers: { "content-type": "audio/mpeg", "cache-control": "no-store" } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Banyeli's voice could not play right now." }, { status: 400 });
  }
}
