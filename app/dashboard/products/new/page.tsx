import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { ProductForm } from "../product-form";
import { createProduct } from "@/app/actions/upsert-product";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default async function NewProductPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

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
          Add Product
        </h1>
        <ProductForm action={createProduct} submitLabel="Add Product" />
      </div>
    </main>
  );
}
