import Anthropic from "@anthropic-ai/sdk";
import * as cheerio from "cheerio";
import {
  ExtractedProspectSchema,
  type ExtractedProspect,
} from "@/lib/schemas/prospect";
import type { ScrapeResult } from "@/lib/scrape";

// Verify this model ID at console.anthropic.com if extraction fails
const HAIKU_MODEL = "claude-haiku-4-5-20251001";

export async function extractProspectData(
  scraped: ScrapeResult,
  url: string
): Promise<ExtractedProspect> {
  const $ = cheerio.load(scraped.html);

  // Pull structured signals from the DOM
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

  // Use Firecrawl's markdown for body content — cleaner than raw HTML for Claude
  const markdownExcerpt = scraped.markdown.slice(0, 3000);

  const context = `
URL: ${url}
Site name: ${siteName}
Page title: ${title}
Meta description: ${description}
Page content (markdown):
${markdownExcerpt}
`.trim();

  const client = new Anthropic();

  const message = await client.messages.create({
    model: HAIKU_MODEL,
    max_tokens: 600,
    messages: [
      {
        role: "user",
        content: `You are analyzing a prospect's website to help a web hosting sales rep prepare a pitch deck.

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
  "confidence": 0.0-1.0
}`,
      },
    ],
  });

  const raw =
    message.content[0].type === "text" ? message.content[0].text.trim() : "{}";

  const cleaned = raw.replace(/^```json?\s*/i, "").replace(/```\s*$/, "");
  const parsed = JSON.parse(cleaned) as Record<string, unknown>;

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
