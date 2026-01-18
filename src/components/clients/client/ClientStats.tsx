import { Users, UserPlus, Building, School } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

interface ClientStatsProps {
  stats: {
    total: number;
    particulares: number;
    empresas: number;
    instituciones: number;
  };
}

export function ClientStats({ stats }: ClientStatsProps) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Clientes"
        value={stats.total}
        icon={<Users className="h-6 w-6 text-primary" />}
        accentClass="bg-primary"
        progressClass="bg-primary"
        iconBgClass="bg-primary/10"
      />

      <StatCard
        title="Particulares"
        value={stats.particulares}
        percentage={(stats.particulares / stats.total) * 100}
        icon={<UserPlus className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        accentClass="bg-blue-500"
        progressClass="bg-blue-500"
        iconBgClass="bg-blue-100 dark:bg-blue-900/20"
      />

      <StatCard
        title="Empresas"
        value={stats.empresas}
        percentage={(stats.empresas / stats.total) * 100}
        icon={<Building className="h-6 w-6 text-green-600 dark:text-green-400" />}
        accentClass="bg-green-500"
        progressClass="bg-green-500"
        iconBgClass="bg-green-100 dark:bg-green-900/20"
      />

      <StatCard
        title="Instituciones"
        value={stats.instituciones}
        percentage={(stats.instituciones / stats.total) * 100}
        icon={<School className="h-6 w-6 text-purple-600 dark:text-purple-400" />}
        accentClass="bg-purple-500"
        progressClass="bg-purple-500"
        iconBgClass="bg-purple-100 dark:bg-purple-900/20"
      />
    </div>
  );
}
