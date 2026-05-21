import type { TechStack } from "@/lib/schemas/prospect";

/**
 * Detects hosting provider, CMS, and tech stack from raw HTML.
 * Uses pattern matching against known signatures — same approach as Wappalyzer.
 * No external API required.
 */
export function detectTechStack(html: string): TechStack {
  const detected: string[] = [];
  let hosting: string | null = null;
  let cms: string | null = null;

  const h = html.toLowerCase();

  // ─── CMS via generator meta ────────────────────────────────────────────
  const generatorMatch = html.match(
    /<meta[^>]+name=["']generator["'][^>]+content=["']([^"']+)["']/i
  );
  if (generatorMatch) {
    const gen = generatorMatch[1];
    if (/wordpress/i.test(gen)) { cms = "WordPress"; push(detected, "WordPress"); }
    else if (/drupal/i.test(gen)) { cms = "Drupal"; push(detected, "Drupal"); }
    else if (/joomla/i.test(gen)) { cms = "Joomla"; push(detected, "Joomla"); }
    else if (/ghost/i.test(gen)) { cms = "Ghost"; push(detected, "Ghost"); }
    else if (/hubspot/i.test(gen)) { cms = "HubSpot CMS"; push(detected, "HubSpot CMS"); }
  }

  // ─── WordPress from path patterns (even without generator tag) ─────────
  if (h.includes("wp-content") || h.includes("wp-includes") || h.includes("wp-json")) {
    cms = cms ?? "WordPress";
    push(detected, "WordPress");
  }

  // ─── Hosted website builders / platforms ───────────────────────────────
  if (h.includes("cdn.shopify.com") || h.includes("myshopify.com")) {
    hosting = "Shopify"; cms = "Shopify"; push(detected, "Shopify");
  }
  if (h.includes(".wix.com") || h.includes("wixstatic.com") || h.includes("wix-code")) {
    hosting = "Wix"; cms = "Wix"; push(detected, "Wix");
  }
  if (h.includes("squarespace.com") || h.includes("sqsp.net")) {
    hosting = "Squarespace"; cms = "Squarespace"; push(detected, "Squarespace");
  }
  if (h.includes("webflow.io") || (h.includes("webflow.com") && !h.includes("cdn.webflow.com/email"))) {
    hosting = "Webflow"; push(detected, "Webflow");
  }
  if (h.includes("framer.com") || h.includes("framerusercontent.com")) {
    hosting = "Framer"; push(detected, "Framer");
  }
  if (h.includes("weebly.com") || h.includes("editmysite.com")) {
    hosting = "Weebly"; push(detected, "Weebly");
  }

  // ─── Managed WordPress hosts ───────────────────────────────────────────
  if (h.includes("wpengine.com") || h.includes("wpengine.netdna-cdn.com")) {
    hosting = "WP Engine"; push(detected, "WP Engine");
  }
  if (h.includes("kinsta.com") || h.includes("kinstacdn.com")) {
    hosting = "Kinsta"; push(detected, "Kinsta");
  }
  if (h.includes("pantheon.io") || h.includes("pantheonsite.io")) {
    hosting = "Pantheon"; push(detected, "Pantheon");
  }
  if (h.includes("flywheel.com") || h.includes("getflywheel.com")) {
    hosting = "Flywheel"; push(detected, "Flywheel");
  }

  // ─── Traditional hosts ─────────────────────────────────────────────────
  if (h.includes("bluehost.com") || h.includes("bluehost")) {
    hosting = hosting ?? "Bluehost"; push(detected, "Bluehost");
  }
  if (h.includes("godaddy.com") || h.includes("secureserver.net")) {
    hosting = hosting ?? "GoDaddy"; push(detected, "GoDaddy");
  }
  if (h.includes("siteground.com") || h.includes("sgcachepress.com")) {
    hosting = hosting ?? "SiteGround"; push(detected, "SiteGround");
  }
  if (h.includes("hostgator.com")) {
    hosting = hosting ?? "HostGator"; push(detected, "HostGator");
  }
  if (h.includes("dreamhost.com")) {
    hosting = hosting ?? "DreamHost"; push(detected, "DreamHost");
  }

  // ─── CDN / Infrastructure ──────────────────────────────────────────────
  if (h.includes("cloudflare.com") || h.includes("cloudflareinsights.com") || h.includes("__cf_bm")) {
    push(detected, "Cloudflare");
  }
  if (h.includes("amazonaws.com") && !h.includes("cloudfront")) {
    push(detected, "AWS");
  }
  if (h.includes("cloudfront.net")) {
    push(detected, "AWS CloudFront");
  }
  if (h.includes("vercel.app") || h.includes("vercel-scripts")) {
    hosting = hosting ?? "Vercel"; push(detected, "Vercel");
  }
  if (h.includes("netlify.com") || h.includes("netlify.app")) {
    hosting = hosting ?? "Netlify"; push(detected, "Netlify");
  }

  // ─── Analytics & marketing ─────────────────────────────────────────────
  if (h.includes("google-analytics.com") || h.includes("gtag(") || h.includes("ga.js")) {
    push(detected, "Google Analytics");
  }
  if (h.includes("googletagmanager.com")) {
    push(detected, "Google Tag Manager");
  }
  if (h.includes("hotjar.com")) {
    push(detected, "Hotjar");
  }
  if (h.includes("intercom.io") || h.includes("intercomcdn.com")) {
    push(detected, "Intercom");
  }
  if (h.includes("drift.com")) {
    push(detected, "Drift");
  }
  if (h.includes("hubspot.com") || h.includes("hs-scripts.com")) {
    push(detected, "HubSpot");
  }
  if (h.includes("klaviyo.com")) {
    push(detected, "Klaviyo");
  }

  // ─── eCommerce signals ─────────────────────────────────────────────────
  if (h.includes("woocommerce") || h.includes("wc-block")) {
    push(detected, "WooCommerce");
  }
  if (h.includes("bigcommerce.com")) {
    hosting = hosting ?? "BigCommerce"; push(detected, "BigCommerce");
  }

  // ─── Page builders ─────────────────────────────────────────────────────
  if (h.includes("elementor")) push(detected, "Elementor");
  if (h.includes("divi")) push(detected, "Divi");
  if (h.includes("beaver-builder") || h.includes("fl-builder")) push(detected, "Beaver Builder");

  return {
    hosting,
    cms,
    detected: Array.from(new Set(detected)),
  };
}

function push(arr: string[], item: string) {
  if (!arr.includes(item)) arr.push(item);
}
