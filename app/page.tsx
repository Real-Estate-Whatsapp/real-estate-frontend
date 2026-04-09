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
      limit: "10",
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
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-black to-gray-800 text-white p-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold">🏠 Find Your Property</h1>
          <p className="text-sm text-gray-300 mt-1">
            Search best deals in real estate
          </p>
        </div>
      </div>

      {/* Main */}
      <div className="p-4 max-w-7xl mx-auto">

        {/* Search + Filters */}
        <div className="bg-white p-4 rounded-xl shadow-md mb-6">
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.map((item) => (
                <PropertyCard key={item._id} item={item} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
                className="px-4 py-2 bg-gray-200 rounded disabled:opacity-50"
              >
                Prev
              </button>

              <span className="font-semibold">
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((prev) => prev + 1)}
                className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
