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
    update: {
      logoUrl: "https://www.bluehost.com/content/dam/bluehost/global/logo/bluehost-logo.svg",
    },
    create: {
      name: "Bluehost",
      primaryColor: "#003087",
      accentColor: "#0057B8",
      logoUrl: "https://www.bluehost.com/content/dam/bluehost/global/logo/bluehost-logo.svg",
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
    // ── Core hosting products (brand voice updated per guidelines) ──────────
    {
      category: "Hosting",
      name: "WordPress Pro",
      description:
        "Fast WordPress hosting, even in traffic spikes. Includes automatic updates, daily backups, staging environments, and 24/7 WordPress expert support. Breathe easier — we handle the technical side.",
      targetBuyerProfile:
        "Small businesses and content creators who want reliable, hands-off WordPress hosting without managing a server.",
      slideContentBlocks: {
        headline: "Fast WordPress Hosting, Even in Traffic Spikes",
        bullets: [
          "Automatic core, plugin, and theme updates",
          "Daily backups with one-click restore",
          "Staging environment for safe testing",
          "24/7 WordPress expert support — phone and chat",
        ],
        proof: "99.9% uptime SLA. Join 5 million+ WordPress users.",
      },
    },
    {
      category: "Hosting",
      name: "Cloud Hosting",
      description:
        "Extra CPU and RAM during traffic spikes — automatically. Scalable cloud infrastructure that grows with your business without manual intervention or over-provisioning.",
      targetBuyerProfile:
        "Growing businesses that experience traffic spikes and need reliability without managing infrastructure.",
      slideContentBlocks: {
        headline: "Extra CPU and RAM During Traffic Spikes",
        bullets: [
          "Auto-scaling resources when traffic surges",
          "SSD storage for ultrafast load times",
          "Free CDN with 200+ global edge nodes",
          "Pay for what you use — never over-provision",
        ],
        proof: "3x faster than shared hosting",
      },
    },
    {
      category: "Agency",
      name: "Agency Partner Program",
      description:
        "Business hosting. Human support. One dashboard for every client site you manage — with white-label options, wholesale pricing, and priority 24/7 phone and chat support.",
      targetBuyerProfile:
        "Digital agencies and freelancers managing 5+ client websites who need centralized control, white-label options, and margin on hosting.",
      slideContentBlocks: {
        headline: "Business Hosting. Human Support.",
        bullets: [
          "Manage every client site from one login",
          "White-label the control panel with your brand",
          "Wholesale pricing — resell at your margin",
          "Priority 24/7 phone and chat support",
        ],
        proof: "Agency partners average 35% hosting margin",
      },
    },
    {
      category: "AI",
      name: "Bluehost AI Builder",
      description:
        "Your website. Built by AI. Backed by Bluehost. From a single prompt or Instagram handle to a fully published, hosted WordPress website — no code, no confusion, no blank page paralysis.",
      targetBuyerProfile:
        "Non-technical small business owners who need a professional WordPress website without hiring a developer or learning to code.",
      slideContentBlocks: {
        headline: "Your Website. Built by AI. Backed by Bluehost.",
        bullets: [
          "From prompt to published website in minutes",
          "AI extracts your brand from Instagram or a text description",
          "Drag-and-drop editor — change anything without code",
          "Backed by 20+ years of WordPress hosting expertise",
        ],
        proof: "43% of the web runs on WordPress. Now anyone can use it.",
      },
    },
    {
      category: "eCommerce",
      name: "WooCommerce Hosting",
      description:
        "Whip up an ultrafast online store. Hosting optimized for WooCommerce with built-in caching, PCI-compliant infrastructure, and automatic plugin updates so you can focus on selling.",
      targetBuyerProfile:
        "eCommerce businesses running WooCommerce who need fast page loads, high availability, and a hosting partner that understands online retail.",
      slideContentBlocks: {
        headline: "Whip Up an Ultrafast Online Store",
        bullets: [
          "Pre-configured WooCommerce environment",
          "PCI-compliant infrastructure for secure payments",
          "Built-in caching for fast product pages",
          "Automatic WooCommerce and plugin updates",
        ],
        proof: "Average 40% improvement in checkout speed",
      },
    },
    {
      category: "Hosting",
      name: "VPS Hosting",
      description:
        "Our VPS hosting. Your tech playground. Full root access, dedicated resources, and complete control — without the cost of a dedicated server.",
      targetBuyerProfile:
        "Developers and technical teams who need dedicated resources, custom software stacks, and root server access.",
      slideContentBlocks: {
        headline: "Our VPS Hosting. Your Tech Playground.",
        bullets: [
          "Full root access and sudo privileges",
          "Dedicated CPU and RAM — no shared resources",
          "Choice of OS: Ubuntu, CentOS, or Debian",
          "Automate any workflow with scalable infrastructure",
        ],
        proof: "Deploy in under 60 seconds",
      },
    },
    // ── New AI-powered products (from brand guide) ──────────────────────────
    {
      category: "AI",
      name: "BLU Agent — AI Front Desk",
      description:
        "Losing leads after closing time? BLU Agent provides 24/7 AI sales support and instant appointment booking across Web, SMS, WhatsApp, and Instagram. Increase revenue without increasing your team.",
      targetBuyerProfile:
        "Service-based businesses with high-inquiry volumes — salons, consultants, medical practices, restaurants — that need 24/7 customer coverage without the cost of round-the-clock staffing.",
      slideContentBlocks: {
        headline: "Never Miss a Lead. Even at 2 AM.",
        bullets: [
          "24/7 AI sales support across Web, SMS, WhatsApp, and Instagram",
          "Google Calendar integration — customers book instantly, no back-and-forth",
          "Trained on your knowledge base, speaks in your brand voice",
          "Handles FAQs and bookings so your team can focus on high-value work",
        ],
        proof: "Capture leads and book appointments while your team sleeps.",
        elevatorPitch: "Losing leads after closing time? BLU provides 24/7 sales support and instant booking across web, SMS, and social. Increase profits without increasing your sales team.",
        whyNow: "Your customers expect instant responses. If you aren't answering their questions and booking their appointments 24/7, your competitors will.",
      },
    },
    {
      category: "AI",
      name: "BLU LLM All-Access",
      description:
        "All your AI favorites — ChatGPT 5, Gemini 3, Claude 4.5, and Grok 4.1 — in one dashboard for $20/month. Stop managing multiple subscriptions. Stop paying $100+ for tools you use separately.",
      targetBuyerProfile:
        "SMBs and agencies currently paying for multiple AI subscriptions who want one unified dashboard with centralized access management and lower costs.",
      slideContentBlocks: {
        headline: "All Your AI Favorites. One Price.",
        bullets: [
          "ChatGPT 5, Gemini 3, Claude 4.5, and Grok 4.1 — one dashboard",
          "Switch models by task: writing, coding, research, creativity",
          "Centralized access management for your whole team",
          "Privacy+ tier: encrypted searches, zero data retention",
        ],
        proof: "$100+ of AI value for $20/month. No analysis paralysis.",
        pricing: {
          basic: "$20/month — Core LLM access + AI Logo Builder",
          privacyPlus: "$25/month — Encrypted searches + AI Logo Builder",
          premium: "$50/month — Secure LLM + premium Bluehost features",
        },
      },
    },
  ];

  for (const p of products) {
    const existing = await prisma.product.findFirst({
      where: { name: p.name, orgId: bluehost.id },
    });
    if (existing) {
      await prisma.product.update({
        where: { id: existing.id },
        data: {
          category: p.category ?? null,
          description: p.description,
          targetBuyerProfile: p.targetBuyerProfile,
          slideContentBlocks: p.slideContentBlocks,
        },
      });
    } else {
      await prisma.product.create({ data: { ...p, orgId: bluehost.id } });
    }
    console.log(`✓ Product: ${p.name}`);
  }

  // ─── Case Studies (real, sourced from bluehost.com/blog) ──────────────────
  const caseStudies: Array<{
    title: string; industry: string; companySize: string; useCase: string;
    productsTagged: string[]; headlineMetric: string; narrative: string;
    customerName?: string; customerTitle?: string; sourceUrl: string;
  }> = [
    {
      title: "Midfield Lavender Farm: 300% Sales Growth with WooCommerce",
      industry: "E-commerce",
      companySize: "SMB",
      useCase: "Farm e-commerce site with WooCommerce for inventory and online sales",
      productsTagged: ["WooCommerce Hosting", "WordPress Pro"],
      headlineMetric: "300% increase in sales over 5 years",
      narrative:
        "What started as a small family retreat became a thriving farm e-commerce business for Jeannie Miller and the Midfield Lavender Farm team. By launching their store on Bluehost with WooCommerce, they were able to easily manage inventory, reach new customers beyond their local area, and grow sales dramatically — proving that even a traditional farm business can scale online with the right hosting foundation.",
      customerName: "Jeannie Miller",
      customerTitle: "Co-Founder, Midfield Lavender Farm",
      sourceUrl: "https://www.bluehost.com/blog/midfield-farm-ecommerce-website/",
    },
    {
      title: "Bare Bakery: How Kelly Bare Doubled Her Traffic with Bluehost",
      industry: "E-commerce",
      companySize: "SMB",
      useCase: "Online bakery store with WooCommerce, streamlined ordering and customer experience",
      productsTagged: ["WooCommerce Hosting", "WordPress Pro"],
      headlineMetric: "Doubled website traffic",
      narrative:
        "Kelly Bare overcame multiple business challenges by building her Bare Bakery site on Bluehost with WooCommerce. The streamlined ordering process transformed how customers interacted with her brand, significantly boosting traffic and making her bakery's online experience as polished as her products. The result was a measurable lift in both sales efficiency and customer satisfaction.",
      customerName: "Kelly Bare",
      customerTitle: "Owner, Bare Bakery",
      sourceUrl: "https://www.bluehost.com/blog/bare-bakery-case-study-how-kelly-bare-doubled-her-traffic-using-bluehost/",
    },
    {
      title: "PageHub: Zero Downtime Across Hundreds of Client Sites",
      industry: "Agency",
      companySize: "SMB",
      useCase: "Multi-site WordPress agency hosting with centralized management",
      productsTagged: ["Agency Partner Program", "WordPress Pro"],
      headlineMetric: "Zero downtime and stronger security across hundreds of client sites",
      narrative:
        "PageHub, a digital marketing agency, was constrained by legacy hosting that couldn't scale with their growing client roster. After migrating to Bluehost's Agency Hosting, they achieved zero downtime and significantly stronger security across all client sites. The operational clarity this provided allowed them to focus on growth rather than firefighting infrastructure issues.",
      customerName: "Kasey",
      customerTitle: "Project and Production Manager, PageHub",
      sourceUrl: "https://www.bluehost.com/blog/pagehub-agency-hosting-case-study/",
    },
    {
      title: "Kainetic Adventures: From Kiteboarding School to Full-Scale Adventure Company",
      industry: "Outdoor & Recreation",
      companySize: "SMB",
      useCase: "Adventure company booking site with WooCommerce for automated reservations",
      productsTagged: ["WooCommerce Hosting", "WordPress Pro"],
      headlineMetric: "Automated bookings eliminated seasonal revenue gaps",
      narrative:
        "Kainetic Adventures transformed from a small kiteboarding school into a full-scale outdoor adventure company by building a professional website on Bluehost. By integrating WooCommerce to automate bookings, owner Danny Michelson overcame weather dependence and seasonal revenue swings — allowing the business to capture customers year-round and deliver exceptional experiences without manual reservation overhead.",
      customerName: "Danny Michelson",
      customerTitle: "Owner, Kainetic Adventures",
      sourceUrl: "https://www.bluehost.com/blog/outdoor-adventure-company-casestudy/",
    },
    {
      title: "Andres Builds: Sub-1-Second Load Times Drive Higher Conversions",
      industry: "Web Services",
      companySize: "SMB",
      useCase: "Website optimization agency using Bluehost for reliable, fast hosting for client sites",
      productsTagged: ["WordPress Pro", "Cloud Hosting"],
      headlineMetric: "Load times reduced to under 1 second",
      narrative:
        "Andres Builds, a website optimization service, relies on Bluehost to deliver the fast, reliable hosting that underpins their client results. By partnering with Bluehost, they consistently achieve sub-1-second load times — a key driver of stronger conversion rates for their clients. The reliability of the platform lets the team focus on optimization strategy rather than infrastructure management.",
      customerName: "Andres",
      customerTitle: "Founder, Andres Builds",
      sourceUrl: "https://www.bluehost.com/blog/andres-builds-case-study/",
    },
    {
      title: "Omlie Consulting: Building Trust and Credibility Online",
      industry: "Professional Services",
      companySize: "SMB",
      useCase: "Consulting firm website on WordPress with professional hosting and SSL",
      productsTagged: ["WordPress Pro"],
      headlineMetric: "Streamlined marketing and consistent uptime for client-facing credibility",
      narrative:
        "Omlie, an award-winning management consulting firm, partnered with Bluehost to establish a reliable and professional digital presence. Since launching their WordPress site, they've eliminated technical disruptions, streamlined their marketing efforts, and can now confidently engage clients through a well-maintained platform — directly supporting the trust and credibility that consulting relationships demand.",
      customerName: "Omlie Consulting Team",
      customerTitle: "Management Consulting",
      sourceUrl: "https://www.bluehost.com/blog/omlie-consulting-case-study/",
    },
    {
      title: "Infinite Event Services: Full Control Over Their Digital Storefront",
      industry: "Events",
      companySize: "SMB",
      useCase: "Event production company WordPress site for client acquisition and business credibility",
      productsTagged: ["WordPress Pro"],
      headlineMetric: "Improved speed, stability, and full control over their website",
      narrative:
        "Infinite Event Services faced a critical growth blocker: a website they couldn't control, that was slow and unreliable. After switching to Bluehost WordPress Hosting, owner and CEO Sheldon Fingler achieved significant improvements in site speed and stability while gaining complete control over their digital storefront. This eliminated disruptions for clients and gave the business a foundation to grow with confidence.",
      customerName: "Sheldon Fingler",
      customerTitle: "Owner and CEO, Infinite Event Services",
      sourceUrl: "https://www.bluehost.com/blog/infinite-event-services-wordpress-hosting-case-study/",
    },
    {
      title: "Scoops of Favor: Growing a Specialty Food Brand Through SEO",
      industry: "Food & Beverage",
      companySize: "SMB",
      useCase: "Specialty food brand using WordPress and Bluehost to grow audience and SEO rankings",
      productsTagged: ["WordPress Pro"],
      headlineMetric: "Significant growth in audience engagement and SEO rankings",
      narrative:
        "Jessica Griffin built Scoops of Favor to offer lactose-free and vegan ice cream to customers with dietary restrictions. With Bluehost powering her WordPress site, she's been able to continuously optimize her online presence, grow her audience, and build SEO rankings that connect her products with customers who need them — scaling from a niche idea into a recognized specialty brand.",
      customerName: "Jessica Griffin",
      customerTitle: "Founder, Scoops of Favor",
      sourceUrl: "https://www.bluehost.com/blog/scoops-ice-cream-of-favor/",
    },
    {
      title: "Hospitality Ambassadeurs: Scalable Digital Storytelling Platform",
      industry: "Hospitality",
      companySize: "SMB",
      useCase: "Global hospitality content platform on WordPress requiring stability and performance at scale",
      productsTagged: ["WordPress Pro", "Cloud Hosting"],
      headlineMetric: "Improved website stability and faster performance at global scale",
      narrative:
        "Hospitality Ambassadeurs built a digital storytelling platform for the global hospitality industry on Bluehost WordPress Hosting. The partnership gave their team the stability and performance they needed to focus entirely on content creation — without worrying about technical infrastructure. The result was a faster, more reliable platform that could support their growing international audience.",
      customerName: "Hospitality Ambassadeurs Team",
      customerTitle: "Digital Storytelling, Hospitality Industry",
      sourceUrl: "https://www.bluehost.com/blog/hospitality-ambassadeurs-scalable-digital-storytelling-bluehost/",
    },
    {
      title: "My Macroscopic Life: Travel Blogger Fixes Slow Site and Starts Growing Again",
      industry: "Blogging & Content",
      companySize: "Solo",
      useCase: "Travel blog migration to faster hosting to recover from speed-related audience loss",
      productsTagged: ["WordPress Pro"],
      headlineMetric: "Improved site speed reignited visitor engagement and blog growth",
      narrative:
        "The founder of My Macroscopic Life, a travel blog, was losing readers due to slow page load times that undermined the experience she'd built. After switching to Bluehost, the site's speed dramatically improved — visitors stayed longer, engaged more deeply with the content, and the blog began growing again. The technical fix gave her the foundation to focus on what mattered: creating great travel content.",
      customerName: "My Macroscopic Life",
      customerTitle: "Travel Blogger",
      sourceUrl: "https://www.bluehost.com/blog/my-macroscopic-life-case-study/",
    },
    {
      title: "FEMME TYPE: Building a Community and Commerce Platform for Women in Design",
      industry: "Design & Creative",
      companySize: "SMB",
      useCase: "Community platform and WooCommerce store for type design community",
      productsTagged: ["WordPress Pro", "WooCommerce Hosting"],
      headlineMetric: "Built a global community and type design marketplace",
      narrative:
        "Amber Weaver founded FEMME TYPE after noticing the underrepresentation of women in the typography industry. Using WordPress and WooCommerce on Bluehost, she built both a community platform and a marketplace where female designers could showcase their work, connect with peers, and sell their type designs — creating visibility and economic opportunity for an underserved creative community.",
      customerName: "Amber Weaver",
      customerTitle: "Founder, FEMME TYPE",
      sourceUrl: "https://www.bluehost.com/blog/type-focused-women-designers-find-community-with-femme-type/",
    },
    {
      title: "Wendy Luxe: From Local Sales to International Beauty Brand",
      industry: "Beauty & E-commerce",
      companySize: "SMB",
      useCase: "Luxury hair products e-commerce site scaling from local to international",
      productsTagged: ["WordPress Pro", "WooCommerce Hosting"],
      headlineMetric: "Grew from local sales to an international customer base",
      narrative:
        "Wendy Okiriguo started Wendy Luxe selling premium hair products out of her car, determined to make high-quality products accessible. By moving her business online with Bluehost, she was able to reach customers far beyond her local area — building an international customer base and scaling her brand through a professional e-commerce experience that matched the luxury positioning of her products.",
      customerName: "Wendy Okiriguo",
      customerTitle: "Founder, Wendy Luxe",
      sourceUrl: "https://www.bluehost.com/blog/wendy-okiriguo-is-bringing-high-end-luxury-to-the-beauty-industry/",
    },
    {
      title: "Mountain Valley Foods: 30+ Years of Community-Rooted Natural Grocery",
      industry: "Retail & Grocery",
      companySize: "SMB",
      useCase: "Natural foods grocery store web presence to serve local and regional customers",
      productsTagged: ["WordPress Pro"],
      headlineMetric: "Over 30 years in business with a strong community digital presence",
      narrative:
        "Founded in 1989 in Kalispell, Montana, Mountain Valley Foods has built its reputation on locally sourced natural and organic foods and deep community roots. With Bluehost powering their web presence, Patricia and Lorein have extended their family-first values into the digital space — connecting with customers online while remaining true to the community mission that has sustained their business for over three decades.",
      customerName: "Patricia and Lorein",
      customerTitle: "Co-Founders, Mountain Valley Foods",
      sourceUrl: "https://www.bluehost.com/blog/family-is-the-glue-that-bonds-mountain-valley-foods/",
    },
  ];

  for (const cs of caseStudies) {
    const existing = await prisma.caseStudy.findFirst({
      where: { title: cs.title, orgId: bluehost.id },
    });
    if (existing) {
      await prisma.caseStudy.update({
        where: { id: existing.id },
        data: { sourceUrl: cs.sourceUrl },
      });
    } else {
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
