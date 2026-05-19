import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ProspectForm } from "./prospect-form";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

// Allow up to 30s for Browserless + Claude extraction
export const maxDuration = 30;

export default async function NewProspectPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  return (
    <main className="min-h-screen bg-stone-50">
      <header className="border-b border-stone-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="text-display font-semibold text-stone-900">
            PitchForge
          </span>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-6 py-10">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <h1 className="text-display text-3xl font-semibold text-stone-900 mb-1">
            New Prospect
          </h1>
          <p className="text-stone-500 text-sm">
            Enter a URL and we&apos;ll import their brand data automatically.
          </p>
        </div>

        <ProspectForm />
      </div>
    </main>
  );
}
