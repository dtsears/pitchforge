"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function deleteProspect(prospectId: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Collect deck IDs first so we can delete their dependents
  const decks = await db.deck.findMany({
    where: { prospectId },
    select: { id: true },
  });
  const deckIds = decks.map((d) => d.id);

  if (deckIds.length > 0) {
    // Delete in dependency order — DeckView and Email have no cascade
    await db.deckView.deleteMany({ where: { deckId: { in: deckIds } } });
    await db.email.deleteMany({ where: { deckId: { in: deckIds } } });
    // Slides have onDelete: Cascade but deleteMany is explicit and safe
    await db.slide.deleteMany({ where: { deckId: { in: deckIds } } });
    await db.deck.deleteMany({ where: { id: { in: deckIds } } });
  }

  await db.prospect.delete({ where: { id: prospectId } });

  revalidatePath("/dashboard");
}
