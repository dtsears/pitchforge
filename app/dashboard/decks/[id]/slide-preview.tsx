"use client";

// Renders the full slide preview for each of the 8 slide types.
// Design: accent bar top, Bluehost blue left / prospect color right.
// Prospect accent color used for emphasis (numbers, highlights).

const BLUEHOST_BLUE = "#003087";

type SlidePreviewProps = {
  slide: { type: string; content: unknown };
  prospectColor: string;
  prospectName: string;
};

export function SlidePreview({ slide, prospectColor, prospectName }: SlidePreviewProps) {
  const content = slide.content as Record<string, unknown>;

  return (
    <div className="w-full h-full flex flex-col bg-white">
      {/* Accent bar */}
      <div className="flex h-1.5 shrink-0">
        <div className="flex-1" style={{ backgroundColor: BLUEHOST_BLUE }} />
        <div className="flex-1" style={{ backgroundColor: prospectColor }} />
      </div>

      {/* Slide content */}
      <div className="flex-1 overflow-hidden px-10 py-7">
        {slide.type === "COVER" && <CoverSlide content={content} prospectName={prospectName} prospectColor={prospectColor} />}
        {slide.type === "REP" && <RepSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "UNDERSTANDING" && <UnderstandingSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "WHY_NOW" && <WhyNowSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "SOLUTION" && <SolutionSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "PROOF" && <ProofSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "ROI" && <RoiSlide content={content} prospectColor={prospectColor} />}
        {slide.type === "NEXT_STEPS" && <NextStepsSlide content={content} prospectColor={prospectColor} />}
      </div>

      {/* Bluehost footer */}
      <div
        className="shrink-0 px-10 py-2 flex items-center justify-between"
        style={{ backgroundColor: BLUEHOST_BLUE }}
      >
        <span className="text-white text-[10px] font-semibold tracking-wide">
          BLUEHOST
        </span>
        <span className="text-white/50 text-[9px]">Confidential</span>
      </div>
    </div>
  );
}

// ─── Slide renderers ──────────────────────────────────────────────────────

function CoverSlide({ content, prospectName, prospectColor }: { content: Record<string, unknown>; prospectName: string; prospectColor: string }) {
  return (
    <div className="flex flex-col justify-center h-full">
      <p className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: prospectColor }}>
        {prospectName}
      </p>
      <h1 className="text-display text-3xl font-semibold text-stone-900 leading-tight mb-4">
        {content.headline as string}
      </h1>
      <p className="text-stone-500 text-sm max-w-lg">{content.subheadline as string}</p>
    </div>
  );
}

function RepSlide({ content, prospectColor }: { content: Record<string, unknown>; prospectColor: string }) {
  const specialties = content.specialties as string[];
  return (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-display text-xl font-semibold text-stone-900 mb-1">
        {content.name as string}
      </h2>
      <p className="text-sm font-medium mb-0.5" style={{ color: prospectColor }}>
        {content.title as string}
      </p>
      <p className="text-xs text-stone-400 mb-4">
        {content.tenureYears as number} years at Bluehost
      </p>
      <p className="text-sm text-stone-600 leading-relaxed mb-4 max-w-xl">
        {content.bio as string}
      </p>
      <div className="flex flex-wrap gap-2">
        {specialties.map((s) => (
          <span key={s} className="text-xs px-2.5 py-1 rounded-full border border-stone-200 text-stone-600">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}

function UnderstandingSlide({ content, prospectColor }: { content: Record<string, unknown>; prospectColor: string }) {
  const painPoints = content.painPoints as { headline: string; description: string }[];
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-display text-2xl font-semibold text-stone-900 mb-6">
        {content.title as string}
      </h2>
      <div className="space-y-4">
        {painPoints.map((p, i) => (
          <div key={i} className="flex gap-4">
            <span className="text-lg font-bold shrink-0" style={{ color: prospectColor }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <p className="text-sm font-semibold text-stone-900">{p.headline}</p>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">{p.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WhyNowSlide({ content, prospectColor }: { content: Record<string, unknown>; prospectColor: string }) {
  const urgencyPoints = content.urgencyPoints as string[];
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-display text-2xl font-semibold text-stone-900 mb-2">
        {content.title as string}
      </h2>
      <p className="text-sm font-semibold mb-2" style={{ color: prospectColor }}>
        {content.triggerEvent as string}
      </p>
      <p className="text-sm text-stone-600 leading-relaxed mb-5 max-w-xl">
        {content.description as string}
      </p>
      <ul className="space-y-2">
        {urgencyPoints.map((pt, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-stone-700">
            <span className="font-bold shrink-0" style={{ color: prospectColor }}>→</span>
            {pt}
          </li>
        ))}
      </ul>
    </div>
  );
}

function SolutionSlide({ content, prospectColor }: { content: Record<string, unknown>; prospectColor: string }) {
  const products = content.products as { name: string; description: string; benefit: string }[];
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-display text-2xl font-semibold text-stone-900 mb-1">
        {content.title as string}
      </h2>
      <p className="text-sm text-stone-500 mb-5">{content.intro as string}</p>
      <div className="grid grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.name} className="p-3 border border-stone-100 rounded-lg bg-stone-50">
            <p className="text-xs font-semibold text-stone-900 mb-1">{p.name}</p>
            <p className="text-xs text-stone-500 mb-2 leading-relaxed">{p.description}</p>
            <p className="text-xs font-medium" style={{ color: prospectColor }}>{p.benefit}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProofSlide({ content, prospectColor }: { content: Record<string, unknown>; prospectColor: string }) {
  const sourceUrl = content.sourceUrl as string | undefined;
  return (
    <div className="flex flex-col justify-center h-full">
      <h2 className="text-display text-2xl font-semibold text-stone-900 mb-5">
        {content.title as string}
      </h2>
      <p className="text-3xl font-bold mb-3" style={{ color: prospectColor }}>
        {content.headlineMetric as string}
      </p>
      <p className="text-sm text-stone-600 leading-relaxed mb-5 max-w-xl">
        {content.narrative as string}
      </p>
      <div className="border-t border-stone-100 pt-4 flex items-center justify-between">
        <p className="text-xs text-stone-400">
          {content.customerName as string} · {content.industry as string}
        </p>
        {sourceUrl && (
          <a
            href={sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium hover:underline transition-colors"
            style={{ color: prospectColor }}
          >
            Read full story →
          </a>
        )}
      </div>
    </div>
  );
}

function RoiSlide({ content, prospectColor }: { content: Record<string, unknown>; prospectColor: string }) {
  const metrics = content.metrics as { label: string; value: string; description: string }[];
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-display text-2xl font-semibold text-stone-900 mb-5">
        {content.title as string}
      </h2>
      <div className="grid grid-cols-3 gap-5 mb-5">
        {metrics.map((m) => (
          <div key={m.label}>
            <p className="text-2xl font-bold mb-0.5" style={{ color: prospectColor }}>{m.value}</p>
            <p className="text-xs font-semibold text-stone-900 mb-0.5">{m.label}</p>
            <p className="text-xs text-stone-500 leading-relaxed">{m.description}</p>
          </div>
        ))}
      </div>
      <p className="text-sm text-stone-600 border-t border-stone-100 pt-4">
        {content.summary as string}
      </p>
    </div>
  );
}

function NextStepsSlide({ content, prospectColor }: { content: Record<string, unknown>; prospectColor: string }) {
  const steps = content.steps as { action: string; owner: string; timeline: string }[];
  return (
    <div className="flex flex-col h-full">
      <h2 className="text-display text-2xl font-semibold text-stone-900 mb-5">
        {content.title as string}
      </h2>
      <div className="space-y-3 mb-6">
        {steps.map((s, i) => (
          <div key={i} className="flex items-start gap-4">
            <span className="text-lg font-bold shrink-0 w-6" style={{ color: prospectColor }}>
              {i + 1}
            </span>
            <div className="flex-1">
              <p className="text-sm font-semibold text-stone-900">{s.action}</p>
              <p className="text-xs text-stone-400 mt-0.5">{s.owner} · {s.timeline}</p>
            </div>
          </div>
        ))}
      </div>
      <div
        className="mt-auto px-5 py-3 rounded-lg text-white text-sm font-medium text-center"
        style={{ backgroundColor: BLUEHOST_BLUE }}
      >
        {content.cta as string}
      </div>
    </div>
  );
}
