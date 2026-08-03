import OpenAI from "openai";
import { NextResponse } from "next/server";
import { viralRequestSchema, viralResponseSchema } from "@/lib/ai/viral-content-schema";
import { viralContentPrompt, VIRAL_CONTENT_PROMPT_VERSION } from "@/lib/prompts/viral-content";
import { createServerClient } from "@/lib/supabase/server";

async function generate(client: OpenAI, prompt: string) {
  const response = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-5.6-sol",
    messages: [{ role: "system", content: "Return valid structured JSON only. Never wrap it in Markdown." }, { role: "user", content: prompt }],
    response_format: { type: "json_object" },
  });
  const raw = response.choices[0]?.message.content || "{}";
  return { raw, parsed: viralResponseSchema.safeParse(JSON.parse(raw)) };
}

export async function POST(request: Request) {
  try {
    const input = viralRequestSchema.parse(await request.json());
    const apiKey = process.env.OPENAI_API_KEY || process.env.Openai_api_key;
    if (!apiKey) return NextResponse.json({ error: "The AI connection is not configured yet." }, { status: 503 });
    const client = new OpenAI({ apiKey });
    const first = await generate(client, viralContentPrompt(input));
    const output = first.parsed.success ? first.parsed.data : undefined;
    const validationProblems = first.parsed.success ? "" : first.parsed.error.issues.map((issue) => issue.path.join(".")).join(", ");
    const retry = output ? undefined : await generate(client, `${viralContentPrompt(input)}\nYour first response failed validation. Correct the JSON structure and return the complete campaign only. Validation problems: ${validationProblems}`);
    const campaignOutput = output || (retry?.parsed.success ? retry.parsed.data : undefined);
    if (!campaignOutput) return NextResponse.json({ error: "Banyeli could not safely structure that response. Your source is still in the editor—please try again." }, { status: 422 });
    const token = request.headers.get("authorization")?.replace(/^Bearer\s+/i, "");
    if (!token) return NextResponse.json({ ...campaignOutput, promptVersion: VIRAL_CONTENT_PROMPT_VERSION, persistence: "Sign in to save this campaign to your Vault." });
    const supabase = createServerClient(token);
    const { data: userData } = await supabase.auth.getUser(token);
    if (!userData.user) return NextResponse.json({ ...campaignOutput, promptVersion: VIRAL_CONTENT_PROMPT_VERSION, persistence: "Your session expired. The campaign was generated but not saved." });
    const userId = userData.user.id;
    const { data: sourceRow, error: sourceError } = await supabase.from("source_materials").insert({ user_id: userId, title: input.title || campaignOutput.campaign.suggestedTitle, original_text: input.source, source_type: "viral_content", voice_key: input.voice, sensitivity_level: input.privacy }).select("id").single();
    if (sourceError || !sourceRow) return NextResponse.json({ ...campaignOutput, promptVersion: VIRAL_CONTENT_PROMPT_VERSION, persistence: "Generation succeeded, but Banyeli could not save the original source." });
    const { data: campaignRow, error: campaignError } = await supabase.from("campaigns").insert({ user_id: userId, source_id: sourceRow.id, name: campaignOutput.campaign.suggestedTitle, objective: input.objective, audience: input.audience, emotional_directions: input.emotions, intensity: input.intensity, cta: input.cta, metadata: { platforms: input.platforms, depth: input.depth, language: input.language, privacy: input.privacy, creativeDirection: campaignOutput.campaign } }).select("id").single();
    if (campaignError || !campaignRow) return NextResponse.json({ ...campaignOutput, promptVersion: VIRAL_CONTENT_PROMPT_VERSION, persistence: "Generation succeeded, but the campaign could not be saved." });
    const contentRows = campaignOutput.platforms.flatMap((group) => group.items.map((item) => ({ user_id: userId, campaign_id: campaignRow.id, platform: group.platform, content_type: item.contentType, formula: item.hookFormula, generated_text: item.body, metadata: { ...item, strategy: group.strategy }, status: "draft" })));
    const { error: contentError } = await supabase.from("generated_content").insert(contentRows);
    await supabase.from("generation_runs").insert({ user_id: userId, campaign_id: campaignRow.id, source_id: sourceRow.id, request_settings: input, response_summary: campaignOutput.campaign, model: process.env.OPENAI_MODEL || "gpt-5.6-sol", prompt_version: VIRAL_CONTENT_PROMPT_VERSION, status: contentError ? "partial" : "completed", completed_at: new Date().toISOString() });
    return NextResponse.json({ ...campaignOutput, promptVersion: VIRAL_CONTENT_PROMPT_VERSION, campaignId: campaignRow.id, sourceId: sourceRow.id, persistence: contentError ? "Campaign saved, but some content needs regeneration." : "Saved to your Vault." });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Generation failed. Please try again." }, { status: 400 });
  }
}
