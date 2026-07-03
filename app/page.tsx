"use client";

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { useRouter } from "next/navigation";
import api from "../lib/api";
import PropertyCard from "../components/PropertyCard";
import PageSkeleton from "../components/skeletons/PageSkeleton";
import Header from "../components/Header";
import HeroSearchBar from "../components/HeroSearchBar";
import SearchModal from "../components/SearchModal";
import type { PropertyItem } from "../lib/types";

type ViewMode = "list" | "detailed";

const VIEW_LABELS: Record<ViewMode, string> = {
  list: "List View",
  detailed: "Detailed View",
};

const GRID_CLASS: Record<ViewMode, string> = {
  list: "flex flex-col gap-3",
  detailed: "grid grid-cols-1 gap-4 lg:grid-cols-2",
};

// localStorage external store — useSyncExternalStore handles server/client split automatically
function subscribeStorage(cb: () => void) {
  window.addEventListener("storage", cb);
  return () => window.removeEventListener("storage", cb);
}
function snapViewMode(): ViewMode {
  try {
    const v = localStorage.getItem("prop_viewMode") as ViewMode | null;
    return v && v in VIEW_LABELS ? v : "list";
  } catch { return "list"; }
}
function snapFavRaw(): string {
  try { return localStorage.getItem("prop_favorites") ?? "[]"; } catch { return "[]"; }
}
const ssrViewMode = () => "list" as ViewMode;
const ssrFavRaw = () => "[]";

const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000") + "/api";
function getToken(): string {
  try { return localStorage.getItem("token") ?? ""; } catch { return ""; }
}
function clearToken(): void {
  try { localStorage.removeItem("token"); } catch { /* ignore */ }
}

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
  const router = useRouter();
  const [authReady, setAuthReady] = useState(false);

  const [data, setData] = useState<PropertyItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const strictCacheRef = useRef<{ key: string; items: PropertyItem[] } | null>(null);

  const viewMode = useSyncExternalStore(subscribeStorage, snapViewMode, ssrViewMode);
  const favRaw = useSyncExternalStore(subscribeStorage, snapFavRaw, ssrFavRaw);
  const favorites = useMemo(
    () => { try { return new Set(JSON.parse(favRaw) as string[]); } catch { return new Set<string>(); } },
    [favRaw]
  );
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState<number | null>(null);
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
          setTotalCount(filtered.length);
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
        const serverData: PropertyItem[] = res.data?.data ?? [];
        const serverTotalPages = Math.max(1, Number(res.data?.totalPages ?? 1));
        const serverTotal: number | null = res.data?.total ?? res.data?.count ?? null;
        setData(serverData);
        setTotalPages(serverTotalPages);
        setTotalCount(
          serverTotal ??
            (page === serverTotalPages
              ? (page - 1) * PAGE_SIZE + serverData.length
              : serverTotalPages * PAGE_SIZE)
        );
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


  const handleViewMode = useCallback((mode: ViewMode) => {
    try {
      localStorage.setItem("prop_viewMode", mode);
      window.dispatchEvent(new Event("storage"));
    } catch {}
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    try {
      const raw = localStorage.getItem("prop_favorites");
      const current: string[] = raw ? (JSON.parse(raw) as string[]) : [];
      const next = new Set(current);
      const isAdding = !next.has(id);
      if (isAdding) next.add(id); else next.delete(id);
      localStorage.setItem("prop_favorites", JSON.stringify([...next]));
      window.dispatchEvent(new Event("storage"));

      const token = getToken();
      if (!token) return;

      // Revert the optimistic localStorage update if the DB call fails
      const revert = () => {
        try {
          const cur = localStorage.getItem("prop_favorites");
          const list: string[] = cur ? (JSON.parse(cur) as string[]) : [];
          const rev = new Set(list);
          if (isAdding) rev.delete(id); else rev.add(id);
          localStorage.setItem("prop_favorites", JSON.stringify([...rev]));
          window.dispatchEvent(new Event("storage"));
        } catch {}
      };

      const url = isAdding ? `${API_BASE}/favorites` : `${API_BASE}/favorites/${id}`;
      const opts: RequestInit = isAdding
        ? { method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` }, body: JSON.stringify({ propertyId: id }) }
        : { method: "DELETE", headers: { Authorization: `Bearer ${token}` } };

      fetch(url, opts)
        .then((r) => {
          if (!r.ok) {
            revert();
            if (r.status === 401) clearToken();
          }
        })
        .catch(() => revert());
    } catch {}
  }, []);

  // On mount (after auth), load favorites from DB and sync to localStorage
  useEffect(() => {
    if (!authReady) return;
    const token = getToken();
    if (!token) return;
    fetch(`${API_BASE}/favorites`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (r.status === 401) {
          // Token is stale or invalid — clear it so the user gets re-prompted on next login
          clearToken();
          return null;
        }
        if (!r.ok) return null;
        return r.json() as Promise<unknown>;
      })
      .then((res: unknown) => {
        if (!res) return;
        let ids: string[] = [];
        if (Array.isArray(res)) {
          ids = (res as Array<unknown>).map((f) => {
            if (typeof f === "string") return f;
            const obj = f as Record<string, string>;
            return obj.propertyId ?? obj._id ?? "";
          }).filter(Boolean);
        } else {
          const obj = res as Record<string, unknown>;
          if (Array.isArray(obj.favorites)) ids = obj.favorites as string[];
        }
        localStorage.setItem("prop_favorites", JSON.stringify(ids));
        window.dispatchEvent(new Event("storage"));
      })
      .catch((e) => console.error("[Favorites] GET network error:", e));
  }, [authReady]);

  const displayedData = useMemo(
    () => showFavoritesOnly ? data.filter((item) => item._id && favorites.has(item._id)) : data,
    [data, favorites, showFavoritesOnly]
  );

  // Auth check — runs once on client mount, never during SSR.
  // setState is inside a callback (not directly in the effect body) to satisfy react-hooks/set-state-in-effect.
  useEffect(() => {
    // On desktop (≥1024px) MobileGate shows the landing page — no auth redirect needed.
    // Only enforce login on mobile/tablet where the app is actually visible.
    if (window.innerWidth >= 1024) {
      const id = setTimeout(() => setAuthReady(true), 0);
      return () => clearTimeout(id);
    }

    const user = (() => { try { return localStorage.getItem("user"); } catch { return null; } })();
    if (!user) {
      router.replace("/register");
      return;
    }
    const id = setTimeout(() => setAuthReady(true), 0);
    return () => clearTimeout(id);
  }, [router]);

  if (!authReady) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#07111F]">
        <div className="h-7 w-7 animate-spin rounded-full border-2 border-[#22354F] border-t-[#3B82F6]" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#07111F]">
      <Header />

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

        {/* Toolbar — between header and search bar */}
        <div className="mb-3 flex items-center justify-between gap-3">
          {/* Segmented view control */}
          <div className="flex items-center rounded-full border border-[#22354F] bg-[#0D1B2D] p-1">
            <button
              type="button"
              onClick={() => handleViewMode("list")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-4 ${
                viewMode === "list"
                  ? "bg-white text-[#07111F] shadow-sm"
                  : "text-[#A9B4C2] hover:text-white"
              }`}
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              <span>List</span>
            </button>
            <button
              type="button"
              onClick={() => handleViewMode("detailed")}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold transition-all duration-200 sm:px-4 ${
                viewMode === "detailed"
                  ? "bg-white text-[#07111F] shadow-sm"
                  : "text-[#A9B4C2] hover:text-white"
              }`}
            >
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <span>Detailed</span>
            </button>
          </div>

          {/* Favorites filter */}
          <button
            type="button"
            onClick={() => setShowFavoritesOnly((v) => !v)}
            className={`flex items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium transition-all sm:px-4 ${
              showFavoritesOnly
                ? "border-[#EF4444]/30 bg-[#EF4444]/10 text-[#EF4444]"
                : "border-[#22354F] bg-[#132238] text-[#A9B4C2] hover:border-[#3B82F6]/30 hover:text-white"
            }`}
          >
            {showFavoritesOnly ? (
              <svg className="h-3.5 w-3.5 shrink-0 fill-[#EF4444]" viewBox="0 0 24 24">
                <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
              </svg>
            ) : (
              <svg className="h-3.5 w-3.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            )}
            <span>Favorites</span>
            {favorites.size > 0 && (
              <span className={`min-w-4.5 rounded-full px-1.5 py-0.5 text-center text-[10px] font-bold ${
                showFavoritesOnly ? "bg-[#EF4444] text-white" : "bg-[#22354F] text-[#A9B4C2]"
              }`}>
                {favorites.size}
              </span>
            )}
          </button>
        </div>

        {/* Search bar */}
        <HeroSearchBar
          onClick={() => setIsSearchOpen(true)}
          queries={searchQueries}
          onChange={setSearchQueries}
        />

        {/* Content */}
        {loading ? (
          <PageSkeleton />
        ) : data.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-[#22354F] bg-[#132238] px-6 py-12 text-center">
            <p className="text-base font-semibold text-white">No results found</p>
            <p className="mt-1.5 text-sm text-[#A9B4C2]">Try a different locality or clear a few filters.</p>
          </div>
        ) : (
          <>
            {/* Search Across header */}
            <div className="mb-4 mt-5 flex items-center justify-between gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-[#A9B4C2]">Search Across</p>
              {totalCount !== null && (
                <p className="shrink-0 text-sm text-[#A9B4C2]">
                  <span className="font-bold text-white">{totalCount.toLocaleString()}</span> Properties
                </p>
              )}
            </div>

            {showFavoritesOnly && displayedData.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-[#22354F] bg-[#132238] px-6 py-14 text-center">
                <svg className="mx-auto mb-3 h-9 w-9 text-[#22354F]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
                <p className="text-base font-semibold text-white">No favorites yet</p>
                <p className="mt-1.5 text-sm text-[#A9B4C2]">Tap the heart on any card to save it here.</p>
              </div>
            ) : (
              <div className={GRID_CLASS[viewMode]}>
                {displayedData.map((item, i) => (
                  <PropertyCard
                    key={`${item._id ?? i}-${viewMode}`}
                    item={item}
                    displayId={item._id ? `PRP-${item._id.slice(-4).toUpperCase()}` : "N/A"}
                    viewMode={viewMode}
                    isFavorited={!!item._id && favorites.has(item._id)}
                    onToggleFavorite={() => item._id && toggleFavorite(item._id)}
                  />
                ))}
              </div>
            )}

            {/* Pagination */}
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                disabled={page === 1}
                onClick={() => { setLoading(true); setPage((p) => p - 1); }}
                className="rounded-xl border border-[#22354F] bg-[#132238] px-5 py-2.5 text-sm font-medium text-[#A9B4C2] transition hover:border-[#3B82F6]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                ← Prev
              </button>

              <span className="rounded-xl border border-[#22354F] bg-[#132238] px-5 py-2.5 text-sm font-semibold text-white">
                {page} / {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => { setLoading(true); setPage((p) => p + 1); }}
                className="rounded-xl border border-[#22354F] bg-[#132238] px-5 py-2.5 text-sm font-medium text-[#A9B4C2] transition hover:border-[#3B82F6]/30 hover:text-white disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
