"use server";

import { z } from "zod";
import { scrapeUrl, cacheExpiresAt } from "@/lib/scrape";
import { extractProspectData } from "@/lib/extract";
import { db } from "@/lib/db";
import type { ExtractedProspect } from "@/lib/schemas/prospect";
import { ExtractedProspectSchema } from "@/lib/schemas/prospect";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  return `https://${trimmed}`;
}

const InputSchema = z.object({
  url: z.string().min(1, "Please enter a website URL"),
  force: z.coerce.boolean().default(false),
});

export type ScrapeResult =
  | { success: true; data: ExtractedProspect; url: string; cached: boolean }
  | { success: false; error: string };

export async function scrapeProspect(
  formData: FormData
): Promise<ScrapeResult> {
  const raw = InputSchema.safeParse({
    url: formData.get("url"),
    force: formData.get("force") === "on",
  });
  if (!raw.success) {
    return { success: false, error: raw.error.issues[0].message };
  }

  const url = normalizeUrl(raw.data.url);
  const force = raw.data.force;

  try {
    new URL(url);
  } catch {
    return { success: false, error: "Please enter a valid website address" };
  }

  try {
    // ── 1. Check cache (skipped if force re-scrape) ───────────────────────
    if (!force) {
      const cached = await db.scrapeCache.findFirst({
        where: { url, expiresAt: { gt: new Date() } },
      });
      if (cached) {
        const data = ExtractedProspectSchema.parse(cached.extractedData);
        return { success: true, data, url, cached: true };
      }
    }

    // ── 2. Scrape via Firecrawl ───────────────────────────────────────────
    const scraped = await scrapeUrl(url);

    // ── 3. Extract structured data via Claude Haiku ───────────────────────
    const data = await extractProspectData(scraped, url);

    // ── 4. Write to cache (upsert — overwrites stale entry if forced) ─────
    await db.scrapeCache.upsert({
      where: { url },
      update: {
        extractedData: data,
        rawHtml: scraped.html,
        expiresAt: cacheExpiresAt(),
        createdAt: new Date(),
      },
      create: {
        url,
        extractedData: data,
        rawHtml: scraped.html,
        expiresAt: cacheExpiresAt(),
      },
    });

    return { success: true, data, url, cached: false };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
}

// ── Clear all cached scrape entries (testing/admin use) ────────────────────
export async function clearScrapeCache(): Promise<{ deleted: number }> {
  const result = await db.scrapeCache.deleteMany({});
  return { deleted: result.count };
}
