-- ============================================================================
-- Migration: 011 - Create Triggers
-- Description: Triggers automáticos para lógica de negocio
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- WORK ORDER TRIGGERS
-- ============================================================================

-- Trigger: Update inventory when work order is completed
CREATE OR REPLACE FUNCTION public.update_inventory_on_order_completion()
RETURNS TRIGGER AS $$
DECLARE
    v_part RECORD;
BEGIN
    -- Only process when order changes to completed
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        -- Update inventory for each part linked to inventory
        FOR v_part IN 
            SELECT inventory_item_id, quantity
            FROM public.work_order_parts
            WHERE work_order_id = NEW.id
            AND inventory_item_id IS NOT NULL
        LOOP
            -- Register inventory movement
            PERFORM public.register_inventory_movement(
                v_part.inventory_item_id,
                'out'::public.inventory_movement_type,
                v_part.quantity,
                'Used in work order: ' || NEW.order_number,
                NEW.id
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_inventory_on_order_completion
    AFTER UPDATE ON public.work_orders
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION public.update_inventory_on_order_completion();

-- Trigger: Notify on work order status change
CREATE OR REPLACE FUNCTION public.notify_order_status_change()
RETURNS TRIGGER AS $$
DECLARE
    v_client_name TEXT;
    v_user_id UUID;
BEGIN
    -- Only notify on status change
    IF NEW.status != OLD.status THEN
        -- Get client name
        SELECT CONCAT(first_name, ' ', last_name) INTO v_client_name
        FROM public.clients
        WHERE id = NEW.client_id;
        
        -- Notify assigned mechanic
        IF NEW.assigned_mechanic_id IS NOT NULL THEN
            PERFORM public.create_notification(
                NEW.assigned_mechanic_id,
                'order_update'::public.notification_type,
                'Actualización de Orden ' || NEW.order_number,
                'La orden ' || NEW.order_number || ' cambió a estado: ' || NEW.status,
                jsonb_build_object(
                    'order_id', NEW.id,
                    'order_number', NEW.order_number,
                    'old_status', OLD.status,
                    'new_status', NEW.status,
                    'client_name', v_client_name
                )
            );
        END IF;
        
        -- Notify creator
        IF NEW.created_by != NEW.assigned_mechanic_id OR NEW.assigned_mechanic_id IS NULL THEN
            PERFORM public.create_notification(
                NEW.created_by,
                'order_update'::public.notification_type,
                'Actualización de Orden ' || NEW.order_number,
                'La orden ' || NEW.order_number || ' cambió a estado: ' || NEW.status,
                jsonb_build_object(
                    'order_id', NEW.id,
                    'order_number', NEW.order_number,
                    'old_status', OLD.status,
                    'new_status', NEW.status,
                    'client_name', v_client_name
                )
            );
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_notify_order_status_change
    AFTER UPDATE ON public.work_orders
    FOR EACH ROW
    WHEN (NEW.status != OLD.status)
    EXECUTE FUNCTION public.notify_order_status_change();

-- ============================================================================
-- INVENTORY TRIGGERS
-- ============================================================================

-- Trigger: Alert on low stock
CREATE OR REPLACE FUNCTION public.alert_low_stock()
RETURNS TRIGGER AS $$
DECLARE
    v_user RECORD;
BEGIN
    -- Check if stock just went to low-stock or out-of-stock
    IF (NEW.stock_status IN ('low-stock', 'out-of-stock')) AND 
       (OLD.stock_status IS NULL OR OLD.stock_status = 'in-stock') THEN
        
        -- Notify all managers and admins in the branch
        FOR v_user IN
            SELECT u.id
            FROM public.users u
            LEFT JOIN public.user_branch_permissions ubp ON u.id = ubp.user_id
            WHERE u.role IN ('admin', 'manager')
            AND (
                u.role = 'admin' OR
                ubp.branch_id = NEW.branch_id
            )
        LOOP
            PERFORM public.create_notification(
                v_user.id,
                'stock_alert'::public.notification_type,
                CASE 
                    WHEN NEW.stock_status = 'out-of-stock' THEN 'Stock Agotado'
                    ELSE 'Stock Bajo'
                END,
                NEW.name || ' (SKU: ' || NEW.sku || ') ' || 
                CASE 
                    WHEN NEW.stock_status = 'out-of-stock' THEN 'está agotado'
                    ELSE 'tiene stock bajo. Quedan ' || NEW.quantity || ' unidades'
                END,
                jsonb_build_object(
                    'item_id', NEW.id,
                    'sku', NEW.sku,
                    'name', NEW.name,
                    'quantity', NEW.quantity,
                    'min_stock', NEW.min_stock,
                    'stock_status', NEW.stock_status,
                    'branch_id', NEW.branch_id
                )
            );
        END LOOP;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_alert_low_stock
    AFTER UPDATE ON public.inventory_items
    FOR EACH ROW
    WHEN (NEW.stock_status IN ('low-stock', 'out-of-stock'))
    EXECUTE FUNCTION public.alert_low_stock();

-- ============================================================================
-- APPOINTMENT TRIGGERS
-- ============================================================================

-- Trigger: Schedule appointment reminder
CREATE OR REPLACE FUNCTION public.schedule_appointment_reminder()
RETURNS TRIGGER AS $$
BEGIN
    -- Only for confirmed appointments
    IF NEW.status = 'confirmed' AND NEW.reminder_sent = false THEN
        -- In a real system, this would schedule a job to send reminder 24h before
        -- For now, we just mark it as needing a reminder
        -- The actual reminder would be sent by a scheduled Edge Function or cron job
        NULL;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_schedule_appointment_reminder
    AFTER INSERT OR UPDATE ON public.appointments
    FOR EACH ROW
    WHEN (NEW.status = 'confirmed' AND NEW.reminder_sent = false)
    EXECUTE FUNCTION public.schedule_appointment_reminder();

-- Trigger: Update vehicle last service date when order completed
CREATE OR REPLACE FUNCTION public.update_vehicle_last_service()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
        UPDATE public.vehicles
        SET 
            last_service_date = NEW.completion_date,
            mileage = COALESCE(
                (SELECT (NEW.notes::jsonb->>'mileage')::INTEGER WHERE NEW.notes IS NOT NULL),
                mileage
            )
        WHERE id = NEW.vehicle_id;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_vehicle_last_service
    AFTER UPDATE ON public.work_orders
    FOR EACH ROW
    WHEN (NEW.status = 'completed' AND OLD.status != 'completed')
    EXECUTE FUNCTION public.update_vehicle_last_service();

-- ============================================================================
-- USER TRIGGERS
-- ============================================================================

-- Trigger: Update last login timestamp
CREATE OR REPLACE FUNCTION public.update_last_login()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE public.users
    SET last_login_at = now()
    WHERE id = auth.uid();
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- This trigger would be called from application code on login
-- CREATE TRIGGER trigger_update_last_login ...

-- ============================================================================
-- VALIDATION TRIGGERS
-- ============================================================================

-- Trigger: Validate work order dates
CREATE OR REPLACE FUNCTION public.validate_work_order_dates()
RETURNS TRIGGER AS $$
BEGIN
    -- Validate estimated completion date is after start date
    IF NEW.estimated_completion_date IS NOT NULL AND 
       NEW.estimated_completion_date < NEW.start_date THEN
        RAISE EXCEPTION 'Estimated completion date cannot be before start date';
    END IF;
    
    -- Validate completion date is after start date
    IF NEW.completion_date IS NOT NULL AND 
       NEW.completion_date < NEW.start_date THEN
        RAISE EXCEPTION 'Completion date cannot be before start date';
    END IF;
    
    -- Auto-set completion date when status changes to completed
    IF NEW.status = 'completed' AND NEW.completion_date IS NULL THEN
        NEW.completion_date := CURRENT_DATE;
    END IF;
    
    -- Auto-set final cost if not provided
    IF NEW.status = 'completed' AND NEW.final_cost IS NULL THEN
        NEW.final_cost := NEW.labor_cost + NEW.parts_cost;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_validate_work_order_dates
    BEFORE INSERT OR UPDATE ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.validate_work_order_dates();

-- Trigger: Prevent deletion of work orders with parts
CREATE OR REPLACE FUNCTION public.prevent_order_deletion_with_parts()
RETURNS TRIGGER AS $$
DECLARE
    v_parts_count INTEGER;
BEGIN
    -- Check if order has parts
    SELECT COUNT(*) INTO v_parts_count
    FROM public.work_order_parts
    WHERE work_order_id = OLD.id;
    
    IF v_parts_count > 0 THEN
        RAISE EXCEPTION 'Cannot delete work order with parts. Cancel it instead.';
    END IF;
    
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_prevent_order_deletion_with_parts
    BEFORE DELETE ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.prevent_order_deletion_with_parts();

-- ============================================================================
-- CLEANUP TRIGGERS
-- ============================================================================

-- Trigger: Cleanup related data when client is deleted (soft delete recommended)
CREATE OR REPLACE FUNCTION public.cleanup_client_data()
RETURNS TRIGGER AS $$
BEGIN
    -- When a client is deactivated (not deleted), we don't need to do anything
    -- When actually deleted, PostgreSQL cascade will handle related records
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON FUNCTION public.update_inventory_on_order_completion IS 'Actualiza automáticamente el inventario cuando una OT se completa';
COMMENT ON FUNCTION public.notify_order_status_change IS 'Crea notificaciones cuando cambia el estado de una OT';
COMMENT ON FUNCTION public.alert_low_stock IS 'Alerta a managers cuando el stock llega al mínimo';
COMMENT ON FUNCTION public.schedule_appointment_reminder IS 'Programa recordatorios para citas confirmadas';
COMMENT ON FUNCTION public.update_vehicle_last_service IS 'Actualiza fecha de último servicio del vehículo';
COMMENT ON FUNCTION public.validate_work_order_dates IS 'Valida fechas de OT y auto-completa campos';
COMMENT ON FUNCTION public.prevent_order_deletion_with_parts IS 'Previene eliminación de OT con repuestos asignados';
