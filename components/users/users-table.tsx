"use client"

import { useState } from "react"
import { Search, MoreHorizontal, Edit, Trash2, Shield, ShieldCheck, ShieldAlert } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"

interface User {
  id: string
  nombre: string
  email: string
  rol: "admin" | "mecanico" | "recepcionista"
  estado: "activo" | "inactivo"
  ultimoAcceso: string
}

const mockUsers: User[] = [
  {
    id: "1",
    nombre: "Carlos Martínez",
    email: "carlos.m@tallerms.com",
    rol: "admin",
    estado: "activo",
    ultimoAcceso: "Hoy, 09:30",
  },
  {
    id: "2",
    nombre: "Pedro Rodríguez",
    email: "pedro.r@tallerms.com",
    rol: "mecanico",
    estado: "activo",
    ultimoAcceso: "Hoy, 08:15",
  },
  {
    id: "3",
    nombre: "María González",
    email: "maria.g@tallerms.com",
    rol: "recepcionista",
    estado: "activo",
    ultimoAcceso: "Ayer, 18:00",
  },
  {
    id: "4",
    nombre: "Luis Torres",
    email: "luis.t@tallerms.com",
    rol: "mecanico",
    estado: "activo",
    ultimoAcceso: "Hoy, 07:45",
  },
  {
    id: "5",
    nombre: "Ana Silva",
    email: "ana.s@tallerms.com",
    rol: "recepcionista",
    estado: "inactivo",
    ultimoAcceso: "Hace 2 semanas",
  },
]

const roleConfig = {
  admin: {
    label: "Administrador",
    icon: ShieldAlert,
    className: "bg-destructive/20 text-destructive border-destructive/30",
  },
  mecanico: {
    label: "Mecánico",
    icon: Shield,
    className: "bg-primary/20 text-primary border-primary/30",
  },
  recepcionista: {
    label: "Recepcionista",
    icon: ShieldCheck,
    className: "bg-accent/20 text-accent border-accent/30",
  },
}

export function UsersTable() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredUsers = mockUsers.filter(
    (user) =>
      user.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Buscar usuarios..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="bg-secondary pl-9"
        />
      </div>

      {/* Desktop Table */}
      <div className="hidden overflow-hidden rounded-lg border border-border md:block">
        <table className="w-full">
          <thead className="bg-secondary">
            <tr className="text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
              <th className="px-4 py-3">Usuario</th>
              <th className="px-4 py-3">Rol</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Último Acceso</th>
              <th className="px-4 py-3 text-right">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border bg-card">
            {filteredUsers.map((user) => {
              const RoleIcon = roleConfig[user.rol].icon
              return (
                <tr key={user.id} className="hover:bg-secondary/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-primary/20 text-sm text-primary">
                          {getInitials(user.nombre)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-foreground">{user.nombre}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <Badge variant="outline" className={cn("gap-1", roleConfig[user.rol].className)}>
                      <RoleIcon className="h-3 w-3" />
                      {roleConfig[user.rol].label}
                    </Badge>
                  </td>
                  <td className="px-4 py-3">
                    <Badge
                      variant="outline"
                      className={cn(
                        user.estado === "activo"
                          ? "border-primary/30 bg-primary/20 text-primary"
                          : "border-border bg-secondary text-muted-foreground",
                      )}
                    >
                      {user.estado === "activo" ? "Activo" : "Inactivo"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{user.ultimoAcceso}</td>
                  <td className="px-4 py-3 text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2">
                          <Edit className="h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                          <Trash2 className="h-4 w-4" />
                          Eliminar
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-2 md:hidden">
        {filteredUsers.map((user) => {
          const RoleIcon = roleConfig[user.rol].icon
          return (
            <div key={user.id} className="rounded-lg border border-border bg-card p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/20 text-primary">{getInitials(user.nombre)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{user.nombre}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="gap-2">
                      <Edit className="h-4 w-4" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="gap-2 text-destructive focus:text-destructive">
                      <Trash2 className="h-4 w-4" />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className={cn("gap-1", roleConfig[user.rol].className)}>
                  <RoleIcon className="h-3 w-3" />
                  {roleConfig[user.rol].label}
                </Badge>
                <Badge
                  variant="outline"
                  className={cn(
                    user.estado === "activo"
                      ? "border-primary/30 bg-primary/20 text-primary"
                      : "border-border bg-secondary text-muted-foreground",
                  )}
                >
                  {user.estado === "activo" ? "Activo" : "Inactivo"}
                </Badge>
                <span className="ml-auto text-xs text-muted-foreground">{user.ultimoAcceso}</span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
