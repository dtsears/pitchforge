"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

type Product = {
  id: string;
  name: string;
  description: string;
  category: string | null;
  targetBuyerProfile: string;
};

const CATEGORY_COLORS: Record<string, string> = {
  Hosting: "bg-blue-50 border-blue-100 text-blue-700",
  Agency: "bg-purple-50 border-purple-100 text-purple-700",
  AI: "bg-amber-50 border-amber-100 text-amber-700",
  eCommerce: "bg-green-50 border-green-100 text-green-700",
  "Professional Services": "bg-stone-50 border-stone-200 text-stone-600",
  Other: "bg-stone-50 border-stone-200 text-stone-600",
};

export function ProductGroups({
  grouped,
}: {
  grouped: Record<string, Product[]>;
}) {
  // Start all groups open
  const [open, setOpen] = useState<Record<string, boolean>>(
    Object.fromEntries(Object.keys(grouped).map((k) => [k, true]))
  );

  function toggle(cat: string) {
    setOpen((prev) => ({ ...prev, [cat]: !prev[cat] }));
  }

  return (
    <div className="space-y-3">
      {Object.entries(grouped).map(([category, products]) => (
        <div
          key={category}
          className="border border-stone-200 rounded-xl overflow-hidden bg-white"
        >
          {/* Category header */}
          <button
            type="button"
            onClick={() => toggle(category)}
            className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <span
                className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full border ${CATEGORY_COLORS[category] ?? CATEGORY_COLORS.Other}`}
              >
                {category}
              </span>
              <span className="text-xs text-stone-400">
                {products.length} product{products.length !== 1 ? "s" : ""}
              </span>
            </div>
            <ChevronDown
              className="w-4 h-4 text-stone-400 transition-transform duration-150"
              style={{ transform: open[category] ? "rotate(180deg)" : "rotate(0)" }}
            />
          </button>

          {/* Products */}
          {open[category] && (
            <div className="divide-y divide-stone-100 border-t border-stone-100">
              {products.map((product) => (
                <label
                  key={product.id}
                  className="flex items-start gap-3 px-4 py-3 cursor-pointer hover:bg-stone-50 transition-colors has-[:checked]:bg-stone-50"
                >
                  <input
                    type="checkbox"
                    name="productIds"
                    value={product.id}
                    className="mt-0.5 accent-stone-900"
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-stone-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-stone-500 mt-0.5 leading-relaxed line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
