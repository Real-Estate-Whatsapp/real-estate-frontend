"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000") + "/api";

type FormState = { password: string; confirmPassword: string };
type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.password) {
    errors.password = "Password is required";
  } else if (form.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }
  if (!form.confirmPassword) {
    errors.confirmPassword = "Please confirm your password";
  } else if (form.password && form.confirmPassword !== form.password) {
    errors.confirmPassword = "Passwords do not match";
  }
  return errors;
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [form, setForm] = useState<FormState>({ password: "", confirmPassword: "" });
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const setField = (key: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    if (fieldErrors[key]) setFieldErrors((fe) => ({ ...fe, [key]: undefined }));
    if (serverError) setServerError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError("");

    if (!token) {
      setServerError("This reset link is invalid. Please request a new one.");
      return;
    }

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: form.password }),
      });
      const data: { message?: string } = await res.json();

      if (res.ok) {
        setSuccess(true);
        setTimeout(() => router.push("/login"), 1500);
      } else {
        setServerError(data.message ?? "This reset link is invalid or has expired.");
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
          <h1 className="mt-1 text-2xl font-bold text-white">Reset password</h1>
          <p className="mt-1 text-sm text-[#A9B4C2]">Choose a new password for your account</p>
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
              <p className="text-base font-semibold text-white">Password reset!</p>
              <p className="mt-1 text-sm text-[#A9B4C2]">Redirecting to login…</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">

              {/* Server error banner */}
              {serverError && (
                <div className="rounded-xl border border-[#EF4444]/25 bg-[#EF4444]/10 px-3.5 py-3 text-sm font-medium text-[#EF4444]">
                  {serverError}
                </div>
              )}

              {/* New password */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#A9B4C2]">
                  New password
                </label>
                <input
                  type="password"
                  placeholder="Min. 6 characters"
                  autoComplete="new-password"
                  value={form.password}
                  onChange={setField("password")}
                  className={`w-full rounded-xl border bg-[#0D1B2D] px-3.5 py-2.5 text-sm text-white caret-[#3B82F6] placeholder:text-[#A9B4C2]/40 outline-none transition-all focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/15 ${
                    fieldErrors.password ? "border-[#EF4444]/50" : "border-[#22354F]"
                  }`}
                />
                {fieldErrors.password && (
                  <p className="mt-1 text-[11px] text-[#EF4444]">{fieldErrors.password}</p>
                )}
              </div>

              {/* Confirm password */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#A9B4C2]">
                  Confirm password
                </label>
                <input
                  type="password"
                  placeholder="Re-enter password"
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={setField("confirmPassword")}
                  className={`w-full rounded-xl border bg-[#0D1B2D] px-3.5 py-2.5 text-sm text-white caret-[#3B82F6] placeholder:text-[#A9B4C2]/40 outline-none transition-all focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/15 ${
                    fieldErrors.confirmPassword ? "border-[#EF4444]/50" : "border-[#22354F]"
                  }`}
                />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-[#EF4444]">{fieldErrors.confirmPassword}</p>
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
                  "Reset password"
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

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
