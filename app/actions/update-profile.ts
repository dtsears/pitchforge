"use server";

import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { z } from "zod";

const ProfileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  title: z.string().optional(),
  tenureYears: z.coerce.number().int().min(0).max(50).optional(),
  bio: z.string().optional(),
  headshotUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  specialties: z.string().optional(), // comma-separated
});

export async function updateProfile(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const raw = ProfileSchema.safeParse({
    name: formData.get("name"),
    title: formData.get("title") || undefined,
    tenureYears: formData.get("tenureYears") || undefined,
    bio: formData.get("bio") || undefined,
    headshotUrl: formData.get("headshotUrl") || undefined,
    specialties: formData.get("specialties") || undefined,
  });

  if (!raw.success) {
    throw new Error(raw.error.issues[0].message);
  }

  const { specialties, ...rest } = raw.data;
  const specialtiesArray = specialties
    ? specialties.split(",").map((s) => s.trim()).filter(Boolean)
    : undefined;

  await db.user.update({
    where: { email: session.user.email! },
    data: {
      ...rest,
      ...(specialtiesArray !== undefined && { specialties: specialtiesArray }),
    },
  });

  redirect("/dashboard");
}
