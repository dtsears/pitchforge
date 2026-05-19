import { z } from "zod";

// ─── Slide content schemas (one per slide type) ───────────────────────────

export const CoverContentSchema = z.object({
  headline: z.string(),
  subheadline: z.string(),
});

export const RepContentSchema = z.object({
  name: z.string(),
  title: z.string(),
  tenureYears: z.number(),
  bio: z.string(),
  specialties: z.array(z.string()),
});

export const UnderstandingContentSchema = z.object({
  title: z.string(),
  painPoints: z.array(
    z.object({ headline: z.string(), description: z.string() })
  ),
});

export const WhyNowContentSchema = z.object({
  title: z.string(),
  triggerEvent: z.string(),
  description: z.string(),
  urgencyPoints: z.array(z.string()),
});

export const SolutionContentSchema = z.object({
  title: z.string(),
  intro: z.string(),
  products: z.array(
    z.object({
      name: z.string(),
      description: z.string(),
      benefit: z.string(),
    })
  ),
});

export const ProofContentSchema = z.object({
  title: z.string(),
  customerName: z.string(),
  industry: z.string(),
  headlineMetric: z.string(),
  narrative: z.string(),
  productsUsed: z.array(z.string()),
});

export const RoiContentSchema = z.object({
  title: z.string(),
  metrics: z.array(
    z.object({ label: z.string(), value: z.string(), description: z.string() })
  ),
  summary: z.string(),
});

export const NextStepsContentSchema = z.object({
  title: z.string(),
  steps: z.array(
    z.object({
      action: z.string(),
      owner: z.string(),
      timeline: z.string(),
    })
  ),
  cta: z.string(),
});

export const GeneratedSlideSchema = z.discriminatedUnion("type", [
  z.object({ type: z.literal("COVER"), order: z.number(), content: CoverContentSchema }),
  z.object({ type: z.literal("REP"), order: z.number(), content: RepContentSchema }),
  z.object({ type: z.literal("UNDERSTANDING"), order: z.number(), content: UnderstandingContentSchema }),
  z.object({ type: z.literal("WHY_NOW"), order: z.number(), content: WhyNowContentSchema }),
  z.object({ type: z.literal("SOLUTION"), order: z.number(), content: SolutionContentSchema }),
  z.object({ type: z.literal("PROOF"), order: z.number(), content: ProofContentSchema }),
  z.object({ type: z.literal("ROI"), order: z.number(), content: RoiContentSchema }),
  z.object({ type: z.literal("NEXT_STEPS"), order: z.number(), content: NextStepsContentSchema }),
]);

export const GeneratedDeckSchema = z.array(GeneratedSlideSchema);
export type GeneratedDeck = z.infer<typeof GeneratedDeckSchema>;
export type GeneratedSlide = z.infer<typeof GeneratedSlideSchema>;
