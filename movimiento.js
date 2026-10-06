/* ============================================================
   Osphere · landing — el movimiento de la página.

   Separado del formulario a propósito: esto es presentación y aquello es la
   única función de negocio que la página tiene. Si algo de acá falla, el
   formulario tiene que seguir mandando igual.

   La regla que ordena todo el archivo: el CSS esconde para animar sólo bajo
   `html.js`, y esa clase la pone este archivo. Sin JS no hay nada escondido.
   ============================================================ */

const prefiereMenosMovimiento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.documentElement.classList.add("js");

/* ---------- Aparición de cada bloque al entrar en pantalla ---------- */

const SELECTORES_QUE_APARECEN = [
  ".section-head",
  ".card",
  ".pitch",
  ".steps li",
  ".faq details",
  ".contact-copy",
  ".form-card",
  ".stat",
];

/** El retraso escalonado hace que un grupo entre como una ola y no como un bloque. */
const RETRASO_ENTRE_HERMANOS_MS = 70;
const RETRASO_MAXIMO_MS = 420;

const prepararApariciones = () => {
  const elementos = document.querySelectorAll(SELECTORES_QUE_APARECEN.join(", "));
  elementos.forEach((elemento) => elemento.setAttribute("data-reveal", ""));

  // Un navegador sin IntersectionObserver no se queda con la página en blanco:
  // se le muestra todo de una vez.
  if (!("IntersectionObserver" in window)) {
    elementos.forEach((elemento) => elemento.classList.add("is-visible"));
    return;
  }

  const observador = new IntersectionObserver(
    (entradas) => {
      entradas
        .filter((entrada) => entrada.isIntersecting)
        .forEach((entrada, orden) => {
          const retraso = Math.min(orden * RETRASO_ENTRE_HERMANOS_MS, RETRASO_MAXIMO_MS);
          entrada.target.style.setProperty("--reveal-delay", `${retraso}ms`);
          entrada.target.classList.add("is-visible");
          observador.unobserve(entrada.target);
        });
    },
    { rootMargin: "0px 0px -12% 0px", threshold: 0.12 },
  );

  elementos.forEach((elemento) => observador.observe(elemento));

  /*
   * Red de seguridad: al imprimir, el navegador no scrollea, así que todo lo que
   * todavía no entró en pantalla saldría EN BLANCO en el papel. Antes de imprimir
   * se muestra todo —una animación nunca puede costar contenido—.
   */
  window.addEventListener("beforeprint", () => {
    elementos.forEach((elemento) => elemento.classList.add("is-visible"));
  });
};

/* ---------- Las cifras cuentan hasta su valor ---------- */

const DURACION_CONTEO_MS = 1100;

/** Arranca rápido y frena al final, que es como se lee un número que "llega". */
const desaceleracion = (avance) => 1 - (1 - avance) ** 3;

const contarHasta = (elemento) => {
  const destino = Number(elemento.dataset.countTo);
  const sufijo = elemento.dataset.countSuffix ?? "";
  if (!Number.isFinite(destino)) {
    return;
  }
  const inicio = performance.now();
  const paso = (ahora) => {
    const avance = Math.min((ahora - inicio) / DURACION_CONTEO_MS, 1);
    elemento.textContent = `${Math.round(destino * desaceleracion(avance))}${sufijo}`;
    if (avance < 1) {
      requestAnimationFrame(paso);
    }
  };
  requestAnimationFrame(paso);
};

const prepararCifras = () => {
  const cifras = document.querySelectorAll("[data-count-to]");
  if (!cifras.length || !("IntersectionObserver" in window)) {
    return;
  }
  const observador = new IntersectionObserver(
    (entradas) => {
      entradas
        .filter((entrada) => entrada.isIntersecting)
        .forEach((entrada) => {
          contarHasta(entrada.target);
          observador.unobserve(entrada.target);
        });
    },
    { threshold: 0.6 },
  );
  cifras.forEach((cifra) => observador.observe(cifra));
};

/* ---------- Las cinco consecuencias se encienden en orden ---------- */

const INTERVALO_ENTRE_PASOS_MS = 900;
const PAUSA_ANTES_DE_REPETIR_MS = 1800;

const prepararSecuenciaDelFlujo = () => {
  const pasos = Array.from(document.querySelectorAll("#flow-card .flow-list li"));
  if (!pasos.length) {
    return;
  }
  let encendidos = 0;
  const avanzar = () => {
    if (encendidos < pasos.length) {
      pasos[encendidos].classList.add("is-lit");
      encendidos += 1;
      window.setTimeout(avanzar, INTERVALO_ENTRE_PASOS_MS);
      return;
    }
    window.setTimeout(() => {
      pasos.forEach((paso) => paso.classList.remove("is-lit"));
      encendidos = 0;
      window.setTimeout(avanzar, INTERVALO_ENTRE_PASOS_MS);
    }, PAUSA_ANTES_DE_REPETIR_MS);
  };
  window.setTimeout(avanzar, 600);
};

/* ---------- El desfile de módulos se duplica para empalmar ---------- */

const prepararDesfile = () => {
  const riel = document.querySelector(".marquee-track");
  if (!riel) {
    return;
  }
  // El `@keyframes` desplaza el 50% del riel: la segunda copia tapa el salto.
  riel.innerHTML += riel.innerHTML;
};

/* ---------- Encabezado y barra de avance, atados al scroll ---------- */

const ALTURA_PARA_COMPACTAR_PX = 40;

const prepararScroll = () => {
  const encabezado = document.querySelector(".site-header");
  const barra = document.getElementById("scroll-progress");
  let pedido = false;

  const actualizar = () => {
    pedido = false;
    const desplazamiento = window.scrollY;
    encabezado?.classList.toggle("is-scrolled", desplazamiento > ALTURA_PARA_COMPACTAR_PX);
    if (barra) {
      const recorrido = document.documentElement.scrollHeight - window.innerHeight;
      const avance = recorrido > 0 ? desplazamiento / recorrido : 0;
      barra.style.transform = `scaleX(${Math.min(avance, 1)})`;
    }
  };

  // El scroll dispara muchas veces por segundo; se pinta una vez por cuadro.
  window.addEventListener(
    "scroll",
    () => {
      if (!pedido) {
        pedido = true;
        requestAnimationFrame(actualizar);
      }
    },
    { passive: true },
  );
  actualizar();
};

prepararScroll();
prepararDesfile();

if (!prefiereMenosMovimiento) {
  prepararApariciones();
  prepararCifras();
  prepararSecuenciaDelFlujo();
}
