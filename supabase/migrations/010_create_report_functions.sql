-- ============================================================================
-- Migration: 010 - Create Report Functions
-- Description: Funciones para generar reportes y consultas avanzadas
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- VEHICLE AND CLIENT HISTORY FUNCTIONS
-- ============================================================================

-- Function to get vehicle service history
CREATE OR REPLACE FUNCTION public.get_vehicle_service_history(p_vehicle_id UUID)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    branch_name TEXT,
    service TEXT,
    status public.work_order_status,
    start_date DATE,
    completion_date DATE,
    final_cost DECIMAL,
    parts_used JSONB,
    mechanic_name TEXT,
    notes TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wo.id,
        wo.order_number,
        b.name,
        wo.service,
        wo.status,
        wo.start_date,
        wo.completion_date,
        wo.final_cost,
        (
            SELECT jsonb_agg(
                jsonb_build_object(
                    'name', wop.name,
                    'quantity', wop.quantity,
                    'total', wop.total
                )
            )
            FROM public.work_order_parts wop
            WHERE wop.work_order_id = wo.id
        ) as parts_used,
        CONCAT(u.first_name, ' ', u.last_name),
        wo.notes
    FROM public.work_orders wo
    INNER JOIN public.branches b ON wo.branch_id = b.id
    LEFT JOIN public.users u ON wo.assigned_mechanic_id = u.id
    WHERE wo.vehicle_id = p_vehicle_id
    ORDER BY wo.start_date DESC, wo.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get client order history
CREATE OR REPLACE FUNCTION public.get_client_order_history(
    p_client_id UUID,
    p_limit INTEGER DEFAULT 50
)
RETURNS TABLE (
    order_id UUID,
    order_number TEXT,
    branch_name TEXT,
    vehicle_info TEXT,
    service TEXT,
    status public.work_order_status,
    start_date DATE,
    completion_date DATE,
    final_cost DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wo.id,
        wo.order_number,
        b.name,
        CONCAT(v.brand, ' ', v.model, ' (', v.license_plate, ')'),
        wo.service,
        wo.status,
        wo.start_date,
        wo.completion_date,
        wo.final_cost
    FROM public.work_orders wo
    INNER JOIN public.branches b ON wo.branch_id = b.id
    INNER JOIN public.vehicles v ON wo.vehicle_id = v.id
    WHERE wo.client_id = p_client_id
    ORDER BY wo.start_date DESC, wo.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get detailed work order info
CREATE OR REPLACE FUNCTION public.get_work_order_details(p_order_id UUID)
RETURNS JSONB AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'order', row_to_json(wo.*),
        'client', jsonb_build_object(
            'id', c.id,
            'name', CONCAT(c.first_name, ' ', c.last_name),
            'email', c.email,
            'phone', c.phone
        ),
        'vehicle', jsonb_build_object(
            'id', v.id,
            'license_plate', v.license_plate,
            'brand', v.brand,
            'model', v.model,
            'year', v.year
        ),
        'branch', jsonb_build_object(
            'id', b.id,
            'name', b.name,
            'address', b.address,
            'phone', b.phone
        ),
        'mechanic', CASE 
            WHEN u.id IS NOT NULL THEN jsonb_build_object(
                'id', u.id,
                'name', CONCAT(u.first_name, ' ', u.last_name)
            )
            ELSE NULL
        END,
        'parts', (
            SELECT jsonb_agg(row_to_json(wop.*))
            FROM public.work_order_parts wop
            WHERE wop.work_order_id = wo.id
        )
    ) INTO v_result
    FROM public.work_orders wo
    INNER JOIN public.clients c ON wo.client_id = c.id
    INNER JOIN public.vehicles v ON wo.vehicle_id = v.id
    INNER JOIN public.branches b ON wo.branch_id = b.id
    LEFT JOIN public.users u ON wo.assigned_mechanic_id = u.id
    WHERE wo.id = p_order_id;
    
    RETURN v_result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INVENTORY REPORTS
-- ============================================================================

-- Function to get inventory movement report
CREATE OR REPLACE FUNCTION public.get_inventory_movement_report(
    p_branch_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE,
    p_movement_type public.inventory_movement_type DEFAULT NULL
)
RETURNS TABLE (
    movement_id UUID,
    item_name TEXT,
    item_sku TEXT,
    movement_type public.inventory_movement_type,
    quantity INTEGER,
    previous_quantity INTEGER,
    new_quantity INTEGER,
    reason TEXT,
    user_name TEXT,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        im.id,
        ii.name,
        ii.sku,
        im.type,
        im.quantity,
        im.previous_quantity,
        im.new_quantity,
        im.reason,
        CONCAT(u.first_name, ' ', u.last_name),
        im.created_at
    FROM public.inventory_movements im
    INNER JOIN public.inventory_items ii ON im.item_id = ii.id
    INNER JOIN public.users u ON im.user_id = u.id
    WHERE im.branch_id = p_branch_id
    AND im.created_at::DATE BETWEEN p_start_date AND p_end_date
    AND (p_movement_type IS NULL OR im.type = p_movement_type)
    ORDER BY im.created_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get inventory valuation
CREATE OR REPLACE FUNCTION public.get_inventory_valuation(p_branch_id UUID)
RETURNS TABLE (
    category public.inventory_category,
    total_items BIGINT,
    total_quantity BIGINT,
    total_cost DECIMAL,
    total_value DECIMAL,
    potential_profit DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ii.category,
        COUNT(*)::BIGINT as total_items,
        SUM(ii.quantity)::BIGINT as total_quantity,
        SUM(ii.cost * ii.quantity)::DECIMAL as total_cost,
        SUM(ii.price * ii.quantity)::DECIMAL as total_value,
        SUM((ii.price - ii.cost) * ii.quantity)::DECIMAL as potential_profit
    FROM public.inventory_items ii
    WHERE ii.branch_id = p_branch_id
    AND ii.is_active = true
    GROUP BY ii.category
    ORDER BY total_value DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- SALES AND FINANCIAL REPORTS
-- ============================================================================

-- Function to get sales report by branch
CREATE OR REPLACE FUNCTION public.get_sales_report_by_branch(
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    branch_id UUID,
    branch_name TEXT,
    total_orders BIGINT,
    completed_orders BIGINT,
    cancelled_orders BIGINT,
    total_revenue DECIMAL,
    avg_order_value DECIMAL,
    total_labor_cost DECIMAL,
    total_parts_cost DECIMAL
) AS $$
DECLARE
    v_org_id UUID;
BEGIN
    SELECT organization_id INTO v_org_id
    FROM public.users
    WHERE id = auth.uid();
    
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        COUNT(wo.id)::BIGINT as total_orders,
        COUNT(wo.id) FILTER (WHERE wo.status = 'completed')::BIGINT as completed_orders,
        COUNT(wo.id) FILTER (WHERE wo.status = 'cancelled')::BIGINT as cancelled_orders,
        SUM(wo.final_cost) FILTER (WHERE wo.status = 'completed')::DECIMAL as total_revenue,
        AVG(wo.final_cost) FILTER (WHERE wo.status = 'completed')::DECIMAL as avg_order_value,
        SUM(wo.labor_cost) FILTER (WHERE wo.status = 'completed')::DECIMAL as total_labor_cost,
        SUM(wo.parts_cost) FILTER (WHERE wo.status = 'completed')::DECIMAL as total_parts_cost
    FROM public.branches b
    LEFT JOIN public.work_orders wo ON b.id = wo.branch_id 
        AND wo.start_date BETWEEN p_start_date AND p_end_date
    WHERE b.organization_id = v_org_id
    AND b.is_active = true
    GROUP BY b.id, b.name
    ORDER BY total_revenue DESC NULLS LAST;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get parts usage report
CREATE OR REPLACE FUNCTION public.get_parts_usage_report(
    p_branch_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    part_name TEXT,
    times_used BIGINT,
    total_quantity BIGINT,
    total_cost DECIMAL,
    avg_unit_price DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        wop.name,
        COUNT(DISTINCT wop.work_order_id)::BIGINT as times_used,
        SUM(wop.quantity)::BIGINT as total_quantity,
        SUM(wop.total)::DECIMAL as total_cost,
        AVG(wop.unit_price)::DECIMAL as avg_unit_price
    FROM public.work_order_parts wop
    INNER JOIN public.work_orders wo ON wop.work_order_id = wo.id
    WHERE wo.branch_id = p_branch_id
    AND wo.start_date BETWEEN p_start_date AND p_end_date
    AND wo.status = 'completed'
    GROUP BY wop.name
    ORDER BY times_used DESC, total_quantity DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- APPOINTMENT REPORTS
-- ============================================================================

-- Function to get appointment statistics
CREATE OR REPLACE FUNCTION public.get_appointment_statistics(
    p_branch_id UUID,
    p_start_date DATE DEFAULT CURRENT_DATE - INTERVAL '30 days',
    p_end_date DATE DEFAULT CURRENT_DATE
)
RETURNS TABLE (
    total_appointments BIGINT,
    confirmed_appointments BIGINT,
    completed_appointments BIGINT,
    cancelled_appointments BIGINT,
    conversion_rate DECIMAL,
    avg_duration INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(*)::BIGINT as total_appointments,
        COUNT(*) FILTER (WHERE status = 'confirmed')::BIGINT as confirmed_appointments,
        COUNT(*) FILTER (WHERE status = 'completed')::BIGINT as completed_appointments,
        COUNT(*) FILTER (WHERE status = 'cancelled')::BIGINT as cancelled_appointments,
        CASE 
            WHEN COUNT(*) > 0 THEN 
                ROUND((COUNT(*) FILTER (WHERE status = 'completed')::DECIMAL / COUNT(*) * 100), 2)
            ELSE 0
        END as conversion_rate,
        AVG(duration)::INTEGER as avg_duration
    FROM public.appointments
    WHERE branch_id = p_branch_id
    AND date BETWEEN p_start_date AND p_end_date;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION public.get_vehicle_service_history IS 'Historial completo de servicios de un vehículo';
COMMENT ON FUNCTION public.get_client_order_history IS 'Historial de órdenes de un cliente';
COMMENT ON FUNCTION public.get_work_order_details IS 'Detalles completos de una OT con todos los datos relacionados';
COMMENT ON FUNCTION public.get_inventory_movement_report IS 'Reporte de movimientos de inventario con filtros';
COMMENT ON FUNCTION public.get_inventory_valuation IS 'Valuación del inventario por categoría';
COMMENT ON FUNCTION public.get_sales_report_by_branch IS 'Reporte de ventas comparativo entre sucursales';
COMMENT ON FUNCTION public.get_parts_usage_report IS 'Reporte de repuestos más utilizados';
COMMENT ON FUNCTION public.get_appointment_statistics IS 'Estadísticas de citas con tasa de conversión';
