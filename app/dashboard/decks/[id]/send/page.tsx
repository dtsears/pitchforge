import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { SendDeckClient } from "./send-deck-client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function SendDeckPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [deck, rep] = await Promise.all([
    db.deck.findUnique({
      where: { id: params.id },
      include: {
        prospect: {
          select: {
            companyName: true,
            industry: true,
            inferredPains: true,
            contactName: true,
            contactEmail: true,
          },
        },
      },
    }),
    db.user.findUnique({
      where: { email: session.user.email! },
      select: { name: true, title: true },
    }),
  ]);

  if (!deck) notFound();

  const baseUrl =
    process.env.NEXTAUTH_URL ?? "https://pitchforge-pi.vercel.app";
  const deckUrl = `${baseUrl}/d/${deck.publicSlug}`;

  return (
    <main className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            Send Deck
          </p>
          <h1 className="text-display text-3xl font-semibold text-stone-900">
            {deck.prospect.companyName}
          </h1>
        </div>

        <SendDeckClient
          deckUrl={deckUrl}
          repName={rep?.name ?? ""}
          repTitle={rep?.title ?? "Account Executive"}
          prospectCompany={deck.prospect.companyName}
          prospectIndustry={deck.prospect.industry}
          inferredPains={deck.prospect.inferredPains}
          contactName={deck.prospect.contactName}
          contactEmail={deck.prospect.contactEmail ?? ""}
        />
      </div>
    </main>
  );
}
