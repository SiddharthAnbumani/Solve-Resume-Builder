"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Copy,
  FilePlus2,
  FileText,
  Pencil,
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
import Logo from "./components/Logo";
import SmoothLink from "./components/SmoothLink";
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
  const { files, loaded, create, update, duplicate, remove } = useFiles();
  const [renaming, setRenaming] = useState(null); // file being renamed
  const [newName, setNewName] = useState("");
  const [deleting, setDeleting] = useState(null); // file pending deletion
  const [filter, setFilter] = useState("all"); // all | draft | finished

  const count = (st) => files.filter((f) => statusOf(f) === st).length;
  const shown = files.filter((f) => filter === "all" || statusOf(f) === filter);

  const open = (file) => router.push(`/builder/${file.id}`);
  const start = (opts) => open(create(opts));

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
        <div className="mx-auto flex h-full max-w-7xl items-center gap-1 px-4 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Solve home" className="mr-auto">
            <Logo />
          </Link>
          <SmoothLink to="templates" spy activeClass="text-white!" className={navLink}>
            Templates
          </SmoothLink>
          <SmoothLink to="files" spy activeClass="text-white!" className={navLink}>
            My files
          </SmoothLink>
          <Link href="/signin" className={navLink}>Sign in</Link>
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
      <section className="bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-14 sm:px-8 lg:px-12 md:py-20 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <Badge variant="outline" className="border-white/25 text-white/80">
              Free · No sign-up · Saved in your browser
            </Badge>
            <h1 className="mt-5 text-4xl leading-[1.1] font-semibold tracking-tight sm:text-5xl">
              Your resume, built in minutes.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              Fill in a simple form, watch the page update live, and download a
              clean one-page PDF with real, selectable text.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
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

          {/* A stack of template previews */}
          <div className="relative mx-auto hidden h-[420px] w-full max-w-md lg:block" aria-hidden>
            <div className="absolute top-4 left-2 -rotate-6 rounded-sm shadow-2xl ring-1 ring-white/10">
              <ResumeThumb data={defaultResume} template="modern" width={250} />
            </div>
            <div className="absolute top-0 right-2 rotate-3 rounded-sm shadow-2xl ring-1 ring-white/10">
              <ResumeThumb data={defaultResume} template="classic" width={270} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Templates ─────────────────────────────────────────── */}
      <section id="templates" className="scroll-mt-24 mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:px-12">
        <h2 className="text-2xl font-semibold tracking-tight">Templates</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Pick a look. You can switch templates any time inside the editor.
        </p>
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <Card key={t.id} className="gap-0 py-0">
              <div className="flex justify-center bg-muted/60 px-4 pt-6">
                <div className="overflow-hidden rounded-t-sm shadow-md ring-1 ring-foreground/10">
                  <ResumeThumb data={defaultResume} template={t.id} width={260} />
                </div>
              </div>
              <div className="grid gap-3 p-4">
                <div>
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
      <section id="files" className="min-h-[calc(100dvh-5rem)] scroll-mt-24 border-t bg-muted/40">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-8 lg:px-12">
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-2xl font-semibold tracking-tight">My files</h2>
            {loaded && <Badge variant="secondary">{files.length}</Badge>}
            <Button
              variant="outline"
              size="lg"
              className="ml-auto bg-background"
              onClick={() => start({ template: "classic", blank: true })}
            >
              <FilePlus2 /> New blank resume
            </Button>
          </div>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Saved automatically in this browser. Nothing is uploaded.
          </p>

          {loaded && files.length === 0 && (
            <Card className="mt-8 items-center gap-3 border border-dashed bg-transparent py-12 text-center ring-0">
              <FileText className="size-8 text-muted-foreground" />
              <p className="font-medium">No files yet</p>
              <p className="max-w-xs text-sm text-muted-foreground">
                Choose a template above, or start with a blank page.
              </p>
            </Card>
          )}

          {files.length > 0 && (
            <Tabs value={filter} onValueChange={setFilter} className="mt-6">
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
                      onClick={() => {
                        duplicate(f.id);
                        toast.success("Duplicated.");
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
        Solve Resumé · your data never leaves this browser.
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
              This removes the file from this browser. It can’t be undone, so
              export it first if you want a backup.
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
