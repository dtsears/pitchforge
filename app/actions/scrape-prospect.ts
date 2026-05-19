"use server";

import { z } from "zod";
import { scrapeUrl } from "@/lib/scrape";
import { extractProspectData } from "@/lib/extract";
import type { ExtractedProspect } from "@/lib/schemas/prospect";

const InputSchema = z.object({
  url: z.string().url("Please enter a valid URL including https://"),
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

  const { url } = raw.data;

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
