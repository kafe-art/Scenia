// Repositorio unificado y persistente para el Estudiante y el Colegio en Scenia.
// Conecta en tiempo real con las clases, actividades, experiencias y entregas del módulo docente.

const KEY_DOCENTE = 'scenia.docente.v2'
const KEY_ESTUDIANTE = 'scenia.estudiante.v2'
const KEY_COLEGIO = 'scenia.colegio.v2'

const copia = (x) => JSON.parse(JSON.stringify(x))

// Estudiante activo por defecto para la demostración
export const ESTUDIANTE_ACTIVO = {
  id: 'andrea.castro',
  nombre: 'Andrea Castro',
  username: 'andrea.castro',
  codigo: 'SMP-3B-01',
  grado: '3.º',
  seccion: 'B',
  nivel: 'Secundaria',
  colegio: 'I.E. Emblemática San Miguel de Piura',
  cursoPrincipal: 'Comunicación',
  claseId: 'comunicacion',
  docente: 'Carla Mendoza',
  consentimiento: 'otorgado',
}

// Obra asignada del curso (Otras voces, un mismo patio)
export const EXPERIENCIA_CURSO_BASE = {
  id: 'otras-voces',
  titulo: 'Otras voces, un mismo patio',
  curso: 'Comunicación · 3.º B',
  docente: 'Carla Mendoza',
  metodologia: 'Metodología Voces que Transforman',
  fechaTexto: 'Sábado 22 de junio · 4:30 p. m.',
  fechaIso: '2026-06-22T16:30:00',
  lugar: 'Teatro Municipal de Piura',
  sinopsis:
    'Cuatro estudiantes descubren que escuchar sus historias transforma la forma en que comparten un mismo espacio.',
  estadoReserva: 'Reserva escolar confirmada',
  asistenciaRegistrada: false,
  asiento: 'Fila 3 · Butaca 14',
  codigoEntrada: 'SCENIA-ENTRADA-AC-3B-2026',
  imagen:
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
  etapas: {
    preparacion: {
      titulo: 'Escucho y creo',
      guiaTitulo: 'Convivencia y escucha activa',
      taller: 'Taller introductorio: acuerdos para escuchar',
      herramienta: 'Herramienta teatral: coro de voces',
      actividadId: 'mi-voz-en-el-grupo',
      completada: false,
    },
    funcion: {
      titulo: 'Observo y participo',
      orientaciones: 'Observa cómo cambian las relaciones cuando los personajes se escuchan.',
      asistenciaVerificada: false,
    },
    reflexion: {
      titulo: 'Reflexiono y transformo',
      orientaciones:
        'Comparte qué comprendiste, qué te sorprendió y cómo se conecta con el trabajo en clase.',
      completada: false,
    },
  },
}

// Actividad principal por tema (Mi voz en el grupo)
export const ACTIVIDAD_CURSO_BASE = {
  id: 'mi-voz-en-el-grupo',
  titulo: 'Mi voz en el grupo',
  tema: 'Convivencia escolar',
  curso: 'Comunicación · 3.º de secundaria, sección B',
  guiaTitulo: 'Convivencia y escucha activa',
  versionPublicada: 1,
  fechaLimiteTexto: '18 de junio, 11:59 p. m.',
  fechaLimiteIso: '2026-06-18T23:59:00',
  instrucciones:
    'Cuenta una situación en la que escuchar a otra persona ayudó a mejorar la convivencia. Explica qué hiciste, qué aprendiste y qué harías diferente la próxima vez.',
  formatosPermitidos: ['Texto', 'Audio', 'Video'],
  obraRelacionada: 'Ninguna · actividad por tema',
  criterios: [
    'Claridad de la experiencia',
    'Relación con la convivencia',
    'Reflexión personal',
  ],
  preguntasOrientacion: [
    '¿Qué entendiste?',
    '¿Qué te gustó y por qué?',
    '¿Cómo se relaciona con lo trabajado en clase?',
  ],
}

// Catálogo de Cartelera para el estudiante
export const CARTELERA_ESTUDIANTE = [
  {
    id: 'otras-voces',
    titulo: 'Otras voces, un mismo patio',
    descripcion: 'Una obra sobre escucha, acuerdos y las voces que construyen comunidad.',
    tematica: 'Convivencia',
    edadSugerida: '12+',
    duracionTexto: '65 min',
    proximaFuncion: {
      fechaTexto: '22 jun · 4:30 p. m.',
      lugar: 'Teatro Municipal de Piura',
      precioTexto: 'S/ 18',
      precioNumero: 18,
      cupos: 24,
    },
    imagen:
      'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'el-hilo-memoria',
    titulo: 'El hilo de la memoria',
    descripcion: 'Un viaje escénico entre relatos familiares, objetos y recuerdos de ciudad.',
    tematica: 'Identidad',
    edadSugerida: '10+',
    duracionTexto: '55 min',
    proximaFuncion: {
      fechaTexto: '29 jun · 6:00 p. m.',
      lugar: 'Centro Cultural Norte',
      precioTexto: 'Ingreso libre',
      precioNumero: 0,
      cupos: 42,
    },
    imagen:
      'https://images.unsplash.com/photo-1460723237483-7a6dc9d0b212?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'el-rio-canta',
    titulo: 'El río que canta',
    descripcion: 'Una creación teatral sobre el cuidado del agua y la memoria comunitaria.',
    tematica: 'Ambiente',
    edadSugerida: '10+',
    duracionTexto: '50 min',
    proximaFuncion: {
      fechaTexto: '06 jul · 10:30 a. m.',
      lugar: 'Auditorio Casa de la Cultura',
      precioTexto: 'S/ 10',
      precioNumero: 10,
      cupos: 35,
    },
    imagen:
      'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80',
  },
]

// Estado inicial en localStorage
function cargarEstadoEstudiante() {
  try {
    const raw = window.localStorage.getItem(KEY_ESTUDIANTE)
    if (raw) return JSON.parse(raw)
  } catch {
    /* fallback */
  }

  const inicial = {
    estudiante: ESTUDIANTE_ACTIVO,
    entregas: {
      'mi-voz-en-el-grupo': {
        actividadId: 'mi-voz-en-el-grupo',
        estado: 'borrador', // 'pendiente' | 'borrador' | 'entregada'
        formato: 'texto', // 'texto' | 'audio' | 'video'
        texto: 'jjj',
        archivoNombre: null,
        fechaActualizacion: '18 de junio, 11:59 p. m.',
        version: 1,
        historial: [],
        revisionDocente: 'pendiente', // 'pendiente' | 'revisada' | 'cambios_solicitados'
        calificacion: null,
        retroalimentacion: null,
        analisisIA: {
          disponible: false,
          mensaje:
            'Análisis no disponible: falta configurar un proveedor de transcripción e IA en backend. Tu entrega permanece enviada y segura.',
        },
      },
    },
    obrasInteres: ['otras-voces'],
    propuestasDocente: [],
    visitasPersonales: [],
    asistenciasVerificadas: [],
  }

  persistirEstadoEstudiante(inicial)
  return inicial
}

function persistirEstadoEstudiante(data) {
  try {
    window.localStorage.setItem(KEY_ESTUDIANTE, JSON.stringify(data))
  } catch {
    /* fallback */
  }
}

// Sincronizar hacia el almacenamiento del docente (scenia.docente.v2)
function sincronizarConDocente(entrega) {
  try {
    const rawDocente = window.localStorage.getItem(KEY_DOCENTE)
    if (!rawDocente) return
    const docenteData = JSON.parse(rawDocente)

    // Sincronizar en la clase 'comunicacion'
    const claseId = 'comunicacion'
    if (docenteData.clases && docenteData.clases[claseId]) {
      const clase = docenteData.clases[claseId]
      clase.entregas = clase.entregas || {}
      clase.entregas[entrega.actividadId] = clase.entregas[entrega.actividadId] || {}
      clase.entregas[entrega.actividadId]['andrea.castro'] = {
        id: 'ent-andrea',
        nombreEstudiante: 'Andrea Castro',
        username: 'andrea.castro',
        estado: entrega.estado === 'entregada' ? 'entregada' : 'borrador',
        formato: entrega.formato,
        texto: entrega.texto,
        archivoNombre: entrega.archivoNombre,
        fecha: entrega.fechaActualizacion,
        calificacion: entrega.calificacion,
        retroalimentacion: entrega.retroalimentacion,
        revisionDocente: entrega.revisionDocente,
      }

      window.localStorage.setItem(KEY_DOCENTE, JSON.stringify(docenteData))
    }
  } catch {
    /* fallback */
  }
}

// ==========================================
// MÉTODOS PÚBLICOS DEL ESTUDIANTE
// ==========================================

export async function obtenerDashboardEstudiante() {
  const estado = cargarEstadoEstudiante()
  const entrega = estado.entregas['mi-voz-en-el-grupo'] || null

  // Calcular avance de la experiencia (0% a 100%)
  const etapa1Hecha = entrega?.estado === 'entregada'
  const etapa2Hecha = estado.asistenciasVerificadas.includes('otras-voces')
  const etapa3Hecha = etapa1Hecha && etapa2Hecha && entrega?.revisionDocente === 'revisada'

  let etapasContadas = 0
  if (etapa1Hecha) etapasContadas += 1
  if (etapa2Hecha) etapasContadas += 1
  if (etapa3Hecha) etapasContadas += 1

  const porcentajeAvance = Math.round((etapasContadas / 3) * 100)

  return {
    estudiante: estado.estudiante,
    siguienteActividad: {
      titulo: 'Comparte tu voz en el grupo',
      subtitulo: 'Actividad de Comunicación · vence el 18 de junio.',
      actividadId: 'mi-voz-en-el-grupo',
      estado: entrega?.estado || 'pendiente',
    },
    actividadesCursos: [
      {
        id: ACTIVIDAD_CURSO_BASE.id,
        titulo: ACTIVIDAD_CURSO_BASE.titulo,
        cursoSeccion: 'Comunicación · 3.º B',
        tema: ACTIVIDAD_CURSO_BASE.tema,
        fechaLimite: 'Vence el 18 de junio, 11:59 p. m.',
        estado: entrega?.estado || 'pendiente', // 'pendiente' | 'borrador' | 'entregada'
      },
    ],
    experiencia: {
      ...EXPERIENCIA_CURSO_BASE,
      asistenciaRegistrada: etapa2Hecha,
    },
    avance: {
      porcentaje: porcentajeAvance,
      etapasVerificadas: etapasContadas,
      totalEtapas: 3,
    },
    entregaPrincipal: entrega,
  }
}

export async function obtenerActividadPorId(actividadId = 'mi-voz-en-el-grupo') {
  const estado = cargarEstadoEstudiante()
  const entrega = estado.entregas[actividadId] || {
    actividadId,
    estado: 'pendiente',
    formato: 'texto',
    texto: '',
    archivoNombre: null,
    fechaActualizacion: null,
    version: 1,
    historial: [],
    revisionDocente: 'pendiente',
    calificacion: null,
    retroalimentacion: null,
    analisisIA: { disponible: false, mensaje: 'Análisis no disponible.' },
  }

  return {
    actividad: ACTIVIDAD_CURSO_BASE,
    entrega,
  }
}

export async function guardarBorradorActividad({
  actividadId = 'mi-voz-en-el-grupo',
  formato = 'texto',
  texto = '',
  archivoNombre = null,
}) {
  const estado = cargarEstadoEstudiante()
  const previa = estado.entregas[actividadId] || {}

  const nuevaEntrega = {
    ...previa,
    actividadId,
    estado: 'borrador',
    formato,
    texto,
    archivoNombre,
    fechaActualizacion: '18 de junio, 11:59 p. m.',
  }

  estado.entregas[actividadId] = nuevaEntrega
  persistirEstadoEstudiante(estado)
  sincronizarConDocente(nuevaEntrega)
  return nuevaEntrega
}

export async function enviarRespuestaActividad({
  actividadId = 'mi-voz-en-el-grupo',
  formato = 'texto',
  texto = '',
  archivoNombre = null,
}) {
  const estado = cargarEstadoEstudiante()
  const previa = estado.entregas[actividadId] || {}
  const versionActual = (previa.version || 1) + (previa.estado === 'entregada' ? 1 : 0)

  const historial = previa.historial || []
  if (previa.estado === 'entregada' && previa.texto) {
    historial.push({
      version: previa.version || 1,
      fecha: previa.fechaActualizacion,
      texto: previa.texto,
      formato: previa.formato,
      archivoNombre: previa.archivoNombre,
      revisionDocente: previa.revisionDocente,
    })
  }

  // Generar o conectar análisis pedagógico de IA estructurado
  const analisisIA = {
    disponible: false,
    mensaje:
      'Análisis no disponible: falta configurar un proveedor de transcripción e IA en backend. Tu entrega permanece enviada y segura.',
    resumen:
      texto && texto.length > 15
        ? `La estudiante reflexiona sobre la importancia de hacer pausas activas para escuchar antes de reaccionar en el salón.`
        : null,
    competenciaRelacionada: 'Se comunica oralmente en su lengua materna (CNEB)',
  }

  const nuevaEntrega = {
    actividadId,
    estado: 'entregada',
    formato,
    texto,
    archivoNombre,
    fechaActualizacion: new Date().toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    }),
    version: versionActual,
    historial,
    revisionDocente: 'pendiente',
    calificacion: null,
    retroalimentacion: null,
    analisisIA,
  }

  estado.entregas[actividadId] = nuevaEntrega
  persistirEstadoEstudiante(estado)
  sincronizarConDocente(nuevaEntrega)
  return nuevaEntrega
}

export async function obtenerReflexionesEstudiante() {
  const estado = cargarEstadoEstudiante()
  const entrega = estado.entregas['mi-voz-en-el-grupo']

  const lista = []
  if (entrega) {
    lista.push({
      id: 'mi-voz-en-el-grupo',
      titulo: 'Mi voz en el grupo',
      curso: 'Comunicación · Convivencia escolar',
      fechaLimite: '18 de junio, 11:59 p. m.',
      estado: entrega.estado, // 'borrador' | 'entregada'
      revisionDocente: entrega.revisionDocente,
      formato: entrega.formato,
      texto: entrega.texto,
      calificacion: entrega.calificacion,
      retroalimentacion: entrega.retroalimentacion,
    })
  }

  return lista
}

export async function obtenerLogrosEHistorial() {
  const estado = cargarEstadoEstudiante()
  const entrega = estado.entregas['mi-voz-en-el-grupo']

  const tieneAsistencia = estado.asistenciasVerificadas.length > 0
  const tieneReflexionEnviada = entrega?.estado === 'entregada'
  const tieneTresObras = estado.asistenciasVerificadas.length >= 3
  const tieneExperienciaCompleta =
    tieneAsistencia && tieneReflexionEnviada && entrega?.revisionDocente === 'revisada'

  const insignias = [
    {
      id: 'primera-funcion',
      nombre: 'Primera función',
      descripcion: 'Registra tu primera asistencia.',
      desbloqueada: tieneAsistencia,
      fechaObtencion: tieneAsistencia ? '22 de junio de 2026' : null,
      progresoTexto: tieneAsistencia ? 'Completado' : '0% de avance',
      icono: 'ticket',
    },
    {
      id: 'mi-voz-cuenta',
      nombre: 'Mi voz cuenta',
      descripcion: 'Envía tu primera reflexión en cualquier formato.',
      desbloqueada: tieneReflexionEnviada,
      fechaObtencion: tieneReflexionEnviada ? '18 de junio de 2026' : null,
      progresoTexto: tieneReflexionEnviada ? 'Completado' : '0% de avance',
      icono: 'spark',
    },
    {
      id: 'explorador-cultural',
      nombre: 'Explorador cultural',
      descripcion: 'Asiste a tres obras distintas.',
      desbloqueada: tieneTresObras,
      fechaObtencion: null,
      progresoTexto: `${estado.asistenciasVerificadas.length}/3 obras`,
      icono: 'award',
    },
    {
      id: 'experiencia-completa',
      nombre: 'Experiencia completa',
      descripcion: 'Completa preparación, asistencia y reflexión.',
      desbloqueada: tieneExperienciaCompleta,
      fechaObtencion: null,
      progresoTexto: tieneExperienciaCompleta ? 'Completado' : '0% de avance',
      icono: 'ribbon',
    },
  ]

  const historial = []

  if (tieneAsistencia || tieneReflexionEnviada) {
    historial.push({
      id: 'hist-1',
      obra: 'Otras voces, un mismo patio',
      fecha: '22 de junio de 2026',
      tipo: 'Experiencia escolar · Comunicación 3.º B',
      asistenciaVerificada: tieneAsistencia,
      formatoReflexion: entrega?.formato || 'Texto',
      reflexionEstado: entrega?.estado || 'Pendiente',
      devolucion: entrega?.retroalimentacion || 'Pendiente de revisión por Carla Mendoza',
      calificacion: entrega?.calificacion || null,
    })
  }

  // Visitas personales declaradas
  (estado.visitasPersonales || []).forEach((vp, idx) => {
    historial.push({
      id: `vp-${idx}`,
      obra: vp.obraTitulo,
      fecha: vp.fecha,
      tipo: 'Visita personal declarada (en proceso de validación)',
      asistenciaVerificada: false,
      formatoReflexion: 'Texto',
      reflexionEstado: 'Declarada por el estudiante',
      devolucion: 'Registrada para historial personal',
      calificacion: null,
    })
  })

  return { insignias, historial }
}

export async function toggleMeInteresaObra(obraId) {
  const estado = cargarEstadoEstudiante()
  const index = estado.obrasInteres.indexOf(obraId)
  if (index >= 0) {
    estado.obrasInteres.splice(index, 1)
  } else {
    estado.obrasInteres.push(obraId)
  }
  persistirEstadoEstudiante(estado)
  return estado.obrasInteres.includes(obraId)
}

export async function proponerObraADocente({ obraId, mensaje = '' }) {
  const estado = cargarEstadoEstudiante()
  const obra = CARTELERA_ESTUDIANTE.find((o) => o.id === obraId)
  const prop = {
    id: `prop-${Date.now()}`,
    obraId,
    obraTitulo: obra?.titulo || 'Obra sugerida',
    estudianteNombre: estado.estudiante.nombre,
    fecha: new Date().toLocaleDateString('es-PE'),
    mensaje: mensaje || 'Me gustaría que veamos esta obra con el curso de Comunicación.',
  }
  estado.propuestasDocente.push(prop)
  persistirEstadoEstudiante(estado)

  // Publicar también en el muro del aula para visibilidad docente
  try {
    const rawDocente = window.localStorage.getItem(KEY_DOCENTE)
    if (rawDocente) {
      const d = JSON.parse(rawDocente)
      const clase = d.clases?.['comunicacion']
      if (clase) {
        clase.posts = clase.posts || []
        clase.posts.unshift({
          id: `post-sug-${Date.now()}`,
          autor: estado.estudiante.nombre,
          avatar: 'AC',
          rol: 'Estudiante',
          fecha: 'Hoy mismo',
          tipo: 'sugerencia',
          titulo: `Sugerencia de obra: ${prop.obraTitulo}`,
          contenido: `Hola profesora Carla, me pareció muy interesante esta obra de la cartelera para trabajarla en clase.`,
          likes: 1,
          comentarios: [],
        })
        window.localStorage.setItem(KEY_DOCENTE, JSON.stringify(d))
      }
    }
  } catch {
    /* fallback */
  }

  return prop
}

export async function registrarVisitaPersonal({ obraTitulo, fecha, lugar, reflexion }) {
  const estado = cargarEstadoEstudiante()
  const visita = {
    id: `vp-${Date.now()}`,
    obraTitulo,
    fecha: fecha || new Date().toISOString().slice(0, 10),
    lugar: lugar || 'Visita independiente',
    reflexion,
  }
  estado.visitasPersonales.push(visita)
  persistirEstadoEstudiante(estado)
  return visita
}

// ==========================================
// MÉTODOS DEL PANEL DEL COLEGIO
// ==========================================

export async function obtenerIndicadoresColegio() {
  const estado = cargarEstadoEstudiante()
  const rawDocente = window.localStorage.getItem(KEY_DOCENTE)
  let docenteData = null
  try {
    if (rawDocente) docenteData = JSON.parse(rawDocente)
  } catch {
    /* fallback */
  }

  const entrega = estado.entregas['mi-voz-en-el-grupo']
  const tieneAsistencia = estado.asistenciasVerificadas.length > 0
  const tieneReflexion = entrega?.estado === 'entregada'
  const tieneRevision = Boolean(entrega?.calificacion || entrega?.retroalimentacion)

  // Métricas reales calculadas
  const estudiantesParticipantes = tieneAsistencia ? 1 : 0
  const experienciasRealizadas = tieneAsistencia ? 1 : 0
  const asistenciasTotales = tieneAsistencia ? 1 : 0
  const reflexionesTotales = tieneReflexion ? 1 : 0
  const aprendizajesTrabajados = 1 // Tema: Convivencia escolar
  const aprendizajesExpresados = tieneRevision ? 1 : 0

  // Cálculo de puntaje institucional (0 a 100)
  let puntos = 0
  if (asistenciasTotales > 0) puntos += 30
  if (reflexionesTotales > 0) puntos += 30
  if (aprendizajesExpresados > 0) puntos += 25
  if (docenteData?.clases?.['comunicacion']?.reservas?.length > 0) puntos += 15

  let nivel = 'Colegio Espectador'
  if (puntos >= 80) nivel = 'Colegio Cultural'
  else if (puntos >= 45) nivel = 'Colegio Participante'

  return {
    colegioNombre: 'I.E. Emblemática San Miguel de Piura',
    nivelInstitucional: nivel,
    puntos,
    puntosMeta: 80,
    reglasNota:
      'Reglas de demostración provisionales: 45 puntos para Participante y 80 para Cultural. No son criterios oficiales del reto.',
    kpis: {
      estudiantesParticipantes,
      experienciasRealizadas,
      asistenciasTotales,
      reflexionesTotales,
      aprendizajesTrabajados,
      aprendizajesExpresados,
    },
    requisitos: {
      participacionVerificada: tieneAsistencia,
      vozEstudiantil: tieneReflexion,
      acompanamientoDocente: tieneRevision,
    },
  }
}
