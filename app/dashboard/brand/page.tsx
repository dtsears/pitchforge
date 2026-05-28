import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { saveBrandGuide } from "@/app/actions/save-brand-guide";

export default async function BrandPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const org = await db.organization.findFirst({
    where: { domain: "bluehost.com" },
    select: {
      name: true,
      primaryColor: true,
      accentColor: true,
      logoUrl: true,
      brandGuideUrl: true,
    },
  });

  return (
    <main className="min-h-full bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <h1 className="text-display text-3xl font-semibold text-stone-900 mb-1">
          Brand
        </h1>
        <p className="text-stone-500 text-sm mb-8">
          Bluehost brand guidelines used in every generated deck and email.
        </p>

        {/* Brand colors */}
        <section className="bg-white border border-stone-200 rounded-xl p-5 mb-4">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Brand Colors
          </h2>
          <div className="flex gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-stone-100"
                style={{ backgroundColor: org?.primaryColor ?? "#003087" }}
              />
              <div>
                <p className="text-xs font-medium text-stone-900">Primary</p>
                <p className="text-xs text-stone-400 font-mono">
                  {org?.primaryColor ?? "#003087"}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-lg border border-stone-100"
                style={{ backgroundColor: org?.accentColor ?? "#0057B8" }}
              />
              <div>
                <p className="text-xs font-medium text-stone-900">Accent</p>
                <p className="text-xs text-stone-400 font-mono">
                  {org?.accentColor ?? "#0057B8"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tone pillars */}
        <section className="bg-white border border-stone-200 rounded-xl p-5 mb-4">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Voice &amp; Tone
          </h2>
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[
              { pillar: "Supportive", desc: "Numerous paths to meet your destination." },
              { pillar: "Clever", desc: "Witty and sharp, never corny or crude." },
              { pillar: "Authoritative", desc: "Lead with expertise, never boastful." },
            ].map(({ pillar, desc }) => (
              <div key={pillar} className="p-3 bg-stone-50 rounded-lg border border-stone-100">
                <p className="text-xs font-semibold text-stone-900 mb-1">{pillar}</p>
                <p className="text-xs text-stone-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 leading-relaxed">
            Emotional goal: <strong className="text-stone-700">"Bluehost gets me"</strong> — prospects should leave feeling confident, inspired, and optimistic.
          </p>
        </section>

        {/* Terminology */}
        <section className="bg-white border border-stone-200 rounded-xl p-5 mb-4">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Terminology — Always Use These
          </h2>
          <div className="grid grid-cols-2 gap-x-8 gap-y-1.5">
            {[
              ["WordPress", "not Wordpress"],
              ["plugin", "not plug-in"],
              ["website", "not web site"],
              ["email", "not e-mail"],
              ["eCommerce", "not e-commerce"],
              ["AI", "not Ai"],
              ["cybersecurity", "not cyber-security"],
              ["backups", "not back-up's"],
              ["subdomain", "not sub-domain"],
              ["SSL certificate", "lowercase unless proper noun"],
            ].map(([correct, wrong]) => (
              <div key={correct} className="flex items-baseline gap-1.5 text-xs">
                <span className="font-semibold text-stone-900">{correct}</span>
                <span className="text-stone-400">{wrong}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-stone-500 mt-3">
            Oxford commas: <strong className="text-stone-700">always</strong>.
          </p>
        </section>

        {/* Example headlines */}
        <section className="bg-white border border-stone-200 rounded-xl p-5 mb-4">
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Approved Headline Patterns
          </h2>
          <ul className="space-y-1.5">
            {[
              "Our VPS hosting. Your tech playground.",
              "Fast WordPress hosting, even in traffic spikes.",
              "Business hosting. Human support.",
              "Whip up an ultrafast online store.",
              "We build it. We optimize it. We keep it growing.",
              "Breathe easier with auto-backups.",
            ].map((h) => (
              <li key={h} className="text-xs text-stone-600 flex items-start gap-2">
                <span className="text-stone-300 mt-0.5">→</span>
                {h}
              </li>
            ))}
          </ul>
        </section>

        {/* Brand guide link */}
        <section className="bg-white border border-stone-200 rounded-xl p-5">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-1">
                Brand Guide Document
              </h2>
              <p className="text-xs text-stone-400">
                Paste a link to your brand guide (Google Drive, Notion, PDF URL, etc.)
              </p>
            </div>
          </div>
          <form action={saveBrandGuide} className="flex gap-2">
            <input
              type="url"
              name="url"
              placeholder="https://drive.google.com/..."
              defaultValue={org?.brandGuideUrl ?? ""}
              className="flex-1 px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
            >
              Save
            </button>
          </form>
          {org?.brandGuideUrl && (
            <a
              href={org.brandGuideUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-block text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2"
            >
              Open current brand guide →
            </a>
          )}
        </section>
      </div>
    </main>
  );
}
