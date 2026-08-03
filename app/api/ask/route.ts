import OpenAI from "openai";
import { NextResponse } from "next/server";
import { z } from "zod";

const requestSchema = z.object({ message: z.string().trim().min(1).max(5000) });

export async function POST(request: Request) {
  try {
    const { message } = requestSchema.parse(await request.json());
    if (!process.env.OPENAI_API_KEY) return NextResponse.json({ error: "Banyeli's AI key is not connected yet." }, { status: 503 });
    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const response = await client.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
      messages: [
        { role: "system", content: "You are Banyeli, a private chief of staff and creative companion for one owner. Be warm, direct, and grounded. Keep answers concise unless asked for depth. Treat REYNA and Nocturna as one identity across time: REYNA tells the past and lived memories; Nocturna gives language to the present and becoming. Protect private pain: do not sensationalize trauma, invent facts, or assume details. You may help reflect, organize, create, or plan." },
        { role: "user", content: message },
      ],
    });
    return NextResponse.json({ reply: response.choices[0]?.message.content?.trim() || "I'm here. Say that again in a different way." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Banyeli could not answer right now." }, { status: 400 });
  }
}
