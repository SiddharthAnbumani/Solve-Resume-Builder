import AuthShell from "../components/auth/AuthShell";
import SignUpForm from "../components/auth/SignUpForm";

export const metadata = { title: "Create account · Solve Resumé" };

export default function SignUpPage() {
  return (
    <AuthShell>
      <SignUpForm />
    </AuthShell>
  );
}
