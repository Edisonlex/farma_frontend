import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell } from "lucide-react";
import { Alert } from "@/lib/mock-data";
import {
  AlertTriangle,
  Calendar,
  AlertCircle,
  CheckCircle,
} from "lucide-react";

interface NotificationsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  alerts: Alert[];
  unreadAlerts: Alert[];
  onMarkAllAsRead: () => void;
  onAlertClick: (alert: Alert) => void;
}

function getAlertIcon(type: string) {
  switch (type) {
    case "stock_bajo":
      return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    case "vencimiento":
      return <Calendar className="w-4 h-4 text-orange-500" />;
    case "vencido":
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    case "tarea_tecnica":
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
    default:
      return <AlertCircle className="w-4 h-4 text-blue-500" />;
  }
}

function getAlertSeverity(severity: string) {
  switch (severity) {
    case "high":
      return "Alta";
    case "medium":
      return "Media";
    case "low":
      return "Baja";
    default:
      return severity;
  }
}

export function NotificationsDialog({
  isOpen,
  setIsOpen,
  alerts,
  unreadAlerts,
  onMarkAllAsRead,
  onAlertClick,
}: NotificationsDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild></DialogTrigger>
      <DialogContent className="sm:max-w-md bg-background text-foreground border-border">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between text-foreground">
            <span>Alertas del Sistema</span>
            {unreadAlerts.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onMarkAllAsRead}
                className="h-7 text-xs"
              >
                Marcar todas como resueltas
              </Button>
            )}
          </DialogTitle>
        </DialogHeader>
        <div className="max-h-80 overflow-y-auto">
          {alerts.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No hay alertas pendientes
            </p>
          ) : (
            <div className="space-y-2">
              {alerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                    alert.resolved
                      ? "bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800 hover:bg-green-100 dark:hover:bg-green-950/50"
                      : "bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 hover:bg-blue-100 dark:hover:bg-blue-950/50"
                  }`}
                  onClick={() => !alert.resolved && onAlertClick(alert)}
                >
                  <div className="flex items-start gap-2">
                    {alert.resolved ? (
                      <CheckCircle className="w-4 h-4 text-green-500 dark:text-green-400" />
                    ) : (
                      getAlertIcon(alert.type)
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <p className="font-medium text-sm text-foreground">
                          {alert.medicationName}
                          {alert.resolved && (
                            <span className="ml-2 text-xs text-green-600 dark:text-green-400">
                              ✓ Resuelta
                            </span>
                          )}
                        </p>
                        <Badge
                          variant="ghost"
                          className={`text-xs capitalize ml-2 ${
                            alert.resolved
                              ? "bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-200 dark:border-green-800"
                              : "bg-secondary text-secondary-foreground"
                          }`}
                        >
                          {getAlertSeverity(alert.severity)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {alert.message}
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(alert.date).toLocaleString()}
                      </p>
                    </div>
                    {!alert.resolved && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-1" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
