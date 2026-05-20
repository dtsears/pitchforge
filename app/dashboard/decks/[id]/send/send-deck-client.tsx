"use client";

import { useState } from "react";
import { Copy, Check, ExternalLink } from "lucide-react";
import type { GeneratedEmail } from "@/app/actions/generate-email";

type Props = {
  deckUrl: string;
  email: GeneratedEmail;
  contactEmail: string;
};

export function SendDeckClient({ deckUrl, email, contactEmail }: Props) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [subject, setSubject] = useState(email.subject);
  const [body, setBody] = useState(email.body);

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
            Preview
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

      {/* Email draft */}
      <section className="bg-white border border-stone-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-sm font-semibold text-stone-900">
              Outreach email
            </h2>
            <p className="text-xs text-stone-400 mt-0.5">
              AI-drafted · edit before sending
            </p>
          </div>
          <div className="flex items-center gap-2">
            {contactEmail && (
              <a
                href={mailtoLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium border border-stone-200 text-stone-600 rounded-lg hover:bg-stone-50 transition-colors"
              >
                Open in Mail
                <ExternalLink className="w-3 h-3" />
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
        <div className="mb-4">
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
      </section>
    </div>
  );
}
