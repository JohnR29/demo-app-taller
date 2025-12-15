-- ============================================================================
-- Migration: 004 - Create Work Orders
-- Description: Sistema de órdenes de trabajo con repuestos
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- 1. CREATE ENUM TYPES
-- ============================================================================

CREATE TYPE public.work_order_status AS ENUM (
    'pending',
    'in-progress',
    'completed',
    'cancelled'
);

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Work Orders (Órdenes de Trabajo)
CREATE TABLE IF NOT EXISTS public.work_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT NOT NULL,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    vehicle_id UUID NOT NULL REFERENCES public.vehicles(id) ON DELETE RESTRICT,
    service TEXT NOT NULL,
    description TEXT,
    status public.work_order_status NOT NULL DEFAULT 'pending',
    labor_cost DECIMAL(10, 2) DEFAULT 0,
    parts_cost DECIMAL(10, 2) DEFAULT 0,
    estimated_cost DECIMAL(10, 2) NOT NULL,
    final_cost DECIMAL(10, 2),
    assigned_mechanic_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    start_date DATE NOT NULL DEFAULT CURRENT_DATE,
    estimated_completion_date DATE,
    completion_date DATE,
    notes TEXT,
    created_by UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT work_orders_order_number_unique UNIQUE (order_number),
    CONSTRAINT work_orders_costs_check CHECK (estimated_cost >= 0 AND labor_cost >= 0 AND parts_cost >= 0),
    CONSTRAINT work_orders_final_cost_check CHECK (final_cost IS NULL OR final_cost >= 0),
    CONSTRAINT work_orders_completion_date_check CHECK (completion_date IS NULL OR completion_date >= start_date)
    -- Note: Mechanic role validation is handled by trigger (see validate_work_order_mechanic_role)
);

-- Work Order Parts (Repuestos de OT)
CREATE TABLE IF NOT EXISTS public.work_order_parts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    work_order_id UUID NOT NULL REFERENCES public.work_orders(id) ON DELETE CASCADE,
    inventory_item_id UUID REFERENCES public.inventory_items(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    quantity INTEGER NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    total DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT work_order_parts_quantity_check CHECK (quantity > 0),
    CONSTRAINT work_order_parts_price_check CHECK (unit_price >= 0 AND total >= 0),
    CONSTRAINT work_order_parts_total_calc_check CHECK (total = quantity * unit_price)
);

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

-- Work Orders indexes
CREATE INDEX idx_work_orders_branch ON public.work_orders(branch_id);
CREATE INDEX idx_work_orders_client ON public.work_orders(client_id);
CREATE INDEX idx_work_orders_vehicle ON public.work_orders(vehicle_id);
CREATE INDEX idx_work_orders_status ON public.work_orders(status);
CREATE INDEX idx_work_orders_branch_status ON public.work_orders(branch_id, status);
CREATE INDEX idx_work_orders_mechanic ON public.work_orders(assigned_mechanic_id) WHERE assigned_mechanic_id IS NOT NULL;
CREATE INDEX idx_work_orders_start_date ON public.work_orders(start_date DESC);
CREATE INDEX idx_work_orders_created_at ON public.work_orders(created_at DESC);
CREATE INDEX idx_work_orders_order_number ON public.work_orders(order_number);

-- Work Order Parts indexes
CREATE INDEX idx_work_order_parts_order ON public.work_order_parts(work_order_id);
CREATE INDEX idx_work_order_parts_inventory ON public.work_order_parts(inventory_item_id) WHERE inventory_item_id IS NOT NULL;

-- ============================================================================
-- 4. CREATE TRIGGERS
-- ============================================================================

-- Trigger to validate mechanic role
CREATE OR REPLACE FUNCTION public.validate_work_order_mechanic_role()
RETURNS TRIGGER AS $$
BEGIN
    -- If assigned_mechanic_id is set, validate the role
    IF NEW.assigned_mechanic_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = NEW.assigned_mechanic_id 
            AND role IN ('mechanic', 'manager', 'admin')
        ) THEN
            RAISE EXCEPTION 'Assigned mechanic must have role: mechanic, manager, or admin';
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER validate_mechanic_role_on_insert_update
    BEFORE INSERT OR UPDATE OF assigned_mechanic_id ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_work_order_mechanic_role();

CREATE TRIGGER update_work_orders_updated_at
    BEFORE UPDATE ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to automatically calculate parts_cost when parts are added/updated/deleted
CREATE OR REPLACE FUNCTION public.update_work_order_parts_cost()
RETURNS TRIGGER AS $$
BEGIN
    -- Update the parts_cost in work_orders table
    UPDATE public.work_orders
    SET parts_cost = COALESCE((
        SELECT SUM(total)
        FROM public.work_order_parts
        WHERE work_order_id = COALESCE(NEW.work_order_id, OLD.work_order_id)
    ), 0)
    WHERE id = COALESCE(NEW.work_order_id, OLD.work_order_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_parts_cost_on_insert
    AFTER INSERT ON public.work_order_parts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_work_order_parts_cost();

CREATE TRIGGER update_parts_cost_on_update
    AFTER UPDATE ON public.work_order_parts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_work_order_parts_cost();

CREATE TRIGGER update_parts_cost_on_delete
    AFTER DELETE ON public.work_order_parts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_work_order_parts_cost();

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.work_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.work_order_parts ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Work Orders Policies
-- Users can view work orders in their organization branches
CREATE POLICY "Users can view work orders in their branches"
    ON public.work_orders
    FOR SELECT
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND (
                u.role = 'admin' OR
                EXISTS (
                    SELECT 1
                    FROM public.user_branch_permissions ubp
                    WHERE ubp.user_id = u.id
                    AND ubp.branch_id = b.id
                )
            )
        )
    );

-- Admins, managers, and receptionists can create work orders
CREATE POLICY "Staff can create work orders"
    ON public.work_orders
    FOR INSERT
    WITH CHECK (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'manager', 'receptionist')
            AND (
                u.role = 'admin' OR
                EXISTS (
                    SELECT 1
                    FROM public.user_branch_permissions ubp
                    WHERE ubp.user_id = u.id
                    AND ubp.branch_id = b.id
                )
            )
        )
    );

-- Admins, managers, assigned mechanics can update work orders
CREATE POLICY "Staff and mechanics can update work orders"
    ON public.work_orders
    FOR UPDATE
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND (
                u.role = 'admin' OR
                (u.role IN ('manager', 'receptionist') AND EXISTS (
                    SELECT 1
                    FROM public.user_branch_permissions ubp
                    WHERE ubp.user_id = u.id AND ubp.branch_id = b.id
                )) OR
                (u.role = 'mechanic' AND assigned_mechanic_id = auth.uid())
            )
        )
    );

-- Only admins can delete work orders
CREATE POLICY "Admins can delete work orders"
    ON public.work_orders
    FOR DELETE
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- Work Order Parts Policies
-- Users can view parts of work orders they can see
CREATE POLICY "Users can view work order parts"
    ON public.work_order_parts
    FOR SELECT
    USING (
        work_order_id IN (
            SELECT id
            FROM public.work_orders
            WHERE branch_id IN (
                SELECT b.id
                FROM public.branches b
                INNER JOIN public.users u ON u.organization_id = b.organization_id
                WHERE u.id = auth.uid()
            )
        )
    );

-- Staff can manage parts
CREATE POLICY "Staff can manage work order parts"
    ON public.work_order_parts
    FOR ALL
    USING (
        work_order_id IN (
            SELECT id
            FROM public.work_orders
            WHERE branch_id IN (
                SELECT b.id
                FROM public.branches b
                INNER JOIN public.users u ON u.organization_id = b.organization_id
                WHERE u.id = auth.uid()
                AND u.role IN ('admin', 'manager', 'receptionist', 'mechanic')
            )
        )
    );

-- ============================================================================
-- 7. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to generate next order number
CREATE OR REPLACE FUNCTION public.generate_order_number(p_branch_id UUID)
RETURNS TEXT AS $$
DECLARE
    v_branch_code TEXT;
    v_last_number INTEGER;
    v_new_number TEXT;
BEGIN
    -- Get branch code
    SELECT code INTO v_branch_code
    FROM public.branches
    WHERE id = p_branch_id;
    
    -- Get last order number for this branch
    SELECT COALESCE(
        MAX(CAST(SPLIT_PART(order_number, '-', 2) AS INTEGER)),
        0
    ) INTO v_last_number
    FROM public.work_orders
    WHERE branch_id = p_branch_id
    AND order_number LIKE v_branch_code || '-%';
    
    -- Generate new number with padding
    v_new_number := v_branch_code || '-' || LPAD((v_last_number + 1)::TEXT, 6, '0');
    
    RETURN v_new_number;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create work order with validation
CREATE OR REPLACE FUNCTION public.create_work_order(
    p_branch_id UUID,
    p_client_id UUID,
    p_vehicle_id UUID,
    p_service TEXT,
    p_description TEXT DEFAULT NULL,
    p_estimated_cost DECIMAL DEFAULT 0,
    p_assigned_mechanic_id UUID DEFAULT NULL,
    p_estimated_completion_date DATE DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_order_id UUID;
    v_order_number TEXT;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Validate that vehicle belongs to client
    IF NOT EXISTS (
        SELECT 1
        FROM public.vehicles
        WHERE id = p_vehicle_id
        AND client_id = p_client_id
    ) THEN
        RAISE EXCEPTION 'Vehicle does not belong to the specified client';
    END IF;
    
    -- Generate order number
    v_order_number := public.generate_order_number(p_branch_id);
    
    -- Create work order
    INSERT INTO public.work_orders (
        order_number,
        branch_id,
        client_id,
        vehicle_id,
        service,
        description,
        estimated_cost,
        assigned_mechanic_id,
        estimated_completion_date,
        created_by
    ) VALUES (
        v_order_number,
        p_branch_id,
        p_client_id,
        p_vehicle_id,
        p_service,
        p_description,
        p_estimated_cost,
        p_assigned_mechanic_id,
        p_estimated_completion_date,
        v_user_id
    )
    RETURNING id INTO v_order_id;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update work order status
CREATE OR REPLACE FUNCTION public.update_work_order_status(
    p_order_id UUID,
    p_new_status public.work_order_status,
    p_completion_date DATE DEFAULT NULL,
    p_final_cost DECIMAL DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_current_status public.work_order_status;
BEGIN
    -- Get current status
    SELECT status INTO v_current_status
    FROM public.work_orders
    WHERE id = p_order_id;
    
    IF v_current_status IS NULL THEN
        RAISE EXCEPTION 'Work order not found';
    END IF;
    
    -- Update work order
    UPDATE public.work_orders
    SET 
        status = p_new_status,
        completion_date = CASE 
            WHEN p_new_status = 'completed' THEN COALESCE(p_completion_date, CURRENT_DATE)
            ELSE completion_date
        END,
        final_cost = CASE 
            WHEN p_new_status = 'completed' THEN COALESCE(p_final_cost, estimated_cost)
            ELSE final_cost
        END
    WHERE id = p_order_id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate order costs
CREATE OR REPLACE FUNCTION public.calculate_order_total(p_order_id UUID)
RETURNS DECIMAL AS $$
DECLARE
    v_labor_cost DECIMAL;
    v_parts_cost DECIMAL;
    v_total DECIMAL;
BEGIN
    SELECT labor_cost, parts_cost INTO v_labor_cost, v_parts_cost
    FROM public.work_orders
    WHERE id = p_order_id;
    
    v_total := COALESCE(v_labor_cost, 0) + COALESCE(v_parts_cost, 0);
    
    RETURN v_total;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.work_orders IS 'Órdenes de trabajo del taller - gestión completa de servicios';
COMMENT ON TABLE public.work_order_parts IS 'Repuestos utilizados en cada orden de trabajo';

COMMENT ON TYPE public.work_order_status IS 'Estados de OT: pending (pendiente), in-progress (en progreso), completed (completada), cancelled (cancelada)';

COMMENT ON COLUMN public.work_orders.order_number IS 'Número único de orden, formato: SUC-XXXXXX';
COMMENT ON COLUMN public.work_orders.labor_cost IS 'Costo de mano de obra';
COMMENT ON COLUMN public.work_orders.parts_cost IS 'Costo total de repuestos (calculado automáticamente)';
COMMENT ON COLUMN public.work_orders.estimated_cost IS 'Costo estimado inicial';
COMMENT ON COLUMN public.work_orders.final_cost IS 'Costo final real (al completar)';
COMMENT ON COLUMN public.work_order_parts.inventory_item_id IS 'Referencia al inventario (opcional, puede ser repuesto externo)';
