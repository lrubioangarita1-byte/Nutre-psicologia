// Navegación móvil
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");

  if (toggle && links) {
    toggle.addEventListener("click", () => {
      const isOpen = links.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    links.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => links.classList.remove("open"));
    });
  }

  // Marca el enlace activo según la página actual
  const current = window.location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach((link) => {
    const href = link.getAttribute("href").split("/").pop();
    if (href === current) link.classList.add("active");
  });

  // Formulario de contacto ("Habla con alguien")
  const form = document.querySelector("#contact-form");
  if (form) {
    const submitBtn = form.querySelector("#contact-submit");
    const endpoint = form.dataset.formsubmitEndpoint;

    form.addEventListener("submit", async (event) => {
      event.preventDefault();
      const status = form.querySelector(".form-status");
      const requiredFields = form.querySelectorAll("[required]");
      let valid = true;

      requiredFields.forEach((field) => {
        if (!field.value.trim()) valid = false;
      });

      status.classList.remove("success", "error");

      if (!valid) {
        status.textContent = "Por favor completa los campos obligatorios antes de enviar.";
        status.classList.add("visible", "error");
        return;
      }

      // Campo trampa anti-spam: si un bot lo rellena, no enviamos nada.
      if (form.querySelector("[name='_honey']").value) {
        return;
      }

      if (!endpoint) {
        status.textContent = "No se pudo enviar el formulario. Escríbenos directamente por correo.";
        status.classList.add("visible", "error");
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = "Enviando...";

      try {
        const formData = new FormData(form);
        const payload = {};
        formData.forEach((value, key) => {
          payload[key] = value;
        });

        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify(payload),
        });

        if (!response.ok) throw new Error("Respuesta no válida del servidor");

        status.textContent =
          "Gracias por escribirnos. Hemos recibido tu mensaje y te contactaremos en menos de 48 horas hábiles.";
        status.classList.add("visible", "success");
        form.reset();
      } catch (error) {
        status.textContent =
          "No pudimos enviar tu mensaje en este momento. Por favor escríbenos directamente a lrubioangarita1@gmail.com.";
        status.classList.add("visible", "error");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Enviar solicitud";
      }
    });
  }
});
