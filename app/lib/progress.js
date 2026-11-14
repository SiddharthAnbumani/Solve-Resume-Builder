// How complete a resume is, and which "level" that puts it at.
const real = (v) => String(v ?? "").trim();

const hasEntry = (section) =>
  section.items.some((it) =>
    Object.entries(it).some(
      ([k, v]) => k !== "id" && k !== "gpaLabel" && real(v)
    )
  );

export function levelFor(percent) {
  if (percent >= 100) return "Complete";
  if (percent >= 70) return "Almost there";
  if (percent >= 35) return "Taking shape";
  return "Just started";
}

export function computeProgress(data) {
  const checks = [
    { key: "name", label: "Name", done: !!real(data.basics.name) },
    {
      key: "contact",
      label: "Contact details",
      done: !!(real(data.basics.email) || real(data.basics.phone)),
    },
  ];
  if (data.summary.visible)
    checks.push({ key: "summary", label: data.summary.title, done: !!real(data.summary.text) });
  for (const k of ["education", "skills", "experience", "projects"]) {
    if (data[k].visible) checks.push({ key: k, label: data[k].title, done: hasEntry(data[k]) });
  }
  const done = checks.filter((c) => c.done).length;
  const percent = Math.round((done / checks.length) * 100);
  return { checks, done, total: checks.length, percent, level: levelFor(percent) };
}

export const STATUSES = ["draft", "finished"];
export const statusOf = (file) => (file.status === "finished" ? "finished" : "draft");
