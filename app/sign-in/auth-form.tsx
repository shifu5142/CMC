"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface AuthFormProps {
  mode: "sign-in" | "sign-up";
  onGithubSignIn?: () => void | Promise<void>;
}

/**
 * Placeholder credentials form. No real auth — just a UX shell that lands the
 * user on the dashboard. Swap with Clerk's `<SignIn />` / `<SignUp />` once
 * keys are configured.
 */
export function AuthForm({ mode, onGithubSignIn }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loginFeedback, setLoginFeedback] = useState<
    null | { success: true } | { success: false; message: string }
  >(null);
  const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginFeedback(null);
    if (!email.includes("@") || password.length < 4) {
      toast.error("Please enter a valid email and password.");
      return;
    }
    setSubmitting(true);
    try {
      const result = await fetch(`${BASE_URL}/sign-in`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await result.json();
      if (data.success) {
        const token = data.data?.token ?? data.token;
        if (!token) {
          toast.error(data.message ?? "Sign in failed: no token returned");
          return;
        }
        localStorage.setItem("token", token);
        setLoginFeedback({ success: true });
        setTimeout(() => {
          router.push("/dashboard");
        }, 1500);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
      {loginFeedback ? (
        <div
          role="alert"
          className={cn(
            "rounded-lg border px-3 py-2.5 text-sm font-medium animate-fade-in",
            loginFeedback.success
              ? "border-emerald-500/45 bg-emerald-500/10 text-emerald-100"
              : "border-red-500/45 bg-red-500/10 text-red-100",
          )}
        >
          {loginFeedback.success
            ? "Successfully logged in"
            : loginFeedback.message}
        </div>
      ) : null}

      <Button
        type="button"
        variant="outline"
        className="w-full"
        onClick={() => {
          if (mode === "sign-in" && onGithubSignIn) {
            void onGithubSignIn();
            return;
          }
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

      {mode === "sign-up" ? (
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
      ) : null}

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
          autoComplete={
            mode === "sign-in" ? "current-password" : "new-password"
          }
          required
        />
      </label>

      <Button type="submit" className="w-full" disabled={submitting}>
        {submitting ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Working…
          </>
        ) : mode === "sign-in" ? (
          "Sign in"
        ) : (
          "Create account"
        )}
      </Button>
    </form>
  );
}
