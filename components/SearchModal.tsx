"use client";

import Filters from "./Filters";
import Modal from "./Modal";
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

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  searchQueries: SearchQueries;
  data: PropertyItem[];
  applyFilters: (nextFilters: FilterState, nextSearchQueries: SearchQueries) => void;
  clearFilters: () => void;
};

export default function SearchModal({
  isOpen,
  onClose,
  filters,
  searchQueries,
  data,
  applyFilters,
  clearFilters,
}: SearchModalProps) {
  const handleApply = (nextFilters: FilterState, nextSearchQueries: SearchQueries) => {
    applyFilters(nextFilters, nextSearchQueries);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Search properties" size="search">
      <Filters
        filters={filters}
        searchQueries={searchQueries}
        data={data}
        applyFilters={handleApply}
        clearFilters={clearFilters}
      />
    </Modal>
  );
}
