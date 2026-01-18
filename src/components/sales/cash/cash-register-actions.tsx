import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Lock, Unlock, FileText } from "lucide-react";

interface CashRegisterActionsProps {
  isOpen: boolean;
  initialAmount: number;
  currentAmount: number;
  setCurrentAmount: (amount: number) => void;
  expectedCash: number;
  difference: number;
  showCloseDialog: boolean;
  setShowCloseDialog: (show: boolean) => void;
  onCloseCashRegister: () => void;
  onOpenCashRegister: (amount: number) => void;
  onGenerateReport: () => void;
}

export function CashRegisterActions({
  isOpen,
  currentAmount,
  setCurrentAmount,
  expectedCash,
  difference,
  showCloseDialog,
  setShowCloseDialog,
  onCloseCashRegister,
  onOpenCashRegister,
  onGenerateReport,
}: CashRegisterActionsProps) {
  const [showOpenDialog, setShowOpenDialog] = useState(false);
  const [openAmount, setOpenAmount] = useState(500);

  const handleOpenClick = () => {
    onOpenCashRegister(openAmount);
    setShowOpenDialog(false);
  };

  return (
    <div className="flex gap-4 flex-wrap">
      {isOpen ? (
        <>
          <Dialog open={showCloseDialog} onOpenChange={setShowCloseDialog}>
            <Button
              variant="destructive"
              className="bg-destructive hover:bg-destructive/90"
              onClick={() => setShowCloseDialog(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Cerrar Caja
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Cerrar Caja
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="finalAmount">Monto Final en Caja (Conteo)</Label>
                  <Input
                    id="finalAmount"
                    type="number"
                    step="0.01"
                    value={currentAmount}
                    onChange={(e) =>
                      setCurrentAmount(Number.parseFloat(e.target.value) || 0)
                    }
                    className="border-border/50 focus:border-primary/50"
                  />
                </div>

                <div className="p-4 bg-muted/20 rounded-lg space-y-2 border border-border/30">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Monto esperado:
                    </span>
                    <span className="font-medium text-foreground">
                      ${expectedCash.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">
                      Monto contado:
                    </span>
                    <span className="font-medium text-foreground">
                      ${currentAmount.toFixed(2)}
                    </span>
                  </div>
                  <Separator className="bg-border/30" />
                  <div className="flex justify-between font-bold text-foreground">
                    <span>Diferencia:</span>
                    <span
                      className={
                        difference >= 0 ? "text-chart-5" : "text-destructive"
                      }
                    >
                      {difference >= 0 ? "+" : ""}${difference.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={onCloseCashRegister} className="w-full">
                  Confirmar Cierre
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button
            variant="ghost"
            className="bg-background/50 border-border/50"
            onClick={onGenerateReport}
          >
            <FileText className="w-4 h-4 mr-2" />
            Generar Reporte
          </Button>
        </>
      ) : (
        <>
          <Dialog open={showOpenDialog} onOpenChange={setShowOpenDialog}>
            <Button
              onClick={() => setShowOpenDialog(true)}
              className="bg-primary hover:bg-primary/90"
            >
              <Unlock className="w-4 h-4 mr-2" />
              Abrir Caja
            </Button>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Unlock className="w-5 h-5" />
                  Apertura de Caja
                </DialogTitle>
                <DialogDescription>
                  Ingresa el monto inicial en efectivo para comenzar la jornada.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="initialAmount">Fondo de Caja (Monto Inicial)</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-muted-foreground">$</span>
                    <Input
                      id="initialAmount"
                      type="number"
                      step="0.01"
                      min="0"
                      value={openAmount}
                      onChange={(e) =>
                        setOpenAmount(Number.parseFloat(e.target.value) || 0)
                      }
                      className="pl-7 border-border/50 focus:border-primary/50"
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={handleOpenClick} className="w-full">
                  Iniciar Jornada
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
