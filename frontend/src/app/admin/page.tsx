"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Plus, Search, Briefcase, Users, MapPin, Tag, X, Star, Eye } from "lucide-react";

import { useToast } from "@/hooks/use-toast";
import {
  useJobs,
  useJob,
  useCreateJob,
  useDeleteJob,
  useSetFeatured,
} from "@/hooks/useJobsApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import ApplicantsTable from "@/components/admin/ApplicantsTable";

type JobForm = {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  is_featured?: boolean;
};

function getErrorMessage(err: unknown) {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  if (err && typeof err === "object") {
    const anyErr = err as any;
    if (typeof anyErr.message === "string") return anyErr.message;
    try {
      return JSON.stringify(err);
    } catch {
      return "Something went wrong";
    }
  }
  return "Something went wrong";
}

function formatDate(dateString?: string) {
  if (!dateString) return "";
  const d = new Date(dateString);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleDateString();
}

function downloadCSV(filename: string, rows: Record<string, string>[]) {
  const headers = Object.keys(rows[0] || {});
  const escape = (v: string) => `"${(v ?? "").replace(/"/g, '""')}"`;
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => escape(r[h] ?? "")).join(",")),
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function AdminPage() {
  const { toast } = useToast();

  // Filters (server-side)
  const [filters, setFilters] = useState({
    search: "",
    location: "",
    category: "",
  });

  const { data: jobs, isLoading, error } = useJobs(filters);
  const { data: allJobs } = useJobs({}); // unfiltered (for dropdown & stats)
  const create = useCreateJob();
  const del = useDeleteJob();
  const feature = useSetFeatured(); //  NEW

  // Selected job
  const [selectedJobId, setSelectedJobId] = useState<string>("");

  // Modal
  const [openCreate, setOpenCreate] = useState(false);

  // Auto-select first job
  useEffect(() => {
    if (!selectedJobId && jobs && jobs.length > 0) setSelectedJobId(jobs[0].id);
  }, [jobs, selectedJobId]);

  // If selected disappears due to filters/deleting
  useEffect(() => {
    if (!jobs) return;
    if (selectedJobId && !jobs.some((j) => j.id === selectedJobId)) setSelectedJobId("");
  }, [jobs, selectedJobId]);

  const selectedJobQuery = useJob(selectedJobId);
  const selectedJob = selectedJobQuery.data;
  const applicants = useMemo(() => selectedJob?.applications || [], [selectedJob]);

  // Dropdown options from unfiltered jobs
  const categoryOptions = useMemo(() => {
    const source = allJobs || [];
    const set = new Set<string>();
    source.forEach((j) => {
      const v = (j.category || "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allJobs]);

  const locationOptions = useMemo(() => {
    const source = allJobs || [];
    const set = new Set<string>();
    source.forEach((j) => {
      const v = (j.location || "").trim();
      if (v) set.add(v);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allJobs]);

  // Stats
  const totalJobs = (allJobs || []).length;

  //  FIX: total applicants from application_count
  const totalApplicants = useMemo(() => {
  return (allJobs || []).reduce((sum, j) => {
    const raw = (j.application_count ?? 0) as any;
    const n = typeof raw === "string" ? Number(raw) : Number(raw);
    return sum + (Number.isFinite(n) ? n : 0);
  }, 0);
}, [allJobs]);

  const featuredCount = useMemo(() => {
    return (allJobs || []).filter((j) => j.is_featured).length;
  }, [allJobs]);

  const form = useForm<JobForm>({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      category: "",
      description: "",
      is_featured: false,
    },
  });

  async function onCreate(values: JobForm) {
    try {
      const created = await create.mutateAsync(values);
      toast({ title: "Job created" });
      form.reset({ title: "", company: "", location: "", category: "", description: "", is_featured: false });
      setOpenCreate(false);
      if (created?.id) setSelectedJobId(created.id);
    } catch (err) {
      toast({
        title: "Create failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  async function onDelete(id: string) {
    try {
      await del.mutateAsync(id);
      toast({ title: "Job deleted" });
      if (selectedJobId === id) setSelectedJobId("");
    } catch (err) {
      toast({
        title: "Delete failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  async function onToggleFeatured(id: string, next: boolean) {
    try {
      await feature.mutateAsync({ id, is_featured: next });
      toast({ title: next ? "Marked as Featured" : "Removed from Featured" });
    } catch (err) {
      toast({
        title: "Update failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  function exportApplicantsCSV() {
    if (!selectedJob) return;
    if (!applicants.length) {
      toast({ title: "No applicants to export" });
      return;
    }

    const rows = applicants.map((a) => ({
      job_title: selectedJob.title,
      job_company: selectedJob.company,
      name: a.name,
      email: a.email,
      resume_link: a.resume_link,
      cover_note: a.cover_note,
      applied_at: a.created_at || "",
    }));

    downloadCSV(`applicants-${selectedJob.id}.csv`, rows);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top header bar */}
      <div className="border-b border-border bg-card/60 backdrop-blur">
        <div className="container mx-auto px-4 md:px-8 py-5 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Manage jobs, applicants, and featured listings.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
              ← Back
            </Link>
            <Button onClick={() => setOpenCreate(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Post a job
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8">
        {/* Stat cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Total jobs</p>
              <div className="h-9 w-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                <Briefcase className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{totalJobs}</p>
            <p className="mt-1 text-xs text-muted-foreground">All job posts</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Applicants (selected)</p>
              <div className="h-9 w-9 rounded-lg bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{applicants.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">For selected job</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Applicants (total)</p>
              <div className="h-9 w-9 rounded-lg bg-sky-500/10 text-sky-600 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{totalApplicants}</p>
            <p className="mt-1 text-xs text-muted-foreground">Across all jobs</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">Featured jobs</p>
              <div className="h-9 w-9 rounded-lg bg-yellow-500/10 text-yellow-600 flex items-center justify-center">
                <Star className="w-4 h-4" />
              </div>
            </div>
            <p className="mt-3 text-3xl font-bold text-foreground">{featuredCount}</p>
            <p className="mt-1 text-xs text-muted-foreground">Shown in Featured section</p>
          </div>
        </div>

        {/* Main layout */}
        <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
          {/* Left: Jobs */}
          <div className="xl:col-span-5 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div>
                <h2 className="font-semibold text-foreground">Jobs</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Search & filter jobs (server-side)
                </p>
              </div>

              {/* Filters */}
              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="relative">
                  <Search className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <Input
                    placeholder="Search"
                    value={filters.search}
                    onChange={(e) => setFilters((p) => ({ ...p, search: e.target.value }))}
                    className="pl-9"
                  />
                </div>

                <div className="relative">
                  <Tag className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={filters.category}
                    onChange={(e) => setFilters((p) => ({ ...p, category: e.target.value }))}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 pl-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">All categories</option>
                    {categoryOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="relative">
                  <MapPin className="w-4 h-4 text-muted-foreground absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    value={filters.location}
                    onChange={(e) => setFilters((p) => ({ ...p, location: e.target.value }))}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 pl-9 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                  >
                    <option value="">All locations</option>
                    {locationOptions.map((l) => (
                      <option key={l} value={l}>
                        {l}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Clear */}
              <div className="mt-3 flex justify-end">
                <button
                  type="button"
                  onClick={() => setFilters({ search: "", category: "", location: "" })}
                  className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-4"
                >
                  Clear filters
                </button>
              </div>

              {/* List */}
              <div className="mt-4 space-y-3">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Loading...</div>
                ) : error ? (
                  <div className="text-sm text-destructive">
                    Failed to load jobs: {getErrorMessage(error)}
                  </div>
                ) : (jobs || []).length === 0 ? (
                  <div className="text-sm text-muted-foreground">No jobs found.</div>
                ) : (
                  (jobs || []).map((j) => {
                    const active = selectedJobId === j.id;
                    return (
                      <div
                        key={j.id}
                        className={[
                          "flex items-start justify-between gap-4 border rounded-xl p-4 transition",
                          active ? "border-primary/40 bg-primary/5" : "border-border bg-background hover:bg-muted/30",
                        ].join(" ")}
                      >
                        <button
                          type="button"
                          onClick={() => setSelectedJobId(j.id)}
                          className="text-left flex-1"
                        >
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-foreground">{j.title}</p>
                            {j.is_featured && (
                              <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-700">
                                Featured
                              </span>
                            )}
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {j.company} • {j.location} • {j.category}
                          </p>

                          <p className="text-xs text-muted-foreground mt-1">
                            Posted: {formatDate(j.created_at)} • Applicants: {j.application_count || 0}
                          </p>
                        </button>

                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            variant="secondary"
                            disabled={feature.isPending}
                            onClick={() => onToggleFeatured(j.id, !j.is_featured)}
                          >
                            {j.is_featured ? "Unfeature" : "Feature"}
                          </Button>

                          <Link href={`/jobs/${j.id}`} className="inline-flex">
    <Button type="button" variant="outline" className="h-9">
      <Eye className="w-4 h-4 mr-2" />
      View
    </Button>
  </Link>

                          <Button
                            variant="destructive"
                            onClick={() => onDelete(j.id)}
                            disabled={del.isPending}
                          >
                            {del.isPending ? "..." : "Delete"}
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          {/* Right: Applications */}
          <div className="xl:col-span-7 space-y-6">
            <div className="rounded-xl border border-border bg-card p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="font-semibold text-foreground">Applications</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Applicants for the selected job will appear here.
                  </p>
                </div>

                <Button
                  type="button"
                  variant="secondary"
                  onClick={exportApplicantsCSV}
                  disabled={!selectedJob || applicants.length === 0}
                >
                  Export CSV
                </Button>
              </div>

              {!selectedJobId ? (
                <div className="mt-6 border border-dashed border-border rounded-xl p-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    No job selected. Choose a job from the list to review applicants.
                  </p>
                </div>
              ) : selectedJobQuery.isLoading ? (
                <div className="mt-6 text-sm text-muted-foreground">Loading job details...</div>
              ) : selectedJobQuery.error || !selectedJob ? (
                <div className="mt-6 text-sm text-destructive">
                  Failed to load job details: {getErrorMessage(selectedJobQuery.error)}
                </div>
              ) : (
                <div className="mt-6 space-y-5">
                  <div className="border border-border rounded-xl p-5 bg-background">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-lg font-semibold text-foreground">{selectedJob.title}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {selectedJob.company} • {selectedJob.location} • {selectedJob.category}
                        </p>
                        <p className="text-xs text-muted-foreground mt-2">
                          Applicants: {applicants.length}
                        </p>
                      </div>

                      <Link
                        href={`/jobs/${selectedJob.id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        Open job →
                      </Link>
                    </div>
                  </div>

                  <ApplicantsTable applications={applicants} />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Create Job Modal */}
      {openCreate && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4"
          onClick={() => setOpenCreate(false)}
        >
          <div
            className="w-full max-w-xl bg-background border border-border rounded-2xl shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-foreground">Post a new job</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  You can mark a job as Featured to appear on homepage.
                </p>
              </div>
              <button
                type="button"
                className="h-9 w-9 rounded-lg hover:bg-muted/60 flex items-center justify-center"
                onClick={() => setOpenCreate(false)}
                aria-label="Close"
              >
                <X className="w-5 h-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={form.handleSubmit(onCreate)} className="p-5 space-y-3">
              <Input placeholder="Title" {...form.register("title", { required: true })} />
              <Input placeholder="Company" {...form.register("company", { required: true })} />
              <Input placeholder="Location" {...form.register("location", { required: true })} />
              <Input placeholder="Category" {...form.register("category", { required: true })} />
              <Textarea placeholder="Description" rows={6} {...form.register("description", { required: true })} />

              {/*  Featured checkbox */}
              <label className="flex items-center justify-between gap-3 rounded-lg border border-border bg-card px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-foreground">Featured</p>
                  <p className="text-xs text-muted-foreground">
                    Show this job in the Featured section on homepage.
                  </p>
                </div>
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-primary"
                  checked={!!form.watch("is_featured")}
                  onChange={(e) => form.setValue("is_featured", e.target.checked)}
                />
              </label>

              <div className="pt-2 flex items-center justify-end gap-2">
                <Button type="button" variant="secondary" onClick={() => setOpenCreate(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={create.isPending}>
                  {create.isPending ? "Posting..." : "Post Job"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}