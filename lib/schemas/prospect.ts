import { z } from "zod";

export const ExtractedProspectSchema = z.object({
  companyName: z.string(),
  tagline: z.string().nullish().transform(v => v ?? undefined),
  industry: z.string().nullish().transform(v => v ?? undefined),
  logoUrl: z.string().nullish().transform(v => v ?? undefined),
  primaryColor: z.string().nullish().transform(v => v ?? undefined),
  accentColor: z.string().nullish().transform(v => v ?? undefined),
  inferredPains: z.array(z.string()),
  confidence: z.number().min(0).max(1),
});

export type ExtractedProspect = z.infer<typeof ExtractedProspectSchema>;

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
});

export type ProspectFormData = z.infer<typeof ProspectFormSchema>;
