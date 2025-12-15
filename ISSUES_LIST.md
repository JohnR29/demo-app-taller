# 📋 Lista de Issues para Implementación Backend

Este documento contiene todos los issues que deben crearse en GitHub para implementar el backend de TallerMS en Supabase.

## 🎯 Formato de Issue Sugerido

Cada issue debe incluir:
- **Título**: Claro y descriptivo
- **Descripción**: Qué se debe hacer
- **Criterios de Aceptación**: Lista de checkboxes con tareas específicas
- **Archivos Relacionados**: Scripts SQL o funciones involucradas
- **Dependencias**: Issues previos que deben completarse primero

---

## 📦 FASE 1: ESTRUCTURA BASE

### Issue #1: Configurar Proyecto Supabase
**Prioridad**: 🔴 Alta  
**Etiquetas**: `setup`, `infrastructure`

**Descripción:**
Crear y configurar el proyecto de Supabase Cloud para TallerMS, estableciendo la base para todo el backend.

**Criterios de Aceptación:**
- [ ] Crear proyecto en Supabase Cloud
- [ ] Configurar variables de entorno en `.env.local`
- [ ] Obtener API keys (anon, service_role)
- [ ] Configurar connection string de base de datos
- [ ] Documentar credenciales en archivo seguro
- [ ] Verificar conectividad desde frontend

**Archivos:**
- `.env.example` (actualizar con variables de Supabase)

---

### Issue #2: Ejecutar Migración - Organizations y Branches
**Prioridad**: 🔴 Alta  
**Etiquetas**: `migration`, `database`, `fase-1`  
**Depende de**: #1

**Descripción:**
Ejecutar la primera migración SQL para crear las tablas de organizaciones y sucursales, base del sistema multi-tenant.

**Criterios de Aceptación:**
- [ ] Ejecutar script `001_create_organizations_and_branches.sql`
- [ ] Verificar que tablas `organizations` y `branches` existen
- [ ] Verificar que RLS está habilitado en ambas tablas
- [ ] Verificar que políticas RLS están creadas
- [ ] Verificar que triggers de `updated_at` funcionan
- [ ] Probar insertar una organización de prueba
- [ ] Probar insertar una sucursal de prueba

**Archivos:**
- `supabase/migrations/001_create_organizations_and_branches.sql`

---

### Issue #3: Ejecutar Migración - Users y Permissions
**Prioridad**: 🔴 Alta  
**Etiquetas**: `migration`, `database`, `auth`, `fase-1`  
**Depende de**: #2

**Descripción:**
Crear sistema de usuarios con roles y permisos por sucursal.

**Criterios de Aceptación:**
- [ ] Ejecutar script `002_create_users_and_permissions.sql`
- [ ] Verificar que enum `user_role` está creado
- [ ] Verificar que tabla `users` existe y extiende `auth.users`
- [ ] Verificar que tabla `user_branch_permissions` existe
- [ ] Verificar que RLS está habilitado
- [ ] Verificar que funciones helper están creadas
- [ ] Probar función `user_has_branch_access()`
- [ ] Probar función `get_user_branches()`

**Archivos:**
- `supabase/migrations/002_create_users_and_permissions.sql`

---

### Issue #4: Ejecutar Migración - Clients y Vehicles
**Prioridad**: 🔴 Alta  
**Etiquetas**: `migration`, `database`, `fase-2`  
**Depende de**: #3

**Descripción:**
Crear tablas para gestión de clientes y sus vehículos.

**Criterios de Aceptación:**
- [ ] Ejecutar script `003_create_clients_and_vehicles.sql`
- [ ] Verificar que enums de tipos están creados
- [ ] Verificar que tabla `clients` existe
- [ ] Verificar que tabla `vehicles` existe
- [ ] Verificar que RLS está habilitado
- [ ] Verificar que constraint de license_plate unique funciona
- [ ] Probar función `search_clients()`
- [ ] Probar función `get_client_details()`
- [ ] Probar función `get_vehicles_due_for_service()`

**Archivos:**
- `supabase/migrations/003_create_clients_and_vehicles.sql`

---

## 📦 FASE 2: OPERACIONES CORE

### Issue #5: Crear Migración - Work Orders
**Prioridad**: 🔴 Alta  
**Etiquetas**: `migration`, `database`, `core-feature`, `fase-3`  
**Depende de**: #4

**Descripción:**
Crear tablas para órdenes de trabajo y sus repuestos.

**Criterios de Aceptación:**
- [ ] Crear archivo `004_create_work_orders.sql`
- [ ] Crear enum `work_order_status`
- [ ] Crear tabla `work_orders` con todos los campos
- [ ] Crear tabla `work_order_parts`
- [ ] Implementar RLS por sucursal y rol
- [ ] Crear índices para búsquedas frecuentes
- [ ] Crear función `create_work_order()` con validaciones
- [ ] Crear función `update_work_order_status()`
- [ ] Crear función `calculate_order_costs()`
- [ ] Crear trigger para actualizar `parts_cost` automáticamente
- [ ] Ejecutar migración
- [ ] Validar con datos de prueba

**Archivos a crear:**
- `supabase/migrations/004_create_work_orders.sql`

---

### Issue #6: Crear Migración - Appointments
**Prioridad**: 🔴 Alta  
**Etiquetas**: `migration`, `database`, `core-feature`, `fase-3`  
**Depende de**: #4

**Descripción:**
Crear sistema de gestión de citas/agendamiento.

**Criterios de Aceptación:**
- [ ] Crear archivo `005_create_appointments.sql`
- [ ] Crear enum `appointment_status`
- [ ] Crear tabla `appointments`
- [ ] Implementar RLS (incluir acceso público para portal)
- [ ] Crear función `schedule_appointment()` con validación de disponibilidad
- [ ] Crear función `check_time_slot_availability()`
- [ ] Crear función `convert_appointment_to_order()`
- [ ] Crear trigger para enviar recordatorios
- [ ] Ejecutar migración
- [ ] Validar con datos de prueba

**Archivos a crear:**
- `supabase/migrations/005_create_appointments.sql`

---

### Issue #7: Crear Migración - Inventory
**Prioridad**: 🔴 Alta  
**Etiquetas**: `migration`, `database`, `core-feature`, `fase-4`  
**Depende de**: #5

**Descripción:**
Crear sistema de inventario con control de stock y movimientos.

**Criterios de Aceptación:**
- [ ] Crear archivo `006_create_inventory.sql`
- [ ] Crear enum `inventory_category`
- [ ] Crear enum `inventory_stock_status`
- [ ] Crear enum `inventory_movement_type`
- [ ] Crear tabla `inventory_items`
- [ ] Crear tabla `inventory_movements`
- [ ] Implementar RLS por sucursal
- [ ] Crear función `register_inventory_movement()`
- [ ] Crear función `transfer_stock_between_branches()`
- [ ] Crear función `update_stock_status()` (trigger)
- [ ] Crear trigger para alertas de stock bajo
- [ ] Ejecutar migración
- [ ] Validar con datos de prueba

**Archivos a crear:**
- `supabase/migrations/006_create_inventory.sql`

---

## 📦 FASE 3: SISTEMA AUXILIAR

### Issue #8: Crear Migración - Audit Logs y Notifications
**Prioridad**: 🟡 Media  
**Etiquetas**: `migration`, `database`, `security`, `fase-5`  
**Depende de**: #7

**Descripción:**
Implementar sistema de auditoría y notificaciones.

**Criterios de Aceptación:**
- [ ] Crear archivo `007_create_audit_and_notifications.sql`
- [ ] Crear tabla `audit_logs`
- [ ] Crear enum `notification_type`
- [ ] Crear tabla `notifications`
- [ ] Implementar RLS
- [ ] Crear función `create_audit_log()`
- [ ] Crear trigger para auditoría en tablas críticas
- [ ] Crear función `create_notification()`
- [ ] Crear función `mark_notification_as_read()`
- [ ] Ejecutar migración
- [ ] Validar con datos de prueba

**Archivos a crear:**
- `supabase/migrations/007_create_audit_and_notifications.sql`

---

### Issue #9: Crear Migración - Workshop Ratings
**Prioridad**: 🟡 Media  
**Etiquetas**: `migration`, `database`, `portal`, `fase-5`  
**Depende de**: #3

**Descripción:**
Crear sistema de calificaciones de talleres para Portal Cliente.

**Criterios de Aceptación:**
- [ ] Crear archivo `008_create_workshop_ratings.sql`
- [ ] Crear tabla `workshop_ratings`
- [ ] Implementar RLS (lectura pública, escritura restringida)
- [ ] Crear función `add_workshop_rating()`
- [ ] Crear función `get_branch_average_rating()`
- [ ] Crear función `search_nearby_workshops()` con geolocalización
- [ ] Ejecutar migración
- [ ] Validar con datos de prueba

**Archivos a crear:**
- `supabase/migrations/008_create_workshop_ratings.sql`

---

## 📦 FASE 4: LÓGICA DE NEGOCIO AVANZADA

### Issue #10: Crear Funciones de Negocio - Dashboard
**Prioridad**: 🔴 Alta  
**Etiquetas**: `functions`, `business-logic`, `fase-6`  
**Depende de**: #5, #6, #7

**Descripción:**
Crear funciones para calcular KPIs y métricas del dashboard.

**Criterios de Aceptación:**
- [ ] Crear archivo `009_create_dashboard_functions.sql`
- [ ] Crear función `get_dashboard_kpis(p_branch_id, p_date_from, p_date_to)`
- [ ] Retornar: órdenes activas, citas del día, stock bajo, facturación
- [ ] Crear función `get_active_orders_summary()`
- [ ] Crear función `get_revenue_by_period()`
- [ ] Optimizar queries para performance
- [ ] Ejecutar archivo
- [ ] Validar con datos de prueba

**Archivos a crear:**
- `supabase/migrations/009_create_dashboard_functions.sql`

---

### Issue #11: Crear Funciones de Negocio - Reportes
**Prioridad**: 🟡 Media  
**Etiquetas**: `functions`, `business-logic`, `reports`, `fase-6`  
**Depende de**: #10

**Descripción:**
Crear funciones para generar reportes y estadísticas.

**Criterios de Aceptación:**
- [ ] Crear archivo `010_create_report_functions.sql`
- [ ] Crear función `get_vehicle_service_history(p_vehicle_id)`
- [ ] Crear función `get_client_order_history(p_client_id)`
- [ ] Crear función `get_mechanic_performance(p_mechanic_id, p_period)`
- [ ] Crear función `get_inventory_movement_report(p_branch_id, p_period)`
- [ ] Crear función `get_sales_report_by_branch(p_date_from, p_date_to)`
- [ ] Ejecutar archivo
- [ ] Validar con datos de prueba

**Archivos a crear:**
- `supabase/migrations/010_create_report_functions.sql`

---

### Issue #12: Crear Triggers Automáticos
**Prioridad**: 🔴 Alta  
**Etiquetas**: `triggers`, `automation`, `fase-6`  
**Depende de**: #5, #7, #8

**Descripción:**
Implementar triggers para automatizaciones del sistema.

**Criterios de Aceptación:**
- [ ] Crear archivo `011_create_triggers.sql`
- [ ] Trigger: Actualizar stock al completar OT
- [ ] Trigger: Crear notificación al cambiar estado de OT
- [ ] Trigger: Alerta automática de stock bajo
- [ ] Trigger: Programar recordatorio de cita
- [ ] Trigger: Actualizar last_login_at en users
- [ ] Trigger: Registrar cambios en audit_logs para tablas sensibles
- [ ] Ejecutar archivo
- [ ] Validar funcionamiento de cada trigger

**Archivos a crear:**
- `supabase/migrations/011_create_triggers.sql`

---

## 📦 FASE 5: OPTIMIZACIÓN Y STORAGE

### Issue #13: Crear Índices de Optimización
**Prioridad**: 🟡 Media  
**Etiquetas**: `optimization`, `performance`, `fase-7`  
**Depende de**: #12

**Descripción:**
Crear índices adicionales para optimizar queries frecuentes.

**Criterios de Aceptación:**
- [ ] Crear archivo `012_create_additional_indexes.sql`
- [ ] Índices compuestos en work_orders
- [ ] Índices para búsquedas de texto (clientes, productos)
- [ ] Índices parciales para estados activos
- [ ] Índices para ordenamiento por fecha
- [ ] Ejecutar EXPLAIN ANALYZE en queries principales
- [ ] Documentar mejoras de performance
- [ ] Ejecutar archivo

**Archivos a crear:**
- `supabase/migrations/012_create_additional_indexes.sql`

---

### Issue #14: Configurar Supabase Storage
**Prioridad**: 🟡 Media  
**Etiquetas**: `storage`, `infrastructure`, `fase-7`  
**Depende de**: #3

**Descripción:**
Configurar buckets de Storage para imágenes y documentos.

**Criterios de Aceptación:**
- [ ] Crear bucket `avatars` (público lectura, privado escritura)
- [ ] Crear bucket `inventory-images` (público lectura)
- [ ] Crear bucket `work-order-documents` (privado)
- [ ] Crear bucket `organization-logos` (público lectura)
- [ ] Configurar políticas de acceso RLS para cada bucket
- [ ] Configurar límites de tamaño (5MB para imágenes)
- [ ] Documentar estructura de carpetas
- [ ] Probar subida y descarga desde frontend

**Archivos a crear:**
- `supabase/storage/buckets.sql` (script de configuración)
- Documentación en README

---

## 📦 FASE 6: EDGE FUNCTIONS Y APIs

### Issue #15: Crear Edge Function - Search Workshops
**Prioridad**: 🟡 Media  
**Etiquetas**: `edge-function`, `api`, `marketplace`, `fase-8`  
**Depende de**: #9

**Descripción:**
API pública para buscar talleres cercanos (marketplace).

**Criterios de Aceptación:**
- [ ] Crear función en `supabase/functions/search-workshops/index.ts`
- [ ] Implementar búsqueda por geolocalización (lat/lng)
- [ ] Filtrar por distancia (radio en km)
- [ ] Filtrar por especialidades
- [ ] Incluir calificación promedio
- [ ] Retornar JSON con talleres ordenados por distancia
- [ ] Manejar CORS para acceso público
- [ ] Desplegar función
- [ ] Probar desde frontend

**Archivos a crear:**
- `supabase/functions/search-workshops/index.ts`

---

### Issue #16: Crear Edge Function - Send Email
**Prioridad**: 🟡 Media  
**Etiquetas**: `edge-function`, `notifications`, `fase-8`  
**Depende de**: #8

**Descripción:**
Función para enviar emails transaccionales (confirmaciones, recordatorios).

**Criterios de Aceptación:**
- [ ] Crear función en `supabase/functions/send-email/index.ts`
- [ ] Integrar con servicio SMTP (ej: SendGrid, Resend)
- [ ] Templates para: confirmación de cita, recordatorio, OT completada
- [ ] Validar autenticación del usuario
- [ ] Rate limiting para prevenir abuso
- [ ] Logging de emails enviados
- [ ] Desplegar función
- [ ] Probar envío real

**Archivos a crear:**
- `supabase/functions/send-email/index.ts`
- Templates en `supabase/functions/send-email/templates/`

---

### Issue #17: Crear Edge Function - Export PDF
**Prioridad**: 🟢 Baja  
**Etiquetas**: `edge-function`, `reports`, `fase-8`  
**Depende de**: #5

**Descripción:**
Función para exportar órdenes de trabajo a PDF.

**Criterios de Aceptación:**
- [ ] Crear función en `supabase/functions/export-order-pdf/index.ts`
- [ ] Usar librería PDF (ej: pdfmake, jsPDF)
- [ ] Template profesional con logo de la empresa
- [ ] Incluir: datos cliente, vehículo, servicios, repuestos, costos
- [ ] Validar permisos de acceso a la OT
- [ ] Retornar PDF como blob/stream
- [ ] Desplegar función
- [ ] Probar descarga desde frontend

**Archivos a crear:**
- `supabase/functions/export-order-pdf/index.ts`

---

## 📦 FASE 7: DATOS INICIALES Y TESTING

### Issue #18: Crear Script de Seed Data
**Prioridad**: 🟡 Media  
**Etiquetas**: `seed`, `testing`, `fase-9`  
**Depende de**: #12

**Descripción:**
Script para crear datos iniciales de prueba/demo.

**Criterios de Aceptación:**
- [ ] Crear archivo `supabase/seed/seed.sql`
- [ ] Insertar 1 organización
- [ ] Insertar 3 sucursales
- [ ] Insertar usuario admin inicial
- [ ] Insertar 10 clientes de prueba
- [ ] Insertar 15 vehículos
- [ ] Insertar 20 productos de inventario
- [ ] Insertar 5 órdenes de trabajo
- [ ] Insertar 10 citas
- [ ] Script idempotente (puede ejecutarse múltiples veces)
- [ ] Ejecutar en ambiente de desarrollo

**Archivos a crear:**
- `supabase/seed/seed.sql`

---

### Issue #19: Testing de RLS y Seguridad
**Prioridad**: 🔴 Alta  
**Etiquetas**: `testing`, `security`, `rls`, `fase-9`  
**Depende de**: #18

**Descripción:**
Validar que Row Level Security funciona correctamente.

**Criterios de Aceptación:**
- [ ] Crear archivo `supabase/tests/test_rls.sql`
- [ ] Test: Usuario solo ve datos de su organización
- [ ] Test: Admin puede crear/editar todo en su org
- [ ] Test: Manager solo accede a su sucursal
- [ ] Test: Mechanic solo ve OT asignadas
- [ ] Test: Aislamiento total entre organizaciones
- [ ] Test: Permisos de storage por rol
- [ ] Documentar resultados
- [ ] Corregir cualquier falla de seguridad

**Archivos a crear:**
- `supabase/tests/test_rls.sql`
- Documento con resultados

---

### Issue #20: Testing de Funciones de Negocio
**Prioridad**: 🟡 Media  
**Etiquetas**: `testing`, `functions`, `fase-9`  
**Depende de**: #18

**Descripción:**
Validar que todas las funciones de negocio funcionan correctamente.

**Criterios de Aceptación:**
- [ ] Crear archivo `supabase/tests/test_functions.sql`
- [ ] Test: create_work_order() con datos válidos
- [ ] Test: register_inventory_movement() actualiza stock
- [ ] Test: transfer_stock_between_branches() con permisos
- [ ] Test: schedule_appointment() valida disponibilidad
- [ ] Test: get_dashboard_kpis() retorna datos correctos
- [ ] Test: search_clients() encuentra resultados
- [ ] Documentar resultados
- [ ] Corregir cualquier falla

**Archivos a crear:**
- `supabase/tests/test_functions.sql`

---

## 📦 FASE 8: INTEGRACIÓN FRONTEND

### Issue #21: Actualizar .env con Supabase Config
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `config`, `fase-10`  
**Depende de**: #1

**Descripción:**
Configurar variables de entorno en el frontend para conectar con Supabase.

**Criterios de Aceptación:**
- [ ] Actualizar `.env.local` con variables de Supabase
- [ ] NEXT_PUBLIC_SUPABASE_URL
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY
- [ ] Actualizar `.env.example` como plantilla
- [ ] Documentar en README cómo obtener las keys
- [ ] Verificar que variables se cargan correctamente

**Archivos:**
- `.env.local`
- `.env.example`
- `README.md`

---

### Issue #22: Instalar y Configurar Supabase Client
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `setup`, `fase-10`  
**Depende de**: #21

**Descripción:**
Instalar SDK de Supabase y crear cliente configurado.

**Criterios de Aceptación:**
- [ ] Instalar `@supabase/supabase-js`
- [ ] Instalar `@supabase/auth-helpers-nextjs` (para Next.js)
- [ ] Crear `lib/supabase/client.ts` con cliente de Supabase
- [ ] Crear `lib/supabase/server.ts` para server components
- [ ] Configurar middleware de auth si es necesario
- [ ] Documentar uso en README

**Archivos a crear:**
- `lib/supabase/client.ts`
- `lib/supabase/server.ts`
- `lib/supabase/README.md`

---

### Issue #23: Migrar Auth a Supabase
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `auth`, `fase-10`  
**Depende de**: #22

**Descripción:**
Reemplazar sistema de auth mock con Supabase Auth.

**Criterios de Aceptación:**
- [ ] Actualizar página `/login` para usar Supabase Auth
- [ ] Implementar signInWithPassword()
- [ ] Implementar signOut()
- [ ] Crear hook `useAuth()` para manejar sesión
- [ ] Proteger rutas privadas con middleware
- [ ] Manejar estado de autenticación global
- [ ] Probar login/logout funcional

**Archivos a modificar:**
- `app/login/page.tsx`
- `contexts/auth-context.tsx` (crear o modificar)
- `middleware.ts` (crear si no existe)

---

### Issue #24: Migrar Módulo de Clientes a Supabase
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `clients`, `fase-10`  
**Depende de**: #22, #4

**Descripción:**
Conectar módulo de clientes con backend real de Supabase.

**Criterios de Aceptación:**
- [ ] Reemplazar mockClientes con query a Supabase
- [ ] Implementar `getClients()` con filtros
- [ ] Implementar `getClientById()`
- [ ] Implementar `createClient()`
- [ ] Implementar `updateClient()`
- [ ] Implementar búsqueda en tiempo real
- [ ] Probar CRUD completo
- [ ] Validar permisos RLS

**Archivos a modificar:**
- `app/clientes/page.tsx`
- `app/clientes/[id]/page.tsx`
- `lib/api/services/clients.service.ts` (crear)

---

### Issue #25: Migrar Módulo de Órdenes a Supabase
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `orders`, `fase-10`  
**Depende de**: #22, #5

**Descripción:**
Conectar módulo de órdenes de trabajo con backend real.

**Criterios de Aceptación:**
- [ ] Reemplazar mockOrders con query a Supabase
- [ ] Implementar `getOrders()` con filtros por sucursal y estado
- [ ] Implementar `getOrderById()`
- [ ] Implementar `createOrder()`
- [ ] Implementar `updateOrderStatus()`
- [ ] Probar cálculo automático de costos
- [ ] Probar CRUD completo
- [ ] Validar permisos RLS

**Archivos a modificar:**
- `app/ordenes/page.tsx`
- `app/ordenes/[id]/page.tsx`
- `app/ordenes/nueva/page.tsx`
- `lib/api/services/orders.service.ts`

---

### Issue #26: Migrar Módulo de Inventario a Supabase
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `inventory`, `fase-10`  
**Depende de**: #22, #7

**Descripción:**
Conectar módulo de inventario con backend real.

**Criterios de Aceptación:**
- [ ] Reemplazar mockInventory con query a Supabase
- [ ] Implementar `getInventoryItems()` por sucursal
- [ ] Implementar `createInventoryItem()`
- [ ] Implementar `updateStock()`
- [ ] Implementar `registerMovement()`
- [ ] Implementar alertas de stock bajo en tiempo real
- [ ] Probar CRUD completo
- [ ] Validar permisos RLS

**Archivos a modificar:**
- `app/inventario/page.tsx`
- `lib/api/services/inventory.service.ts`

---

### Issue #27: Migrar Módulo de Citas a Supabase
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `appointments`, `fase-10`  
**Depende de**: #22, #6

**Descripción:**
Conectar módulo de citas/agenda con backend real.

**Criterios de Aceptación:**
- [ ] Reemplazar mockAppointments con query a Supabase
- [ ] Implementar `getAppointments()` por fecha y sucursal
- [ ] Implementar `createAppointment()` con validación de horario
- [ ] Implementar `updateAppointmentStatus()`
- [ ] Implementar vista de calendario con datos reales
- [ ] Probar CRUD completo
- [ ] Validar permisos RLS

**Archivos a modificar:**
- `app/citas/page.tsx`
- `lib/api/services/appointments.service.ts`

---

### Issue #28: Migrar Dashboard a Supabase
**Prioridad**: 🔴 Alta  
**Etiquetas**: `frontend`, `dashboard`, `fase-10`  
**Depende de**: #22, #10

**Descripción:**
Conectar dashboard con KPIs reales desde Supabase.

**Criterios de Aceptación:**
- [ ] Reemplazar KPIs mock con función `get_dashboard_kpis()`
- [ ] Implementar actualización en tiempo real con subscriptions
- [ ] Mostrar datos filtrados por sucursal seleccionada
- [ ] Implementar gráficos con datos reales
- [ ] Optimizar queries para performance
- [ ] Probar con datos de diferentes sucursales

**Archivos a modificar:**
- `app/dashboard/page.tsx`
- `components/dashboard/*`

---

## 📦 FASE 9: DOCUMENTACIÓN Y DEPLOY

### Issue #29: Documentar Arquitectura del Backend
**Prioridad**: 🟡 Media  
**Etiquetas**: `documentation`, `fase-11`  
**Depende de**: #28

**Descripción:**
Crear documentación completa de la arquitectura backend.

**Criterios de Aceptación:**
- [ ] Crear `docs/ARCHITECTURE.md`
- [ ] Diagrama ER de base de datos
- [ ] Documentar todas las tablas y relaciones
- [ ] Documentar funciones de negocio
- [ ] Documentar estrategia de RLS
- [ ] Documentar Edge Functions
- [ ] Documentar Storage structure
- [ ] Incluir ejemplos de queries comunes

**Archivos a crear:**
- `docs/ARCHITECTURE.md`
- `docs/DATABASE_SCHEMA.png` (diagrama)

---

### Issue #30: Crear Guía de Deployment
**Prioridad**: 🟡 Media  
**Etiquetas**: `documentation`, `deployment`, `fase-11`  
**Depende de**: #28

**Descripción:**
Documentar proceso completo de deployment.

**Criterios de Aceptación:**
- [ ] Crear `docs/DEPLOYMENT.md`
- [ ] Documentar setup de Supabase
- [ ] Documentar ejecución de migraciones
- [ ] Documentar configuración de variables de entorno
- [ ] Documentar deploy de Edge Functions
- [ ] Documentar rollback procedures
- [ ] Documentar monitoreo y logs
- [ ] Checklist pre-producción

**Archivos a crear:**
- `docs/DEPLOYMENT.md`

---

### Issue #31: Testing End-to-End
**Prioridad**: 🔴 Alta  
**Etiquetas**: `testing`, `e2e`, `fase-11`  
**Depende de**: #28

**Descripción:**
Realizar pruebas completas del flujo de usuario.

**Criterios de Aceptación:**
- [ ] Test: Login de usuario
- [ ] Test: Crear cliente y vehículo
- [ ] Test: Agendar cita
- [ ] Test: Crear OT desde cita
- [ ] Test: Agregar repuestos a OT
- [ ] Test: Completar OT y verificar stock actualizado
- [ ] Test: Ver historial de vehículo
- [ ] Test: Búsqueda en marketplace
- [ ] Test: Dashboard con datos reales
- [ ] Documentar casos de test

**Archivos a crear:**
- `tests/e2e/user-flows.spec.ts`

---

### Issue #32: Preparación para Producción
**Prioridad**: 🔴 Alta  
**Etiquetas**: `deployment`, `production`, `fase-11`  
**Depende de**: #31

**Descripción:**
Preparar sistema para deploy en producción.

**Criterios de Aceptación:**
- [ ] Revisar todas las políticas RLS
- [ ] Configurar backups automáticos en Supabase
- [ ] Configurar rate limiting
- [ ] Revisar logs y monitoreo
- [ ] Configurar alertas de errores
- [ ] Optimizar índices de producción
- [ ] Revisar costos de Supabase
- [ ] Plan de escalabilidad
- [ ] Realizar backup pre-deploy

---

## 📈 Resumen de Issues

**Total de Issues**: 32

### Por Fase:
- Fase 1 (Setup): 4 issues
- Fase 2 (Operaciones): 3 issues
- Fase 3 (Auxiliar): 2 issues
- Fase 4 (Lógica Negocio): 3 issues
- Fase 5 (Optimización): 2 issues
- Fase 6 (Edge Functions): 3 issues
- Fase 7 (Testing Backend): 3 issues
- Fase 8 (Integración Frontend): 8 issues
- Fase 9 (Documentación): 4 issues

### Por Prioridad:
- 🔴 Alta: 18 issues
- 🟡 Media: 13 issues
- 🟢 Baja: 1 issue

### Tiempo Estimado:
- **Fase 1-3**: 3-5 días (setup y estructura)
- **Fase 4-5**: 3-4 días (lógica de negocio)
- **Fase 6-7**: 2-3 días (APIs y testing backend)
- **Fase 8**: 5-7 días (integración frontend)
- **Fase 9**: 2-3 días (documentación y deploy)

**Total**: 15-22 días de desarrollo

---

## 🎯 Orden de Ejecución Recomendado

1. Issues #1-4 (secuencial) - Setup y estructura base
2. Issues #5-7 (secuencial) - Operaciones core
3. Issues #8-9 (paralelo posible) - Sistema auxiliar
4. Issues #10-12 (secuencial) - Lógica de negocio
5. Issue #13 (paralelo posible) - Optimización
6. Issue #14 (independiente) - Storage
7. Issues #15-17 (paralelo posible) - Edge Functions
8. Issue #18 (independiente) - Seed data
9. Issues #19-20 (paralelo posible) - Testing backend
10. Issues #21-28 (algunos en paralelo) - Integración frontend
11. Issues #29-32 (secuencial) - Documentación y producción

---

**Documento creado el**: 2025-12-13  
**Versión**: 1.0  
**Mantener actualizado**: Marcar como completados conforme se cierren
