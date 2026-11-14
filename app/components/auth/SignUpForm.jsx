"use client";

import { useState } from "react";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { NotConnectedError, signUp } from "../../lib/auth-client";
import { isEmail, passwordScore } from "../../lib/validation";
import FormField from "./FormField";
import PasswordInput from "./PasswordInput";

const STRENGTH = ["Too short", "Weak", "Okay", "Good", "Strong"];

export default function SignUpForm() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const score = passwordScore(values.password);

  const set = (k) => (e) => {
    setValues((v) => ({ ...v, [k]: e.target.value }));
    if (errors[k]) setErrors((x) => ({ ...x, [k]: undefined }));
  };

  const submit = async (e) => {
    e.preventDefault();
    const next = {};
    if (!values.name.trim()) next.name = "Enter your name.";
    if (!isEmail(values.email)) next.email = "Enter a valid email address.";
    if (values.password.length < 8) next.password = "Use at least 8 characters.";
    if (values.confirm !== values.password) next.confirm = "Passwords don’t match.";
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    try {
      await signUp({
        name: values.name.trim(),
        email: values.email.trim(),
        password: values.password,
      });
    } catch (err) {
      if (err instanceof NotConnectedError) {
        toast.info("The sign-up form is ready; the backend isn't connected yet.");
      } else {
        toast.error(err.message || "Couldn't create your account.");
      }
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1.5 text-sm text-muted-foreground">
        Save your resumes and open them from any device.
      </p>

      <form onSubmit={submit} noValidate className="mt-8 grid gap-5">
        <FormField id="name" label="Full name" error={errors.name}>
          <Input
            id="name"
            autoComplete="name"
            placeholder="Alex Morgan"
            value={values.name}
            onChange={set("name")}
            aria-invalid={!!errors.name}
            aria-describedby={errors.name ? "name-error" : undefined}
            className="h-11"
          />
        </FormField>

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
          hint="At least 8 characters. Mix upper and lower case, numbers and symbols."
        >
          <PasswordInput
            id="password"
            autoComplete="new-password"
            placeholder="Create a password"
            value={values.password}
            onChange={set("password")}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? "password-error" : "password-hint"}
          />
          {values.password && (
            <div className="flex items-center gap-2" aria-live="polite">
              <div className="grid flex-1 grid-cols-4 gap-1" aria-hidden>
                {[1, 2, 3, 4].map((i) => (
                  <span
                    key={i}
                    className={`h-1 rounded-full transition-colors ${
                      i <= score ? "bg-foreground" : "bg-muted"
                    }`}
                  />
                ))}
              </div>
              <span className="w-16 text-right text-xs text-muted-foreground">
                {STRENGTH[score]}
              </span>
            </div>
          )}
        </FormField>

        <FormField id="confirm" label="Confirm password" error={errors.confirm}>
          <PasswordInput
            id="confirm"
            autoComplete="new-password"
            placeholder="Repeat your password"
            value={values.confirm}
            onChange={set("confirm")}
            aria-invalid={!!errors.confirm}
            aria-describedby={errors.confirm ? "confirm-error" : undefined}
          />
        </FormField>

        <Button type="submit" size="lg" disabled={busy} className="h-11 w-full text-sm">
          {busy && <Loader2 className="animate-spin" />}
          {busy ? "Creating account…" : "Create account"}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link href="/signin" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign in
        </Link>
      </p>
    </>
  );
}
