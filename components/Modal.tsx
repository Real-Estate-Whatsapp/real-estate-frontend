"use client";

import { useEffect, useId } from "react";

type ModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: "sm" | "search";
};

export default function Modal({ isOpen, onClose, title, children, size = "sm" }: ModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const panelSize = size === "search" ? "max-w-4xl sm:p-6" : "max-w-sm sm:p-8";

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center p-0 sm:items-center sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? titleId : undefined}
    >
      <div
        className="absolute inset-0 bg-slate-900/45 backdrop-blur-sm transition-opacity duration-200"
        onClick={onClose}
      />

      <div
        className={`relative max-h-[92dvh] w-full overflow-y-auto rounded-t-[28px] border border-white/80 bg-white p-5 shadow-2xl transition-all duration-200 sm:max-h-[88vh] sm:rounded-[28px] ${panelSize}`}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-stone-100 text-xl leading-none text-slate-500 transition hover:bg-stone-200 hover:text-slate-700 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
        >
          <span className="sr-only">Close</span>
          ×
        </button>

        {title && (
          <h3 id={titleId} className="mb-5 pr-12 text-xl font-bold tracking-tight text-slate-900 sm:text-2xl">
            {title}
          </h3>
        )}

        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}
