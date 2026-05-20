import Anthropic from "@anthropic-ai/sdk";
import { GeneratedDeckSchema, type GeneratedDeck } from "@/lib/schemas/deck";

// Verify at console.anthropic.com if generation fails
const SONNET_MODEL = "claude-sonnet-4-5";

type GenerateInput = {
  prospect: {
    companyName: string;
    websiteUrl: string;
    industry?: string | null;
    tagline?: string | null;
    inferredPains: string[];
    primaryColor?: string | null;
    accentColor?: string | null;
    logoUrl?: string | null;
  };
  rep: {
    name: string;
    title: string;
    tenureYears?: number | null;
    bio?: string | null;
    specialties: string[];
  };
  products: {
    name: string;
    description: string;
    slideContentBlocks: unknown;
  }[];
  caseStudy: {
    title: string;
    industry: string;
    headlineMetric: string;
    narrative: string;
    customerName?: string | null;
    customerTitle?: string | null;
    productsTagged: string[];
    sourceUrl?: string | null;
  } | null;
  org: {
    name: string;
    primaryColor: string;
    accentColor: string;
  };
};

export async function generateDeck(input: GenerateInput): Promise<GeneratedDeck> {
  const client = new Anthropic();

  const prompt = buildPrompt(input);

  const message = await client.messages.create({
    model: SONNET_MODEL,
    max_tokens: 4000,
    messages: [{ role: "user", content: prompt }],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "[]";

  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "");

  const parsed = JSON.parse(cleaned) as unknown;
  return GeneratedDeckSchema.parse(parsed);
}

function buildPrompt(input: GenerateInput): string {
  const { prospect, rep, products, caseStudy, org } = input;

  return `You are generating a professional 8-slide sales pitch deck for a ${org.name} sales rep.

SELLING COMPANY: ${org.name}
REP NAME: ${rep.name}
REP TITLE: ${rep.title}
REP TENURE: ${rep.tenureYears ?? 0} years at ${org.name}
REP BIO: ${rep.bio ?? "Experienced account executive"}
REP SPECIALTIES: ${rep.specialties.join(", ")}

PROSPECT COMPANY: ${prospect.companyName}
PROSPECT WEBSITE: ${prospect.websiteUrl}
PROSPECT INDUSTRY: ${prospect.industry ?? "Unknown"}
PROSPECT TAGLINE: ${prospect.tagline ?? "N/A"}
BUYER PAIN POINTS:
${prospect.inferredPains.map((p) => `- ${p}`).join("\n")}

SELECTED PRODUCTS TO PITCH:
${products
  .map(
    (p) => `- ${p.name}: ${p.description}`
  )
  .join("\n")}

${
  caseStudy
    ? `PROOF / CASE STUDY TO USE:
Company: ${caseStudy.customerName ?? "A customer"} (${caseStudy.industry})
Metric: ${caseStudy.headlineMetric}
Story: ${caseStudy.narrative}
Products featured: ${caseStudy.productsTagged.join(", ")}`
    : "PROOF: Use a generic success metric relevant to the prospect's industry."
}

Generate exactly 8 slides in order. Return ONLY a valid JSON array — no markdown, no explanation.

Each slide follows this structure: { "type": "SLIDE_TYPE", "order": 0-7, "content": { ... } }

SLIDE SCHEMAS (use these exact field names):

1. COVER (order 0):
{ "headline": "bold compelling headline referencing prospect by name", "subheadline": "one sentence on the specific opportunity" }

2. REP (order 1):
{ "name": "${rep.name}", "title": "${rep.title}", "tenureYears": ${rep.tenureYears ?? 0}, "bio": "2-3 sentence rep bio personalized to this prospect's context", "specialties": ${JSON.stringify(rep.specialties)} }

3. UNDERSTANDING (order 2) — "What We Heard":
{ "title": "What We Heard", "painPoints": [ { "headline": "short pain headline", "description": "1-2 sentence description specific to ${prospect.companyName}" }, ... ] }
Include 3 pain points drawn from the buyer's known pains above.

4. WHY_NOW (order 3) — trigger event:
{ "title": "Why Now", "triggerEvent": "specific reason this is the right moment for ${prospect.companyName}", "description": "2-3 sentence explanation of the trigger", "urgencyPoints": ["point 1", "point 2", "point 3"] }

5. SOLUTION (order 4):
{ "title": "How ${org.name} Helps", "intro": "1-2 sentence bridge from pain to solution", "products": [ { "name": "product name", "description": "what it does", "benefit": "specific benefit for ${prospect.companyName}" }, ... ] }
Include only the selected products above.

6. PROOF (order 5):
{ "title": "Results That Speak", "customerName": "customer name from case study", "industry": "their industry", "headlineMetric": "the key metric", "narrative": "2-3 sentence version of the story", "productsUsed": ["product names"], "sourceUrl": "${input.caseStudy?.sourceUrl ?? null}" }

7. ROI (order 6) — business case:
{ "title": "The Business Case", "metrics": [ { "label": "metric name", "value": "specific number or %", "description": "what this means for ${prospect.companyName}" }, ... ], "summary": "1-2 sentence ROI summary" }
Include 3 metrics relevant to ${prospect.industry ?? "their industry"}.

8. NEXT_STEPS (order 7):
{ "title": "Next Steps", "steps": [ { "action": "what happens", "owner": "who does it", "timeline": "when" }, ... ], "cta": "single clear call to action" }
Include 3 next steps.

Return the JSON array now.`;
}
