-- =====================================================================
-- Outback Adventures · Best ATV Arenal Tours — Hardened Supabase Schema
-- Audited against Supabase Security & Postgres Best Practices:
--   1. RLS enabled + FORCE ROW LEVEL SECURITY on all public tables
--   2. Column-level Least Privilege (anon can ONLY insert lead fields,
--      cannot tamper with id, created_at, or status)
--   3. Admin access gated via app_metadata (never user_metadata)
--      wrapped in (select auth.jwt()) for initPlan caching
--   4. Foreign keys + strict domain CHECK constraints + B-tree indexes
-- =====================================================================

-- 1. Catálogo oficial de tours (creado primero para llaves foráneas)
create table if not exists public.tours (
  id text primary key check (char_length(id) <= 32),
  name_en text not null check (char_length(name_en) <= 120),
  name_es text not null check (char_length(name_es) <= 120),
  price_usd numeric(10, 2) not null check (price_usd > 0 and price_usd <= 5000),
  pricing_unit text not null check (pricing_unit in ('person', 'vehicle')),
  active boolean not null default true
);

alter table public.tours enable row level security;
alter table public.tours force row level security;

-- Least privilege: revocar permisos amplios por defecto y otorgar solo lectura
revoke all on table public.tours from public, anon, authenticated;
grant usage on schema public to anon, authenticated;
grant select on table public.tours to anon, authenticated;

drop policy if exists "Allow public read of active tours" on public.tours;
create policy "Allow public read of active tours"
  on public.tours
  for select
  to anon, authenticated
  using (active = true);

insert into public.tours (id, name_en, name_es, price_usd, pricing_unit)
values
  ('discovery', 'The Discovery Adventure', 'The Discovery Adventure', 99.00, 'person'),
  ('jetski', 'Arenal Lake Jet Ski', 'Jet Ski en el Lago Arenal', 109.00, 'person'),
  ('maleku', 'Jungle & Maleku ATV Tour', 'Tour en Cuadra Selva y Maleku', 85.00, 'person'),
  ('sbs', 'Side by Side Tour', 'Tour en Side by Side', 300.00, 'vehicle')
on conflict (id) do update
  set name_en = excluded.name_en,
      name_es = excluded.name_es,
      price_usd = excluded.price_usd,
      pricing_unit = excluded.pricing_unit;


-- 2. Tabla de solicitudes de reserva (leads capturados al enviar a WhatsApp)
create table if not exists public.booking_leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  primary_tour text not null references public.tours(id) on update cascade on delete restrict,
  combo_tour text references public.tours(id) on update cascade on delete restrict,
  tour_date date not null,
  time_slot text not null check (time_slot in ('morning', 'afternoon', 'flexible')),
  riders integer not null check (riders >= 1 and riders <= 12),
  estimated_total_usd numeric(10, 2) not null check (estimated_total_usd >= 85 and estimated_total_usd <= 15000),
  customer_name text check (customer_name is null or char_length(trim(customer_name)) between 1 and 120),
  lang text not null default 'en' check (lang in ('en', 'es')),
  status text not null default 'pending_whatsapp' check (status in ('pending_whatsapp', 'confirmed', 'cancelled')),
  constraint booking_leads_distinct_combo check (combo_tour is null or combo_tour <> primary_tour)
);

-- Índices para llaves foráneas y consultas operativas del panel admin
create index if not exists booking_leads_primary_tour_idx on public.booking_leads (primary_tour);
create index if not exists booking_leads_combo_tour_idx on public.booking_leads (combo_tour) where combo_tour is not null;
create index if not exists booking_leads_date_status_idx on public.booking_leads (tour_date, status);
create index if not exists booking_leads_created_at_idx on public.booking_leads (created_at desc);

alter table public.booking_leads enable row level security;
alter table public.booking_leads force row level security;

-- 3. Privilegios de mínimo acceso a nivel de columna (Least Privilege):
--    - anon / authenticated solo pueden insertar las columnas del formulario
--      (no pueden inyectar id, created_at ni forzar status = 'confirmed').
--    - Solo usuarios autenticados con rol admin (vía RLS abajo) pueden leer o actualizar status.
revoke all on table public.booking_leads from public, anon, authenticated;

grant insert (
  primary_tour,
  combo_tour,
  tour_date,
  time_slot,
  riders,
  estimated_total_usd,
  customer_name,
  lang
) on table public.booking_leads to anon, authenticated;

grant select, update (status) on table public.booking_leads to authenticated;

-- 4. Políticas RLS endurecidas

-- 4a. Inserción pública validada: solo fechas presentes/futuras y estado inicial
drop policy if exists "Allow public insert of booking leads" on public.booking_leads;
create policy "Allow public insert of booking leads"
  on public.booking_leads
  for insert
  to anon, authenticated
  with check (
    tour_date >= current_date
    and status = 'pending_whatsapp'
    and riders between 1 and 12
  );

-- 4b. Lectura exclusiva para administradores (usando app_metadata, NUNCA user_metadata,
--     y envolviendo auth.jwt() en (select ...) para caché por consulta / initPlan)
drop policy if exists "Allow authenticated admins to view leads" on public.booking_leads;
create policy "Allow authenticated admins to view leads"
  on public.booking_leads
  for select
  to authenticated
  using (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
  );

-- 4c. Actualización de estado exclusiva para administradores (requiere USING + WITH CHECK)
drop policy if exists "Allow authenticated admins to update lead status" on public.booking_leads;
create policy "Allow authenticated admins to update lead status"
  on public.booking_leads
  for update
  to authenticated
  using (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
  )
  with check (
    coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role'), '') = 'admin'
  );
