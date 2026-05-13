import type { Metadata } from "next";
import Link from "next/link";
import { Logo } from "@/components/layout/logo";
import { AuthForm } from "@/app/sign-in/auth-form";

export const metadata: Metadata = {
  title: "Sign up",
};

function SignUpPage() {
  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-spotlight" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="glass rounded-xl p-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start reviewing code with CodePilot AI.
          </p>

          <AuthForm mode="sign-up" />

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Already have an account?{" "}
            <Link href="/sign-in" className="text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </div>
        <p className="mt-4 text-center text-[11px] text-muted-foreground">
          Authentication is mocked — wire up Clerk later via{" "}
          <code className="font-mono">@clerk/nextjs</code>.
        </p>
      </div>
    </main>
  );
}

export default SignUpPage;
