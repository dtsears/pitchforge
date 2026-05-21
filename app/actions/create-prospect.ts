"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ProspectFormSchema } from "@/lib/schemas/prospect";

export async function createProspect(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  // Parse JSON blobs passed as hidden fields
  const parseJson = (key: string) => {
    const val = formData.get(key);
    if (!val || val === "") return undefined;
    try { return JSON.parse(val as string); } catch { return undefined; }
  };

  const raw = ProspectFormSchema.safeParse({
    companyName: formData.get("companyName"),
    websiteUrl: formData.get("websiteUrl"),
    tagline: formData.get("tagline") || undefined,
    industry: formData.get("industry") || undefined,
    contactName: formData.get("contactName") || undefined,
    contactEmail: formData.get("contactEmail") || undefined,
    contactTitle: formData.get("contactTitle") || undefined,
    notes: formData.get("notes") || undefined,
    logoUrl: formData.get("logoUrl") || undefined,
    primaryColor: formData.get("primaryColor") || undefined,
    accentColor: formData.get("accentColor") || undefined,
    inferredPains: formData.getAll("inferredPains").map(String),
    topOfferings: parseJson("topOfferings"),
    signals: parseJson("signals"),
    techStack: parseJson("techStack"),
  });

  if (!raw.success) {
    throw new Error(raw.error.issues[0].message);
  }

  const prospect = await db.prospect.create({ data: raw.data });

  redirect(`/dashboard/prospects/${prospect.id}/generate`);
}
