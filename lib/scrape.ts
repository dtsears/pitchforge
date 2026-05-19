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
        waitFor: 2000, // allow JS-rendered content to load
      }),
      signal: AbortSignal.timeout(20000), // 20s max
    }
  );

  if (!response.ok) {
    throw new Error(
      `Browserless error: ${response.status} ${response.statusText}`
    );
  }

  return response.text();
}
