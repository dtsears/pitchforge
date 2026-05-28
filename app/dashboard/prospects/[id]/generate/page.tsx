import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateDeckAction } from "@/app/actions/generate-deck";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GenerateButton } from "./generate-button";

export const maxDuration = 60;

export default async function GeneratePage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const [prospect, products] = await Promise.all([
    db.prospect.findUnique({ where: { id: params.id } }),
    db.product.findMany({
      where: { org: { domain: "bluehost.com" } },
      orderBy: { name: "asc" },
    }),
  ]);

  if (!prospect) notFound();

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

        <div className="mb-8">
          <p className="text-xs font-semibold text-amber-600 uppercase tracking-wider mb-1">
            Prospect saved
          </p>
          <h1 className="text-display text-3xl font-semibold text-stone-900 mb-1">
            Generate a deck for {prospect.companyName}
          </h1>
          <p className="text-stone-500 text-sm">
            Select the Bluehost products that best fit this prospect. Claude
            will write all 8 slides.
          </p>
        </div>

        <form action={generateDeckAction}>
          <input type="hidden" name="prospectId" value={prospect.id} />

          {/* Prospect summary */}
          <div className="mb-8 p-4 bg-white border border-stone-200 rounded-xl">
            <div className="flex items-start gap-3">
              {prospect.primaryColor && (
                <div
                  className="w-10 h-10 rounded-lg shrink-0 border border-stone-100 mt-0.5"
                  style={{ backgroundColor: prospect.primaryColor }}
                />
              )}
              <div>
                <p className="font-medium text-stone-900">
                  {prospect.companyName}
                </p>
                <p className="text-xs text-stone-400 mt-0.5">
                  {prospect.industry && `${prospect.industry} · `}
                  {prospect.websiteUrl}
                </p>
                {prospect.inferredPains.length > 0 && (
                  <p className="text-xs text-stone-500 mt-1.5">
                    Pains: {prospect.inferredPains.slice(0, 2).join(" · ")}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Product selection */}
          <h2 className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
            Select products to pitch
          </h2>
          <div className="grid grid-cols-1 gap-3 mb-8">
            {products.map((product) => (
              <label
                key={product.id}
                className="flex items-start gap-4 p-4 bg-white border border-stone-200 rounded-xl cursor-pointer hover:border-stone-400 transition-colors has-[:checked]:border-stone-900 has-[:checked]:bg-stone-50"
              >
                <input
                  type="checkbox"
                  name="productIds"
                  value={product.id}
                  className="mt-1 accent-stone-900"
                />
                <div>
                  <p className="text-sm font-medium text-stone-900">
                    {product.name}
                  </p>
                  <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                    {product.description}
                  </p>
                </div>
              </label>
            ))}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
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
    </main>
  );
}
