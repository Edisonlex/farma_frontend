"use client"

import { useState, useEffect, createContext, useContext, type ReactNode } from "react"
import { z } from "zod"
import { type User, signIn, signOut, getCurrentUser, requestPasswordReset, verifyResetCode as verifyResetCodeLib, resetPassword as resetPasswordLib } from "@/lib/auth"

const esErrorMap: z.ZodErrorMap = (issue, ctx) => {
  if (issue.message) return { message: issue.message }
  switch (issue.code) {
    case z.ZodIssueCode.invalid_type:
      if (issue.received === "undefined") return { message: "Campo obligatorio" }
      return { message: "Tipo de dato inválido" }
    case z.ZodIssueCode.invalid_string:
      switch (issue.validation) {
        case "email":
          return { message: "Correo electrónico inválido" }
        case "url":
          return { message: "URL inválida" }
        case "uuid":
          return { message: "UUID inválido" }
        case "cuid":
          return { message: "ID inválido" }
        case "regex":
          return { message: "Formato inválido" }
        default:
          return { message: "Cadena inválida" }
      }
    case z.ZodIssueCode.not_finite:
      return { message: "Debe ser un número finito" }
    case z.ZodIssueCode.not_multiple_of:
      return { message: `Debe ser múltiplo de ${issue.multipleOf}` }
    case z.ZodIssueCode.too_small:
      if (issue.type === "string") {
        return {
          message: issue.exact
            ? `Debe tener exactamente ${issue.minimum} caracteres`
            : issue.inclusive
            ? `Debe tener al menos ${issue.minimum} caracteres`
            : `Debe tener más de ${issue.minimum} caracteres`,
        }
      }
      if (issue.type === "number") {
        return {
          message: issue.exact
            ? `Debe ser exactamente ${issue.minimum}`
            : issue.inclusive
            ? `Debe ser mayor o igual a ${issue.minimum}`
            : `Debe ser mayor a ${issue.minimum}`,
        }
      }
      if (issue.type === "array") {
        return {
          message: issue.exact
            ? `Debe contener exactamente ${issue.minimum} elementos`
            : issue.inclusive
            ? `Debe contener al menos ${issue.minimum} elementos`
            : `Debe contener más de ${issue.minimum} elementos`,
        }
      }
      if (issue.type === "date") return { message: "Fecha demasiado temprana" }
      return { message: "Valor demasiado pequeño" }
    case z.ZodIssueCode.too_big:
      if (issue.type === "string") {
        return {
          message: issue.exact
            ? `Debe tener exactamente ${issue.maximum} caracteres`
            : issue.inclusive
            ? `Debe tener como máximo ${issue.maximum} caracteres`
            : `Debe tener menos de ${issue.maximum} caracteres`,
        }
      }
      if (issue.type === "number") {
        return {
          message: issue.exact
            ? `Debe ser exactamente ${issue.maximum}`
            : issue.inclusive
            ? `Debe ser menor o igual a ${issue.maximum}`
            : `Debe ser menor a ${issue.maximum}`,
        }
      }
      if (issue.type === "array") {
        return {
          message: issue.exact
            ? `Debe contener exactamente ${issue.maximum} elementos`
            : issue.inclusive
            ? `Debe contener como máximo ${issue.maximum} elementos`
            : `Debe contener menos de ${issue.maximum} elementos`,
        }
      }
      if (issue.type === "date") return { message: "Fecha demasiado tardía" }
      return { message: "Valor demasiado grande" }
    case z.ZodIssueCode.invalid_enum_value:
      return { message: "Valor inválido" }
    case z.ZodIssueCode.unrecognized_keys:
      return { message: "Campos no reconocidos" }
    case z.ZodIssueCode.invalid_union:
      return { message: "Valor inválido" }
    case z.ZodIssueCode.invalid_date:
      return { message: "Fecha inválida" }
    case z.ZodIssueCode.custom:
      return { message: "Dato inválido" }
    default:
      return { message: ctx.defaultError }
  }
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
  sendResetCode: (email: string) => Promise<string | null>
  verifyResetCode: (email: string, code: string) => Promise<boolean>
  applyNewPassword: (email: string, newPassword: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    z.setErrorMap(esErrorMap)
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      const currentUser = await getCurrentUser()
      setUser(currentUser)
    } catch (error) {
      console.error("Error checking auth:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)
    try {
      const user = await signIn(email, password)
      if (user) {
        setUser(user)
        localStorage.setItem("pharmacare_user", JSON.stringify(user))
        return true
      }
      return false
    } catch (error) {
      console.error("Login error:", error)
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    setIsLoading(true)
    try {
      await signOut()
      setUser(null)
      localStorage.removeItem("pharmacare_user")
    } catch (error) {
      console.error("Logout error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev
      const updated = { ...prev, ...updates }
      try {
        localStorage.setItem("pharmacare_user", JSON.stringify(updated))
      } catch {}
      return updated
    })
  }

  const sendResetCode = async (email: string): Promise<string | null> => {
    try {
      const res = await requestPasswordReset(email)
      return res.success ? res.code ?? null : null
    } catch (error) {
      console.error("Reset code error:", error)
      return null
    }
  }

  const verifyResetCode = async (email: string, code: string): Promise<boolean> => {
    try {
      return await verifyResetCodeLib(email, code)
    } catch (error) {
      console.error("Verify code error:", error)
      return false
    }
  }

  const applyNewPassword = async (email: string, newPassword: string): Promise<boolean> => {
    try {
      return await resetPasswordLib(email, newPassword)
    } catch (error) {
      console.error("Reset password error:", error)
      return false
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        sendResetCode,
        verifyResetCode,
        applyNewPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
