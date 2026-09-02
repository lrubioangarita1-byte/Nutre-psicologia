/*
 * Herramientas de Nutre: notas de audio para un momento concreto.
 *
 * La idea: alguien llega sintiendo algo muy específico ("comí de más y
 * me siento culpable"), encuentra la situación que más se le parece, y
 * escucha un audio corto pensado exactamente para eso.
 *
 * Para publicar un audio nuevo:
 *   1. Graba la nota de voz y expórtala como mp3 (o m4a).
 *   2. Guarda el archivo en assets/audio/, con un nombre simple sin
 *      espacios, por ejemplo: culpa-despues-de-comer.mp3
 *   3. Completa "audioSrc" con esa ruta, por ejemplo:
 *      "assets/audio/culpa-despues-de-comer.mp3"
 *   4. Si quieres, completa "duracion" (ej. "7 min").
 *
 * Mientras "audioSrc" esté vacío (""), la tarjeta muestra el texto de
 * la situación y su descripción, pero con una etiqueta de "Audio en
 * camino" en vez de un reproductor. No hace falta tocar herramientas.html
 * ni el CSS para agregar o editar herramientas.
 */

const HERRAMIENTAS = [
  {
    situacion: "Tengo miedo de comer X alimento.",
    descripcion: "Para cuando pensar en un alimento específico te genera ansiedad, y evitarlo se siente más fácil que enfrentarlo.",
    duracion: "",
    audioSrc: "",
  },
  {
    situacion: "Comí de más y me siento culpable.",
    descripcion: "Para el momento justo después de comer, cuando la culpa aparece antes que cualquier otra cosa.",
    duracion: "",
    audioSrc: "",
  },
  {
    situacion: "No puedo dejar de pensar en las calorías.",
    descripcion: "Para cuando las calorías ocupan tu cabeza todo el día y no logras 'apagar' esa cuenta mental.",
    duracion: "",
    audioSrc: "",
  },
  {
    situacion: "Quiero quedar embarazada sin obsesionarme con cada bocado.",
    descripcion: "Para acompañar el deseo de cuidarte en la búsqueda de un embarazo, sin que cada comida se sienta como un examen.",
    duracion: "",
    audioSrc: "",
  },
  {
    situacion: "¿Esto es hambre física o ansiedad?",
    descripcion: "Un ejercicio corto para diferenciar, en el momento, qué tipo de hambre estás sintiendo realmente.",
    duracion: "",
    audioSrc: "",
  },
  {
    situacion: "Cómo volver a confiar en mi cuerpo.",
    descripcion: "Para cuando sientes que tu cuerpo y tú dejaron de estar en el mismo equipo.",
    duracion: "",
    audioSrc: "",
  },
];
