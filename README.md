# Punto Gráfico — Web corporativa

Sitio web estático de **Punto Gráfico**, imprenta y empresa de producción gráfica integral. Construido con HTML, CSS y JavaScript vanilla, sin dependencias de build ni frameworks.

---

## Estructura del proyecto

```
web/
├── index.html               # Página de inicio
├── servicios.html           # Servicios detallados con proceso
├── productos.html           # Catálogo completo de productos
├── contacto.html            # Formulario de presupuesto y datos de contacto
├── cookies.html             # Política de cookies
├── politica-privacidad.html # Política de privacidad
├── aviso-legal.html         # Aviso legal
├── 404.html                 # Página de error 404
│
├── css/
│   ├── styles.css           # Estilos globales, sistema de diseño y componentes compartidos
│   ├── legal.css            # Estilos de páginas legales y banner de cookies
│   ├── servicios.css        # Estilos específicos de servicios.html
│   ├── productos.css        # Estilos específicos de productos.html
│   ├── contacto.css         # Estilos específicos de contacto.html
│   └── 404.css              # Estilos específicos de 404.html
│
├── js/
│   ├── main.js              # Navbar responsive, scroll y validación de formularios
│   └── cookies.js           # Gestor de consentimiento de cookies
│
└── img/                     # Imágenes del proyecto (JPEG, PNG, WEBP, AVIF)
```

---

## Páginas

| Página | Descripción |
|--------|-------------|
| `index.html` | Hero con propuesta de valor, servicios resumidos, trabajos destacados, ventajas, testimonios y formulario de contacto rápido |
| `servicios.html` | Seis bloques de servicio (offset, gran formato, cartelería, sobres, regalo, integral) con proceso de 4 pasos |
| `productos.html` | Catálogo de más de 60 productos organizados por categoría con filtro y precios orientativos |
| `contacto.html` | Tarjetas de contacto rápido (teléfono, email, WhatsApp, formulario), formulario completo de presupuesto y sidebar con información de contacto |
| `404.html` | Página de error personalizada con navegación de recuperación |
| Páginas legales | Cookies, política de privacidad y aviso legal con formato estructurado |

---

## Tecnologías

- **HTML5** semántico (`<header>`, `<main>`, `<section>`, `<article>`, `<nav>`)
- **CSS3** con custom properties (sin preprocesador)
- **JavaScript ES6** vanilla (sin frameworks)
- **Fuente:** [Nunito](https://fonts.google.com/specimen/Nunito) — pesos 400, 600, 700 y 800
- **Iconos:** [Font Awesome 6.4.0](https://fontawesome.com/) vía CDN

No hay `package.json`, bundler ni paso de compilación. El sitio se sirve directamente como archivos estáticos.

---

## Sistema de diseño

### Paleta de colores

Definida como custom properties en `:root` dentro de `css/styles.css`:

| Variable | Valor | Uso |
|----------|-------|-----|
| `--bg` | `#ffffff` | Fondo principal |
| `--bg-soft` | `#f6f7f9` | Fondo de secciones alternadas |
| `--text` | `#0f1824` | Texto principal y fondos oscuros |
| `--text-secondary` | `#555a63` | Texto secundario |
| `--text-muted` | `#6b7280` | Texto de apoyo (pies, etiquetas) |
| `--accent` | `#d20d73` | Color de marca principal (rosa/magenta) |
| `--accent-alt` | `#00a5e3` | Azul para fondos oscuros |
| `--border` | `#e7e8ec` | Bordes y separadores |
| `--whatsapp` | `#0e7a35` | Verde WhatsApp accesible |

> **Nota:** `--accent-alt` (`#00a5e3`) se reserva para uso sobre fondos oscuros (`#0f1824`). En fondos claros se usa `#005f8a` directamente para cumplir el contraste mínimo.

### Espaciado

Sistema basado en múltiplos de 8 px:

| Variable | Valor |
|----------|-------|
| `--space-xs` | 4 px |
| `--space-sm` | 8 px |
| `--space-md` | 16 px |
| `--space-lg` | 24 px |
| `--space-xl` | 32 px |
| `--space-xxl` | 48 px |
| `--space-3xl` | 64 px |

### Tipografía

- **Familia:** Nunito (sistema de respaldo: `system-ui, -apple-system, sans-serif`)
- **Tamaño base:** 16 px / línea 1.6
- **H1:** `clamp(28px, 6vw, 48px)` — peso 800
- **H2:** `clamp(24px, 4vw, 36px)` — peso 800
- **H3:** 20 px — peso 700

---

## Accesibilidad (WCAG 2.1 AA)

Todos los colores de texto cumplen el ratio mínimo de **4.5:1** sobre su fondo:

| Elemento | Color | Fondo | Ratio |
|----------|-------|-------|-------|
| Texto principal | `#0f1824` | `#ffffff` | 18.1:1 |
| Texto secundario | `#555a63` | `#ffffff` | 6.9:1 |
| Texto muted | `#6b7280` | `#ffffff` | 4.8:1 |
| Acento `#d20d73` | — | `#ffffff` | 5.1:1 |
| Enlace `#005f8a` | — | `#ffffff` | 7.0:1 |
| Botón WhatsApp (texto blanco) | `white` | `#0e7a35` | 5.4:1 |
| Estrellas valoración | `#b45309` | `#ffffff` | 5.0:1 |
| `.eyebrow` en fondo oscuro | `rgba(255,255,255,0.85)` | `#0f1824` | ~14:1 |

Otras medidas de accesibilidad implementadas:

- Todos los `<img>` tienen atributo `alt` descriptivo. Los logos del navbar incluyen `alt="Volver al inicio"`.
- Todos los `<input>` y `<select>` tienen `<label>` asociado mediante `for`/`id`.
- Los labels visualmente ocultos usan la clase `.sr-only` (compatible con todos los lectores de pantalla).
- Los toggles del modal de cookies incluyen texto oculto que describe la acción (`<span class="sr-only">`).
- Navegación por teclado funcional: foco visible en botones y enlaces, `aria-expanded` en el menú móvil, `aria-label` en botones icono.
- Modal de cookies con `role="dialog"`, `aria-modal="true"` y trampa de foco.

---

## JavaScript

### `main.js`

- **Navbar responsive:** toggle del menú móvil con actualización de `aria-expanded`; clase `scrolled` en scroll > 30 px.
- **Validación de formulario:** validación en tiempo real (en `blur` y `change`) y en submit. Reglas configuradas por campo (`required`, `minLength`, `pattern`). Muestra mensajes de error específicos y hace scroll al primer campo inválido.

### `cookies.js`

Gestor de consentimiento RGPD con tres categorías (esenciales, analíticas, preferencias):

- **Persistencia dual:** guarda la decisión en `localStorage` y en una cookie HTTP (`pg_cc`) con 365 días de expiración como fallback (útil en modo privado o cuando `localStorage` está bloqueado).
- **Comportamiento cross-page:** el banner solo se muestra una vez. Una vez tomada la decisión, no vuelve a aparecer en ninguna página del sitio.
- **API pública:** `window.PGCookies.openSettings()`, `window.PGCookies.getPrefs()`, `window.PGCookies.reset()`.
- **Evento personalizado:** dispara `pg:consent` en `document` con las preferencias al guardar, para integrar con herramientas de analítica.

---

## Despliegue

El sitio no requiere servidor de aplicaciones. Cualquier hosting estático es válido:

```bash
# Servidor local rápido con Python
python3 -m http.server 8000

# O con Node.js
npx serve .
```

Para producción: subir el contenido de la carpeta `web/` a la raíz del servidor (Apache, Nginx, Netlify, Vercel, GitHub Pages, etc.).

> Asegúrate de que el servidor devuelve `404.html` para rutas no encontradas. En Apache añade `ErrorDocument 404 /404.html` al `.htaccess`.

---

## Convenciones del código

- **CSS:** BEM-ish, sin anidamiento. Cada página tiene su propio fichero CSS además del global `styles.css`.
- **JavaScript:** ES6, sin transpilación. IIFEs para encapsular módulos (`cookies.js`).
- **HTML:** Sin comentarios de implementación en producción. Comentarios de sección con `<!-- ───── Nombre ───── -->`.
- **Imágenes:** WEBP y AVIF para fotografías, PNG para logotipos y gráficos con transparencia.
