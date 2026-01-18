import { Users, Shield, UserCheck, Settings } from "lucide-react";
import { StatCard } from "@/components/shared/stat-card";

interface UserStatsProps {
  stats: {
    total: number;
    administradores: number;
    farmaceuticos: number;
    tecnicos: number;
  };
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      <StatCard
        title="Total Usuarios"
        value={stats.total}
        icon={<Users className="h-6 w-6 text-primary" />}
        accentClass="bg-primary"
        progressClass="bg-primary"
        iconBgClass="bg-primary/10"
      />

      <StatCard
        title="Administradores"
        value={stats.administradores}
        percentage={(stats.administradores / stats.total) * 100}
        icon={<Shield className="h-6 w-6 text-red-600 dark:text-red-400" />}
        accentClass="bg-red-500"
        progressClass="bg-red-500"
        iconBgClass="bg-red-100 dark:bg-red-900/20"
      />

      <StatCard
        title="Farmacéuticos"
        value={stats.farmaceuticos}
        percentage={(stats.farmaceuticos / stats.total) * 100}
        icon={<UserCheck className="h-6 w-6 text-blue-600 dark:text-blue-400" />}
        accentClass="bg-blue-500"
        progressClass="bg-blue-500"
        iconBgClass="bg-blue-100 dark:bg-blue-900/20"
      />

      <StatCard
        title="Técnicos"
        value={stats.tecnicos}
        percentage={(stats.tecnicos / stats.total) * 100}
        icon={<Settings className="h-6 w-6 text-green-600 dark:text-green-400" />}
        accentClass="bg-green-500"
        progressClass="bg-green-500"
        iconBgClass="bg-green-100 dark:bg-green-900/20"
      />
    </div>
  );
}
