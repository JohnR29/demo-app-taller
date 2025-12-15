-- ============================================================================
-- Migration: 001 - Create Organizations and Branches
-- Description: Tablas base para sistema multi-sucursal
-- Author: Backend Architect
-- Date: 2025-12-13
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Organizations (Talleres/Empresas)
CREATE TABLE IF NOT EXISTS public.organizations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    rut TEXT UNIQUE NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT,
    logo_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT organizations_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT organizations_rut_format CHECK (rut ~* '^\d{7,8}-[\dkK]$' OR rut ~* '^\d{1,2}\.\d{3}\.\d{3}-[\dkK]$')
);

-- Branches (Sucursales)
CREATE TABLE IF NOT EXISTS public.branches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    is_active BOOLEAN DEFAULT true,
    is_main BOOLEAN DEFAULT false,
    manager_name TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT branches_code_org_unique UNIQUE (organization_id, code),
    CONSTRAINT branches_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_branches_organization ON public.branches(organization_id);
CREATE INDEX idx_branches_is_active ON public.branches(is_active) WHERE is_active = true;
CREATE INDEX idx_branches_coordinates ON public.branches(latitude, longitude) WHERE latitude IS NOT NULL AND longitude IS NOT NULL;

-- ============================================================================
-- 3. CREATE TRIGGERS FOR UPDATED_AT
-- ============================================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_branches_updated_at
    BEFORE UPDATE ON public.branches
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.branches ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. CREATE RLS POLICIES
-- ============================================================================

-- Organizations Policies
-- Users can only see their own organization
CREATE POLICY "Users can view their own organization"
    ON public.organizations
    FOR SELECT
    USING (
        id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid()
        )
    );

-- Only admins can update organization
CREATE POLICY "Admins can update organization"
    ON public.organizations
    FOR UPDATE
    USING (
        id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Branches Policies
-- Users can view branches of their organization
CREATE POLICY "Users can view branches of their organization"
    ON public.branches
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid()
        )
    );

-- Admins and managers can insert branches
CREATE POLICY "Admins and managers can create branches"
    ON public.branches
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager')
        )
    );

-- Admins can update branches
CREATE POLICY "Admins can update branches"
    ON public.branches
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- ============================================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.organizations IS 'Tabla de organizaciones/talleres - nivel superior del sistema multi-tenant';
COMMENT ON TABLE public.branches IS 'Sucursales de cada organización - permite operación distribuida';

COMMENT ON COLUMN public.organizations.rut IS 'RUT formato chileno: XX.XXX.XXX-X';
COMMENT ON COLUMN public.branches.code IS 'Código corto de sucursal, ej: SUC-001';
COMMENT ON COLUMN public.branches.is_main IS 'Indica si es la sucursal principal/matriz';
