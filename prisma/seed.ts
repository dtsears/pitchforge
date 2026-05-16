import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required");

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

async function main() {
  // ─── Organization: Bluehost ───────────────────────────────────────────────
  const bluehost = await prisma.organization.upsert({
    where: { domain: "bluehost.com" },
    update: {},
    create: {
      name: "Bluehost",
      primaryColor: "#003087",
      accentColor: "#0057B8",
      logoUrl: "https://www.bluehost.com/favicon-32x32.png",
      domain: "bluehost.com",
    },
  });

  console.log(`✓ Organization: ${bluehost.name} (${bluehost.id})`);

  // ─── User: Devin Martinez, Senior AE ──────────────────────────────────────
  const devin = await prisma.user.upsert({
    where: { email: "devin.sears@newfold.com" },
    update: {},
    create: {
      email: "devin.sears@newfold.com",
      name: "Devin Sears",
      title: "Senior Account Executive",
      tenureYears: 4,
      bio: "Focused on WordPress, WooCommerce, and Agency partnerships. 4 years helping small businesses and agencies grow on Bluehost.",
      specialties: ["WordPress Pro", "WooCommerce", "Agency Partner Program"],
      orgId: bluehost.id,
    },
  });

  console.log(`✓ User: ${devin.name} (${devin.email})`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
