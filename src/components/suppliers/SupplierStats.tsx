// components/management/supplier/SupplierStats.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Truck, User, Mail, Phone } from "lucide-react";

interface SupplierStatsProps {
  stats: {
    total: number;
    withContact: number;
    withEmail: number;
    withPhone: number;
  };
}

export function SupplierStats({ stats }: SupplierStatsProps) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Tarjeta Total Proveedores */}
      <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-primary"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Total Proveedores
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.total}
              </p>
            </div>
            <div className="p-3 bg-primary/10 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Truck className="h-6 w-6 text-primary" />
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

      {/* Tarjeta Con Contacto */}
      <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-blue-500"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Con Contacto
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.withContact}
              </p>
            </div>
            <div className="p-3 bg-blue-100 dark:bg-blue-900/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(stats.withContact / stats.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0
              ? `${((stats.withContact / stats.total) * 100).toFixed(
                  1
                )}% del total`
              : "0% del total"}
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta Con Email */}
      <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-green-500"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Con Email
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.withEmail}
              </p>
            </div>
            <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Mail className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(stats.withEmail / stats.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0
              ? `${((stats.withEmail / stats.total) * 100).toFixed(
                  1
                )}% del total`
              : "0% del total"}
          </p>
        </CardContent>
      </Card>

      {/* Tarjeta Con Teléfono */}
      <Card className="border-border/60 bg-card shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-1 bg-purple-500"></div>
        <CardContent className="p-6 relative">
          <div className="flex justify-between items-start">
            <div className="flex flex-col">
              <p className="text-sm font-medium text-muted-foreground mb-1">
                Con Teléfono
              </p>
              <p className="text-3xl font-bold text-card-foreground">
                {stats.withPhone}
              </p>
            </div>
            <div className="p-3 bg-purple-100 dark:bg-purple-900/20 rounded-lg group-hover:scale-110 transition-transform duration-300">
              <Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
              <div
                className="h-full bg-purple-500 rounded-full transition-all duration-700 ease-out"
                style={{
                  width: `${(stats.withPhone / stats.total) * 100}%`,
                }}
              ></div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.total > 0
              ? `${((stats.withPhone / stats.total) * 100).toFixed(
                  1
                )}% del total`
              : "0% del total"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
