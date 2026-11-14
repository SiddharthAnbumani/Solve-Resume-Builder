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
];

export const templateName = (id) =>
  templates.find((t) => t.id === id)?.name ?? "Classic";

// Class tokens used by ResumePreview. Sizes are in pt so print matches screen.
export const themes = {
  classic: {
    root: "font-resume text-[10pt] leading-[11.5pt]",
    header: "text-center",
    name: "text-[17pt] leading-[20pt] font-bold uppercase",
    contact: "font-contact mt-[10pt] text-center text-[10pt] leading-[13pt]",
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
    root: "font-contact text-[10pt] leading-[13pt]",
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
    root: "font-resume text-[9.5pt] leading-[11pt]",
    header: "text-center",
    name: "text-[16pt] leading-[18pt] font-bold uppercase",
    contact: "font-contact mt-[6pt] text-center text-[9.5pt] leading-[12pt]",
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
};
