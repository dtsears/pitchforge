"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2, Check } from "lucide-react";
import { clearScrapeCache } from "@/app/actions/scrape-prospect";

export function ClearCacheButton() {
  const [isPending, startTransition] = useTransition();
  const [result, setResult] = useState<string | null>(null);

  function handleClick() {
    startTransition(async () => {
      const { deleted } = await clearScrapeCache();
      setResult(`Cleared ${deleted} cached URL${deleted !== 1 ? "s" : ""}`);
      setTimeout(() => setResult(null), 3000);
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-200 text-stone-500 rounded-lg hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors disabled:opacity-50 shrink-0"
    >
      {isPending ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin" />
      ) : result ? (
        <Check className="w-3.5 h-3.5 text-green-600" />
      ) : (
        <Trash2 className="w-3.5 h-3.5" />
      )}
      {result ?? "Clear scrape cache"}
    </button>
  );
}
