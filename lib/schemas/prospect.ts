import { z } from "zod";

// ─── Sub-schemas for enriched scrape data ─────────────────────────────────

export const OfferingSchema = z.object({
  name: z.string(),
  fitScore: z.number().min(0).max(100),
  fitReason: z.string(),
});

export const SignalsSchema = z.object({
  websiteMaintenance: z.boolean(),
  aiMentioned: z.boolean(),
  webDevelopment: z.boolean(),
  seoMentioned: z.boolean(),
});

export const TechStackSchema = z.object({
  hosting: z.string().nullish().transform((v) => v ?? null),
  cms: z.string().nullish().transform((v) => v ?? null),
  detected: z.array(z.string()),
});

export type Offering = z.infer<typeof OfferingSchema>;
export type Signals = z.infer<typeof SignalsSchema>;
export type TechStack = z.infer<typeof TechStackSchema>;

// ─── Full extracted prospect schema ───────────────────────────────────────

export const ExtractedProspectSchema = z.object({
  companyName: z.string(),
  tagline: z.string().nullish().transform((v) => v ?? undefined),
  industry: z.string().nullish().transform((v) => v ?? undefined),
  logoUrl: z.string().nullish().transform((v) => v ?? undefined),
  primaryColor: z.string().nullish().transform((v) => v ?? undefined),
  accentColor: z.string().nullish().transform((v) => v ?? undefined),
  inferredPains: z.array(z.string()),
  topOfferings: z.array(OfferingSchema).optional(),
  signals: SignalsSchema.optional(),
  techStack: TechStackSchema.optional(),
  confidence: z.number().min(0).max(1),
});

export type ExtractedProspect = z.infer<typeof ExtractedProspectSchema>;

// ─── Form schema (what gets saved to DB) ──────────────────────────────────

export const ProspectFormSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  websiteUrl: z.string().url("Must be a valid URL"),
  tagline: z.string().optional(),
  industry: z.string().optional(),
  contactName: z.string().optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  contactTitle: z.string().optional(),
  notes: z.string().optional(),
  logoUrl: z.string().optional(),
  primaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  inferredPains: z.array(z.string()).optional(),
  topOfferings: z.any().optional(),
  signals: z.any().optional(),
  techStack: z.any().optional(),
});

export type ProspectFormData = z.infer<typeof ProspectFormSchema>;
