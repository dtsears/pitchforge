import { cache } from "react";
import { db } from "@/lib/db";

/**
 * React cache() deduplicates this across layout + page within the same request.
 * Both `app/dashboard/layout.tsx` and `app/dashboard/page.tsx` call this —
 * only one DB round-trip happens per request.
 */
export const getCurrentUser = cache(async (email: string) => {
  return db.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      title: true,
      org: {
        select: { name: true, primaryColor: true, accentColor: true, logoUrl: true },
      },
    },
  });
});
