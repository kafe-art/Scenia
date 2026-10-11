# Especificación de diseño UI UX de Scenia

Fecha: 10 de octubre de 2026. Estado: propuesta para bocetos e implementación posterior.

Esta especificación adapta las tres capturas proporcionadas a la estructura real del proyecto. Define la portada pública, el inicio de sesión y el inicio docente. Conserva el flujo UGEL, la activación tras el OK institucional, Supabase como persistencia y las reflexiones personales en texto o audio. No se permiten videos de las obras teatrales.

## 1. Concepto visual y sistema de diseño

### Lectura de las referencias

- Portada: encabezado horizontal, titular grande a la izquierda, fotografía circular a la derecha, etiquetas superpuestas y banda de acceso entre el fondo oscuro y el claro.
- Acceso: composición dividida entre fotografía teatral oscurecida y formulario sobre marfil.
- Inicio docente: barra superior, cabecera de perfil oscura, tarjetas de clases con fotografías y resumen de actividad. La captura no muestra una barra lateral completa; la navegación lateral descrita aquí es una propuesta adicional.

La identidad propuesta combina la presencia del escenario con una interfaz educativa legible. Usar Scenia como nombre del producto y Club de Arte y Cultura como organización. Los logotipos definitivos deben venir de los recursos autorizados; no recrear el logotipo de las capturas como si fuera un archivo oficial.

### Paleta propuesta

Los valores son tokens propuestos a partir de las capturas, no una extracción exacta de sus píxeles.

| Token | Color | Uso |
|---|---|---|
| Fondo | #FFF8F2 | Portada inferior, acceso y área de trabajo |
| Superficie | #FFFFFF | Formularios, tarjetas y paneles |
| Petróleo | #142E34 | Cabeceras, navegación y texto principal |
| Petróleo profundo | #0D2026 | Superposiciones fotográficas y pie |
| Rojo escénico | #EF3340 | Acentos, etiquetas y elementos decorativos |
| Rojo de acción | #C92535 | Botones con texto blanco y errores |
| Texto secundario | #52636A | Descripciones y metadatos |
| Borde | #D9D5CF | Divisiones y límites de campos |
| Éxito | #246347 sobre #E8F3EC | Confirmaciones y estados completados |
| Pendiente | #805011 sobre #FFF0D7 | Tareas pendientes |
| Foco | #147D92 | Contorno de interacción con separación visible |

Comprobar contraste en la implementación, incluidos foco, estados y fotografías. Objetivos: 4,5:1 para texto normal y 3:1 para texto grande y componentes relevantes. No usar solo color para comunicar estado. El rojo decorativo de las capturas no debe trasladarse automáticamente a todo botón con texto pequeño blanco.

### Tipografía y medidas

Propuesta: una familia sans serif, Inter variable autoalojada si se incorpora, con respaldo system-ui. Una sola familia reduce descarga y mantiene coherencia. Pesos 400, 500, 600 y 700; titulares 700 con espaciado ligeramente cerrado.

| Elemento | Escritorio | Celular |
|---|---|---|
| Titular de portada | 64 px, interlineado 1,02 | 38 px, interlineado 1,08 |
| Título de página | 32 px | 28 px |
| Título de sección | 24 px | 22 px |
| Título de tarjeta | 20 px | 20 px |
| Texto general y campos | 16 px, interlineado 1,5 | 16 px, interlineado 1,5 |
| Metadatos | 14 px | 14 px |
| Etiqueta breve | 12 px, peso 600 | 12 px, peso 600 |

Contenedor máximo de 1200 px; márgenes laterales de 40 px en escritorio, 24 px en tableta y 16 px en celular. Espaciado de 4, 8, 12, 16, 24, 32, 48 y 64 px. Separación entre tarjetas de 24 px. Campos de 48 px de alto; controles táctiles de al menos 44 × 44 px. Radios de 16 px para tarjetas, 24 px para bloques destacados y completos para botones principales. Reservar sombras suaves para elevación, evitando sombras pesadas en cada bloque.

### Imágenes y superficies

Usar fotografías estáticas autorizadas, afiches e ilustraciones. La portada usa una máscara circular y el acceso una fotografía vertical con superposición petróleo del 65–75 %, ajustada según el contraste real. Las tarjetas usan recorte panorámico y degradado oscuro únicamente donde se superpone texto. No incluir videos ni reproductores de funciones.

Evitar texto incrustado en imágenes; el grado y nombre de la clase deben ser texto HTML legible. Decoración punteada opcional con opacidad baja y sin dificultar lectura. Desenfoque de fondo limitado al encabezado público, con fondo sólido de respaldo. No aplicarlo a formularios ni tablas.

### Movimiento y accesibilidad

- Botones: transición de color de 160 ms; desplazamiento de flecha de 3 px; presión con escala 0,98.
- Tarjetas: elevación de 2 px y cambio suave de borde en 180 ms. Imagen con escala máxima 1,025, sin desplazar el contenido.
- Entrada de secciones públicas: opacidad y desplazamiento vertical de 12 px en 320 ms, una sola vez.
- Cambio de vista: fundido de 160–200 ms, sin retrasar el formulario ni capturar el desplazamiento de página.
- Paneles y diálogos: 180 ms; foco al abrir, cierre con Escape y devolución del foco al control que los abrió.
- Con movimiento reducido: retirar desplazamientos, escalas, parallax y animaciones escalonadas. El contenido permanece disponible aunque falle la animación.
- Navegación por teclado, foco visible, etiquetas permanentes en campos y mensajes de estado anunciados a lectores de pantalla.
- Las acciones no dependen de hover. Ningún contenido esencial queda oculto hasta pasar el cursor.

### Aplicación de los referentes del encargo

Estos son criterios de inspiración, no una afirmación de haber inspeccionado sus animaciones en vivo ni una copia de sus interfaces.

| Referente | Aplicación propuesta a Scenia |
|---|---|
| Awwwards | Composición editorial de portada y revelado moderado de secciones |
| Stripe | Titular claro, jerarquía y una acción primaria por bloque |
| Airbnb | Tarjetas comparables, filtros y metadatos fáciles de explorar |
| Miro | Agrupación visual de actividades Pre/Durante/Post en el editor de guías futuro |
| Spotify | Contraste de cabeceras y controles persistentes para escuchar reflexiones personales |

No hace falta añadir un lienzo arrastrable, cursores especiales o transiciones complejas a estas tres pantallas. En un editor futuro, cualquier reordenación por arrastre necesita una alternativa con botones y teclado.

## 2. Vistas principales

### Vista 1 — Inicio público de Scenia

Ruta final propuesta: /. Actualmente esa ruta abre Docente; la portada debe introducirse conservando la vista docente en una ruta propia y sus funciones existentes.

#### Distribución de escritorio

1. Encabezado de 72 px: marca a la izquierda; Cartelera, Voces que Transforman, Impacto y Aliados en el centro; Iniciar sesión a la derecha. Cada enlace debe tener destino real en una ruta o sección. La búsqueda puede integrarse en Cartelera para evitar un icono sin función.
2. Hero de dos columnas: texto 48 %, imagen 52 %. Altura flexible, con espacio superior e inferior suficiente; evitar un alto fijo que recorte el titular.
3. Fotografía circular de hasta 480 px con borde rojo fino. Dos etiquetas estáticas: Experiencias presenciales y Guías editables para docentes.
4. Banda de acceso: bloque petróleo que conecta visualmente hero y sección marfil. Título «¿Tu colegio ya participa?», texto «Ingresa con las credenciales entregadas por tu institución» y botón «Iniciar sesión».
5. Cartelera destacada: hasta tres obras con afiche, temática, edad recomendada, duración, fecha, precio o gratuidad confirmada y cupos. Acción «Ver obra».
6. Cómo funciona: tres pasos, «Prepara la experiencia», «Vive el teatro», «Reflexiona y comparte». Explicar que las funciones son presenciales.
7. Voces que Transforman: síntesis del programa, seis sesiones y rol del docente especializado. Acción «Conocer el programa».
8. Impacto y aliados: indicadores agregados disponibles, periodo de referencia y logos autorizados. Si no hay datos, explicar el objetivo del programa sin inventar cifras.
9. Pie: organización, contacto oficial cuando esté disponible, privacidad y acceso.

#### Texto del bloque principal

- Antetítulo: TEATRO Y ESCUELA EN PIURA.
- Título: «El teatro abre conversaciones que sí transforman».
- Descripción: «Guías pedagógicas con IA, experiencias presenciales y una ruta cultural para cada estudiante».
- Acción primaria: «Explorar cartelera».
- Acción secundaria: «Cómo funciona».

La insignia «Gratis para colegios» solo debe aparecer si la función o el programa realmente lo confirma. Sustituir afirmaciones absolutas como «Datos de menores protegidos» por un enlace informativo «Conoce cómo cuidamos tus datos» hasta que exista respaldo verificable. «Alineado al CNEB» describe un kit validado, no una garantía automática sobre toda salida de IA.

#### Comportamientos y estados

Encabezado fijo con fondo sólido o translúcido legible al desplazarse. Entradas suaves del titular y la imagen. Secciones reveladas una sola vez. Las etiquetas permanecen estables para no distraer. Usar un hero único en la primera entrega; no copiar puntos de carrusel si no existen varias diapositivas. No añadir cambio de tema hasta diseñar sus colores y estados completos.

Cartelera: carga con placeholders de tamaño fijo, estado vacío «Pronto anunciaremos nuevas funciones» y error recuperable con Reintentar. Una cartelera con error no debe mostrar obras ficticias como reales.

#### Celular

Menú compacto, titular primero, botones y foto debajo. Imagen de 260–320 px según ancho disponible. Etiquetas dentro del contenedor para evitar desbordamiento. Banda de acceso en flujo normal. Tarjetas en una columna. Probar desde 360 px.

### Vista 2 — Iniciar sesión

Ruta propuesta: /ingresar.

#### Distribución de escritorio

Dos paneles de aproximadamente 52/48 %. Izquierda: fotografía teatral estática, marca y mensaje editorial. Derecha: fondo marfil y formulario de ancho máximo 420 px. Altura mínima de viewport con desplazamiento normal si el contenido supera la pantalla.

Panel editorial: «Una ruta cultural para aprender, sentir y transformar». Descripción: «Conectamos el teatro, la escuela y tu experiencia cultural».

#### Formulario

1. Enlace «Volver al inicio».
2. Antetítulo BIENVENIDO.
3. Título «Inicia sesión».
4. Ayuda «Usa las credenciales entregadas por tu institución».
5. Identificador. La captura propone DNI; los documentos anteriores usan correo institucional para el Director. Propuesta pendiente de contrato de autenticación: «Correo o DNI», con ayuda que indique cuál corresponde a la cuenta. No asumir que Supabase admite DNI como identificador nativo.
6. Contraseña con control Mostrar/Ocultar, etiqueta accesible y autocompletado apropiado.
7. Enlace «Recuperar acceso».
8. Botón «Entrar».
9. Ayuda «¿Es tu primer ingreso? Revisa la invitación o las indicaciones de tu institución».

No hay alta pública de colegios: el ingreso institucional parte de la recomendación UGEL, contacto y aprobación formal registrados por el Coordinador. El rol procede de la cuenta autenticada.

#### Estados y movimiento

Vacío, campos incompletos, enviando, credenciales no válidas, acceso pendiente de activación y servicio no disponible. Diferenciar el estado institucional solo cuando pueda hacerse sin revelar información de otras cuentas. Durante el envío bloquear dobles pulsaciones y conservar el identificador. El error se coloca junto al formulario, con texto específico y foco pertinente.

Entrada del formulario con fundido de 200 ms. Botón y foco con transiciones de 160 ms. Sin sacudidas al fallar ni animación continua de la fotografía.

Los accesos Docente/Estudiante/Director/Club que aparecen en la captura se reservan para un entorno de demostración explícito y datos ficticios. No son selectores de permisos ni se publican contraseñas comunes en el acceso real.

#### Celular

Reducir la fotografía a una cabecera breve o prescindir de ella visualmente; mantener marca y formulario prioritarios. Campos de 16 px, teclado que no oculte el botón y mensajes sin altura fija.

### Vista 3 — Inicio docente y mis clases

Ruta propuesta: /docente. Conservar Docente.jsx y la generación existente; componer el panel alrededor de esa funcionalidad y hacerla accesible desde «Nueva guía».

#### Navegación propuesta

Barra lateral de 224 px en escritorio: Inicio, Mis clases, Cartelera, Mis guías, Reflexiones y Voces que Transforman. En la parte inferior: ayuda y perfil. No renderizar una opción de notificaciones sin bandeja o contenido asociado. En celular: Inicio, Clases, Cartelera y Más, o menú lateral accesible.

Barra superior de 72 px con búsqueda de clases, obras y actividades dentro de los permisos del docente; resultados agrupados y estado vacío. Avatar con nombre, rol y cerrar sesión. El indicador de notificaciones aparece solo cuando haya elementos reales pendientes.

#### Orden del contenido

1. Cabecera petróleo con avatar o iniciales, nombre, materia, colegio y etiqueta de rol. Fecha del periodo real; no copiar la fecha fija del boceto. Acción «Explorar cartelera». El docente especializado tiene además su distintivo.
2. Sección «Mis clases», ayuda «Elige una clase para ver estudiantes, actividades y guías» y enlace «Ver todas».
3. Cuadrícula de tres tarjetas en escritorio ancho, dos en tableta y una en celular.
4. Indicadores compactos: Clases asignadas, Actividades próximas, Guías en borrador y Reflexiones por revisar. Cada indicador abre su lista correspondiente.
5. Bloque «Próximas experiencias» con función, clase, fecha y estado de reserva.
6. Bloque «Continúa preparando» con guías en borrador y acción Retomar.

#### Tarjeta de clase

- Fotografía estática opcional, sin texto incrustado y con alternativa ilustrada si no hay imagen autorizada.
- Título «3.º de secundaria · Sección B».
- Materia «Comunicación».
- Cantidad de estudiantes y turno.
- Insignia «2 guías» enlazada a la lista.
- Última guía y estado: borrador o publicada.
- Progreso con significado explícito: «17 de 25 entregas recibidas». Si se muestra porcentaje, derivarlo de esas cantidades y definir qué actividad o periodo representa.
- Acción «Abrir clase».

No repetir solamente «SECUNDARIA» en las tres tarjetas: grado, sección y materia deben poder distinguirse inmediatamente. El progreso de entregas no representa mejora emocional ni nivel cultural.

El botón «Nueva clase» del boceto queda pendiente de los permisos acordados. Los requisitos actuales describen cursos asignados; por defecto mostrar «Nueva guía», que sí pertenece al flujo docente. Si se autoriza crear clases, incorporar la acción con sus validaciones institucionales.

#### Generador de guías existente

Mantener la llamada a services/guias.js, el formulario y el renderizado de la respuesta actual. Adaptar visualmente sus campos y añadir posteriormente clase, grado, competencia y obra cuando el contrato de API los soporte. El nuevo diseño debe conservar los estados de carga y error de Loading.jsx y ErrorMessage.jsx.

La guía futura se organiza en Pre/Durante/Post, permanece editable y pasa a publicada al asignarse. No mostrar botones de guardar, asignar o exportar como operativos antes de disponer de sus implementaciones. Distinguir generación en memoria de persistencia confirmada en Supabase.

#### Estados y movimiento

Sin clases: «Todavía no tienes clases asignadas. Consulta con la Dirección de tu colegio». Sin pendientes: «No tienes reflexiones pendientes de revisión». Error: aviso local con Reintentar. Placeholders durante la consulta, sin sustituir datos reales por ejemplos silenciosamente.

Tarjetas con elevación de 2 px y zoom fotográfico leve. Paneles laterales con transición de 180 ms. Cambios de filtro con fundido discreto. Sin parallax en el área de trabajo y sin contadores que animen valores desde cero en cada visita.

## 3. Adaptación al proyecto existente

La revisión encontró React, Vite, React Router y Recharts en frontend/package.json. App.jsx conserva rutas para Docente, Estudiante y Director. Existen services/api.js, guias.js, reflexiones.js y metricas.js, componentes Loading/ErrorMessage y backend/app/services/supabase_service.py. Esto acredita estructura y código presentes, no conectividad ni despliegue probado.

### Ubicaciones existentes que se conservan

| Ubicación | Adaptación posterior |
|---|---|
| frontend/src/App.jsx | Añadir layouts y rutas, manteniendo acceso a las funciones actuales |
| frontend/src/pages/Docente.jsx | Incorporar cabecera, clases y acceso al generador existente |
| frontend/src/pages/Estudiante.jsx | Aplicar el mismo sistema visual manteniendo la reflexión actual |
| frontend/src/pages/Director.jsx | Aplicar el sistema visual y conservar gráficos y señal de datos demo |
| frontend/src/index.css | Incorporar variables de color, tipografía y reglas base |
| frontend/src/App.css | Adaptar reglas gradualmente, evitando reemplazo general que rompa vistas |
| frontend/src/services/ | Mantener integración HTTP y agregar servicios cuando existan contratos |
| backend/app/routes/ | Añadir futuros endpoints siguiendo el nombre real routes, no crear routers paralelo |
| backend/app/services/ | Conservar servicios Gemini y Supabase |
| database/migrations/ | Añadir migraciones Supabase/PostgreSQL según módulos |
| docs/ | Centralizar diseño, requisitos y contratos |

### Archivos o subcarpetas propuestos

```text
frontend/src/
  pages/
    Inicio.jsx                  nuevo
    IniciarSesion.jsx           nuevo
    Cartelera.jsx               nuevo, al implementar su módulo
    Docente.jsx                 existente, se adapta
    Estudiante.jsx              existente, se conserva
    Director.jsx                existente, se conserva
  components/
    layout/                     nuevo: HeaderPublico, Sidebar, AppShell
    ui/                         nuevo: Button, Input, Badge, Dialog, EmptyState
    docente/                    nuevo: PerfilDocente, TarjetaClase, ResumenDocente
    publico/                    nuevo: HeroTeatral, ObraCard, ComoFunciona
    Loading.jsx                 existente
    ErrorMessage.jsx            existente
  styles/
    tokens.css                  nuevo, importado desde index.css
  assets/
    images/                     nuevo: fotografías autorizadas y optimizadas
    fonts/                      opcional: familia autoalojada
  services/                     existente
```

Estos nombres son un mapa de implementación, no archivos de aplicación creados en esta entrega. No mover ni borrar los archivos existentes para encajar esta propuesta.

### Navegación final propuesta

| Ruta | Destino |
|---|---|
| / | Inicio público |
| /ingresar | Acceso |
| /cartelera | Catálogo de obras |
| /docente | Inicio docente |
| /docente/guias/nueva | Generador conservado y adaptado |
| /estudiante | Vista estudiante existente |
| /director | Vista Director existente |

La introducción de la portada cambia el destino actual de /. Actualizar todos los enlaces docentes al nuevo destino al implementarla. Las protecciones de rutas y la autorización del servidor dependen del módulo real de autenticación; ocultar enlaces no concede ni deniega acceso por sí solo.

## 4. Herramientas de frontend

Mantener React + Vite, React Router y Recharts ya declarados. Usar CSS existente, variables y Grid/Flex para la primera adaptación. No se necesita incorporar Tailwind ni otro framework para reproducir las capturas.

Para estados simples, usar transiciones CSS. Motion for React es una incorporación opcional para transiciones de paneles y presencia de componentes; su documentación describe animaciones de layout, entrada y salida, gestos y soporte de movimiento reducido. Lucide React es una opción para iconos SVG consistentes importados individualmente. No se han instalado dependencias en esta entrega.

No añadir simultáneamente Motion y GSAP para estas tres vistas. Un motor adicional no aporta una necesidad demostrada aquí. Cargar imágenes adaptadas al ancho, reservar sus proporciones para evitar saltos y cargar las inferiores de forma diferida. Mantener como referencia el presupuesto de tamaño de frontend indicado en los requisitos, que debe medirse al implementar.

## 5. Bocetos y comprobaciones de entrega

Preparar seis marcos principales: Inicio, Iniciar sesión e Inicio docente a 1440 px y 390 px. Revisar además comportamiento a 360 px y tableta. Para cada pantalla añadir variaciones de carga, vacío y error donde correspondan.

- Todas las acciones tienen destino y etiqueta claros.
- Texto legible sin recortes al ampliar; navegación completa con teclado.
- Menús y modales gestionan foco y cierre.
- No hay navegación horizontal involuntaria en celular.
- El rol no se selecciona para obtener acceso real.
- La activación institucional depende del OK formal del Director.
- Los porcentajes de clase explican numerador y denominador.
- No hay cifras, gratuidad, niveles ni beneficios inventados presentados como confirmados.
- Supabase se mantiene como persistencia. El README y arquitectura actuales mencionan SQLite; esa referencia necesita alinearse en una tarea documental posterior y no cambia la decisión del usuario.
- No se publican videos de obras y la ruta del estudiante utiliza texto o audio personal.

## 6. Fuentes y límites de la revisión

Referencias visuales principales: las tres capturas del usuario. Referencia funcional: conversación, documentos revisados y ficha del Reto 19. Referencia estructural: archivos actuales del repositorio.

Se consultaron las páginas de [Stripe](https://stripe.com/es-us), [Airbnb](https://www.airbnb.com.pe/) y [Miro](https://miro.com/es/). La consulta textual de [Spotify](https://open.spotify.com/intl-es/) no devolvió contenido inspeccionable y [Awwwards](https://www.awwwards.com/) agotó el tiempo de consulta. Sus aportes en la tabla de inspiración son propuestas del encargo; no se atribuyen efectos actuales observados a esas páginas.

Documentación técnica consultada: [Motion for React](https://motion.dev/docs/react) y [Lucide React](https://lucide.dev/guide/react).
