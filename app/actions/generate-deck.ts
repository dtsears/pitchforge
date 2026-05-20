"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { generateDeck } from "@/lib/generate-deck";
import { randomUUID } from "crypto";

export async function generateDeckAction(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const prospectId = formData.get("prospectId") as string;
  const productIds = formData.getAll("productIds") as string[];

  if (!prospectId || productIds.length === 0) {
    throw new Error("Prospect and at least one product are required.");
  }

  // Fetch all needed data in parallel
  const [prospect, products, rep, org] = await Promise.all([
    db.prospect.findUniqueOrThrow({ where: { id: prospectId } }),
    db.product.findMany({ where: { id: { in: productIds } } }),
    db.user.findUniqueOrThrow({
      where: { email: session.user.email! },
      select: {
        id: true,
        name: true,
        title: true,
        tenureYears: true,
        bio: true,
        specialties: true,
        orgId: true,
      },
    }),
    db.organization.findFirstOrThrow({ where: { domain: "bluehost.com" } }),
  ]);

  // Find the best-matching case study
  const caseStudy = await db.caseStudy.findFirst({
    where: {
      orgId: org.id,
      OR: [
        { industry: { equals: prospect.industry ?? "", mode: "insensitive" } },
        { productsTagged: { hasSome: products.map((p) => p.name) } },
      ],
    },
  }) ?? await db.caseStudy.findFirst({ where: { orgId: org.id } });

  // Call Claude Sonnet
  const slides = await generateDeck({
    prospect: {
      companyName: prospect.companyName,
      websiteUrl: prospect.websiteUrl,
      industry: prospect.industry,
      tagline: prospect.tagline,
      inferredPains: prospect.inferredPains,
      primaryColor: prospect.primaryColor,
      accentColor: prospect.accentColor,
      logoUrl: prospect.logoUrl,
    },
    rep: {
      name: rep.name ?? "Your Rep",
      title: rep.title ?? "Account Executive",
      tenureYears: rep.tenureYears,
      bio: rep.bio,
      specialties: rep.specialties,
    },
    products: products.map((p) => ({
      name: p.name,
      description: p.description,
      slideContentBlocks: p.slideContentBlocks,
    })),
    caseStudy: caseStudy
      ? {
          title: caseStudy.title,
          industry: caseStudy.industry,
          headlineMetric: caseStudy.headlineMetric,
          narrative: caseStudy.narrative,
          customerName: caseStudy.customerName,
          customerTitle: caseStudy.customerTitle,
          productsTagged: caseStudy.productsTagged,
          sourceUrl: caseStudy.sourceUrl,
        }
      : null,
    org: {
      name: org.name,
      primaryColor: org.primaryColor,
      accentColor: org.accentColor,
    },
  });

  // Create Deck + Slides in DB
  const deck = await db.deck.create({
    data: {
      orgId: org.id,
      userId: rep.id,
      prospectId,
      publicSlug: randomUUID(),
      slides: {
        create: slides.map((s) => ({
          type: s.type,
          order: s.order,
          content: s.content,
        })),
      },
    },
  });

  redirect(`/dashboard/decks/${deck.id}`);
}
