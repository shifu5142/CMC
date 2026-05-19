"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Github, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { auth, githubProvider } from "@/app/services/auth/firebaseConfig";
type RegisterFeedback =
  | null
  | { success: true; message: string }
  | { success: false; message: string };
function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [registerFeedback, setRegisterFeedback] =
    useState<RegisterFeedback>(null);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterFeedback(null);
    if (!email.includes("@") || password.length < 4) {
      toast.error("Please enter a valid email and password.");
      return;
    }
    setSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 500));
      const response = await fetch(`${backendUrl}/sign-up`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name }),
      });
      const data = (await response.json().catch(() => ({}))) as {
        success?: boolean;
        token?: string;
        message?: string;
      };
      console.log(data);
      if (data.success === true) {
        setRegisterFeedback({
          success: true,
          message: "Registered successfully.",
        });
        setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
      }
         else {
        setRegisterFeedback({
          success: false,
          message: data.message?.trim() || "registration failed",
        });
      }
    } catch {
      setRegisterFeedback({
        success: false,
        message: "Rejected",
      });
    } finally {
      setSubmitting(false);
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
            Create your account
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Start reviewing code with CMC.
          </p>

          {registerFeedback ? (
            <div
              role="alert"
              className={cn(
                "mt-4 rounded-lg border px-3 py-2.5 text-sm font-medium animate-fade-in",
                registerFeedback.success
                  ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-100"
                  : "border-red-500/45 bg-red-500/10 text-red-100",
              )}
            >
              {registerFeedback.message}
            </div>
          ) : null}

          <form onSubmit={submit} className="mt-5 space-y-3">
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => {
                toast.info("OAuth is mocked — landing on dashboard.");
                router.push("/dashboard");
              }}
            >
              <Github className="size-4" />
              Continue with GitHub
            </Button>

            <div className="relative my-2">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
                or
              </span>
            </div>

            <label className="block space-y-1.5 text-sm">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Full name
              </span>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Rivera"
                autoComplete="name"
              />
            </label>

            <label className="block space-y-1.5 text-sm">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Email
              </span>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
                required
              />
            </label>

            <label className="block space-y-1.5 text-sm">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Password
              </span>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
                required
              />
            </label>

            <Button type="submit" className="w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Working…
                </>
              ) : (
                "Create account"
              )}
            </Button>
          </form>

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
