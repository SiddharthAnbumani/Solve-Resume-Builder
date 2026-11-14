// UI colours for the editor and file list. (The resume itself stays as designed.)
// Full class names are written out so Tailwind can see them.

export const tones = {
  blue: "bg-blue-600 text-white",
  violet: "bg-violet-600 text-white",
  emerald: "bg-emerald-600 text-white",
  amber: "bg-amber-500 text-white",
  rose: "bg-rose-600 text-white",
  cyan: "bg-cyan-600 text-white",
};

export const statusBadge = {
  draft: "border-transparent bg-amber-100 text-amber-800",
  finished: "border-transparent bg-emerald-100 text-emerald-700",
};

// The progress bar changes colour as the resume fills in.
export function progressColor(percent) {
  if (percent >= 100) return "bg-emerald-500";
  if (percent >= 70) return "bg-blue-500";
  if (percent >= 35) return "bg-amber-500";
  return "bg-rose-500";
}
