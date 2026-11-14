import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Logo from "./components/Logo";
import ResumeStack from "./components/ResumeStack";
import ResumeThumb from "./components/ResumeThumb";
import SmoothLink from "./components/SmoothLink";
import { defaultResume } from "./lib/defaultResume";
import { templates } from "./lib/templates";

const navLink =
  "hidden rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white sm:block";

const whiteBtn = cn(buttonVariants({ size: "lg" }), "h-11 bg-white px-5 text-black hover:bg-white/85");
const ghostBtn = cn(
  buttonVariants({ variant: "outline", size: "lg" }),
  "h-11 border-white/25 bg-transparent px-5 text-white hover:bg-white/10 hover:text-white"
);

// The public page. Making a resume needs an account, so every way in leads to
// sign in. Signed-in people are sent to /dashboard by proxy.js before this renders.
export default function Landing() {
  return (
    <div className="min-h-dvh bg-background">
      {/* ── Navbar ────────────────────────────────────────────── */}
      <header className="sticky top-0 z-20 h-20 border-b border-white/10 bg-black text-white">
        <div className="mx-auto flex h-full max-w-7xl items-center gap-1 px-5 sm:px-8 lg:px-12">
          <Link href="/" aria-label="Solve home" className="mr-auto">
            <Logo />
          </Link>
          <SmoothLink to="templates" spy activeClass="text-white!" className={navLink}>
            Templates
          </SmoothLink>
          <Link
            href="/signin"
            className="rounded-md px-3 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className={cn(
              buttonVariants({ size: "lg" }),
              "ml-1 h-10 bg-white px-4 text-black hover:bg-white/85"
            )}
          >
            Get started
          </Link>
        </div>
      </header>

      {/* ── Hero ──────────────────────────────────────────────── */}
      <section className="overflow-hidden bg-black text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-12 sm:px-8 md:py-20 lg:grid-cols-[1.1fr_1fr] lg:px-12">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            <span className="inline-flex items-center rounded-full border border-white/25 px-3 py-1 text-xs font-medium text-white/80">
              Free · Saved to your account
            </span>
            <h1 className="mt-5 text-[2.125rem] leading-[1.12] font-semibold tracking-tight sm:text-5xl">
              Your resume, built in minutes.
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-white/65 sm:text-lg">
              Fill in a simple form, watch the page update live, and download a
              clean one-page PDF with real, selectable text.
            </p>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <SmoothLink to="templates" className={whiteBtn}>
                Pick a template <ArrowRight />
              </SmoothLink>
              <Link href="/signin" className={ghostBtn}>
                Sign in
              </Link>
            </div>
          </div>

          {/* The same resume pages on every screen size */}
          <ResumeStack variant="md" className="lg:hidden" />
          <ResumeStack variant="lg" className="hidden lg:block" />
        </div>
      </section>

      {/* ── Templates ─────────────────────────────────────────── */}
      <section id="templates" className="mx-auto max-w-7xl scroll-mt-24 px-5 py-12 sm:px-8 sm:py-14 lg:px-12">
        <h2 className="text-center text-2xl font-semibold tracking-tight sm:text-left">Templates</h2>
        <p className="mt-1.5 text-center text-sm text-muted-foreground sm:text-left">
          Pick a look. You can switch templates any time inside the editor.
        </p>
        <div className="mt-8 grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
          {templates.map((t) => (
            <Card key={t.id} className="gap-0 py-0">
              <div className="flex justify-center bg-muted/60 px-4 pt-6">
                <div className="overflow-hidden rounded-t-sm shadow-md ring-1 ring-foreground/10">
                  <ResumeThumb data={defaultResume} template={t.id} width={260} />
                </div>
              </div>
              <div className="grid gap-3 p-5 sm:p-4">
                <div className="text-center sm:text-left">
                  <h3 className="font-semibold">{t.name}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t.description}</p>
                </div>
                {/* Signing in carries the chosen template through to the editor. */}
                <Link
                  href={`/signin?template=${t.id}`}
                  className={cn(buttonVariants({ size: "lg" }), "h-10")}
                >
                  Sign in to continue <ArrowRight />
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ── Sign-in call to action ────────────────────────────── */}
      <section className="bg-black text-white">
        <div className="mx-auto flex max-w-3xl flex-col items-center px-5 py-16 text-center sm:px-8 sm:py-20">
          <h2 className="text-[1.75rem] leading-tight font-semibold tracking-tight sm:text-4xl">
            Sign in to start making a resume
          </h2>
          <p className="mt-4 max-w-md text-base leading-relaxed text-white/60">
            Your resumes are saved to your account, so you can pick them up on
            any device.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/signin" className={cn(whiteBtn, "px-6")}>
              Sign in <ArrowRight />
            </Link>
            <Link href="/signup" className={cn(ghostBtn, "px-6")}>
              Create account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
