"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { SlidePreview } from "@/app/dashboard/decks/[id]/slide-preview";

type Slide = { id: string; type: string; order: number; content: unknown };

type Deck = {
  prospect: { companyName: string; primaryColor: string | null };
  org: { name: string; primaryColor: string };
  slides: Slide[];
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

export function PublicDeckViewer({ deck }: { deck: Deck }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = deck.slides[activeIndex];
  const prospectColor = deck.prospect.primaryColor ?? "#d6d3d1";

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Minimal public header */}
      <header className="border-b border-stone-200 bg-white px-6 h-12 flex items-center justify-between">
        <span className="text-display text-sm font-semibold text-stone-900">
          {deck.org.name}
        </span>
        <span className="text-xs text-stone-400">
          Prepared for {deck.prospect.companyName}
        </span>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10">
        {/* Slide canvas */}
        <div
          className="w-full max-w-4xl bg-white rounded-xl shadow-lg overflow-hidden border border-stone-200"
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
        <div className="flex items-center justify-between w-full max-w-4xl mt-4">
          <button
            onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
            disabled={activeIndex === 0}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-stone-600 hover:text-stone-900 disabled:opacity-30 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {deck.slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setActiveIndex(i)}
                className={`w-1.5 h-1.5 rounded-full transition-colors ${
                  i === activeIndex ? "bg-stone-900" : "bg-stone-300"
                }`}
              />
            ))}
          </div>

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

        <p className="text-xs text-stone-400 mt-3">
          {SLIDE_LABELS[activeSlide?.type ?? ""] ?? ""} · {activeIndex + 1} of{" "}
          {deck.slides.length}
        </p>
      </div>
    </div>
  );
}
