"use client";

import { memo } from "react";
import { Check, Circle, FileCheck2, PencilLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { defaultResume } from "../lib/defaultResume";
import { fonts } from "../lib/fonts";
import { templates } from "../lib/templates";
import { progressColor, statusBadge } from "../lib/tones";
import ResumeThumb from "./ResumeThumb";

const Thumb = memo(ResumeThumb);

// File name, status (draft / finished), completion level and template picker.
// Everything is a plain button, so it's easy to tap on a phone.
export default function FileSettings({
  name,
  template,
  font,
  status,
  progress,
  onName,
  onTemplate,
  onFont,
  onSaveDraft,
  onFinish,
}) {
  const finished = status === "finished";
  return (
    <Card className="mb-3 gap-5 px-4">
      <div className="grid gap-1.5">
        <Label htmlFor="file-name">File name</Label>
        <Input
          id="file-name"
          value={name}
          onChange={(e) => onName(e.target.value)}
          className="h-10 md:h-8"
        />
      </div>

      {/* Status + level */}
      <div className="grid gap-3">
        <div className="flex items-center justify-between gap-2">
          <Label>Status</Label>
          <Badge className={statusBadge[finished ? "finished" : "draft"]}>
            {finished ? "Finished" : "Draft"}
          </Badge>
        </div>

        <div>
          <div className="mb-1.5 flex items-baseline justify-between text-xs">
            <span className="font-medium">{progress.level}</span>
            <span className="text-muted-foreground">
              {progress.done} of {progress.total} sections · {progress.percent}%
            </span>
          </div>
          <div
            role="progressbar"
            aria-valuenow={progress.percent}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Resume completion"
            className="h-1.5 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={`h-full rounded-full transition-[width,background-color] duration-300 ${progressColor(progress.percent)}`}
              style={{ width: `${progress.percent}%` }}
            />
          </div>
          <ul className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            {progress.checks.map((c) => (
              <li
                key={c.key}
                className={`flex items-center gap-1.5 ${c.done ? "text-foreground" : "text-muted-foreground"}`}
              >
                {c.done ? (
                  <Check className="size-3.5 shrink-0 text-emerald-600" />
                ) : (
                  <Circle className="size-3.5 shrink-0 opacity-50" />
                )}
                <span className="truncate">{c.label}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <Button
            variant="outline"
            size="lg"
            className="h-10"
            disabled={!finished}
            onClick={onSaveDraft}
          >
            <PencilLine /> {finished ? "Reopen as draft" : "Save as draft"}
          </Button>
          <Button size="lg" className="h-10 bg-emerald-600 text-white hover:bg-emerald-700 disabled:bg-emerald-600" disabled={finished} onClick={onFinish}>
            <FileCheck2 /> {finished ? "Finished" : "Finish resume"}
          </Button>
        </div>
        <p className="-mt-1 text-xs text-muted-foreground">
          {finished
            ? "This resume is marked finished. You can still edit it."
            : "Changes save automatically. Finish it when you’re happy with it."}
        </p>
      </div>

      <div className="grid gap-3">
        <Label>Template</Label>
        <div className="grid grid-cols-3 gap-2">
          {templates.map((t) => {
            const active = t.id === template;
            return (
              <button
                key={t.id}
                type="button"
                aria-pressed={active}
                onClick={() => onTemplate(t.id)}
                className={`flex flex-col items-center gap-1.5 rounded-lg p-2 text-xs font-medium transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  active
                    ? "bg-primary/5 ring-2 ring-primary"
                    : "ring-1 ring-foreground/10 hover:bg-muted"
                }`}
              >
                <span className="overflow-hidden rounded-sm ring-1 ring-foreground/10">
                  <Thumb data={defaultResume} template={t.id} font={font} width={84} />
                </span>
                {t.name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-3">
        <Label>Font</Label>
        <div className="grid grid-cols-2 gap-2">
          {fonts.map((f) => {
            const active = f.id === font;
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={active}
                onClick={() => onFont(f.id)}
                className={`flex min-h-10 flex-col items-start justify-center rounded-lg px-2.5 py-1.5 text-left transition-colors outline-none focus-visible:ring-3 focus-visible:ring-ring/50 ${
                  active
                    ? "bg-primary/5 ring-2 ring-primary"
                    : "ring-1 ring-foreground/10 hover:bg-muted"
                }`}
              >
                <span
                  className="text-sm leading-tight font-semibold"
                  style={f.stack ? { fontFamily: f.stack } : undefined}
                >
                  Aa {f.stack ? f.name : "Default"}
                </span>
                {!f.stack && (
                  <span className="text-[11px] leading-tight text-muted-foreground">
                    Template’s own font
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}
