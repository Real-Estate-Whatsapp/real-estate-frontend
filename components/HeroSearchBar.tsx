"use client";
import Image from "next/image";

type SearchQueries = {
  locality: string;
  society: string;
  phone: string;
};

type HeroSearchBarProps = {
  queries: SearchQueries;
  onChange: (queries: SearchQueries) => void;
  onClick?: () => void;
};

export default function HeroSearchBar({ queries, onChange, onClick }: HeroSearchBarProps) {
  return (
    <div className="relative w-full">
      <div className="flex h-14 items-center gap-2 rounded-full border border-slate-200 bg-white px-3 shadow-[0_10px_28px_rgba(15,23,42,0.12)] ring-1 ring-black/5 transition focus-within:border-slate-300 focus-within:ring-2 focus-within:ring-slate-900/10 sm:h-16 sm:px-4">
        <button
          type="button"
          aria-label="Add search"
          onClick={onClick}
          className="grid size-9 shrink-0 place-items-center rounded-full text-3xl font-light leading-none text-slate-800 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-900/10"
        >
          <Image
            src="/icon.png"
            alt="Proply logo"
            width={160}
            height={54}
            preload
            unoptimized
          />
        </button>

        <span className="h-8 w-px shrink-0 bg-slate-300" aria-hidden="true" />

        <input
        onClick={onClick}
     
          className="min-w-0 flex-1 bg-transparent px-1 text-[15px] font-medium text-slate-900 outline-none placeholder:text-slate-500 sm:text-base"
          placeholder="Search | rent | resale | sale | commercial"
          value={queries.locality}
          onChange={(e) => onChange({ ...queries, locality: e.target.value })}
          autoComplete="off"
        />

      
      </div>
    </div>
  );
}
