"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { useToast } from "@/hooks/use-toast";
import { useJobs, useJob, useCreateJob, useDeleteJob } from "@/hooks/useJobsApi";
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

export default function AdminPage() {
  const { toast } = useToast();

  const { data: jobs, isLoading, error } = useJobs({});
  const create = useCreateJob();
  const del = useDeleteJob();

  const [selectedJobId, setSelectedJobId] = useState<string>("");

  const selectedJobQuery = useJob(selectedJobId);
  const selectedJob = selectedJobQuery.data;

  const form = useForm<JobForm>({
    defaultValues: {
      title: "",
      company: "",
      location: "",
      category: "",
      description: "",
    },
  });

  const jobCount = jobs?.length || 0;

  const selectedApplicants = useMemo(() => {
    return selectedJob?.applications || [];
  }, [selectedJob]);

  async function onCreate(values: JobForm) {
    try {
      const created = await create.mutateAsync(values);
      toast({ title: "Job created" });
      form.reset();

      // auto-select the newly created job
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

      if (selectedJobId === id) {
        setSelectedJobId("");
      }
    } catch (err) {
      toast({
        title: "Delete failed",
        description: getErrorMessage(err),
        variant: "destructive",
      });
    }
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10">
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage jobs and review applicants.
          </p>
        </div>

        <Link
          href="/"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back
        </Link>
      </div>

      {/* Layout */}
      <div className="mt-8 grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* Left: create form + jobs */}
        <div className="xl:col-span-5 space-y-6">
          {/* Create job */}
          <div className="border border-border rounded-xl p-6 bg-card">
            <h2 className="font-semibold text-foreground">Create Job</h2>
            <p className="text-xs text-muted-foreground mt-1">
              This uses <code>x-admin-token</code> from{" "}
              <code>NEXT_PUBLIC_ADMIN_TOKEN</code>.
            </p>

            <form
              onSubmit={form.handleSubmit(onCreate)}
              className="mt-5 space-y-3"
            >
              <Input placeholder="Title" {...form.register("title", { required: true })} />
              <Input placeholder="Company" {...form.register("company", { required: true })} />
              <Input placeholder="Location" {...form.register("location", { required: true })} />
              <Input placeholder="Category" {...form.register("category", { required: true })} />
              <Textarea placeholder="Description" rows={6} {...form.register("description", { required: true })} />

              <Button type="submit" className="w-full" disabled={create.isPending}>
                {create.isPending ? "Creating..." : "Create Job"}
              </Button>
            </form>
          </div>

          {/* Jobs list */}
          <div className="border border-border rounded-xl p-6 bg-card">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-foreground">Jobs</h2>
                <p className="text-xs text-muted-foreground mt-1">
                  Total: {jobCount}
                </p>
              </div>
            </div>

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
                        active
                          ? "border-primary/40 bg-primary/5"
                          : "border-border bg-background hover:bg-muted/30",
                      ].join(" ")}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedJobId(j.id)}
                        className="text-left flex-1"
                      >
                        <p className="font-medium text-foreground">{j.title}</p>
                        <p className="text-sm text-muted-foreground">
                          {j.company} • {j.location} • {j.category}
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Posted: {formatDate(j.created_at)}
                        </p>
                      </button>

                      <div className="flex items-center gap-2">
                        <Link
                          className="text-sm text-primary hover:underline"
                          href={`/jobs/${j.id}`}
                        >
                          View
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

        {/* Right: Selected job applicants */}
        <div className="xl:col-span-7 space-y-6">
          <div className="border border-border rounded-xl p-6 bg-card">
            <h2 className="font-semibold text-foreground">Applications</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select a job to view applicant details.
            </p>

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
                {/* Selected job summary */}
                <div className="border border-border rounded-xl p-5 bg-background">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {selectedJob.title}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {selectedJob.company} • {selectedJob.location} • {selectedJob.category}
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

                {/* Applicants table */}
                <ApplicantsTable applications={selectedApplicants} />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}