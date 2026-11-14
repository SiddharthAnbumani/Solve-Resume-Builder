"use client";

import {
  ArrowDown,
  ArrowUp,
  Briefcase,
  FolderGit2,
  GraduationCap,
  Plus,
  Trash2,
  User,
  Wrench,
  AlignLeft,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { blankItems } from "../lib/defaultResume";
import { ph } from "../lib/placeholders";
import { tones } from "../lib/tones";

const BOLD_HINT = "Wrap text in **double asterisks** to make it bold.";

// Label + input (or textarea when `rows` is set). Inputs are 40px tall on touch
// screens so they're easy to tap, and 16px so iOS doesn't zoom on focus.
function Field({ id, label, value, onChange, placeholder, rows, hint, className }) {
  return (
    <div className={`grid gap-1.5 ${className ?? ""}`}>
      <Label htmlFor={id}>{label}</Label>
      {rows ? (
        <Textarea
          id={id}
          rows={rows}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="text-base leading-relaxed focus-visible:border-blue-500 focus-visible:ring-blue-500/25 md:text-sm"
        />
      ) : (
        <Input
          id={id}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="h-10 focus-visible:border-blue-500 focus-visible:ring-blue-500/25 md:h-8"
        />
      )}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

// One accordion section: heading text + "show on resume" switch + body.
function Section({ value, title, icon: Icon, tone, visible, onVisible, onTitle, children }) {
  return (
    <AccordionItem value={value} className="px-5">
      <AccordionTrigger className="items-center py-4 text-sm">
        <span className="flex items-center gap-3">
          <span className={`flex size-8 shrink-0 items-center justify-center rounded-lg ${tones[tone]}`}>
            <Icon className="size-4" />
          </span>
          <span className={visible === false ? "text-muted-foreground line-through" : ""}>
            {title}
          </span>
        </span>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid gap-4 pt-2 pb-6">
          {onVisible && (
            <div className="flex items-center justify-between gap-3 rounded-lg bg-muted/60 px-3 py-2.5">
              <Label htmlFor={`${value}-show`}>Show on resume</Label>
              <Switch
                className="data-checked:bg-emerald-500"
                id={`${value}-show`}
                checked={visible}
                onCheckedChange={onVisible}
              />
            </div>
          )}
          {onTitle && (
            <Field
              id={`${value}-title`}
              label="Section heading"
              value={title}
              onChange={onTitle}
            />
          )}
          {children}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}

// Repeating items with move up / down / delete and an Add button.
function ItemList({ idPrefix, items, onChange, makeBlank, addLabel, label, children }) {
  const move = (i, d) => {
    const next = [...items];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };
  const patch = (i, key, value) =>
    onChange(items.map((it, idx) => (idx === i ? { ...it, [key]: value } : it)));

  return (
    <div className="grid gap-3">
      {items.map((item, i) => (
        <Card key={item.id} size="sm" className="gap-3 bg-muted/30 px-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
              {label} {i + 1}
            </span>
            <div className="flex gap-0.5">
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Move up"
                disabled={i === 0}
                onClick={() => move(i, -1)}
              >
                <ArrowUp />
              </Button>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Move down"
                disabled={i === items.length - 1}
                onClick={() => move(i, 1)}
              >
                <ArrowDown />
              </Button>
              <Button
                variant="ghost"
                size="icon-lg"
                aria-label="Delete"
                className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
          {children(item, (key, value) => patch(i, key, value), `${idPrefix}-${item.id}`)}
        </Card>
      ))}
      <Button
        variant="outline"
        className="h-10 w-full border-dashed md:h-8"
        onClick={() => onChange([...items, makeBlank()])}
      >
        <Plus /> {addLabel}
      </Button>
    </div>
  );
}

export default function ResumeForm({ data, setData }) {
  const set = (section, key, value) =>
    setData((d) => ({ ...d, [section]: { ...d[section], [key]: value } }));
  const setBasics = (key, value) => set("basics", key, value);

  const SECTION_UI = {
    summary: { icon: AlignLeft, tone: "violet" },
    education: { icon: GraduationCap, tone: "emerald" },
    skills: { icon: Wrench, tone: "amber" },
    experience: { icon: Briefcase, tone: "rose" },
    projects: { icon: FolderGit2, tone: "cyan" },
  };

  const sectionProps = (key) => ({
    ...SECTION_UI[key],
    value: key,
    title: data[key].title,
    visible: data[key].visible,
    onVisible: (v) => set(key, "visible", v),
    onTitle: (v) => set(key, "title", v),
  });

  return (
    <Card className="gap-0 py-0">
      <Accordion multiple defaultValue={["basics"]}>
        {/* ── Personal details ─────────────────────────────── */}
        <Section value="basics" title="Personal details" icon={User} tone="blue">
          <Field id="name" placeholder={ph.name} label="Full name" value={data.basics.name} onChange={(v) => setBasics("name", v)} />
          <Field id="phone" placeholder={ph.phone} label="Phone" value={data.basics.phone} onChange={(v) => setBasics("phone", v)} />
          <Field
            id="location"
            placeholder={ph.location}
            label="Location"
            value={data.basics.location}
            onChange={(v) => setBasics("location", v)}
            hint="Use | to separate city, state and country."
          />
          <Field id="email" placeholder={ph.email} label="Email" value={data.basics.email} onChange={(v) => setBasics("email", v)} />
          <div className="grid gap-2">
            <Label>Links</Label>
            <ItemList
              idPrefix="link"
              items={data.basics.links}
              onChange={(v) => setBasics("links", v)}
              makeBlank={blankItems.link}
              addLabel="Add link"
              label="Link"
            >
              {(l, patch, id) => (
                <>
                  <Field id={`${id}-label`} label="Label" placeholder="GitHub" value={l.label} onChange={(v) => patch("label", v)} />
                  <Field id={`${id}-url`} label="URL" placeholder="https://github.com/username" value={l.url} onChange={(v) => patch("url", v)} />
                </>
              )}
            </ItemList>
          </div>
        </Section>

        {/* ── Summary ──────────────────────────────────────── */}
        <Section {...sectionProps("summary")}>
          <Field
            id="summary-text"
            placeholder={ph.summary}
            label="Summary"
            rows={6}
            value={data.summary.text}
            onChange={(v) => set("summary", "text", v)}
            hint={BOLD_HINT}
          />
        </Section>

        {/* ── Education ────────────────────────────────────── */}
        <Section {...sectionProps("education")}>
          <ItemList
            idPrefix="edu"
            items={data.education.items}
            onChange={(v) => set("education", "items", v)}
            makeBlank={blankItems.education}
            addLabel="Add education"
            label="School"
          >
            {(e, patch, id) => (
              <>
                <Field id={`${id}-inst`} placeholder={ph.education.institution} label="Institution" value={e.institution} onChange={(v) => patch("institution", v)} />
                <Field id={`${id}-loc`} placeholder={ph.education.location} label="Location" value={e.location} onChange={(v) => patch("location", v)} />
                <Field id={`${id}-date`} label="Date (shown on the right)" placeholder={ph.education.date} value={e.date} onChange={(v) => patch("date", v)} />
                <Field id={`${id}-deg`} placeholder={ph.education.degree} label="Degree" value={e.degree} onChange={(v) => patch("degree", v)} />
                <div className="grid grid-cols-2 gap-3">
                  <Field id={`${id}-gl`} placeholder="Cumulative GPA" label="Score label" value={e.gpaLabel} onChange={(v) => patch("gpaLabel", v)} />
                  <Field id={`${id}-g`} placeholder={ph.education.gpa} label="Score" value={e.gpa} onChange={(v) => patch("gpa", v)} />
                </div>
              </>
            )}
          </ItemList>
        </Section>

        {/* ── Technical skills ─────────────────────────────── */}
        <Section {...sectionProps("skills")}>
          <ItemList
            idPrefix="skill"
            items={data.skills.items}
            onChange={(v) => set("skills", "items", v)}
            makeBlank={blankItems.skills}
            addLabel="Add skill group"
            label="Skill group"
          >
            {(s, patch, id) => (
              <>
                <Field id={`${id}-t`} placeholder={ph.skills.title} label="Group title" value={s.title} onChange={(v) => patch("title", v)} />
                <Field id={`${id}-d`} label="Description" rows={5} placeholder={ph.skills.text} value={s.text} onChange={(v) => patch("text", v)} hint={BOLD_HINT} />
              </>
            )}
          </ItemList>
        </Section>

        {/* ── Experience ───────────────────────────────────── */}
        <Section {...sectionProps("experience")}>
          <ItemList
            idPrefix="exp"
            items={data.experience.items}
            onChange={(v) => set("experience", "items", v)}
            makeBlank={blankItems.experience}
            addLabel="Add experience"
            label="Role"
          >
            {(x, patch, id) => (
              <>
                <Field id={`${id}-role`} placeholder={ph.experience.role} label="Job title" value={x.role} onChange={(v) => patch("role", v)} />
                <Field id={`${id}-co`} placeholder={ph.experience.company} label="Company" value={x.company} onChange={(v) => patch("company", v)} />
                <Field id={`${id}-loc`} placeholder={ph.experience.location} label="Location" value={x.location} onChange={(v) => patch("location", v)} />
                <Field id={`${id}-date`} label="Dates (shown on the right)" placeholder={ph.experience.date} value={x.date} onChange={(v) => patch("date", v)} />
                <Field id={`${id}-d`} label="Description" rows={5} placeholder={ph.experience.text} value={x.text} onChange={(v) => patch("text", v)} hint={BOLD_HINT} />
              </>
            )}
          </ItemList>
        </Section>

        {/* ── Projects ─────────────────────────────────────── */}
        <Section {...sectionProps("projects")}>
          <ItemList
            idPrefix="proj"
            items={data.projects.items}
            onChange={(v) => set("projects", "items", v)}
            makeBlank={blankItems.projects}
            addLabel="Add project"
            label="Project"
          >
            {(p, patch, id) => (
              <>
                <Field id={`${id}-n`} placeholder={ph.projects.name} label="Project name" value={p.name} onChange={(v) => patch("name", v)} />
                <Field id={`${id}-d`} label="Description" rows={6} placeholder={ph.projects.text} value={p.text} onChange={(v) => patch("text", v)} hint={BOLD_HINT} />
              </>
            )}
          </ItemList>
        </Section>
      </Accordion>
    </Card>
  );
}
