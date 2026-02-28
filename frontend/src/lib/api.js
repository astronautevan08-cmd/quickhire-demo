const BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

async function handle(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message = data?.message || "Request failed";
    throw new Error(message);
  }
  return data;
}

export async function apiGet(path) {
  const res = await fetch(`${BASE}${path}`, { cache: "no-store" });
  return handle(res);
}

export async function apiPost(path, body, { admin = false } = {}) {
  const headers = { "Content-Type": "application/json" };

  if (admin) {
    headers["x-admin-token"] = process.env.NEXT_PUBLIC_ADMIN_TOKEN || "";
  }

  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  return handle(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${BASE}${path}`, {
    method: "DELETE",
    headers: {
      "x-admin-token": process.env.NEXT_PUBLIC_ADMIN_TOKEN || "",
    },
  });

  return handle(res);
}