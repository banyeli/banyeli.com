import { z } from "zod";

export const viralPlatformValues = [
  "TikTok", "Instagram Reels", "Instagram carousel", "Instagram caption", "Instagram Stories",
  "YouTube Shorts", "YouTube long-form", "YouTube Community", "Podcast", "Facebook", "Threads",
  "X", "Newsletter", "Email", "Blog", "Website", "Community post",
] as const;

export const viralRequestSchema = z.object({
  title: z.string().trim().max(160).optional(),
  source: z.string().trim().min(20, "Write a little more so Banyeli has something real to work with.").max(30000),
  voice: z.enum(["reyna", "nocturna", "banyeli", "my_chapter_called_sin"]),
  objective: z.string().trim().min(2).max(160),
  audience: z.string().trim().min(2).max(160),
  emotions: z.array(z.string()).min(1).max(14),
  platforms: z.array(z.enum(viralPlatformValues)).min(1, "Choose at least one platform.").max(18),
  depth: z.enum(["quick", "standard", "complete"]),
  intensity: z.enum(["gentle", "balanced", "bold", "highly_disruptive", "cinematic"]),
  language: z.enum(["English", "Spanish", "Bilingual English and Spanish", "Match the source language"]),
  privacy: z.enum(["preserve", "roles", "remove", "flag"]),
  cta: z.string().trim().min(2).max(160),
});

const contentItemSchema = z.object({
  contentType: z.string().min(1), title: z.string().min(1), hook: z.string(), body: z.string().min(1), cta: z.string(),
  onScreenText: z.array(z.string()), visualDirection: z.array(z.string()), deliveryNotes: z.string(), keywords: z.array(z.string()),
  hookFormula: z.string(), emotionalIntention: z.string(), whyItMayWork: z.string(), brandSafetyNote: z.string(),
});

export const viralResponseSchema = z.object({
  campaign: z.object({
    suggestedTitle: z.string().min(1), centralMessage: z.string().min(1), recommendedAngle: z.string().min(1), audience: z.string().min(1),
    emotionalDirection: z.array(z.string()), transformation: z.string().min(1), sensitivityNotes: z.array(z.string()), recommendedPlatforms: z.array(z.enum(viralPlatformValues)),
  }),
  platforms: z.array(z.object({
    platform: z.enum(viralPlatformValues), strategy: z.object({ primaryGoal: z.string(), audienceResponse: z.string(), recommendedFormat: z.string() }),
    items: z.array(contentItemSchema).min(1),
  })).min(1),
  repurposingOpportunities: z.array(z.object({ sourcePlatform: z.string(), targetPlatform: z.string(), recommendation: z.string() })),
});

export type ViralRequest = z.infer<typeof viralRequestSchema>;
export type ViralResponse = z.infer<typeof viralResponseSchema>;
