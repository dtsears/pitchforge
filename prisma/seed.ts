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

  // ─── Case Studies (real, sourced from bluehost.com/blog) ──────────────────
  const caseStudies = [
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
