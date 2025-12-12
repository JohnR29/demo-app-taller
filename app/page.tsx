import Link from "next/link"
import { Car, Users, ArrowRight, Map } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background px-4">
      <div className="mx-auto w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold">TallerMS</h1>
          <p className="mt-1 text-muted-foreground">Sistema de Gestión de Taller</p>
        </div>

        {/* Options */}
        <div className="space-y-3">
          <Link
            href="/marketplace"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
              <Map className="h-6 w-6 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Buscar Talleres</p>
              <p className="text-sm text-muted-foreground">Encuentra talleres cerca de ti</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>

          <Link
            href="/portal"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-accent/20">
              <Users className="h-6 w-6 text-accent" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Portal de Clientes</p>
              <p className="text-sm text-muted-foreground">Consulta repuestos y agenda citas</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>

          <Link
            href="/login"
            className="flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-colors hover:bg-secondary"
          >
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <Car className="h-6 w-6 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Acceso Taller</p>
              <p className="text-sm text-muted-foreground">Personal autorizado del taller</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        </div>
      </div>
    </div>
  )
}
