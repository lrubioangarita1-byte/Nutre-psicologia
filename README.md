# Laura Rubio · Psicología del Bienestar

Plataforma de evaluación psicológica online: el cliente paga, responde un pack de pruebas psicométricas y recibe por correo, en 12–24 h, un informe personalizado revisado y aprobado por Laura Rubio Angarita (Psicóloga, TP 196983).

**Stack:** Next.js 16 (App Router) · Supabase (Postgres + Auth) · Wompi (COP) / Stripe (USD) · Resend · despliegue en Vercel.

## Qué incluye (Fase 1 — MVP)

- **Landing** con catálogo de packs (marca: oliva `#5B5120`, palo rosa `#DEACA9`, crema `#FCEFDC`, coral `#EF6328`; Playfair Display + Quicksand).
- **Compra**: consentimiento informado (+ addendum clínico), autorización de datos (Ley 1581), mayoría de edad, datos del cliente y pago con Wompi o Stripe. El acceso solo se habilita con el pago verificado en la API de la pasarela (retorno + webhook, idempotente, valida monto y moneda).
- **Motor de preguntas** uno por uno, con intro por instrumento, guardado automático del avance y enlace por correo para retomar.
- **4 packs**: Ansiedad y estrés (GAD-7, PSS-10, TMMS-24), Alimentación (EAT-26, SCOFF), Quién soy (IPIP-50, TMMS-24, Rosenberg), TDAH (ASRS v1.1, WURS-25, prueba breve de atención). Vocacional, Autismo y Selección de personal se muestran como "Próximamente"/"Solicitar".
- **Puntajes calculados en el servidor** (`src/lib/instruments.ts`), lectura preliminar en pantalla y borrador automático del informe (`src/lib/report.ts`, misma lógica del generador interno: bandas, consejos, interpretación integrada, 3 ejercicios).
- **Protocolo de riesgo**: la respuesta a la pregunta de seguridad se guarda en el momento; si es "Sí" → mensaje de crisis inmediato (Línea 192 opción 4) + correo URGENTE a Laura. Umbrales elevados (GAD-7 ≥15, PSS-10 ≥27, EAT-26 ≥20, SCOFF ≥2, ASRS ≥4, WURS-25 ≥46) → correo prioritario. Todo queda en `risk_events` con fecha/hora; esa tabla no permite borrar ni alterar registros.
- **Panel `/admin`** (Supabase Auth): pendientes ordenados por urgencia (crisis → elevado → normal, el más antiguo primero), detalle del caso, registro de eventos de riesgo ("marcar como atendido"), respuestas ítem por ítem, editor del informe con vista previa y botón **Aprobar y enviar** (envía el correo real con Resend).
- Páginas legales: `/legal/terminos`, `/legal/privacidad`, `/legal/consentimiento`.

## Puesta en marcha

1. **Supabase**: crear proyecto → SQL Editor → ejecutar `supabase/migrations/0001_init.sql`. En Authentication → Users, crear el usuario de Laura (correo + contraseña) y desactivar registros públicos (Authentication → Sign In / Providers → "Allow new users to sign up" off).
2. **Resend**: verificar el dominio y crear una API key.
3. **Wompi**: copiar llaves (pública, privada, integridad, eventos). En Desarrolladores → URL de eventos: `https://TU-DOMINIO/api/webhooks/wompi`.
4. **Stripe**: llave secreta y webhook a `https://TU-DOMINIO/api/webhooks/stripe` con los eventos `checkout.session.completed` y `checkout.session.async_payment_succeeded`.
5. **Vercel**: importar el repo, cargar las variables de `.env.example` y desplegar. Conectar el dominio y actualizar `NEXT_PUBLIC_SITE_URL`.

Con llaves de prueba (`pub_test_…` de Wompi, `sk_test_…` de Stripe) todo funciona en modo sandbox.

## Desarrollo local

```bash
npm install
cp .env.example .env.local   # completar; PAYMENTS_BYPASS=true para saltar el pago
npm run dev
npm test          # pruebas de puntaje, riesgo y borrador del informe
npm run typecheck
```

Sin `RESEND_API_KEY`, en desarrollo los correos se imprimen en consola en lugar de enviarse.

## Pendientes antes de publicar

- **Textos legales**: `src/content/legal/*.tsx` contienen un texto base. Reemplazar por las versiones finales ya redactadas (Términos, Política de Datos, Consentimiento + addendum). Si cambia el consentimiento, subir `CONSENT_VERSION` en `src/lib/submissions.ts`.
- **Precios en COP** (`priceCop` en `src/lib/packs.ts`): hoy 36.000 / 40.000; ajustar.
- Fase 2: pack Vocacional, WhatsApp automático. Fase 3: Autismo (permiso de Cambridge para el AQ) y Selección de personal.

## Estructura

```
src/lib/instruments.ts   ítems, escalas, puntaje, bandas, umbrales de riesgo
src/lib/packs.ts         catálogo, precios, lectura preliminar
src/lib/report.ts        borrador del informe, ejercicios, HTML del correo
src/lib/payments/        Wompi, Stripe y aplicación idempotente del pago
src/lib/email.ts         Resend + plantillas de alertas
src/app/api/             checkout, webhooks, progreso/seguridad/finalizar
src/app/admin/           panel de administración
supabase/migrations/     esquema de base de datos
```
