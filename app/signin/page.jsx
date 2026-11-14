import AuthShell from "../components/auth/AuthShell";
import SignInForm from "../components/auth/SignInForm";

export const metadata = { title: "Sign in · Solve Resumé" };

export default function SignInPage() {
  return (
    <AuthShell>
      <SignInForm />
    </AuthShell>
  );
}
