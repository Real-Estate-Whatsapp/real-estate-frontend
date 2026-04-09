"use client";

import { useState, useRef, useEffect } from "react";

export default function SearchBar({ onSearch, data }: any) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [show, setShow] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // 🔥 Handle search
  const handleChange = (value: string) => {
    setQuery(value);
    onSearch(value);

    if (!value) {
      setSuggestions([]);
      return;
    }

    const sug = data
      .filter((item: any) =>
        item?.address?.locality?.toLowerCase().includes(value.toLowerCase()) ||
        item?.type?.toLowerCase().includes(value.toLowerCase()) ||
        item?.segment?.toLowerCase().includes(value.toLowerCase())
      )
      .map((item: any) => item.address?.locality || item.type)
      .filter(Boolean)
      .slice(0, 6);

    setSuggestions([...new Set(sug as string[])]);
    setShow(true);
  };

  // 🔥 Click outside close
  useEffect(() => {
    const handleClickOutside = (event: any) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative mb-5">

      {/* 🔍 Input */}
      <div className="relative">
        <input
          className="w-full rounded-2xl border border-stone-300/80 bg-white px-5 py-4 pl-13 text-[15px] text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition placeholder:text-stone-400 focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10"
          placeholder="Search locality"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShow(true)}
        />

        {/* Icon */}
        <span className="absolute left-5 top-1/2 -translate-y-1/2 text-base text-stone-400">⌕</span>
      </div>

      {/* 💡 Suggestions */}
      {show && suggestions.length > 0 && (
        <div className="absolute z-10 mt-3 max-h-72 w-full overflow-y-auto rounded-2xl border border-stone-200 bg-white/95 p-2 shadow-[0_20px_40px_rgba(15,23,42,0.12)] backdrop-blur">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="flex cursor-pointer items-center gap-3 rounded-xl px-4 py-3 text-sm text-slate-700 transition hover:bg-stone-100"
              onClick={() => {
                setQuery(s);
                onSearch(s);
                setShow(false);
              }}
            >
              <span className="text-stone-400">⌕</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
