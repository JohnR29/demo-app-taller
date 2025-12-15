-- ============================================================================
-- Migration: 005 - Create Appointments
-- Description: Sistema de agendamiento de citas
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- 1. CREATE ENUM TYPES
-- ============================================================================

CREATE TYPE public.appointment_status AS ENUM (
    'pending',
    'confirmed',
    'cancelled',
    'completed'
);

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Appointments (Citas)
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    client_id UUID REFERENCES public.clients(id) ON DELETE SET NULL,
    vehicle_id UUID REFERENCES public.vehicles(id) ON DELETE SET NULL,
    client_name TEXT NOT NULL,
    client_phone TEXT NOT NULL,
    client_email TEXT,
    service TEXT NOT NULL,
    date DATE NOT NULL,
    time TIME NOT NULL,
    duration INTEGER NOT NULL DEFAULT 60,
    status public.appointment_status NOT NULL DEFAULT 'pending',
    has_parts BOOLEAN DEFAULT false,
    notes TEXT,
    reminder_sent BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT appointments_duration_check CHECK (duration > 0 AND duration <= 480),
    CONSTRAINT appointments_date_check CHECK (date >= CURRENT_DATE - INTERVAL '7 days'),
    CONSTRAINT appointments_email_check CHECK (client_email IS NULL OR client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_appointments_branch ON public.appointments(branch_id);
CREATE INDEX idx_appointments_client ON public.appointments(client_id) WHERE client_id IS NOT NULL;
CREATE INDEX idx_appointments_vehicle ON public.appointments(vehicle_id) WHERE vehicle_id IS NOT NULL;
CREATE INDEX idx_appointments_date ON public.appointments(date);
CREATE INDEX idx_appointments_status ON public.appointments(status);
CREATE INDEX idx_appointments_branch_date ON public.appointments(branch_id, date, time);
CREATE INDEX idx_appointments_branch_status ON public.appointments(branch_id, status);
CREATE INDEX idx_appointments_reminder ON public.appointments(date, reminder_sent) WHERE status = 'confirmed' AND reminder_sent = false;
CREATE INDEX idx_appointments_phone ON public.appointments(client_phone);

-- ============================================================================
-- 4. CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_appointments_updated_at
    BEFORE UPDATE ON public.appointments
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Appointments Policies
-- Users can view appointments in their branches
CREATE POLICY "Users can view appointments in their branches"
    ON public.appointments
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

-- Public can create appointments (portal cliente)
CREATE POLICY "Public can create appointments"
    ON public.appointments
    FOR INSERT
    WITH CHECK (true);

-- Staff can create appointments
CREATE POLICY "Staff can create appointments"
    ON public.appointments
    FOR INSERT
    WITH CHECK (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'manager', 'receptionist')
        )
    );

-- Staff can update appointments
CREATE POLICY "Staff can update appointments"
    ON public.appointments
    FOR UPDATE
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'manager', 'receptionist')
        )
    );

-- Only admins can delete appointments
CREATE POLICY "Admins can delete appointments"
    ON public.appointments
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

-- ============================================================================
-- 7. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to check time slot availability
CREATE OR REPLACE FUNCTION public.check_time_slot_availability(
    p_branch_id UUID,
    p_date DATE,
    p_time TIME,
    p_duration INTEGER,
    p_exclude_appointment_id UUID DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_end_time TIME;
    v_conflict_count INTEGER;
BEGIN
    -- Calculate end time
    v_end_time := p_time + (p_duration || ' minutes')::INTERVAL;
    
    -- Check for conflicts
    SELECT COUNT(*) INTO v_conflict_count
    FROM public.appointments
    WHERE branch_id = p_branch_id
    AND date = p_date
    AND status IN ('pending', 'confirmed')
    AND (id != p_exclude_appointment_id OR p_exclude_appointment_id IS NULL)
    AND (
        -- New appointment starts during existing appointment
        (p_time >= time AND p_time < time + (duration || ' minutes')::INTERVAL) OR
        -- New appointment ends during existing appointment
        (v_end_time > time AND v_end_time <= time + (duration || ' minutes')::INTERVAL) OR
        -- New appointment encompasses existing appointment
        (p_time <= time AND v_end_time >= time + (duration || ' minutes')::INTERVAL)
    );
    
    RETURN v_conflict_count = 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to schedule appointment with validation
CREATE OR REPLACE FUNCTION public.schedule_appointment(
    p_branch_id UUID,
    p_client_name TEXT,
    p_client_phone TEXT,
    p_client_email TEXT DEFAULT NULL,
    p_service TEXT DEFAULT NULL,
    p_date DATE DEFAULT NULL,
    p_time TIME DEFAULT NULL,
    p_duration INTEGER DEFAULT 60,
    p_client_id UUID DEFAULT NULL,
    p_vehicle_id UUID DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_appointment_id UUID;
    v_is_available BOOLEAN;
BEGIN
    -- Validate time slot availability
    v_is_available := public.check_time_slot_availability(
        p_branch_id,
        p_date,
        p_time,
        p_duration
    );
    
    IF NOT v_is_available THEN
        RAISE EXCEPTION 'Time slot is not available';
    END IF;
    
    -- Validate that vehicle belongs to client if both provided
    IF p_client_id IS NOT NULL AND p_vehicle_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1
            FROM public.vehicles
            WHERE id = p_vehicle_id
            AND client_id = p_client_id
        ) THEN
            RAISE EXCEPTION 'Vehicle does not belong to the specified client';
        END IF;
    END IF;
    
    -- Create appointment
    INSERT INTO public.appointments (
        branch_id,
        client_id,
        vehicle_id,
        client_name,
        client_phone,
        client_email,
        service,
        date,
        time,
        duration,
        notes
    ) VALUES (
        p_branch_id,
        p_client_id,
        p_vehicle_id,
        p_client_name,
        p_client_phone,
        p_client_email,
        p_service,
        p_date,
        p_time,
        p_duration,
        p_notes
    )
    RETURNING id INTO v_appointment_id;
    
    RETURN v_appointment_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to convert appointment to work order
CREATE OR REPLACE FUNCTION public.convert_appointment_to_order(
    p_appointment_id UUID,
    p_estimated_cost DECIMAL DEFAULT 0,
    p_assigned_mechanic_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_appointment RECORD;
    v_order_id UUID;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Get appointment details
    SELECT * INTO v_appointment
    FROM public.appointments
    WHERE id = p_appointment_id;
    
    IF v_appointment IS NULL THEN
        RAISE EXCEPTION 'Appointment not found';
    END IF;
    
    IF v_appointment.status != 'confirmed' THEN
        RAISE EXCEPTION 'Only confirmed appointments can be converted to work orders';
    END IF;
    
    IF v_appointment.client_id IS NULL OR v_appointment.vehicle_id IS NULL THEN
        RAISE EXCEPTION 'Appointment must have client and vehicle assigned';
    END IF;
    
    -- Create work order
    v_order_id := public.create_work_order(
        v_appointment.branch_id,
        v_appointment.client_id,
        v_appointment.vehicle_id,
        v_appointment.service,
        v_appointment.notes,
        p_estimated_cost,
        p_assigned_mechanic_id,
        v_appointment.date
    );
    
    -- Update appointment status
    UPDATE public.appointments
    SET status = 'completed'
    WHERE id = p_appointment_id;
    
    RETURN v_order_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get available time slots for a date
CREATE OR REPLACE FUNCTION public.get_available_time_slots(
    p_branch_id UUID,
    p_date DATE,
    p_duration INTEGER DEFAULT 60,
    p_start_hour INTEGER DEFAULT 9,
    p_end_hour INTEGER DEFAULT 18,
    p_slot_interval INTEGER DEFAULT 30
)
RETURNS TABLE (
    slot_time TIME,
    is_available BOOLEAN
) AS $$
DECLARE
    v_current_time TIME;
    v_end_time TIME;
BEGIN
    v_current_time := (p_start_hour || ':00:00')::TIME;
    v_end_time := (p_end_hour || ':00:00')::TIME;
    
    WHILE v_current_time < v_end_time LOOP
        RETURN QUERY
        SELECT 
            v_current_time,
            public.check_time_slot_availability(
                p_branch_id,
                p_date,
                v_current_time,
                p_duration
            );
        
        v_current_time := v_current_time + (p_slot_interval || ' minutes')::INTERVAL;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get appointments for a date range
CREATE OR REPLACE FUNCTION public.get_appointments_by_date_range(
    p_branch_id UUID,
    p_start_date DATE,
    p_end_date DATE
)
RETURNS TABLE (
    id UUID,
    client_name TEXT,
    client_phone TEXT,
    service TEXT,
    date DATE,
    time TIME,
    duration INTEGER,
    status public.appointment_status,
    vehicle_info TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        a.id,
        a.client_name,
        a.client_phone,
        a.service,
        a.date,
        a.time,
        a.duration,
        a.status,
        CASE 
            WHEN v.id IS NOT NULL THEN 
                CONCAT(v.brand, ' ', v.model, ' (', v.license_plate, ')')
            ELSE NULL
        END as vehicle_info
    FROM public.appointments a
    LEFT JOIN public.vehicles v ON a.vehicle_id = v.id
    WHERE a.branch_id = p_branch_id
    AND a.date BETWEEN p_start_date AND p_end_date
    ORDER BY a.date, a.time;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.appointments IS 'Citas agendadas - puede ser desde portal público o interno';
COMMENT ON TYPE public.appointment_status IS 'Estados de cita: pending (pendiente confirmación), confirmed (confirmada), cancelled (cancelada), completed (completada/convertida a OT)';

COMMENT ON COLUMN public.appointments.client_id IS 'Referencia al cliente (NULL si es cita desde portal sin registro previo)';
COMMENT ON COLUMN public.appointments.vehicle_id IS 'Referencia al vehículo (NULL si es cita inicial)';
COMMENT ON COLUMN public.appointments.client_name IS 'Nombre del cliente (siempre requerido)';
COMMENT ON COLUMN public.appointments.duration IS 'Duración estimada en minutos (máximo 8 horas)';
COMMENT ON COLUMN public.appointments.has_parts IS 'Indica si el cliente ya tiene los repuestos necesarios';
COMMENT ON COLUMN public.appointments.reminder_sent IS 'Indica si se envió recordatorio automático';
