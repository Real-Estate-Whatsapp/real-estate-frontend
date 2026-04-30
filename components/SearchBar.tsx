"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { PropertyItem } from "../lib/types";

type SearchQueries = {
  locality: string;
  society: string;
  phone: string;
};

type SearchBarProps = {
  queries: SearchQueries;
  onChange: (queries: SearchQueries) => void;
  data: PropertyItem[];
};

export default function SearchBar({ queries, onChange, data }: SearchBarProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState<"locality" | "society" | false>(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleFieldChange = useCallback(
    (field: "locality" | "society" | "phone", value: string) => {
      const nextQueries = { ...queries, [field]: value };
      onChange(nextQueries);

      // ✅ PHONE SEARCH
      if (field === "phone") {
        setSuggestions([]);
        setShow(false);
        return;
      }

      // ✅ LOCALITY 
      if (field === "locality" || field === "society") {
        if (!value) {
          setSuggestions([]);
          return;
        }

        const sug = data
          .filter((item) =>
            item?.address?.locality?.toLowerCase().includes(value.toLowerCase()) ||
            item?.address?.society?.toLowerCase().includes(value.toLowerCase()) ||
            item?.type?.toLowerCase().includes(value.toLowerCase()) ||
            item?.segment?.toLowerCase().includes(value.toLowerCase())
          )
          .map((item) =>
            field === "society"
              ? item.address?.society
              : item.address?.locality || item.type
          )
          .filter(Boolean)
          .slice(0, 6);

        setSuggestions([...new Set(sug as string[])]);
        setShow(field);
      }
    },
    [data, onChange, queries]
  );

  // ✅ Click outside close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node | null)
      ) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const inputClass =
    "h-[52px] w-full rounded-[18px] border border-stone-300/80 bg-white px-4 pl-11 text-[15px] text-slate-900 shadow-[0_10px_26px_rgba(15,23,42,0.06)] outline-none transition placeholder:text-stone-400 focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10";

  return (
    <div ref={wrapperRef} className="relative">
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {/* Locality */}
        <div className="relative">
          <input
            className={inputClass}
            placeholder="Search locality"
            value={queries.locality}
            onChange={(e) => handleFieldChange("locality", e.target.value)}
            onFocus={() => setShow("locality")}
            autoComplete="off"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            ⌕
          </span>
        </div>

        {/* Society */}
        <div className="relative">
          <input
            className={inputClass}
            placeholder="Search society"
            value={queries.society}
            onChange={(e) => handleFieldChange("society", e.target.value)}
            onFocus={() => setShow("society")}
            autoComplete="off"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            B
          </span>
        </div>

        {/* Phone */}
        <div className="relative">
          <input
            className={inputClass}
            placeholder="Search phone number"
            value={queries.phone}
            inputMode="tel"
            onChange={(e) => handleFieldChange("phone", e.target.value)}
            autoComplete="tel"
          />
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400">
            #
          </span>
        </div>
      </div>

      {/* Suggestions */}
      {show && suggestions.length > 0 && (
        <div className="absolute z-20 mt-3 max-h-72 w-full overflow-y-auto rounded-[22px] border border-stone-200 bg-white/95 p-2 shadow-[0_20px_40px_rgba(15,23,42,0.12)] backdrop-blur md:max-w-sm">
          {suggestions.map((s, i) => (
            <button
              type="button"
              key={i}
              className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm text-slate-700 transition hover:bg-stone-100 focus:bg-stone-100"
              onClick={() => {
                handleFieldChange(show, s); // ✅ fixed type
                setShow(false);
              }}
            >
              <span className="text-stone-400">⌕</span>
              <span>{s}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}