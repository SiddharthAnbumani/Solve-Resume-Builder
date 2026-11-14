// Resume font options. `stack: null` means "use the template's own fonts".
// `scale` shrinks type a little: these sans-serifs are wider than Times New
// Roman, so at the same point size a resume would spill onto a second page.
export const fonts = [
  { id: "default", name: "Template default", stack: null, scale: 1 },
  { id: "montserrat", name: "Montserrat", stack: 'var(--font-mont), Montserrat, system-ui, sans-serif', scale: 0.86 },
  { id: "inter", name: "Inter", stack: 'var(--font-inter), Inter, system-ui, sans-serif', scale: 0.89 },
  { id: "arial", name: "Arial", stack: 'Arial, Helvetica, "Liberation Sans", sans-serif', scale: 0.92 },
];

export const fontStack = (id) => fonts.find((f) => f.id === id)?.stack ?? null;

export const fontScale = (id) => fonts.find((f) => f.id === id)?.scale ?? 1;
