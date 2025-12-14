import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DollarSign, CreditCard, Zap } from "lucide-react";

interface DailyStats {
  cashSales: number;
  cardSales: number;
  transferSales: number;
  totalSales: number;
}

interface PaymentMethodsBreakdownProps {
  dailyStats: DailyStats;
}

export function PaymentMethodsBreakdown({
  dailyStats,
}: PaymentMethodsBreakdownProps) {
  const paymentMethods = [
    {
      method: "Efectivo",
      amount: dailyStats.cashSales,
      icon: <DollarSign className="w-4 h-4" />,
      color: "bg-chart-5/20 text-chart-5",
    },
    {
      method: "Tarjetas",
      amount: dailyStats.cardSales,
      icon: <CreditCard className="w-4 h-4" />,
      color: "bg-primary/20 text-primary",
    },
    {
      method: "Transferencias",
      amount: dailyStats.transferSales,
      icon: <Zap className="w-4 h-4" />,
      color: "bg-chart-3/20 text-chart-3",
    },
  ];

  return (
    <Card className="border-border/40 bg-card/50 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="w-5 h-5" />
          Desglose por Método de Pago
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {paymentMethods.map((method, index) => (
            <div key={method.method}>
              <PaymentMethodRow
                method={method.method}
                amount={method.amount}
                icon={method.icon}
                color={method.color}
              />
              {index < paymentMethods.length - 1 && (
                <Separator className="bg-border/30" />
              )}
            </div>
          ))}
          <Separator className="bg-border/30" />
          <div className="flex justify-between items-center font-bold text-lg text-foreground pt-2">
            <span>Total</span>
            <span>${dailyStats.totalSales.toFixed(2)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function PaymentMethodRow({
  method,
  amount,
  icon,
  color,
}: {
  method: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <span className={`p-2 rounded-lg ${color}`}>{icon}</span>
        <span className="text-foreground">{method}</span>
      </div>
      <span className="font-medium text-foreground">${amount.toFixed(2)}</span>
    </div>
  );
}
