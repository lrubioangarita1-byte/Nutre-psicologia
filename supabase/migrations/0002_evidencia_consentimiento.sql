-- Evidencia de la aceptación de documentos legales y del inicio de ejecución del servicio.
alter table public.submissions
  add column if not exists aceptacion jsonb,          -- versión, documentos aceptados, IP, navegador, fecha
  add column if not exists iniciado_at timestamptz;   -- primera respuesta guardada (fin del derecho de retracto)
