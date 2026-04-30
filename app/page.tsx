"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import api from "../lib/api";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import Header from "../components/Header";
import SearchModal from "../components/SearchModal";
import type { PropertyItem } from "../lib/types";

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

type SearchQueries = {
  locality: string;
  society: string;
  phone: string;
};

const isAreaSearchValue = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  if (!normalizedValue) {
    return false;
  }

  return (
    /\d/.test(normalizedValue) ||
    normalizedValue.includes("super built") ||
    normalizedValue.includes("superbuilt") ||
    normalizedValue.includes("carpet") ||
    normalizedValue.includes("plot area") ||
    normalizedValue === "plot" ||
    normalizedValue.includes("sqft") ||
    normalizedValue.includes("sq ft") ||
    normalizedValue.includes("sqyd") ||
    normalizedValue.includes("sq yd")
  );
};

const isPlotSearchValue = (value: string) => {
  const normalizedValue = value.trim().toLowerCase();

  return normalizedValue === "plot" || normalizedValue === "plots";
};

export default function Home() {
  const [data, setData] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQueries, setSearchQueries] = useState({
    locality: "",
    society: "",
    phone: "",
  });

  const [filters, setFilters] = useState<FilterState>({
    type: "",
    segment: "",
    locality: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
    plotArea: "",
    transactionType: "",
  });

  useEffect(() => {
    const trimmedLocality = searchQueries.locality.trim();
    const trimmedSociety = searchQueries.society.trim();
    const trimmedPhone = searchQueries.phone.trim();
    const trimmedAreaQuery = filters.locality.trim();

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: "12",
    });

    let combinedSearch = trimmedSociety;
    const localityLooksLikeArea = isAreaSearchValue(trimmedLocality);
    const localityLooksLikePlot = isPlotSearchValue(trimmedLocality);

    if (trimmedAreaQuery) {
      if (isAreaSearchValue(trimmedAreaQuery)) {
        combinedSearch = combinedSearch ? `${combinedSearch} ${trimmedAreaQuery}` : trimmedAreaQuery;
      } else {
        const combinedLocality = trimmedLocality ? `${trimmedLocality} ${trimmedAreaQuery}` : trimmedAreaQuery;
        queryParams.set("locality", combinedLocality);
      }
    } else if (trimmedLocality && localityLooksLikeArea && !localityLooksLikePlot) {
      combinedSearch = combinedSearch ? `${combinedSearch} ${trimmedLocality}` : trimmedLocality;
    } else if (trimmedLocality && !localityLooksLikePlot) {
      queryParams.set("locality", trimmedLocality);
    }

    if (combinedSearch) {
      queryParams.set("search", combinedSearch);
    }

    if (trimmedPhone) {
      queryParams.set("phone", trimmedPhone);
    }
    if (filters.type || localityLooksLikePlot) queryParams.set("type", filters.type || "plot");
    if (filters.segment) queryParams.set("segment", filters.segment);
    if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);
    if (filters.plotArea) {
      if (filters.plotArea.includes("+")) {
        queryParams.set("minArea", filters.plotArea.replace("+", ""));
      } else {
        const [minArea, maxArea] = filters.plotArea.split("-");
        if (minArea) queryParams.set("minArea", minArea);
        if (maxArea) queryParams.set("maxArea", maxArea);
      }
    }
    if (filters.transactionType) queryParams.set("transactionType", filters.transactionType);

    if (filters.bedrooms === "5+") {
      queryParams.set("minBedrooms", "5");
    } else if (filters.bedrooms) {
      queryParams.set("minBedrooms", filters.bedrooms);
      queryParams.set("maxBedrooms", filters.bedrooms);
    }

    api.get(`/api/inventory?${queryParams.toString()}`)
      .then((res) => {
        setData(res.data?.data ?? []);
        setTotalPages(res.data?.totalPages ?? 1);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setData([]);
        setTotalPages(1);
        setLoading(false);
      });
  }, [page, searchQueries, filters]);

  const applyFilters = useCallback((next: FilterState, nextSearchQueries: SearchQueries) => {
    setLoading(true);
    setFilters(next);
    setSearchQueries(nextSearchQueries);
    setPage(1);
  }, []);

  const clearFilters = useCallback(() => {
    setLoading(true);
    setFilters({
      type: "",
      segment: "",
      locality: "",
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
      plotArea: "",
      transactionType: "",
    });
    setSearchQueries({
      locality: "",
      society: "",
      phone: "",
    });
    setPage(1);
  }, []);

  const activeFilterCount = useMemo(() => {
    return [
      searchQueries.locality,
      searchQueries.society,
      searchQueries.phone,
      filters.type,
      filters.segment,
      filters.locality,
      filters.bedrooms,
      filters.minPrice,
      filters.maxPrice,
      filters.plotArea,
      filters.transactionType,
    ].filter(Boolean).length;
  }, [filters, searchQueries]);

  const searchSummary = useMemo(() => {
    const parts = [
      searchQueries.locality,
      searchQueries.society,
      searchQueries.phone,
      filters.transactionType,
      filters.segment,
      filters.type,
      filters.bedrooms ? `${filters.bedrooms} BHK` : "",
      filters.plotArea ? `${filters.plotArea} sq ft` : "",
    ].filter(Boolean);

    return parts.length > 0 ? parts.join(" • ") : "Search by locality, society, phone, budget, area, or BHK";
  }, [filters, searchQueries]);

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.14),_transparent_24%),linear-gradient(180deg,_#f6efe4_0%,_#f8f3eb_34%,_#fcfbf8_100%)]">
      <Header activeFilterCount={activeFilterCount} onOpenSearch={() => setIsSearchOpen(true)} />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        filters={filters}
        searchQueries={searchQueries}
        data={data}
        applyFilters={applyFilters}
        clearFilters={clearFilters}
      />

      {/* Main */}
      <div className="relative mx-auto mt-4 max-w-7xl px-3 pb-8 sm:mt-8 sm:px-6 lg:px-8">
        <section className="mb-5 overflow-hidden rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,254,250,0.96)_0%,_rgba(255,250,242,0.94)_100%)] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur sm:mb-8 sm:rounded-[30px] sm:p-6">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="min-w-0">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500">Smart Search</p>
              <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">Find matching properties</h1>
              <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500 sm:text-base">{searchSummary}</p>
            </div>
            <button
              type="button"
              onClick={() => setIsSearchOpen(true)}
              className="inline-flex h-14 w-full items-center justify-center rounded-[18px] bg-[#14202d] px-6 text-sm font-semibold text-white shadow-[0_14px_30px_rgba(20,32,45,0.22)] transition hover:-translate-y-0.5 hover:bg-[#1b3045] focus:outline-none focus:ring-4 focus:ring-slate-900/10 active:translate-y-0 md:w-auto"
            >
              {activeFilterCount > 0 ? "Update search" : "Start search"}
            </button>
          </div>
        </section>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : data.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-stone-300 bg-white/70 px-6 py-12 text-center shadow-[0_12px_30px_rgba(15,23,42,0.05)]">
            <p className="text-lg font-semibold text-slate-700">No results found</p>
            <p className="mt-2 text-sm text-slate-500">Try a different locality or clear a few filters.</p>
          </div>
        ) : (
          <>
            <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div>
                <p className="hidden sm:block text-[10px] font-semibold uppercase tracking-[0.24em] text-stone-500 mb-2">Listings</p>
                <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">Browse Results</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((item) => (
                <PropertyCard key={item._id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-10 rounded-[24px] border border-stone-200/80 bg-white/80 p-3 shadow-[0_14px_30px_rgba(15,23,42,0.05)] backdrop-blur sm:p-4">
              <div className="grid grid-cols-2 gap-3 sm:flex sm:items-center sm:justify-center">
                <button
                  disabled={page === 1}
                  onClick={() => {
                    setLoading(true);
                    setPage((prev) => prev - 1);
                  }}
                  className="rounded-full border border-stone-300 bg-stone-100 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => {
                    setLoading(true);
                    setPage((prev) => prev + 1);
                  }}
                  className="rounded-full bg-[#14202d] px-5 py-3 text-sm font-medium text-white transition hover:bg-[#1d2d40] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>

                <div className="col-span-2 flex justify-center sm:col-span-1">
                  <span className="inline-flex min-w-[152px] items-center justify-center rounded-full bg-stone-100 px-5 py-3 text-sm font-semibold text-slate-700">
                    Page {page} of {totalPages}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
