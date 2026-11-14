"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Download, FileDown, RotateCcw, Upload } from "lucide-react";
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
import { cn } from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FileSettings from "./FileSettings";
import ResumeForm from "./ResumeForm";
import ResumePreview from "./ResumePreview";
import { defaultResume } from "../lib/defaultResume";
import { useFiles } from "../lib/files";
import { computeProgress, statusOf } from "../lib/progress";

const PAPER_W = 816; // 8.5in @ 96dpi
const PAGE_CONTENT_H = 960; // 10in of usable height per printed page (0.5in margins)
const TOP_PAD = 48; // 0.5in

const SECTION_KEYS = ["summary", "education", "skills", "experience", "projects"];

// Accept an imported file only if it has the right shape; fill gaps from defaults.
function normalize(raw) {
  if (!raw || typeof raw !== "object" || !raw.basics) return null;
  const out = { basics: { ...defaultResume.basics, ...raw.basics } };
  if (!Array.isArray(out.basics.links)) out.basics.links = [];
  for (const k of SECTION_KEYS) {
    out[k] = { ...defaultResume[k], ...(raw[k] || {}) };
    if ("items" in defaultResume[k] && !Array.isArray(out[k].items)) out[k].items = [];
  }
  return out;
}

export default function Builder({ id }) {
  const { files, loaded, update } = useFiles();
  const file = files.find((f) => f.id === id);

  const [tab, setTab] = useState("edit");
  const [confirmReset, setConfirmReset] = useState(false);
  const [confirmFinish, setConfirmFinish] = useState(false);
  const [scale, setScale] = useState(1);
  const [paperH, setPaperH] = useState(1056);
  const previewRef = useRef(null);
  const paperRef = useRef(null);
  const fileRef = useRef(null);

  // The form passes either a new value or an updater function.
  const setData = useCallback(
    (next) =>
      update(id, (f) => ({
        data: typeof next === "function" ? next(f.data) : next,
      })),
    [id, update]
  );

  // Fit the paper to the preview column and track its rendered height.
  useEffect(() => {
    const fit = () => {
      const w = previewRef.current?.clientWidth ?? PAPER_W;
      if (w > 0) setScale(Math.min(1, (w - 32) / PAPER_W));
      setPaperH(paperRef.current?.offsetHeight ?? 1056);
    };
    fit();
    const ro = new ResizeObserver(fit);
    if (previewRef.current) ro.observe(previewRef.current);
    if (paperRef.current) ro.observe(paperRef.current);
    return () => ro.disconnect();
  }, [tab, file?.id]);

  const download = useCallback(() => {
    const prev = document.title;
    const name = (file?.data.basics.name || file?.name || "Resume")
      .trim()
      .replace(/\s+/g, "_");
    document.title = `${name}_Resume`; // becomes the default PDF file name
    const restore = () => {
      document.title = prev;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    toast.info("Choose “Save as PDF” as the destination.");
    setTimeout(() => window.print(), 250);
  }, [file]);

  if (!loaded) return <div className="h-dvh bg-black" />;

  if (!file) {
    return (
      <div className="flex h-dvh flex-col items-center justify-center gap-4 bg-muted/40 p-6 text-center">
        <h1 className="text-lg font-semibold">We couldn’t find that resume</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          Files are saved in the browser they were created in. It may have been
          deleted, or you’re on a different browser.
        </p>
        <Link href="/" className={buttonVariants({ size: "lg" })}>
          Back to my files
        </Link>
      </div>
    );
  }

  const exportJson = () => {
    const blob = new Blob([JSON.stringify(file.data, null, 2)], {
      type: "application/json",
    });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "resume-data.json";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const importJson = async (e) => {
    const f = e.target.files?.[0];
    e.target.value = "";
    if (!f) return;
    try {
      const parsed = normalize(JSON.parse(await f.text()));
      if (!parsed) throw new Error("bad shape");
      setData(parsed);
      toast.success("Resume data imported.");
    } catch {
      toast.error("That file isn't a valid resume-data.json export.");
    }
  };

  const reset = () => {
    setData(JSON.parse(JSON.stringify(defaultResume)));
    toast.success("Reset to the original resume.");
  };

  const progress = computeProgress(file.data);
  const saveDraft = () => {
    update(id, { status: "draft" });
    toast.success("Saved as draft.");
  };
  const finish = () => {
    update(id, { status: "finished" });
    toast.success("Resume finished.");
  };
  // Finishing an incomplete resume asks first, and lists what is missing.
  const onFinish = () => (progress.percent < 100 ? setConfirmFinish(true) : finish());
  const missing = progress.checks.filter((c) => !c.done).map((c) => c.label);

  const contentH = Math.max(0, paperH - 2 * TOP_PAD);
  const pages = Math.max(1, Math.ceil(contentH / PAGE_CONTENT_H));

  return (
    <div className="flex h-dvh flex-col bg-muted/40 print:block print:h-auto print:bg-white">
      {/* ── Toolbar: back arrow + actions (no navbar on this page) ─────── */}
      <div className="flex shrink-0 items-center gap-1.5 px-3 py-3 sm:gap-2 sm:px-4 print:hidden">
        <Link
          href="/"
          aria-label="Back to my files"
          title="Back to my files"
          className={cn(buttonVariants({ variant: "outline", size: "icon-lg" }), "mr-auto size-10 bg-background")}
        >
          <ArrowLeft />
        </Link>
        <h1 className="sr-only">Solve Resumé</h1>
        <Button variant="outline" size="lg" aria-label="Reset" className="h-10 bg-background" onClick={() => setConfirmReset(true)}>
          <RotateCcw /> <span className="hidden md:inline">Reset</span>
        </Button>
        <Button variant="outline" size="lg" aria-label="Import JSON" className="h-10 bg-background" onClick={() => fileRef.current?.click()}>
          <Upload /> <span className="hidden md:inline">Import</span>
        </Button>
        <Button variant="outline" size="lg" aria-label="Export JSON" className="h-10 bg-background" onClick={exportJson}>
          <FileDown /> <span className="hidden md:inline">Export</span>
        </Button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importJson} />
        <Button size="lg" className="h-10" onClick={download}>
          <Download /> <span className="hidden sm:inline">Download</span> PDF
        </Button>
      </div>

      {/* Mobile: switch between the form and the preview */}
      <Tabs value={tab} onValueChange={setTab} className="shrink-0 border-b bg-background p-2 lg:hidden print:hidden">
        <TabsList className="grid h-10 w-full grid-cols-2">
          <TabsTrigger value="edit" className="h-8">Edit</TabsTrigger>
          <TabsTrigger value="preview" className="h-8">Preview</TabsTrigger>
        </TabsList>
      </Tabs>

      <main className="grid min-h-0 flex-1 lg:grid-cols-[minmax(380px,460px)_1fr] print:block">
        {/* ── Form ──────────────────────────────────────────── */}
        <aside
          className={`min-h-0 overflow-y-auto border-r bg-muted/40 p-3 sm:p-4 print:hidden ${
            tab === "edit" ? "block" : "hidden"
          } lg:block`}
        >
          <FileSettings
            name={file.name}
            template={file.template}
            font={file.font ?? "default"}
            onFont={(font) => update(id, { font })}
            status={statusOf(file)}
            progress={progress}
            onSaveDraft={saveDraft}
            onFinish={onFinish}
            onName={(name) => update(id, { name })}
            onTemplate={(template) => update(id, { template })}
          />
          <ResumeForm data={file.data} setData={setData} />
          <p className="mt-4 mb-2 text-center text-xs text-muted-foreground">
            Changes are saved in this browser automatically.
          </p>
        </aside>

        {/* ── Preview ───────────────────────────────────────── */}
        <div
          ref={previewRef}
          className={`min-h-0 overflow-auto p-4 print:block print:overflow-visible print:p-0 ${
            tab === "preview" ? "block" : "hidden"
          } lg:block`}
        >
          <div className="mb-3 flex justify-center print:hidden">
            {pages === 1 ? (
              <Badge variant="secondary">Fits on 1 page</Badge>
            ) : (
              <Badge variant="destructive">
                Runs to {pages} pages — trim text to fit on one
              </Badge>
            )}
          </div>
          <div
            className="print-reset mx-auto"
            style={{ width: PAPER_W * scale, height: paperH * scale }}
          >
            <div
              ref={paperRef}
              className="paper-sheet relative bg-white shadow-lg ring-1 ring-foreground/10 print:shadow-none print:ring-0"
              style={{
                width: PAPER_W,
                minHeight: 1056,
                padding: `${TOP_PAD}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
              }}
            >
              <ResumePreview data={file.data} template={file.template} font={file.font} />
              {/* Approximate page-break guides (screen only) */}
              {Array.from({ length: pages - 1 }, (_, i) => (
                <div
                  key={i}
                  className="pointer-events-none absolute right-0 left-0 border-t border-dashed border-amber-500 print:hidden"
                  style={{ top: TOP_PAD + (i + 1) * PAGE_CONTENT_H }}
                >
                  <span className="absolute right-2 -top-4 text-[10px] text-amber-600">
                    page {i + 2} starts here (approx.)
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <AlertDialog open={confirmFinish} onOpenChange={setConfirmFinish}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finish with sections missing?</AlertDialogTitle>
            <AlertDialogDescription>
              Still empty: {missing.join(", ")}. You can finish now and keep
              editing later, or stay in draft until it’s complete.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep as draft</AlertDialogCancel>
            <AlertDialogAction onClick={finish}>Finish anyway</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={confirmReset} onOpenChange={setConfirmReset}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reset the content?</AlertDialogTitle>
            <AlertDialogDescription>
              The text goes back to the original resume. Your edits to this file
              will be lost.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={reset}>
              Reset
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
