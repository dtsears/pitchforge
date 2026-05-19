import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoutButton } from "./logout-button";
import Link from "next/link";
import { Plus, Building2, Globe } from "lucide-react";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [user, prospects] = await Promise.all([
    db.user.findUnique({
      where: { email: session.user.email! },
      select: {
        name: true,
        title: true,
        org: { select: { name: true, primaryColor: true, accentColor: true, logoUrl: true } },
      },
    }),
    db.prospect.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        companyName: true,
        industry: true,
        websiteUrl: true,
        contactName: true,
        primaryColor: true,
        createdAt: true,
      },
    }),
  ]);

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-display font-semibold text-stone-900">
            PitchForge
          </span>

          {/* Org badge */}
          {user?.org && (
            <div className="flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-stone-50">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: user.org.primaryColor ?? "#003087" }}
              />
              <span className="text-xs font-medium text-stone-600">
                {user.org.name}
              </span>
            </div>
          )}

          <LogoutButton />
        </div>
      </header>

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

        {/* Prospects section */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-stone-900 uppercase tracking-wider">
            Prospects
          </h2>
          <Link
            href="/dashboard/new-prospect"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            New Prospect
          </Link>
        </div>

        {prospects.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="divide-y divide-stone-100 border border-stone-200 rounded-xl bg-white overflow-hidden">
            {prospects.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-4 px-5 py-4 hover:bg-stone-50 transition-colors"
              >
                {/* Color swatch */}
                <div
                  className="w-8 h-8 rounded-lg shrink-0 border border-stone-100"
                  style={{
                    backgroundColor: p.primaryColor ?? "#e7e5e4",
                  }}
                />
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
                        {new URL(p.websiteUrl).hostname}
                      </>
                    )}
                  </p>
                </div>
                {p.contactName && (
                  <span className="text-xs text-stone-400 shrink-0">
                    {p.contactName}
                  </span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

function EmptyState() {
  return (
    <div className="border border-dashed border-stone-200 rounded-xl bg-white px-8 py-14 text-center">
      <p className="text-sm font-medium text-stone-900 mb-1">
        No prospects yet
      </p>
      <p className="text-xs text-stone-400">
        Add your first prospect to start generating decks.
      </p>
    </div>
  );
}
