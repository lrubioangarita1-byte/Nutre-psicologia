/*
 * Lista de videos de Nutre.
 *
 * Para publicar un video nuevo:
 *   1. Sube el video a YouTube (puede ser "oculto" / "no listado" si no
 *      quieres que aparezca en búsquedas de YouTube; con el enlace alcanza
 *      para que se vea aquí).
 *   2. Copia el ID del video: en una URL como
 *      https://www.youtube.com/watch?v=ABC12345678, el ID es "ABC12345678".
 *   3. Agrega un objeto nuevo al array VIDEOS de abajo, siguiendo el
 *      formato del ejemplo. El más reciente se muestra primero, así que
 *      agrega los videos nuevos al principio del array.
 *
 * No hace falta tocar videos.html ni el CSS: la página se arma sola a
 * partir de esta lista.
 */

const VIDEOS = [
  // Ejemplo — copia este bloque, complétalo y bórralo cuando ya no lo necesites:
  // {
  //   titulo: "Cómo reconocer el hambre emocional",
  //   descripcion: "Una mini charla de 10 minutos con ejercicios prácticos para diferenciar el hambre física de la emocional.",
  //   youtubeId: "dQw4w9WgXcQ",
  //   duracion: "10:24",
  //   categoria: "Comer emocional",
  // },
];
