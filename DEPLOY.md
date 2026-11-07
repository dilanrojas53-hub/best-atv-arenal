# Guía de Paso a Producción — Outback Adventures · Best ATV Arenal Tours

Este paquete incluye el sitio estático completo optimizado (HTML5 + CSS3 + JS vanilla sin dependencias pesadas), configuración lista para **Vercel** (`vercel.json`) y esquema + conector REST para **Supabase** (`supabase/schema.sql`).

---

## Opción A — Desplegar en Vercel en 1 minuto

### Método 1: Desde terminal (Vercel CLI)
```bash
cd C:\Users\HP\.gemini\antigravity\scratch\best-atv-arenal
npx vercel login
npx vercel --prod
```

### Método 2: Desde GitHub / GitLab
1. Sube esta carpeta a un repositorio de GitHub:
   ```bash
   git init
   git add index.html styles.css app.js assets vercel.json supabase
   git commit -m "feat: Outback Adventures production release"
   ```
2. Entra a [https://vercel.com/new](https://vercel.com/new), importa el repositorio y haz clic en **Deploy** (no requiere *Build Command* ni *Output Directory* especial; `vercel.json` ya configura caché inmutable en `/assets/*` y cabeceras de seguridad).

---

## Opción B — Conectar con Supabase (Registro de Leads de Reserva)

El boleto **Adventure Pass (`#book`)** ya incluye un conector REST ligero y no bloqueante en `app.js`: cada vez que un cliente pulsa **Enviar por WhatsApp**, además de abrir el chat de WhatsApp (`+506 8467 4777`), guarda automáticamente el lead en la tabla `public.booking_leads` de Supabase.

1. Crea un proyecto gratis en [https://supabase.com](https://supabase.com).
2. Abre el **SQL Editor** en Supabase, pega el contenido de [`supabase/schema.sql`](./supabase/schema.sql) y ejecútalo (**Run**).
3. En **Project Settings → API**, copia tu **Project URL** y tu clave pública **`anon` `public`**.
4. Pégalas en las primeras líneas de [`app.js`](./app.js) (en `SUPABASE_URL` y `SUPABASE_ANON_KEY`):
   ```js
   const SUPABASE_URL = "https://tu-proyecto.supabase.co";
   const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...";
   ```
   *(Mientras estén vacías, el sitio funciona 100% directo a WhatsApp sin errores).*
