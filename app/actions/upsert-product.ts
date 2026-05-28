"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const ProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  targetBuyerProfile: z.string().min(1),
  headline: z.string().optional(),
  bullets: z.string().optional(), // newline-separated
  proof: z.string().optional(),
});

function buildBlocks(data: z.infer<typeof ProductSchema>) {
  return {
    headline: data.headline ?? "",
    bullets: data.bullets
      ? data.bullets.split("\n").map((b) => b.trim()).filter(Boolean)
      : [],
    proof: data.proof ?? "",
  };
}

export async function createProduct(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const raw = ProductSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    targetBuyerProfile: formData.get("targetBuyerProfile"),
    headline: formData.get("headline") || undefined,
    bullets: formData.get("bullets") || undefined,
    proof: formData.get("proof") || undefined,
  });

  const org = await db.organization.findFirstOrThrow({
    where: { domain: "bluehost.com" },
  });

  await db.product.create({
    data: {
      orgId: org.id,
      name: raw.name,
      description: raw.description,
      targetBuyerProfile: raw.targetBuyerProfile,
      slideContentBlocks: buildBlocks(raw),
    },
  });
}

export async function updateProduct(productId: string, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const raw = ProductSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    targetBuyerProfile: formData.get("targetBuyerProfile"),
    headline: formData.get("headline") || undefined,
    bullets: formData.get("bullets") || undefined,
    proof: formData.get("proof") || undefined,
  });

  await db.product.update({
    where: { id: productId },
    data: {
      name: raw.name,
      description: raw.description,
      targetBuyerProfile: raw.targetBuyerProfile,
      slideContentBlocks: buildBlocks(raw),
    },
  });
}
