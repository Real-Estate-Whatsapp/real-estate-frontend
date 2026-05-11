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
    "h-12 w-full rounded-lg border border-stone-200 bg-white px-4 text-sm font-medium text-slate-900 shadow-[0_8px_24px_rgba(15,23,42,0.05)] outline-none transition focus:border-[#14202d] focus:ring-4 focus:ring-slate-900/10 sm:h-[52px] sm:text-[15px]";
  const segmentGroupClass =
    "grid grid-cols-3 gap-1 rounded-lg border border-stone-200 bg-stone-50/80 p-1 shadow-[0_8px_24px_rgba(15,23,42,0.05)]";
  const segmentButtonClass =
    "min-h-10 rounded-md px-2 py-2 text-[12px] font-bold leading-4 transition sm:min-h-11 sm:px-3 sm:text-sm";
  const activeSegmentClass = "bg-[#14202d] text-white shadow-[0_8px_18px_rgba(20,32,45,0.2)]";
  const inactiveSegmentClass = "text-slate-600 hover:bg-white hover:text-slate-900";

  return (
    <div className="flex flex-col gap-4 sm:gap-5">
      <div className="grid gap-3 lg:grid-cols-2">
        <div className={segmentGroupClass}>
          <button
            type="button"
            onClick={() => setField("transactionType", "")}
            className={`${segmentButtonClass} ${
              draft.transactionType === "" ? activeSegmentClass : inactiveSegmentClass
            }`}
          >
            Any
          </button>
          <button
            type="button"
            onClick={() => setField("transactionType", "sell")}
            className={`${segmentButtonClass} ${
              draft.transactionType === "sell" ? activeSegmentClass : inactiveSegmentClass
            }`}
          >
            Sell
          </button>
          <button
            type="button"
            onClick={() => setField("transactionType", "rent")}
            className={`${segmentButtonClass} ${
              draft.transactionType === "rent" ? activeSegmentClass : inactiveSegmentClass
            }`}
          >
            Rent
          </button>
        </div>

        <div className={segmentGroupClass}>
          <button
            type="button"
            onClick={() => setField("segment", "")}
            className={`${segmentButtonClass} ${
              draft.segment === "" ? activeSegmentClass : inactiveSegmentClass
            }`}
          >
            All
          </button>
          <button
            type="button"
            onClick={() => setField("segment", "residential")}
            className={`${segmentButtonClass} ${
              draft.segment === "residential" ? activeSegmentClass : inactiveSegmentClass
            }`}
          >
            Residential
          </button>
          <button
            type="button"
            onClick={() => setField("segment", "commercial")}
            className={`${segmentButtonClass} ${
              draft.segment === "commercial" ? activeSegmentClass : inactiveSegmentClass
            }`}
          >
            Commercial
          </button>
        </div>
      </div>

      <SearchBar queries={draftSearchQueries} onChange={setDraftSearchQueries} data={data} />

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
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
            className="h-12 rounded-lg bg-[#14202d] px-5 text-sm font-bold text-white shadow-[0_14px_30px_rgba(20,32,45,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1b3045] focus:outline-none focus:ring-4 focus:ring-slate-900/10 active:translate-y-0 sm:h-[52px]"
          >
            Apply
          </button>

          <button
            type="button"
            onClick={handleClear}
            className="h-12 rounded-lg border border-stone-300 bg-white px-5 text-sm font-bold text-slate-700 shadow-[0_8px_24px_rgba(15,23,42,0.04)] transition hover:bg-stone-100 focus:outline-none focus:ring-4 focus:ring-slate-900/10 sm:h-[52px]"
          >
            Clear
          </button>
        </div>
      </div>
    </div>
  );
}
