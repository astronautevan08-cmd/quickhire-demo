"use client";

import { useEffect, useMemo, useState } from "react";
import Container from "@/components/Container";
import Input from "@/components/Input";
import Select from "@/components/Select";
import JobCard from "@/components/JobCard";
import Button from "@/components/Button";
import { apiGet } from "@/lib/api";

export default function HomePage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");

  // Fetch jobs from backend using query params
  async function fetchJobs({ search, category, location }) {
    setLoading(true);
    setErr("");

    try {
      const qs = new URLSearchParams();
      if (search) qs.set("search", search);
      if (category) qs.set("category", category);
      if (location) qs.set("location", location);

      const res = await apiGet(`/api/jobs?${qs.toString()}`);
      setJobs(res.data || []);
    } catch (e) {
      setErr(e.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => {
      fetchJobs({ search, category, location });
    }, 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, category, location]);

  // Make dropdown options from current jobs (simple & fast)
  const categories = useMemo(() => {
    const set = new Set(jobs.map((j) => j.category).filter(Boolean));
    return Array.from(set);
  }, [jobs]);

  const locations = useMemo(() => {
    const set = new Set(jobs.map((j) => j.location).filter(Boolean));
    return Array.from(set);
  }, [jobs]);

  return (
    <main className="min-h-screen bg-gray-50">
      <Container className="py-10">
        <header className="flex flex-col gap-3">
          <h1 className="text-2xl font-bold text-gray-900">QuickHire</h1>
          <p className="text-sm text-gray-600">
            Find the right job and apply in minutes.
          </p>
        </header>

        {/* Filters */}
        <section className="mt-6 rounded-xl border border-gray-200 bg-white p-4">
          <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
            <Input
              placeholder="Search by title or company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />

            <Select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="">All Categories</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </Select>

            <Select value={location} onChange={(e) => setLocation(e.target.value)}>
              <option value="">All Locations</option>
              {locations.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </div>

          <div className="mt-3 flex items-center justify-between">
            <p className="text-sm text-gray-600">
              {loading ? "Loading..." : `${jobs.length} job(s) found`}
            </p>

            <Button
              variant="outline"
              onClick={() => {
                setSearch("");
                setCategory("");
                setLocation("");
              }}
            >
              Reset
            </Button>
          </div>
        </section>

        {/* Content */}
        <section className="mt-6">
          {err ? (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {err}
            </div>
          ) : loading ? (
            <div className="text-sm text-gray-600">Loading jobs...</div>
          ) : jobs.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
              No jobs found. Try changing your filters.
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {jobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))}
            </div>
          )}
        </section>
      </Container>
    </main>
  );
}