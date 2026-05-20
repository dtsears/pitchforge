"use server";

import Anthropic from "@anthropic-ai/sdk";

const HAIKU_MODEL = "claude-haiku-4-5-20251001";

type EmailInput = {
  type: "outreach" | "followup";
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

// ─── Shared brand voice rules (Bluehost) ──────────────────────────────────

const BRAND_VOICE = `
BLUEHOST BRAND VOICE — APPLY TO THIS EMAIL:
- Tone pillars: Supportive, Clever, Authoritative. Never boastful or corny.
- Goal: "Bluehost gets me" feeling — confident and optimistic, not pressured.
- Correct spelling: WordPress (not Wordpress), plugin (not plug-in), website (not web site), email (not e-mail), eCommerce (not e-commerce), AI (not Ai).
- Oxford commas always.
- Never use: "circle back", "touch base", "synergy", "game-changer", "exciting opportunity", "I hope this finds you well", "leverage" (overused).
`.trim();

// ─── Outreach (cold first contact) ────────────────────────────────────────

function buildOutreachPrompt(input: EmailInput): string {
  const greeting = input.contactName ? `Hi ${input.contactName.split(" ")[0]},` : "Hi,";
  const topPain = input.inferredPains[0] ?? "scaling their web presence";
  const secondPain = input.inferredPains[1] ?? null;

  return `You are writing a cold outreach email from a Bluehost sales rep to a prospect. This is the first contact — they have never spoken before.

${BRAND_VOICE}

REP: ${input.repName}, ${input.repTitle} at Bluehost
PROSPECT COMPANY: ${input.prospectCompany}${input.prospectIndustry ? ` (${input.prospectIndustry})` : ""}
${input.contactName ? `CONTACT: ${input.contactName}` : ""}
TOP INFERRED PAIN: ${topPain}
${secondPain ? `SECONDARY PAIN: ${secondPain}` : ""}
DECK LINK: ${input.deckUrl}

COLD OUTREACH BEST PRACTICES TO FOLLOW:
1. Subject: Under 45 characters. Specific to their business or industry — not generic. Create curiosity without clickbait. Pattern interrupt works well (e.g. "[Company] + Bluehost" or a direct question about their specific situation).
2. Opening line: Lead with a specific observation about THEIR business — something from their industry, size, or inferred pain. Never open with who you are or what Bluehost does.
3. Body: 2-3 sentences max. Connect their specific pain to a concrete result Bluehost creates. Be direct. No fluff.
4. Deck mention: One casual line introducing the deck — frame it as a resource, not a sales pitch. "Put together a quick look" not "Please review the attached proposal."
5. CTA: One clear, low-friction ask. "Worth a 15-minute call?" or "Would [day] work for a quick chat?" Not "I'd love to connect at your earliest convenience."
6. Sign-off: Name and title only. No "Best regards" — just the name.
7. Total length: Under 120 words. Brevity is credibility.

Greeting to use: "${greeting}"

Return ONLY valid JSON:
{
  "subject": "email subject line",
  "body": "full email body. Use \\n for line breaks. Include greeting, body, CTA, and sign-off."
}`;
}

// ─── Follow-up (post-conversation) ────────────────────────────────────────

function buildFollowupPrompt(input: EmailInput): string {
  const firstName = input.contactName?.split(" ")[0];
  const greeting = firstName ? `Hi ${firstName},` : "Hi,";

  return `You are writing a follow-up email from a Bluehost sales rep to a prospect they have already spoken with at least once. The deck was built based on that conversation.

${BRAND_VOICE}

REP: ${input.repName}, ${input.repTitle} at Bluehost
PROSPECT COMPANY: ${input.prospectCompany}${input.prospectIndustry ? ` (${input.prospectIndustry})` : ""}
${input.contactName ? `CONTACT: ${input.contactName}` : ""}
KEY CHALLENGES DISCUSSED:
${input.inferredPains.map((p) => `- ${p}`).join("\n")}
DECK LINK: ${input.deckUrl}

FOLLOW-UP BEST PRACTICES TO FOLLOW:
1. Subject: Reference the prior conversation or company name. "Following up — ${input.prospectCompany} + Bluehost" or "The deck from our call" work well. Under 50 chars.
2. Opening: Warm but brief. Reference the conversation naturally — "Great speaking with you" or "As we discussed" — not "Per our last conversation" (corporate and cold).
3. Deck framing: Present the deck as a recap of what was covered — a working document they can use, not a sales brochure. "I put together everything we discussed" not "Please find attached our proposal."
4. Restate one key insight or next step from the conversation — show you were listening.
5. CTA: Confirm the agreed next step or propose a clear one. "Does [day] still work?" or "Let me know if you want to walk through it together."
6. Sign-off: Name and title only.
7. Total length: Under 150 words. Assume they remember who you are.

Greeting to use: "${greeting}"

Return ONLY valid JSON:
{
  "subject": "email subject line",
  "body": "full email body. Use \\n for line breaks. Include greeting, body, deck mention, CTA, and sign-off."
}`;
}

// ─── Main export ───────────────────────────────────────────────────────────

export async function generateOutreachEmail(
  input: EmailInput
): Promise<GeneratedEmail> {
  const client = new Anthropic();

  const prompt =
    input.type === "outreach"
      ? buildOutreachPrompt(input)
      : buildFollowupPrompt(input);

  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 500,
    messages: [{ role: "user", content: prompt }],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "{}";
  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
  return JSON.parse(cleaned) as GeneratedEmail;
}
