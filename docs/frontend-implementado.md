# Frontend de Scenia

Adaptación visual local realizada el 10 de octubre de 2026 sobre React + Vite y los servicios existentes.

## Recorrido disponible

- `/`: portada con enlaces al programa, cartelera y acceso.
- `/ingresar`: presentación y formulario de acceso. La autenticación institucional aún no existe; el formulario lo indica y los tres botones de demostración abren las vistas sin sesión real.
- `/docente`: panel con tarjetas de clases, indicadores y navegación.
- `/docente/clases`: listado ilustrativo.
- `/docente/clases/:id`: detalle y acceso al generador con tema y edad precargados.
- `/docente/guias/nueva`: formulario original integrado en el diseño; conserva su llamada a `/generar-guia`.
- `/cartelera`: catálogo ilustrativo con búsqueda, temática, limpieza de filtros y estado vacío.
- `/cartelera/:id`: detalle de obra y enlace a preparar guía con tema y objetivo precargados.
- `/programa`: presentación de las seis sesiones.
- `/estudiante` y `/director`: vistas anteriores conservadas y adaptadas al marco visual. Mantienen sus llamadas al backend.

## Ejecución

Desde `frontend`, ejecutar `npm ci` y `npm run dev`. Para comprobar la compilación: `npm run build`.

La API utiliza `VITE_API_URL` o, en su ausencia, `http://localhost:8000`. El backend debe estar iniciado y permitir por CORS el origen exacto de la vista previa. El código actual del backend usa Flask; esta adaptación no cambia su framework. La decisión de persistencia sigue siendo Supabase.

## Alcance de los datos

`src/data/demo.js` contiene ejemplos ficticios y no escribe en Supabase. No hay reservas reales, autenticación, matrícula ni carga de clases implementadas en esta entrega. No se muestran respuestas de IA simuladas si el servidor falla. Las claves privilegiadas permanecen fuera del frontend.

Se conserva el generador existente, las reflexiones y los gráficos. Se añade `react-is`, requerido por Recharts, y se carga el módulo del Director bajo demanda. Las ilustraciones y afiches están hechos con SVG/CSS locales; no se requieren fotografías externas ni se incorporan videos de obras.

## Verificación

Compilación de producción comprobada. Revisión visual de portada, acceso y panel docente, incluido ancho de 390 px. Navegación probada: acceso de demostración → docente → clase → generador con tema y edad precargados. Búsqueda de cartelera y estado sin resultados verificados. Se verificó el mensaje de error del generador cuando el backend está desconectado; no se verificó una generación real con Gemini ni persistencia en Supabase.
