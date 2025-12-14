"use client";

import { useEffect, useState } from "react";
import { useInventory } from "@/context/inventory-context";
import { FiltersSection } from "./StatusTab/FiltersSection";
import { MedicationsList } from "./StatusTab/MedicationsList";
import { NoResults } from "./StatusTab/NoResults";
import { useSearchParams } from "next/navigation";


export function CurrentStatusTab() {
  const { medications } = useInventory();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [stockFilter, setStockFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("search");
    const st = searchParams.get("stock");
    if (s) setSearch(s);
    if (st === "low" || st === "out" || st === "normal") setStockFilter(st);
  }, [searchParams]);

  const hasActiveFilters =
    search !== "" || categoryFilter !== "all" || stockFilter !== "all";

  const filteredMedications = medications.filter((med) => {
    const matchesSearch =
      med.name.toLowerCase().includes(search.toLowerCase()) ||
      med.activeIngredient.toLowerCase().includes(search.toLowerCase()) ||
      med.supplier.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" ||
      med.category.toLowerCase() === categoryFilter.toLowerCase();

    let matchesStock = true;
    if (stockFilter === "low") {
      matchesStock = med.quantity <= med.minStock && med.quantity > 0;
    } else if (stockFilter === "out") {
      matchesStock = med.quantity === 0;
    } else if (stockFilter === "normal") {
      matchesStock = med.quantity > med.minStock;
    }

    return matchesSearch && matchesCategory && matchesStock;
  });

  const clearFilters = () => {
    setSearch("");
    setCategoryFilter("all");
    setStockFilter("all");
  };

  return (
    <div className="space-y-6 ">
      <FiltersSection
        search={search}
        setSearch={setSearch}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        stockFilter={stockFilter}
        setStockFilter={setStockFilter}
        showFilters={showFilters}
        setShowFilters={setShowFilters}
        hasActiveFilters={hasActiveFilters}
        filteredCount={filteredMedications.length}
        totalCount={medications.length}
        onClearFilters={clearFilters}
      />

      {filteredMedications.length > 0 ? (
        <MedicationsList medications={filteredMedications} />
      ) : (
        <NoResults
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
        />
      )}
    </div>
  );
}
