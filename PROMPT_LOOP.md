# 🔁 Prompt Loop de Automejora — Best ATV Arenal Tours

Copia y pega este prompt en el agente (o úsalo con `/goal` para que corra sin detenerse) cada vez que quieras otra ronda de mejoras. Cada iteración **audita → puntúa → corrige → verifica → registra**.

---

## PROMPT (copiar desde aquí)

```
Eres un equipo senior (UX lead, diseñador visual, copywriter de turismo, dev front-end y
especialista SEO/CRO) mejorando el sitio en:
C:\Users\HP\.gemini\antigravity\scratch\best-atv-arenal  (index.html, styles.css, app.js)

Objetivo de negocio: maximizar reservas por WhatsApp (+506 8467 4777) de los tours
Discovery Adventure ($99), Jet Ski Lago Arenal ($109), Selva y Maleku ATV ($85) y
Side by Side ($300/vehículo, 3 h, 1–6 personas).

Ejecuta UNA iteración del loop:

1. OBSERVAR
   - Toma capturas de escritorio (1440px) y móvil (390px) con el script
     tools/shot.ps1 (capturas en la carpeta indicada por $o dentro del script) y revísalas sección por sección, en EN y ES.
   - Lee IMPROVEMENT_LOG.md para no repetir trabajo.

2. PUNTUAR (0–10, con una frase de justificación cada una)
   a) Impacto visual / marca      e) Rendimiento (peso imágenes, JS, CLS)
   b) Claridad de la oferta       f) Accesibilidad (WCAG AA, teclado, contraste)
   c) Conversión / CTA            g) SEO local + datos estructurados
   d) Responsive / móvil          h) Calidad de código / mantenibilidad

3. PRIORIZAR
   Elige las 3 mejoras de mayor impacto/esfuerzo para las categorías con menor nota.
   Reglas: nada de texto copiado del sitio original, nada de reseñas, premios o
   políticas inventadas (si falta un dato, márcalo como "POR CONFIRMAR" en el log).

4. IMPLEMENTAR
   Aplica los cambios. Mantén EN/ES sincronizados (diccionario ES en app.js).

5. VERIFICAR
   Vuelve a tomar capturas, confirma que no hay overflow horizontal, errores de consola
   ni regresiones. Si algo empeoró, reviértelo.

6. REGISTRAR
   Añade al final de IMPROVEMENT_LOG.md: número de iteración, notas antes/después,
   cambios realizados, y próximos 3 candidatos.

Condición de parada: todas las categorías ≥ 9 durante 2 iteraciones seguidas,
o 6 iteraciones completadas. Si no se cumple, empieza la siguiente iteración.
```

---

## Backlog sugerido para próximas iteraciones
- Reemplazar imágenes generadas por fotos reales del negocio (WebP/AVIF + `srcset`).
- Reseñas reales vía widget oficial de TripAdvisor.
- Página individual por tour (itinerario, incluye/no incluye, punto de encuentro) para SEO.
- Integrar motor de reservas con pago (p. ej. FareHarbor, Bókun o Stripe Checkout).
- Video corto de dron en el hero (MP4/WebM < 3 MB, `poster` con la imagen actual).
- Analytics de eventos (clic en WhatsApp, tour elegido) para medir conversión.
