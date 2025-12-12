"use client"

import type React from "react"

import { Sidebar } from "./sidebar"
import { BottomNav } from "./bottom-nav"

export function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full max-w-full overflow-x-hidden bg-background">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-x-hidden pb-20 md:pb-0">{children}</main>
      <BottomNav />
    </div>
  )
}
