import { getServerSession } from "next-auth";
import { redirect, notFound } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { DeckViewer } from "./deck-viewer";

export default async function DeckPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const deck = await db.deck.findUnique({
    where: { id: params.id },
    include: {
      prospect: true,
      slides: { orderBy: { order: "asc" } },
      user: { select: { name: true } },
    },
  });

  if (!deck) notFound();

  return <DeckViewer deck={deck} />;
}
