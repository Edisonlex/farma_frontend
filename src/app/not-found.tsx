"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { useRouter } from "next/navigation"

export default function NotFound() {
  const router = useRouter()
  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <Card className="max-w-md w-full border-border">
        <CardHeader>
          <CardTitle className="text-xl">Página no encontrada</CardTitle>
          <CardDescription className="text-muted-foreground">La ruta solicitada no existe</CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push("/")}>Ir al inicio</Button>
        </CardContent>
      </Card>
    </div>
  )
}