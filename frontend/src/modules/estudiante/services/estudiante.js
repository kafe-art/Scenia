// Capa de datos del módulo del Estudiante para Scenia.
// Conecta la ruta cultural, actividades, detalle de obra, reflexiones y logros,
// sincronizándose automáticamente con el módulo del docente en localStorage.

const KEY_ESTUDIANTE = 'scenia.estudiante.v1'
const KEY_DOCENTE = 'scenia.docente.v2'

const copia = (x) => JSON.parse(JSON.stringify(x))
const delay = (valor) => Promise.resolve(valor)

export const OBRAS_ESTUDIANTE_BASE = [
  {
    id: 'el-bosque',
    titulo: 'El bosque de los sueños',
    subtitulo: 'Una aventura donde la imaginación también es un lugar seguro.',
    descripcion:
      'Una obra que nos invita a descubrir el valor de la amistad, la valentía y la importancia de cuidar nuestros sueños, incluso en los momentos más difíciles.',
    fecha: '12 de octubre de 2025',
    fechaCorta: '12 oct. 2025',
    hora: '10:00 a. m.',
    lugar: 'Teatro Municipal de Piura',
    estado: 'asignada', // 'asignada' | 'disponible' | 'completada'
    etiquetaBadge: 'Asignada',
    temas: ['Emociones', 'Amistad', 'Valentía', 'Naturaleza', 'Diversidad'],
    reserva: {
      confirmada: true,
      asiento: 'Fila 4 - Butaca 12',
      codigoReserva: 'TE-4587',
      qrSimulado: 'https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=SCENIA-TE-4587-MARIA',
    },
    recomendaciones: [
      'Llega 15 minutos antes de la función.',
      'Lleva tu entrada (digital o impresa).',
      'Usa ropa cómoda y lleva una botella de agua.',
      'Disfruta y mantén una actitud respetuosa durante la obra.',
    ],
    actividadPrevia: {
      pregunta1: '¿Qué emociones crees que vivirán los personajes?',
      pregunta2: '¿Qué mensaje crees que nos deja la obra?',
    },
    imagen: '/images/obras/el-bosque.jpg',
    colorArt: 'art-green',
  },
  {
    id: 'la-nina',
    titulo: 'La niña y el mar',
    subtitulo: 'El canto de las olas y la memoria de nuestros abuelos.',
    descripcion:
      'Una joven navegante de la costa norte aprende los secretos del océano y la fuerza del cuidado comunitario.',
    fecha: '20 de octubre de 2025',
    fechaCorta: '20 oct. 2025',
    hora: '11:00 a. m.',
    lugar: 'Auditorio UNP',
    estado: 'asignada',
    etiquetaBadge: 'Asignada',
    temas: ['Identidad', 'Ecología', 'Memoria cultural'],
    reserva: {
      confirmada: true,
      asiento: 'Fila 2 - Butaca 08',
      codigoReserva: 'TE-3910',
    },
    imagen: '/images/obras/la-nina.jpg',
    colorArt: 'art-blue',
  },
  {
    id: 'suenos-escena',
    titulo: 'Sueños en escena',
    subtitulo: 'La magia de dar el primer paso hacia el escenario.',
    descripcion:
      'Historias entrelazadas de adolescentes que vencen sus miedos para crear su propia compañía teatral.',
    fecha: '10 de noviembre de 2025',
    fechaCorta: '10 nov. 2025',
    hora: '03:00 p. m.',
    lugar: 'Alianza Francesa de Piura',
    estado: 'disponible',
    etiquetaBadge: 'Disponible',
    temas: ['Autoestima', 'Trabajo en equipo', 'Expresión'],
    imagen: '/images/obras/suenos.jpg',
    colorArt: 'art-amber',
  },
  {
    id: 'historias-que-unen',
    titulo: 'Historias que nos unen',
    subtitulo: 'El diálogo como puente entre diferentes generaciones.',
    descripcion:
      'Un encuentro entre jóvenes y adultos mayores que rescata relatos orales y tradiciones populares.',
    fecha: '22 de mayo de 2025',
    fechaCorta: '22 may. 2025',
    hora: '04:00 p. m.',
    lugar: 'Teatro Municipal de Piura',
    estado: 'disponible',
    etiquetaBadge: 'Disponible',
    temas: ['Empatía', 'Interculturalidad', 'Convivencia'],
    imagen: '/images/obras/historias.jpg',
    colorArt: 'art-rose',
  },
]

const ACTIVIDADES_BASE = {
  pendientes: [
    {
      id: 'act-1',
      tipo: 'guia',
      titulo: 'Guía de la obra: El bosque de los sueños',
      obraId: 'el-bosque',
      vence: '12 oct. 2025',
      ruta: '/estudiante/obras/el-bosque',
    },
    {
      id: 'act-2',
      tipo: 'reflexion',
      titulo: 'Reflexión final tras la función',
      obraId: 'el-bosque',
      vence: '20 oct. 2025',
      ruta: '/estudiante/obras/el-bosque/reflexion',
    },
  ],
  completadas: [
    {
      id: 'act-comp-1',
      titulo: 'Ver la obra: La niña y el mar',
      fecha: '15 sep. 2025',
    },
    {
      id: 'act-comp-2',
      titulo: 'Sueños en escena · Actividad de anticipación',
      fecha: '10 jul. 2025',
    },
  ],
  historialVisitadas: [
    {
      id: 'h-1',
      titulo: 'La niña y el mar',
      fecha: '15 sep. 2025',
      estado: 'Completada',
    },
    {
      id: 'h-2',
      titulo: 'Sueños en escena',
      fecha: '10 jul. 2025',
      estado: 'En curso',
    },
    {
      id: 'h-3',
      titulo: 'Historias que nos unen',
      fecha: '22 may. 2025',
      estado: 'Completada',
    },
  ],
}

const INSIGNIAS_BASE = [
  {
    id: 'ins-1',
    nombre: 'Explorador Cultural',
    descripcion: 'Asiste a tus primeras 2 funciones teatrales escolares.',
    icono: '🎖️',
    color: 'gold',
    desbloqueada: true,
  },
  {
    id: 'ins-2',
    nombre: 'Reflexivo',
    descripcion: 'Envía tu primera bitácora de audio con análisis crítico.',
    icono: '🟣',
    color: 'purple',
    desbloqueada: true,
  },
  {
    id: 'ins-3',
    nombre: 'Gran espectador',
    descripcion: 'Demuestra puntualidad y respeto por las normas de sala.',
    icono: '🎭',
    color: 'red',
    desbloqueada: true,
  },
  {
    id: 'ins-4',
    nombre: 'En camino',
    descripcion: 'Completa la ruta cultural de 5 obras para desbloquear.',
    icono: '🔒',
    color: 'gray',
    desbloqueada: false,
  },
]

let estadoEstudiante = null

function cargarEstado() {
  if (!estadoEstudiante) {
    try {
      const raw = window.localStorage.getItem(KEY_ESTUDIANTE)
      if (raw) estadoEstudiante = JSON.parse(raw)
    } catch {
      estadoEstudiante = null
    }
  }

  if (!estadoEstudiante) {
    estadoEstudiante = {
      perfil: {
        nombre: 'María',
        apellidos: 'María Paredes',
        aula: '3.º B Secundaria',
        colegio: 'I.E. Emblemática San Miguel de Piura',
        obrasCompletadas: 2,
        obrasTotales: 5,
        reflexionesCompletadas: 1,
        reflexionesTotales: 3,
      },
      obras: copia(OBRAS_ESTUDIANTE_BASE),
      actividades: copia(ACTIVIDADES_BASE),
      insignias: copia(INSIGNIAS_BASE),
      reflexiones: {
        'el-bosque': {
          estado: 'en_proceso',
          pasoActual: 1,
          loQueSenti: {
            texto: '',
            emocion: 'Sorprendido',
            audioUrl: null,
            tieneAudio: false,
          },
          loQueComprendi: {
            conflicto: '',
            resolucion: '',
          },
          loQueMeLlevo: {
            aprendizaje: '',
          },
        },
      },
    }
  }

  return estadoEstudiante
}

function persistirEstado() {
  try {
    window.localStorage.setItem(KEY_ESTUDIANTE, JSON.stringify(estadoEstudiante))
  } catch {
    /* fallback en memoria */
  }
}

// Sincronizar la reflexión de María directamente con la nómina del docente
function sincronizarConDocente(obraId, reflexionData) {
  try {
    const rawDocente = window.localStorage.getItem(KEY_DOCENTE)
    if (!rawDocente) return
    const docenteState = JSON.parse(rawDocente)

    // Buscar el aula de comunicación / 3.° B
    const clases = Object.values(docenteState.clases || {})
    if (clases.length > 0) {
      const aula = clases[0]
      // Buscar estudiante María Paredes o Camila Rojas
      const est = (aula.estudiantes || []).find(
        (e) =>
          e.nombre.toLowerCase().includes('maría') ||
          e.nombre.toLowerCase().includes('paredes') ||
          e.nombre.toLowerCase().includes('camila'),
      )

      if (est) {
        est.audios = est.audios || []
        // Añadir audio de reflexión
        est.audios.unshift({
          id: `aud-${Date.now()}`,
          titulo: `Reflexión: El bosque de los sueños (${reflexionData.loQueSenti?.emocion || 'Emoción'})`,
          fecha: 'Hace unos momentos',
          duracion: '01:30',
          transcripcion:
            reflexionData.loQueSenti?.texto ||
            'Sentí mucha emoción cuando los personajes decidieron unirse para defender sus sueños frente a la tormenta en el bosque...',
          calificacion: null,
          retroalimentacion: null,
          puntosClave: [reflexionData.loQueSenti?.emocion || 'Sorprendido', 'Empatía', 'Amistad'],
        })
        est.avance = Math.min(100, (est.avance || 50) + 15)
        window.localStorage.setItem(KEY_DOCENTE, JSON.stringify(docenteState))
      }
    }
  } catch {
    /* sincronización silenciosa */
  }
}

export async function obtenerDashboardEstudiante() {
  const e = cargarEstado()
  return delay(copia(e))
}

export async function obtenerDetalleObra(obraId) {
  const e = cargarEstado()
  const obra = e.obras.find((o) => o.id === obraId) || e.obras[0]
  return delay(copia(obra))
}

export async function obtenerReflexionObra(obraId) {
  const e = cargarEstado()
  const ref = e.reflexiones[obraId] || {
    estado: 'en_proceso',
    pasoActual: 1,
    loQueSenti: { texto: '', emocion: 'Inspirado', audioUrl: null, tieneAudio: false },
    loQueComprendi: { conflicto: '', resolucion: '' },
    loQueMeLlevo: { aprendizaje: '' },
  }
  return delay(copia(ref))
}

export async function guardarPasoReflexion(obraId, datosParciales) {
  const e = cargarEstado()
  e.reflexiones[obraId] = {
    ...e.reflexiones[obraId],
    ...datosParciales,
  }
  persistirEstado()
  return delay(copia(e.reflexiones[obraId]))
}

export async function enviarReflexionCompleta(obraId, reflexionFinal) {
  const e = cargarEstado()
  e.reflexiones[obraId] = {
    ...reflexionFinal,
    estado: 'completada',
    fechaEnvio: new Date().toISOString(),
  }

  // Actualizar métricas del perfil
  e.perfil.reflexionesCompletadas = Math.min(
    e.perfil.reflexionesTotales,
    e.perfil.reflexionesCompletadas + 1,
  )

  // Mover de pendientes a completadas en actividades
  e.actividades.pendientes = e.actividades.pendientes.filter((a) => a.obraId !== obraId)
  e.actividades.completadas.unshift({
    id: `comp-${Date.now()}`,
    titulo: `Reflexión enviada: ${obraId === 'el-bosque' ? 'El bosque de los sueños' : 'Obra teatral'}`,
    fecha: 'Hoy',
  })

  persistirEstado()

  // Sincronizar automáticamente con el panel del docente
  sincronizarConDocente(obraId, reflexionFinal)

  return delay(true)
}
