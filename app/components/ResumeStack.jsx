import ResumeThumb from "./ResumeThumb";
import { defaultResume } from "../lib/defaultResume";

// Two overlapping resume pages, used in the hero and on the auth pages.
// Fixed sizes per variant so it stays crisp and centred on any screen.
const VARIANTS = {
  // Desktop hero
  lg: { box: "h-[420px] w-full max-w-md", back: 250, front: 270, backPos: "top-4 left-2", frontPos: "top-0 right-2" },
  // Phone hero
  md: { box: "h-[250px] w-full max-w-[330px]", back: 164, front: 180, backPos: "top-5 left-0", frontPos: "top-0 right-0" },
  // Phone auth pages
  sm: { box: "h-[176px] w-full max-w-[250px]", back: 112, front: 124, backPos: "top-4 left-0", frontPos: "top-0 right-0" },
};

export default function ResumeStack({ variant = "md", className = "" }) {
  const v = VARIANTS[variant];
  return (
    <div aria-hidden className={`pointer-events-none relative mx-auto select-none ${v.box} ${className}`}>
      <div className={`absolute ${v.backPos} -rotate-6 overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10`}>
        <ResumeThumb data={defaultResume} template="modern" width={v.back} />
      </div>
      <div className={`absolute ${v.frontPos} rotate-3 overflow-hidden rounded-sm shadow-2xl ring-1 ring-white/10`}>
        <ResumeThumb data={defaultResume} template="classic" width={v.front} />
      </div>
    </div>
  );
}
