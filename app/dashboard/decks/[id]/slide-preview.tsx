"use client";

import React from "react";

// Bluehost 2026 template — matched colors, fonts, and layouts
const BH_BLUE = "#196CDF";      // Bluehost Blue 800 (headings, accents)
const BH_NAVY = "#012957";      // Bluehost Blue Dark 1000 (dark panels)
const BH_LOGO = "/bluehost-logo.svg";
const BH_LOGO_WHITE = "/bluehost-logo-white.svg";

// Inline style helpers to keep JSX readable
const heading = (size = "2rem", color = BH_BLUE): React.CSSProperties => ({
  fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
  fontSize: size,
  fontWeight: 700,
  color,
  lineHeight: 1.15,
  letterSpacing: "-0.01em",
});

const body = (size = "0.85rem", color = "#1a1a1a"): React.CSSProperties => ({
  fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
  fontSize: size,
  fontWeight: 400,
  color,
  lineHeight: 1.6,
});

const label = (color = BH_BLUE): React.CSSProperties => ({
  fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
  fontSize: "0.55rem",
  fontWeight: 600,
  textTransform: "uppercase" as const,
  letterSpacing: "0.08em",
  color,
});

type SlidePreviewProps = {
  slide: { type: string; content: unknown };
  prospectColor: string;
  prospectName: string;
};

export function SlidePreview({ slide, prospectColor, prospectName }: SlidePreviewProps) {
  const content = slide.content as Record<string, unknown>;

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* Accent bar: Bluehost blue left / prospect color right */}
      <div className="flex h-[3px] shrink-0">
        <div className="flex-1" style={{ backgroundColor: BH_BLUE }} />
        <div className="w-1/3" style={{ backgroundColor: prospectColor }} />
      </div>

      {/* Slide body */}
      <div className="flex-1 overflow-hidden">
        {slide.type === "COVER" && (
          <CoverSlide content={content} prospectName={prospectName} prospectColor={prospectColor} />
        )}
        {slide.type === "REP" && <RepSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "UNDERSTANDING" && <UnderstandingSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "WHY_NOW" && <WhyNowSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "SOLUTION" && <SolutionSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "PROOF" && <ProofSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "ROI" && <RoiSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "NEXT_STEPS" && <NextStepsSlide content={content} prospectColor={prospectColor} />}
      </div>

      {/* Footer: matches template — logo left, confidential right */}
      <div className="shrink-0 px-5 py-1.5 flex items-center justify-between border-t border-stone-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BH_LOGO} alt="Bluehost" className="h-3" />
        <span style={{ ...label("#9ca3af") }}>Confidential 2026</span>
      </div>
    </div>
  );
}

// ─── 1. COVER — matches Template Slide 2 ──────────────────────────────────
// Left: dark navy panel | Right: logo + headline + prospect name

function CoverSlide({ content, prospectName, prospectColor }: {
  content: Record<string, unknown>; prospectName: string; prospectColor: string;
}) {
  return (
    <div className="flex h-full">
      {/* Left: dark panel */}
      <div
        className="w-[42%] shrink-0 flex flex-col justify-end p-5"
        style={{ backgroundColor: BH_NAVY }}
      >
        <div
          className="w-8 h-0.5 mb-3"
          style={{ backgroundColor: prospectColor }}
        />
        <p style={{ ...body("0.65rem", "rgba(255,255,255,0.5)") }}>
          Prepared for
        </p>
        <p style={{ ...heading("1rem", "white") }}>{prospectName}</p>
      </div>

      {/* Right: content */}
      <div className="flex-1 flex flex-col justify-between p-5">
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <div className="flex justify-end">
          <img src={BH_LOGO} alt="Bluehost" className="h-4" />
        </div>

        {/* Headline */}
        <div>
          <p style={{ ...label(prospectColor) }} className="mb-2">
            {prospectName}
          </p>
          <h1 style={{ ...heading("1.6rem", BH_BLUE) }} className="mb-3">
            {content.headline as string}
          </h1>
          <p style={body("0.75rem", "#465D77")}>
            {content.subheadline as string}
          </p>
        </div>

        <div />
      </div>
    </div>
  );
}

// ─── 2. REP — matches Template Slide 6 ────────────────────────────────────
// Panelist layout: large heading, photo circle, credentials bullets

function RepSlide({ content, prospectColor }: {
  content: Record<string, unknown>; prospectColor: string;
}) {
  const specialties = (content.specialties as string[]) ?? [];
  return (
    <div className="flex h-full">
      {/* Left: info */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <p style={label(BH_BLUE)} className="mb-2">Presenter</p>
        <h2 style={heading("1.5rem", BH_NAVY)} className="mb-0.5">
          {content.name as string}
        </h2>
        <p style={{ ...body("0.75rem"), color: BH_BLUE, fontWeight: 600 }} className="mb-0.5">
          {content.title as string}
        </p>
        <p style={body("0.65rem", "#465D77")} className="mb-4">
          {content.tenureYears as number} years at Bluehost
        </p>
        <p style={body("0.72rem")} className="mb-4 max-w-xs leading-relaxed">
          {content.bio as string}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {specialties.map((s) => (
            <span
              key={s}
              style={{
                fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
                fontSize: "0.6rem",
                fontWeight: 600,
                color: prospectColor,
                border: `1px solid ${prospectColor}60`,
                borderRadius: "99px",
                padding: "2px 8px",
              }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* Right: photo circle */}
      <div
        className="w-[35%] shrink-0 flex items-center justify-center"
        style={{ backgroundColor: BH_BLUE + "0D" }}
      >
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold"
          style={{ backgroundColor: BH_BLUE, fontFamily: "Poppins, sans-serif" }}
        >
          {(content.name as string)?.[0] ?? "D"}
        </div>
      </div>
    </div>
  );
}

// ─── 3. UNDERSTANDING — matches Template Slide 24 ─────────────────────────
// Left: title + numbered pain points | Right: color panel

function UnderstandingSlide({ content, prospectColor }: {
  content: Record<string, unknown>; prospectColor: string;
}) {
  const painPoints = (content.painPoints as { headline: string; description: string }[]) ?? [];
  return (
    <div className="flex h-full">
      {/* Left: content */}
      <div className="flex-1 flex flex-col justify-center p-6">
        <h2 style={heading("1.3rem", BH_NAVY)} className="mb-5">
          {content.title as string}
        </h2>
        <div className="space-y-3">
          {painPoints.map((p, i) => (
            <div key={i} className="flex gap-3 items-start">
              <div
                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: prospectColor, fontSize: "0.55rem", fontWeight: 700, fontFamily: "Poppins, sans-serif" }}
              >
                {i + 1}
              </div>
              <div>
                <p style={{ ...body("0.72rem"), fontWeight: 600, color: "#1a1a1a" }}>
                  {p.headline}
                </p>
                <p style={body("0.65rem", "#465D77")}>{p.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: accent panel */}
      <div
        className="w-[32%] shrink-0"
        style={{ backgroundColor: BH_BLUE + "0D", borderLeft: `3px solid ${BH_BLUE}` }}
      />
    </div>
  );
}

// ─── 4. WHY NOW — matches Template Slide 21 ───────────────────────────────
// Left: title + trigger block + urgency bullets | Right: color panel

function WhyNowSlide({ content, prospectColor }: {
  content: Record<string, unknown>; prospectColor: string;
}) {
  const urgencyPoints = (content.urgencyPoints as string[]) ?? [];
  return (
    <div className="flex h-full">
      <div className="flex-1 flex flex-col justify-center p-6">
        <h2 style={heading("1.3rem", BH_NAVY)} className="mb-3">
          {content.title as string}
        </h2>

        {/* Trigger block */}
        <div
          className="rounded-lg px-3 py-2.5 mb-3"
          style={{ backgroundColor: prospectColor + "0D", borderLeft: `3px solid ${prospectColor}` }}
        >
          <p style={label(prospectColor)} className="mb-1">Trigger Event</p>
          <p style={{ ...body("0.72rem"), fontWeight: 600, color: BH_NAVY }}>
            {content.triggerEvent as string}
          </p>
          <p style={body("0.65rem", "#465D77")} className="mt-1">
            {content.description as string}
          </p>
        </div>

        <ul className="space-y-1.5">
          {urgencyPoints.map((pt, i) => (
            <li key={i} className="flex items-start gap-2">
              <span style={{ color: BH_BLUE, fontWeight: 700, fontSize: "0.7rem", marginTop: "1px" }}>→</span>
              <p style={body("0.65rem")}>{pt}</p>
            </li>
          ))}
        </ul>
      </div>

      <div
        className="w-[30%] shrink-0"
        style={{ backgroundColor: BH_NAVY + "0A", borderLeft: `2px solid ${BH_BLUE}20` }}
      />
    </div>
  );
}

// ─── 5. SOLUTION — matches Template Slide 42 ──────────────────────────────
// Title + 4-row feature list with icon circles

function SolutionSlide({ content, prospectColor }: {
  content: Record<string, unknown>; prospectColor: string;
}) {
  const products = (content.products as { name: string; description: string; benefit: string }[]) ?? [];
  return (
    <div className="flex flex-col h-full p-5">
      <h2 style={heading("1.2rem", BH_NAVY)} className="mb-1">
        {content.title as string}
      </h2>
      <p style={body("0.68rem", "#465D77")} className="mb-4">
        {content.intro as string}
      </p>

      <div className={`grid gap-2.5 flex-1 content-start ${products.length <= 2 ? "grid-cols-1" : "grid-cols-2"}`}>
        {products.map((p, i) => (
          <div key={p.name} className="flex items-start gap-3">
            {/* Icon circle */}
            <div
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white"
              style={{ backgroundColor: i % 2 === 0 ? BH_BLUE : prospectColor, fontSize: "0.6rem", fontWeight: 700, fontFamily: "Poppins, sans-serif" }}
            >
              {i + 1}
            </div>
            <div>
              <p style={{ ...body("0.7rem"), fontWeight: 700, color: BH_NAVY }}>
                {p.name}
              </p>
              <p style={body("0.63rem", "#465D77")}>{p.description}</p>
              <p style={{ ...body("0.63rem"), color: prospectColor, fontWeight: 600 }}>
                {p.benefit}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. PROOF — matches Template Slide 27 ─────────────────────────────────
// Headline + stat cards grid | Right: narrative

function ProofSlide({ content, prospectColor }: {
  content: Record<string, unknown>; prospectColor: string;
}) {
  const rawSourceUrl = content.sourceUrl;
  const sourceUrl =
    rawSourceUrl &&
    typeof rawSourceUrl === "string" &&
    rawSourceUrl !== "null" &&
    rawSourceUrl.startsWith("http")
      ? rawSourceUrl
      : null;

  return (
    <div className="flex h-full">
      {/* Left: big metric */}
      <div
        className="w-[42%] shrink-0 flex flex-col justify-center p-5"
        style={{ backgroundColor: BH_BLUE + "08", borderRight: `2px solid ${BH_BLUE}15` }}
      >
        <p style={label(BH_BLUE)} className="mb-2">Proven Results</p>
        <p
          style={{
            fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
            fontSize: "1.8rem",
            fontWeight: 800,
            color: prospectColor,
            lineHeight: 1.1,
            letterSpacing: "-0.02em",
          }}
          className="mb-2"
        >
          {content.headlineMetric as string}
        </p>
        <p style={{ ...body("0.68rem"), fontWeight: 600, color: BH_NAVY }}>
          {content.customerName as string}
        </p>
        <p style={body("0.6rem", "#465D77")}>{content.industry as string}</p>
      </div>

      {/* Right: narrative */}
      <div className="flex-1 flex flex-col justify-center p-5">
        <h2 style={heading("1rem", BH_NAVY)} className="mb-3">
          {content.title as string}
        </h2>
        <p style={body("0.7rem")} className="mb-4 leading-relaxed">
          {content.narrative as string}
        </p>
        <div className="border-t pt-3 flex items-center justify-between" style={{ borderColor: BH_BLUE + "20" }}>
          <p style={body("0.6rem", "#9ca3af")}>
            {(content.productsUsed as string[])?.join(" · ")}
          </p>
          {sourceUrl ? (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ ...body("0.6rem"), color: BH_BLUE, fontWeight: 700 }}
              className="hover:underline"
            >
              Read full case study →
            </a>
          ) : (
            <span style={body("0.6rem", "#d1d5db")}>No link available</span>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 7. ROI — matches Template Slide 20 ───────────────────────────────────
// Left: narrative | Right: callout box with 3 big stats

function RoiSlide({ content, prospectColor }: {
  content: Record<string, unknown>; prospectColor: string;
}) {
  const metrics = (content.metrics as { label: string; value: string; description: string }[]) ?? [];
  return (
    <div className="flex h-full">
      {/* Left: text */}
      <div className="flex-1 flex flex-col justify-center p-5">
        <h2 style={heading("1.2rem", BH_NAVY)} className="mb-3">
          {content.title as string}
        </h2>
        <p style={body("0.7rem", "#465D77")} className="leading-relaxed mb-4">
          {content.summary as string}
        </p>
        <div
          className="p-3 rounded-lg"
          style={{ backgroundColor: BH_BLUE + "08", borderLeft: `3px solid ${BH_BLUE}` }}
        >
          <p style={{ ...body("0.65rem"), fontWeight: 600, color: BH_NAVY }}>
            The business case for {metrics[0]?.label ?? "switching"}
          </p>
        </div>
      </div>

      {/* Right: stat cards */}
      <div
        className="w-[45%] shrink-0 flex flex-col justify-center gap-2 p-4"
        style={{ backgroundColor: BH_NAVY }}
      >
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-lg p-3"
            style={{ backgroundColor: "rgba(255,255,255,0.08)" }}
          >
            <p
              style={{
                fontFamily: "Poppins, ui-sans-serif, system-ui, sans-serif",
                fontSize: "1.4rem",
                fontWeight: 800,
                color: i === 0 ? prospectColor : "#84C1FC",
                lineHeight: 1,
                letterSpacing: "-0.02em",
              }}
            >
              {m.value}
            </p>
            <p style={{ ...body("0.6rem"), fontWeight: 600, color: "white" }}>
              {m.label}
            </p>
            <p style={body("0.58rem", "rgba(255,255,255,0.5)")}>{m.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 8. NEXT STEPS — matches Template Slide 18 ────────────────────────────
// Two-column layout: numbered steps left | CTA panel right

function NextStepsSlide({ content, prospectColor }: {
  content: Record<string, unknown>; prospectColor: string;
}) {
  const steps = (content.steps as { action: string; owner: string; timeline: string }[]) ?? [];
  return (
    <div className="flex h-full">
      {/* Left: steps */}
      <div className="flex-1 flex flex-col justify-center p-5">
        <h2 style={heading("1.2rem", BH_NAVY)} className="mb-4">
          {content.title as string}
        </h2>
        <div className="space-y-3">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-3">
              <div
                className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-white"
                style={{ backgroundColor: prospectColor, fontSize: "0.6rem", fontWeight: 700, fontFamily: "Poppins, sans-serif" }}
              >
                {i + 1}
              </div>
              <div>
                <p style={{ ...body("0.72rem"), fontWeight: 600, color: BH_NAVY }}>
                  {s.action}
                </p>
                <p style={body("0.6rem", "#9ca3af")}>
                  {s.owner} · {s.timeline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Right: CTA panel */}
      <div
        className="w-[38%] shrink-0 flex flex-col items-center justify-center p-5 text-center"
        style={{ backgroundColor: BH_BLUE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BH_LOGO_WHITE} alt="Bluehost" className="h-5 mb-4 opacity-90" />
        <p style={{ ...body("0.75rem"), fontWeight: 600, color: "white", lineHeight: 1.4 }}>
          {content.cta as string}
        </p>
      </div>
    </div>
  );
}
