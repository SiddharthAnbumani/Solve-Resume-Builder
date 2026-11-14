"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { defaultResume, makeBlankResume, uid } from "./defaultResume";
import { templateName } from "./templates";

const FILES_KEY = "resume-builder:files:v2";
const LEGACY_KEY = "resume-builder:v1";

const clone = (o) => JSON.parse(JSON.stringify(o));

function read() {
  try {
    const raw = localStorage.getItem(FILES_KEY);
    if (raw) {
      const list = JSON.parse(raw);
      if (Array.isArray(list)) return list;
    }
    // First run after upgrade: keep the single resume saved by the old version.
    const legacy = localStorage.getItem(LEGACY_KEY);
    if (legacy) {
      const data = JSON.parse(legacy);
      if (data?.basics) {
        return [
          {
            id: uid(),
            name: "My resume",
            template: "classic",
            updatedAt: Date.now(),
            data,
          },
        ];
      }
    }
  } catch {}
  return [];
}

// All saved resumes ("files") live in this browser's localStorage.
export function useFiles() {
  const [files, setFiles] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const filesRef = useRef([]);

  useEffect(() => {
    filesRef.current = files;
  }, [files]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFiles(read());
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(FILES_KEY, JSON.stringify(files));
    } catch {}
  }, [files, loaded]);

  const create = useCallback(({ template = "classic", blank = false } = {}) => {
    const file = {
      id: uid(),
      name: blank ? "Untitled resume" : `${templateName(template)} resume`,
      template,
      status: "draft",
      updatedAt: Date.now(),
      data: blank ? makeBlankResume() : clone(defaultResume),
    };
    // Write straight away so the editor page can find the file as soon as
    // we navigate to it.
    const next = [file, ...filesRef.current];
    filesRef.current = next;
    try {
      localStorage.setItem(FILES_KEY, JSON.stringify(next));
    } catch {}
    setFiles(next);
    return file;
  }, []);

  // `patch` is an object or a function (file) => object.
  const update = useCallback((id, patch) => {
    setFiles((list) =>
      list.map((f) =>
        f.id === id
          ? {
              ...f,
              ...(typeof patch === "function" ? patch(f) : patch),
              updatedAt: Date.now(),
            }
          : f
      )
    );
  }, []);

  const duplicate = useCallback((id) => {
    setFiles((list) => {
      const src = list.find((f) => f.id === id);
      if (!src) return list;
      const copy = {
        ...clone(src),
        id: uid(),
        name: `${src.name} (copy)`,
        updatedAt: Date.now(),
      };
      return [copy, ...list];
    });
  }, []);

  const remove = useCallback(
    (id) => setFiles((list) => list.filter((f) => f.id !== id)),
    []
  );

  return { files, loaded, create, update, duplicate, remove };
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
