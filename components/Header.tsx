"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
function snapUser(): string | null {
  try { return localStorage.getItem("user"); } catch { return null; }
}
const ssrUser = (): null => null;

export default function Header() {
  const router = useRouter();
  const userRaw = useSyncExternalStore(subscribeStorage, snapUser, ssrUser);
  const [showConfirm, setShowConfirm] = useState(false);

  const userName = (() => {
    try { return userRaw ? (JSON.parse(userRaw) as { name?: string }).name ?? null : null; } catch { return null; }
  })();

  const confirmLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("prop_favorites");
      window.dispatchEvent(new Event("storage"));
    } catch {}
    router.replace("/login");
  };

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4">
          <Image
            src="/proply-logo.png"
            alt="Proply logo"
            width={160}
            height={54}
            preload
            unoptimized
            className="h-auto w-24 shrink-0 object-contain"
          />
          <div className="h-7 w-px shrink-0 bg-stone-200" />
          <p className="min-w-0 flex-1 text-[11px] leading-tight text-slate-500">
            WhatsApp messages, ab smart search mein.
          </p>
          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="inline-flex h-7 shrink-0 items-center gap-1 rounded-full border border-slate-200 bg-slate-50 px-2.5 text-xs font-medium text-slate-500 transition hover:border-red-200 hover:bg-red-50 hover:text-red-500 active:scale-95"
          >
            <svg className="h-3 w-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Logout
          </button>
        </div>
      </header>

      {/* Logout confirmation modal */}
      {showConfirm && (
        <div
          className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-4 pb-8 backdrop-blur-sm sm:items-center sm:pb-0"
          onClick={() => setShowConfirm(false)}
        >
          <div
            className="w-full max-w-sm overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Icon + text */}
            <div className="flex flex-col items-center px-6 pb-2 pt-7 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </div>
              <p className="text-base font-bold text-slate-800">Are you sure you want to logout?</p>
              <p className="mt-1 text-sm text-slate-500">
                {userName ? `${userName}, you will be signed out.` : "You will be signed out."}
              </p>
            </div>

            {/* Buttons */}
            <div className="grid grid-cols-2 gap-3 p-5 pt-4">
              <button
                type="button"
                onClick={() => setShowConfirm(false)}
                className="h-11 rounded-xl border border-stone-200 bg-stone-50 text-sm font-semibold text-slate-600 transition hover:bg-stone-100 active:scale-95"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmLogout}
                className="h-11 rounded-xl bg-red-500 text-sm font-semibold text-white transition hover:bg-red-600 active:scale-95"
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
