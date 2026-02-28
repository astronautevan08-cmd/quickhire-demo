"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Container from "@/components/Container";
import Button from "@/components/Button";
import Input from "@/components/Input";
import Textarea from "@/components/Textarea";
import { apiGet, apiPost } from "@/lib/api";
import { isEmail, isUrl } from "@/lib/validators";

export default function JobDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  // Apply form state
  const [form, setForm] = useState({
    name: "",
    email: "",
    resume_link: "",
    cover_note: "",
  });

  const [formErr, setFormErr] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // Load job details
  useEffect(() => {
    async function load() {
      setLoading(true);
      setErr("");
      try {
        const res = await apiGet(`/api/jobs/${id}`);
        setJob(res.data);
      } catch (e) {
        setErr(e.message || "Failed to load job");
      } finally {
        setLoading(false);
      }
    }

    if (id) load();
  }, [id]);

  function setField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function validate() {
    const errors = {};

    if (!form.name.trim()) errors.name = "Name is required";
    if (!form.email.trim()) errors.email = "Email is required";
    else if (!isEmail(form.email)) errors.email = "Invalid email";

    if (!form.resume_link.trim()) errors.resume_link = "Resume link is required";
    else if (!isUrl(form.resume_link)) errors.resume_link = "Resume link must be a valid URL";

    if (!form.cover_note.trim()) errors.cover_note = "Cover note is required";

    setFormErr(errors);
    return Object.keys(errors).length === 0;
  }

  async function onSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");

    if (!validate()) return;
    if (!job?.id) return;

    setSubmitting(true);
    try {
      await apiPost("/api/applications", {
        job_id: job.id,
        name: form.name,
        email: form.email,
        resume_link: form.resume_link,
        cover_note: form.cover_note,
      });

      setSuccessMsg("Application submitted successfully!");
      setForm({ name: "", email: "", resume_link: "", cover_note: "" });
      setFormErr({});
    } catch (e) {
      // Backend returns message like "Validation error" or "Job not found"
      setSuccessMsg("");
      setErr(e.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Container className="py-10">
        <div className="mb-6 flex items-center justify-between">
          <Button variant="outline" onClick={() => router.push("/")}>
            ← Back
          </Button>
          <Button variant="outline" onClick={() => router.push("/admin")}>
            Admin
          </Button>
        </div>

        {loading ? (
          <div className="text-sm text-gray-600">Loading job...</div>
        ) : err ? (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {err}
          </div>
        ) : !job ? (
          <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-700">
            Job not found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Job Details */}
            <section className="lg:col-span-2 rounded-xl border border-gray-200 bg-white p-6">
              <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
              <div className="mt-2 flex flex-wrap gap-2 text-sm text-gray-600">
                <span className="rounded-md bg-gray-50 px-2 py-1">{job.company}</span>
                <span className="rounded-md bg-gray-50 px-2 py-1">{job.location}</span>
                <span className="rounded-md bg-gray-50 px-2 py-1">{job.category}</span>
              </div>

              <div className="mt-6">
                <h2 className="text-base font-semibold text-gray-900">Job Description</h2>
                <p className="mt-2 whitespace-pre-wrap text-sm text-gray-700">
                  {job.description}
                </p>
              </div>
            </section>

            {/* Apply Form */}
            <aside className="rounded-xl border border-gray-200 bg-white p-6">
              <h2 className="text-base font-semibold text-gray-900">Apply Now</h2>
              <p className="mt-1 text-sm text-gray-600">
                Fill out the form to apply for this job.
              </p>

              {successMsg ? (
                <div className="mt-4 rounded-lg border border-green-200 bg-green-50 p-3 text-sm text-green-700">
                  {successMsg}
                </div>
              ) : null}

              <form className="mt-4 space-y-3" onSubmit={onSubmit}>
                <div>
                  <label className="mb-1 block text-sm text-gray-700">Name</label>
                  <Input
                    value={form.name}
                    onChange={(e) => setField("name", e.target.value)}
                    placeholder="Your name"
                  />
                  {formErr.name ? (
                    <p className="mt-1 text-xs text-red-600">{formErr.name}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-700">Email</label>
                  <Input
                    value={form.email}
                    onChange={(e) => setField("email", e.target.value)}
                    placeholder="you@example.com"
                  />
                  {formErr.email ? (
                    <p className="mt-1 text-xs text-red-600">{formErr.email}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-700">Resume Link (URL)</label>
                  <Input
                    value={form.resume_link}
                    onChange={(e) => setField("resume_link", e.target.value)}
                    placeholder="https://drive.google.com/..."
                  />
                  {formErr.resume_link ? (
                    <p className="mt-1 text-xs text-red-600">{formErr.resume_link}</p>
                  ) : null}
                </div>

                <div>
                  <label className="mb-1 block text-sm text-gray-700">Cover Note</label>
                  <Textarea
                    rows={5}
                    value={form.cover_note}
                    onChange={(e) => setField("cover_note", e.target.value)}
                    placeholder="Write a short cover note..."
                  />
                  {formErr.cover_note ? (
                    <p className="mt-1 text-xs text-red-600">{formErr.cover_note}</p>
                  ) : null}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={submitting}
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </Button>
              </form>
            </aside>
          </div>
        )}
      </Container>
    </main>
  );
}