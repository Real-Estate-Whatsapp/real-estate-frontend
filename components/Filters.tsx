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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
      <input
        value={draft.locality}
        onChange={(e) => setField("locality", e.target.value)}
        placeholder="Locality"
        className="border p-2 rounded-lg"
      />

      <select
        value={draft.bedrooms}
        onChange={(e) => setField("bedrooms", e.target.value)}
        className="border p-2 rounded-lg"
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
        className="border p-2 rounded-lg"
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
        className="border p-2 rounded-lg"
      >
        <option value="">All Segment</option>
        <option value="residential">Residential</option>
        <option value="commercial">Commercial</option>
      </select>

      <select
        value={draft.minPrice}
        onChange={(e) => setField("minPrice", e.target.value)}
        className="border p-2 rounded-lg"
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
        className="border p-2 rounded-lg"
      >
        {priceOptions.map((option) => (
          <option key={`max-${option.label}`} value={option.value}>
            {option.value ? `Max ${option.label}` : "No Max Price"}
          </option>
        ))}
      </select>

      <button
        onClick={handleApply}
        className="rounded-lg bg-black px-4 py-2 text-sm text-white hover:bg-gray-900"
      >
        Apply
      </button>

      <button
        onClick={handleClear}
        className="border border-gray-300 rounded-lg px-4 py-2 text-sm hover:bg-gray-100 transition"
      >
        Clear
      </button>
    </div>
  );
}
