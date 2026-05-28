import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import Link from "next/link";
import { Plus, Pencil } from "lucide-react";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const products = await db.product.findMany({
    where: { org: { domain: "bluehost.com" } },
    orderBy: { name: "asc" },
    select: {
      id: true,
      name: true,
      description: true,
      targetBuyerProfile: true,
    },
  });

  return (
    <main className="min-h-full bg-stone-50">
      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-display text-3xl font-semibold text-stone-900 mb-1">
              Product Catalogue
            </h1>
            <p className="text-stone-500 text-sm">
              {products.length} products available to pitch
            </p>
          </div>
          <Link
            href="/dashboard/products/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </Link>
        </div>

        <div className="space-y-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="bg-white border border-stone-200 rounded-xl px-5 py-4 flex items-start gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-stone-900 mb-0.5">
                  {p.name}
                </p>
                <p className="text-xs text-stone-500 leading-relaxed mb-2 line-clamp-2">
                  {p.description}
                </p>
                <p className="text-[10px] text-stone-400">
                  Target: {p.targetBuyerProfile}
                </p>
              </div>
              <Link
                href={`/dashboard/products/${p.id}`}
                className="shrink-0 p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition-colors"
                title="Edit"
              >
                <Pencil className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
