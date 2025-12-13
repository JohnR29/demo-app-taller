-- ============================================================================
-- Migration: 002 - Create Users and Permissions
-- Description: Sistema de usuarios con roles y permisos por sucursal
-- Author: Backend Architect
-- Date: 2025-12-13
-- ============================================================================

-- ============================================================================
-- 1. CREATE ENUM TYPES
-- ============================================================================

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'manager',
    'mechanic',
    'receptionist',
    'viewer'
);

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Users (extends auth.users)
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role NOT NULL DEFAULT 'viewer',
    default_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- User Branch Permissions (relación N:N entre users y branches)
CREATE TABLE IF NOT EXISTS public.user_branch_permissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    can_transfer_stock BOOLEAN DEFAULT false,
    can_view_reports BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT user_branch_permissions_unique UNIQUE (user_id, branch_id)
);

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_users_organization ON public.users(organization_id);
CREATE INDEX idx_users_role ON public.users(role);
CREATE INDEX idx_users_is_active ON public.users(is_active) WHERE is_active = true;
CREATE INDEX idx_users_email ON public.users(email);

CREATE INDEX idx_user_branch_permissions_user ON public.user_branch_permissions(user_id);
CREATE INDEX idx_user_branch_permissions_branch ON public.user_branch_permissions(branch_id);

-- ============================================================================
-- 4. CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_branch_permissions ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Users Policies
-- Users can view other users in their organization
CREATE POLICY "Users can view users in their organization"
    ON public.users
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid()
        )
    );

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
    ON public.users
    FOR UPDATE
    USING (id = auth.uid())
    WITH CHECK (id = auth.uid());

-- Admins can insert new users
CREATE POLICY "Admins can create users"
    ON public.users
    FOR INSERT
    WITH CHECK (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Admins can update any user in their organization
CREATE POLICY "Admins can update users in organization"
    ON public.users
    FOR UPDATE
    USING (
        organization_id IN (
            SELECT organization_id 
            FROM public.users 
            WHERE id = auth.uid() 
            AND role = 'admin'
        )
    );

-- User Branch Permissions Policies
-- Users can view permissions in their organization
CREATE POLICY "Users can view branch permissions in org"
    ON public.user_branch_permissions
    FOR SELECT
    USING (
        user_id IN (
            SELECT id 
            FROM public.users 
            WHERE organization_id IN (
                SELECT organization_id 
                FROM public.users 
                WHERE id = auth.uid()
            )
        )
    );

-- Admins can manage permissions
CREATE POLICY "Admins can manage branch permissions"
    ON public.user_branch_permissions
    FOR ALL
    USING (
        user_id IN (
            SELECT id 
            FROM public.users 
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

-- Function to create user profile automatically when auth user is created
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- This will be called after signup
    -- The organization_id and other details should be set via the application
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users (if we want automatic profile creation)
-- Note: This requires additional setup in Supabase Auth hooks

-- Function to check if user has access to a branch
CREATE OR REPLACE FUNCTION public.user_has_branch_access(
    p_user_id UUID,
    p_branch_id UUID
)
RETURNS BOOLEAN AS $$
DECLARE
    v_is_admin BOOLEAN;
    v_has_access BOOLEAN;
BEGIN
    -- Check if user is admin (has access to all branches)
    SELECT role = 'admin' INTO v_is_admin
    FROM public.users
    WHERE id = p_user_id;
    
    IF v_is_admin THEN
        RETURN true;
    END IF;
    
    -- Check if user has explicit permission to the branch
    SELECT EXISTS (
        SELECT 1
        FROM public.user_branch_permissions
        WHERE user_id = p_user_id
        AND branch_id = p_branch_id
    ) INTO v_has_access;
    
    RETURN v_has_access;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible branches
CREATE OR REPLACE FUNCTION public.get_user_branches(p_user_id UUID)
RETURNS TABLE (
    branch_id UUID,
    branch_name TEXT,
    branch_code TEXT,
    is_default BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.code,
        (b.id = u.default_branch_id) as is_default
    FROM public.branches b
    INNER JOIN public.user_branch_permissions ubp ON b.id = ubp.branch_id
    INNER JOIN public.users u ON ubp.user_id = u.id
    WHERE u.id = p_user_id
    AND b.is_active = true
    ORDER BY is_default DESC, b.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.users IS 'Usuarios del sistema - extiende auth.users con datos del negocio';
COMMENT ON TABLE public.user_branch_permissions IS 'Permisos granulares de usuarios por sucursal';

COMMENT ON TYPE public.user_role IS 'Roles: admin (todo), manager (sucursal), mechanic (OT), receptionist (citas/clientes), viewer (solo lectura)';
COMMENT ON COLUMN public.users.role IS 'Rol principal del usuario en el sistema';
COMMENT ON COLUMN public.users.default_branch_id IS 'Sucursal por defecto al iniciar sesión';
