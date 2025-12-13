import Link from "next/link"
import { Car, Users, ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center overflow-x-hidden bg-background px-4">
      <div className="mx-auto w-full max-w-md space-y-12">
        {/* Logo */}
        <div className="text-center space-y-2">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary">
            <Car className="h-8 w-8 text-primary-foreground" />
          </div>
          <h1 className="text-3xl font-bold">TallerMS</h1>
          <p className="text-muted-foreground">Sistema de Gestión de Taller</p>
          <p className="text-xs text-muted-foreground pt-2">Selecciona tu tipo de acceso</p>
        </div>

        {/* Main Options */}
        <div className="space-y-4">
          {/* Portal de Clientes */}
          <Link
            href="/portal"
            className="flex items-center gap-4 rounded-xl border-2 border-blue-500/30 bg-blue-500/5 p-5 transition-all hover:bg-blue-500/10 hover:border-blue-500/50 active:scale-95"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-500/20">
              <Users className="h-7 w-7 text-blue-500" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">Portal de Clientes</p>
              <p className="text-sm text-muted-foreground">Acceso como invitado o registrado</p>
              <p className="text-xs text-blue-600 pt-1">Incluye demo de funcionalidades</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>

          {/* Acceso Taller */}
          <Link
            href="/login"
            className="flex items-center gap-4 rounded-xl border-2 border-primary/30 bg-primary/5 p-5 transition-all hover:bg-primary/10 hover:border-primary/50 active:scale-95"
          >
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-primary/20">
              <Car className="h-7 w-7 text-primary" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-semibold text-foreground">Acceso Taller</p>
              <p className="text-sm text-muted-foreground">Solo para personal autorizado</p>
              <p className="text-xs text-primary pt-1">Requiere login con credenciales</p>
            </div>
            <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
          </Link>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground border-t border-border pt-8">
          <p>© 2024 TallerMS. Todos los derechos reservados.</p>
        </div>
      </div>
    </div>
  )
}
