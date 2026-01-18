// components/management/supplier/SupplierStats.tsx
import { Truck, User, Mail, Phone } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

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
      <StatCard
        title="Total Proveedores"
        value={stats.total}
        icon={<Truck className="h-6 w-6 text-primary" />}
        accentClass="bg-primary"
        progressClass="bg-primary"
        iconBgClass="bg-primary/10"
      />

      <StatCard
        title="Con Contacto"
        value={stats.withContact}
        percentage={(stats.withContact / stats.total) * 100}
        icon={<User className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        accentClass="bg-blue-500"
        progressClass="bg-blue-500"
        iconBgClass="bg-blue-100 dark:bg-blue-900/20"
      />

      <StatCard
        title="Con Email"
        value={stats.withEmail}
        percentage={(stats.withEmail / stats.total) * 100}
        icon={<Mail className="h-6 w-6 text-green-600 dark:text-green-400" />}
        accentClass="bg-green-500"
        progressClass="bg-green-500"
        iconBgClass="bg-green-100 dark:bg-green-900/20"
      />

      <StatCard
        title="Con Teléfono"
        value={stats.withPhone}
        percentage={(stats.withPhone / stats.total) * 100}
        icon={<Phone className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
        accentClass="bg-purple-500"
        progressClass="bg-purple-500"
        iconBgClass="bg-purple-100 dark:bg-purple-900/20"
      />
    </div>
  );
}
