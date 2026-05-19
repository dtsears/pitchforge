"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlidePreview } from "./slide-preview";

type Slide = {
  id: string;
  type: string;
  order: number;
  content: unknown;
};

type Deck = {
  id: string;
  prospect: {
    companyName: string;
    primaryColor: string | null;
    accentColor: string | null;
    logoUrl: string | null;
  };
  slides: Slide[];
  user: { name: string | null };
};

const SLIDE_LABELS: Record<string, string> = {
  COVER: "Cover",
  REP: "Introduction",
  UNDERSTANDING: "What We Heard",
  WHY_NOW: "Why Now",
  SOLUTION: "Our Solution",
  PROOF: "Proof",
  ROI: "Business Case",
  NEXT_STEPS: "Next Steps",
};

export function DeckViewer({ deck }: { deck: Deck }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = deck.slides[activeIndex];

  const prospectColor = deck.prospect.primaryColor ?? "#d6d3d1";

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Top bar */}
      <header className="border-b border-stone-200 bg-white flex items-center justify-between px-6 h-14 shrink-0">
        <div className="flex items-center gap-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1 text-sm text-stone-500 hover:text-stone-900 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Dashboard
          </Link>
          <span className="text-stone-200">|</span>
          <span className="text-display font-semibold text-stone-900 text-sm">
            {deck.prospect.companyName}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-stone-400">
            Slide {activeIndex + 1} of {deck.slides.length}
          </span>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-52 shrink-0 bg-white border-r border-stone-200 overflow-y-auto">
          <div className="p-3 space-y-1.5">
            {deck.slides.map((slide, i) => (
              <button
                key={slide.id}
                onClick={() => setActiveIndex(i)}
                className={`w-full text-left rounded-lg transition-colors ${
                  i === activeIndex
                    ? "bg-stone-900 text-white"
                    : "hover:bg-stone-50 text-stone-600"
                }`}
              >
                {/* Mini slide thumbnail */}
                <div
                  className="w-full rounded-t-lg overflow-hidden"
                  style={{ aspectRatio: "16/9" }}
                >
                  <MiniSlide
                    slide={slide}
                    prospectColor={prospectColor}
                    active={i === activeIndex}
                  />
                </div>
                <div className="px-2 py-1.5">
                  <p className={`text-xs font-medium ${i === activeIndex ? "text-white" : "text-stone-500"}`}>
                    {i + 1}. {SLIDE_LABELS[slide.type] ?? slide.type}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </aside>

        {/* Main preview */}
        <main className="flex-1 flex flex-col items-center justify-center p-8 overflow-auto">
          <div className="w-full max-w-4xl">
            {/* Slide canvas */}
            <div
              className="w-full bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200"
              style={{ aspectRatio: "16/9" }}
            >
              {activeSlide && (
                <SlidePreview
                  slide={activeSlide}
                  prospectColor={prospectColor}
                  prospectName={deck.prospect.companyName}
                />
              )}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                disabled={activeIndex === 0}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
                Previous
              </button>
              <span className="text-xs text-stone-400">
                {SLIDE_LABELS[activeSlide?.type ?? ""] ?? ""}
              </span>
              <button
                onClick={() =>
                  setActiveIndex((i) => Math.min(deck.slides.length - 1, i + 1))
                }
                disabled={activeIndex === deck.slides.length - 1}
                className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
              >
                Next
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function MiniSlide({
  slide,
  prospectColor,
  active,
}: {
  slide: Slide;
  prospectColor: string;
  active: boolean;
}) {
  return (
    <div className="w-full h-full bg-white relative text-[6px] leading-tight p-1">
      {/* Accent bar */}
      <div className="flex h-0.5 mb-0.5">
        <div className="flex-1 bg-[#003087]" />
        <div className="flex-1" style={{ backgroundColor: prospectColor }} />
      </div>
      <div
        className={`font-semibold truncate ${active ? "text-stone-400" : "text-stone-500"}`}
      >
        {SLIDE_LABELS[slide.type]}
      </div>
    </div>
  );
}
