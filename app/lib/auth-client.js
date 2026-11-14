import { api, ApiError } from "./api";

export async function signUp({ name, email, password }) {
  const { user } = await api("/api/auth/register", { method: "POST", body: { name, email, password } });
  return user;
}

export async function signIn({ email, password }) {
  const { user } = await api("/api/auth/login", { method: "POST", body: { email, password } });
  return user;
}

export async function signOut() {
  await api("/api/auth/logout", { method: "POST", body: {} });
}

// The signed-in user, or null for guests. If the backend is unreachable we
// treat you as a guest, so the app still works with files on this device.
export async function getMe() {
  try {
    const { user } = await api("/api/auth/me");
    return user;
  } catch (err) {
    if (err instanceof ApiError) return null;
    return null;
  }
}
