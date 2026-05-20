"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink, Loader2, Mail, RefreshCw } from "lucide-react";
import { generateOutreachEmail, type GeneratedEmail } from "@/app/actions/generate-email";

type EmailType = "outreach" | "followup";

type Props = {
  deckUrl: string;
  repName: string;
  repTitle: string;
  prospectCompany: string;
  prospectIndustry?: string | null;
  inferredPains: string[];
  contactName?: string | null;
  contactEmail: string;
};

export function SendDeckClient({
  deckUrl,
  repName,
  repTitle,
  prospectCompany,
  prospectIndustry,
  inferredPains,
  contactName,
  contactEmail,
}: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeType, setActiveType] = useState<EmailType | null>(null);
  const [email, setEmail] = useState<GeneratedEmail | null>(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  async function generate(type: EmailType) {
    setIsGenerating(true);
    setActiveType(type);
    setEmail(null);

    try {
      const result = await generateOutreachEmail({
        type,
        repName,
        repTitle,
        prospectCompany,
        prospectIndustry,
        inferredPains,
        deckUrl,
        contactName,
      });
      setEmail(result);
      setSubject(result.subject);
      setBody(result.body);
    } finally {
      setIsGenerating(false);
    }
  }

  async function copy(text: string, setter: (v: boolean) => void) {
    await navigator.clipboard.writeText(text);
    setter(true);
    setTimeout(() => setter(false), 2000);
  }

  const mailtoLink = `mailto:${contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  return (
    <div className="space-y-6">
      {/* Share link */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-stone-900">Share link</h2>
          <a
            href={deckUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs text-stone-500 hover:text-stone-900 transition-colors"
          >
            Preview deck
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-stone-700 truncate">
            {deckUrl}
          </code>
          <button
            onClick={() => copy(deckUrl, setCopiedLink)}
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-colors shrink-0"
          >
            {copiedLink ? (
              <><Check className="w-3 h-3" /> Copied</>
            ) : (
              <><Copy className="w-3 h-3" /> Copy link</>
            )}
          </button>
        </div>
      </section>

      {/* Email section */}
      <section className="bg-white border border-stone-200 rounded-xl overflow-hidden">
        {/* Type selector */}
        <div className="border-b border-stone-100 p-5">
          <h2 className="text-sm font-semibold text-stone-900 mb-1">
            Draft an email
          </h2>
          <p className="text-xs text-stone-400 mb-4">
            Choose a type — only one is generated at a time.
          </p>
          <div className="grid grid-cols-2 gap-3">
            <EmailTypeButton
              active={activeType === "outreach"}
              loading={isGenerating && activeType === "outreach"}
              onClick={() => generate("outreach")}
              label="Outreach"
              description="First contact. Personalized to their pain points."
            />
            <EmailTypeButton
              active={activeType === "followup"}
              loading={isGenerating && activeType === "followup"}
              onClick={() => generate("followup")}
              label="Follow-up"
              description="Post-meeting. Recaps the conversation."
            />
          </div>
        </div>

        {/* Loading state */}
        {isGenerating && (
          <div className="flex items-center justify-center gap-2 py-10 text-stone-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" />
            Drafting {activeType === "outreach" ? "outreach" : "follow-up"} email…
          </div>
        )}

        {/* Generated email */}
        {email && !isGenerating && (
          <div className="p-5 space-y-4">
            {/* Actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs text-stone-400">
                  AI-drafted · edit before sending
                </span>
                <button
                  onClick={() => generate(activeType!)}
                  className="inline-flex items-center gap-1 text-xs text-stone-400 hover:text-stone-700 transition-colors"
                  title="Regenerate"
                >
                  <RefreshCw className="w-3 h-3" />
                  Regenerate
                </button>
              </div>
              <div className="flex items-center gap-2">
                {contactEmail && (
                  <a
                    href={mailtoLink}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
                  >
                    <Mail className="w-3 h-3" />
                    Open in Mail
                  </a>
                )}
                <button
                  onClick={() =>
                    copy(`Subject: ${subject}\n\n${body}`, setCopiedEmail)
                  }
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-stone-900 text-white rounded-lg hover:bg-stone-700 transition-colors"
                >
                  {copiedEmail ? (
                    <><Check className="w-3 h-3" /> Copied</>
                  ) : (
                    <><Copy className="w-3 h-3" /> Copy email</>
                  )}
                </button>
              </div>
            </div>

            {/* Subject */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">
                Subject
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full px-3 py-2 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-stone-900"
              />
            </div>

            {/* Body */}
            <div>
              <label className="block text-xs font-medium text-stone-500 mb-1.5">
                Body
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                className="w-full px-3 py-2.5 border border-stone-200 rounded-lg text-sm text-stone-900 leading-relaxed focus:outline-none focus:ring-2 focus:ring-stone-900 resize-none font-mono"
              />
            </div>
          </div>
        )}

        {/* Empty state */}
        {!email && !isGenerating && (
          <div className="py-10 text-center text-stone-400 text-xs">
            Select a type above to draft your email.
          </div>
        )}
      </section>
    </div>
  );
}

function EmailTypeButton({
  active,
  loading,
  onClick,
  label,
  description,
}: {
  active: boolean;
  loading: boolean;
  onClick: () => void;
  label: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`text-left p-4 rounded-xl border transition-all ${
        active
          ? "border-stone-900 bg-stone-900 text-white"
          : "border-stone-200 hover:border-stone-400"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Mail className={`w-3.5 h-3.5 ${active ? "text-white" : "text-stone-400"}`} />
        )}
        <span className={`text-sm font-semibold ${active ? "text-white" : "text-stone-900"}`}>
          {label}
        </span>
      </div>
      <p className={`text-xs leading-relaxed ${active ? "text-white/70" : "text-stone-400"}`}>
        {description}
      </p>
    </button>
  );
}
