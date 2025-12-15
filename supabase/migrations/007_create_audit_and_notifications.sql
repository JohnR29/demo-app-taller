-- ============================================================================
-- Migration: 007 - Create Audit Logs and Notifications
-- Description: Sistema de auditoría y notificaciones
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- 1. CREATE ENUM TYPES
-- ============================================================================

CREATE TYPE public.audit_action AS ENUM (
    'create',
    'update',
    'delete'
);

CREATE TYPE public.notification_type AS ENUM (
    'stock_alert',
    'appointment_reminder',
    'order_update',
    'system'
);

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Audit Logs (Auditoría)
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action public.audit_action NOT NULL,
    old_values JSONB,
    new_values JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT audit_logs_action_values_check CHECK (
        (action = 'create' AND old_values IS NULL) OR
        (action = 'delete' AND new_values IS NULL) OR
        (action = 'update')
    )
);

-- Notifications (Notificaciones)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    type public.notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    is_read BOOLEAN DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT notifications_read_at_check CHECK (
        (is_read = true AND read_at IS NOT NULL) OR
        (is_read = false AND read_at IS NULL)
    )
);

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

-- Audit Logs indexes
CREATE INDEX idx_audit_logs_organization ON public.audit_logs(organization_id);
CREATE INDEX idx_audit_logs_user ON public.audit_logs(user_id) WHERE user_id IS NOT NULL;
CREATE INDEX idx_audit_logs_table_record ON public.audit_logs(table_name, record_id);
CREATE INDEX idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);

-- Notifications indexes
CREATE INDEX idx_notifications_user ON public.notifications(user_id);
CREATE INDEX idx_notifications_type ON public.notifications(type);
CREATE INDEX idx_notifications_is_read ON public.notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_created_at ON public.notifications(created_at DESC);

-- ============================================================================
-- 4. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 5. CREATE RLS POLICIES
-- ============================================================================

-- Audit Logs Policies
-- Only admins can view audit logs
CREATE POLICY "Admins can view audit logs"
    ON public.audit_logs
    FOR SELECT
    USING (
        organization_id IN (
            SELECT organization_id
            FROM public.users
            WHERE id = auth.uid()
            AND role = 'admin'
        )
    );

-- System can insert audit logs (via triggers)
CREATE POLICY "System can insert audit logs"
    ON public.audit_logs
    FOR INSERT
    WITH CHECK (true);

-- Notifications Policies
-- Users can view their own notifications
CREATE POLICY "Users can view their own notifications"
    ON public.notifications
    FOR SELECT
    USING (user_id = auth.uid());

-- System can create notifications
CREATE POLICY "System can create notifications"
    ON public.notifications
    FOR INSERT
    WITH CHECK (true);

-- Users can update their own notifications (mark as read)
CREATE POLICY "Users can update their own notifications"
    ON public.notifications
    FOR UPDATE
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

-- Users can delete their own notifications
CREATE POLICY "Users can delete their own notifications"
    ON public.notifications
    FOR DELETE
    USING (user_id = auth.uid());

-- ============================================================================
-- 6. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to create audit log
CREATE OR REPLACE FUNCTION public.create_audit_log(
    p_organization_id UUID,
    p_table_name TEXT,
    p_record_id UUID,
    p_action public.audit_action,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL,
    p_ip_address TEXT DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_log_id UUID;
    v_user_id UUID;
BEGIN
    v_user_id := auth.uid();
    
    INSERT INTO public.audit_logs (
        organization_id,
        user_id,
        table_name,
        record_id,
        action,
        old_values,
        new_values,
        ip_address,
        user_agent
    ) VALUES (
        p_organization_id,
        v_user_id,
        p_table_name,
        p_record_id,
        p_action,
        p_old_values,
        p_new_values,
        p_ip_address,
        p_user_agent
    )
    RETURNING id INTO v_log_id;
    
    RETURN v_log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create notification
CREATE OR REPLACE FUNCTION public.create_notification(
    p_user_id UUID,
    p_type public.notification_type,
    p_title TEXT,
    p_message TEXT,
    p_data JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_notification_id UUID;
BEGIN
    INSERT INTO public.notifications (
        user_id,
        type,
        title,
        message,
        data
    ) VALUES (
        p_user_id,
        p_type,
        p_title,
        p_message,
        p_data
    )
    RETURNING id INTO v_notification_id;
    
    RETURN v_notification_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark notification as read
CREATE OR REPLACE FUNCTION public.mark_notification_as_read(p_notification_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.notifications
    SET 
        is_read = true,
        read_at = now()
    WHERE id = p_notification_id
    AND user_id = auth.uid()
    AND is_read = false;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to mark all notifications as read for current user
CREATE OR REPLACE FUNCTION public.mark_all_notifications_as_read()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    UPDATE public.notifications
    SET 
        is_read = true,
        read_at = now()
    WHERE user_id = auth.uid()
    AND is_read = false;
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get unread notifications count
CREATE OR REPLACE FUNCTION public.get_unread_notifications_count()
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO v_count
    FROM public.notifications
    WHERE user_id = auth.uid()
    AND is_read = false;
    
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete old notifications
CREATE OR REPLACE FUNCTION public.cleanup_old_notifications(p_days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM public.notifications
    WHERE is_read = true
    AND read_at < (CURRENT_DATE - p_days_old);
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to delete old audit logs
CREATE OR REPLACE FUNCTION public.cleanup_old_audit_logs(p_months_old INTEGER DEFAULT 12)
RETURNS INTEGER AS $$
DECLARE
    v_count INTEGER;
BEGIN
    DELETE FROM public.audit_logs
    WHERE created_at < (CURRENT_DATE - (p_months_old || ' months')::INTERVAL);
    
    GET DIAGNOSTICS v_count = ROW_COUNT;
    RETURN v_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 7. CREATE AUDIT TRIGGERS FOR CRITICAL TABLES
-- ============================================================================

-- Generic audit trigger function
CREATE OR REPLACE FUNCTION public.audit_trigger_function()
RETURNS TRIGGER AS $$
DECLARE
    v_organization_id UUID;
    v_old_values JSONB;
    v_new_values JSONB;
BEGIN
    -- Get organization_id from the record
    IF TG_OP = 'DELETE' THEN
        v_organization_id := COALESCE(
            OLD.organization_id,
            (SELECT organization_id FROM public.users WHERE id = OLD.user_id LIMIT 1),
            (SELECT organization_id FROM public.branches WHERE id = OLD.branch_id LIMIT 1)
        );
        v_old_values := to_jsonb(OLD);
        v_new_values := NULL;
    ELSIF TG_OP = 'UPDATE' THEN
        v_organization_id := COALESCE(
            NEW.organization_id,
            (SELECT organization_id FROM public.users WHERE id = NEW.user_id LIMIT 1),
            (SELECT organization_id FROM public.branches WHERE id = NEW.branch_id LIMIT 1)
        );
        v_old_values := to_jsonb(OLD);
        v_new_values := to_jsonb(NEW);
    ELSE -- INSERT
        v_organization_id := COALESCE(
            NEW.organization_id,
            (SELECT organization_id FROM public.users WHERE id = NEW.user_id LIMIT 1),
            (SELECT organization_id FROM public.branches WHERE id = NEW.branch_id LIMIT 1)
        );
        v_old_values := NULL;
        v_new_values := to_jsonb(NEW);
    END IF;
    
    -- Create audit log
    IF v_organization_id IS NOT NULL THEN
        PERFORM public.create_audit_log(
            v_organization_id,
            TG_TABLE_NAME,
            COALESCE(NEW.id, OLD.id),
            TG_OP::public.audit_action,
            v_old_values,
            v_new_values
        );
    END IF;
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Apply audit triggers to critical tables
CREATE TRIGGER audit_work_orders
    AFTER INSERT OR UPDATE OR DELETE ON public.work_orders
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_inventory_items
    AFTER INSERT OR UPDATE OR DELETE ON public.inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_clients
    AFTER INSERT OR UPDATE OR DELETE ON public.clients
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_trigger_function();

CREATE TRIGGER audit_users
    AFTER INSERT OR UPDATE OR DELETE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.audit_trigger_function();

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.audit_logs IS 'Registro de auditoría - todas las acciones críticas en el sistema';
COMMENT ON TABLE public.notifications IS 'Notificaciones del sistema para usuarios';

COMMENT ON TYPE public.audit_action IS 'Tipos de acción: create (crear), update (actualizar), delete (eliminar)';
COMMENT ON TYPE public.notification_type IS 'Tipos de notificación: stock_alert, appointment_reminder, order_update, system';

COMMENT ON COLUMN public.audit_logs.old_values IS 'Valores anteriores en formato JSON (NULL para create)';
COMMENT ON COLUMN public.audit_logs.new_values IS 'Valores nuevos en formato JSON (NULL para delete)';
COMMENT ON COLUMN public.notifications.data IS 'Datos adicionales en formato JSON (ej: IDs de registros relacionados)';
