"use client";

import { useRef, useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CodeInput } from "@/components/dashboard/code-input";

/** Sign in with a code sent by email. A new address gets an account on first sign-in. */
export function SignInForm({ github = false }: { github?: boolean }) {
  const [step, setStep] = useState<"email" | "code">("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function sendCode() {
    setBusy(true);
    setError(null);
    // A new code is on its way: digits typed for the old one must not count towards it.
    setCode("");
    try {
      const { error: failure } = await authClient.emailOtp.sendVerificationOtp({ email, type: "sign-in" });
      if (failure) throw new Error(failure.message || "Could not send the code.");
      setStep("code");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "Could not send the code. Please try again.");
    } finally {
      setBusy(false);
    }
  }

  // A ref, because a phone keyboard filling the code in can fire twice before the first render.
  const verifying = useRef(false);

  async function verify(otp = code) {
    if (verifying.current) return;
    verifying.current = true;
    setBusy(true);
    setError(null);
    try {
      const { error: failure } = await authClient.signIn.emailOtp({ email, otp });
      if (failure) throw new Error(failure.message || "That code is not right.");
      // A full page load, so the dashboard is fetched with the new session cookie.
      window.location.assign("/dashboard");
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : "That code is not right. Please try again.");
      setCode("");
      setBusy(false);
      verifying.current = false;
    }
  }

  return (
    <div className="flex flex-col gap-5">
      {step === "email" ? (
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void sendCode();
          }}
        >
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            placeholder="you@example.com"
            required
            autoFocus
            value={email}
            // Locked while sending, so the code goes to the address shown on the next step.
            readOnly={busy}
            onChange={(event) => setEmail(event.target.value)}
          />
          <Button type="submit" variant="primary" block disabled={busy || !email}>
            {busy ? "Sending…" : "Email me a sign-in code"}
          </Button>
        </form>
      ) : (
        <form
          className="flex flex-col gap-3"
          onSubmit={(event) => {
            event.preventDefault();
            void verify();
          }}
        >
          <p className="text-sm text-ink-200">
            We sent a code to <span className="text-ink-100">{email}</span>. It expires in 10 minutes.
          </p>
          <Label htmlFor="code">6-digit code</Label>
          <CodeInput
            id="code"
            value={code}
            onChange={(next) => {
              setCode(next);
              setError(null);
            }}
            onComplete={(next) => void verify(next)}
            disabled={busy}
            invalid={Boolean(error)}
            errorId="sign-in-error"
          />
          <Button type="submit" variant="primary" block disabled={busy || code.length < 6}>
            {busy ? "Checking…" : "Sign in"}
          </Button>
          <Button type="button" variant="ghost" block disabled={busy} onClick={() => void sendCode()}>
            Send a new code
          </Button>
          <Button
            type="button"
            variant="ghost"
            block
            disabled={busy}
            onClick={() => {
              setStep("email");
              setCode("");
              setError(null);
            }}
          >
            Use a different email
          </Button>
        </form>
      )}

      {github ? (
        <>
          <div className="flex items-center gap-3 text-xs text-ink-300">
            <span className="h-px flex-1 bg-line-100" />
            or
            <span className="h-px flex-1 bg-line-100" />
          </div>
          <Button
            type="button"
            block
            disabled={busy}
            onClick={() => void authClient.signIn.social({ provider: "github", callbackURL: "/dashboard" })}
          >
            Continue with GitHub
          </Button>
        </>
      ) : null}

      {error ? (
        <p id="sign-in-error" role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}
