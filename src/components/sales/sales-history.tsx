"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Sale, useSales } from "@/context/sales-context";
import { SalesHistoryHeader } from "./history/sales-history-header";
import { SalesFilters } from "./history/sales-filters";
import { SalesStats } from "./history/sales-stats";
import { SalesTable } from "./history/sales-table";
import { ExportDialog } from "./history/export-dialog";
import { SaleDetailDialog } from "./history/sale-detail-dialog";
import { useSearchParams } from "next/navigation";


export function SalesHistory() {
  const { sales, cancelSale } = useSales();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [exportDialogOpen, setExportDialogOpen] = useState(false);
  const searchParams = useSearchParams();

  useEffect(() => {
    const s = searchParams.get("search");
    if (s) setSearchTerm(s);
  }, [searchParams]);

  const filteredSales = sales.filter((sale) => {
    const matchesSearch =
      sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (sale.customer.name || "")
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || sale.status.toLowerCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleCancelSale = (saleId: string) => {
    cancelSale(saleId);
  };

  return (
    <div className="space-y-6">
      <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
        <CardHeader>
          <SalesHistoryHeader onExport={() => setExportDialogOpen(true)} />
        </CardHeader>
        <CardContent className="space-y-4">
          <SalesFilters
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
          />

          <SalesStats sales={sales} />

          <SalesTable
            sales={filteredSales}
            onSelectSale={setSelectedSale}
            onCancelSale={handleCancelSale}
          />
        </CardContent>
      </Card>

      <ExportDialog
        open={exportDialogOpen}
        onOpenChange={setExportDialogOpen}
        sales={filteredSales}
        filters={{ search: searchTerm, status: statusFilter }}
      />

      <SaleDetailDialog
        sale={selectedSale}
        onOpenChange={(open) => !open && setSelectedSale(null)}
      />
    </div>
  );
}
