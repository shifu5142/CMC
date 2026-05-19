"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Loader2, Trash2 } from "lucide-react";
import NotFound from "@/app/not-found";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
      className="text-xs font-medium uppercase tracking-wider text-muted-foreground"
    >
      {children}
    </label>
  );
}

function PageLoadingIndicator() {
  return (
    <Loader2
      className="size-8 animate-spin text-muted-foreground"
      aria-label="Loading"
    />
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
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center">
        <PageLoadingIndicator />
      </div>
    );
  }

  if (!hasToken) {
    return <NotFound />;
  }

  return (
    <div className="relative flex min-h-[calc(100vh-3.5rem)] items-center justify-center overflow-hidden p-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_50%_-20%,color-mix(in_oklch,var(--destructive),transparent_88%),transparent)]"
      />
      <Card className="relative w-full max-w-md border-destructive/30 shadow-lg ring-1 ring-destructive/10 transition-shadow duration-300 hover:shadow-xl">
        <CardHeader className="space-y-2">
          <div className="flex items-center gap-2 text-destructive">
            <span className="flex size-10 items-center justify-center rounded-lg bg-destructive/10 shadow-inner ring-1 ring-destructive/20 transition-transform duration-200 hover:scale-105">
              <Trash2 className="size-5" aria-hidden />
            </span>
            <CardTitle className="text-xl">Delete User</CardTitle>
          </div>
          <CardDescription className="flex items-start gap-2 text-muted-foreground">
            <AlertTriangle
              className="mt-0.5 size-4 shrink-0 text-warning"
              aria-hidden
            />
            This action is permanent. Enter your credentials to confirm
            deletion.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleDelete} className="space-y-4">
            <div className="space-y-2">
              <FieldLabel htmlFor="delete-username">Username</FieldLabel>
              <Input
                id="delete-username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter username"
                required
                className="transition-shadow duration-200 focus-visible:shadow-sm"
              />
            </div>

            <div className="space-y-2">
              <FieldLabel htmlFor="delete-password">Password</FieldLabel>
              <Input
                id="delete-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                required
                className="transition-shadow duration-200 focus-visible:shadow-sm"
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
                placeholder="Confirm password"
                required
                className="transition-shadow duration-200 focus-visible:shadow-sm"
              />
            </div>

            <Button
              type="submit"
              variant="destructive"
              className="w-full shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
            >
              Delete User
            </Button>
            {successMessage ? (
              <div
                role="alert"
                className={cn(
                  "rounded-lg border border-emerald-500/45 bg-emerald-500/10 px-3 py-2 text-sm font-medium text-emerald-100 animate-fade-in",
                )}
              >
                {successMessage}
              </div>
            ) : null}
            {errorMessage ? (
              <p className="text-sm text-destructive">{errorMessage}</p>
            ) : null}
          </form>
        </CardContent>
      </Card>

      <Dialog
        open={isConfirmOpen}
        onOpenChange={(open) => {
          setIsConfirmOpen(open);
          if (!open) setConfirmError("");
        }}
      >
        <DialogContent className="max-w-[280px] animate-in fade-in-0 zoom-in-95 p-4 shadow-xl duration-200">
          <DialogHeader>
            <DialogTitle>Final confirmation</DialogTitle>
            <DialogDescription>
              To confirm account deletion, enter <strong>confirm</strong>.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleFinalDelete} className="space-y-4">
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
                className="transition-shadow duration-200 focus-visible:shadow-sm"
              />
            </div>
            {confirmError ? (
              <p className="text-sm text-destructive">{confirmError}</p>
            ) : null}
            <Button
              type="submit"
              variant="destructive"
              className="w-full transition-all duration-200 active:scale-[0.98]"
            >
              Confirm Delete
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default DeletePage;
