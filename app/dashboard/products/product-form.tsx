"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

type Props = {
  action: (formData: FormData) => Promise<void>;
  defaultValues?: {
    name?: string;
    description?: string;
    targetBuyerProfile?: string;
    headline?: string;
    bullets?: string;
    proof?: string;
  };
  submitLabel?: string;
};

export function ProductForm({ action, defaultValues, submitLabel = "Save" }: Props) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await action(formData);
      router.push("/dashboard/products");
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Field label="Product name" name="name" required defaultValue={defaultValues?.name} />
      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1.5">
          Description <span className="text-red-400">*</span>
        </label>
        <textarea
          name="description"
          rows={3}
          required
          defaultValue={defaultValues?.description}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-600 mb-1.5">
          Target buyer profile <span className="text-red-400">*</span>
        </label>
        <textarea
          name="targetBuyerProfile"
          rows={2}
          required
          defaultValue={defaultValues?.targetBuyerProfile}
          className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
        />
      </div>

      <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 space-y-4">
        <p className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
          Slide Content Blocks
        </p>
        <Field
          label="Headline"
          name="headline"
          placeholder='e.g. "Fast WordPress hosting, even in traffic spikes"'
          defaultValue={defaultValues?.headline}
        />
        <div>
          <label className="block text-xs font-medium text-stone-600 mb-1.5">
            Bullet points
            <span className="text-stone-400 font-normal ml-1">— one per line</span>
          </label>
          <textarea
            name="bullets"
            rows={4}
            defaultValue={defaultValues?.bullets}
            placeholder={"Automatic updates\nDaily backups\n24/7 support"}
            className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none font-mono"
          />
        </div>
        <Field
          label="Proof line"
          name="proof"
          placeholder='e.g. "99.9% uptime SLA"'
          defaultValue={defaultValues?.proof}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50 inline-flex items-center gap-2"
        >
          {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
          {submitLabel}
        </button>
        <button
          type="button"
          onClick={() => router.push("/dashboard/products")}
          className="px-6 py-2.5 border border-stone-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

function Field({
  label, name, required, defaultValue, placeholder,
}: {
  label: string; name: string; required?: boolean; defaultValue?: string; placeholder?: string;
}) {
  return (
    <div>
      <label className="block text-xs font-medium text-stone-600 mb-1.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type="text"
        name={name}
        required={required}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900"
      />
    </div>
  );
}
