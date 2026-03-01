import type { ApiResponse, Job } from "@/lib/types";

const BASE =
  (process.env.NEXT_PUBLIC_API_BASE_URL || "").replace(/\/$/, "");

function getAdminHeaders() {
  const token = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";
  return { "x-admin-token": token };
}

async function request<T>(
  path: string,
  init?: RequestInit
): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  });

  const json = (await res.json()) as ApiResponse<T>;

  if (!res.ok || !json.success) {
    const msg =
      json?.message ||
      `Request failed (${res.status})`;
    throw new Error(msg);
  }

  return json.data;
}

//  GET /api/jobs?search=&category=&location=
export function fetchJobs(params: {
  search?: string;
  category?: string;
  location?: string;
}) {
  const qs = new URLSearchParams();
  if (params.search) qs.set("search", params.search);
  if (params.category) qs.set("category", params.category);
  if (params.location) qs.set("location", params.location);

  const q = qs.toString();
  return request<Job[]>(`/api/jobs${q ? `?${q}` : ""}`);
}

// GET /api/jobs/:id
export function fetchJob(id: string) {
  return request<Job>(`/api/jobs/${id}`);
}

// POST /api/jobs (Admin) header: x-admin-token
export function createJob(body: {
  title: string;
  company: string;
  location: string;
  category: string;
  description: string;
  is_featured?: boolean;
}) {
  return request<Job>(`/api/jobs`, {
    method: "POST",
    headers: getAdminHeaders(),
    body: JSON.stringify(body),
  });
}

export function setFeatured(id: string, is_featured: boolean) {
  return request<Job>(`/api/jobs/${id}/featured`, {
    method: "PATCH",
    headers: getAdminHeaders(),
    body: JSON.stringify({ is_featured }),
  });
}

// DELETE /api/jobs/:id (Admin) header: x-admin-token
export function deleteJob(id: string) {
  return request<{ id: string }>(`/api/jobs/${id}`, {
    method: "DELETE",
    headers: getAdminHeaders(),
  });
}

// POST /api/applications
export function createApplication(body: {
  job_id: string;
  name: string;
  email: string;
  resume_link: string;
  cover_note: string;
}) {
  return request<{ id: string }>(`/api/applications`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}