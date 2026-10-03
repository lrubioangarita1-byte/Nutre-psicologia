-- LucernaPsi · CONFIGURACIÓN COMPLETA DE LA BASE DE DATOS
-- Copiar TODO este archivo, pegarlo en Supabase → SQL Editor y pulsar Run. Se puede ejecutar más de una vez sin problema.

-- Laura Rubio · Psicología del Bienestar — esquema inicial
-- Ejecutar en Supabase: SQL Editor → pegar → Run (o `supabase db push`).

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------
-- submissions: una evaluación comprada por un cliente
-- ---------------------------------------------------------------
create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  -- Token secreto del enlace de acceso a la prueba (/evaluacion/<token>)
  access_token text not null unique,
  pack_id text not null,
  cliente_nombre text not null,
  cliente_correo text not null,
  cliente_whatsapp text,
  remitido_por text,
  consentimiento_version text not null,
  consentimiento_aceptado_at timestamptz not null,
  respuestas jsonb not null default '{}'::jsonb,
  puntajes jsonb,
  respuesta_pregunta_seguridad boolean,
  nivel_riesgo text not null default 'normal'
    check (nivel_riesgo in ('normal', 'elevado', 'crisis')),
  estado text not null default 'esperando_pago'
    check (estado in ('esperando_pago', 'en_progreso', 'pendiente', 'revisado', 'enviado')),
  fecha_creacion timestamptz not null default now(),
  pagado_at timestamptz,
  completado_at timestamptz,
  updated_at timestamptz not null default now()
);

create index if not exists submissions_estado_idx on public.submissions (estado, nivel_riesgo, completado_at);

-- ---------------------------------------------------------------
-- payments
-- ---------------------------------------------------------------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  monto numeric(12, 2) not null,
  moneda text not null check (moneda in ('COP', 'USD')),
  estado text not null default 'pendiente'
    check (estado in ('pendiente', 'aprobado', 'rechazado', 'error')),
  proveedor text not null check (proveedor in ('wompi', 'stripe', 'prueba')),
  -- id de transacción (Wompi) o de checkout session (Stripe)
  referencia_proveedor text,
  detalle jsonb,
  fecha timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists payments_submission_idx on public.payments (submission_id);
create unique index if not exists payments_ref_idx on public.payments (proveedor, referencia_proveedor)
  where referencia_proveedor is not null;

-- ---------------------------------------------------------------
-- reports: informe editado y aprobado por Laura
-- ---------------------------------------------------------------
create table if not exists public.reports (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  borrador jsonb not null,            -- estructura editable del informe
  contenido_editado text,             -- HTML final enviado al cliente
  aprobado_por text,
  fecha_envio timestamptz,
  email_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------
-- risk_events: evidencia de eventos de riesgo (solo inserción)
-- ---------------------------------------------------------------
create table if not exists public.risk_events (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete restrict,
  tipo text not null check (tipo in ('crisis', 'elevado')),
  detalle jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  notificado_at timestamptz,
  notificacion_error text,
  revisado_por text,
  revisado_at timestamptz
);

create index if not exists risk_events_submission_idx on public.risk_events (submission_id, created_at);

-- Los eventos de riesgo son evidencia: no se pueden borrar ni alterar su contenido.
create or replace function public.protect_risk_events() returns trigger
language plpgsql as $$
begin
  if tg_op = 'DELETE' then
    raise exception 'Los eventos de riesgo no se pueden eliminar';
  end if;
  if new.submission_id <> old.submission_id
     or new.tipo <> old.tipo
     or new.detalle <> old.detalle
     or new.created_at <> old.created_at then
    raise exception 'Solo se pueden actualizar los campos de notificación/revisión de un evento de riesgo';
  end if;
  return new;
end $$;

drop trigger if exists risk_events_protect on public.risk_events;
create trigger risk_events_protect
  before update or delete on public.risk_events
  for each row execute function public.protect_risk_events();

-- ---------------------------------------------------------------
-- updated_at automático
-- ---------------------------------------------------------------
create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

drop trigger if exists submissions_touch on public.submissions;
create trigger submissions_touch before update on public.submissions
  for each row execute function public.touch_updated_at();
drop trigger if exists payments_touch on public.payments;
create trigger payments_touch before update on public.payments
  for each row execute function public.touch_updated_at();
drop trigger if exists reports_touch on public.reports;
create trigger reports_touch before update on public.reports
  for each row execute function public.touch_updated_at();

-- ---------------------------------------------------------------
-- Seguridad: RLS activado y SIN políticas → la llave anónima no puede
-- leer ni escribir nada. Todo el acceso pasa por el servidor (service role).
-- ---------------------------------------------------------------
alter table public.submissions enable row level security;
alter table public.payments enable row level security;
alter table public.reports enable row level security;
alter table public.risk_events enable row level security;

-- Evidencia de la aceptación de documentos legales y del inicio de ejecución del servicio.
alter table public.submissions
  add column if not exists aceptacion jsonb,          -- versión, documentos aceptados, IP, navegador, fecha
  add column if not exists iniciado_at timestamptz;   -- primera respuesta guardada (fin del derecho de retracto)
