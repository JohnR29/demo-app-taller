"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { Home, Calendar, ClipboardList, Package, MoreHorizontal, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Sidebar } from "./sidebar"

const mainNavItems = [
  { href: "/dashboard", icon: Home, label: "Inicio" },
  { href: "/citas", icon: Calendar, label: "Citas" },
  { href: "/ordenes", icon: ClipboardList, label: "OT" },
  { href: "/inventario", icon: Package, label: "Inventario" },
]

export function BottomNav() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card md:hidden">
        <div className="flex h-16 items-center justify-around">
          {mainNavItems.map((item) => {
            const isActive = pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors active:scale-95",
                  isActive ? "text-primary" : "text-muted-foreground hover:text-foreground",
                )}
              >
                <item.icon className={cn("h-5 w-5", isActive && "stroke-[2.5]")} />
                <span className="font-medium">{item.label}</span>
              </Link>
            )
          })}
          <Button
            variant="ghost"
            onClick={() => setMenuOpen(true)}
            className={cn(
              "flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-1 rounded-lg px-3 py-2 text-xs transition-colors active:scale-95",
              "text-muted-foreground hover:text-foreground",
            )}
          >
            <MoreHorizontal className="h-5 w-5" />
            <span className="font-medium">Más</span>
          </Button>
        </div>
      </nav>

      <Sheet open={menuOpen} onOpenChange={setMenuOpen}>
        <SheetContent side="left" className="w-[280px] p-0">
          <SheetHeader className="border-b border-border p-4">
            <SheetTitle className="flex items-center justify-between">
              <span>Menú Completo</span>
              <Button variant="ghost" size="icon" onClick={() => setMenuOpen(false)} className="h-8 w-8">
                <X className="h-4 w-4" />
              </Button>
            </SheetTitle>
          </SheetHeader>
          <div className="h-[calc(100vh-80px)] overflow-y-auto">
            <Sidebar mobile onNavigate={() => setMenuOpen(false)} />
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}
