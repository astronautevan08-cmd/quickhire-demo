import Link from "next/link";

export default function JobCard({ job }) {
  return (
    <Link
      href={`/jobs/${job.id}`}
      className="block rounded-xl border border-gray-200 bg-white p-4 transition hover:shadow-sm"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-base font-semibold text-gray-900">{job.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{job.company}</p>
        </div>

        <span className="rounded-full border border-gray-200 px-3 py-1 text-xs text-gray-700">
          {job.category}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
        <span className="rounded-md bg-gray-50 px-2 py-1">{job.location}</span>
        <span className="text-gray-300">•</span>
        <span className="text-gray-500">
          {new Date(job.created_at).toLocaleDateString()}
        </span>
      </div>

      <p className="mt-3 line-clamp-2 text-sm text-gray-700">
        {job.description}
      </p>

      <div className="mt-4 text-sm font-medium text-black">View details →</div>
    </Link>
  );
}