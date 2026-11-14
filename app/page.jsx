"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Copy,
  CloudUpload,
  FilePlus2,
  FileText,
  Pencil,
  LogOut,
  Plus,
  Trash2,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useAuth } from "./components/AuthProvider";
import Logo from "./components/Logo";
import SmoothLink from "./components/SmoothLink";
import ResumeStack from "./components/ResumeStack";
import ResumeThumb from "./components/ResumeThumb";
import { defaultResume } from "./lib/defaultResume";
import { timeAgo, useFiles } from "./lib/files";
import { computeProgress, statusOf } from "./lib/progress";
import { progressColor, statusBadge } from "./lib/tones";
import { templateName, templates } from "./lib/templates";

const navLink =
  "hidden rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:block";

export default function Landing() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { files, loaded, cloud, localCount, create, update, duplicate, remove, importLocal } = useFiles();
  const [moving, setMoving] = useState(false);
  const [hideMove, setHideMove] = useState(false);
  const [renaming, setRenaming] = useState(null); // file being renamed
  const [newName, setNewName] = useState("");
  const [deleting, setDeleting] = useState(null); // file pending deletion
  const [filter, setFilter] = useState("all"); // all | draft | finished

  const count = (st) => files.filter((f) => statusOf(f) === st).length;
  const shown = files.filter((f) => filter === "all" || statusOf(f) === filter);

  const open = (file) => router.push(`/builder/${file.id}`);
  const start = async (opts) => {
    try {
      open(await create(opts));
    } catch (err) {
      toast.error(err.message || "Couldn't create the file.");
    }
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

  const saveRename = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (name) update(renaming.id, { name });
    setRenaming(null);
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* ── Navbar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 h-20 border-b border-white/10 bg-black text-white">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-1 px-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Solve home" className="mr-auto">
            <Logo />
          </Link>
          <SmoothLink to="templates" spy activeClass="text-white!" className={navLink}>
            Templates
          </SmoothLink>
          <SmoothLink to="files" spy activeClass="text-white!" className={navLink}>
            My files
          </SmoothLink>
          {user ? (
            <>
              <span className="ml-2 hidden max-w-40 truncate text-sm text-white/70 md:block">
                {user.name.split(" ")[0]}
              </span>
              <Button
                variant="ghost"
                size="lg"
                aria-label="Sign out"
                title="Sign out"
                className="text-white/80 hover:bg-white/10 hover:text-white"
                onClick={logout}
              >
                <LogOut /> <span className="hidden sm:inline">Sign out</span>
              </Button>
            </>
          ) : user === null ? (
            <Link
              href="/signin"
              className="rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
            >
              Sign in
            </Link>
          ) : null}
          <Button
            size="icon-lg"
            aria-label="New resume"
            title="New resume"
            className="ml-2 size-10 bg-white text-black hover:bg-white/85"
            onClick={() => start({ template: "classic", blank: true })}
          >
            <Plus />
          </Button>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:px-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <Badge variant="outline" className="border-white/25 text-white/80">
              Free · No sign-up · Saved in your browser
            </Badge>
            <h1 className="mt-5 text-[2.125rem] leading-[1.12] font-semibold tracking-tight sm:text-5xl">
              Your resume, built in minutes.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              Fill in a simple form, watch the page update live, and download a
              clean one-page PDF with real, selectable text.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <SmoothLink
                to="templates"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "h-11 bg-white px-5 text-black hover:bg-white/85"
                )}
              >
                Pick a template <ArrowRight />
              </SmoothLink>
              <SmoothLink
                to="files"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "h-11 border-white/25 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
                )}
              >
                My files
              </SmoothLink>
            </div>
          </div>

          {/* The same resume pages on every screen size */}
          <ResumeStack variant="md" className="lg:hidden" />
          <ResumeStack variant="lg" className="hidden lg:block" />
        </div>
      </section>

      {/* ── Templates ─────────────────────────────────────────── */}
      <section id="templates" className="scroll-mt-24 mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-left">Templates</h2>
        <p className="mt-1.5 text-center text-sm text-muted-foreground sm:text-left">
          Pick a look. You can switch templates any time inside the editor.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id} className="gap-0 py-0">
              <div className="flex justify-center bg-muted/60 px-4 pt-6">
                <div className="overflow-hidden rounded-t-sm shadow-md ring-1 ring-foreground/10">
                  <ResumeThumb data={defaultResume} template={t.id} width={260} />
                </div>
              </div>
              <div className="grid gap-3 p-5 sm:p-4">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                </div>
                <Button size="lg" className="h-10" onClick={() => start({ template: t.id })}>
                  Use this template <ArrowRight />
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── My files ──────────────────────────────────────────── */}
      <section id="files" className="scroll-mt-24 border-t bg-muted/40 lg:min-h-[calc(100dvh-5rem)]">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
          <div className="flex flex-wrap items-center justify-center gap-3 sm:justify-start">
            <h2 className="text-2xl font-semibold tracking-tight">My files</h2>
            {loaded && <Badge variant="secondary">{files.length}</Badge>}
            <Button
              variant="outline"
              size="lg"
              className="h-10 w-full bg-background sm:ml-auto sm:w-auto"
              onClick={() => start({ template: "classic", blank: true })}
            >
              <FilePlus2 /> New blank resume
            </Button>
          </div>
          <p className="mt-3 text-center text-sm text-muted-foreground sm:mt-1.5 sm:text-left">
            {cloud
              ? "Saved to your account, so you can open them on any device."
              : "Saved automatically on this device. Sign in to keep them in your account."}
          </p>

          {cloud && localCount > 0 && !hideMove && (
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

          {loaded && files.length === 0 && (
            <Card className="mt-8 items-center gap-3 border border-dashed bg-transparent px-5 py-12 text-center ring-0">
              <FileText className="size-8 text-muted-foreground" />
              <p className="font-medium">No files yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Choose a template above, or start with a blank page.
              </p>
            </Card>
          )}

          {files.length > 0 && (
            <Tabs value={filter} onValueChange={setFilter} className="mt-6 items-center sm:items-start">
              <TabsList className="h-10">
                <TabsTrigger value="all" className="h-8 px-3">All {files.length}</TabsTrigger>
                <TabsTrigger value="draft" className="h-8 px-3">Drafts {count("draft")}</TabsTrigger>
                <TabsTrigger value="finished" className="h-8 px-3">Finished {count("finished")}</TabsTrigger>
              </TabsList>
            </Tabs>
          )}

          {files.length > 0 && shown.length === 0 && (
            <p className="mt-8 text-sm text-muted-foreground">
              No {filter === "draft" ? "drafts" : "finished resumes"} yet.
            </p>
          )}

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {shown.map((f) => {
              const st = statusOf(f);
              const progress = computeProgress(f.data);
              return (
              <Card key={f.id} className="gap-0 py-0">
                <button
                  type="button"
                  onClick={() => open(f)}
                  aria-label={`Open ${f.name}`}
                  className="flex h-44 justify-center overflow-hidden bg-muted/60 px-4 pt-5 outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                >
                  <span className="h-fit overflow-hidden rounded-t-sm shadow-md ring-1 ring-foreground/10">
                    <ResumeThumb data={f.data} template={f.template} font={f.font} width={200} />
                  </span>
                </button>
                <div className="grid gap-3 p-4">
                  <div className="min-w-0">
                    <h3 className="truncate font-semibold">{f.name}</h3>
                    <p className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                      <Badge className={statusBadge[st]}>
                        {st === "finished" ? "Finished" : "Draft"}
                      </Badge>
                      <Badge variant="secondary">{templateName(f.template)}</Badge>
                      Edited {timeAgo(f.updatedAt)}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <div
                        role="progressbar"
                        aria-valuenow={progress.percent}
                        aria-valuemin={0}
                        aria-valuemax={100}
                        aria-label={`${f.name} completion`}
                        className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted"
                      >
                        <div className={`h-full rounded-full ${progressColor(progress.percent)}`} style={{ width: `${progress.percent}%` }} />
                      </div>
                      <span className="text-xs whitespace-nowrap text-muted-foreground">
                        {progress.level}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <Button size="lg" className="mr-auto h-10 px-4" onClick={() => open(f)}>
                      Open
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      aria-label="Rename"
                      className="size-10"
                      onClick={() => {
                        setNewName(f.name);
                        setRenaming(f);
                      }}
                    >
                      <Pencil />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      aria-label="Duplicate"
                      className="size-10"
                      onClick={async () => {
                        try {
                          await duplicate(f.id);
                          toast.success("Duplicated.");
                        } catch (err) {
                          toast.error(err.message || "Couldn't duplicate.");
                        }
                      }}
                    >
                      <Copy />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon-lg"
                      aria-label="Delete"
                      className="size-10 text-destructive hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => setDeleting(f)}
                    >
                      <Trash2 />
                    </Button>
                  </div>
                </div>
              </Card>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="border-t bg-black px-4 py-6 text-center text-xs text-white/50">
        Solve Resumé
      </footer>

      {/* ── Rename ────────────────────────────────────────────── */}
      <Dialog open={!!renaming} onOpenChange={(o) => !o && setRenaming(null)}>
        <DialogContent>
          <form onSubmit={saveRename} className="grid gap-4">
            <DialogHeader>
              <DialogTitle>Rename file</DialogTitle>
              <DialogDescription>Only you will see this name.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-1.5">
              <Label htmlFor="rename">File name</Label>
              <Input
                id="rename"
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="h-10 md:h-8"
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" size="lg" onClick={() => setRenaming(null)}>
                Cancel
              </Button>
              <Button type="submit" size="lg">Save</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* ── Delete ────────────────────────────────────────────── */}
      <AlertDialog open={!!deleting} onOpenChange={(o) => !o && setDeleting(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete “{deleting?.name}”?</AlertDialogTitle>
            <AlertDialogDescription>
              {cloud
                ? "This permanently deletes the file from your account. It can’t be undone."
                : "This removes the file from this device. It can’t be undone."}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                remove(deleting.id);
                setDeleting(null);
                toast.success("File deleted.");
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
