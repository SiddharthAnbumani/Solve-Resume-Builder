export class ApiError extends Error {
  constructor(status, message, code, details) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

// Small fetch wrapper for the Node backend (reached through Next's /api proxy).
export async function api(path, { method = "GET", body, keepalive } = {}) {
  let res;
  try {
    res = await fetch(path, {
      method,
      headers: body !== undefined ? { "content-type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      keepalive,
    });
  } catch {
    throw new ApiError(0, "Can't reach the server. Check your connection.", "NETWORK");
  }
  if (res.status === 204) return null;
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(
      res.status,
      data?.error?.message || "Something went wrong",
      data?.error?.code,
      data?.error?.details
    );
  }
  return data;
}
