-- ============================================================================
-- Migration: 009 - Create Dashboard Functions
-- Description: Funciones para cálculo de KPIs y métricas del dashboard
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- DASHBOARD KPI FUNCTIONS
-- ============================================================================

-- Function to get dashboard KPIs
CREATE OR REPLACE FUNCTION public.get_dashboard_kpis(
    p_branch_id UUID DEFAULT NULL,
    p_date_from DATE DEFAULT CURRENT_DATE,
    p_date_to DATE DEFAULT CURRENT_DATE
)
RETURNS JSONB AS $$
DECLARE
    v_kpis JSONB;
    v_org_id UUID;
    v_is_admin BOOLEAN;
BEGIN
    -- Get user organization and role
    SELECT organization_id, role = 'admin' INTO v_org_id, v_is_admin
    FROM public.users
    WHERE id = auth.uid();
    
    -- Calculate KPIs
    SELECT jsonb_build_object(
        'active_orders', (
            SELECT COUNT(*)
            FROM public.work_orders wo
            INNER JOIN public.branches b ON wo.branch_id = b.id
            WHERE b.organization_id = v_org_id
            AND wo.status = 'in-progress'
            AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
        ),
        'today_appointments', (
            SELECT COUNT(*)
            FROM public.appointments a
            INNER JOIN public.branches b ON a.branch_id = b.id
            WHERE b.organization_id = v_org_id
            AND a.date = CURRENT_DATE
            AND a.status IN ('pending', 'confirmed')
            AND (p_branch_id IS NULL OR a.branch_id = p_branch_id)
        ),
        'low_stock_items', (
            SELECT COUNT(*)
            FROM public.inventory_items i
            INNER JOIN public.branches b ON i.branch_id = b.id
            WHERE b.organization_id = v_org_id
            AND i.stock_status IN ('low-stock', 'out-of-stock')
            AND i.is_active = true
            AND (p_branch_id IS NULL OR i.branch_id = p_branch_id)
        ),
        'period_revenue', (
            SELECT COALESCE(SUM(final_cost), 0)
            FROM public.work_orders wo
            INNER JOIN public.branches b ON wo.branch_id = b.id
            WHERE b.organization_id = v_org_id
            AND wo.status = 'completed'
            AND wo.completion_date BETWEEN p_date_from AND p_date_to
            AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
        ),
        'pending_orders', (
            SELECT COUNT(*)
            FROM public.work_orders wo
            INNER JOIN public.branches b ON wo.branch_id = b.id
            WHERE b.organization_id = v_org_id
            AND wo.status = 'pending'
            AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
        ),
        'completed_today', (
            SELECT COUNT(*)
            FROM public.work_orders wo
            INNER JOIN public.branches b ON wo.branch_id = b.id
            WHERE b.organization_id = v_org_id
            AND wo.status = 'completed'
            AND wo.completion_date = CURRENT_DATE
            AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
        ),
        'unread_notifications', (
            SELECT COUNT(*)
            FROM public.notifications
            WHERE user_id = auth.uid()
            AND is_read = false
        )
    ) INTO v_kpis;
    
    RETURN v_kpis;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get active orders summary
CREATE OR REPLACE FUNCTION public.get_active_orders_summary(
    p_branch_id UUID DEFAULT NULL,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    client_name TEXT,
    vehicle_info TEXT,
    service TEXT,
    status public.work_order_status,
    estimated_cost DECIMAL,
    start_date DATE,
    assigned_mechanic TEXT
) AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT organization_id INTO v_org_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN QUERY
    SELECT 
        wo.id,
        wo.order_number,
        CONCAT(c.first_name, ' ', c.last_name),
        CONCAT(v.brand, ' ', v.model, ' (', v.license_plate, ')'),
        wo.service,
        wo.status,
        wo.estimated_cost,
        wo.start_date,
        CONCAT(u.first_name, ' ', u.last_name)
    FROM public.work_orders wo
    INNER JOIN public.branches b ON wo.branch_id = b.id
    INNER JOIN public.clients c ON wo.client_id = c.id
    INNER JOIN public.vehicles v ON wo.vehicle_id = v.id
    LEFT JOIN public.users u ON wo.assigned_mechanic_id = u.id
    WHERE b.organization_id = v_org_id
    AND wo.status IN ('pending', 'in-progress')
    AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
    ORDER BY wo.start_date ASC, wo.created_at ASC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get revenue by period
CREATE OR REPLACE FUNCTION public.get_revenue_by_period(
    p_branch_id UUID DEFAULT NULL,
    p_period TEXT DEFAULT 'day', -- 'day', 'week', 'month', 'year'
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    period_date DATE,
    total_orders BIGINT,
    total_revenue DECIMAL,
    avg_order_value DECIMAL
) AS $$
DECLARE
    v_org_id UUID;
    v_interval TEXT;
BEGIN
    SELECT organization_id INTO v_org_id
    FROM public.users
    WHERE id = auth.uid();
    
    -- Determine grouping interval
    v_interval := CASE p_period
        WHEN 'day' THEN '1 day'
        WHEN 'week' THEN '1 week'
        WHEN 'month' THEN '1 month'
        WHEN 'year' THEN '1 year'
        ELSE '1 day'
    END;
    
    RETURN QUERY
    SELECT 
        DATE_TRUNC(p_period, wo.completion_date)::DATE as period_date,
        COUNT(*)::BIGINT as total_orders,
        SUM(wo.final_cost)::DECIMAL as total_revenue,
        AVG(wo.final_cost)::DECIMAL as avg_order_value
    FROM public.work_orders wo
    INNER JOIN public.branches b ON wo.branch_id = b.id
    WHERE b.organization_id = v_org_id
    AND wo.status = 'completed'
    AND wo.completion_date BETWEEN p_start_date AND p_end_date
    AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
    GROUP BY DATE_TRUNC(p_period, wo.completion_date)
    ORDER BY period_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top services
CREATE OR REPLACE FUNCTION public.get_top_services(
    p_branch_id UUID DEFAULT NULL,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    service TEXT,
    total_orders BIGINT,
    total_revenue DECIMAL,
    avg_cost DECIMAL
) AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT organization_id INTO v_org_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN QUERY
    SELECT 
        wo.service,
        COUNT(*)::BIGINT as total_orders,
        SUM(wo.final_cost)::DECIMAL as total_revenue,
        AVG(wo.final_cost)::DECIMAL as avg_cost
    FROM public.work_orders wo
    INNER JOIN public.branches b ON wo.branch_id = b.id
    WHERE b.organization_id = v_org_id
    AND wo.status = 'completed'
    AND wo.completion_date BETWEEN p_start_date AND p_end_date
    AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
    GROUP BY wo.service
    ORDER BY total_orders DESC, total_revenue DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top clients
CREATE OR REPLACE FUNCTION public.get_top_clients(
    p_branch_id UUID DEFAULT NULL,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '365 days',
    p_end_date DATE DEFAULT CURRENT_DATE,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    client_id UUID,
    client_name TEXT,
    client_email TEXT,
    client_phone TEXT,
    total_orders BIGINT,
    total_spent DECIMAL,
    last_visit DATE
) AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT organization_id INTO v_org_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN QUERY
    SELECT 
        c.id,
        CONCAT(c.first_name, ' ', c.last_name),
        c.email,
        c.phone,
        COUNT(wo.id)::BIGINT as total_orders,
        SUM(wo.final_cost)::DECIMAL as total_spent,
        MAX(wo.completion_date) as last_visit
    FROM public.clients c
    INNER JOIN public.work_orders wo ON c.id = wo.client_id
    INNER JOIN public.branches b ON wo.branch_id = b.id
    WHERE b.organization_id = v_org_id
    AND wo.status = 'completed'
    AND wo.completion_date BETWEEN p_start_date AND p_end_date
    AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
    GROUP BY c.id, c.first_name, c.last_name, c.email, c.phone
    ORDER BY total_spent DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get mechanic performance
CREATE OR REPLACE FUNCTION public.get_mechanic_performance(
    p_branch_id UUID DEFAULT NULL,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    mechanic_id UUID,
    mechanic_name TEXT,
    total_orders BIGINT,
    completed_orders BIGINT,
    in_progress_orders BIGINT,
    avg_completion_days DECIMAL,
    total_revenue DECIMAL
) AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT organization_id INTO v_org_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN QUERY
    SELECT 
        u.id,
        CONCAT(u.first_name, ' ', u.last_name),
        COUNT(wo.id)::BIGINT as total_orders,
        COUNT(wo.id) FILTER (WHERE wo.status = 'completed')::BIGINT as completed_orders,
        COUNT(wo.id) FILTER (WHERE wo.status = 'in-progress')::BIGINT as in_progress_orders,
        AVG(EXTRACT(DAY FROM (wo.completion_date - wo.start_date)))::DECIMAL as avg_completion_days,
        SUM(wo.final_cost) FILTER (WHERE wo.status = 'completed')::DECIMAL as total_revenue
    FROM public.users u
    INNER JOIN public.work_orders wo ON u.id = wo.assigned_mechanic_id
    INNER JOIN public.branches b ON wo.branch_id = b.id
    WHERE b.organization_id = v_org_id
    AND u.role IN ('mechanic', 'manager')
    AND wo.start_date BETWEEN p_start_date AND p_end_date
    AND (p_branch_id IS NULL OR wo.branch_id = p_branch_id)
    GROUP BY u.id, u.first_name, u.last_name
    ORDER BY total_revenue DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION public.get_dashboard_kpis IS 'Obtiene todos los KPIs del dashboard en un solo objeto JSON';
COMMENT ON FUNCTION public.get_active_orders_summary IS 'Lista de órdenes activas con información resumida';
COMMENT ON FUNCTION public.get_revenue_by_period IS 'Ingresos agrupados por período (día, semana, mes, año)';
COMMENT ON FUNCTION public.get_top_services IS 'Servicios más solicitados con sus métricas';
COMMENT ON FUNCTION public.get_top_clients IS 'Clientes más valiosos por gasto total';
COMMENT ON FUNCTION public.get_mechanic_performance IS 'Rendimiento de mecánicos por órdenes y facturación';
