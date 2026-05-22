"use client";

import { useState, useTransition } from "react";
import { Loader2, Globe, CheckCircle, AlertCircle, Cpu, Server } from "lucide-react";
import { scrapeProspect } from "@/app/actions/scrape-prospect";
import { createProspect } from "@/app/actions/create-prospect";
import type { ExtractedProspect } from "@/lib/schemas/prospect";

type Stage = "url" | "loading" | "review";

export function ProspectForm() {
  const [stage, setStage] = useState<Stage>("url");
  const [extracted, setExtracted] = useState<ExtractedProspect | null>(null);
  const [scrapedUrl, setScrapedUrl] = useState("");
  const [scrapeError, setScrapeError] = useState("");
  const [fromCache, setFromCache] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleScrape(formData: FormData) {
    setScrapeError("");
    setStage("loading");
    startTransition(async () => {
      const result = await scrapeProspect(formData);
      if (result.success) {
        setExtracted(result.data);
        setScrapedUrl(result.url);
        setFromCache(result.cached);
        setStage("review");
      } else {
        setScrapeError(result.error);
        setStage("url");
      }
    });
  }

  return (
    <div className="max-w-2xl">
      {/* ── URL input ── */}
      {stage === "url" && (
        <form action={handleScrape}>
          <label htmlFor="url" className="block text-sm font-medium text-stone-700 mb-2">
            Prospect website URL
          </label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
              <input
                id="url"
                name="url"
                type="text"
                placeholder="prospect.com"
                required
                className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent"
              />
            </div>
            <button
              type="submit"
              disabled={isPending}
              className="px-5 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors disabled:opacity-50"
            >
              Import
            </button>
          </div>
          {scrapeError && (
            <div className="mt-3 flex items-start gap-2 text-red-600 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
              {scrapeError}
            </div>
          )}
        </form>
      )}

      {/* ── Loading ── */}
      {stage === "loading" && (
        <div className="flex flex-col items-center justify-center py-16 text-stone-500">
          <Loader2 className="w-8 h-8 animate-spin mb-4 text-stone-400" />
          <p className="text-sm font-medium">Scraping website…</p>
          <p className="text-xs mt-1">Extracting brand data, signals, and tech stack</p>
        </div>
      )}

      {/* ── Review form ── */}
      {stage === "review" && extracted && (
        <form action={createProspect} className="space-y-6">
          {/* Hidden fields */}
          <input type="hidden" name="websiteUrl" value={scrapedUrl} />
          <input type="hidden" name="logoUrl" value={extracted.logoUrl ?? ""} />
          <input type="hidden" name="primaryColor" value={extracted.primaryColor ?? ""} />
          <input type="hidden" name="accentColor" value={extracted.accentColor ?? ""} />
          {extracted.inferredPains.map((pain, i) => (
            <input key={i} type="hidden" name="inferredPains" value={pain} />
          ))}
          {extracted.topOfferings && (
            <input type="hidden" name="topOfferings" value={JSON.stringify(extracted.topOfferings)} />
          )}
          {extracted.signals && (
            <input type="hidden" name="signals" value={JSON.stringify(extracted.signals)} />
          )}
          {extracted.techStack && (
            <input type="hidden" name="techStack" value={JSON.stringify(extracted.techStack)} />
          )}

          {/* Confidence badge */}
          <div className="flex items-center gap-2 p-3 bg-stone-50 border border-stone-200 rounded-lg">
            <CheckCircle className="w-4 h-4 text-amber-500 shrink-0" />
            <span className="text-xs text-stone-600">
              {fromCache ? (
                <><strong className="text-stone-900">Loaded from cache</strong> — previously scraped data. Review before saving.</>
              ) : (
                <>Import confidence: <strong className="text-stone-900">{Math.round(extracted.confidence * 100)}%</strong> — review and correct any fields before saving.</>
              )}
            </span>
          </div>

          {/* Tech stack */}
          {extracted.techStack && (
            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Server className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Tech Stack</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {extracted.techStack.hosting && (
                  <TechBadge label={extracted.techStack.hosting} type="hosting" />
                )}
                {extracted.techStack.cms && extracted.techStack.cms !== extracted.techStack.hosting && (
                  <TechBadge label={extracted.techStack.cms} type="cms" />
                )}
                {extracted.techStack.detected
                  .filter(d => d !== extracted.techStack!.hosting && d !== extracted.techStack!.cms)
                  .map(tech => (
                    <TechBadge key={tech} label={tech} type="other" />
                  ))
                }
                {!extracted.techStack.hosting && !extracted.techStack.cms && extracted.techStack.detected.length === 0 && (
                  <span className="text-xs text-stone-400">No tech stack detected</span>
                )}
              </div>
            </div>
          )}

          {/* Signals */}
          {extracted.signals && (
            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <div className="flex items-center gap-2 mb-3">
                <Cpu className="w-3.5 h-3.5 text-stone-400" />
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Signals</span>
              </div>
              <div className="flex flex-wrap gap-2">
                <SignalBadge label="Website Maintenance" active={extracted.signals.websiteMaintenance} />
                <SignalBadge label="AI Mentioned" active={extracted.signals.aiMentioned} />
                <SignalBadge label="Web Development" active={extracted.signals.webDevelopment} />
                <SignalBadge label="SEO Focus" active={extracted.signals.seoMentioned} />
              </div>
            </div>
          )}

          {/* Top offerings + fit */}
          {extracted.topOfferings && extracted.topOfferings.length > 0 && (
            <div className="p-4 bg-white border border-stone-200 rounded-xl">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block mb-3">
                Top Offerings &amp; Bluehost Fit
              </span>
              <div className="space-y-3">
                {extracted.topOfferings.map((offering, i) => (
                  <div key={i}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-stone-900 font-medium">{offering.name}</span>
                      <span className="text-xs font-semibold tabular-nums" style={{
                        color: offering.fitScore >= 80 ? "#16a34a" : offering.fitScore >= 50 ? "#d97706" : "#9ca3af"
                      }}>
                        {offering.fitScore}% fit
                      </span>
                    </div>
                    {/* Fit bar */}
                    <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden mb-1">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${offering.fitScore}%`,
                          backgroundColor: offering.fitScore >= 80 ? "#16a34a" : offering.fitScore >= 50 ? "#d97706" : "#d6d3d1"
                        }}
                      />
                    </div>
                    <p className="text-xs text-stone-400">{offering.fitReason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Inferred pains */}
          {extracted.inferredPains.length > 0 && (
            <fieldset>
              <legend className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-3">
                Inferred Buyer Pains
              </legend>
              <ul className="space-y-2">
                {extracted.inferredPains.map((pain, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-stone-700 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
                    <span className="text-amber-500 font-bold shrink-0">·</span>
                    {pain}
                  </li>
                ))}
              </ul>
            </fieldset>
          )}

          {/* Company details */}
          <fieldset>
            <legend className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
              Company
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Company name" name="companyName" defaultValue={extracted.companyName} required className="col-span-2" />
              <Field label="Tagline" name="tagline" defaultValue={extracted.tagline} className="col-span-2" />
              <Field label="Industry" name="industry" defaultValue={extracted.industry} />
              <Field label="Website" name="websiteUrlDisplay" defaultValue={scrapedUrl} disabled />
            </div>
          </fieldset>

          {/* Contact */}
          <fieldset>
            <legend className="text-xs font-semibold text-stone-500 uppercase tracking-wider mb-4">
              Contact (optional)
            </legend>
            <div className="grid grid-cols-2 gap-4">
              <Field label="Contact name" name="contactName" />
              <Field label="Title" name="contactTitle" />
              <Field label="Email" name="contactEmail" type="email" className="col-span-2" />
            </div>
          </fieldset>

          {/* Notes */}
          <div>
            <label className="block text-xs font-medium text-stone-600 mb-1.5">Notes</label>
            <textarea
              name="notes"
              rows={3}
              placeholder="Discovery call notes, deal context…"
              className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="submit" className="px-6 py-2.5 bg-stone-900 text-white text-sm font-medium rounded-lg hover:bg-stone-800 transition-colors">
              Save Prospect
            </button>
            <button type="button" onClick={() => setStage("url")} className="px-6 py-2.5 border border-stone-200 text-stone-600 text-sm font-medium rounded-lg hover:bg-stone-50 transition-colors">
              Start over
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function TechBadge({ label, type }: { label: string; type: "hosting" | "cms" | "other" }) {
  const colors = {
    hosting: "bg-blue-50 border-blue-200 text-blue-700",
    cms: "bg-purple-50 border-purple-200 text-purple-700",
    other: "bg-stone-50 border-stone-200 text-stone-600",
  };
  const prefix = { hosting: "Hosting: ", cms: "CMS: ", other: "" };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full border text-xs font-medium ${colors[type]}`}>
      {prefix[type]}{label}
    </span>
  );
}

function SignalBadge({ label, active }: { label: string; active: boolean }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-xs font-medium transition-colors ${
      active
        ? "bg-green-50 border-green-200 text-green-700"
        : "bg-stone-50 border-stone-200 text-stone-400"
    }`}>
      <span className={`w-1.5 h-1.5 rounded-full ${active ? "bg-green-500" : "bg-stone-300"}`} />
      {label}
    </span>
  );
}

function Field({
  label, name, defaultValue, type = "text", required, disabled, className,
}: {
  label: string; name: string; defaultValue?: string; type?: string;
  required?: boolean; disabled?: boolean; className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-medium text-stone-600 mb-1.5">
        {label}{required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        required={required}
        disabled={disabled}
        className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-stone-900 disabled:bg-stone-50 disabled:text-stone-400"
      />
    </div>
  );
}
