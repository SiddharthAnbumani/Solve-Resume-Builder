"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn } from "../../lib/auth-client";
import { isEmail } from "../../lib/validation";
import { useAuth } from "../AuthProvider";
import { dashboardUrl, useTemplateParam } from "../../lib/useTemplateParam";
import { templateName } from "../../lib/templates";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";

export default function SignInForm() {
  const router = useRouter();
  const { user, setUser } = useAuth();
  const tpl = useTemplateParam();
  const target = dashboardUrl(tpl);
  const [values, setValues] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  // Already signed in? Nothing to do here.
  useEffect(() => {
    if (user) router.replace(target);
  }, [user, router, target]);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (!values.password) next.password = "Enter your password.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      const signedIn = await signIn({ email: values.email.trim(), password: values.password });
      setUser(signedIn);
      toast.success(`Welcome back, ${signedIn.name.split(" ")[0]}.`);
      router.push(target);
    } catch (err) {
      if (err.status === 401 || err.status === 429) setErrors({ form: err.message });
      else toast.error(err.message || "Couldn't sign you in.");
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-center text-2xl font-semibold tracking-tight lg:text-left">Welcome back</h1>
      <p className="mt-1.5 text-center text-sm text-muted-foreground lg:text-left">
        {tpl ? `Sign in to start your ${templateName(tpl)} resume.` : "Sign in to open your saved resumes."}
      </p>

      <form onSubmit={submit} noValidate className="mt-7 grid gap-5">
        <FormField id="email" label="Email" error={errors.email}>
          <Input
            id="email"
            type="email"
            inputMode="email"
            autoComplete="email"
            autoCapitalize="none"
            placeholder="you@example.com"
            value={values.email}
            onChange={set("email")}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? "email-error" : undefined}
            className="h-11"
          />
        </FormField>

        <FormField
          id="password"
          label="Password"
          error={errors.password}
          action={
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Forgot password?
            </Link>
          }
        >
          <PasswordInput
            id="password"
            autoComplete="current-password"
            placeholder="Your password"
            value={values.password}
            onChange={set("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : undefined}
          />
        </FormField>

        {errors.form && (
          <p role="alert" className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
            {errors.form}
          </p>
        )}

        <Button type="submit" size="lg" disabled={busy} className="h-11 w-full text-sm">
          {busy && <Loader2 className="animate-spin" />}
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        New here?{" "}
        <Link href={tpl ? `/signup?template=${tpl}` : "/signup"} className="font-medium text-foreground underline-offset-4 hover:underline">
          Create an account
        </Link>
      </p>
    </>
  );
}
