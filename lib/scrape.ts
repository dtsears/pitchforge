const FIRECRAWL_API = "https://api.firecrawl.dev/v1/scrape";
const CACHE_TTL_DAYS = 30;

export type ScrapeResult = {
  html: string;
  markdown: string;
};

export async function scrapeUrl(url: string): Promise<ScrapeResult> {
  const apiKey = process.env.FIRECRAWL_API_KEY;
  if (!apiKey) throw new Error("FIRECRAWL_API_KEY is not set");

  const response = await fetch(FIRECRAWL_API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      url,
      formats: ["html", "markdown"],
      onlyMainContent: false, // include header/footer for logo/brand signals
    }),
    signal: AbortSignal.timeout(30000),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    throw new Error(
      `Firecrawl error: ${response.status} ${response.statusText} — ${body}`
    );
  }

  const json = (await response.json()) as {
    success: boolean;
    data?: { html?: string; markdown?: string };
    error?: string;
  };

  if (!json.success || !json.data) {
    throw new Error(`Firecrawl failed: ${json.error ?? "Unknown error"}`);
  }

  return {
    html: json.data.html ?? "",
    markdown: json.data.markdown ?? "",
  };
}

export function cacheExpiresAt(): Date {
  const d = new Date();
  d.setDate(d.getDate() + CACHE_TTL_DAYS);
  return d;
}
