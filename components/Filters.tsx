"use client";

import { useCallback, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import type { PropertyItem } from "../lib/types";


type SearchQueries = {
  locality: string;
  society: string;
  phone: string;
};

type FilterState = {
  type: string;
  segment: string;
  locality: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
  plotArea: string;
  transactionType: string;
};

type FiltersProps = {
  filters: FilterState;
  searchQueries: SearchQueries;
  data: PropertyItem[];
  applyFilters: (nextFilters: FilterState, nextSearchQueries: SearchQueries) => void;
  clearFilters: () => void;
};



const plotAreaOptions = [
  { label: "Any Plot Area", value: "" },
  { label: "0 - 200", value: "0-200" },
  { label: "200 - 300", value: "200-300" },
  { label: "300 - 500", value: "300-500" },
  { label: "500 - 600", value: "500-600" },
  { label: "600+", value: "600+" },
];

export default function Filters({ filters, searchQueries, data, applyFilters, clearFilters }: FiltersProps) {
  const [draft, setDraft] = useState<FilterState>(filters);
  const [draftSearchQueries, setDraftSearchQueries] = useState<SearchQueries>(searchQueries);

  useEffect(() => {
    setDraft(filters);
  }, [filters]);

  useEffect(() => {
    setDraftSearchQueries(searchQueries);
  }, [searchQueries]);

  const setField = useCallback((key: keyof FilterState, value: string) => {
    setDraft((prev) => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const handleApply = () => {
    applyFilters(draft, draftSearchQueries);
  };

  const handleClear = () => {
    const resetState: FilterState = {
      type: "",
      segment: "",
      locality: "",
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
      plotArea: "",
      transactionType: "",
    };
    const resetSearchQueries: SearchQueries = {
      locality: "",
      society: "",
      phone: "",
    };
    setDraft(resetState);
    setDraftSearchQueries(resetSearchQueries);
    clearFilters();
  };

  const selectClass =
    "h-[52px] w-full rounded-[18px] border border-stone-300/80 bg-white px-4 text-[15px] text-slate-900 shadow-[0_10px_24px_rgba(15,23,42,0.04)] outline-none transition placeholder:text-stone-400 focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10";
  return (
    <div className="flex flex-col gap-5">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className="grid grid-cols-3 rounded-[18px] border border-stone-300/80 bg-white p-1 shadow-sm sm:shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <button
            type="button"
            onClick={() => setField("transactionType", "")}
            className={`min-h-11 rounded-[14px] px-3 py-2 text-sm font-semibold transition ${
              draft.transactionType === "" ? "bg-[#14202d] text-white" : "text-slate-600 hover:bg-stone-100"
            }`}
          >
            Any
          </button>
          <button
            type="button"
            onClick={() => setField("transactionType", "sell")}
            className={`min-h-11 rounded-[14px] px-3 py-2 text-sm font-semibold transition ${
              draft.transactionType === "sell" ? "bg-[#14202d] text-white" : "text-slate-600 hover:bg-stone-100"
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            onClick={() => setField("transactionType", "rent")}
            className={`min-h-11 rounded-[14px] px-3 py-2 text-sm font-semibold transition ${
              draft.transactionType === "rent" ? "bg-[#14202d] text-white" : "text-slate-600 hover:bg-stone-100"
            }`}
          >
            Rent
          </button>
        </div>

        <div className="grid grid-cols-3 rounded-[18px] border border-stone-300/80 bg-white p-1 shadow-sm sm:shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <button
            type="button"
            onClick={() => setField("segment", "")}
            className={`min-h-11 rounded-[14px] px-3 py-2 text-sm font-semibold transition ${
              draft.segment === "" ? "bg-[#14202d] text-white" : "text-slate-600 hover:bg-stone-100"
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setField("segment", "residential")}
            className={`min-h-11 rounded-[14px] px-3 py-2 text-sm font-semibold transition ${
              draft.segment === "residential" ? "bg-[#14202d] text-white" : "text-slate-600 hover:bg-stone-100"
            }`}
          >
            Residential
          </button>
          <button
            type="button"
            onClick={() => setField("segment", "commercial")}
            className={`min-h-11 rounded-[14px] px-3 py-2 text-sm font-semibold transition ${
              draft.segment === "commercial" ? "bg-[#14202d] text-white" : "text-slate-600 hover:bg-stone-100"
            }`}
          >
            Commercial
          </button>
        </div>
      </div>

      <SearchBar queries={draftSearchQueries} onChange={setDraftSearchQueries} data={data} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <select
          value={draft.plotArea}
          onChange={(e) => setField("plotArea", e.target.value)}
          className={selectClass}
        >
          {plotAreaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={draft.bedrooms}
          onChange={(e) => setField("bedrooms", e.target.value)}
          className={selectClass}
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
          className={selectClass}
        >
          <option value="">All Type</option>
          <option value="apartment">Apartment</option>
          <option value="office">Office</option>
          <option value="villa">Villa</option>
          <option value="plot">Plot</option>
          <option value="shop">Shop</option>
        </select>

        <div className="grid grid-cols-2 gap-3 sm:col-span-2 lg:col-span-2">
          <button
            type="button"
            onClick={handleApply}
            className="h-[52px] rounded-[18px] bg-[#14202d] px-5 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(20,32,45,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1b3045] focus:outline-none focus:ring-4 focus:ring-slate-900/10 active:translate-y-0"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="h-[52px] rounded-[18px] border border-stone-300 bg-stone-50 px-5 text-sm font-semibold text-slate-700 transition hover:bg-stone-100 focus:outline-none focus:ring-4 focus:ring-slate-900/10"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
