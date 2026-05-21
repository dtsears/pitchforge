"use client";

const BLUEHOST_BLUE = "#003087";
const BLUEHOST_LOGO =
  "https://www.bluehost.com/content/dam/bluehost/global/logo/bluehost-logo.svg";

type SlidePreviewProps = {
  slide: { type: string; content: unknown };
  prospectColor: string;
  prospectName: string;
};

export function SlidePreview({
  slide,
  prospectColor,
  prospectName,
}: SlidePreviewProps) {
  const content = slide.content as Record<string, unknown>;

  return (
    <div className="w-full h-full flex flex-col bg-white overflow-hidden">
      {/* ── Top accent bar: Bluehost blue left / prospect color right ── */}
      <div className="flex h-1 shrink-0">
        <div className="flex-1" style={{ backgroundColor: BLUEHOST_BLUE }} />
        <div className="flex-1" style={{ backgroundColor: prospectColor }} />
      </div>

      {/* ── Header: Bluehost logo top-right ── */}
      <div className="shrink-0 px-8 pt-3 flex justify-between items-center">
        <div />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={BLUEHOST_LOGO} alt="Bluehost" className="h-3.5 opacity-75" />
      </div>

      {/* ── Slide body ── */}
      <div className="flex-1 overflow-hidden">
        {slide.type === "COVER" && (
          <CoverSlide content={content} prospectName={prospectName} prospectColor={prospectColor} />
        )}
        {slide.type === "REP" && (
          <RepSlide content={content} prospectColor={prospectColor} />
        )}
        {slide.type === "UNDERSTANDING" && (
          <UnderstandingSlide content={content} prospectColor={prospectColor} />
        )}
        {slide.type === "WHY_NOW" && (
          <WhyNowSlide content={content} prospectColor={prospectColor} />
        )}
        {slide.type === "SOLUTION" && (
          <SolutionSlide content={content} prospectColor={prospectColor} />
        )}
        {slide.type === "PROOF" && (
          <ProofSlide content={content} prospectColor={prospectColor} />
        )}
        {slide.type === "ROI" && (
          <RoiSlide content={content} prospectColor={prospectColor} />
        )}
        {slide.type === "NEXT_STEPS" && (
          <NextStepsSlide content={content} prospectColor={prospectColor} />
        )}
      </div>

      {/* ── Footer: Bluehost blue bar ── */}
      <div
        className="shrink-0 px-8 py-2 flex items-center justify-between"
        style={{ backgroundColor: BLUEHOST_BLUE }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={BLUEHOST_LOGO}
          alt="Bluehost"
          className="h-3 brightness-0 invert opacity-90"
        />
        <span className="text-white/40 text-[9px] tracking-wider uppercase">
          Confidential
        </span>
      </div>
    </div>
  );
}

// ─── 1. COVER ──────────────────────────────────────────────────────────────

function CoverSlide({
  content,
  prospectName,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectName: string;
  prospectColor: string;
}) {
  return (
    <div className="flex h-full">
      {/* Left: main content */}
      <div className="flex-1 flex flex-col justify-center px-10 py-6">
        <p
          className="text-[10px] font-semibold uppercase tracking-widest mb-3"
          style={{ color: prospectColor }}
        >
          Prepared for {prospectName}
        </p>
        <h1
          className="text-display text-[26px] font-semibold text-stone-900 leading-tight mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.headline as string}
        </h1>
        <p className="text-sm text-stone-500 max-w-sm leading-relaxed">
          {content.subheadline as string}
        </p>
      </div>

      {/* Right: prospect color panel */}
      <div
        className="w-32 flex flex-col items-center justify-center shrink-0"
        style={{ backgroundColor: prospectColor + "18" }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-white text-lg font-bold"
          style={{ backgroundColor: prospectColor }}
        >
          {prospectName[0]?.toUpperCase() ?? "?"}
        </div>
        <p className="text-[9px] text-center mt-2 px-2 font-medium" style={{ color: prospectColor }}>
          {prospectName}
        </p>
      </div>
    </div>
  );
}

// ─── 2. REP ────────────────────────────────────────────────────────────────

function RepSlide({
  content,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectColor: string;
}) {
  const specialties = (content.specialties as string[]) ?? [];

  return (
    <div className="flex h-full items-center gap-8 px-10 py-6">
      {/* Photo circle */}
      <div className="shrink-0">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl font-bold"
          style={{ backgroundColor: BLUEHOST_BLUE }}
        >
          {(content.name as string)?.[0] ?? "D"}
        </div>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <h2
          className="text-display text-2xl font-semibold text-stone-900 mb-0.5"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.name as string}
        </h2>
        <p className="text-sm font-medium mb-0.5" style={{ color: prospectColor }}>
          {content.title as string}
        </p>
        <p className="text-xs text-stone-400 mb-3">
          {content.tenureYears as number} years at Bluehost
        </p>
        <p className="text-xs text-stone-600 leading-relaxed mb-4 max-w-lg">
          {content.bio as string}
        </p>
        <div className="flex flex-wrap gap-1.5">
          {specialties.map((s) => (
            <span
              key={s}
              className="text-[10px] px-2 py-0.5 rounded-full border font-medium"
              style={{ borderColor: prospectColor + "60", color: prospectColor }}
            >
              {s}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── 3. UNDERSTANDING ──────────────────────────────────────────────────────

function UnderstandingSlide({
  content,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectColor: string;
}) {
  const painPoints =
    (content.painPoints as { headline: string; description: string }[]) ?? [];

  return (
    <div className="flex flex-col h-full px-10 py-6">
      <h2
        className="text-display text-xl font-semibold text-stone-900 mb-5"
        style={{ letterSpacing: "-0.02em" }}
      >
        {content.title as string}
      </h2>
      <div className="space-y-4 flex-1">
        {painPoints.map((p, i) => (
          <div key={i} className="flex gap-4 items-start">
            <div
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold mt-0.5"
              style={{ backgroundColor: prospectColor }}
            >
              {i + 1}
            </div>
            <div>
              <p className="text-sm font-semibold text-stone-900 mb-0.5">
                {p.headline}
              </p>
              <p className="text-xs text-stone-500 leading-relaxed">
                {p.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 4. WHY NOW ────────────────────────────────────────────────────────────

function WhyNowSlide({
  content,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectColor: string;
}) {
  const urgencyPoints = (content.urgencyPoints as string[]) ?? [];

  return (
    <div className="flex flex-col h-full px-10 py-6">
      <h2
        className="text-display text-xl font-semibold text-stone-900 mb-4"
        style={{ letterSpacing: "-0.02em" }}
      >
        {content.title as string}
      </h2>

      {/* Trigger event — highlighted block */}
      <div
        className="rounded-xl px-4 py-3 mb-4 border-l-4"
        style={{
          backgroundColor: prospectColor + "10",
          borderLeftColor: prospectColor,
        }}
      >
        <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: prospectColor }}>
          Trigger Event
        </p>
        <p className="text-sm font-semibold text-stone-900">
          {content.triggerEvent as string}
        </p>
        <p className="text-xs text-stone-500 mt-1 leading-relaxed">
          {content.description as string}
        </p>
      </div>

      {/* Urgency points */}
      <ul className="space-y-2">
        {urgencyPoints.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
            <span className="font-bold shrink-0 mt-0.5" style={{ color: prospectColor }}>
              →
            </span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── 5. SOLUTION ───────────────────────────────────────────────────────────

function SolutionSlide({
  content,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectColor: string;
}) {
  const products =
    (content.products as { name: string; description: string; benefit: string }[]) ?? [];

  return (
    <div className="flex flex-col h-full px-10 py-5">
      <h2
        className="text-display text-xl font-semibold text-stone-900 mb-1"
        style={{ letterSpacing: "-0.02em" }}
      >
        {content.title as string}
      </h2>
      <p className="text-xs text-stone-500 mb-4">{content.intro as string}</p>

      <div
        className={`grid gap-3 flex-1 content-start ${
          products.length <= 2 ? "grid-cols-2" : products.length === 3 ? "grid-cols-3" : "grid-cols-2"
        }`}
      >
        {products.map((p) => (
          <div
            key={p.name}
            className="rounded-xl border border-stone-100 p-3 bg-stone-50"
          >
            <p
              className="text-[10px] font-semibold uppercase tracking-wider mb-1"
              style={{ color: BLUEHOST_BLUE }}
            >
              {p.name}
            </p>
            <p className="text-xs text-stone-600 leading-relaxed mb-2">
              {p.description}
            </p>
            <p className="text-xs font-semibold" style={{ color: prospectColor }}>
              {p.benefit}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── 6. PROOF ──────────────────────────────────────────────────────────────

function ProofSlide({
  content,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectColor: string;
}) {
  const sourceUrl = content.sourceUrl as string | null | undefined;

  return (
    <div className="flex h-full">
      {/* Left: the metric — hero element */}
      <div
        className="w-2/5 flex flex-col justify-center px-8 py-6 border-r border-stone-100"
        style={{ backgroundColor: prospectColor + "08" }}
      >
        <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
          Proven Results
        </p>
        <p
          className="text-display font-bold leading-none mb-3"
          style={{ fontSize: "2rem", color: prospectColor }}
        >
          {content.headlineMetric as string}
        </p>
        <p className="text-xs text-stone-500 font-medium">
          {content.customerName as string}
        </p>
        <p className="text-[10px] text-stone-400">{content.industry as string}</p>
      </div>

      {/* Right: narrative */}
      <div className="flex-1 flex flex-col justify-center px-8 py-6">
        <h2
          className="text-display text-lg font-semibold text-stone-900 mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          {content.title as string}
        </h2>
        <p className="text-xs text-stone-600 leading-relaxed mb-4">
          {content.narrative as string}
        </p>
        <div className="border-t border-stone-100 pt-3 flex items-center justify-between">
          <p className="text-[10px] text-stone-400">
            {(content.productsUsed as string[])?.join(", ")}
          </p>
          {sourceUrl && sourceUrl !== "null" && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] font-semibold hover:underline"
              style={{ color: prospectColor }}
            >
              Read full story →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── 7. ROI ────────────────────────────────────────────────────────────────

function RoiSlide({
  content,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectColor: string;
}) {
  const metrics =
    (content.metrics as { label: string; value: string; description: string }[]) ?? [];

  return (
    <div className="flex flex-col h-full px-10 py-5">
      <h2
        className="text-display text-xl font-semibold text-stone-900 mb-5"
        style={{ letterSpacing: "-0.02em" }}
      >
        {content.title as string}
      </h2>

      {/* Big stat boxes */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {metrics.map((m, i) => (
          <div
            key={i}
            className="rounded-xl border border-stone-100 p-4 text-center"
            style={{ backgroundColor: i === 0 ? prospectColor + "08" : "transparent" }}
          >
            <p
              className="text-display font-bold mb-1"
              style={{ fontSize: "1.75rem", color: prospectColor, letterSpacing: "-0.03em" }}
            >
              {m.value}
            </p>
            <p className="text-[10px] font-semibold text-stone-900 uppercase tracking-wider mb-1">
              {m.label}
            </p>
            <p className="text-[10px] text-stone-400 leading-relaxed">{m.description}</p>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div
        className="rounded-xl px-4 py-2.5 border-l-4"
        style={{ backgroundColor: BLUEHOST_BLUE + "08", borderLeftColor: BLUEHOST_BLUE }}
      >
        <p className="text-xs text-stone-600 leading-relaxed">{content.summary as string}</p>
      </div>
    </div>
  );
}

// ─── 8. NEXT STEPS ─────────────────────────────────────────────────────────

function NextStepsSlide({
  content,
  prospectColor,
}: {
  content: Record<string, unknown>;
  prospectColor: string;
}) {
  const steps =
    (content.steps as { action: string; owner: string; timeline: string }[]) ?? [];

  return (
    <div className="flex flex-col h-full px-10 py-5">
      <h2
        className="text-display text-xl font-semibold text-stone-900 mb-5"
        style={{ letterSpacing: "-0.02em" }}
      >
        {content.title as string}
      </h2>

      <div className="space-y-3 flex-1">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-4">
            <div
              className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-white text-xs font-bold"
              style={{ backgroundColor: BLUEHOST_BLUE }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-900">{s.action}</p>
              <p className="text-[10px] text-stone-400 mt-0.5">
                {s.owner} · {s.timeline}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA bar */}
      <div
        className="rounded-xl px-5 py-3 flex items-center justify-between mt-4"
        style={{ backgroundColor: BLUEHOST_BLUE }}
      >
        <p className="text-white text-sm font-semibold">{content.cta as string}</p>
        <span className="text-white/60 text-xs">Bluehost</span>
      </div>
    </div>
  );
}
