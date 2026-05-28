"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function deleteProspect(prospectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Delete decks + slides (cascade) then the prospect
  await db.deck.deleteMany({ where: { prospectId } });
  await db.prospect.delete({ where: { id: prospectId } });

  revalidatePath("/dashboard");
}
