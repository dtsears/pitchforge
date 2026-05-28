import { promises as dns } from "dns";

export type DnsIntel = {
  nameservers: string[];
  dnsHost: string | null;      // inferred from NS records
  emailProvider: string | null; // inferred from MX records
};

export async function lookupDns(url: string): Promise<DnsIntel> {
  let hostname: string;
  try {
    hostname = new URL(url).hostname;
  } catch {
    return { nameservers: [], dnsHost: null, emailProvider: null };
  }

  const [nsResult, mxResult] = await Promise.allSettled([
    dns.resolveNs(hostname),
    dns.resolveMx(hostname),
  ]);

  const nameservers =
    nsResult.status === "fulfilled" ? nsResult.value : [];
  const mxExchanges =
    mxResult.status === "fulfilled"
      ? mxResult.value.map((r) => r.exchange)
      : [];

  return {
    nameservers,
    dnsHost: detectDnsHost(nameservers),
    emailProvider: detectEmailProvider(mxExchanges),
  };
}

// ── Detect hosting provider from NS records ────────────────────────────────

function detectDnsHost(nameservers: string[]): string | null {
  if (!nameservers.length) return null;
  const ns = nameservers.join(" ").toLowerCase();

  if (ns.includes("bluehost")) return "Bluehost";
  if (ns.includes("godaddy") || ns.includes("domaincontrol")) return "GoDaddy";
  if (ns.includes("cloudflare")) return "Cloudflare";
  if (ns.includes("awsdns")) return "AWS Route 53";
  if (ns.includes("wpengine")) return "WP Engine";
  if (ns.includes("kinsta")) return "Kinsta";
  if (ns.includes("squarespace")) return "Squarespace";
  if (ns.includes("wixdns") || ns.includes("wix.com")) return "Wix";
  if (ns.includes("siteground") || ns.includes("sgdns")) return "SiteGround";
  if (ns.includes("hostgator")) return "HostGator";
  if (ns.includes("dreamhost")) return "DreamHost";
  if (ns.includes("netlify")) return "Netlify";
  if (ns.includes("vercel")) return "Vercel";
  if (ns.includes("pantheon")) return "Pantheon";
  if (ns.includes("flywheel") || ns.includes("getflywheel")) return "Flywheel";
  if (ns.includes("namecheap")) return "Namecheap";
  if (ns.includes("name.com")) return "Name.com";
  if (ns.includes("hover.com")) return "Hover";
  if (ns.includes("google") && ns.includes("domain")) return "Google Domains";
  if (ns.includes("shopify")) return "Shopify";
  if (ns.includes("webflow")) return "Webflow";

  return null;
}

// ── Detect email provider from MX records ──────────────────────────────────

function detectEmailProvider(mxExchanges: string[]): string | null {
  if (!mxExchanges.length) return null;
  const mx = mxExchanges.join(" ").toLowerCase();

  if (mx.includes("google") || mx.includes("gmail") || mx.includes("googlemail"))
    return "Google Workspace";
  if (
    mx.includes("outlook") ||
    mx.includes("microsoft") ||
    mx.includes("office365") ||
    mx.includes("protection.outlook")
  )
    return "Microsoft 365";
  if (mx.includes("zoho")) return "Zoho Mail";
  if (mx.includes("protonmail") || mx.includes("proton.me")) return "Proton Mail";
  if (mx.includes("fastmail")) return "Fastmail";
  if (mx.includes("mailchimp") || mx.includes("mandrill")) return "Mailchimp";
  if (mx.includes("sendgrid")) return "SendGrid";
  if (mx.includes("mxroute")) return "MXroute";
  if (mx.includes("hover")) return "Hover Mail";

  return null;
}
