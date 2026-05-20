import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { SlidePreview } from "@/app/dashboard/decks/[id]/slide-preview";
import { PublicDeckViewer } from "./public-deck-viewer";

export default async function PublicDeckPage({
  params,
}: {
  params: { slug: string };
}) {
  const deck = await db.deck.findUnique({
    where: { publicSlug: params.slug },
    include: {
      prospect: {
        select: {
          companyName: true,
          primaryColor: true,
          accentColor: true,
          logoUrl: true,
        },
      },
      user: {
        select: { name: true, title: true },
      },
      org: {
        select: { name: true, primaryColor: true, logoUrl: true },
      },
      slides: { orderBy: { order: "asc" } },
    },
  });

  if (!deck) notFound();

  // Log the view (fire and forget)
  db.deckView
    .create({
      data: {
        deckId: deck.id,
        slideEngagement: {},
      },
    })
    .catch(() => {}); // non-blocking

  return <PublicDeckViewer deck={deck} />;
}
