"use client";

import { useMemo, useState } from "react";
import type { Application } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink, X } from "lucide-react";

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleString();
}

function clamp(text: string, max = 90) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
}

export default function ApplicantsTable({ applications }: { applications: Application[] }) {
  const [openId, setOpenId] = useState<string | null>(null);

  const active = useMemo(
    () => applications.find((a) => a.id === openId) || null,
    [applications, openId]
  );

  async function copyEmail(email: string) {
    try {
      await navigator.clipboard.writeText(email);
    } catch {
      const el = document.createElement("textarea");
      el.value = email;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      el.remove();
    }
  }

  if (!applications || applications.length === 0) {
    return (
      <div className="border border-border rounded-xl p-6 bg-background">
        <p className="text-sm text-muted-foreground">No applicants yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className="border border-border rounded-xl bg-background overflow-hidden">
        <div className="px-5 py-4 border-b border-border bg-card">
          <h3 className="font-semibold text-foreground">Applicants ({applications.length})</h3>
          <p className="text-xs text-muted-foreground mt-1">
            Review candidate details, resume link, and cover note.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-muted/30 text-muted-foreground">
              <tr>
                <th className="text-left font-medium px-5 py-3">Candidate</th>
                <th className="text-left font-medium px-5 py-3">Resume</th>
                <th className="text-left font-medium px-5 py-3">Cover Note</th>
                <th className="text-left font-medium px-5 py-3">Applied</th>
              </tr>
            </thead>

            <tbody>
              {applications.map((a) => (
                <tr key={a.id} className="border-t border-border hover:bg-muted/20 transition">
                  <td className="px-5 py-4">
                    <div className="font-medium text-foreground">{a.name}</div>
                    <div className="text-muted-foreground flex items-center gap-2 mt-1">
                      <span className="truncate max-w-[220px]">{a.email}</span>
                      <Button
                        type="button"
                        variant="secondary"
                        className="h-7 px-2 text-xs"
                        onClick={() => copyEmail(a.email)}
                      >
                        <Copy className="w-3.5 h-3.5 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </td>

                  <td className="px-5 py-4">
                    <a
                      href={a.resume_link}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-primary hover:underline"
                    >
                      Open <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    <button
                      type="button"
                      className="text-left hover:underline"
                      onClick={() => setOpenId(a.id)}
                    >
                      {clamp(a.cover_note || "", 110)}
                    </button>
                  </td>

                  <td className="px-5 py-4 text-muted-foreground">
                    {formatDate(a.created_at)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Cover Note Modal */}
      {active && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setOpenId(null)}
        >
          <div
            className="w-full max-w-2xl bg-background border border-border rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-start justify-between gap-4">
              <div>
                <h4 className="text-lg font-semibold text-foreground">Cover Note</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {active.name} • {active.email}
                </p>
              </div>

              <button
                type="button"
                className="h-9 w-9 rounded-lg hover:bg-muted/60 flex items-center justify-center"
                onClick={() => setOpenId(null)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <div className="p-5 whitespace-pre-wrap text-sm text-foreground leading-relaxed">
              {active.cover_note}
            </div>

            <div className="p-5 pt-0 flex items-center justify-end gap-2">
              <a
                href={active.resume_link}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-primary hover:underline inline-flex items-center gap-1"
              >
                Open Resume <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}