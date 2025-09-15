// components/management/category/CategoryStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Tags, FileText, File } from "lucide-react";

interface CategoryStatsProps {
  stats: {
    total: number;
    withDescription: number;
    withoutDescription: number;
  };
}

export function CategoryStats({ stats }: CategoryStatsProps) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Tarjeta Total Categorías */}
      <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Categorías
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Tags className="h-6 w-6 text-primary" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                style={{ width: "100%" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tarjeta Con Descripción */}
      <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Con Descripción
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.withDescription}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <FileText className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(stats.withDescription / stats.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0
              ? `${((stats.withDescription / stats.total) * 100).toFixed(
                  1
                )}% del total`
              : "0% del total"}
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta Sin Descripción */}
      <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-gray-500"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Sin Descripción
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.withoutDescription}
              </p>
            </div>
            <div className="p-3 bg-gray-100 dark:bg-gray-900/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <File className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-500 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(stats.withoutDescription / stats.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0
              ? `${((stats.withoutDescription / stats.total) * 100).toFixed(
                  1
                )}% del total`
              : "0% del total"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
