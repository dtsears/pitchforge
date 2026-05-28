"use client";

import { useState, useTransition } from "react";
import { Trash2, Loader2 } from "lucide-react";
import { deleteProspect } from "@/app/actions/delete-prospect";

type Props = {
  prospectId: string;
  companyName: string;
  deckCount: number;
};

export function DeleteProspectButton({ prospectId, companyName, deckCount }: Props) {
  const [isPending, startTransition] = useTransition();
  const [confirming, setConfirming] = useState(false);

  function handleClick() {
    if (!confirming) {
      setConfirming(true);
      return;
    }
    startTransition(async () => {
      await deleteProspect(prospectId);
      setConfirming(false);
    });
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-red-600 max-w-[140px] leading-tight">
          {deckCount > 0
            ? `Deletes ${deckCount} deck${deckCount > 1 ? "s" : ""} too.`
            : "Delete this prospect?"}
        </span>
        <button
          onClick={handleClick}
          disabled={isPending}
          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          {isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : "Confirm"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="px-2.5 py-1.5 text-xs font-medium text-stone-500 border border-stone-200 rounded-lg hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      className="p-1.5 text-stone-300 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
      title="Delete prospect"
    >
      <Trash2 className="w-3.5 h-3.5" />
    </button>
  );
}
