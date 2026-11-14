"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getMe, signOut } from "../lib/auth-client";

const AuthContext = createContext(null);

// `user` is undefined while we check the session, null for guests, or the
// signed-in user.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);

  useEffect(() => {
    let alive = true;
    getMe().then((u) => alive && setUser(u));
    return () => {
      alive = false;
    };
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut();
    } catch {}
    setUser(null);
  }, []);

  const value = useMemo(() => ({ user, setUser, logout }), [user, logout]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside <AuthProvider>");
  return ctx;
}
