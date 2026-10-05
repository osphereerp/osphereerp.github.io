/* ============================================================
   Osphere · landing — envío del formulario de contacto.

   GitHub Pages sirve archivos estáticos: no hay servidor que reciba el POST.
   Por eso el formulario se manda a Formspree, que recibe el envío y te lo
   reenvía por mail.

   >>> ÚNICO PASO DE CONFIGURACIÓN <<<
   1. Crear una cuenta en https://formspree.io (plan free: 50 envíos/mes).
   2. Crear un formulario nuevo; te da una URL tipo https://formspree.io/f/abcdwxyz
   3. Pegarla acá abajo, en lugar de PEGAR_ACA_TU_ENDPOINT.
   ============================================================ */

const FORM_ENDPOINT = "https://formspree.io/f/PEGAR_ACA_TU_ENDPOINT";

const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const submitBtn = document.getElementById("submit-btn");

const REQUIRED_FIELDS = ["nombre", "empresa", "email"];

function showStatus(message, kind) {
  statusEl.textContent = message;
  statusEl.className = "form-status " + kind;
}

function firstProblem() {
  for (const name of REQUIRED_FIELDS) {
    const field = form.elements[name];
    const empty = !field.value.trim();
    const badEmail = name === "email" && !empty && !field.checkValidity();
    field.setAttribute("aria-invalid", empty || badEmail ? "true" : "false");
    if (empty) return { field, message: "Revisá los campos marcados: faltan datos para poder contactarte." };
    if (badEmail) return { field, message: "Ese email no parece válido: sin él no tenemos cómo responderte." };
  }
  return null;
}

async function sendForm(data) {
  const response = await fetch(FORM_ENDPOINT, {
    method: "POST",
    headers: { Accept: "application/json" },
    body: data,
  });
  if (!response.ok) throw new Error("El servicio de formularios respondió " + response.status);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (FORM_ENDPOINT.includes("PEGAR_ACA_TU_ENDPOINT")) {
    showStatus("El formulario todavía no está configurado (ver main.js).", "error");
    return;
  }

  const problem = firstProblem();
  if (problem) {
    showStatus(problem.message, "error");
    problem.field.focus();
    return;
  }

  submitBtn.disabled = true;
  submitBtn.textContent = "Enviando…";
  showStatus("", "");

  try {
    await sendForm(new FormData(form));
    form.reset();
    showStatus("¡Listo! Recibimos tu mensaje y te escribimos dentro de las 24 horas hábiles.", "ok");
  } catch (error) {
    showStatus("No pudimos enviar el mensaje. Escribinos por mail y lo resolvemos.", "error");
    console.error(error);
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = "Pedir una demo";
  }
});

document.getElementById("anio").textContent = String(new Date().getFullYear());
