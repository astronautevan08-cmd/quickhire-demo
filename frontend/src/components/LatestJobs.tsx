// import { ArrowRight } from "lucide-react";
// import JobTag from "./JobTag";

// const latestJobs = [
//   {
//     logo: "◎", logoBg: "bg-secondary", logoColor: "text-secondary-foreground",
//     title: "Social Media Assistant", company: "Nomad", location: "Paris, France",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
//   {
//     logo: "N", logoBg: "bg-primary", logoColor: "text-primary-foreground",
//     title: "Social Media Assistant", company: "Netlify", location: "Paris, France",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
//   {
//     logo: "⬡", logoBg: "bg-primary", logoColor: "text-primary-foreground",
//     title: "Brand Designer", company: "Dropbox", location: "San Francisco, USA",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
//   {
//     logo: "M", logoBg: "bg-secondary", logoColor: "text-secondary-foreground",
//     title: "Brand Designer", company: "Maze", location: "San Francisco, USA",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
//   {
//     logo: "T", logoBg: "bg-foreground", logoColor: "text-background",
//     title: "Interactive Developer", company: "Terraform", location: "Hamburg, Germany",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
//   {
//     logo: "U", logoBg: "bg-secondary", logoColor: "text-secondary-foreground",
//     title: "Interactive Developer", company: "Udacity", location: "Hamburg, Germany",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
//   {
//     logo: "P", logoBg: "bg-secondary", logoColor: "text-secondary-foreground",
//     title: "HR Manager", company: "Packer", location: "Lucern, Switzerland",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
//   {
//     logo: "W", logoBg: "bg-primary", logoColor: "text-primary-foreground",
//     title: "HR Manager", company: "Webflow", location: "Lucern, Switzerland",
//     tags: [{ label: "Full-Time", variant: "fulltime" as const }, { label: "Marketing", variant: "marketing" as const }, { label: "Design", variant: "design" as const }],
//   },
// ];

// const LatestJobs = () => {
//   return (
//     <section className="container mx-auto px-4 md:px-8 py-16">
//       <div className="flex items-center justify-between mb-10">
//         <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
//           <span className="italic">Latest</span> <span className="text-primary italic">jobs open</span>
//         </h2>
//         <a href="#" className="flex items-center gap-1 text-sm text-primary font-medium hover:underline">
//           Show all jobs <ArrowRight className="w-4 h-4" />
//         </a>
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         {latestJobs.map((job, i) => (
//           <div key={i} className="flex items-start gap-4 border border-border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer bg-card">
//             <div className={`w-12 h-12 rounded-md ${job.logoBg} ${job.logoColor} flex items-center justify-center text-sm font-bold shrink-0`}>
//               {job.logo}
//             </div>
//             <div>
//               <h3 className="font-semibold text-foreground mb-1">{job.title}</h3>
//               <p className="text-xs text-muted-foreground mb-3">{job.company} · {job.location}</p>
//               <div className="flex flex-wrap gap-2">
//                 {job.tags.map((tag, j) => (
//                   <JobTag key={j} label={tag.label} variant={tag.variant} />
//                 ))}
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>
//     </section>
//   );
// };

// export default LatestJobs;








"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import JobTag from "./JobTag";
import type { Job } from "@/lib/types";

export default function LatestJobs({
  jobs,
  loading,
}: {
  jobs: Job[];
  loading?: boolean;
}) {
  return (
    <section className="container mx-auto px-4 md:px-8 py-16">
      <div className="flex items-center justify-between mb-10">
        <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground">
          <span className="italic">Latest</span>{" "}
          <span className="text-primary italic">jobs open</span>
        </h2>

        <Link
          href="/"
          className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
        >
          Show all jobs <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {loading ? (
        <div className="text-sm text-muted-foreground">Loading...</div>
      ) : jobs.length === 0 ? (
        <div className="text-sm text-muted-foreground">No jobs found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <Link
              key={job.id}
              href={`/jobs/${job.id}`}
              className="flex items-start gap-4 border border-border rounded-lg p-5 hover:shadow-md transition-shadow cursor-pointer bg-card"
            >
              <div className="w-12 h-12 rounded-md bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold shrink-0">
                {job.company?.[0]?.toUpperCase() || "J"}
              </div>

              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  {job.title}
                </h3>
                <p className="text-xs text-muted-foreground mb-3">
                  {job.company} · {job.location}
                </p>

                <div className="flex flex-wrap gap-2">
                  <JobTag label="Full-Time" variant="fulltime" />
                  <JobTag label={job.category} variant="marketing" />
                  <JobTag label="Design" variant="design" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}