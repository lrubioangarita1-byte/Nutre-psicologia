# Guía para publicar el sitio

Esta guía es para Laura: está en orden y sin términos técnicos innecesarios. El sitio ya está programado y probado; publicar consiste en **crear cuentas gratuitas y copiar unas llaves**.

## Qué cuesta cada cosa

| Servicio | Para qué sirve | Costo |
|---|---|---|
| GitHub | Guarda el código (ya lo tienes) | Gratis |
| Supabase | Base de datos y tu usuario de administradora | Gratis (plan Free) |
| Vercel | Publica el sitio en internet | Gratis para probar (plan Hobby). **Para cobrar a clientes, sus reglas piden el plan Pro (~20 USD/mes)** |
| Resend | Envía los correos (informes y alertas de crisis) | Gratis hasta 3.000 correos/mes (100 por día) |
| Wompi | Cobros en pesos (PSE, Nequi, tarjetas) | Sin mensualidad. Solo cobra una comisión por cada venta |
| Stripe | Cobros en dólares | Sin mensualidad. **Ojo:** hasta donde sé, Stripe no abre cuentas a personas o empresas en Colombia. Puedes dejarlo apagado: el sitio funciona solo con Wompi |
| Dominio (conocetepsico.com) | Tu dirección propia | ~10–15 USD al año. **Resend lo necesita para enviar correos a clientes** |

👉 **Puedes dejar todo listo sin pagar nada.** Cobran solo dos cosas, y únicamente cuando decidas abrir al público: el dominio y, si vas a cobrar a clientes, el plan Pro de Vercel.

---

## Paso 1 — Supabase (base de datos) · Gratis

1. Entra a **supabase.com** → *Start your project* → regístrate con GitHub.
2. *New project*:
   - Nombre: `laura-rubio-psicologia`
   - Contraseña: genera una y **guárdala**
   - Región: **East US (North Virginia)** o **South America (São Paulo)**
3. Cuando termine de crearse: menú izquierdo → **SQL Editor** → *New query*.
   - Abre en GitHub el archivo `supabase/migrations/0001_init.sql`, copia todo su contenido, pégalo y pulsa **Run**.
   - Repite con `supabase/migrations/0002_evidencia_consentimiento.sql`.
4. Menú **Authentication → Users → Add user → Create new user**:
   - Correo: `lrubioangarita1@gmail.com`
   - Una contraseña segura (será la del panel `/admin`)
   - Marca *Auto confirm user*
5. **Authentication → Sign In / Providers**: desactiva *Allow new users to sign up*. Así nadie más puede crear cuenta.
6. **Project Settings → API**: ahí están las tres llaves para Vercel (`Project URL`, `anon public` y `service_role`).

> ⚠️ En el plan gratuito, Supabase **pausa el proyecto si pasa una semana sin uso**. Mientras estés probando no importa: se reactiva con un clic desde su panel. Con clientes reales ya no se pausa, porque hay actividad.

## Paso 2 — Vercel (publicar) · Gratis para probar

1. **vercel.com** → *Sign Up* → *Continue with GitHub*.
2. *Add New… → Project* → busca tu repositorio → **Import**. En **Project Name** escribe `conocetepsico`.
3. Abre **Environment Variables** y agrega:

   | Nombre | Valor |
   |---|---|
   | `NEXT_PUBLIC_SUPABASE_URL` | Project URL de Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Llave `anon public` |
   | `SUPABASE_SERVICE_ROLE_KEY` | Llave `service_role` (**secreta**) |
   | `ADMIN_EMAILS` | `lrubioangarita1@gmail.com` |
   | `ALERT_EMAILS` | `lrubioangarita1@gmail.com` |

4. Pulsa **Deploy**. En ~2 minutos tendrás una dirección como `conocetepsico.vercel.app`.
5. Entra a `…vercel.app/admin`, inicia sesión y revisa la tarjeta **"Estado para publicar"**: te dice qué falta.

## Paso 3 — Resend (correos) · Gratis

1. **resend.com** → regístrate.
2. *API Keys → Create API Key* → cópiala en Vercel como `RESEND_API_KEY`.
3. **Sin dominio propio**, Resend solo deja enviar correos a tu propio correo. Sirve para probar.
4. **Con dominio**: *Domains → Add domain*, copia los registros DNS donde compraste el dominio y, cuando aparezca *Verified*, agrega en Vercel:
   - `EMAIL_FROM` = `Conócete · Laura Rubio <informes@conocetepsico.com>`
   - `EMAIL_REPLY_TO` = `Lrubioangarita1@gmail.com`

## Paso 4 — Wompi (pagos en pesos) · Sin mensualidad

1. **comercios.wompi.co** → regístrate como comercio. Pedirán RUT y datos bancarios para recibir el dinero.
2. Para probar sin dinero real, usa las **llaves de prueba** (empiezan por `pub_test_` y `prv_test_`). En Vercel:
   - `WOMPI_PUBLIC_KEY`
   - `WOMPI_PRIVATE_KEY`
   - `WOMPI_INTEGRITY_SECRET` (en *Desarrolladores → Secretos para integración técnica*)
   - `WOMPI_EVENTS_SECRET`
3. En *Desarrolladores → URL de eventos*, pon: `https://TU-SITIO/api/webhooks/wompi`.
4. Haz una compra de prueba completa: pagas, respondes y te llega el informe desde el panel.
5. Para abrir al público, cambia las llaves de prueba por las de producción (`pub_prod_…`).

Después de agregar o cambiar llaves en Vercel: **Deployments → ⋯ → Redeploy**.

## Paso 5 — Antes de abrir al público

- [ ] Enviar a Claude tu **cédula o NIT, dirección y ciudad** para los textos legales (art. 50, Ley 1480).
- [ ] Revisión de los textos legales por un abogado (recomendado).
- [ ] Comprar el dominio, conectarlo en Vercel (*Settings → Domains*) y agregar `NEXT_PUBLIC_SITE_URL=https://tudominio.com`.
- [ ] Verificar el dominio en Resend.
- [ ] Wompi con llaves de producción.
- [ ] Vercel en plan Pro (requisito de Vercel para sitios que cobran).
- [ ] Una compra real de prueba de punta a punta.
- [ ] Probar el protocolo de crisis: responder "Sí" en una prueba tuya y confirmar que te llega el correo urgente.
- [ ] Revisar que no haya precios de prueba ni llaves `test` en la tarjeta "Estado para publicar".
