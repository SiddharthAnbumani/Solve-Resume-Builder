export const templates = [
  {
    id: "classic",
    name: "Classic",
    description: "Times New Roman with centred headings. Matches your original PDF.",
  },
  {
    id: "modern",
    name: "Modern",
    description: "Clean sans-serif, left-aligned, with a blue accent.",
  },
  {
    id: "compact",
    name: "Compact",
    description: "Tighter type and spacing for dense one-page resumes.",
  },
  {
    id: "minimal",
    name: "Minimal",
    description: "Quiet and airy. Small grey headings, no lines, lots of white space.",
  },
  {
    id: "serif",
    name: "Serif",
    description: "Elegant serif with a centred name and italic headings.",
  },
  {
    id: "mono",
    name: "Mono",
    description: "Monospace for a technical, plain-text feel.",
  },
  {
    id: "quiet",
    name: "Quiet",
    description: "Light, widely spaced type with soft dotted dividers.",
  },
  {
    id: "bar",
    name: "Bar",
    description: "Left-aligned headings marked by a thin vertical bar.",
  },
];

export const templateName = (id) =>
  templates.find((t) => t.id === id)?.name ?? "Classic";

// Font families used by the themes below.
const SERIF = '"Times New Roman", var(--font-tinos), "Liberation Serif", Times, serif';
const CALIBRI = 'Calibri, var(--font-carlito), "Segoe UI", Arial, sans-serif';
const INTER = 'var(--font-inter), Inter, system-ui, sans-serif';
const GEORGIA = 'Georgia, var(--font-tinos), "Times New Roman", serif';
const MONO = 'ui-monospace, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace';

// Class tokens used by ResumePreview. Sizes are in pt so print matches screen.
// `family` is the page font; `contactFamily` (optional) is a different font
// for the contact line. Both are replaced when the user picks a font.
export const themes = {
  classic: {
    family: SERIF,
    contactFamily: CALIBRI,
    root: "text-[10pt] leading-[11.5pt]",
    header: "text-center",
    name: "text-[17pt] leading-[20pt] font-bold uppercase",
    contact: "mt-[10pt] text-center text-[10pt] leading-[13pt]",
    links: "mt-[1pt] text-center text-[7.5pt] leading-[9pt]",
    section: "mt-[15pt]",
    h2: "border-b-[0.75pt] border-[#555] pb-[6pt] text-center text-[9.5pt] leading-[11pt] font-bold uppercase",
    body: "mt-[14pt]",
    big: "text-[11pt] leading-[12.5pt]",
    align: "text-justify",
    gap: "space-y-[12pt]",
    bigGap: "space-y-[14pt]",
    skillTitle: "text-[9.5pt] leading-[11pt] font-bold uppercase",
    link: "text-[#0563c1] underline",
  },
  modern: {
    family: CALIBRI,
    root: "text-[10pt] leading-[13pt]",
    header: "text-left",
    name: "text-[24pt] leading-[28pt] font-bold tracking-tight",
    contact: "mt-[6pt] text-[10pt] leading-[13pt] text-[#444]",
    links: "mt-[1pt] text-[9pt] leading-[12pt] text-[#444]",
    section: "mt-[13pt]",
    h2: "border-b-[1pt] border-[#1d4ed8] pb-[3pt] text-left text-[10pt] leading-[12pt] font-bold tracking-[0.12em] text-[#1d4ed8] uppercase",
    body: "mt-[8pt]",
    big: "text-[10pt] leading-[13pt]",
    align: "text-left",
    gap: "space-y-[9pt]",
    bigGap: "space-y-[9pt]",
    skillTitle: "text-[10pt] leading-[12pt] font-bold text-[#1d4ed8] uppercase",
    link: "text-[#1d4ed8] underline",
  },
  compact: {
    family: SERIF,
    contactFamily: CALIBRI,
    root: "text-[9.5pt] leading-[11pt]",
    header: "text-center",
    name: "text-[16pt] leading-[18pt] font-bold uppercase",
    contact: "mt-[6pt] text-center text-[9.5pt] leading-[12pt]",
    links: "mt-[1pt] text-center text-[7.5pt] leading-[9pt]",
    section: "mt-[10pt]",
    h2: "border-b-[0.5pt] border-black pb-[2pt] text-left text-[9.5pt] leading-[11pt] font-bold uppercase",
    body: "mt-[5pt]",
    big: "text-[10pt] leading-[11.5pt]",
    align: "text-justify",
    gap: "space-y-[6pt]",
    bigGap: "space-y-[6pt]",
    skillTitle: "text-[9.5pt] leading-[11pt] font-bold uppercase",
    link: "text-[#0563c1] underline",
  },

  // ── Minimal templates ───────────────────────────────────────────────
  // Plain black on white, one font, no colour, no boxes.

  // Small grey headings, no rules, plenty of air.
  minimal: {
    family: INTER,
    root: "text-[9pt] leading-[12.5pt]",
    header: "text-left",
    name: "text-[22pt] leading-[26pt] font-semibold tracking-tight",
    contact: "mt-[6pt] text-[8.5pt] leading-[12pt] text-[#555]",
    links: "mt-[1pt] text-[8pt] leading-[11pt] text-[#555]",
    section: "mt-[15pt]",
    h2: "text-left text-[8pt] leading-[10pt] font-semibold tracking-[0.18em] text-[#888] uppercase",
    body: "mt-[6pt]",
    big: "text-[9pt] leading-[12.5pt]",
    align: "text-left",
    gap: "space-y-[8pt]",
    bigGap: "space-y-[8pt]",
    skillTitle: "text-[9pt] leading-[12pt] font-semibold",
    link: "text-[#333] underline decoration-[#aaa] underline-offset-2",
  },

  // Georgia, centred name, italic headings with a short rule underneath.
  serif: {
    family: GEORGIA,
    root: "text-[9.5pt] leading-[12.5pt]",
    header: "text-center",
    name: "text-[19pt] leading-[23pt] font-normal tracking-[0.1em] uppercase",
    contact: "mt-[7pt] text-center text-[9pt] leading-[12pt] text-[#444]",
    links: "mt-[1pt] text-center text-[8pt] leading-[11pt] text-[#444]",
    section: "mt-[14pt]",
    h2: "text-center text-[10pt] leading-[12pt] font-normal italic tracking-[0.04em] after:mx-auto after:mt-[4pt] after:block after:h-px after:w-8 after:bg-[#999] after:content-['']",
    body: "mt-[8pt]",
    big: "text-[9.5pt] leading-[12.5pt]",
    align: "text-justify",
    gap: "space-y-[9pt]",
    bigGap: "space-y-[9pt]",
    skillTitle: "text-[9.5pt] leading-[12pt] font-bold italic",
    link: "text-[#222] underline decoration-[#999] underline-offset-2",
  },

  // Monospace, smaller type, headings prefixed with //.
  mono: {
    family: MONO,
    root: "text-[8pt] leading-[11.5pt]",
    header: "text-left",
    name: "text-[15pt] leading-[19pt] font-bold",
    contact: "mt-[5pt] text-[8pt] leading-[11pt] text-[#555]",
    links: "mt-[1pt] text-[7.5pt] leading-[10pt] text-[#555]",
    section: "mt-[13pt]",
    h2: "text-left text-[8.5pt] leading-[11pt] font-bold tracking-wide uppercase before:text-[#999] before:content-['//_']",
    body: "mt-[6pt]",
    big: "text-[8pt] leading-[11.5pt]",
    align: "text-left",
    gap: "space-y-[8pt]",
    bigGap: "space-y-[8pt]",
    skillTitle: "text-[8pt] leading-[11pt] font-bold",
    link: "text-black underline",
  },

  // Light, widely spaced type with dotted dividers.
  quiet: {
    family: CALIBRI,
    root: "text-[9.5pt] leading-[13pt]",
    header: "text-center",
    name: "text-[19pt] leading-[23pt] font-light tracking-[0.22em] uppercase",
    contact: "mt-[8pt] text-center text-[9.5pt] leading-[13pt] text-[#666]",
    links: "mt-[1pt] text-center text-[8.5pt] leading-[11pt] text-[#666]",
    section: "mt-[15pt]",
    h2: "border-b-[0.75pt] border-dotted border-[#bbb] pb-[5pt] text-center text-[8.5pt] leading-[10pt] font-medium tracking-[0.26em] text-[#777] uppercase",
    body: "mt-[8pt]",
    big: "text-[9.5pt] leading-[13pt]",
    align: "text-left",
    gap: "space-y-[9pt]",
    bigGap: "space-y-[9pt]",
    skillTitle: "text-[9.5pt] leading-[12pt] font-medium tracking-wide",
    link: "text-[#444] underline decoration-[#bbb] underline-offset-2",
  },

  // Headings marked by a thin vertical bar.
  bar: {
    family: CALIBRI,
    root: "text-[9.5pt] leading-[12.5pt]",
    header: "text-left",
    name: "text-[21pt] leading-[25pt] font-bold tracking-tight",
    contact: "mt-[6pt] text-[9.5pt] leading-[12.5pt] text-[#444]",
    links: "mt-[1pt] text-[8.5pt] leading-[11pt] text-[#444]",
    section: "mt-[14pt]",
    h2: "border-l-[2pt] border-black pl-[7pt] text-left text-[9.5pt] leading-[11pt] font-bold tracking-[0.14em] uppercase",
    body: "mt-[7pt]",
    big: "text-[9.5pt] leading-[12.5pt]",
    align: "text-left",
    gap: "space-y-[9pt]",
    bigGap: "space-y-[9pt]",
    skillTitle: "text-[9.5pt] leading-[12pt] font-bold",
    link: "text-black underline underline-offset-2",
  },
};
