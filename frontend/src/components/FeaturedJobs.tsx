"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Job } from "@/lib/types";

/** Make a nice initial from company/title */
function getInitial(text?: string) {
  const t = (text || "").trim();
  return t ? t[0].toUpperCase() : "J";
}

/** Soft deterministic "brand" style based on text */
function getBrandClasses(seed?: string) {
  const s = (seed || "").toLowerCase();
  const palettes = [
    { bg: "bg-primary/10", fg: "text-primary", ring: "ring-primary/15" },
    { bg: "bg-emerald-500/10", fg: "text-emerald-600", ring: "ring-emerald-500/15" },
    { bg: "bg-indigo-500/10", fg: "text-indigo-600", ring: "ring-indigo-500/15" },
    { bg: "bg-orange-500/10", fg: "text-orange-600", ring: "ring-orange-500/15" },
    { bg: "bg-sky-500/10", fg: "text-sky-600", ring: "ring-sky-500/15" },
    { bg: "bg-violet-500/10", fg: "text-violet-600", ring: "ring-violet-500/15" },
  ];

  let hash = 0;
  for (let i = 0; i < s.length; i++) hash = (hash * 31 + s.charCodeAt(i)) >>> 0;
  return palettes[hash % palettes.length];
}

function clampText(text?: string, max = 90) {
  const t = (text || "").replace(/\s+/g, " ").trim();
  if (!t) return "Open role — apply now and grow with the team.";
  return t.length > max ? t.slice(0, max).trimEnd() + "…" : t;
}

export default function FeaturedJobs({
  jobs,
  loading,
}: {
  jobs: Job[];
  loading?: boolean;
}) {
  return (
    <section className="container mx-auto px-4 md:px-8 py-14">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          Featured <span className="text-primary">jobs</span>
        </h2>

        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-primary font-medium hover:underline"
        >
          Show all jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-sm text-muted-foreground">No featured jobs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {jobs.map((job) => {
            const seed = job.company || job.title;
            const brand = getBrandClasses(seed);
            const initial = getInitial(job.company || job.title);

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className={[
                  "group block bg-card border border-border rounded-xl p-6",
                  "transition-all duration-200",
                  "hover:shadow-md hover:-translate-y-0.5",
                  "focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/30",
                ].join(" ")}
              >
                {/* Top row: avatar + badge */}
                <div className="flex items-start justify-between gap-4">
                  <div
                    className={[
                      "h-12 w-12 rounded-lg ring-1",
                      brand.bg,
                      brand.fg,
                      brand.ring,
                      "flex items-center justify-center",
                      "text-lg font-semibold",
                    ].join(" ")}
                    aria-label={`${job.company || job.title} logo`}
                  >
                    {initial}
                  </div>

                  <span className="text-xs font-medium text-primary border border-primary/40 bg-primary/5 px-3 py-1 rounded-md">
                    Full Time
                  </span>
                </div>

                {/* Title */}
                <h3 className="mt-5 font-semibold text-foreground text-base leading-snug group-hover:text-foreground">
                  {job.title}
                </h3>

                {/* Meta */}
                <p className="mt-2 text-sm text-muted-foreground">
                  {job.company} <span className="mx-1">•</span> {job.location}
                </p>

                {/* Short description */}
                <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
                  {clampText(job.description, 85)}
                </p>

                {/* Tags */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-orange-500/10 text-orange-600">
                    {job.category || "Category"}
                  </span>
                  <span className="text-xs font-medium px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600">
                    Design
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}