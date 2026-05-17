"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Github, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

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

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.includes("@") || password.length < 4) {
      toast.error("Please enter a valid email and password.");
      return;
    }
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 500));
    toast.success(
      mode === "sign-in" ? "Signed in (mock)" : "Account created (mock)",
    );
    router.push("/dashboard");
  };

  return (
    <form onSubmit={submit} className="mt-5 space-y-3">
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
