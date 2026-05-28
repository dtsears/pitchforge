"use server";

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function toggleFavoriteProduct(productId: string): Promise<boolean> {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: { id: true },
  });
  if (!user) redirect("/login");

  const existing = await db.userProductFavorite.findUnique({
    where: { userId_productId: { userId: user.id, productId } },
  });

  if (existing) {
    await db.userProductFavorite.delete({
      where: { userId_productId: { userId: user.id, productId } },
    });
    return false; // now unfavorited
  } else {
    await db.userProductFavorite.create({
      data: { userId: user.id, productId },
    });
    return true; // now favorited
  }
}
