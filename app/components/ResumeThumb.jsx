import ResumePreview from "./ResumePreview";

const PAPER_W = 816;
const PAPER_H = 1056;

// A tiny, non-interactive picture of a resume page. `width` is in CSS px.
export default function ResumeThumb({ data, template, font, width = 240 }) {
  const scale = width / PAPER_W;
  return (
    <div
      aria-hidden
      inert
      className="relative overflow-hidden bg-white"
      style={{ width, height: PAPER_H * scale }}
    >
      <div
        className="absolute top-0 left-0 bg-white"
        style={{
          width: PAPER_W,
          height: PAPER_H,
          padding: 48,
          transform: `scale(${scale})`,
          transformOrigin: "top left",
        }}
      >
        <ResumePreview data={data} template={template} font={font} />
      </div>
    </div>
  );
}
