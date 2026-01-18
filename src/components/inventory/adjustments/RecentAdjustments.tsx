"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Settings, Plus, Minus, User, ChevronLeft, ChevronRight } from "lucide-react";
import { getDefaultImageForName } from "@/lib/utils";
import Image from "next/image";

interface RecentAdjustmentsProps {
  adjustments: any[];
  medications: any[];
}

export function RecentAdjustments({ adjustments, medications }: RecentAdjustmentsProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalPages = Math.ceil(adjustments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentAdjustments = adjustments.slice(startIndex, startIndex + itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Calendar className="h-5 w-5 text-primary" />
          Ajustes Recientes
        </CardTitle>
        <CardDescription>
          Historial de los últimos ajustes realizados
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentAdjustments.map((adjustment) => {
            const medication = medications.find((m) => m.id === adjustment.medicationId);
            const imageUrl = medication?.imageUrl || getDefaultImageForName(adjustment.medicationName || adjustment.medication);
            
            return (
            <Card key={adjustment.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="relative w-10 h-10 rounded-lg overflow-hidden border border-border shrink-0 mt-1">
                    <Image
                      src={imageUrl}
                      alt={adjustment.medicationName || "Medicamento"}
                      fill
                      className="object-cover"
                      onError={(e) => {
                        e.currentTarget.src = getDefaultImageForName(adjustment.medicationName);
                      }}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium truncate pr-2">{adjustment.medicationName || adjustment.medication}</h4>
                      <Badge
                        variant={adjustment.quantity >= 0 ? "default" : "secondary"}
                        className="gap-1 shrink-0"
                      >
                        {adjustment.quantity >= 0 ? (
                          <>
                            <Plus className="h-3 w-3" />+{Math.abs(adjustment.quantity)}
                          </>
                        ) : (
                          <>
                            <Minus className="h-3 w-3" />-{Math.abs(adjustment.quantity)}
                          </>
                        )}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3 break-words">
                      {adjustment.reason}
                    </p>

                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {adjustment.userName || adjustment.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(adjustment.date).toLocaleString("es-ES")}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )})}

          {adjustments.length === 0 && (
            <div className="text-center py-8">
              <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No hay ajustes registrados
              </h3>
              <p className="text-muted-foreground">
                Los ajustes que realices aparecerán aquí
              </p>
            </div>
          )}

          {/* Pagination Controls */}
          {adjustments.length > itemsPerPage && (
            <div className="flex items-center justify-between pt-4 border-t border-border/50">
              <div className="text-xs text-muted-foreground">
                Página {currentPage} de {totalPages}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-8 w-8"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
