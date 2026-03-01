"use client";

import type { Application } from "@/lib/types";

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

export default function ApplicantsTable({
  applications,
}: {
  applications: Application[];
}) {
  if (!applications || applications.length === 0) {
    return (
      <div className="border border-border rounded-xl p-6 bg-card">
        <p className="text-sm text-muted-foreground">No applicants yet.</p>
      </div>
    );
  }

  return (
    <div className="border border-border rounded-xl bg-card overflow-hidden">
      <div className="px-5 py-4 border-b border-border">
        <h3 className="font-semibold text-foreground">
          Applicants ({applications.length})
        </h3>
        <p className="text-xs text-muted-foreground mt-1">
          Latest applications are shown below.
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="text-left font-medium px-5 py-3">Candidate</th>
              <th className="text-left font-medium px-5 py-3">Resume</th>
              <th className="text-left font-medium px-5 py-3">Cover Note</th>
              <th className="text-left font-medium px-5 py-3">Applied</th>
            </tr>
          </thead>

          <tbody>
            {applications.map((a) => (
              <tr key={a.id} className="border-t border-border">
                <td className="px-5 py-4">
                  <div className="font-medium text-foreground">{a.name}</div>
                  <div className="text-muted-foreground">{a.email}</div>
                </td>

                <td className="px-5 py-4">
                  <a
                    href={a.resume_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary hover:underline"
                  >
                    Open link
                  </a>
                </td>

                <td className="px-5 py-4 text-muted-foreground">
                  {clamp(a.cover_note || "", 110)}
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
  );
}