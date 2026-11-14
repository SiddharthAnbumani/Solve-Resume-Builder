import Link from "next/link";
import Logo from "../Logo";
import ResumeStack from "../ResumeStack";
import ResumeThumb from "../ResumeThumb";
import { defaultResume } from "../../lib/defaultResume";

// Shared frame for the sign in / sign up pages.
//  - Large screens: black brand panel on the left, form on the right.
//  - Phones: a black top section (logo, headline, resume pages), with the form
//    on a white card that slides up over it.
export default function AuthShell({ children }) {
  return (
    <div className="min-h-dvh bg-black lg:grid lg:grid-cols-2 lg:bg-background">
      {/* Brand panel (desktop) */}
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-black p-12 text-white lg:flex">
        <Link href="/" aria-label="Solve home" className="w-fit">
          <Logo />
        </Link>

        <div className="relative z-10 max-w-md">
          <h2 className="text-4xl leading-[1.1] font-semibold tracking-tight">
            Your resumes, saved and ready on any device.
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/60">
            Build once, switch templates any time, and download a clean
            one-page PDF whenever you need it.
          </p>
        </div>

        <DesktopPages />

        <p className="relative z-10 text-xs text-white/40">Solve Resumé</p>
      </aside>

      {/* Phone / tablet top section */}
      <div className="flex min-h-dvh flex-col lg:min-h-0 lg:bg-background">
        <div className="bg-black text-white lg:hidden">
          <header className="flex h-20 items-center justify-center px-5">
            <Link href="/" aria-label="Solve home">
              <Logo />
            </Link>
          </header>
          <div className="px-5 pt-2 pb-14 text-center">
            <h2 className="mx-auto max-w-xs text-xl leading-snug font-semibold tracking-tight">
              Your resumes, saved and ready on any device.
            </h2>
            <div className="mt-7">
              <ResumeStack variant="sm" />
            </div>
          </div>
        </div>

        {/* Form: a white card over the black section on phones */}
        <main className="relative -mt-8 flex flex-1 justify-center rounded-t-[2rem] bg-background px-5 pt-9 pb-10 sm:px-8 lg:mt-0 lg:items-center lg:rounded-none lg:py-10">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}

// The tilted pages behind the desktop panel.
function DesktopPages() {
  return (
    <div aria-hidden className="pointer-events-none absolute -right-16 bottom-[-120px] flex gap-6">
      <div className="-rotate-6 rounded-sm shadow-2xl ring-1 ring-white/10">
        <ResumeThumb data={defaultResume} template="modern" width={260} />
      </div>
      <div className="mt-10 rotate-3 rounded-sm shadow-2xl ring-1 ring-white/10">
        <ResumeThumb data={defaultResume} template="classic" width={260} />
      </div>
    </div>
  );
}
