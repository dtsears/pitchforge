import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Sidebar } from "@/components/sidebar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/login");

  const user = await db.user.findUnique({
    where: { email: session.user.email! },
    select: {
      name: true,
      org: { select: { name: true, primaryColor: true } },
    },
  });

  return (
    <div className="flex h-screen bg-stone-50 overflow-hidden">
      <Sidebar
        userName={user?.name ?? session.user.name}
        orgName={user?.org?.name}
        orgColor={user?.org?.primaryColor}
      />
      <div className="flex-1 overflow-auto min-w-0">{children}</div>
    </div>
  );
}
