# Nutre — Psicología y bienestar

Sitio web estático (HTML, CSS y JavaScript sin dependencias) para un proyecto
de psicología y bienestar enfocado en mejorar la relación de las personas
con la comida.

## Contenido del sitio

- **Inicio** (`index.html`): mensaje central del sitio — "el lugar donde
  encuentras la herramienta que necesitas, cuando la necesitas" — y acceso
  directo a Herramientas, Artículos y Habla conmigo.
- **Herramientas** (`herramientas.html`): notas de audio breves para
  momentos concretos ("comí de más y me siento culpable", "¿esto es hambre
  física o ansiedad?"). Es la pieza central del sitio (ver más abajo cómo
  publicar un audio nuevo).
- **Artículos** (`articulos.html` y `articulos/*.html`): textos educativos
  sobre relación con la comida, alimentación consciente, comer emocional y
  ansiedad, e imagen corporal.
- **Sobre mí** (`sobre-nosotros.html`): bio de Laura Rubio Angarita (psicóloga), su historia y su enfoque.

La navegación principal se mantiene deliberadamente corta (Inicio,
Herramientas, Artículos, Sobre mí + el botón "Habla con alguien") para que
el sitio no se sienta con demasiados lugares donde perderse. El resto del
contenido sigue existiendo y es accesible desde el pie de página de
cualquier página:

- **Recursos** (`recursos.html`): datos, señales de alerta y mitos frente a
  realidades sobre la relación con la comida.
- **Videos** (`videos.html`): charlas y guías en video (ver más abajo cómo
  publicar una nueva).
- **Guías prácticas** (`guias.html`): guías descargables de pago (autoconocimiento,
  riesgo de TCA, reconocimiento por áreas, hábitos realistas). Estructura lista,
  pendiente de activar los pagos (ver más abajo).
- **Habla con alguien** (`hablar.html`): formulario para agendar una primera
  conversación con un profesional. El formulario envía correos reales (ver
  más abajo cómo activarlo).

## Estructura de archivos

```
├── index.html
├── herramientas.html
├── articulos.html
├── articulos/
│   ├── relacion-con-la-comida.html
│   ├── alimentacion-consciente.html
│   ├── comer-emocional-y-ansiedad.html
│   └── imagen-corporal-autoestima.html
├── recursos.html
├── videos.html
├── guias.html
├── hablar.html
├── sobre-nosotros.html
├── css/styles.css
├── assets/
│   ├── team/               # foto(s) de perfil usadas en Sobre mí
│   └── audio/              # audios de Herramientas (mp3/m4a)
└── js/
    ├── main.js             # navegación móvil + envío del formulario
    ├── herramientas.js     # arma la página de Herramientas
    ├── herramientas-data.js # lista de situaciones + audios (ver abajo)
    ├── videos.js           # arma la página de videos
    ├── videos-data.js      # lista de videos editable (ver abajo)
    ├── guias.js            # arma la página de guías prácticas
    └── guias-data.js       # lista de guías editable, con su link de pago
```

## Cómo verlo localmente

No requiere instalación ni build. Basta con levantar un servidor estático
en la raíz del proyecto, por ejemplo:

```bash
python3 -m http.server 8000
```

y abrir `http://localhost:8000` en el navegador.

## Cómo funciona el formulario de contacto

El formulario de `hablar.html` envía los datos a
[FormSubmit](https://formsubmit.co), un servicio gratuito que reenvía la
información por correo sin necesidad de programar un backend propio. Está
configurado para enviar a `lrubioangarita1@gmail.com`.

**Paso obligatorio para activarlo:** la primera vez que alguien complete el
formulario, FormSubmit va a mandar un correo de confirmación a
`lrubioangarita1@gmail.com` pidiendo activar ese formulario (un solo clic).
Ese primer envío de prueba no llega como mensaje normal hasta confirmar el
correo; a partir de ahí, todos los envíos del formulario llegan directo a
la bandeja de entrada con el asunto "Nueva solicitud de conversación · Nutre".

Si en algún momento quieres cambiar el correo de destino o migrar a otro
proveedor (Formspree, un backend propio, etc.), el único lugar que hay que
tocar es el atributo `data-formsubmit-endpoint` del `<form>` en `hablar.html`
y, si el nuevo proveedor lo requiere, el bloque de envío en `js/main.js`.

## Cómo publicar un video nuevo

La página `videos.html` se arma automáticamente a partir de la lista que
está en `js/videos-data.js`. No hace falta tocar HTML ni CSS:

1. Sube el video a YouTube (puede ser "oculto"/"no listado" si no quieres
   que aparezca en las búsquedas de YouTube; con el enlace alcanza para que
   se vea en el sitio).
2. Copia el ID del video: en una URL como
   `https://www.youtube.com/watch?v=ABC12345678`, el ID es `ABC12345678`.
3. Abre `js/videos-data.js` y agrega un objeto al array `VIDEOS`, por ejemplo:

   ```js
   const VIDEOS = [
     {
       titulo: "Cómo reconocer el hambre emocional",
       descripcion: "Una mini charla de 10 minutos con ejercicios prácticos.",
       youtubeId: "ABC12345678",
       duracion: "10:24",
       categoria: "Comer emocional",
     },
   ];
   ```

4. Guarda el archivo. El video más nuevo debe ir primero en el array: se
   muestra como video destacado y el resto aparece debajo, en la grilla.

Mientras el array esté vacío, la página muestra un mensaje de "muy pronto"
en lugar de una grilla vacía.

## Cómo publicar un audio nuevo en Herramientas

`herramientas.html` se arma automáticamente a partir de la lista que está
en `js/herramientas-data.js`. Ya tiene cargadas las 6 situaciones definidas
al lanzar esta sección, todas en espera de su audio ("Audio en camino").
Para activar el audio de una de ellas:

1. Graba la nota de voz y expórtala como mp3 (o m4a).
2. Guarda el archivo en `assets/audio/`, con un nombre simple sin espacios,
   por ejemplo `culpa-despues-de-comer.mp3`.
3. Abre `js/herramientas-data.js` y completa el campo `audioSrc` de esa
   situación con la ruta del archivo:

   ```js
   {
     situacion: "Comí de más y me siento culpable.",
     descripcion: "Para el momento justo después de comer, cuando la culpa aparece antes que cualquier otra cosa.",
     duracion: "7 min",
     audioSrc: "assets/audio/culpa-despues-de-comer.mp3",
   },
   ```

4. Guarda el archivo. La tarjeta deja de mostrar "Audio en camino" y pasa a
   mostrar un reproductor de audio real.

Para agregar una situación completamente nueva (que no esté en la lista
original), simplemente agrega un objeto nuevo al array `HERRAMIENTAS` con
el mismo formato.

## Cómo habilitar los pagos de las guías prácticas (todavía no activado)

`guias.html` ya está preparado para vender guías, pero **hoy no hay ningún
cobro activo** — el array `GUIAS` en `js/guias-data.js` está vacío, así que
la página solo muestra el mensaje de "Próximamente". Para activarlo no hay
que tocar código: solo hay que elegir una plataforma de pagos, crear el
producto ahí, y pegar el link de pago que te den en `linkPago`.

Estas son las dos formas más simples de recibir pagos sin programar un
backend propio (el dinero llega directo a tu cuenta bancaria o PayPal, tú
eliges cuál):

### Opción 1 — Gumroad (recomendada para empezar)

La más simple: te entrega el archivo al comprador automáticamente, sin que
tengas que hacer nada manual por cada venta.

1. Crea una cuenta en [gumroad.com](https://gumroad.com) con tu correo.
2. Verifica tu identidad y conecta tu cuenta bancaria o PayPal para recibir
   los pagos (te lo pide Gumroad la primera vez que configuras cobros).
3. Crea un producto nuevo: sube el PDF de la guía, ponle nombre, descripción
   y precio.
4. Gumroad te da un link de pago único para ese producto (algo como
   `https://tunombre.gumroad.com/l/nombre-guia`).
5. Copia ese link y pégalo en `js/guias-data.js`, en el campo `linkPago` de
   esa guía.
6. Gumroad te transfiere el dinero de las ventas a tu cuenta según su
   calendario de pagos (por defecto, semanal), descontando su comisión.

### Opción 2 — Stripe Payment Links

Comisión más baja que Gumroad, pero la entrega del archivo al comprador no
es automática por defecto: después de cada pago tendrías que enviar tú
misma el PDF por correo (viable si son pocas ventas; para automatizarlo más
adelante se puede conectar Stripe con Zapier o un pequeño backend).

1. Crea una cuenta en [stripe.com](https://stripe.com) y completa la
   verificación de tu negocio/cuenta bancaria.
2. En el panel de Stripe, ve a "Payment Links" → "Crear nuevo".
3. Define el producto (nombre, precio) y guarda el link generado.
4. Pega ese link en `linkPago` en `js/guias-data.js`.
5. Stripe deposita el dinero de las ventas en tu cuenta bancaria (por
   defecto cada 2 días hábiles en la mayoría de países), descontando su
   comisión (~2.9% + costo fijo por transacción).

### Una vez que tengas el link

Edita `js/guias-data.js` así (ejemplo con datos reales):

```js
const GUIAS = [
  {
    titulo: "Guía de autoconocimiento: tu relación con la comida",
    descripcion: "Ejercicios guiados para identificar patrones y señales de alerta.",
    precio: "15 USD",
    formato: "PDF descargable",
    linkPago: "https://tunombre.gumroad.com/l/autoconocimiento",
  },
];
```

En cuanto guardes el archivo, la tarjeta en `guias.html` deja de decir
"Próximamente" y muestra un botón real de "Comprar guía" que lleva a esa
página de pago.

## Notas

- Todo el contenido es educativo y no sustituye la atención profesional
  individualizada.
