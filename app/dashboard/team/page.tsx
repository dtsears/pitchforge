import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { CopyInviteButton } from "./copy-invite-button";
import { Users } from "lucide-react";

export default async function TeamPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: { orgId: true },
  });

  const members = user?.orgId
    ? await db.user.findMany({
        where: { orgId: user.orgId },
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          name: true,
          title: true,
          email: true,
          image: true,
          headshotUrl: true,
          createdAt: true,
          _count: { select: { scannedProspects: true, decks: true } },
        },
      })
    : [];

  const appUrl =
    process.env.NEXTAUTH_URL ?? "https://pitchforge-pi.vercel.app";

  return (
    <main className="min-h-full bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-display text-3xl font-semibold text-stone-900 mb-1">
              Team
            </h1>
            <p className="text-stone-500 text-sm">
              {members.length} member{members.length !== 1 ? "s" : ""} in your
              org
            </p>
          </div>
          <CopyInviteButton url={appUrl} />
        </div>

        {/* Invite info */}
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6 text-xs text-amber-700 leading-relaxed">
          <strong>How invites work:</strong> Anyone who signs in with their
          Newfold Google Workspace account (@newfold.com) is automatically added
          to your team. Share the link above and have them sign in.
        </div>

        {/* Members list */}
        <div className="space-y-2">
          {members.map((m) => (
            <div
              key={m.id}
              className="flex items-center gap-4 bg-white border border-stone-200 rounded-xl px-5 py-4"
            >
              {/* Avatar */}
              <div className="shrink-0">
                {m.headshotUrl || m.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={m.headshotUrl ?? m.image ?? ""}
                    alt={m.name ?? ""}
                    className="w-9 h-9 rounded-full object-cover border border-stone-200"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-stone-200 flex items-center justify-center text-stone-500 text-sm font-semibold">
                    {m.name?.[0] ?? "?"}
                  </div>
                )}
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-stone-900">
                  {m.name ?? m.email}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">{m.title ?? "Account Executive"}</p>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-4 text-xs text-stone-400 shrink-0">
                <span>
                  <strong className="text-stone-700">
                    {m._count.scannedProspects}
                  </strong>{" "}
                  prospects
                </span>
                <span>
                  <strong className="text-stone-700">{m._count.decks}</strong>{" "}
                  decks
                </span>
              </div>

              {m.email === session.user.email && (
                <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider shrink-0">
                  You
                </span>
              )}
            </div>
          ))}
        </div>

        {members.length === 0 && (
          <div className="text-center py-14 text-stone-400 text-sm">
            <Users className="w-8 h-8 mx-auto mb-3 opacity-30" />
            No team members yet. Share the invite link above.
          </div>
        )}
      </div>
    </main>
  );
}
