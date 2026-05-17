"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { signInWithPopup } from "firebase/auth";
import { auth, githubProvider } from "@/app/services/auth/firebaseConfig";
import { AuthForm } from "@/app/sign-in/auth-form";
import { Logo } from "@/components/layout/logo";
import { cn } from "@/lib/utils";

type LoginFeedback =
  | null
  | { success: true; message: string }
  | { success: false; message: string };

function SignInPage() {
  const router = useRouter();
  const [loginFeedback, setLoginFeedback] = useState<LoginFeedback>(null);

  const handleLoginSuccess = (token: string) => {
    localStorage.setItem("token", token);
    setLoginFeedback({
      success: true,
      message: "Log in successfully",
    });
    window.setTimeout(() => {
      router.push("/dashboard");
    }, 1500);
  };

  const handleGithubSignIn = async () => {
    setLoginFeedback(null);
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const user = result.user;
      const token = await user.getIdToken();
      console.log(user);
      const response = await fetch("/api/sign-in", {
        method: "POST",
        body: JSON.stringify({
          username: user.displayName,
          email: user.email,
          image: user.photoURL,
        }),
      });
      const data = await response.json();
      if (data.success) {
        handleLoginSuccess(token);
      } else {
        setLoginFeedback({
          success: false,
          message: data.message?.trim() || "Log in rejected",
        });
        console.error(data.message);
      }
    } catch (error) {
      setLoginFeedback({
        success: false,
        message: "Log in rejected",
      });
      console.error(error);
    }
  };

  return (
    <main className="relative grid min-h-screen place-items-center px-4">
      <div className="pointer-events-none absolute inset-0 bg-spotlight" />
      <div className="relative w-full max-w-sm">
        <div className="mb-6 flex justify-center">
          <Logo />
        </div>
        <div className="glass rounded-xl p-6">
          <h1 className="text-xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Sign in to your CodePilot account.
          </p>

          {loginFeedback ? (
            <div
              role="alert"
              className={cn(
                "mt-4 rounded-lg border px-3 py-2.5 text-sm font-medium animate-fade-in",
                loginFeedback.success
                  ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-100"
                  : "border-red-500/45 bg-red-500/10 text-red-100",
              )}
            >
              {loginFeedback.message}
            </div>
          ) : null}

          <AuthForm mode="sign-in" onGithubSignIn={handleGithubSignIn} />

          <p className="mt-4 text-center text-xs text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/sign-up" className="text-foreground hover:underline">
              Sign up
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

export default SignInPage;
