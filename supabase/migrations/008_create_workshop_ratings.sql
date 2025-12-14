-- ============================================================================
-- Migration: 008 - Create Workshop Ratings
-- Description: Sistema de calificaciones para talleres (usado por Portal Cliente)
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- 1. CREATE TABLES
-- ============================================================================

-- Workshop Ratings (Calificaciones para Portal Cliente)
CREATE TABLE IF NOT EXISTS public.workshop_ratings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE CASCADE,
    client_name TEXT NOT NULL,
    client_email TEXT,
    rating INTEGER NOT NULL,
    review TEXT,
    work_order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
    is_verified BOOLEAN DEFAULT false,
    is_public BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT workshop_ratings_rating_check CHECK (rating >= 1 AND rating <= 5),
    CONSTRAINT workshop_ratings_email_check CHECK (client_email IS NULL OR client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}$')
);

-- ============================================================================
-- 2. CREATE INDEXES
-- ============================================================================

CREATE INDEX idx_workshop_ratings_branch ON public.workshop_ratings(branch_id);
CREATE INDEX idx_workshop_ratings_rating ON public.workshop_ratings(rating);
CREATE INDEX idx_workshop_ratings_is_public ON public.workshop_ratings(branch_id, is_public) WHERE is_public = true;
CREATE INDEX idx_workshop_ratings_is_verified ON public.workshop_ratings(branch_id, is_verified) WHERE is_verified = true;
CREATE INDEX idx_workshop_ratings_created_at ON public.workshop_ratings(created_at DESC);
CREATE INDEX idx_workshop_ratings_work_order ON public.workshop_ratings(work_order_id) WHERE work_order_id IS NOT NULL;

-- ============================================================================
-- 3. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.workshop_ratings ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 4. CREATE RLS POLICIES
-- ============================================================================

-- Public can view public ratings
CREATE POLICY "Public can view public ratings"
    ON public.workshop_ratings
    FOR SELECT
    USING (is_public = true);

-- Users can view ratings for their organization branches
CREATE POLICY "Users can view all ratings for their branches"
    ON public.workshop_ratings
    FOR SELECT
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
        )
    );

-- Public can create ratings (from portal)
CREATE POLICY "Public can create ratings"
    ON public.workshop_ratings
    FOR INSERT
    WITH CHECK (true);

-- Admins can update ratings (verify, make public/private)
CREATE POLICY "Admins can update ratings"
    ON public.workshop_ratings
    FOR UPDATE
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND u.role = 'admin'
        )
    );

-- Admins can delete ratings
CREATE POLICY "Admins can delete ratings"
    ON public.workshop_ratings
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
-- 5. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to add workshop rating
CREATE OR REPLACE FUNCTION public.add_workshop_rating(
    p_branch_id UUID,
    p_client_name TEXT,
    p_client_email TEXT DEFAULT NULL,
    p_rating INTEGER DEFAULT NULL,
    p_review TEXT DEFAULT NULL,
    p_work_order_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_rating_id UUID;
BEGIN
    -- Validate rating
    IF p_rating < 1 OR p_rating > 5 THEN
        RAISE EXCEPTION 'Rating must be between 1 and 5';
    END IF;
    
    -- Validate that work order belongs to branch if provided
    IF p_work_order_id IS NOT NULL THEN
        IF NOT EXISTS (
            SELECT 1
            FROM public.work_orders
            WHERE id = p_work_order_id
            AND branch_id = p_branch_id
        ) THEN
            RAISE EXCEPTION 'Work order does not belong to this branch';
        END IF;
    END IF;
    
    INSERT INTO public.workshop_ratings (
        branch_id,
        client_name,
        client_email,
        rating,
        review,
        work_order_id,
        is_verified
    ) VALUES (
        p_branch_id,
        p_client_name,
        p_client_email,
        p_rating,
        p_review,
        p_work_order_id,
        p_work_order_id IS NOT NULL -- Auto-verify if linked to work order
    )
    RETURNING id INTO v_rating_id;
    
    RETURN v_rating_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get branch average rating
CREATE OR REPLACE FUNCTION public.get_branch_average_rating(p_branch_id UUID)
RETURNS TABLE (
    average_rating DECIMAL,
    total_ratings BIGINT,
    rating_distribution JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ROUND(AVG(rating)::NUMERIC, 2) as average_rating,
        COUNT(*) as total_ratings,
        jsonb_build_object(
            '5_stars', COUNT(*) FILTER (WHERE rating = 5),
            '4_stars', COUNT(*) FILTER (WHERE rating = 4),
            '3_stars', COUNT(*) FILTER (WHERE rating = 3),
            '2_stars', COUNT(*) FILTER (WHERE rating = 2),
            '1_star', COUNT(*) FILTER (WHERE rating = 1)
        ) as rating_distribution
    FROM public.workshop_ratings
    WHERE branch_id = p_branch_id
    AND is_public = true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search nearby workshops with ratings
CREATE OR REPLACE FUNCTION public.search_nearby_workshops(
    p_latitude DECIMAL,
    p_longitude DECIMAL,
    p_radius_km INTEGER DEFAULT 10,
    p_specialty TEXT DEFAULT NULL,
    p_min_rating DECIMAL DEFAULT NULL
)
RETURNS TABLE (
    branch_id UUID,
    branch_name TEXT,
    branch_address TEXT,
    branch_city TEXT,
    branch_phone TEXT,
    distance_km DECIMAL,
    average_rating DECIMAL,
    total_ratings BIGINT,
    is_open BOOLEAN
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.address,
        b.city,
        b.phone,
        ROUND(
            (6371 * acos(
                cos(radians(p_latitude)) * 
                cos(radians(b.latitude)) * 
                cos(radians(b.longitude) - radians(p_longitude)) + 
                sin(radians(p_latitude)) * 
                sin(radians(b.latitude))
            ))::NUMERIC,
            2
        ) as distance_km,
        COALESCE(ROUND(AVG(r.rating)::NUMERIC, 2), 0) as average_rating,
        COUNT(r.id) as total_ratings,
        b.is_active as is_open
    FROM public.branches b
    LEFT JOIN public.workshop_ratings r ON b.id = r.branch_id AND r.is_public = true
    WHERE b.is_active = true
    AND b.latitude IS NOT NULL
    AND b.longitude IS NOT NULL
    AND (
        6371 * acos(
            cos(radians(p_latitude)) * 
            cos(radians(b.latitude)) * 
            cos(radians(b.longitude) - radians(p_longitude)) + 
            sin(radians(p_latitude)) * 
            sin(radians(b.latitude))
        )
    ) <= p_radius_km
    GROUP BY b.id, b.name, b.address, b.city, b.phone, b.latitude, b.longitude, b.is_active
    HAVING (p_min_rating IS NULL OR COALESCE(AVG(r.rating), 0) >= p_min_rating)
    ORDER BY distance_km ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get recent ratings for a branch
CREATE OR REPLACE FUNCTION public.get_recent_ratings(
    p_branch_id UUID,
    p_limit INTEGER DEFAULT 10
)
RETURNS TABLE (
    id UUID,
    client_name TEXT,
    rating INTEGER,
    review TEXT,
    is_verified BOOLEAN,
    created_at TIMESTAMPTZ
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        r.id,
        r.client_name,
        r.rating,
        r.review,
        r.is_verified,
        r.created_at
    FROM public.workshop_ratings r
    WHERE r.branch_id = p_branch_id
    AND r.is_public = true
    ORDER BY r.created_at DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get top rated branches in a city
CREATE OR REPLACE FUNCTION public.get_top_rated_branches(
    p_city TEXT DEFAULT NULL,
    p_limit INTEGER DEFAULT 10,
    p_min_ratings INTEGER DEFAULT 5
)
RETURNS TABLE (
    branch_id UUID,
    branch_name TEXT,
    branch_city TEXT,
    average_rating DECIMAL,
    total_ratings BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        b.id,
        b.name,
        b.city,
        ROUND(AVG(r.rating)::NUMERIC, 2) as average_rating,
        COUNT(r.id) as total_ratings
    FROM public.branches b
    INNER JOIN public.workshop_ratings r ON b.id = r.branch_id AND r.is_public = true
    WHERE b.is_active = true
    AND (p_city IS NULL OR b.city = p_city)
    GROUP BY b.id, b.name, b.city
    HAVING COUNT(r.id) >= p_min_ratings
    ORDER BY average_rating DESC, total_ratings DESC
    LIMIT p_limit;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 6. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.workshop_ratings IS 'Calificaciones y reseñas de talleres - usado por Portal Cliente (/portal/buscar-talleres)';

COMMENT ON COLUMN public.workshop_ratings.rating IS 'Calificación de 1 a 5 estrellas';
COMMENT ON COLUMN public.workshop_ratings.is_verified IS 'Indica si la calificación está verificada (ej: vinculada a una OT real)';
COMMENT ON COLUMN public.workshop_ratings.is_public IS 'Indica si la calificación es visible públicamente';
COMMENT ON COLUMN public.workshop_ratings.work_order_id IS 'Referencia a OT (si la calificación viene de un cliente que usó el servicio)';
