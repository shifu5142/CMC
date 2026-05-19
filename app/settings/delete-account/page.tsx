"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2, ShieldAlert } from "lucide-react";
import NotFound from "@/app/not-found";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from "@/store/useUserStore";
import { cn } from "@/lib/utils";

function FieldLabel({
  htmlFor,
  children,
}: {
  htmlFor: string;
  children: React.ReactNode;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="text-[11px] font-medium uppercase tracking-widest text-muted-foreground/70"
    >
      {children}
    </label>
  );
}

function PageLoadingIndicator() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-3">
        <Loader2
          className="size-6 animate-spin text-muted-foreground"
          aria-label="Loading"
        />
        <span className="text-xs text-muted-foreground">Loading...</span>
      </div>
    </div>
  );
}

function DeletePage() {
  const router = useRouter();
  const resetUser = useUserStore((s) => s.reset);
  const [tokenChecked, setTokenChecked] = useState(false);
  const [hasToken, setHasToken] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmText, setConfirmText] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [confirmError, setConfirmError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    setHasToken(Boolean(token));
    setTokenChecked(true);
  }, []);

  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "") ?? "";

  const handleDelete = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    if (password !== confirmPassword) {
      setErrorMessage("Password and confirm password do not match.");
      return;
    }
    setConfirmError("");
    setIsConfirmOpen(true);
  };

  const handleFinalDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmError("");

    if (confirmText.trim().toLowerCase() !== "confirm") {
      setConfirmError('Type "confirm" to proceed.');
      return;
    }

    if (!baseUrl) {
      setConfirmError(
        "Backend URL missing: set NEXT_PUBLIC_BACKEND_URL in .env",
      );
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/settings/delete-account`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ name: username, password }),
      });

      let data: { success?: boolean; message?: string } = {};
      try {
        data = (await response.json()) as {
          success?: boolean;
          message?: string;
        };
      } catch {
        setConfirmError("Invalid response from server.");
        return;
      }

      if (response.ok && data.success === true) {
        localStorage.removeItem("token");
        resetUser();
        setIsConfirmOpen(false);
        setConfirmText("");
        setSuccessMessage(data.message ?? "Account deleted successfully");
        window.setTimeout(() => {
          router.push("/sign-in");
        }, 1500);
        return;
      }

      const msg =
        typeof data.message === "string"
          ? data.message
          : !response.ok
            ? `Request failed (${response.status})`
            : "Failed to delete account";
      setConfirmError(msg);
    } catch {
      setConfirmError(
        "Network error. Is the backend running and CORS enabled?",
      );
    }
  };

  if (!tokenChecked) {
    return <PageLoadingIndicator />;
  }

  if (!hasToken) {
    return <NotFound />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-4 sm:p-6">
      {/* Subtle gradient overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(220,38,38,0.08),transparent)]"
      />
      
      {/* Main container */}
      <div className="relative z-10 w-full max-w-[420px]">
        {/* Header section */}
        <div className="mb-8 text-center">
          <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
            <ShieldAlert className="size-8 text-destructive" aria-hidden />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Delete Account
          </h1>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            This action is permanent and cannot be undone.
          </p>
        </div>

        {/* Warning banner */}
        <div className="mb-6 flex items-start gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-amber-500" aria-hidden />
          <p className="text-sm leading-relaxed text-amber-200/80">
            All your data, settings, and account information will be permanently removed.
          </p>
        </div>

        {/* Form card */}
        <div className="rounded-2xl border border-border/50 bg-card/50 p-6 shadow-xl shadow-black/5 backdrop-blur-sm">
          <form onSubmit={handleDelete} className="space-y-5">
            <div className="space-y-2">
              <FieldLabel htmlFor="delete-username">Username</FieldLabel>
              <Input
                id="delete-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
                className="h-11 rounded-xl border-border/50 bg-background/50 px-4 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-destructive/50 focus:ring-destructive/20"
              />
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="delete-password">Password</FieldLabel>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
                className="h-11 rounded-xl border-border/50 bg-background/50 px-4 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-destructive/50 focus:ring-destructive/20"
              />
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="delete-confirm-password">
                Confirm Password
              </FieldLabel>
              <Input
                id="delete-confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm your password"
                required
                className="h-11 rounded-xl border-border/50 bg-background/50 px-4 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-destructive/50 focus:ring-destructive/20"
              />
            </div>

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                variant="destructive"
                className="h-11 w-full rounded-xl text-sm font-medium shadow-lg shadow-destructive/25 transition-all hover:shadow-destructive/40 active:scale-[0.98]"
              >
                <Trash2 className="mr-2 size-4" />
                Delete My Account
              </Button>
              
         
            </div>

            {successMessage && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-medium text-emerald-400"
              >
                <div className="size-1.5 rounded-full bg-emerald-400" />
                {successMessage}
              </div>
            )}
            
            {errorMessage && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive"
              >
                <div className="size-1.5 rounded-full bg-destructive" />
                {errorMessage}
              </div>
            )}
          </form>
        </div>
        <div className="mt-3 text-center">
                <Link
                  href="/dashboard"
                  className="text-sm font-medium text-muted-foreground  hover:text-primary transition-colors"
                >
                  <span className="flex items-center justify-center gap-2">
                    <ShieldAlert className="size-4" />
                    Back to dashboard
                  </span>
             
                </Link>
              </div>
        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-muted-foreground/60">
          Need help? Contact support before proceeding.
        </p>
      </div>

      {/* Confirmation Dialog */}
      <Dialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open);
          if (!open) setConfirmError("");
        }}
      >
        <DialogContent className="max-w-[340px] gap-0 overflow-hidden rounded-2xl border-border/50 p-0 shadow-2xl">
          <div className="border-b border-border/50 bg-destructive/5 px-6 py-5">
            <DialogHeader className="space-y-2">
              <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-xl bg-destructive/10 ring-1 ring-destructive/20">
                <AlertTriangle className="size-5 text-destructive" />
              </div>
              <DialogTitle className="text-center text-lg font-semibold">
                Final Confirmation
              </DialogTitle>
              <DialogDescription className="text-center text-sm leading-relaxed">
                Type <span className="font-mono font-semibold text-foreground">confirm</span> to permanently delete your account.
              </DialogDescription>
            </DialogHeader>
          </div>

          <form onSubmit={handleFinalDelete} className="space-y-4 p-6">
            <div className="space-y-2">
              <FieldLabel htmlFor="delete-final-confirm">
                Confirmation
              </FieldLabel>
              <Input
                id="delete-final-confirm"
                type="text"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder='Type "confirm"'
                autoFocus
                className="h-11 rounded-xl border-border/50 bg-background/50 px-4 text-sm transition-all placeholder:text-muted-foreground/50 focus:border-destructive/50 focus:ring-destructive/20"
              />
            </div>
            
            {confirmError && (
              <div
                role="alert"
                className="flex items-center gap-2 rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive"
              >
                <div className="size-1.5 rounded-full bg-destructive" />
                {confirmError}
              </div>
            )}
            
            <Button
              type="submit"
              variant="destructive"
              className="h-11 w-full rounded-xl text-sm font-medium shadow-lg shadow-destructive/25 transition-all hover:shadow-destructive/40 active:scale-[0.98]"
            >
              Confirm Deletion
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeletePage;

