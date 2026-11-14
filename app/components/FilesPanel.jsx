"use client";

import { useState } from "react";
import { Copy, FileText, Pencil, Trash2 } from "lucide-react";
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
import { Button } from "@/components/ui/button";
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
import { timeAgo } from "../lib/files";
import { computeProgress, statusOf } from "../lib/progress";
import { templateName } from "../lib/templates";
import { progressColor, statusBadge } from "../lib/tones";
import ResumeThumb from "./ResumeThumb";

// The list of resumes: status filters, cards, and the rename / delete dialogs.
// Used by the landing page (guests) and the dashboard (signed-in users).
export default function FilesPanel({
  files,
  loaded,
  cloud,
  onOpen,
  update,
  duplicate,
  remove,
  emptyText = "Choose a template above, or start with a blank page.",
}) {
  const [renaming, setRenaming] = useState(null);
  const [newName, setNewName] = useState("");
  const [deleting, setDeleting] = useState(null);
  const [filter, setFilter] = useState("all"); // all | draft | finished

  const count = (st) => files.filter((f) => statusOf(f) === st).length;
  const shown = files.filter((f) => filter === "all" || statusOf(f) === filter);

  const saveRename = (e) => {
    e.preventDefault();
    const name = newName.trim();
    if (name) update(renaming.id, { name });
    setRenaming(null);
  };

  return (
    <>
      {loaded && files.length === 0 && (
        <Card className="mt-8 items-center gap-3 border border-dashed bg-transparent px-5 py-12 text-center ring-0">
          <FileText className="size-8 text-muted-foreground" />
          <p className="font-medium">No files yet</p>
          <p className="max-w-xs text-sm text-muted-foreground">{emptyText}</p>
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
        <p className="mt-8 text-center text-sm text-muted-foreground sm:text-left">
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
                onClick={() => onOpen(f)}
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
                    <Badge className={statusBadge[st]}>{st === "finished" ? "Finished" : "Draft"}</Badge>
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
                      <div
                        className={`h-full rounded-full ${progressColor(progress.percent)}`}
                        style={{ width: `${progress.percent}%` }}
                      />
                    </div>
                    <span className="text-xs whitespace-nowrap text-muted-foreground">{progress.level}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Button size="lg" className="mr-auto h-10 px-4" onClick={() => onOpen(f)}>
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

      {/* Rename */}
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

      {/* Delete */}
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
    </>
  );
}
