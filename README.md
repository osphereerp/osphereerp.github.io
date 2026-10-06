# Osphere · landing

Sitio estático de una sola página para captar contactos. Sin build, sin dependencias:
tres archivos y una imagen.

```
index.html     la página
styles.css     estilos (paleta tomada del ERP: navy #0b1a3d / acento #2f6bff)
main.js        envío del formulario
assets/        el logo
.nojekyll      que GitHub Pages sirva los archivos tal cual
```

Para verla localmente: abrir `index.html` en el navegador. Nada más.

---

## 1. El formulario (ya conectado)

GitHub Pages sirve archivos estáticos: no hay servidor que reciba el formulario. Lo recibe
**Formspree** y lo reenvía a `santinoolivetti810@gmail.com`.

- Formulario: "Contacto Osphere", endpoint `https://formspree.io/f/mgaovwdp` (en `main.js`).
- Plan free: **50 envíos por mes**. Los envíos también quedan en el panel de Formspree.

> Si 50 por mes te queda corto: la alternativa gratis sin tope práctico es mover el sitio a
> Cloudflare Pages y recibir el POST con un Worker. Los archivos son los mismos.

## 2. Subir a GitHub

**Tiene que ser un repo nuevo y público**, separado del repo del ERP: GitHub Pages sólo
publica gratis desde repos públicos, y el del ERP es privado.

```bash
cd osphere-landing
git init
git add .
git commit -m "Landing de Osphere"
git branch -M main
git remote add origin https://github.com/<tu-usuario>/osphere-landing.git
git push -u origin main
```

## 3. Publicar

En el repo: **Settings → Pages → Build and deployment**

- Source: `Deploy from a branch`
- Branch: `main`, carpeta `/ (root)` → **Save**

En un minuto queda en `https://<tu-usuario>.github.io/osphere-landing/`.

### Dominio propio (opcional)

1. En **Settings → Pages → Custom domain** escribir el dominio (ej. `osphere.com.ar`) y guardar.
   Eso crea un archivo `CNAME` en el repo.
2. En tu proveedor de DNS:
   - para `www.osphere.com.ar`: un registro `CNAME` apuntando a `<tu-usuario>.github.io`
   - para el dominio raíz: cuatro registros `A` a `185.199.108.153`, `185.199.109.153`,
     `185.199.110.153`, `185.199.111.153`
3. Tildar **Enforce HTTPS** cuando GitHub termine de emitir el certificado (puede tardar
   hasta 24 h).

## 4. Qué conviene retocar antes de publicar

- **Textos de la sección "Preguntas"**: el precio y el alojamiento están redactados en
  genérico. Poné lo que realmente vas a ofrecer.
- **Capturas del sistema**: hoy el hero muestra un esquema dibujado con CSS. Cuando tengas
  capturas reales de pantallas, reemplazan al bloque `.flow-card` y rinden mucho más.
- **Mail de contacto en el pie**: no hay ninguno. Si querés uno visible, agregalo en el footer.
