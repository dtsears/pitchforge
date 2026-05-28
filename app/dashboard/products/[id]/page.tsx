import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProductForm } from "../product-form";
import { updateProduct } from "@/app/actions/upsert-product";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function EditProductPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const product = await db.product.findUnique({
    where: { id: params.id },
  });

  if (!product) notFound();

  const blocks = product.slideContentBlocks as Record<string, unknown>;
  const bulletsRaw = blocks.bullets as string[] | undefined;

  const action = updateProduct.bind(null, params.id);

  return (
    <main className="min-h-full bg-stone-50">
      <div className="max-w-2xl mx-auto px-6 py-10">
        <Link
          href="/dashboard/products"
          className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Products
        </Link>
        <h1 className="text-display text-3xl font-semibold text-stone-900 mb-8">
          Edit Product
        </h1>
        <ProductForm
          action={action}
          submitLabel="Save Changes"
          defaultValues={{
            name: product.name,
            description: product.description,
            targetBuyerProfile: product.targetBuyerProfile,
            headline: (blocks.headline as string) ?? "",
            bullets: bulletsRaw?.join("\n") ?? "",
            proof: (blocks.proof as string) ?? "",
          }}
        />
      </div>
    </main>
  );
}
