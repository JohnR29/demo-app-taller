# 📚 Migraciones SQL - TallerMS Backend

## 🎯 Objetivo

Este directorio contiene todas las migraciones SQL necesarias para construir el backend completo de TallerMS en Supabase.

## 📋 Orden de Ejecución

Las migraciones deben ejecutarse en orden numérico. **No omitir ninguna migración.**

### Fase 1: Estructura Base
1. ✅ `001_create_organizations_and_branches.sql` - Organizaciones y Sucursales
2. ✅ `002_create_users_and_permissions.sql` - Usuarios y Permisos

### Fase 2: Gestión de Clientes (Pendiente)
3. `003_create_clients_and_vehicles.sql` - Clientes y Vehículos

### Fase 3: Operaciones (Pendiente)
4. `004_create_work_orders.sql` - Órdenes de Trabajo
5. `005_create_appointments.sql` - Citas

### Fase 4: Inventario (Pendiente)
6. `006_create_inventory.sql` - Inventario y Movimientos

### Fase 5: Sistema Auxiliar (Pendiente)
7. `007_create_audit_and_notifications.sql` - Auditoría y Notificaciones
8. `008_create_marketplace.sql` - Calificaciones para Marketplace

### Fase 6: Funciones de Negocio (Pendiente)
9. `009_create_business_functions.sql` - Funciones principales de negocio
10. `010_create_triggers.sql` - Triggers automáticos

### Fase 7: Optimización (Pendiente)
11. `011_create_indexes.sql` - Índices adicionales
12. `012_create_views.sql` - Vistas materializadas

## 🚀 Cómo Ejecutar

### Opción 1: Desde Supabase Dashboard

1. Ir a **SQL Editor** en el dashboard de Supabase
2. Abrir cada archivo `.sql` en orden
3. Copiar y pegar el contenido
4. Ejecutar con el botón "Run"
5. Verificar que no haya errores

### Opción 2: Usando Supabase CLI

```bash
# Instalar Supabase CLI (si no está instalado)
npm install -g supabase

# Inicializar Supabase en el proyecto
supabase init

# Ejecutar todas las migraciones
supabase db push

# O ejecutar una migración específica
supabase db execute --file supabase/migrations/001_create_organizations_and_branches.sql
```

### Opción 3: Usando psql (PostgreSQL CLI)

```bash
# Conectar a la base de datos
psql "postgresql://postgres:[PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres"

# Ejecutar archivo
\i supabase/migrations/001_create_organizations_and_branches.sql
```

## ✅ Validación Post-Migración

Después de ejecutar cada migración, validar:

```sql
-- Verificar que las tablas se crearon
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- Verificar que RLS está habilitado
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public';

-- Verificar políticas RLS
SELECT schemaname, tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public';

-- Verificar funciones creadas
SELECT routine_name, routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
ORDER BY routine_name;
```

## 🔐 Seguridad

- ✅ Todas las tablas tienen **Row Level Security (RLS)** habilitado
- ✅ Las políticas garantizan **aislamiento entre organizaciones**
- ✅ Los usuarios solo pueden ver datos de **su organización y sucursales asignadas**
- ✅ Los roles controlan permisos de **creación, lectura, actualización y eliminación**

## 📊 Diagrama de Relaciones

```
organizations (1) ──┬─→ (N) branches
                    └─→ (N) users
                    
users (N) ←─┬─→ (N) branches (via user_branch_permissions)
            └─→ (1) default_branch
            
branches (1) ──┬─→ (N) work_orders
               ├─→ (N) appointments
               ├─→ (N) inventory_items
               └─→ (N) clients (preferred_branch)
               
clients (1) ──→ (N) vehicles

work_orders (1) ──┬─→ (N) work_order_parts
                  ├─→ (1) client
                  ├─→ (1) vehicle
                  └─→ (1) branch
```

## 🐛 Troubleshooting

### Error: "relation already exists"
**Solución**: Alguna tabla ya existe. Usar `DROP TABLE IF EXISTS` o verificar estado actual.

### Error: "permission denied"
**Solución**: Asegurarse de estar usando el service_role_key, no el anon key.

### Error: "RLS policies blocking queries"
**Solución**: Verificar que el usuario esté correctamente insertado en `public.users` con su `organization_id`.

### Error: "function does not exist"
**Solución**: Ejecutar migraciones previas que crean las funciones necesarias.

## 📝 Notas Importantes

1. **Backup**: Antes de ejecutar en producción, hacer backup completo
2. **Testing**: Probar primero en ambiente de desarrollo
3. **Reversión**: Preparar scripts de rollback si es necesario
4. **Monitoreo**: Observar logs de Supabase durante la ejecución
5. **Permisos**: Asegurar que el usuario que ejecuta tiene permisos suficientes

## 🔄 Versionamiento

- Cada migración tiene un número secuencial
- Nunca editar migraciones ya ejecutadas
- Crear nueva migración para cambios adicionales
- Mantener archivo de changelog

## 📞 Soporte

Si encuentras problemas:
1. Revisar logs de Supabase
2. Verificar sintaxis SQL
3. Consultar documentación de PostgreSQL 15+
4. Verificar compatibilidad con Supabase

---

**Última actualización**: 2025-12-13
**Versión**: 1.0
**Compatible con**: PostgreSQL 15+, Supabase
