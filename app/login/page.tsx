"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000") + "/api";

type FormState = { email: string; password: string };
type FieldErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Enter a valid email address";
  }
  if (!form.password) {
    errors.password = "Password is required";
  }
  return errors;
}

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState<FormState>({ email: "", password: "" });
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

    const errors = validate(form);
    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });
      const data = await res.json() as Record<string, unknown>;

      if (res.status === 200) {
        try {
          localStorage.setItem("user", JSON.stringify(data.user));
          const token = ([data.token, data.accessToken, data.access_token].find(v => typeof v === "string") ?? "") as string;
          if (token) localStorage.setItem("token", token);
        } catch {}
        setSuccess(true);
        setTimeout(() => router.push("/"), 1200);
      } else {
        setServerError((data.message as string | undefined) ?? "Login failed. Please try again.");
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
          <h1 className="mt-1 text-2xl font-bold text-white">Welcome back</h1>
          <p className="mt-1 text-sm text-[#A9B4C2]">Sign in to your account</p>
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
              <p className="text-base font-semibold text-white">Login successful!</p>
              <p className="mt-1 text-sm text-[#A9B4C2]">Redirecting…</p>
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
                  value={form.email}
                  onChange={setField("email")}
                  className={`w-full rounded-xl border bg-[#0D1B2D] px-3.5 py-2.5 text-sm text-white caret-[#3B82F6] placeholder:text-[#A9B4C2]/40 outline-none transition-all focus:border-[#3B82F6]/60 focus:ring-2 focus:ring-[#3B82F6]/15 ${
                    fieldErrors.email ? "border-[#EF4444]/50" : "border-[#22354F]"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-[11px] text-[#EF4444]">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="mb-1.5 block text-[11px] font-semibold uppercase tracking-widest text-[#A9B4C2]">
                  Password
                </label>
                <input
                  type="password"
                  placeholder="Your password"
                  autoComplete="current-password"
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
                  "Sign In"
                )}
              </button>
            </form>
          )}
        </div>

        {/* Footer link */}
        <p className="mt-5 text-center text-sm text-[#A9B4C2]">
          Don&apos;t have an account?{" "}
          <Link href="/register" className="font-semibold text-[#3B82F6] hover:underline">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
