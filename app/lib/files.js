"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../components/AuthProvider";
import { api } from "./api";
import { defaultResume, makeBlankResume, uid } from "./defaultResume";
import { templateName } from "./templates";

const FILES_KEY = "resume-builder:files:v2";
const LEGACY_KEY = "resume-builder:v1";
const SAVE_DELAY = 800; // ms of quiet before an edit is sent to the server

const clone = (o) => JSON.parse(JSON.stringify(o));

// ── Local (guest) storage ───────────────────────────────────────────────
function readLocal() {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
    // First run after an upgrade: keep the single resume saved by the old version.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const data = JSON.parse(legacy);
      if (data?.basics) {
        return [
          { id: uid(), name: "My resume", template: "classic", status: "draft", updatedAt: Date.now(), data },
        ];
      }
    }
  } catch {}
  return [];
}

function writeLocal(list) {
  try {
    localStorage.setItem(FILES_KEY, JSON.stringify(list));
  } catch {}
}

const fields = ({ name, template, font, status, data }) => ({ name, template, font, status, data });

/**
 * All of the user's resumes ("files").
 *  - Signed in: stored on the server (MongoDB), edits are sent after a short pause.
 *  - Guest: stored in this browser's localStorage.
 * Both modes expose the same functions, so pages don't need to care which.
 */
export function useFiles() {
  const { user, setUser } = useAuth();
  const cloud = !!user;

  const [files, setFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [saveState, setSaveState] = useState("idle"); // idle | saving | saved | error
  const [localCount, setLocalCount] = useState(0); // device files waiting to move to the account

  const filesRef = useRef([]); // always the latest list (state lags a render behind)
  const pending = useRef(new Map()); // file id → fields not yet sent
  const timers = useRef(new Map()); // file id → debounce timer
  const inflight = useRef(0);
  const sendRef = useRef(null); // lets a failed save retry itself

  const commit = useCallback((next) => {
    filesRef.current = next;
    setFiles(next);
  }, []);

  const sessionExpired = useCallback(() => {
    toast.error("Your session expired. Please sign in again.");
    setUser(null);
  }, [setUser]);

  // ── Load ──────────────────────────────────────────────────────────────
  useEffect(() => {
    if (user === undefined) return; // still checking the session
    let alive = true;
    /* eslint-disable react-hooks/set-state-in-effect */
    setLoaded(false);
    if (user) {
      setLocalCount(readLocal().length);
      api("/api/files")
        .then(({ files: list }) => alive && commit(list))
        .catch((err) => {
          if (!alive) return;
          if (err.status === 401) sessionExpired();
          else toast.error(err.message);
          commit([]);
        })
        .finally(() => alive && setLoaded(true));
    } else {
      commit(readLocal());
      setLocalCount(0);
      setLoaded(true);
    }
    /* eslint-enable react-hooks/set-state-in-effect */
    return () => {
      alive = false;
    };
  }, [user, commit, sessionExpired]);

  // Guests: persist on every change.
  useEffect(() => {
    if (loaded && user === null) writeLocal(files);
  }, [files, loaded, user]);

  // ── Saving edits to the server ────────────────────────────────────────
  const send = useCallback(
    async (id, { keepalive = false } = {}) => {
      const patch = pending.current.get(id);
      if (!patch) return;
      pending.current.delete(id);
      inflight.current++;
      setSaveState("saving");
      try {
        await api(`/api/files/${id}`, { method: "PATCH", body: patch, keepalive });
        if (inflight.current === 1 && pending.current.size === 0) setSaveState("saved");
      } catch (err) {
        if (err.status === 401) return sessionExpired();
        if (err.status === 404) return; // deleted elsewhere
        // Put the edit back (anything newer wins) and try again shortly.
        pending.current.set(id, { ...patch, ...(pending.current.get(id) || {}) });
        setSaveState("error");
        clearTimeout(timers.current.get(id));
        timers.current.set(id, setTimeout(() => sendRef.current?.(id), 4000));
      } finally {
        inflight.current--;
      }
    },
    [sessionExpired]
  );

  useEffect(() => {
    sendRef.current = send;
  }, [send]);

  const queue = useCallback(
    (id, changed) => {
      pending.current.set(id, { ...(pending.current.get(id) || {}), ...changed });
      setSaveState("saving");
      clearTimeout(timers.current.get(id));
      timers.current.set(
        id,
        setTimeout(() => send(id), SAVE_DELAY)
      );
    },
    [send]
  );

  // Don't lose the last few keystrokes when leaving the page or the editor.
  useEffect(() => {
    if (!cloud) return;
    const flushAll = (keepalive) => {
      for (const id of [...pending.current.keys()]) {
        clearTimeout(timers.current.get(id));
        send(id, { keepalive });
      }
    };
    const onHide = () => flushAll(true);
    window.addEventListener("pagehide", onHide);
    return () => {
      window.removeEventListener("pagehide", onHide);
      flushAll(true);
    };
  }, [cloud, send]);

  // ── Actions ───────────────────────────────────────────────────────────
  const create = useCallback(
    async ({ template = "classic", blank = false } = {}) => {
      const draft = {
        name: blank ? "Untitled resume" : `${templateName(template)} resume`,
        template,
        font: "default",
        status: "draft",
        data: blank ? makeBlankResume() : clone(defaultResume),
      };
      let file;
      if (cloud) {
        ({ file } = await api("/api/files", { method: "POST", body: draft }));
      } else {
        file = { ...draft, id: uid(), updatedAt: Date.now() };
        // Write straight away so the editor can find it as soon as we navigate.
        writeLocal([file, ...filesRef.current]);
      }
      commit([file, ...filesRef.current]);
      return file;
    },
    [cloud, commit]
  );

  // `patch` is an object or a function (file) => object.
  const update = useCallback(
    (id, patch) => {
      const cur = filesRef.current.find((f) => f.id === id);
      if (!cur) return;
      const changed = typeof patch === "function" ? patch(cur) : patch;
      commit(
        filesRef.current.map((f) => (f.id === id ? { ...f, ...changed, updatedAt: Date.now() } : f))
      );
      if (cloud) queue(id, changed);
    },
    [cloud, commit, queue]
  );

  const duplicate = useCallback(
    async (id) => {
      const src = filesRef.current.find((f) => f.id === id);
      if (!src) return null;
      const body = { ...fields(src), name: `${src.name} (copy)`, data: clone(src.data) };
      let file;
      if (cloud) {
        ({ file } = await api("/api/files", { method: "POST", body }));
      } else {
        file = { ...body, id: uid(), updatedAt: Date.now() };
      }
      commit([file, ...filesRef.current]);
      return file;
    },
    [cloud, commit]
  );

  const remove = useCallback(
    async (id) => {
      const before = filesRef.current;
      clearTimeout(timers.current.get(id));
      pending.current.delete(id);
      commit(before.filter((f) => f.id !== id));
      if (!cloud) return;
      try {
        await api(`/api/files/${id}`, { method: "DELETE" });
      } catch (err) {
        if (err.status === 404) return;
        commit(before); // put it back
        if (err.status === 401) sessionExpired();
        else toast.error(err.message);
      }
    },
    [cloud, commit, sessionExpired]
  );

  // Move the files saved on this device into the signed-in account.
  const importLocal = useCallback(async () => {
    const local = readLocal();
    if (!cloud || local.length === 0) return 0;
    const { files: created, skipped } = await api("/api/files/import", {
      method: "POST",
      body: { files: local.map((f) => fields(f)) },
    });
    if (skipped === 0) {
      try {
        localStorage.removeItem(FILES_KEY);
        localStorage.removeItem(LEGACY_KEY);
      } catch {}
      setLocalCount(0);
    } else {
      // Over the account's file limit: keep the ones that didn't fit on this device.
      writeLocal(local.slice(created.length));
      setLocalCount(skipped);
    }
    commit([...created, ...filesRef.current]);
    return { moved: created.length, skipped };
  }, [cloud, commit]);

  return { files, loaded, cloud, saveState, localCount, create, update, duplicate, remove, importLocal };
}

export function timeAgo(ts) {
  const s = Math.max(0, Math.round((Date.now() - ts) / 1000));
  if (s < 60) return "just now";
  const m = Math.round(s / 60);
  if (m < 60) return `${m} min ago`;
  const h = Math.round(m / 60);
  if (h < 24) return `${h} hr ago`;
  const d = Math.round(h / 24);
  return `${d} day${d === 1 ? "" : "s"} ago`;
}
