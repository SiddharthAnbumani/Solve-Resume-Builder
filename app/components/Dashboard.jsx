"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CloudUpload, FilePlus2, FileText, LogOut, Plus } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import FilesPanel from "./FilesPanel";
import Logo from "./Logo";
import ResumeThumb from "./ResumeThumb";
import { defaultResume } from "../lib/defaultResume";
import { timeAgo, useFiles } from "../lib/files";
import { computeProgress, statusOf } from "../lib/progress";
import { templates } from "../lib/templates";
import { progressColor, statusBadge } from "../lib/tones";

// The signed-in home: a greeting, quick stats, the file to continue, ways to
// start a new resume, and all of the user's resumes.
export default function Dashboard() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { files, loaded, cloud, localCount, create, update, duplicate, remove, importLocal } = useFiles();
  const [moving, setMoving] = useState(false);
  const [hideMove, setHideMove] = useState(false);
  const [starting, setStarting] = useState(false);
  const leaving = useRef(false); // true while we sign out on purpose

  // The proxy only checks that a cookie exists. If the API says we're not
  // signed in after all, clear the stale cookie and go to the sign-in page.
  useEffect(() => {
    if (user === null && !leaving.current) logout().finally(() => router.replace("/signin"));
  }, [user, logout, router]);

  const recent = useMemo(
    () => [...files].sort((a, b) => b.updatedAt - a.updatedAt)[0],
    [files]
  );
  const drafts = files.filter((f) => statusOf(f) === "draft").length;
  const finished = files.length - drafts;

  const open = (f) => router.push(`/builder/${f.id}`);
  const start = async (opts) => {
    if (starting) return;
    setStarting(true);
    try {
      open(await create(opts));
    } catch (err) {
      toast.error(err.message || "Couldn't create the file.");
      setStarting(false);
    }
  };

  // Arrived from the landing page with a template chosen: start that resume
  // as soon as the file list is ready, then tidy the URL.
  const handledParam = useRef(false);
  useEffect(() => {
    if (handledParam.current || !user || !loaded) return;
    handledParam.current = true;
    const t = new URLSearchParams(window.location.search).get("template");
    if (!t) return;
    router.replace("/dashboard");
    if (templates.some((x) => x.id === t)) setTimeout(() => start({ template: t }), 0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, loaded]);

  const signOut = async () => {
    leaving.current = true;
    await logout();
    router.push("/");
  };

  const moveLocal = async () => {
    setMoving(true);
    try {
      const { moved, skipped } = await importLocal();
      toast.success(
        skipped
          ? `Moved ${moved}. ${skipped} stayed on this device (file limit reached).`
          : `Moved ${moved} resume${moved === 1 ? "" : "s"} to your account.`
      );
    } catch (err) {
      toast.error(err.message || "Couldn't move your files.");
    } finally {
      setMoving(false);
    }
  };

  // Still checking the session (or redirecting a stale one).
  if (!user) return <div className="min-h-dvh bg-black" />;

  const first = user.name.split(" ")[0];
  const stats = [
    { label: "Resumes", value: files.length },
    { label: "Drafts", value: drafts },
    { label: "Finished", value: finished },
  ];

  return (
    <div className="min-h-dvh bg-background">
      {/* ── Navbar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 h-20 border-b border-white/10 bg-black text-white">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-1 px-5 sm:px-8 lg:px-12">
          <Link href="/dashboard" aria-label="Solve dashboard" className="mr-auto">
            <Logo />
          </Link>
          <span className="mr-1 hidden max-w-48 truncate text-sm text-white/70 md:block">{user.name}</span>
          <Button
            variant="ghost"
            size="lg"
            aria-label="Sign out"
            title="Sign out"
            className="text-white/80 hover:bg-white/10 hover:text-white"
            onClick={signOut}
          >
            <LogOut /> <span className="hidden sm:inline">Sign out</span>
          </Button>
          <Button
            size="icon-lg"
            aria-label="New resume"
            title="New resume"
            className="ml-1 size-10 bg-white text-black hover:bg-white/85"
            disabled={starting}
            onClick={() => start({ template: "classic", blank: true })}
          >
            <Plus />
          </Button>
        </div>
      </header>

      {/* ── Welcome ───────────────────────────────────────────── */}
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-12 sm:px-8 md:py-16 lg:grid-cols-[1.1fr_1fr] lg:px-12">
          <div className="text-center lg:text-left">
            <p className="text-sm font-medium tracking-wide text-white/50">Dashboard</p>
            <h1 className="mt-2 text-[2rem] leading-[1.12] font-semibold tracking-tight sm:text-5xl">
              Welcome back, {first}.
            </h1>
            <p className="mx-auto mt-4 max-w-md text-base leading-relaxed text-white/60 lg:mx-0">
              {files.length === 0 && loaded
                ? "Start your first resume below. It takes a few minutes."
                : "Pick up where you left off, or start a fresh resume."}
            </p>

            <div className="mt-7 grid grid-cols-3 gap-3 sm:max-w-md lg:mx-0">
              {stats.map((s) => (
                <div key={s.label} className="rounded-xl border border-white/14 px-3 py-3.5 text-center lg:text-left">
                  <div className="text-2xl font-semibold tabular-nums">{loaded ? s.value : "–"}</div>
                  <div className="mt-0.5 text-[11px] font-medium tracking-wider text-white/50 uppercase">{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Continue editing */}
          {recent ? (
            <div className="rounded-2xl bg-white/6 p-4 ring-1 ring-white/12 sm:p-5">
              <p className="text-xs font-medium tracking-wider text-white/50 uppercase">Continue editing</p>
              <div className="mt-4 flex items-center gap-4">
                <button
                  type="button"
                  onClick={() => open(recent)}
                  aria-label={`Open ${recent.name}`}
                  className="shrink-0 overflow-hidden rounded-sm shadow-lg ring-1 ring-white/15 outline-none focus-visible:ring-2 focus-visible:ring-white"
                >
                  <ResumeThumb data={recent.data} template={recent.template} font={recent.font} width={92} />
                </button>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-lg font-semibold">{recent.name}</h2>
                  <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-white/55">
                    <Badge className={statusBadge[statusOf(recent)]}>
                      {statusOf(recent) === "finished" ? "Finished" : "Draft"}
                    </Badge>
                    Edited {timeAgo(recent.updatedAt)}
                  </p>
                  <div className="mt-3 flex items-center gap-2">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/15">
                      <div
                        className={`h-full rounded-full ${progressColor(computeProgress(recent.data).percent)}`}
                        style={{ width: `${computeProgress(recent.data).percent}%` }}
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap text-white/55">
                      {computeProgress(recent.data).level}
                    </span>
                  </div>
                </div>
              </div>
              <Button
                size="lg"
                className="mt-5 h-11 w-full bg-white text-black hover:bg-white/85"
                onClick={() => open(recent)}
              >
                Open <ArrowRight />
              </Button>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/20 p-6 text-center">
              <FileText className="mx-auto size-8 text-white/50" />
              <p className="mt-3 font-medium">{loaded ? "No resumes yet" : "Loading your resumes…"}</p>
              <p className="mt-1 text-sm text-white/55">Start one with the options below.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Start a new resume ────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-5 py-12 sm:px-8 lg:px-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-left">Start a new resume</h2>
        <p className="mt-1.5 text-center text-sm text-muted-foreground sm:text-left">
          Choose a look. You can switch any time inside the editor.
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <button
            type="button"
            disabled={starting}
            onClick={() => start({ template: "classic", blank: true })}
            className="group flex items-center gap-4 rounded-xl border border-dashed p-4 text-left transition-colors outline-none hover:border-foreground/40 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
          >
            <span className="flex h-[118px] w-[92px] shrink-0 items-center justify-center rounded-sm bg-muted">
              <FilePlus2 className="size-7 text-muted-foreground" />
            </span>
            <span className="min-w-0">
              <span className="block font-semibold">Blank resume</span>
              <span className="mt-1 block text-sm text-muted-foreground">Start from an empty page.</span>
            </span>
          </button>
          {templates.map((t) => (
            <button
              key={t.id}
              type="button"
              disabled={starting}
              onClick={() => start({ template: t.id })}
              className="group flex items-center gap-4 rounded-xl border bg-card p-4 text-left transition-colors outline-none hover:border-foreground/40 hover:bg-muted/50 focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-60"
            >
              <span className="shrink-0 overflow-hidden rounded-sm shadow-sm ring-1 ring-foreground/10">
                <ResumeThumb data={defaultResume} template={t.id} width={92} />
              </span>
              <span className="min-w-0">
                <span className="block font-semibold">{t.name}</span>
                <span className="mt-1 line-clamp-3 block text-sm text-muted-foreground">{t.description}</span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* ── Your resumes ──────────────────────────────────────── */}
      <section className="border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <h2 className="text-2xl font-semibold tracking-tight">Your resumes</h2>
            {loaded && <Badge variant="secondary">{files.length}</Badge>}
            <Button
              variant="outline"
              size="lg"
              className="h-10 w-full bg-background sm:ml-auto sm:w-auto"
              disabled={starting}
              onClick={() => start({ template: "classic", blank: true })}
            >
              <FilePlus2 /> New blank resume
            </Button>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground sm:mt-1.5 sm:text-left">
            Saved to your account, so you can open them on any device.
          </p>

          {localCount > 0 && !hideMove && (
            <Card className="mt-6 flex-col gap-3 border-0 bg-blue-50 px-4 py-4 ring-1 ring-blue-200 sm:flex-row sm:items-center">
              <CloudUpload className="size-5 shrink-0 text-blue-700" />
              <p className="flex-1 text-sm text-blue-950">
                You have {localCount} resume{localCount === 1 ? "" : "s"} saved on this device. Move{" "}
                {localCount === 1 ? "it" : "them"} to your account?
              </p>
              <div className="flex gap-2">
                <Button size="lg" className="h-10" disabled={moving} onClick={moveLocal}>
                  {moving ? "Moving…" : "Move to my account"}
                </Button>
                <Button variant="ghost" size="lg" className="h-10" onClick={() => setHideMove(true)}>
                  Not now
                </Button>
              </div>
            </Card>
          )}

          {!loaded && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-72 animate-pulse rounded-xl bg-muted" />
              ))}
            </div>
          )}

          <FilesPanel
            files={files}
            loaded={loaded}
            cloud={cloud}
            onOpen={open}
            update={update}
            duplicate={duplicate}
            remove={remove}
            emptyText="Pick a template above to make your first one."
          />
        </div>
      </section>

      <footer className="border-t border-white/10 bg-black px-4 py-6 text-center text-xs text-white/50">Solve Resumé</footer>
    </div>
  );
}
