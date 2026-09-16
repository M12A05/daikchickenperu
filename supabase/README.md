# Supabase

El catálogo público vive en `public.catalog_items` y se lee únicamente mediante la clave `anon`.

## Aplicación

1. Aplicar `migrations/20260911000000_create_catalog_items.sql`, `migrations/20260912000000_remove_legacy_catalog_policy.sql` y `migrations/20260913000000_create_claims.sql` en ese orden desde Supabase CLI o SQL Editor.
2. Ejecutar `seed.sql` después de las migraciones.
3. Confirmar que la política `Public can read active catalog items` permite `SELECT` únicamente para filas activas y no vencidas.
4. Verificar en el Table Editor que existan los 90 productos y promociones del seed y que sus imágenes estén publicadas en `/public` o en un bucket público permitido.

## Reclamos

El endpoint server-side `POST /api/claims` valida y almacena los reclamos y quejas en `public.claims`. La tabla genera un UUID, un número legible `LR-AAAA-######`, la fecha `created_at` y el estado inicial `received`. La clave `SUPABASE_SERVICE_ROLE_KEY` solo se usa en el servidor y no debe exponerse al navegador.

La tabla tiene RLS habilitado y no otorga permisos a `anon` ni `authenticated`; el backend usa `service_role`, que puede operar mediante el bypass administrativo de RLS. No hay políticas públicas para leer o crear reclamos.

El endpoint aplica un rate limit best effort de 5 intentos por IP cada 10 minutos. El límite se mantiene en memoria del proceso, por lo que puede reiniciarse o no compartirse entre instancias serverless; no sustituye controles adicionales del proveedor.

Después de registrar, el sitio muestra la constancia y fecha. WhatsApp solo se ofrece como contacto y nunca se abre automáticamente ni es necesario para que el registro exista.
