"use server";

import { z } from "zod";
import { scrapeUrl } from "@/lib/scrape";
import { extractProspectData } from "@/lib/extract";
import type { ExtractedProspect } from "@/lib/schemas/prospect";

function normalizeUrl(input: string): string {
  const trimmed = input.trim();
  // Already has a protocol
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  // Has // but no protocol
  if (trimmed.startsWith("//")) return `https:${trimmed}`;
  // Plain domain or www — prepend https://
  return `https://${trimmed}`;
}

const InputSchema = z.object({
  url: z.string().min(1, "Please enter a website URL"),
});

export type ScrapeResult =
  | { success: true; data: ExtractedProspect; url: string }
  | { success: false; error: string };

export async function scrapeProspect(
  formData: FormData
): Promise<ScrapeResult> {
  const raw = InputSchema.safeParse({ url: formData.get("url") });

  if (!raw.success) {
    return { success: false, error: raw.error.issues[0].message };
  }

  const url = normalizeUrl(raw.data.url);

  // Validate the normalized URL is actually a valid URL
  try {
    new URL(url);
  } catch {
    return { success: false, error: "Please enter a valid website address" };
  }

  try {
    const html = await scrapeUrl(url);
    const data = await extractProspectData(html, url);
    return { success: true, data, url };
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "An unexpected error occurred";
    return { success: false, error: message };
  }
}
