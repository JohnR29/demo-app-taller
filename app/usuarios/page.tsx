import { AppLayout } from "@/components/layout/app-layout"
import { UsersTable } from "@/components/users/users-table"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function UsuariosPage() {
  return (
    <AppLayout>
      <div className="mx-auto max-w-6xl space-y-4 p-4 md:p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-foreground">Gestión de Usuarios</h1>
            <p className="text-sm text-muted-foreground">Administra roles y permisos del equipo</p>
          </div>
          <Button size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Nuevo Usuario</span>
          </Button>
        </div>

        <UsersTable />
      </div>
    </AppLayout>
  )
}
