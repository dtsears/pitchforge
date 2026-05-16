# PitchForge — Project Constitution

> Last updated: 2026-05-16 | Active phase: Step 1 — Foundation

---

## North Star
Cut custom pitch deck creation from **2–3 hours → 15-minute rep review** of an AI-drafted, co-branded, prospect-tailored deck.

---

## B.L.A.S.T. Phase Outputs

### B — Blueprint
- **North Star:** 15-minute rep review replacing hours of manual work
- **Integrations:** Anthropic API, Inngest Cloud, Browserless (Playwright), Salesforce (jsforce OAuth 2.0), Vercel Blob, Google OAuth (NextAuth), Neon/Supabase Postgres, Vercel hosting
- **Source of Truth:** Salesforce (prospect firmographics + opportunity), scraped prospect website (brand assets, news, pains), Bluehost internal content library (products, case studies)
- **Delivery Payload:** 8-slide co-branded pitch deck → on-screen review UI, .pptx export (pptxgenjs), PDF export (Puppeteer), public /d/[slug] deck room with engagement analytics
- **Behavioral Rules:** See "Co-branding Rules" and "V1 Scope Hard Limits" below

### L — Link
_Credentials verified before coding begins on each integration._
- [ ] Google OAuth credentials (NextAuth)
- [ ] Anthropic API key
- [ ] Inngest signing key + event key
- [ ] Browserless API key
- [ ] Salesforce connected app (OAuth 2.0)
- [ ] Neon/Supabase DATABASE_URL
- [ ] Vercel Blob token

### A — Architecture
See /architecture/ directory for SOPs.

### S — Stylize
See "Design System" section below.

### T — Trigger
See "Triggers & Automation" section below.

---

## Data Schema

### Input Shape (Deck Generation Request)
```typescript
{
  prospectId: string;           // UUID, must exist in DB
  selectedProductIds: string[]; // 1–4 products from catalog
  transcriptText?: string;      // Optional discovery call transcript
  repId: string;                // UUID, authenticated user
}
```

### Output Shape (Generated Deck)
```typescript
{
  deckId: string;
  publicSlug: string;           // Long unguessable string, /d/[slug]
  slides: Slide[];              // 8 slides in order
  status: 'draft';
}

// Slide content is typed per slide type — see Prisma schema
```

### Core Slide Types (in order)
1. `cover` — co-branded logos, headline
2. `rep` — rep intro, headshot, bio
3. `understanding` — buyer pain points ("what we heard")
4. `why_now` — trigger event for this prospect
5. `solution` — selected Bluehost products
6. `proof` — matching case study
7. `roi` — business case with numbers
8. `next_steps` — CTA, next meeting ask

---

## Prisma Schema (Canonical)

```prisma
model Organization {
  id           String    @id @default(cuid())
  name         String
  primaryColor String    // hex
  accentColor  String    // hex
  logoUrl      String?
  domain       String    @unique
  createdAt    DateTime  @default(now())
  users        User[]
  products     Product[]
  caseStudies  CaseStudy[]
  decks        Deck[]
}

model User {
  id             String       @id @default(cuid())
  email          String       @unique
  name           String
  image          String?
  title          String?
  tenureYears    Int?
  bio            String?
  specialties    String[]
  headshotUrl    String?
  orgId          String
  org            Organization @relation(fields: [orgId], references: [id])
  decks          Deck[]
  createdAt      DateTime     @default(now())
}

model Product {
  id                String       @id @default(cuid())
  orgId             String
  org               Organization @relation(fields: [orgId], references: [id])
  name              String
  description       String
  iconUrl           String?
  targetBuyerProfile String
  slideContentBlocks Json        // structured content for slide generation
  createdAt         DateTime    @default(now())
  slides            Slide[]
}

model CaseStudy {
  id               String       @id @default(cuid())
  orgId            String
  org              Organization @relation(fields: [orgId], references: [id])
  title            String
  industry         String
  companySize      String       // "SMB", "Mid-Market", "Enterprise"
  useCase          String
  productsTagged   String[]     // product names
  headlineMetric   String       // e.g., "40% faster site load"
  narrative        String
  customerName     String?
  customerTitle    String?
  createdAt        DateTime     @default(now())
}

model Prospect {
  id               String    @id @default(cuid())
  companyName      String
  websiteUrl       String
  industry         String?
  contactName      String?
  contactEmail     String?
  contactTitle     String?
  notes            String?
  // Scraped data
  tagline          String?
  logoUrl          String?
  primaryColor     String?   // hex, from logo analysis
  accentColor      String?   // hex, from logo analysis
  recentNews       Json?     // array of {headline, url, date}
  inferredPains    String[]
  scrapedAt        DateTime?
  scrapeConfidence Float?    // 0.0–1.0
  // Salesforce
  salesforceAccountId String?
  opportunityStage    String?
  opportunityAmount   Float?
  createdAt        DateTime  @default(now())
  decks            Deck[]
}

model Deck {
  id           String       @id @default(cuid())
  orgId        String
  org          Organization @relation(fields: [orgId], references: [id])
  userId       String
  user         User         @relation(fields: [userId], references: [id])
  prospectId   String
  prospect     Prospect     @relation(fields: [prospectId], references: [id])
  status       DeckStatus   @default(DRAFT)
  publicSlug   String       @unique
  slides       Slide[]
  views        DeckView[]
  emails       Email[]
  createdAt    DateTime     @default(now())
  updatedAt    DateTime     @updatedAt
}

enum DeckStatus {
  DRAFT
  SENT
  VIEWED
  CLOSED_WON
  CLOSED_LOST
}

model Slide {
  id         String    @id @default(cuid())
  deckId     String
  deck       Deck      @relation(fields: [deckId], references: [id])
  type       SlideType
  content    Json      // typed per SlideType, validated by Zod
  order      Int
  productId  String?
  product    Product?  @relation(fields: [productId], references: [id])
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
}

enum SlideType {
  COVER
  REP
  UNDERSTANDING
  WHY_NOW
  SOLUTION
  PROOF
  ROI
  NEXT_STEPS
}

model DeckView {
  id              String   @id @default(cuid())
  deckId          String
  deck            Deck     @relation(fields: [deckId], references: [id])
  viewerIp        String?
  userAgent       String?
  slideEngagement Json     // {slideId: secondsViewed}
  isInternalForward Boolean @default(false)
  createdAt       DateTime @default(now())
}

model Email {
  id          String    @id @default(cuid())
  deckId      String
  deck        Deck      @relation(fields: [deckId], references: [id])
  type        EmailType
  subject     String
  body        String
  recipient   String
  sentAt      DateTime?
  createdAt   DateTime  @default(now())
}

enum EmailType {
  FIRST_TOUCH
  FOLLOW_UP
}
```

---

## Co-branding Rules
- Thin accent bar at top of every slide, split: left = Bluehost color, right = prospect color
- Prospect logo: cover slide and next_steps slide ONLY
- Prospect accent color: used for emphasis (numbers, key phrases) — NEVER as a background
- Bluehost logo: every slide, consistent position
- Loud co-branding = amateur. Subtle = enterprise.

---

## V1 Scope Hard Limits
**Do not build these until V1 is shipped:**
- Org onboarding / signup flow
- Brand-guide uploader
- Slide-master .pptx parser
- Per-org admin panel
- Multi-tenant billing

**Push back if asked for any of these during V1.**

---

## Tech Stack
| Concern | Choice |
|---|---|
| Framework | Next.js 14 App Router, TypeScript strict |
| Styling | Tailwind CSS, lucide-react |
| Database | Postgres via Prisma ORM |
| Auth | NextAuth v4, Google provider |
| AI — narrative | claude-sonnet-4-6 |
| AI — lightweight | claude-haiku-4-5-20251001 |
| Async jobs | Inngest |
| Scraping | Browserless (Playwright) |
| Salesforce | jsforce |
| .pptx | pptxgenjs |
| PDF | Puppeteer |
| File storage | Vercel Blob → S3 if needed |
| Validation | Zod (all external inputs) |
| Logging | Pino structured (no console.log) |
| Hosting | Vercel + Inngest Cloud + Neon/Supabase |

---

## Architecture Conventions
1. Server Components by default. Client Components only when interactivity requires it (`'use client'`).
2. Server Actions for mutations. API routes only for webhook-callable endpoints (Inngest).
3. No `any`. Types inferred from Prisma + Zod.
4. All Anthropic API calls server-side. API key never in client bundle.
5. Anything >~2 seconds = Inngest job. Never block HTTP on scraping or AI gen.
6. Errors: Pino logs technical detail. User sees friendly message.
7. Migrations: `prisma migrate dev` only. No direct DB edits.
8. Commits: one concern per commit. Keep diffs focused.

---

## Design System

### Typography
- Headlines: Fraunces (Google Fonts). Fallback: `ui-serif, Georgia, serif`. Tight tracking at display sizes.
- Body / UI: system sans-serif (Geist Sans or similar). Clean, neutral.

### Color Palette
- Base: stone (`stone-*`) + amber (`amber-*`)
- Accent: used sparingly. Never as full backgrounds.
- Prospect color: emphasis only (numbers, key phrases, thin accents)

### Layout Principles
- Generous whitespace. Hierarchy through size + weight, not boxes + borders.
- Rep UI: dense, fast, keyboard-shortcut-first
- Prospect UI (/d/[slug]): elegant, editorial, immersive

### Hard "No" List
- Purple gradients
- Default Inter (use Geist or a deliberate choice)
- shadcn out-of-the-box defaults without customization
- Neon glow effects
- Overused AI sparkle iconography

---

## Triggers & Automation

| Trigger | Handler | Notes |
|---|---|---|
| Prospect URL submitted | Inngest: `prospect/scrape` | Background; updates Prospect record |
| Deck generation requested | Inngest: `deck/generate` | Calls Anthropic, stores Slides |
| .pptx export requested | Inngest: `deck/export-pptx` | pptxgenjs, stores to Vercel Blob |
| PDF export requested | Inngest: `deck/export-pdf` | Puppeteer render of /d/[slug] |
| /d/[slug] visited | Server Action / API | Logs DeckView, starts slide timing |

---

## Self-Annealing Log
_Populated as errors are encountered and resolved._

| Date | Error | Root Cause | Fix | SOP Updated |
|---|---|---|---|---|
| — | — | — | — | — |
