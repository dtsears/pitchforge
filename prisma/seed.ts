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

  // ─── User: Devin Sears, Senior AE ────────────────────────────────────────
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

  // ─── Products ─────────────────────────────────────────────────────────────
  const products = [
    {
      name: "WordPress Pro",
      description:
        "Managed WordPress hosting built for performance. Includes automatic updates, daily backups, staging environments, and a dedicated WordPress support team.",
      targetBuyerProfile:
        "Small businesses and bloggers who want a reliable, hands-off WordPress experience without managing a server.",
      slideContentBlocks: {
        headline: "Managed WordPress — Zero Headaches",
        bullets: [
          "Automatic core, plugin & theme updates",
          "Daily backups with one-click restore",
          "Staging environment for safe testing",
          "Expert WordPress support 24/7",
        ],
        proof: "99.9% uptime SLA",
      },
    },
    {
      name: "Cloud Hosting",
      description:
        "Scalable cloud infrastructure that grows with your traffic. Resources scale automatically during peaks — pay for what you use, never over-provision.",
      targetBuyerProfile:
        "Growing businesses that experience traffic spikes and need reliability without managing infrastructure.",
      slideContentBlocks: {
        headline: "Cloud Hosting That Scales With You",
        bullets: [
          "Auto-scaling resources during traffic spikes",
          "SSD storage for 3x faster load times",
          "Free CDN with 200+ global edge nodes",
          "Resource monitoring dashboard included",
        ],
        proof: "3x faster than shared hosting",
      },
    },
    {
      name: "Agency Partner Program",
      description:
        "White-label hosting and reseller tools for agencies managing multiple client sites. Includes a central dashboard, client billing, and priority support.",
      targetBuyerProfile:
        "Digital agencies and freelancers who manage 5+ client websites and need centralized control, white-label options, and margin on hosting.",
      slideContentBlocks: {
        headline: "One Dashboard. Every Client Site.",
        bullets: [
          "Manage unlimited client sites from one login",
          "White-label the control panel with your brand",
          "Wholesale pricing — resell at your margin",
          "Priority 24/7 phone & chat support",
        ],
        proof: "Agency partners average 35% hosting margin",
      },
    },
    {
      name: "AI Site Creator",
      description:
        "Build a professional website in minutes using AI. Answer a few questions about your business and AI generates a complete, mobile-optimized site with copy, images, and structure.",
      targetBuyerProfile:
        "Small business owners with no technical background who need a professional web presence quickly and affordably.",
      slideContentBlocks: {
        headline: "Professional Website in Under an Hour",
        bullets: [
          "AI generates copy, layout, and images automatically",
          "Mobile-optimized from day one",
          "No designer or developer required",
          "Includes free domain for the first year",
        ],
        proof: "Average launch time: 47 minutes",
      },
    },
    {
      name: "WooCommerce Hosting",
      description:
        "Hosting optimized for WooCommerce stores. Pre-configured for e-commerce with built-in caching, automatic plugin updates, and PCI-compliant infrastructure.",
      targetBuyerProfile:
        "E-commerce businesses running WooCommerce who need fast page loads, high availability, and a hosting partner that understands online retail.",
      slideContentBlocks: {
        headline: "WooCommerce Hosting Built for Sales",
        bullets: [
          "Pre-configured WooCommerce environment",
          "PCI-compliant infrastructure for payments",
          "Built-in caching for fast product pages",
          "Automatic WooCommerce + plugin updates",
        ],
        proof: "Average 40% improvement in checkout speed",
      },
    },
    {
      name: "VPS Hosting",
      description:
        "Full root access, dedicated resources, and complete control. Ideal for developers who need a customizable environment without the cost of a dedicated server.",
      targetBuyerProfile:
        "Developers and technical teams who need dedicated resources, custom software stacks, and root server access.",
      slideContentBlocks: {
        headline: "Your Server. Your Rules.",
        bullets: [
          "Full root access and sudo privileges",
          "Dedicated CPU and RAM — no shared resources",
          "Choice of OS: Ubuntu, CentOS, Debian",
          "Scalable storage up to 240GB SSD",
        ],
        proof: "Deploy in under 60 seconds",
      },
    },
  ];

  for (const p of products) {
    const product = await prisma.product.upsert({
      where: {
        id: (
          await prisma.product
            .findFirst({ where: { name: p.name, orgId: bluehost.id } })
            .then((r) => r ?? { id: "new" })
        ).id,
      },
      update: {},
      create: { ...p, orgId: bluehost.id },
    });
    console.log(`✓ Product: ${product.name}`);
  }

  // ─── Case Studies ─────────────────────────────────────────────────────────
  const caseStudies = [
    {
      title: "How Surf & Sand Boutique Cut Load Time in Half",
      industry: "E-commerce",
      companySize: "SMB",
      useCase: "WooCommerce store migration and performance optimization",
      productsTagged: ["WooCommerce Hosting"],
      headlineMetric: "48% faster checkout, 31% increase in conversions",
      narrative:
        "Surf & Sand Boutique was losing customers at checkout — their shared hosting couldn't handle the holiday traffic spikes that doubled their usual volume. After migrating to Bluehost WooCommerce Hosting, their checkout page load time dropped from 4.2s to 2.1s, and their abandoned cart rate fell by 28%. The first holiday season post-migration was their biggest ever.",
      customerName: "Maria Chen",
      customerTitle: "Owner, Surf & Sand Boutique",
    },
    {
      title: "Anchor Digital Scales to 60 Client Sites Without Adding Headcount",
      industry: "Agency",
      companySize: "SMB",
      useCase: "Agency dashboard for multi-client site management",
      productsTagged: ["Agency Partner Program", "WordPress Pro"],
      headlineMetric: "60 client sites managed by a team of 3",
      narrative:
        "Anchor Digital was drowning in logins — a different hosting account for every client, no central billing, no unified support. After joining the Bluehost Agency Partner Program, they consolidated everything into a single dashboard. They reduced site management overhead by 40% and now resell hosting at a 38% margin, adding $2,400/month in recurring revenue.",
      customerName: "James Okafor",
      customerTitle: "Founder, Anchor Digital",
    },
    {
      title: "Mesa Verde Restaurant Group Launches 5 Sites in One Afternoon",
      industry: "Restaurant",
      companySize: "SMB",
      useCase: "AI Site Creator for multi-location restaurant brand",
      productsTagged: ["AI Site Creator", "WordPress Pro"],
      headlineMetric: "5 location sites live in 4 hours",
      narrative:
        "Mesa Verde had five locations and zero web presence. Their marketing coordinator had no development background. Using Bluehost's AI Site Creator, she built and launched five branded restaurant sites — complete with menus, reservation links, and Google Maps integration — in a single afternoon. Within 60 days, organic search traffic drove a 22% increase in reservations.",
      customerName: "Sofia Reyes",
      customerTitle: "Marketing Coordinator, Mesa Verde Restaurant Group",
    },
    {
      title: "Brightpath SaaS Eliminates $800/Month in Server Costs",
      industry: "SaaS",
      companySize: "SMB",
      useCase: "Cloud hosting migration from over-provisioned dedicated server",
      productsTagged: ["Cloud Hosting", "VPS Hosting"],
      headlineMetric: "$800/month saved, zero performance degradation",
      narrative:
        "Brightpath had been paying for a dedicated server to handle occasional traffic spikes. 90% of the time, they were using 20% of their capacity. After switching to Bluehost Cloud Hosting, their auto-scaling infrastructure handled the same peaks at a fraction of the cost. Their CTO called it 'the easiest infrastructure win we've ever had.'",
      customerName: "Derek Huang",
      customerTitle: "CTO, Brightpath",
    },
    {
      title: "Lawson & Partners Law Firm Rebuilds Online Presence in a Weekend",
      industry: "Professional Services",
      companySize: "SMB",
      useCase: "WordPress Pro migration from slow, outdated shared hosting",
      productsTagged: ["WordPress Pro"],
      headlineMetric: "Page speed score improved from 41 to 89",
      narrative:
        "Lawson & Partners had a WordPress site that took over 6 seconds to load — killing their Google Ads quality score and costing them leads. After migrating to Bluehost WordPress Pro, their average page load dropped to 1.8 seconds. Their Google Ads cost-per-click fell 34% as quality scores improved, and contact form submissions increased by 55% within 90 days.",
      customerName: "Patricia Lawson",
      customerTitle: "Managing Partner, Lawson & Partners",
    },
  ];

  for (const cs of caseStudies) {
    const existing = await prisma.caseStudy.findFirst({
      where: { title: cs.title, orgId: bluehost.id },
    });
    if (!existing) {
      await prisma.caseStudy.create({ data: { ...cs, orgId: bluehost.id } });
    }
    console.log(`✓ Case study: ${cs.title.slice(0, 50)}…`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
