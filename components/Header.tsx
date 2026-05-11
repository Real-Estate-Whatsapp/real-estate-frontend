"use client";

import Image from "next/image";

type HeaderProps = {
  activeFilterCount: number;
  onOpenSearch: () => void;
};

export default function Header({ activeFilterCount, onOpenSearch }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-stone-200/80 bg-white/90 shadow-sm backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 sm:h-20 sm:px-6 lg:px-8">
        <div className="flex min-w-0 items-center gap-3 sm:gap-5">
          <Image
            src="/proply-logo.png"
            alt="Proply logo"
            width={160}
            height={54}
            preload
            unoptimized
            className="h-auto w-[112px] shrink-0 object-contain sm:w-[140px]"
          />
          <div className="hidden h-8 w-px bg-stone-300 sm:block" />
          <p className="hidden max-w-[280px] text-sm font-medium leading-5 text-slate-500 sm:block">
            WhatsApp messages, ab smart search mein.
          </p>
        </div>

        {/* <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onOpenSearch}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-stone-200 bg-[#14202d] px-4 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(20,32,45,0.18)] transition hover:-translate-y-0.5 hover:bg-[#1d2d40] focus:outline-none focus:ring-4 focus:ring-slate-900/10 active:translate-y-0 sm:h-12 sm:px-5"
            aria-label="Open search filters"
          >
            <span className="text-base leading-none" aria-hidden="true">
              Search
            </span>
            {activeFilterCount > 0 && (
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[11px] font-bold text-[#14202d]">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div> */}
      </div>
    </header>
  );
}
