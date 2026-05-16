import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { LogoutButton } from "./logout-button";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: { name: true, title: true, org: { select: { name: true } } },
  });

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-display font-semibold text-stone-900">
            PitchForge
          </span>
          <LogoutButton />
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-16">
        <h1 className="text-display text-4xl font-semibold text-stone-900 mb-2">
          Hello, {user?.name ?? session.user.name ?? "there"}.
        </h1>
        <p className="text-stone-500">
          {user?.title ?? "Account Executive"}
          {user?.org ? ` · ${user.org.name}` : ""}
        </p>
      </div>
    </main>
  );
}
