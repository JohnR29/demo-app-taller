"use client"

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { Branch } from "@/lib/types/branch"

interface BranchContextType {
  selectedBranchId: string | "all"
  setSelectedBranchId: (branchId: string | "all") => void
  availableBranches: Branch[]
  currentBranch: Branch | null
  isGlobalView: boolean
}

const BranchContext = createContext<BranchContextType | undefined>(undefined)

// Mock de sucursales - esto vendría de la API
const mockBranches: Branch[] = [
  {
    id: "branch-1",
    organizationId: "org-1",
    name: "Sucursal Centro",
    code: "SUC-001",
    address: "Av. Libertador Bernardo O'Higgins 1234",
    city: "Santiago Centro",
    phone: "+56221234567",
    email: "centro@tallerms.cl",
    coordinates: { lat: -33.4489, lng: -70.6693 },
    isActive: true,
    isMain: true,
    manager: "Carlos Rodríguez",
    createdAt: new Date("2024-01-15"),
  },
  {
    id: "branch-2",
    organizationId: "org-1",
    name: "Sucursal Providencia",
    code: "SUC-002",
    address: "Av. Providencia 2567",
    city: "Providencia",
    phone: "+56229876543",
    email: "providencia@tallerms.cl",
    coordinates: { lat: -33.4255, lng: -70.6110 },
    isActive: true,
    isMain: false,
    manager: "María González",
    createdAt: new Date("2024-03-20"),
  },
  {
    id: "branch-3",
    organizationId: "org-1",
    name: "Sucursal Las Condes",
    code: "SUC-003",
    address: "Av. Apoquindo 3456",
    city: "Las Condes",
    phone: "+56225554433",
    email: "lascondes@tallerms.cl",
    coordinates: { lat: -33.4151, lng: -70.5811 },
    isActive: true,
    isMain: false,
    manager: "Pedro Muñoz",
    createdAt: new Date("2024-06-10"),
  },
]

export function BranchProvider({ children }: { children: ReactNode }) {
  const [selectedBranchId, setSelectedBranchIdState] = useState<string | "all">("all")
  const [availableBranches] = useState<Branch[]>(mockBranches)

  // Cargar selección desde localStorage
  useEffect(() => {
    const saved = localStorage.getItem("selectedBranchId")
    if (saved) {
      setSelectedBranchIdState(saved)
    }
  }, [])

  // Guardar selección en localStorage
  const setSelectedBranchId = (branchId: string | "all") => {
    setSelectedBranchIdState(branchId)
    localStorage.setItem("selectedBranchId", branchId)
  }

  const currentBranch = selectedBranchId === "all" 
    ? null 
    : availableBranches.find((b) => b.id === selectedBranchId) || null

  const isGlobalView = selectedBranchId === "all"

  return (
    <BranchContext.Provider
      value={{
        selectedBranchId,
        setSelectedBranchId,
        availableBranches,
        currentBranch,
        isGlobalView,
      }}
    >
      {children}
    </BranchContext.Provider>
  )
}

export function useBranch() {
  const context = useContext(BranchContext)
  if (context === undefined) {
    throw new Error("useBranch must be used within a BranchProvider")
  }
  return context
}
