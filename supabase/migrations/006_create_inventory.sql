-- ============================================================================
-- Migration: 006 - Create Inventory
-- Description: Sistema de inventario con control de stock y movimientos
-- Author: Backend Architect
-- Date: 2025-12-14
-- ============================================================================

-- ============================================================================
-- 1. CREATE ENUM TYPES
-- ============================================================================

CREATE TYPE public.inventory_category AS ENUM (
    'repuestos',
    'aceites',
    'filtros',
    'neumaticos',
    'baterias',
    'herramientas',
    'consumibles',
    'otros'
);

CREATE TYPE public.inventory_stock_status AS ENUM (
    'in-stock',
    'low-stock',
    'out-of-stock'
);

CREATE TYPE public.inventory_movement_type AS ENUM (
    'in',
    'out',
    'adjustment',
    'transfer'
);

-- ============================================================================
-- 2. CREATE TABLES
-- ============================================================================

-- Inventory Items (Productos/Repuestos)
CREATE TABLE IF NOT EXISTS public.inventory_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    sku TEXT NOT NULL,
    name TEXT NOT NULL,
    description TEXT,
    category public.inventory_category NOT NULL,
    brand TEXT,
    price DECIMAL(10, 2) NOT NULL,
    cost DECIMAL(10, 2) NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 0,
    min_stock INTEGER NOT NULL DEFAULT 5,
    max_stock INTEGER,
    stock_status public.inventory_stock_status NOT NULL DEFAULT 'in-stock',
    supplier TEXT,
    supplier_code TEXT,
    location TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT inventory_items_sku_branch_unique UNIQUE (sku, branch_id),
    CONSTRAINT inventory_items_price_check CHECK (price >= 0),
    CONSTRAINT inventory_items_cost_check CHECK (cost >= 0),
    CONSTRAINT inventory_items_quantity_check CHECK (quantity >= 0),
    CONSTRAINT inventory_items_min_stock_check CHECK (min_stock >= 0),
    CONSTRAINT inventory_items_max_stock_check CHECK (max_stock IS NULL OR max_stock >= min_stock)
);

-- Inventory Movements (Movimientos de Stock)
CREATE TABLE IF NOT EXISTS public.inventory_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    item_id UUID NOT NULL REFERENCES public.inventory_items(id) ON DELETE RESTRICT,
    branch_id UUID NOT NULL REFERENCES public.branches(id) ON DELETE RESTRICT,
    type public.inventory_movement_type NOT NULL,
    quantity INTEGER NOT NULL,
    previous_quantity INTEGER NOT NULL,
    new_quantity INTEGER NOT NULL,
    reason TEXT,
    order_id UUID REFERENCES public.work_orders(id) ON DELETE SET NULL,
    transfer_to_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    transfer_from_branch_id UUID REFERENCES public.branches(id) ON DELETE SET NULL,
    user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE RESTRICT,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Constraints
    CONSTRAINT inventory_movements_quantity_check CHECK (quantity > 0),
    CONSTRAINT inventory_movements_calc_check CHECK (
        (type = 'in' AND new_quantity = previous_quantity + quantity) OR
        (type = 'out' AND new_quantity = previous_quantity - quantity) OR
        (type = 'adjustment') OR
        (type = 'transfer')
    ),
    CONSTRAINT inventory_movements_transfer_check CHECK (
        (type = 'transfer' AND transfer_to_branch_id IS NOT NULL) OR
        (type != 'transfer' AND transfer_to_branch_id IS NULL)
    )
);

-- ============================================================================
-- 3. CREATE INDEXES
-- ============================================================================

-- Inventory Items indexes
CREATE INDEX idx_inventory_items_branch ON public.inventory_items(branch_id);
CREATE INDEX idx_inventory_items_category ON public.inventory_items(category);
CREATE INDEX idx_inventory_items_sku ON public.inventory_items(sku);
CREATE INDEX idx_inventory_items_stock_status ON public.inventory_items(stock_status);
CREATE INDEX idx_inventory_items_branch_category ON public.inventory_items(branch_id, category);
CREATE INDEX idx_inventory_items_branch_stock_status ON public.inventory_items(branch_id, stock_status);
CREATE INDEX idx_inventory_items_is_active ON public.inventory_items(is_active) WHERE is_active = true;
CREATE INDEX idx_inventory_items_low_stock ON public.inventory_items(branch_id, stock_status) WHERE stock_status = 'low-stock';
CREATE INDEX idx_inventory_items_name_search ON public.inventory_items USING gin(to_tsvector('spanish', name));

-- Inventory Movements indexes
CREATE INDEX idx_inventory_movements_item ON public.inventory_movements(item_id);
CREATE INDEX idx_inventory_movements_branch ON public.inventory_movements(branch_id);
CREATE INDEX idx_inventory_movements_type ON public.inventory_movements(type);
CREATE INDEX idx_inventory_movements_order ON public.inventory_movements(order_id) WHERE order_id IS NOT NULL;
CREATE INDEX idx_inventory_movements_user ON public.inventory_movements(user_id);
CREATE INDEX idx_inventory_movements_created_at ON public.inventory_movements(created_at DESC);
CREATE INDEX idx_inventory_movements_transfer_to ON public.inventory_movements(transfer_to_branch_id) WHERE transfer_to_branch_id IS NOT NULL;

-- ============================================================================
-- 4. CREATE TRIGGERS
-- ============================================================================

CREATE TRIGGER update_inventory_items_updated_at
    BEFORE UPDATE ON public.inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger to automatically update stock_status
CREATE OR REPLACE FUNCTION public.update_inventory_stock_status()
RETURNS TRIGGER AS $$
BEGIN
    -- Update stock_status based on quantity
    IF NEW.quantity = 0 THEN
        NEW.stock_status := 'out-of-stock';
    ELSIF NEW.quantity <= NEW.min_stock THEN
        NEW.stock_status := 'low-stock';
    ELSE
        NEW.stock_status := 'in-stock';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_stock_status_on_quantity_change
    BEFORE INSERT OR UPDATE OF quantity ON public.inventory_items
    FOR EACH ROW
    EXECUTE FUNCTION public.update_inventory_stock_status();

-- ============================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ============================================================================

ALTER TABLE public.inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.inventory_movements ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- 6. CREATE RLS POLICIES
-- ============================================================================

-- Inventory Items Policies
-- Users can view inventory in their branches
CREATE POLICY "Users can view inventory in their branches"
    ON public.inventory_items
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

-- Admins and managers can create inventory items
CREATE POLICY "Admins and managers can create inventory"
    ON public.inventory_items
    FOR INSERT
    WITH CHECK (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'manager')
        )
    );

-- Admins and managers can update inventory items
CREATE POLICY "Admins and managers can update inventory"
    ON public.inventory_items
    FOR UPDATE
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
            AND u.role IN ('admin', 'manager')
        )
    );

-- Only admins can delete inventory items
CREATE POLICY "Admins can delete inventory"
    ON public.inventory_items
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

-- Inventory Movements Policies
-- Users can view movements in their branches
CREATE POLICY "Users can view inventory movements in their branches"
    ON public.inventory_movements
    FOR SELECT
    USING (
        branch_id IN (
            SELECT b.id
            FROM public.branches b
            INNER JOIN public.users u ON u.organization_id = b.organization_id
            WHERE u.id = auth.uid()
        )
    );

-- Staff can create movements
CREATE POLICY "Staff can create inventory movements"
    ON public.inventory_movements
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

-- ============================================================================
-- 7. CREATE HELPER FUNCTIONS
-- ============================================================================

-- Function to register inventory movement
CREATE OR REPLACE FUNCTION public.register_inventory_movement(
    p_item_id UUID,
    p_type public.inventory_movement_type,
    p_quantity INTEGER,
    p_reason TEXT DEFAULT NULL,
    p_order_id UUID DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_movement_id UUID;
    v_item RECORD;
    v_new_quantity INTEGER;
    v_user_id UUID;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Get current item details
    SELECT * INTO v_item
    FROM public.inventory_items
    WHERE id = p_item_id
    FOR UPDATE;
    
    IF v_item IS NULL THEN
        RAISE EXCEPTION 'Inventory item not found';
    END IF;
    
    -- Calculate new quantity
    CASE p_type
        WHEN 'in' THEN
            v_new_quantity := v_item.quantity + p_quantity;
        WHEN 'out' THEN
            IF v_item.quantity < p_quantity THEN
                RAISE EXCEPTION 'Insufficient stock. Available: %, Requested: %', v_item.quantity, p_quantity;
            END IF;
            v_new_quantity := v_item.quantity - p_quantity;
        WHEN 'adjustment' THEN
            v_new_quantity := p_quantity;
        ELSE
            RAISE EXCEPTION 'Invalid movement type';
    END CASE;
    
    -- Create movement record
    INSERT INTO public.inventory_movements (
        item_id,
        branch_id,
        type,
        quantity,
        previous_quantity,
        new_quantity,
        reason,
        order_id,
        user_id
    ) VALUES (
        p_item_id,
        v_item.branch_id,
        p_type,
        p_quantity,
        v_item.quantity,
        v_new_quantity,
        p_reason,
        p_order_id,
        v_user_id
    )
    RETURNING id INTO v_movement_id;
    
    -- Update item quantity
    UPDATE public.inventory_items
    SET quantity = v_new_quantity
    WHERE id = p_item_id;
    
    RETURN v_movement_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to transfer stock between branches
CREATE OR REPLACE FUNCTION public.transfer_stock_between_branches(
    p_item_sku TEXT,
    p_from_branch_id UUID,
    p_to_branch_id UUID,
    p_quantity INTEGER,
    p_reason TEXT DEFAULT NULL
)
RETURNS BOOLEAN AS $$
DECLARE
    v_from_item RECORD;
    v_to_item RECORD;
    v_user_id UUID;
    v_user_can_transfer BOOLEAN;
BEGIN
    -- Get current user
    v_user_id := auth.uid();
    
    -- Check if user has transfer permission
    SELECT can_transfer_stock INTO v_user_can_transfer
    FROM public.user_branch_permissions
    WHERE user_id = v_user_id
    AND branch_id = p_from_branch_id;
    
    IF NOT v_user_can_transfer THEN
        RAISE EXCEPTION 'User does not have permission to transfer stock';
    END IF;
    
    -- Get source item
    SELECT * INTO v_from_item
    FROM public.inventory_items
    WHERE sku = p_item_sku
    AND branch_id = p_from_branch_id
    FOR UPDATE;
    
    IF v_from_item IS NULL THEN
        RAISE EXCEPTION 'Item not found in source branch';
    END IF;
    
    IF v_from_item.quantity < p_quantity THEN
        RAISE EXCEPTION 'Insufficient stock in source branch';
    END IF;
    
    -- Get or create destination item
    SELECT * INTO v_to_item
    FROM public.inventory_items
    WHERE sku = p_item_sku
    AND branch_id = p_to_branch_id
    FOR UPDATE;
    
    IF v_to_item IS NULL THEN
        -- Create item in destination branch
        INSERT INTO public.inventory_items (
            branch_id,
            sku,
            name,
            description,
            category,
            brand,
            price,
            cost,
            quantity,
            min_stock,
            max_stock,
            supplier,
            supplier_code,
            location,
            image_url
        )
        SELECT
            p_to_branch_id,
            sku,
            name,
            description,
            category,
            brand,
            price,
            cost,
            0, -- Start with 0, will be updated by movement
            min_stock,
            max_stock,
            supplier,
            supplier_code,
            location,
            image_url
        FROM public.inventory_items
        WHERE id = v_from_item.id
        RETURNING * INTO v_to_item;
    END IF;
    
    -- Register movement OUT from source
    INSERT INTO public.inventory_movements (
        item_id,
        branch_id,
        type,
        quantity,
        previous_quantity,
        new_quantity,
        reason,
        transfer_to_branch_id,
        user_id
    ) VALUES (
        v_from_item.id,
        p_from_branch_id,
        'transfer',
        p_quantity,
        v_from_item.quantity,
        v_from_item.quantity - p_quantity,
        p_reason,
        p_to_branch_id,
        v_user_id
    );
    
    -- Register movement IN to destination
    INSERT INTO public.inventory_movements (
        item_id,
        branch_id,
        type,
        quantity,
        previous_quantity,
        new_quantity,
        reason,
        transfer_from_branch_id,
        user_id
    ) VALUES (
        v_to_item.id,
        p_to_branch_id,
        'transfer',
        p_quantity,
        v_to_item.quantity,
        v_to_item.quantity + p_quantity,
        p_reason,
        p_from_branch_id,
        v_user_id
    );
    
    -- Update quantities
    UPDATE public.inventory_items
    SET quantity = quantity - p_quantity
    WHERE id = v_from_item.id;
    
    UPDATE public.inventory_items
    SET quantity = quantity + p_quantity
    WHERE id = v_to_item.id;
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search inventory items
CREATE OR REPLACE FUNCTION public.search_inventory_items(
    p_branch_id UUID,
    p_search_term TEXT DEFAULT NULL,
    p_category public.inventory_category DEFAULT NULL,
    p_stock_status public.inventory_stock_status DEFAULT NULL
)
RETURNS TABLE (
    id UUID,
    sku TEXT,
    name TEXT,
    category public.inventory_category,
    brand TEXT,
    price DECIMAL,
    quantity INTEGER,
    stock_status public.inventory_stock_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.sku,
        i.name,
        i.category,
        i.brand,
        i.price,
        i.quantity,
        i.stock_status
    FROM public.inventory_items i
    WHERE i.branch_id = p_branch_id
    AND i.is_active = true
    AND (p_search_term IS NULL OR (
        i.name ILIKE '%' || p_search_term || '%' OR
        i.sku ILIKE '%' || p_search_term || '%' OR
        i.brand ILIKE '%' || p_search_term || '%'
    ))
    AND (p_category IS NULL OR i.category = p_category)
    AND (p_stock_status IS NULL OR i.stock_status = p_stock_status)
    ORDER BY i.name;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get low stock items
CREATE OR REPLACE FUNCTION public.get_low_stock_items(p_branch_id UUID)
RETURNS TABLE (
    id UUID,
    sku TEXT,
    name TEXT,
    quantity INTEGER,
    min_stock INTEGER,
    stock_status public.inventory_stock_status
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.sku,
        i.name,
        i.quantity,
        i.min_stock,
        i.stock_status
    FROM public.inventory_items i
    WHERE i.branch_id = p_branch_id
    AND i.is_active = true
    AND i.stock_status IN ('low-stock', 'out-of-stock')
    ORDER BY i.stock_status DESC, i.quantity ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- 8. COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE public.inventory_items IS 'Inventario de productos y repuestos por sucursal';
COMMENT ON TABLE public.inventory_movements IS 'Historial de movimientos de inventario - entrada, salida, ajustes, transferencias';

COMMENT ON TYPE public.inventory_category IS 'Categorías de productos: repuestos, aceites, filtros, neumáticos, baterías, herramientas, consumibles, otros';
COMMENT ON TYPE public.inventory_stock_status IS 'Estado de stock: in-stock (disponible), low-stock (stock bajo), out-of-stock (agotado)';
COMMENT ON TYPE public.inventory_movement_type IS 'Tipos de movimiento: in (entrada), out (salida), adjustment (ajuste), transfer (transferencia entre sucursales)';

COMMENT ON COLUMN public.inventory_items.sku IS 'Código SKU único por sucursal';
COMMENT ON COLUMN public.inventory_items.price IS 'Precio de venta al cliente';
COMMENT ON COLUMN public.inventory_items.cost IS 'Costo de adquisición';
COMMENT ON COLUMN public.inventory_items.stock_status IS 'Calculado automáticamente según quantity vs min_stock';
COMMENT ON COLUMN public.inventory_movements.transfer_to_branch_id IS 'Sucursal destino (solo para type=transfer)';
COMMENT ON COLUMN public.inventory_movements.transfer_from_branch_id IS 'Sucursal origen (solo para type=transfer)';
