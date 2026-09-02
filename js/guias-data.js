/*
 * Guías prácticas de pago — Nutre
 *
 * Para publicar una guía nueva:
 *   1. Prepara el archivo (normalmente un PDF descargable).
 *   2. Súbelo a la plataforma de pagos que elijas (ver README para las
 *      opciones) y crea un producto con su precio.
 *   3. Copia el link de pago/compra que te da esa plataforma.
 *   4. Agrega un objeto nuevo al array GUIAS de abajo, siguiendo el
 *      formato del ejemplo.
 *
 * Si "linkPago" queda vacío (""), la tarjeta se muestra como "Próximamente"
 * en vez de un botón de compra — así puedes ir cargando el contenido antes
 * de tener el link de pago listo, sin que se rompa nada en la página.
 *
 * No hace falta tocar guias.html ni el CSS: la página se arma sola a
 * partir de esta lista.
 */

const GUIAS = [
  // Ejemplo — copia este bloque, complétalo y bórralo cuando ya no lo necesites:
  // {
  //   titulo: "Guía de autoconocimiento: tu relación con la comida",
  //   descripcion: "Ejercicios guiados para identificar patrones y señales de alerta.",
  //   precio: "15 USD",
  //   formato: "PDF descargable",
  //   linkPago: "", // pega aquí el link de pago (Gumroad, Payhip, Stripe...) cuando lo tengas
  // },
];
