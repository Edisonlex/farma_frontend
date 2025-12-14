import type { UserRole } from "@/lib/auth"

export interface Notification {
  id: string
  type: "info" | "warning" | "error" | "success"
  title: string
  message: string
  timestamp: Date
  read: boolean
  userId?: string
  roles?: UserRole[]
  priority?: "low" | "medium" | "high"
  category?: "stock" | "expiry" | "sales" | "system" | "security"
  dedupKey?: string
  ttlMs?: number
  expiresAt?: Date
  count?: number
}

class NotificationService {
  private notifications: Notification[] = []
  private listeners: ((notifications: Notification[]) => void)[] = []

  addNotification(notification: Omit<Notification, "id" | "timestamp" | "read" | "count" | "expiresAt">) {
    const now = new Date()
    const ttl = notification.ttlMs ?? (notification.type === "info" ? 5 * 60 * 1000 : undefined)

    if (notification.dedupKey) {
      const existing = this.notifications.find((n) => n.dedupKey === notification.dedupKey && (!n.expiresAt || n.expiresAt > now))
      if (existing) {
        existing.count = (existing.count || 1) + 1
        existing.timestamp = now
        if (existing.type === "info") existing.type = "warning"
        if (existing.type === "warning" && (existing.count || 0) >= 3) existing.type = "error"
        this.notifyListeners()
        return
      }
    }

    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: now,
      read: false,
      count: 1,
      expiresAt: ttl ? new Date(now.getTime() + ttl) : undefined,
    }

    this.notifications.unshift(newNotification)
    this.notifyListeners()

    if (ttl) {
      setTimeout(() => this.removeNotification(newNotification.id), ttl)
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

  getNotifications(userId?: string, role?: UserRole) {
    return this.notifications.filter((n) => {
      const userOk = !userId || !n.userId || n.userId === userId
      const roleOk = !role || !n.roles || n.roles.includes(role)
      return userOk && roleOk
    })
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
    roles: ["farmaceutico", "tecnico", "administrador"],
    priority: "high",
    category: "stock",
    dedupKey: `stock:${medicationName}`,
    ttlMs: 10 * 60 * 1000,
  })
}

export const notifyExpiringSoon = (medicationName: string, daysUntilExpiry: number) => {
  notificationService.addNotification({
    type: "warning",
    title: "Próximo a Vencer",
    message: `${medicationName} vence en ${daysUntilExpiry} días`,
    roles: ["farmaceutico", "tecnico", "administrador"],
    priority: daysUntilExpiry <= 7 ? "high" : "medium",
    category: "expiry",
    dedupKey: `expiry:${medicationName}`,
    ttlMs: 12 * 60 * 60 * 1000,
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
    roles: ["administrador"],
    priority: "low",
    category: "sales",
    dedupKey: `adjust:${medicationName}:${type}`,
    ttlMs: 5 * 60 * 1000,
  })
}
