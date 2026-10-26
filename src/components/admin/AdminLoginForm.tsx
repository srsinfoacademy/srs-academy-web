"use client";

import { useRef, useState } from "react";

import { Alert, Button, Field, inputClass } from "@/components/admin/ui";
import { ADMIN_PASSWORD_MIN } from "@/lib/data/schemas";
import { cn } from "@/lib/cn";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function AdminLoginForm({ next }: { next: string }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [failed, setFailed] = useState("");
  const [busy, setBusy] = useState(false);
  const [forgot, setForgot] = useState(false);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const nextErrors: typeof errors = {};
    if (!email.trim()) nextErrors.email = "Enter your email address.";
    else if (!EMAIL_RE.test(email.trim())) nextErrors.email = "Enter a valid email address.";
    if (!password) nextErrors.password = "Enter your password.";
    else if (password.length < ADMIN_PASSWORD_MIN) nextErrors.password = `The password has at least ${ADMIN_PASSWORD_MIN} characters.`;
    setErrors(nextErrors);
    setFailed("");
    if (nextErrors.email) return emailRef.current?.focus();
    if (nextErrors.password) return passwordRef.current?.focus();

    setBusy(true);
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
        credentials: "same-origin",
      });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string; retryAfter?: number; message?: string };
      if (res.ok && data.ok) {
        window.location.assign(next);
        return;
      }
      if (data.error === "rate_limited") {
        const minutes = Math.max(1, Math.ceil((data.retryAfter ?? 900) / 60));
        setFailed(data.message ?? `Too many failed sign-in attempts. Try again in about ${minutes} minute${minutes === 1 ? "" : "s"}.`);
        setPassword("");
      } else if (data.error === "not_configured") {
        setFailed("Admin sign-in isn't configured on this deployment yet (ADMIN_EMAIL, ADMIN_PASSWORD, AUTH_SECRET).");
      } else if (data.error === "invalid") {
        setFailed("That email and password don't match. Check them and try again.");
        setPassword("");
        passwordRef.current?.focus();
      } else {
        setFailed("Sign-in failed. Try again in a moment.");
      }
    } catch {
      setFailed("Network error. Check your connection and try again.");
    }
    setBusy(false);
  }

  return (
    <>
      {failed ? <Alert>{failed}</Alert> : null}
      <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
        <Field label="Email" htmlFor="ad-email" error={errors.email}>
          <input
            ref={emailRef}
            id="ad-email"
            type="email"
            autoComplete="username"
            inputMode="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby="ad-email-error"
            className={cn(inputClass, "h-[52px] text-[16px]")}
          />
        </Field>
        <Field
          label="Password"
          htmlFor="ad-password"
          error={errors.password}
          aside={
            <button
              type="button"
              onClick={() => setForgot((v) => !v)}
              aria-expanded={forgot}
              className="text-[14px] font-semibold text-rd-link hover:text-rd-accent"
            >
              Forgot password?
            </button>
          }
        >
          <div className="relative">
            <input
              ref={passwordRef}
              id="ad-password"
              type={show ? "text" : "password"}
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby="ad-password-error"
              className={cn(inputClass, "h-[52px] pr-[84px] text-[16px]")}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              aria-label={show ? "Hide password" : "Show password"}
              aria-pressed={show}
              className="absolute top-1.5 right-1.5 h-10 rounded-lg bg-ad-line-soft px-3 text-[14px] font-semibold text-rd-ink hover:bg-ad-line focus-visible:outline focus-visible:outline-3 focus-visible:outline-rd-focus"
            >
              {show ? "Hide" : "Show"}
            </button>
          </div>
        </Field>
        {forgot ? (
          <div role="status" className="rounded-[10px] border border-ad-line bg-ad-panel px-3.5 py-3 text-[14px] leading-[1.5]">
            The admin password is set by the academy&rsquo;s system administrator in the deployment settings
            (ADMIN_PASSWORD). Ask them to reset it.
          </div>
        ) : null}
        <Button type="submit" variant="primary" disabled={busy} className="min-h-[54px] text-[16.5px]">
          {busy ? "Signing in…" : "Sign in"}
        </Button>
      </form>
    </>
  );
}
