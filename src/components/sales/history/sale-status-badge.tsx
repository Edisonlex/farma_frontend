import { Badge } from "@/components/ui/badge";
import { CheckCircle, X, Clock } from "lucide-react";

interface SaleStatusBadgeProps {
  status: string;
}

export function SaleStatusBadge({ status }: SaleStatusBadgeProps) {
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "completada":
        return <CheckCircle className="w-3 h-3 mr-1" />;
      case "anulada":
        return <X className="w-3 h-3 mr-1" />;
      case "pendiente":
        return <Clock className="w-3 h-3 mr-1" />;
      default:
        return <CheckCircle className="w-3 h-3 mr-1" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "completada":
        return "bg-chart-5/20 text-chart-5 border-chart-5/30";
      case "anulada":
        return "bg-destructive/20 text-destructive border-destructive/30";
      case "pendiente":
        return "bg-accent/20 text-accent-foreground border-accent/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <Badge
      variant="ghost"
      className={`font-medium border ${getStatusColor(status)}`}
    >
      {getStatusIcon(status)}
      {status}
    </Badge>
  );
}
