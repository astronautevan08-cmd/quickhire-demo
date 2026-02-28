"use client";

import { useEffect, useState } from "react";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import Select from "@/components/Select";
import { apiDelete, apiGet, apiPost } from "@/lib/api";

const CATEGORY_OPTIONS = [
  "Engineering",
  "Design",
  "Marketing",
  "Sales",
  "Support",
  "Operations",
];

export default function AdminPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [form, setForm] = useState({
    title: "",
    company: "",
    location: "",
    category: "Engineering",
    description: "",
  });

  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");

  function setField(key, value) {
    setForm((p) => ({ ...p, [key]: value }));
  }

  async function loadJobs() {
    setLoading(true);
    setErr("");
    try {
      const res = await apiGet("/api/jobs");
      setJobs(res.data || []);
    } catch (e) {
      setErr(e.message || "Failed to load jobs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadJobs();
  }, []);

  function validateForm() {
    if (!form.title.trim()) return "Title is required";
    if (!form.company.trim()) return "Company is required";
    if (!form.location.trim()) return "Location is required";
    if (!form.category.trim()) return "Category is required";
    if (!form.description.trim()) return "Description is required";
    return "";
  }

  async function onCreateJob(e) {
    e.preventDefault();
    setMsg("");
    setErr("");

    const v = validateForm();
    if (v) {
      setErr(v);
      return;
    }

    setSaving(true);
    try {
      await apiPost("/api/jobs", form, { admin: true });
      setMsg("Job created successfully!");
      setForm({
        title: "",
        company: "",
        location: "",
        category: "Engineering",
        description: "",
      });
      await loadJobs();
    } catch (e) {
      setErr(e.message || "Failed to create job");
    } finally {
      setSaving(false);
    }
  }

  async function onDeleteJob(id) {
    const yes = confirm("Delete this job?");
    if (!yes) return;

    setDeletingId(id);
    setMsg("");
    setErr("");

    try {
      await apiDelete(`/api/jobs/${id}`);
      setMsg("Job deleted.");
      await loadJobs();
    } catch (e) {
      setErr(e.message || "Failed to delete job");
    } finally {
      setDeletingId("");
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Container className="py-10">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Admin</h1>
            <p className="text-sm text-gray-600">Create and manage jobs.</p>
          </div>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            ← Back to Jobs
          </Button>
        </div>

        {err ? (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : null}

        {msg ? (
          <div className="mb-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700">
            {msg}
          </div>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Create Job Form */}
          <section className="rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">Create Job</h2>
            <form className="mt-4 space-y-3" onSubmit={onCreateJob}>
              <div>
                <label className="mb-1 block text-sm text-gray-700">Title</label>
                <Input
                  value={form.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="Frontend Engineer"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">Company</label>
                <Input
                  value={form.company}
                  onChange={(e) => setField("company", e.target.value)}
                  placeholder="Qtec Solution Limited"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">Location</label>
                <Input
                  value={form.location}
                  onChange={(e) => setField("location", e.target.value)}
                  placeholder="Dhaka"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">Category</label>
                <Select
                  value={form.category}
                  onChange={(e) => setField("category", e.target.value)}
                >
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </Select>
              </div>

              <div>
                <label className="mb-1 block text-sm text-gray-700">Description</label>
                <Textarea
                  rows={6}
                  value={form.description}
                  onChange={(e) => setField("description", e.target.value)}
                  placeholder="Write full job description..."
                />
              </div>

              <Button type="submit" className="w-full" disabled={saving}>
                {saving ? "Creating..." : "Create Job"}
              </Button>

              <p className="text-xs text-gray-500">
                Admin requests use <code>x-admin-token</code> from{" "}
                <code>.env.local</code>.
              </p>
            </form>
          </section>

          {/* Jobs list */}
          <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-base font-semibold text-gray-900">All Jobs</h2>
            <p className="mt-1 text-sm text-gray-600">
              Delete jobs you don’t need.
            </p>

            <div className="mt-4">
              {loading ? (
                <div className="text-sm text-gray-600">Loading jobs...</div>
              ) : jobs.length === 0 ? (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 text-sm text-gray-700">
                  No jobs yet. Create your first job.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b bg-gray-50 text-left text-gray-700">
                        <th className="p-3">Title</th>
                        <th className="p-3">Company</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Category</th>
                        <th className="p-3 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {jobs.map((job) => (
                        <tr key={job.id} className="border-b">
                          <td className="p-3 font-medium text-gray-900">
                            {job.title}
                          </td>
                          <td className="p-3 text-gray-700">{job.company}</td>
                          <td className="p-3 text-gray-700">{job.location}</td>
                          <td className="p-3 text-gray-700">{job.category}</td>
                          <td className="p-3 text-right">
                            <Button
                              variant="danger"
                              onClick={() => onDeleteJob(job.id)}
                              disabled={deletingId === job.id}
                            >
                              {deletingId === job.id ? "Deleting..." : "Delete"}
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </Container>
    </main>
  );
}