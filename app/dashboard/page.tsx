import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Building2, Globe, Presentation, Send } from "lucide-react";
import { DeleteProspectButton } from "./delete-prospect-button";

function safeHostname(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: { view?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const viewMine = searchParams.view !== "all";

  const [user, prospects] = await Promise.all([
    db.user.findUnique({
      where: { email: session.user.email! },
      select: { id: true, name: true, title: true, org: { select: { name: true } } },
    }),
    db.prospect.findMany({
      where: viewMine && session.user.email
        ? {
            scannedBy: { email: session.user.email },
          }
        : undefined,
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        companyName: true,
        industry: true,
        websiteUrl: true,
        contactName: true,
        primaryColor: true,
        createdAt: true,
        scannedBy: { select: { name: true } },
        // Fetch up to 10 decks — count locally to avoid _count+select issues in Prisma 7
        decks: {
          select: { id: true, publicSlug: true },
          orderBy: { createdAt: "desc" },
          take: 10,
        },
      },
    }),
  ]);

  return (
    <main className="min-h-full bg-stone-50">
      <div className="max-w-5xl mx-auto px-6 py-10">
        {/* Greeting */}
        <div className="mb-10">
          <h1 className="text-display text-4xl font-semibold text-stone-900 mb-1">
            Hello, {user?.name ?? session.user.name ?? "there"}.
          </h1>
          <p className="text-stone-500 text-sm">
            {user?.title ?? "Account Executive"}
            {user?.org ? ` · ${user.org.name}` : ""}
          </p>
        </div>

        {/* Prospects header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
              Prospects
            </h2>
            {/* Mine / All toggle */}
            <div className="flex text-xs rounded-lg border border-stone-200 overflow-hidden bg-white">
              <Link
                href="/dashboard"
                className={`px-3 py-1.5 font-medium transition-colors ${
                  viewMine
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                Mine
              </Link>
              <Link
                href="/dashboard?view=all"
                className={`px-3 py-1.5 font-medium transition-colors border-l border-stone-200 ${
                  !viewMine
                    ? "bg-stone-900 text-white"
                    : "text-stone-500 hover:text-stone-900"
                }`}
              >
                All
              </Link>
            </div>
          </div>
          <Link
            href="/dashboard/new-prospect"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Prospect
          </Link>
        </div>

        {/* Prospects list */}
        {prospects.length === 0 ? (
          <EmptyState viewMine={viewMine} />
        ) : (
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl bg-white overflow-hidden">
            {prospects.map((p) => {
              const deck = p.decks[0] ?? null;
              return (
                <div
                  key={p.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors"
                >
                  {/* Color swatch */}
                  <div
                    className="w-8 h-8 rounded-lg shrink-0 border border-stone-100"
                    style={{ backgroundColor: p.primaryColor ?? "#e7e5e4" }}
                  />

                  {/* Prospect info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-stone-900">
                      {p.companyName}
                    </p>
                    <p className="text-xs text-stone-400 mt-0.5 flex items-center gap-1.5">
                      {p.industry && (
                        <>
                          <Building2 className="w-3 h-3" />
                          {p.industry}
                        </>
                      )}
                      {p.industry && p.websiteUrl && (
                        <span className="text-stone-300">·</span>
                      )}
                      {p.websiteUrl && (
                        <>
                          <Globe className="w-3 h-3" />
                          <a
                            href={p.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-stone-700 hover:underline underline-offset-2 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {safeHostname(p.websiteUrl)}
                          </a>
                        </>
                      )}
                    </p>
                  </div>

                  {/* Attribution */}
                  {p.scannedBy?.name && (
                    <span className="text-xs text-stone-400 shrink-0 hidden sm:block">
                      {p.scannedBy.name.split(" ")[0]}
                    </span>
                  )}

                  {/* Actions */}
                  <div className="flex items-center gap-2 shrink-0">
                    {deck ? (
                      <>
                        <Link
                          href={`/dashboard/decks/${deck.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
                        >
                          <Presentation className="w-3 h-3" />
                          View Deck
                        </Link>
                        <Link
                          href={`/dashboard/decks/${deck.id}/send`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-white bg-stone-900 rounded-lg hover:bg-stone-700 transition-colors"
                        >
                          <Send className="w-3 h-3" />
                          Send
                        </Link>
                      </>
                    ) : (
                      <Link
                        href={`/dashboard/prospects/${p.id}/generate`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-stone-600 border border-stone-200 rounded-lg hover:bg-stone-900 hover:text-white hover:border-stone-900 transition-colors"
                      >
                        <Presentation className="w-3 h-3" />
                        Build Deck
                      </Link>
                    )}
                    <DeleteProspectButton
                      prospectId={p.id}
                      deckCount={p.decks.length}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState({ viewMine }: { viewMine: boolean }) {
  return (
    <div className="border border-dashed border-stone-200 rounded-xl bg-white px-8 py-14 text-center">
      <p className="text-sm font-medium text-stone-900 mb-1">
        {viewMine ? "No prospects yet" : "No prospects in your org yet"}
      </p>
      <p className="text-xs text-stone-400">
        {viewMine
          ? "Import your first prospect to start generating decks."
          : `Switch to "Mine" and add your first prospect.`}
      </p>
    </div>
  );
}
