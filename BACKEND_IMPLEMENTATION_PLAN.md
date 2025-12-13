# 📋 Plan de Implementación Backend - TallerMS en Supabase

## 🎯 Objetivo del Proyecto

Implementar completamente el backend de la aplicación TallerMS utilizando Supabase (PostgreSQL + Auth + RLS + Edge Functions + Storage) para dar funcionalidad a todos los módulos del frontend existente.

## 🧠 Análisis del Frontend

### Módulos Identificados

1. **Dashboard** (`/dashboard`)
   - Vista general con KPIs
   - Órdenes activas
   - Citas del día
   - Alertas de stock bajo
   - Búsqueda rápida

2. **Órdenes de Trabajo** (`/ordenes`)
   - Lista de órdenes
   - Filtros por estado y sucursal
   - Creación de nuevas OT
   - Detalle de OT
   - Gestión de repuestos por OT
   - Asignación de mecánicos

3. **Clientes** (`/clientes`)
   - Lista y búsqueda de clientes
   - Perfil de cliente
   - Gestión de vehículos por cliente
   - Historial de servicios

4. **Vehículos**
   - Datos del vehículo (patente, marca, modelo, año)
   - Vinculación con cliente
   - Historial de servicios

5. **Citas** (`/citas`)
   - Calendario semanal
   - Lista de citas
   - Estados: pendiente, confirmada, cancelada, completada
   - Agendar nuevas citas

6. **Inventario** (`/inventario`)
   - Lista de productos/repuestos
   - Filtros por categoría y sucursal
   - Control de stock (actual, mínimo, máximo)
   - Alertas de stock bajo
   - Movimientos de inventario
   - Escaneo de código de barras

7. **Usuarios** (`/usuarios`)
   - Gestión de equipo
   - Roles: admin, manager, mechanic, receptionist, viewer
   - Permisos por sucursal

8. **Sucursales** (`/sucursales`)
   - Sistema multi-sucursal
   - Gestión de sucursales
   - Vista global vs. vista por sucursal

9. **Portal Cliente** (`/portal`)
   - Búsqueda de talleres cercanos
   - Consulta de disponibilidad de repuestos
   - Agendar citas públicas
   - Historial de vehículo

10. **Marketplace** (`/marketplace`)
    - Búsqueda de talleres
    - Filtros por distancia y especialidad
    - Calificaciones y reseñas

11. **Configuración** (`/configuracion`)
    - Datos de la empresa
    - Notificaciones
    - Preferencias

### Roles de Usuario Identificados

- **admin**: Administrador global (acceso a todas las sucursales, equivalente a owner)
- **manager**: Gerente de sucursal (acceso a su sucursal)
- **mechanic**: Mecánico (visualiza y actualiza OT asignadas)
- **receptionist**: Recepcionista (gestiona citas y clientes)
- **viewer**: Solo lectura

*Nota: El rol de "owner" se implementa usando el rol "admin" con permisos completos en la organización.*

## 🗄️ Modelo de Datos Propuesto

### Entidades Principales

#### 1. Organizations (Organizaciones/Talleres)
```sql
organizations
  - id (uuid, PK)
  - name (text)
  - rut (text, unique)
  - email (text)
  - phone (text)
  - address (text)
  - logo_url (text)
  - is_active (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 2. Branches (Sucursales)
```sql
branches
  - id (uuid, PK)
  - organization_id (uuid, FK -> organizations)
  - name (text)
  - code (text) -- "SUC-001"
  - address (text)
  - city (text)
  - phone (text)
  - email (text)
  - latitude (decimal)
  - longitude (decimal)
  - is_active (boolean)
  - is_main (boolean)
  - manager_name (text)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 3. Users (Usuarios del Sistema)
```sql
users
  - id (uuid, PK, references auth.users)
  - organization_id (uuid, FK -> organizations)
  - email (text, unique)
  - first_name (text)
  - last_name (text)
  - phone (text)
  - role (enum: admin, manager, mechanic, receptionist, viewer)
  - default_branch_id (uuid, FK -> branches)
  - avatar_url (text)
  - is_active (boolean)
  - last_login_at (timestamptz)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 4. User Branch Permissions (Permisos por Sucursal)
```sql
user_branch_permissions
  - id (uuid, PK)
  - user_id (uuid, FK -> users)
  - branch_id (uuid, FK -> branches)
  - can_transfer_stock (boolean)
  - can_view_reports (boolean)
  - created_at (timestamptz)
```

#### 5. Clients (Clientes)
```sql
clients
  - id (uuid, PK)
  - organization_id (uuid, FK -> organizations)
  - type (enum: individual, business)
  - first_name (text)
  - last_name (text)
  - email (text)
  - phone (text)
  - secondary_phone (text)
  - address (text)
  - city (text)
  - rut (text)
  - business_name (text)
  - tax_id (text)
  - notes (text)
  - preferred_branch_id (uuid, FK -> branches)
  - is_active (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 6. Vehicles (Vehículos)
```sql
vehicles
  - id (uuid, PK)
  - client_id (uuid, FK -> clients)
  - license_plate (text, unique)
  - brand (text)
  - model (text)
  - year (integer)
  - color (text)
  - vin (text)
  - engine_number (text)
  - transmission (enum: manual, automatic)
  - fuel_type (enum: gasoline, diesel, electric, hybrid)
  - mileage (integer)
  - last_service_date (date)
  - next_service_date (date)
  - notes (text)
  - is_active (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 7. Work Orders (Órdenes de Trabajo)
```sql
work_orders
  - id (uuid, PK)
  - order_number (text, unique) -- "OT-001"
  - branch_id (uuid, FK -> branches)
  - client_id (uuid, FK -> clients)
  - vehicle_id (uuid, FK -> vehicles)
  - service (text)
  - description (text)
  - status (enum: pending, in-progress, completed, cancelled)
  - labor_cost (decimal)
  - parts_cost (decimal)
  - estimated_cost (decimal)
  - final_cost (decimal)
  - assigned_mechanic_id (uuid, FK -> users)
  - start_date (date)
  - estimated_completion_date (date)
  - completion_date (date)
  - notes (text)
  - created_by (uuid, FK -> users)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 8. Work Order Parts (Repuestos de OT)
```sql
work_order_parts
  - id (uuid, PK)
  - work_order_id (uuid, FK -> work_orders)
  - inventory_item_id (uuid, FK -> inventory_items, nullable)
  - name (text)
  - quantity (integer)
  - unit_price (decimal)
  - total (decimal)
  - created_at (timestamptz)
```

#### 9. Appointments (Citas)
```sql
appointments
  - id (uuid, PK)
  - branch_id (uuid, FK -> branches)
  - client_id (uuid, FK -> clients, nullable)
  - vehicle_id (uuid, FK -> vehicles, nullable)
  - client_name (text)
  - client_phone (text)
  - client_email (text)
  - service (text)
  - date (date)
  - time (time)
  - duration (integer) -- en minutos
  - status (enum: pending, confirmed, cancelled, completed)
  - has_parts (boolean)
  - notes (text)
  - reminder_sent (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 10. Inventory Items (Productos/Repuestos)
```sql
inventory_items
  - id (uuid, PK)
  - branch_id (uuid, FK -> branches)
  - sku (text, unique per branch)
  - name (text)
  - description (text)
  - category (enum: repuestos, aceites, filtros, neumaticos, baterias, herramientas, consumibles, otros)
  - brand (text)
  - price (decimal)
  - cost (decimal)
  - quantity (integer)
  - min_stock (integer)
  - max_stock (integer)
  - stock_status (enum: in-stock, low-stock, out-of-stock)
  - supplier (text)
  - supplier_code (text)
  - location (text)
  - image_url (text)
  - is_active (boolean)
  - created_at (timestamptz)
  - updated_at (timestamptz)
```

#### 11. Inventory Movements (Movimientos de Stock)
```sql
inventory_movements
  - id (uuid, PK)
  - item_id (uuid, FK -> inventory_items)
  - branch_id (uuid, FK -> branches)
  - type (enum: in, out, adjustment, transfer)
  - quantity (integer)
  - previous_quantity (integer)
  - new_quantity (integer)
  - reason (text)
  - order_id (uuid, FK -> work_orders, nullable)
  - user_id (uuid, FK -> users)
  - created_at (timestamptz)
```

#### 12. Audit Logs (Auditoría)
```sql
audit_logs
  - id (uuid, PK)
  - organization_id (uuid, FK -> organizations)
  - user_id (uuid, FK -> users)
  - table_name (text)
  - record_id (uuid)
  - action (enum: create, update, delete)
  - old_values (jsonb)
  - new_values (jsonb)
  - ip_address (text)
  - created_at (timestamptz)
```

#### 13. Notifications (Notificaciones)
```sql
notifications
  - id (uuid, PK)
  - user_id (uuid, FK -> users)
  - type (enum: stock_alert, appointment_reminder, order_update)
  - title (text)
  - message (text)
  - data (jsonb)
  - is_read (boolean)
  - created_at (timestamptz)
```

#### 14. Workshop Ratings (Calificaciones - Marketplace)
```sql
workshop_ratings
  - id (uuid, PK)
  - branch_id (uuid, FK -> branches)
  - client_name (text)
  - rating (integer) -- 1-5
  - review (text)
  - created_at (timestamptz)
```

### Relaciones Clave

- Una **Organization** tiene muchas **Branches**
- Una **Organization** tiene muchos **Users**
- Un **User** pertenece a una **Organization** y tiene permisos en múltiples **Branches**
- Un **Client** pertenece a una **Organization** y tiene muchos **Vehicles**
- Una **Work Order** pertenece a un **Client**, **Vehicle** y **Branch**
- Un **Appointment** pertenece a un **Branch** y opcionalmente a **Client** y **Vehicle**
- Un **Inventory Item** pertenece a un **Branch**

## 🔐 Estrategia de Row Level Security (RLS)

### Principios de Seguridad

1. **Aislamiento por Organización**: Los datos de una organización NUNCA son visibles para otra
2. **Filtro por Sucursal**: Los usuarios con acceso limitado solo ven datos de sus sucursales
3. **Control por Rol**: Admin global > Manager > Mechanic > Receptionist > Viewer
4. **Auditoría**: Todos los cambios sensibles se registran

### Políticas RLS por Tabla

#### Organizations
- Solo el usuario autenticado puede ver su propia organización
- Solo admin puede actualizar

#### Branches
- Ver: Usuario con acceso a la organización
- Crear/Actualizar: Solo admin o manager

#### Users
- Ver: Usuarios de la misma organización
- Crear: Solo admin
- Actualizar: Admin o el propio usuario

#### Clients, Vehicles
- Ver: Usuarios de la organización
- Crear/Actualizar: Admin, manager, receptionist

#### Work Orders
- Ver: Usuarios con acceso a la sucursal de la OT
- Crear: Admin, manager, receptionist
- Actualizar: Admin, manager, mecánico asignado

#### Appointments
- Ver: Usuarios con acceso a la sucursal
- Crear: Admin, manager, receptionist, portal público
- Actualizar: Admin, manager, receptionist

#### Inventory
- Ver: Usuarios con acceso a la sucursal
- Crear/Actualizar: Admin, manager
- Transferir: Solo si tiene permiso can_transfer_stock

## ⚙️ Funciones y Triggers

### Funciones de Negocio

1. **create_work_order()**: Validar cliente, vehículo, calcular costos
2. **update_work_order_status()**: Notificar cliente, actualizar stock si completada
3. **register_inventory_movement()**: Actualizar stock, crear log
4. **transfer_stock_between_branches()**: Validar permisos, registrar movimientos
5. **schedule_appointment()**: Validar disponibilidad, enviar confirmación
6. **convert_appointment_to_order()**: Crear OT desde cita
7. **get_dashboard_kpis()**: Calcular métricas para dashboard
8. **get_vehicle_history()**: Historial completo de servicios
9. **search_nearby_workshops()**: Para marketplace (geolocalización)
10. **check_parts_availability()**: Consulta pública de repuestos

### Triggers

1. **on_work_order_completed**: Actualizar stock automáticamente
2. **on_inventory_low_stock**: Crear notificación de alerta
3. **on_appointment_created**: Programar recordatorio 24h antes
4. **on_user_created**: Crear registro en tabla users desde auth.users
5. **update_stock_status**: Actualizar automáticamente (in-stock, low-stock, out-of-stock)

## 📊 Storage (Supabase Storage)

### Buckets

1. **avatars**: Fotos de perfil de usuarios
   - Política: Lectura pública, escritura solo propietario
   
2. **inventory-images**: Fotos de productos
   - Política: Lectura pública, escritura admin/manager
   
3. **work-order-documents**: Documentos de OT (facturas, reportes)
   - Política: Lectura solo usuarios de la organización
   
4. **organization-logos**: Logos de empresas
   - Política: Lectura pública, escritura admin

## 🌐 Edge Functions

### Endpoints Públicos

1. **/search-workshops**: Buscar talleres cercanos (geolocalización)
2. **/check-parts**: Consultar disponibilidad de repuestos
3. **/book-appointment**: Agendar cita (acceso público)

### Endpoints Internos

1. **/send-email**: Enviar emails transaccionales
2. **/send-notification**: Push notifications
3. **/export-order-pdf**: Exportar OT a PDF
4. **/export-report**: Exportar reportes a Excel

## 🔍 Índices y Optimizaciones

### Índices Recomendados

```sql
-- Work Orders
CREATE INDEX idx_work_orders_branch_status ON work_orders(branch_id, status);
CREATE INDEX idx_work_orders_client ON work_orders(client_id);
CREATE INDEX idx_work_orders_date ON work_orders(start_date DESC);

-- Inventory
CREATE INDEX idx_inventory_branch_category ON inventory_items(branch_id, category);
CREATE INDEX idx_inventory_stock_status ON inventory_items(stock_status) WHERE stock_status = 'low-stock';

-- Appointments
CREATE INDEX idx_appointments_branch_date ON appointments(branch_id, date, time);
CREATE INDEX idx_appointments_status ON appointments(status) WHERE status != 'completed';

-- Vehicles
CREATE INDEX idx_vehicles_client ON vehicles(client_id);
CREATE INDEX idx_vehicles_plate ON vehicles(license_plate);
```

## 📝 Plan de Ejecución por Fases

### Fase 1: Setup y Estructura Base (Días 1-2)
1. Crear proyecto en Supabase
2. Configurar variables de entorno
3. Crear tablas base (organizations, branches, users, user_branch_permissions)
4. Configurar Supabase Auth
5. Implementar RLS básico

### Fase 2: Módulo de Clientes y Vehículos (Día 3)
1. Crear tablas clients y vehicles
2. Implementar RLS
3. Crear funciones CRUD

### Fase 3: Módulo de Órdenes de Trabajo (Días 4-5)
1. Crear tablas work_orders y work_order_parts
2. Implementar RLS
3. Crear funciones de negocio
4. Triggers automáticos

### Fase 4: Módulo de Inventario (Días 6-7)
1. Crear tablas inventory_items y inventory_movements
2. Implementar RLS
3. Funciones de movimientos de stock
4. Alertas de stock bajo

### Fase 5: Módulo de Citas (Día 8)
1. Crear tabla appointments
2. Implementar RLS
3. Funciones de agendamiento
4. Validación de disponibilidad

### Fase 6: Storage y Edge Functions (Días 9-10)
1. Configurar buckets de Storage
2. Crear Edge Functions para API pública
3. Funciones de exportación y emails

### Fase 7: Auditoría y Notificaciones (Día 11)
1. Crear tablas audit_logs y notifications
2. Triggers de auditoría
3. Sistema de notificaciones

### Fase 8: Marketplace (Día 12)
1. Tabla workshop_ratings
2. Funciones de geolocalización
3. API pública para búsqueda

### Fase 9: Testing y Optimización (Días 13-14)
1. Testing de RLS
2. Testing de funciones
3. Optimización de queries
4. Creación de índices

### Fase 10: Documentación y Deploy (Día 15)
1. Documentación completa
2. Scripts de migración
3. Datos semilla
4. Integración con frontend

## 📚 Documentación Técnica

### Variables de Entorno Necesarias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Database (opcional, para migraciones)
DATABASE_URL=postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres

# SMTP (para emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# Storage
NEXT_PUBLIC_STORAGE_URL=https://your-project.supabase.co/storage/v1
```

### Estructura de Carpetas Supabase

```
supabase/
├── migrations/
│   ├── 001_create_organizations_and_branches.sql
│   ├── 002_create_users_and_permissions.sql
│   ├── 003_create_clients_and_vehicles.sql
│   ├── 004_create_work_orders.sql
│   ├── 005_create_inventory.sql
│   ├── 006_create_appointments.sql
│   ├── 007_create_audit_and_notifications.sql
│   ├── 008_create_functions.sql
│   ├── 009_create_triggers.sql
│   └── 010_create_indexes.sql
├── functions/
│   ├── search-workshops/
│   ├── check-parts/
│   ├── book-appointment/
│   ├── send-email/
│   └── export-order-pdf/
└── seed.sql
```

## 🚀 Próximos Pasos Inmediatos

1. **Crear Issues en GitHub** para cada fase (con este documento como base)
2. **Priorizar Issues** según dependencias
3. **Ejecutar scripts SQL** en orden secuencial
4. **Validar** cada fase antes de avanzar
5. **Documentar** problemas y soluciones

## 📊 Métricas de Éxito

- ✅ Todas las tablas creadas y con RLS funcional
- ✅ 100% de las funciones de negocio implementadas
- ✅ Storage configurado y accesible
- ✅ Edge Functions desplegadas
- ✅ Frontend integrado con backend real
- ✅ Tests de RLS pasando
- ✅ Performance < 500ms en queries principales

---

**Documento creado el:** 2025-12-13
**Versión:** 1.0
**Estado:** Pendiente de aprobación
