import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";
import {
  ExtractedProspectSchema,
  type ExtractedProspect,
} from "@/lib/schemas/prospect";
import { detectTechStack } from "@/lib/tech-detect";
import { lookupDns } from "@/lib/dns-lookup";
import type { ScrapeResult } from "@/lib/scrape";

// Verify this model ID at console.anthropic.com if extraction fails
const HAIKU_MODEL = "claude-haiku-4-5-20251001";

export async function extractProspectData(
  scraped: ScrapeResult,
  url: string
): Promise<ExtractedProspect> {
  const $ = cheerio.load(scraped.html);

  // ── DOM signals ───────────────────────────────────────────────────────
  const title = $("title").text().trim();
  const description =
    $('meta[name="description"]').attr("content") ??
    $('meta[property="og:description"]').attr("content") ??
    "";
  const siteName = $('meta[property="og:site_name"]').attr("content") ?? "";
  const ogImage = $('meta[property="og:image"]').attr("content") ?? "";
  const rawFavicon =
    $('link[rel="icon"]').attr("href") ??
    $('link[rel="shortcut icon"]').attr("href") ??
    "";
  const logoUrl = resolveUrl(ogImage || rawFavicon, url);

  // ── Tech stack + DNS lookup (run in parallel) ────────────────────────
  const [techStack, dnsIntel] = await Promise.all([
    Promise.resolve(detectTechStack(scraped.html)),
    lookupDns(url),
  ]);

  // DNS host takes priority over HTML-detected hosting (more reliable)
  const mergedTechStack = {
    ...techStack,
    hosting: dnsIntel.dnsHost ?? techStack.hosting,
    nameservers: dnsIntel.nameservers,
    dnsHost: dnsIntel.dnsHost,
    emailProvider: dnsIntel.emailProvider,
  };

  // ── Page content for Claude ───────────────────────────────────────────
  const markdownExcerpt = scraped.markdown.slice(0, 3500);

  const context = `
URL: ${url}
Site name: ${siteName}
Page title: ${title}
Meta description: ${description}
Detected tech: ${techStack.detected.join(", ") || "none detected"}
DNS host: ${dnsIntel.dnsHost ?? "unknown"}
Email provider: ${dnsIntel.emailProvider ?? "unknown"}
Page content (markdown):
${markdownExcerpt}
`.trim();

  const client = new Anthropic();

  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 800,
    messages: [
      {
        role: "user",
        content: `You are analyzing a prospect's website to help a Bluehost sales rep prepare a pitch deck and prioritize their outreach.

${context}

Return ONLY a valid JSON object — no markdown, no explanation — matching this schema exactly:

{
  "companyName": "the company name",
  "tagline": "their tagline or value proposition, or null",
  "industry": "their industry (e.g. E-commerce, SaaS, Agency, Restaurant, Healthcare), or null",
  "logoUrl": "${logoUrl || "null"}",
  "primaryColor": "dominant brand hex color if inferable, or null",
  "accentColor": "secondary brand hex color if inferable, or null",
  "inferredPains": ["2-4 specific pain points this company likely has around web performance, hosting reliability, or digital growth — be specific to their business"],
  "topOfferings": [
    {
      "name": "what this company offers or sells (2-4 items)",
      "fitScore": 0-100,
      "fitReason": "one sentence on why this makes them a good fit for Bluehost hosting/products"
    }
  ],
  "signals": {
    "websiteMaintenance": true or false — do they offer or appear to need ongoing website maintenance/support?,
    "aiMentioned": true or false — do they mention AI tools, AI services, or AI in their work?,
    "webDevelopment": true or false — is web development a core service or activity?,
    "seoMentioned": true or false — do they mention SEO as a service they offer or a goal they have?
  },
  "confidence": 0.0-1.0
}

For topOfferings fitScore: 90-100 = ideal Bluehost prospect (agency, eCommerce, high-traffic site), 60-89 = good fit, 30-59 = moderate fit, 0-29 = weak fit.`,
      },
    ],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "{}";

  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

  // Inject merged tech stack (HTML patterns + DNS intel, not from Claude)
  parsed.techStack = mergedTechStack;

  // Ensure logoUrl if Claude returned null but we found one
  if (!parsed.logoUrl && logoUrl) parsed.logoUrl = logoUrl;

  return ExtractedProspectSchema.parse(parsed);
}

function resolveUrl(href: string, base: string): string {
  if (!href) return "";
  try {
    return new URL(href, base).href;
  } catch {
    return href;
  }
}
