export interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId?: string
}

class NotificationService {
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  addNotification(notification: Omit<Notification, "id" | "timestamp" | "read">) {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()

    // Auto-remove after 5 minutes for info notifications
    if (notification.type === "info") {
      setTimeout(
        () => {
          this.removeNotification(newNotification.id)
        },
        5 * 60 * 1000,
      )
    }
  }

  markAsRead(id: string) {
    const notification = this.notifications.find((n) => n.id === id)
    if (notification) {
      notification.read = true
      this.notifyListeners()
    }
  }

  removeNotification(id: string) {
    this.notifications = this.notifications.filter((n) => n.id !== id)
    this.notifyListeners()
  }

  getNotifications(userId?: string) {
    return this.notifications.filter((n) => !userId || !n.userId || n.userId === userId)
  }

  subscribe(listener: (notifications: Notification[]) => void) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener(this.notifications))
  }
}

export const notificationService = new NotificationService()

// Helper functions for common notifications
export const notifyStockLow = (medicationName: string, currentStock: number) => {
  notificationService.addNotification({
    type: "warning",
    title: "Stock Bajo",
    message: `${medicationName} tiene solo ${currentStock} unidades disponibles`,
  })
}

export const notifyExpiringSoon = (medicationName: string, daysUntilExpiry: number) => {
  notificationService.addNotification({
    type: "warning",
    title: "Próximo a Vencer",
    message: `${medicationName} vence en ${daysUntilExpiry} días`,
  })
}

export const notifyInventoryAdjustment = (
  medicationName: string,
  adjustment: number,
  type: "increase" | "decrease",
) => {
  notificationService.addNotification({
    type: "info",
    title: "Ajuste de Inventario",
    message: `${medicationName}: ${type === "increase" ? "+" : "-"}${Math.abs(adjustment)} unidades`,
  })
}
