-- ============================================================================
-- Migration: 003 - Create Clients and Vehicles
-- Description: Sistema de gestión de clientes y sus vehículos
-- Author: Backend Architect
-- Date: 2025-12-13
-- ============================================================================

-- ============================================================================
-- 1. CREATE ENUM TYPES
-- ============================================================================

CREATE TYPE public.client_type AS ENUM (
    'individual',
    'business'
);

CREATE TYPE public.transmission_type AS ENUM (
    'manual',
    'automatic'
);

CREATE TYPE public.fuel_type AS ENUM (
    'gasoline',
    'diesel',
    'electric',
    'hybrid'
);

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Clients (Clientes)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    type public.client_type NOT NULL DEFAULT 'individual',
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    secondary_phone TEXT,
    address TEXT,
    city TEXT,
    rut TEXT,
    business_name TEXT,
    tax_id TEXT,
    notes TEXT,
    preferred_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT clients_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$'),
    CONSTRAINT clients_business_requires_name CHECK (
        (type = 'business' AND business_name IS NOT NULL) OR 
        (type = 'individual')
    )
);

-- Vehicles (Vehículos)
CREATE TABLE IF NOT EXISTS public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    license_plate TEXT NOT NULL,
    brand TEXT NOT NULL,
    model TEXT NOT NULL,
    year INTEGER NOT NULL,
    color TEXT,
    vin TEXT,
    engine_number TEXT,
    transmission public.transmission_type,
    fuel_type public.fuel_type,
    mileage INTEGER,
    last_service_date DATE,
    next_service_date DATE,
    notes TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    -- License plate should be unique per organization, not globally
    -- We use a partial unique index below instead of a table constraint
    CONSTRAINT vehicles_year_check CHECK (year >= 1900 AND year <= EXTRACT(YEAR FROM CURRENT_DATE) + 1),
    CONSTRAINT vehicles_mileage_check CHECK (mileage >= 0)
);

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

-- Clients indexes
CREATE INDEX idx_clients_organization ON public.clients(organization_id);
CREATE INDEX idx_clients_email ON public.clients(email);
CREATE INDEX idx_clients_phone ON public.clients(phone);
CREATE INDEX idx_clients_rut ON public.clients(rut) WHERE rut IS NOT NULL;
CREATE INDEX idx_clients_is_active ON public.clients(is_active) WHERE is_active = true;
CREATE INDEX idx_clients_preferred_branch ON public.clients(preferred_branch_id) WHERE preferred_branch_id IS NOT NULL;
CREATE INDEX idx_clients_full_name ON public.clients(first_name, last_name);

-- Vehicles indexes
CREATE INDEX idx_vehicles_client ON public.vehicles(client_id);
CREATE INDEX idx_vehicles_license_plate ON public.vehicles(license_plate);
CREATE INDEX idx_vehicles_brand_model ON public.vehicles(brand, model);
CREATE INDEX idx_vehicles_is_active ON public.vehicles(is_active) WHERE is_active = true;
CREATE INDEX idx_vehicles_next_service ON public.vehicles(next_service_date) WHERE next_service_date IS NOT NULL;

-- Unique constraint for license plate per organization (not globally)
-- This ensures the same license plate can exist in different organizations
CREATE UNIQUE INDEX idx_vehicles_license_plate_per_org ON public.vehicles(license_plate, (
    SELECT organization_id 
    FROM public.clients 
    WHERE clients.id = vehicles.client_id
)) WHERE is_active = true;

-- ============================================================================
-- 4. CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_vehicles_updated_at
    BEFORE UPDATE ON public.vehicles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Clients Policies
-- Users can view clients in their organization
CREATE POLICY "Users can view clients in their organization"
    ON public.clients
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid()
        )
    );

-- Admins, managers, and receptionists can create clients
CREATE POLICY "Staff can create clients"
    ON public.clients
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager', 'receptionist')
        )
    );

-- Admins, managers, and receptionists can update clients
CREATE POLICY "Staff can update clients"
    ON public.clients
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager', 'receptionist')
        )
    );

-- Only admins can delete clients
CREATE POLICY "Admins can delete clients"
    ON public.clients
    FOR DELETE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Vehicles Policies
-- Users can view vehicles of clients in their organization
CREATE POLICY "Users can view vehicles in their organization"
    ON public.vehicles
    FOR SELECT
    USING (
        client_id IN (
            SELECT id 
            FROM public.clients 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM public.users 
                WHERE id = auth.uid()
            )
        )
    );

-- Staff can create vehicles
CREATE POLICY "Staff can create vehicles"
    ON public.vehicles
    FOR INSERT
    WITH CHECK (
        client_id IN (
            SELECT id 
            FROM public.clients 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM public.users 
                WHERE id = auth.uid() 
                AND role IN ('admin', 'manager', 'receptionist', 'mechanic')
            )
        )
    );

-- Staff can update vehicles
CREATE POLICY "Staff can update vehicles"
    ON public.vehicles
    FOR UPDATE
    USING (
        client_id IN (
            SELECT id 
            FROM public.clients 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM public.users 
                WHERE id = auth.uid() 
                AND role IN ('admin', 'manager', 'receptionist', 'mechanic')
            )
        )
    );

-- Only admins can delete vehicles
CREATE POLICY "Admins can delete vehicles"
    ON public.vehicles
    FOR DELETE
    USING (
        client_id IN (
            SELECT id 
            FROM public.clients 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM public.users 
                WHERE id = auth.uid() 
                AND role = 'admin'
            )
        )
    );

-- ============================================================================
-- 7. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to search clients
CREATE OR REPLACE FUNCTION public.search_clients(
    p_search_term TEXT,
    p_organization_id UUID
)
RETURNS TABLE (
    id UUID,
    full_name TEXT,
    email TEXT,
    phone TEXT,
    rut TEXT,
    vehicles_count BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        c.id,
        CONCAT(c.first_name, ' ', c.last_name) as full_name,
        c.email,
        c.phone,
        c.rut,
        COUNT(v.id) as vehicles_count
    FROM public.clients c
    LEFT JOIN public.vehicles v ON c.id = v.client_id AND v.is_active = true
    WHERE c.organization_id = p_organization_id
    AND c.is_active = true
    AND (
        LOWER(c.first_name) LIKE LOWER('%' || p_search_term || '%') OR
        LOWER(c.last_name) LIKE LOWER('%' || p_search_term || '%') OR
        LOWER(c.email) LIKE LOWER('%' || p_search_term || '%') OR
        c.phone LIKE '%' || p_search_term || '%' OR
        c.rut LIKE '%' || p_search_term || '%'
    )
    GROUP BY c.id
    ORDER BY c.last_name, c.first_name
    LIMIT 50;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get client with vehicles
CREATE OR REPLACE FUNCTION public.get_client_details(p_client_id UUID)
RETURNS JSON AS $$
DECLARE
    v_result JSON;
BEGIN
    SELECT json_build_object(
        'client', row_to_json(c.*),
        'vehicles', (
            SELECT json_agg(row_to_json(v.*))
            FROM public.vehicles v
            WHERE v.client_id = c.id
            AND v.is_active = true
        )
    ) INTO v_result
    FROM public.clients c
    WHERE c.id = p_client_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get vehicles due for service
CREATE OR REPLACE FUNCTION public.get_vehicles_due_for_service(
    p_organization_id UUID,
    p_days_ahead INTEGER DEFAULT 30
)
RETURNS TABLE (
    vehicle_id UUID,
    license_plate TEXT,
    brand TEXT,
    model TEXT,
    client_name TEXT,
    client_phone TEXT,
    next_service_date DATE,
    days_until_service INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        v.id,
        v.license_plate,
        v.brand,
        v.model,
        CONCAT(c.first_name, ' ', c.last_name) as client_name,
        c.phone,
        v.next_service_date,
        (v.next_service_date - CURRENT_DATE)::INTEGER as days_until_service
    FROM public.vehicles v
    INNER JOIN public.clients c ON v.client_id = c.id
    WHERE c.organization_id = p_organization_id
    AND v.is_active = true
    AND v.next_service_date IS NOT NULL
    AND v.next_service_date <= (CURRENT_DATE + p_days_ahead)
    AND v.next_service_date >= CURRENT_DATE
    ORDER BY v.next_service_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.clients IS 'Clientes del taller - pueden ser individuales o empresas';
COMMENT ON TABLE public.vehicles IS 'Vehículos de los clientes - uno o más por cliente';

COMMENT ON TYPE public.client_type IS 'Tipo de cliente: individual (persona) o business (empresa)';
COMMENT ON TYPE public.transmission_type IS 'Tipo de transmisión del vehículo';
COMMENT ON TYPE public.fuel_type IS 'Tipo de combustible del vehículo';

COMMENT ON COLUMN public.clients.rut IS 'RUT del cliente (opcional para extranjeros)';
COMMENT ON COLUMN public.clients.preferred_branch_id IS 'Sucursal preferida del cliente';
COMMENT ON COLUMN public.vehicles.license_plate IS 'Patente única del vehículo';
COMMENT ON COLUMN public.vehicles.vin IS 'Número VIN (Vehicle Identification Number)';
COMMENT ON COLUMN public.vehicles.next_service_date IS 'Fecha estimada del próximo servicio - útil para marketing';
