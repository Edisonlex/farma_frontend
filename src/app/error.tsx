"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"
import { RefreshCw } from "lucide-react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter()

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-border">
        <CardHeader>
          <CardTitle className="text-xl">Ha ocurrido un error</CardTitle>
          <CardDescription className="text-muted-foreground">{error.message || "Error inesperado"}</CardDescription>
        </CardHeader>
        <CardContent className="flex gap-3">
          <Button onClick={() => reset()} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Reintentar
          </Button>
          <Button variant="ghost" onClick={() => router.push("/")}>Ir al inicio</Button>
        </CardContent>
      </Card>
    </div>
  )
}