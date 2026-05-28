"use server";

import { revalidatePath } from "next/cache";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

export async function saveBrandGuide(formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const url = (formData.get("url") as string | null)?.trim() || null;

  await db.organization.update({
    where: { domain: "bluehost.com" },
    data: { brandGuideUrl: url },
  });

  revalidatePath("/dashboard/brand");
}
