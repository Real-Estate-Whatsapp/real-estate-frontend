"use client";

import { useState } from "react";
import { useEffect } from "react";

type FilterState = {
  type: string;
  segment: string;
  locality: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
};

type FiltersProps = {
  filters: FilterState;
  applyFilters: (next: FilterState) => void;
  clearFilters: () => void;
};

const priceOptions = [
  { label: "No Limit", value: "" },
  { label: "10 Lakh", value: "1000000" },
  { label: "25 Lakh", value: "2500000" },
  { label: "50 Lakh", value: "5000000" },
  { label: "1 Cr", value: "10000000" },
  { label: "2 Cr", value: "20000000" },
  { label: "3 Cr", value: "30000000" },
];

export default function Filters({ filters, applyFilters, clearFilters }: FiltersProps) {
  const [draft, setDraft] = useState<FilterState>(filters);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  const setField = (key: keyof FilterState, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleApply = () => {
    applyFilters(draft);
  };

  const handleClear = () => {
    const resetState: FilterState = {
      type: "",
      segment: "",
      locality: "",
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
    };
    setDraft(resetState);
    clearFilters();
  };

  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      <input
        value={draft.locality}
        onChange={(e) => setField("locality", e.target.value)}
        placeholder="Area"
        className="rounded-2xl border border-stone-300/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-stone-400 focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10"
      />

      <select
        value={draft.bedrooms}
        onChange={(e) => setField("bedrooms", e.target.value)}
        className="rounded-2xl border border-stone-300/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10"
      >
        <option value="">Any BHK</option>
        <option value="1">1 BHK</option>
        <option value="2">2 BHK</option>
        <option value="3">3 BHK</option>
        <option value="4">4 BHK</option>
        <option value="5+">5+ BHK</option>
      </select>

      <select
        value={draft.type}
        onChange={(e) => setField("type", e.target.value)}
        className="rounded-2xl border border-stone-300/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10"
      >
        <option value="">All Type</option>
        <option value="apartment">Apartment</option>
        <option value="office">Office</option>
        <option value="villa">Villa</option>
        <option value="plot">Plot</option>
        <option value="shop">Shop</option>
      </select>

      <select
        value={draft.segment}
        onChange={(e) => setField("segment", e.target.value)}
        className="rounded-2xl border border-stone-300/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10"
      >
        <option value="">All Segment</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>

      <select
        value={draft.minPrice}
        onChange={(e) => setField("minPrice", e.target.value)}
        className="rounded-2xl border border-stone-300/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10"
      >
        {priceOptions.map((option) => (
          <option key={`min-${option.label}`} value={option.value}>
            {option.value ? `Min ${option.label}` : "No Min Price"}
          </option>
        ))}
      </select>

      <select
        value={draft.maxPrice}
        onChange={(e) => setField("maxPrice", e.target.value)}
        className="rounded-2xl border border-stone-300/80 bg-white px-4 py-3 text-sm text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.04)] outline-none transition focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10"
      >
        {priceOptions.map((option) => (
          <option key={`max-${option.label}`} value={option.value}>
            {option.value ? `Max ${option.label}` : "No Max Price"}
          </option>
        ))}
      </select>

      <button
        onClick={handleApply}
        className="rounded-2xl bg-[#14202d] px-5 py-3 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(20,32,45,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1b3045]"
      >
        Apply
      </button>

      <button
        onClick={handleClear}
        className="rounded-2xl border border-stone-300 bg-stone-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-stone-100"
      >
        Clear
      </button>
    </div>
  );
}
