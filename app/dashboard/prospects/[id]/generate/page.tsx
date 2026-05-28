import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateDeckAction } from "@/app/actions/generate-deck";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GenerateButton } from "./generate-button";
import { ProductGroups } from "./product-groups";
import type { TechStack, Signals, Offering } from "@/lib/schemas/prospect";

export const maxDuration = 60;

const CATEGORY_ORDER = ["Hosting", "Agency", "AI", "eCommerce", "Professional Services"];

export default async function GeneratePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [prospect, products] = await Promise.all([
    db.prospect.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        companyName: true,
        industry: true,
        websiteUrl: true,
        primaryColor: true,
        inferredPains: true,
        topOfferings: true,
        signals: true,
        techStack: true,
      },
    }),
    db.product.findMany({
      where: { org: { domain: "bluehost.com" } },
      orderBy: { name: "asc" },
      select: {
        id: true,
        name: true,
        description: true,
        category: true,
        targetBuyerProfile: true,
      },
    }),
  ]);

  if (!prospect) notFound();

  // Group products by category
  const grouped = CATEGORY_ORDER.reduce<Record<string, typeof products>>(
    (acc, cat) => {
      const items = products.filter((p) => (p.category ?? "Other") === cat);
      if (items.length > 0) acc[cat] = items;
      return acc;
    },
    {}
  );
  // Uncategorized fallback
  const uncategorized = products.filter(
    (p) => !p.category || !CATEGORY_ORDER.includes(p.category)
  );
  if (uncategorized.length > 0) grouped["Other"] = uncategorized;

  // Parse enriched scrape data
  const topOfferings = (prospect.topOfferings ?? []) as Offering[];
  const signals = prospect.signals as Signals | null;
  const techStack = prospect.techStack as TechStack | null;

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="mb-6">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            Generate Deck
          </p>
          <h1 className="text-display text-3xl font-semibold text-stone-900">
            {prospect.companyName}
          </h1>
          {prospect.industry && (
            <p className="text-stone-500 text-sm mt-0.5">{prospect.industry}</p>
          )}
        </div>

        <div className="grid grid-cols-5 gap-6">
          {/* Left: prospect intel */}
          <div className="col-span-2 space-y-4">
            {/* Top offerings */}
            {topOfferings.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Their Top Offerings
                </p>
                <div className="space-y-3">
                  {topOfferings.map((o, i) => (
                    <div key={i}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-semibold text-stone-900">{o.name}</span>
                        <span
                          className="text-xs font-bold"
                          style={{
                            color:
                              o.fitScore >= 80
                                ? "#16a34a"
                                : o.fitScore >= 50
                                ? "#d97706"
                                : "#9ca3af",
                          }}
                        >
                          {o.fitScore}% fit
                        </span>
                      </div>
                      <div className="w-full h-1 bg-stone-100 rounded-full overflow-hidden mb-1">
                        <div
                          className="h-full rounded-full"
                          style={{
                            width: `${o.fitScore}%`,
                            backgroundColor:
                              o.fitScore >= 80
                                ? "#16a34a"
                                : o.fitScore >= 50
                                ? "#d97706"
                                : "#d6d3d1",
                          }}
                        />
                      </div>
                      <p className="text-[10px] text-stone-400 leading-relaxed">{o.fitReason}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Signals */}
            {signals && (
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                  Signals
                </p>
                <div className="space-y-1.5">
                  {[
                    { label: "Website Maintenance", val: signals.websiteMaintenance },
                    { label: "AI Mentioned", val: signals.aiMentioned },
                    { label: "Web Development", val: signals.webDevelopment },
                    { label: "SEO Focus", val: signals.seoMentioned },
                  ].map(({ label, val }) => (
                    <div key={label} className="flex items-center gap-2">
                      <div
                        className={`w-1.5 h-1.5 rounded-full ${val ? "bg-green-500" : "bg-stone-200"}`}
                      />
                      <span className={`text-xs ${val ? "text-stone-700 font-medium" : "text-stone-400"}`}>
                        {label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tech stack */}
            {techStack && (techStack.dnsHost ?? techStack.hosting ?? techStack.cms ?? techStack.emailProvider) && (
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Tech Stack
                </p>
                {(techStack.dnsHost ?? techStack.hosting) && (
                  <p className="text-xs text-stone-600">
                    <span className="text-stone-400">Hosting:</span>{" "}
                    <strong>{techStack.dnsHost ?? techStack.hosting}</strong>
                  </p>
                )}
                {techStack.emailProvider && (
                  <p className="text-xs text-stone-600 mt-1">
                    <span className="text-stone-400">Email:</span>{" "}
                    <strong>{techStack.emailProvider}</strong>
                  </p>
                )}
                {techStack.cms && techStack.cms !== (techStack.dnsHost ?? techStack.hosting) && (
                  <p className="text-xs text-stone-600 mt-1">
                    <span className="text-stone-400">CMS:</span>{" "}
                    <strong>{techStack.cms}</strong>
                  </p>
                )}
              </div>
            )}

            {/* Pains */}
            {prospect.inferredPains.length > 0 && (
              <div className="bg-white border border-stone-200 rounded-xl p-4">
                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Inferred Pains
                </p>
                <ul className="space-y-1.5">
                  {prospect.inferredPains.map((p, i) => (
                    <li key={i} className="text-xs text-stone-600 flex items-start gap-1.5">
                      <span className="text-amber-500 mt-0.5 shrink-0">·</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right: product selection */}
          <div className="col-span-3">
            <form action={generateDeckAction}>
              <input type="hidden" name="prospectId" value={prospect.id} />

              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
                Select Products to Pitch
              </p>

              <ProductGroups grouped={grouped} />

              <div className="flex items-center gap-4 mt-6">
                <GenerateButton />
                <Link
                  href="/dashboard"
                  className="text-sm text-stone-400 hover:text-stone-700 transition-colors"
                >
                  Skip for now
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
