import Link from "next/link";
import Logo from "../Logo";
import ResumeThumb from "../ResumeThumb";
import { defaultResume } from "../../lib/defaultResume";

// Shared frame for the sign in / sign up pages: a black brand panel on large
// screens, and the black navbar on phones.
export default function AuthShell({ children }) {
  return (
    <div className="min-h-dvh bg-background lg:grid lg:grid-cols-2">
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

        <div aria-hidden className="pointer-events-none absolute -right-16 bottom-[-120px] flex gap-6">
          <div className="-rotate-6 rounded-sm shadow-2xl ring-1 ring-white/10">
            <ResumeThumb data={defaultResume} template="modern" width={260} />
          </div>
          <div className="mt-10 rotate-3 rounded-sm shadow-2xl ring-1 ring-white/10">
            <ResumeThumb data={defaultResume} template="classic" width={260} />
          </div>
        </div>

        <p className="relative z-10 text-xs text-white/40">Solve Resumé</p>
      </aside>

      {/* Form side */}
      <div className="flex min-h-dvh flex-col">
        <header className="flex h-20 shrink-0 items-center bg-black px-4 lg:hidden">
          <Link href="/" aria-label="Solve home">
            <Logo />
          </Link>
        </header>
        <main className="flex flex-1 items-center justify-center px-4 py-10 sm:px-8">
          <div className="w-full max-w-sm">{children}</div>
        </main>
      </div>
    </div>
  );
}
