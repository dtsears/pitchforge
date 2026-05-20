"use server";

import Anthropic from "@anthropic-ai/sdk";

const HAIKU_MODEL = "claude-haiku-4-5-20251001";

type EmailInput = {
  repName: string;
  repTitle: string;
  prospectCompany: string;
  prospectIndustry?: string | null;
  inferredPains: string[];
  deckUrl: string;
  contactName?: string | null;
};

export type GeneratedEmail = {
  subject: string;
  body: string;
};

export async function generateOutreachEmail(
  input: EmailInput
): Promise<GeneratedEmail> {
  const client = new Anthropic();

  const prompt = `You are an expert B2B sales email writer. Write a first-touch outreach email from a web hosting sales rep to a prospect.

REP: ${input.repName}, ${input.repTitle} at Bluehost
PROSPECT COMPANY: ${input.prospectCompany}${input.prospectIndustry ? ` (${input.prospectIndustry})` : ""}
${input.contactName ? `CONTACT NAME: ${input.contactName}` : ""}
BUYER PAIN POINTS:
${input.inferredPains.map((p) => `- ${p}`).join("\n")}
DECK LINK: ${input.deckUrl}

BLUEHOST BRAND VOICE — APPLY TO THIS EMAIL:
- Tone: Supportive, Clever, Authoritative. Never boastful or corny.
- Goal: Make them feel "Bluehost gets me" — confident and optimistic, not pressured.
- Correct spelling: WordPress (not Wordpress), plugin (not plug-in), website (not web site), email (not e-mail), eCommerce (not e-commerce), AI (not Ai).
- Oxford commas always.

EMAIL BEST PRACTICES:
- Subject line: under 50 characters, specific, no clickbait
- Opening: one sentence referencing something specific about their business — never "I hope this finds you well"
- Body: 3-4 sentences max. Connect one specific pain to Bluehost's solution. Direct, not fluffy.
- CTA: one clear ask — a 20-minute call. Not "would love to connect" or "circle back".
- Include the deck link naturally as supporting context, not the main pitch
- Tone: peer-to-peer. A knowledgeable colleague, not a vendor.
- Do NOT use: "circle back", "touch base", "synergy", "game-changer", "exciting opportunity", "leverage" (overused)
- Sign-off: rep name and title only

Return ONLY valid JSON:
{
  "subject": "email subject line",
  "body": "full email body including greeting, body paragraphs, CTA, and sign-off. Use \\n for line breaks."
}`;

  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 600,
    messages: [{ role: "user", content: prompt }],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "{}";
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned) as GeneratedEmail;
}
