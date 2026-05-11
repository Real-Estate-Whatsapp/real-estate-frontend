"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import api from "../lib/api";
import PropertyCard from "../components/PropertyCard";
import Loader from "../components/Loader";
import Header from "../components/Header";
import HeroSearchBar from "../components/HeroSearchBar";
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

const PAGE_SIZE = 12;
const PROPERTY_ID_START = 10000;

const normalizeSearchValue = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

const isAreaSearchValue = (value: string) => {
  const normalizedValue = normalizeSearchValue(value);

  if (!normalizedValue) {
    return false;
  }

  return (
    /\d/.test(normalizedValue) ||
    normalizedValue.includes("super built") ||
    normalizedValue.includes("superbuilt") ||
    normalizedValue.includes("carpet") ||
    normalizedValue.includes("plot area") ||
    normalizedValue.includes("sqft") ||
    normalizedValue.includes("sq ft") ||
    normalizedValue.includes("sqyd") ||
    normalizedValue.includes("sq yd")
  );
};

const isPlotSearchValue = (value: string) => {
  const normalizedValue = normalizeSearchValue(value);
  if (!normalizedValue) return false;

  return normalizedValue.split(" ").some((token) =>
    ["plot", "plots", "ploat", "land", "lands", "site", "sites"].includes(token)
  );
};

const getTextValues = (value: unknown): string[] => {
  if (typeof value === "string" || typeof value === "number") {
    return [String(value)];
  }

  if (Array.isArray(value)) {
    return value.flatMap((entry) => getTextValues(entry));
  }

  if (value && typeof value === "object") {
    return Object.values(value as Record<string, unknown>).flatMap((entry) => getTextValues(entry));
  }

  return [];
};

const isPlotProperty = (item: PropertyItem) => {
  const typeValue = normalizeSearchValue(item.type ?? "");
  const listingTypeValue = normalizeSearchValue(item.listingType ?? "");

  return [typeValue, listingTypeValue].some((value) =>
    ["plot", "plots", "land", "lands", "site", "sites"].includes(value)
  );
};

const isPlotSearchMatch = (item: PropertyItem) => {
  if (isPlotProperty(item)) {
    return true;
  }

  const itemWithExtras = item as PropertyItem & {
    title?: string;
    description?: string;
    category?: string;
    tags?: unknown;
  };

  const searchableValues = [
    itemWithExtras.title,
    itemWithExtras.description,
    itemWithExtras.category,
    itemWithExtras.tags,
    item.type,
    item.listingType,
    item.segment,
    item.address,
    item.plotDetails,
  ];

  const combinedText = normalizeSearchValue(getTextValues(searchableValues).join(" "));
  return combinedText.includes("plot");
};

const getNumericPlotArea = (item: PropertyItem) => {
  const plotArea = item.area?.plot;
  if (typeof plotArea === "number") return plotArea;
  if (typeof plotArea === "string") {
    const parsed = Number(plotArea);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const matchesPlotAreaFilter = (item: PropertyItem, plotAreaFilter: string) => {
  if (!plotAreaFilter) return true;

  const areaValue = getNumericPlotArea(item);
  if (areaValue === null) return false;

  if (plotAreaFilter.includes("+")) {
    const minValue = Number(plotAreaFilter.replace("+", ""));
    if (!Number.isFinite(minValue)) return true;
    return areaValue >= minValue;
  }

  const [minRaw, maxRaw] = plotAreaFilter.split("-");
  const minValue = Number(minRaw);
  const maxValue = Number(maxRaw);

  if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return true;
  return areaValue >= minValue && areaValue <= maxValue;
};

export default function Home() {
  const [data, setData] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const strictCacheRef = useRef<{ key: string; items: PropertyItem[] } | null>(null);

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
    let isActive = true;

    const trimmedLocality = searchQueries.locality.trim();
    const trimmedSociety = searchQueries.society.trim();
    const trimmedPhone = searchQueries.phone.trim();
    const trimmedAreaQuery = filters.locality.trim();
    const queryParams = new URLSearchParams();

    let combinedSearch = trimmedSociety;
    const localityLooksLikeArea = isAreaSearchValue(trimmedLocality);
    const localityLooksLikePlot = isPlotSearchValue(trimmedLocality);
    const societyLooksLikePlot = isPlotSearchValue(trimmedSociety);

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
    const isTypePlot = isPlotSearchValue(filters.type);
    const shouldForcePlotOnly = localityLooksLikePlot || societyLooksLikePlot || isTypePlot;
    const hasStrictClientFiltering = shouldForcePlotOnly || Boolean(filters.plotArea);
    const currentStrictKey = JSON.stringify({ searchQueries, filters, shouldForcePlotOnly });

    if (filters.type || shouldForcePlotOnly) queryParams.set("type", filters.type || "plot");
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

    const applyStrictFilters = (items: PropertyItem[]) => {
      const plotIntentFilteredData = shouldForcePlotOnly ? items.filter(isPlotSearchMatch) : items;
      return filters.plotArea
        ? plotIntentFilteredData.filter((item) => matchesPlotAreaFilter(item, filters.plotArea))
        : plotIntentFilteredData;
    };

    const paginate = (items: PropertyItem[], currentPage: number) => {
      const computedTotalPages = Math.max(1, Math.ceil(items.length / PAGE_SIZE));
      const safePage = Math.min(currentPage, computedTotalPages);
      const start = (safePage - 1) * PAGE_SIZE;
      const end = start + PAGE_SIZE;
      return { safePage, computedTotalPages, pageData: items.slice(start, end) };
    };

    const fetchData = async () => {
      try {
        setLoading(true);

        if (hasStrictClientFiltering) {
          if (strictCacheRef.current?.key === currentStrictKey) {
            const { safePage, computedTotalPages, pageData } = paginate(strictCacheRef.current.items, page);
            if (!isActive) return;
            setData(pageData);
            setTotalPages(computedTotalPages);
            if (safePage !== page) setPage(safePage);
            setLoading(false);
            return;
          }

          const strictLimit = "100";
          const firstPageParams = new URLSearchParams(queryParams);
          firstPageParams.set("page", "1");
          firstPageParams.set("limit", strictLimit);

          const firstRes = await api.get(`/api/inventory?${firstPageParams.toString()}`);
          const firstPageData: PropertyItem[] = firstRes.data?.data ?? [];
          const serverTotalPages = Math.max(1, Number(firstRes.data?.totalPages ?? 1));

          let allData = firstPageData;
          if (serverTotalPages > 1) {
            const pageRequests: Promise<{ data?: { data?: PropertyItem[] } }>[] = [];
            for (let nextPage = 2; nextPage <= serverTotalPages; nextPage += 1) {
              const nextParams = new URLSearchParams(queryParams);
              nextParams.set("page", String(nextPage));
              nextParams.set("limit", strictLimit);
              pageRequests.push(api.get(`/api/inventory?${nextParams.toString()}`));
            }

            const pageResponses = await Promise.all(pageRequests);
            allData = [
              ...firstPageData,
              ...pageResponses.flatMap((response) => response.data?.data ?? []),
            ];
          }

          const filtered = applyStrictFilters(allData);
          const { safePage, computedTotalPages, pageData } = paginate(filtered, page);

          if (!isActive) return;
          strictCacheRef.current = { key: currentStrictKey, items: filtered };
          setData(pageData);
          setTotalPages(computedTotalPages);
          if (safePage !== page) setPage(safePage);
          setLoading(false);
          return;
        }

        strictCacheRef.current = null;

        const pageParams = new URLSearchParams(queryParams);
        pageParams.set("page", String(page));
        pageParams.set("limit", String(PAGE_SIZE));

        const res = await api.get(`/api/inventory?${pageParams.toString()}`);
        if (!isActive) return;
        setData(res.data?.data ?? []);
        setTotalPages(Math.max(1, Number(res.data?.totalPages ?? 1)));
        setLoading(false);
      } catch (err) {
        console.error(err);
        if (!isActive) return;
        setData([]);
        setTotalPages(1);
        setLoading(false);
      }
    };

    fetchData();

    return () => {
      isActive = false;
    };
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
        <section className="mb-5 overflow-visible rounded-[24px] border border-white/80 bg-[linear-gradient(180deg,_rgba(255,254,250,0.96)_0%,_rgba(255,250,242,0.94)_100%)] p-4 shadow-[0_24px_70px_rgba(15,23,42,0.12)] backdrop-blur sm:mb-8 sm:rounded-[30px] sm:p-6">
          <div className="grid gap-5 lg:items-center">
            <div className="flex flex-col items-stretch gap-3">
              <HeroSearchBar
                onClick={() => setIsSearchOpen(true)}
                queries={searchQueries}
                onChange={setSearchQueries}
              />
            </div>
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
                <h3 className="mt-1 text-lg font-bold tracking-tight text-slate-900 sm:text-2xl">Search Across</h3>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {data.map((item, index) => (
                <PropertyCard
                  key={item._id}
                  item={item}
                  displayId={`PRP-${PROPERTY_ID_START + (page - 1) * PAGE_SIZE + index}`}
                />
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
