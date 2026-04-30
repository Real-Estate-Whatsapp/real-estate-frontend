"use client";

import { useState, useRef, useEffect } from "react";
import type { PropertyItem } from "./lib/types";

type SearchBarProps = {
  onSearch: (value: string) => void;
  data: PropertyItem[];
};

export default function SearchBar({ onSearch, data }: SearchBarProps) {
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
      .filter((item) =>
        item?.address?.locality?.toLowerCase().includes(value.toLowerCase()) ||
        item?.type?.toLowerCase().includes(value.toLowerCase()) ||
        item?.segment?.toLowerCase().includes(value.toLowerCase())
      )
      .map((item) => item.address?.locality || item.type)
      .filter(Boolean)
      .slice(0, 6);

    setSuggestions([...new Set(sug as string[])]);
    setShow(true);
  };

  // 🔥 Click outside close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node | null)) {
        setShow(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative mb-4">

      {/* 🔍 Input */}
      <div className="relative">
        <input
          className="w-full p-3 pl-10 border rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="🔍 Search locality, type, segment..."
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => setShow(true)}
        />

        {/* Icon */}
        <span className="absolute left-3 top-3 text-gray-400">🔍</span>
      </div>

      {/* 💡 Suggestions */}
      {show && suggestions.length > 0 && (
        <div className="absolute z-10 bg-white border w-full mt-2 rounded-xl shadow-lg max-h-60 overflow-y-auto">
          {suggestions.map((s, i) => (
            <div
              key={i}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
              onClick={() => {
                setQuery(s);
                onSearch(s);
                setShow(false);
              }}
            >
              <span className="text-gray-400">📍</span>
              <span>{s}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
