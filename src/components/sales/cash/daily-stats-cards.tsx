import { Card, CardContent } from "@/components/ui/card";
import { DollarSign, TrendingUp, Receipt, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface DailyStats {
  totalSales: number;
  totalTransactions: number;
  cashSales: number;
  returns: number;
}

interface DailyStatsCardsProps {
  dailyStats: DailyStats;
}

export function DailyStatsCards({ dailyStats }: DailyStatsCardsProps) {
  const stats = [
    {
      title: "Ventas Totales",
      value: `$${dailyStats.totalSales.toFixed(2)}`,
      icon: <DollarSign className="w-5 h-5 text-chart-5" />,
      className: "bg-chart-5/10 border-chart-5/20",
    },
    {
      title: "Transacciones",
      value: dailyStats.totalTransactions.toString(),
      icon: <TrendingUp className="w-5 h-5 text-primary" />,
      className: "bg-primary/10 border-primary/20",
    },
    {
      title: "Efectivo",
      value: `$${dailyStats.cashSales.toFixed(2)}`,
      icon: <Receipt className="w-5 h-5 text-accent" />,
      className: "bg-accent/10 border-accent/20",
    },
    {
      title: "Devoluciones",
      value: `$${dailyStats.returns.toFixed(2)}`,
      icon: <TrendingDown className="w-5 h-5 text-destructive" />,
      className: "bg-destructive/10 border-destructive/20",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <StatCard
          key={index}
          title={stat.title}
          value={stat.value}
          icon={stat.icon}
          className={stat.className}
        />
      ))}
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  className,
}: {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Card className={`border ${className} h-full`}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">{title}</p>
              <p className="text-xl font-bold text-foreground">{value}</p>
            </div>
            <div className="p-2 rounded-lg bg-background/50">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
