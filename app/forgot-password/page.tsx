"use client";

import { useState } from "react";
import Link from "next/link";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000") + "/api";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!email.trim()) {
      setFieldError("Email is required");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFieldError("Enter a valid email address");
      return;
    }
    setFieldError("");

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      // Always show the generic success state — the backend never reveals
      // whether the email exists, so the UI shouldn't either.
      if (res.ok) {
        setSuccess(true);
      } else if (res.status === 429) {
        setServerError("Too many attempts. Please try again in a minute.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } catch {
      setServerError("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#07111F] px-4 py-12">
      <div className="w-full max-w-sm">

        {/* Brand */}
        <div className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-[#3B82F6]">PropTally</p>
          <h1 className="mt-1 text-2xl font-bold text-white">Forgot password</h1>
          <p className="mt-1 text-sm text-[#A9B4C2]">We&apos;ll email you a reset link</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-[#22354F] bg-[#132238] p-6 shadow-[0_4px_32px_rgba(0,7,20,0.5)]">

          {success ? (
            /* Success state */
            <div className="py-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#3B82F6]/15">
                <svg className="h-6 w-6 text-[#3B82F6]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-base font-semibold text-white">Check your inbox</p>
              <p className="mt-1 text-sm text-[#A9B4C2]">
                If an account with that email exists, a password reset link has been sent.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Server error banner */}
              {serverError && (
                <div className="rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/10 px-3.5 py-3 text-sm font-medium text-[#EF4444]">
                  {serverError}
                </div>
              )}

              {/* Email */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#A9B4C2]">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="you@example.com"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldError) setFieldError("");
                    if (serverError) setServerError("");
                  }}
                  className={`w-full rounded-xl border bg-[#0D1B2D] px-3.5 py-2.5 text-sm text-white caret-[#3B82F6] placeholder:text-[#A9B4C2]/40 outline-none transition-all focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/15 ${
                    fieldError ? "border-[#EF4444]/50" : "border-[#22354F]"
                  }`}
                />
                {fieldError && (
                  <p className="mt-1 text-[11px] text-[#EF4444]">{fieldError}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="mt-1 flex h-10 w-full items-center justify-center rounded-xl bg-[#3B82F6] text-sm font-semibold text-white transition-all hover:bg-[#2563EB] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                ) : (
                  "Send reset link"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer link */}
        <p className="mt-5 text-center text-sm text-[#A9B4C2]">
          Remembered your password?{" "}
          <Link href="/login" className="font-semibold text-[#3B82F6] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
