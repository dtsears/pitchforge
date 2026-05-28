"use client";

import { useState, useTransition } from "react";
import { Star } from "lucide-react";
import { toggleFavoriteProduct } from "@/app/actions/toggle-favorite";

export function FavoriteButton({
  productId,
  initialFavorited,
}: {
  productId: string;
  initialFavorited: boolean;
}) {
  const [favorited, setFavorited] = useState(initialFavorited);
  const [isPending, startTransition] = useTransition();

  function toggle(e: React.MouseEvent) {
    e.preventDefault(); // don't trigger the label/checkbox
    e.stopPropagation();
    startTransition(async () => {
      const next = await toggleFavoriteProduct(productId);
      setFavorited(next);
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      className="shrink-0 p-1 rounded transition-colors hover:bg-stone-100 disabled:opacity-40"
      title={favorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Star
        className="w-3.5 h-3.5 transition-colors"
        style={{
          fill: favorited ? "#f59e0b" : "transparent",
          color: favorited ? "#f59e0b" : "#d6d3d1",
        }}
      />
    </button>
  );
}
