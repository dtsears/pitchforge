export async function scrapeUrl(url: string): Promise<string> {
  const apiKey = process.env.BROWSERLESS_API_KEY;
  if (!apiKey) throw new Error("BROWSERLESS_API_KEY is not set");

  const response = await fetch(
    `https://chrome.browserless.io/content?token=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        gotoOptions: {
          waitUntil: "networkidle2",
          timeout: 15000,
        },
      }),
      signal: AbortSignal.timeout(25000),
    }
  );

  if (!response.ok) {
    const body = await response.text().catch(() => "(no body)");
    throw new Error(
      `Browserless error: ${response.status} ${response.statusText} — ${body}`
    );
  }

  return response.text();
}
