"use client";

import { useEffect, useState } from "react";
import api from "../lib/api";
import SearchBar from "../components/SearchBar";
import PropertyCard from "../components/PropertyCard";
import Filters from "../components/Filters";
import Loader from "../components/Loader";

type FilterState = {
  type: string;
  segment: string;
  locality: string;
  bedrooms: string;
  minPrice: string;
  maxPrice: string;
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

export default function Home() {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");

  const [filters, setFilters] = useState<FilterState>({
    type: "",
    segment: "",
    locality: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
  });

  useEffect(() => {
    setLoading(true);

    const trimmedSearchQuery = searchQuery.trim();
    const trimmedAreaQuery = filters.locality.trim();

    const queryParams = new URLSearchParams({
      page: String(page),
      limit: "12",
    });

    if (trimmedSearchQuery) {
      queryParams.set("locality", trimmedSearchQuery);
    }

    if (trimmedAreaQuery) {
      if (isAreaSearchValue(trimmedAreaQuery)) {
        queryParams.set("search", trimmedAreaQuery);
      } else {
        queryParams.set("locality", trimmedAreaQuery);
      }
    }
    if (filters.type) queryParams.set("type", filters.type);
    if (filters.segment) queryParams.set("segment", filters.segment);
    if (filters.minPrice) queryParams.set("minPrice", filters.minPrice);
    if (filters.maxPrice) queryParams.set("maxPrice", filters.maxPrice);

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
  }, [page, searchQuery, filters]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setPage(1);
  };

  const applyFilters = (next: FilterState) => {
    setFilters(next);
    setPage(1);
  };

  const clearFilters = () => {
    setFilters({
      type: "",
      segment: "",
      locality: "",
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
    });
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(251,191,36,0.16),_transparent_28%),linear-gradient(180deg,_#f8f4ec_0%,_#f4efe7_36%,_#fcfbf8_100%)]">

      {/* Header */}
      <div className="relative overflow-hidden border-b border-black/5 bg-[#14202d] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(244,114,182,0.16),_transparent_24%),radial-gradient(circle_at_top_right,_rgba(45,212,191,0.18),_transparent_28%)]" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:px-8 lg:py-14">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
              Curated Inventory
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl">
              Find Your Property
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
              Explore sharper listings, compare faster, and narrow down the right home or investment with a cleaner search experience.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 self-start lg:min-w-[320px]">
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Per Page</p>
              <p className="mt-2 text-2xl font-semibold text-white">12</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/8 px-4 py-4 backdrop-blur">
              <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Page</p>
              <p className="mt-2 text-2xl font-semibold text-white">{page}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="mx-auto max-w-7xl px-4 pb-12 pt-6 sm:px-6 lg:px-8 lg:pb-16 lg:pt-8">

        {/* Search + Filters */}
        <div className="mb-8 overflow-hidden rounded-[28px] border border-white/70 bg-[rgba(255,253,249,0.88)] p-4 shadow-[0_18px_50px_rgba(15,23,42,0.08)] backdrop-blur sm:p-6">
          <div className="mb-5 flex flex-col gap-3 border-b border-stone-200/80 pb-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-stone-500">Search Studio</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Refine the shortlist</h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-slate-500">
              Use the locality search first, then tighten results with area, BHK, segment, type, and price filters.
            </p>
          </div>
          <SearchBar onSearch={handleSearch} data={data} />
          <Filters
            filters={filters}
            applyFilters={applyFilters}
            clearFilters={clearFilters}
          />
        </div>

        {/* Content */}
        {loading ? (
          <Loader />
        ) : data.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500 text-lg">No results found 😔</p>
          </div>
        ) : (
          <>
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
                  onClick={() => setPage((prev) => prev - 1)}
                  className="rounded-full border border-stone-300 bg-stone-100 px-5 py-3 text-sm font-medium text-slate-700 transition hover:bg-stone-200 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Prev
                </button>

                <button
                  disabled={page === totalPages}
                  onClick={() => setPage((prev) => prev + 1)}
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
