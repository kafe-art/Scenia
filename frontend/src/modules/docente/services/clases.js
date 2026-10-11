// Capa de datos del docente para Scenia.
// Maneja persistencia en localStorage con estructura enriquecida para:
// - Aulas y creación de nuevas clases.
// - Códigos institucionales y consentimiento parental (Ley N.° 29733).
// - Muro social del aula (Google Classroom / Feed).
// - Stepper de unidades curriculares CNEB y generador/editor de guías pedagógicas.
// - Audios de reflexión de estudiantes con transcripción y evaluación.
// - Salidas y reservas escolares con aforo en tiempo real.
// - Programa "Voces que Transforman" con regla estricta de 1 docente por escuela.

import { classes as clasesDemoIniciales } from '../../../data/demo'
import { plantillasDeSesion, DIMENSIONES_WLEIS } from '../data/programa'

const KEY = 'scenia.docente.v2'
let estado = null

const copia = (x) => JSON.parse(JSON.stringify(x))
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`
const ahora = () => new Date().toISOString()

// Datos iniciales de estudiantes con códigos generados y audios de reflexión
const ESTUDIANTES_BASE = [
  {
    nombre: 'Camila Rojas',
    username: 'camila.rojas',
    consentimiento: 'otorgado',
    avance: 88,
    audios: [
      {
        id: 'aud-1',
        titulo: 'Reflexión: ¿Cómo cambia el silencio a nuestro salón?',
        fecha: 'Hace 2 días',
        duracion: '01:42',
        transcripcion:
          'Cuando vi la escena en la que el protagonista decide contar lo que sentía y nadie se burló, entendí que el miedo a equivocarse es algo que todos compartimos. En mi grupo muchas veces nos callamos por pena, pero escuchar con respeto crea confianza.',
        calificacion: 'AD',
        retroalimentacion: 'Excelente nivel de introspección y conexión directa con el valor de la empatía.',
        puntosClave: ['Empatía en escena', 'Superación del temor social', 'Convivencia escolar'],
      },
    ],
  },
  {
    nombre: 'Diego Santos',
    username: 'diego.santos',
    consentimiento: 'otorgado',
    avance: 75,
    audios: [
      {
        id: 'aud-2',
        titulo: 'Mi perspectiva sobre el personaje de Mateo',
        fecha: 'Hace 4 días',
        duracion: '02:10',
        transcripcion:
          'El conflicto de Mateo me recordó a cuando cambié de colegio. Al principio crees que debes actuar como los demás para ser aceptado, pero al final la autenticidad es lo que vale.',
        calificacion: 'A',
        retroalimentacion: 'Muy buen análisis del conflicto dramático.',
        puntosClave: ['Identidad propia', 'Presión social'],
      },
    ],
  },
  {
    nombre: 'María Paredes',
    username: 'maria.paredes',
    consentimiento: 'otorgado',
    avance: 40,
    audios: [
      {
        id: 'aud-4',
        titulo: 'Reflexión: El bosque de los sueños (Sorprendido)',
        fecha: 'Ayer',
        duracion: '01:30',
        transcripcion:
          'Me llamó mucho la atención la escena en el árbol sagrado, sentí mucha emoción cuando los personajes decidieron unirse para defender sus sueños...',
        calificacion: null,
        retroalimentacion: null,
        puntosClave: ['Sorprendido', 'Empatía', 'Amistad'],
      },
    ],
  },
  {
    nombre: 'Lucía Paredes',
    username: 'lucia.paredes',
    consentimiento: 'otorgado',
    avance: 92,
    audios: [
      {
        id: 'aud-3',
        titulo: 'El valor de la diversidad en nuestras historias',
        fecha: 'Hace 1 semana',
        duracion: '01:25',
        transcripcion:
          'Cada personaje tenía una forma distinta de resolver los problemas. Me gustó mucho el juego de luces y cómo representaba la soledad en el patio.',
        calificacion: 'AD',
        retroalimentacion: 'Gran observación sobre el lenguaje escénico y estético.',
        puntosClave: ['Apreciación artística', 'Lenguaje visual'],
      },
    ],
  },
  {
    nombre: 'Mateo Vílchez',
    username: 'mateo.vilchez',
    consentimiento: 'otorgado',
    avance: 65,
    audios: [],
  },
  {
    nombre: 'Valeria Ñiquen',
    username: 'valeria.niquen',
    consentimiento: 'pendiente',
    avance: 40,
    audios: [],
  },
  {
    nombre: 'Joaquín Atoche',
    username: 'joaquin.atoche',
    consentimiento: 'revocado',
    avance: 0,
    audios: [],
  },
]

// Temario estándar CNEB para las clases
const UNIDADES_CNEB_DEMO = [
  {
    id: 'u-1',
    numero: 1,
    titulo: 'Unidad 1: Escucha Activa y Convivencia en la Escena',
    competencia: 'Se comunica oralmente en su lengua materna',
    capacidad: 'Adecúa, organiza y desarrolla las ideas de forma coherente y cohesionada',
    estado: 'completada', // 'completada' | 'en_progreso' | 'bloqueada'
    obraRecomendada: 'Otras voces, un mismo patio',
    guiaId: 'guia-demo-1',
    descripcion: 'Exploramos el conflicto interpersonal a través de juegos de improvisación y dramatización.',
  },
  {
    id: 'u-2',
    numero: 2,
    titulo: 'Unidad 2: Identidad, Emociones y Máscaras Sociales',
    competencia: 'Construye su identidad',
    capacidad: 'Autorregula sus emociones y reflexiona sobre sus decisiones éticas',
    estado: 'en_progreso',
    obraRecomendada: '¿Y si soy yo?',
    guiaId: null,
    descripcion: 'Análisis de la presión de grupo y el descubrimiento de la propia voz frente al público.',
  },
  {
    id: 'u-3',
    numero: 3,
    titulo: 'Unidad 3: Dramaturgia Comunitaria y Medio Ambiente',
    competencia: 'Convive y participa democráticamente en la búsqueda del bien común',
    capacidad: 'Delibera sobre asuntos públicos y propone acciones concertadas',
    estado: 'bloqueada',
    obraRecomendada: 'Pequeñas semillas',
    guiaId: null,
    descripcion: 'Creación de relatos teatrales colectivos basados en problemáticas del entorno escolar.',
  },
  {
    id: 'u-4',
    numero: 4,
    titulo: 'Unidad 4: Apreciación Crítica y Bitácora Escénica',
    competencia: 'Aprecia de manera crítica manifestaciones artístico-culturales',
    capacidad: 'Contextualiza las manifestaciones artísticas y reflexiona creativa y críticamente',
    estado: 'bloqueada',
    obraRecomendada: 'Otras voces, un mismo patio',
    guiaId: null,
    descripcion: 'Construcción de juicios de valor estéticos y análisis de puestas en escena presenciales.',
  },
]

// Publicaciones del Muro Social del aula
const POSTS_DEMO = [
  {
    id: 'post-1',
    autor: 'Prof. Carla Mendoza',
    avatar: 'CM',
    rol: 'Docente',
    fecha: 'Publicado ayer a las 10:30 AM',
    tipo: 'anuncio',
    titulo: '¡Preparación para nuestra salida al Teatro!',
    contenido:
      'Estimados estudiantes: este viernes 18 asistiremos a la función didáctica de "Otras voces, un mismo patio" en el Auditorio UNP. Recuerden traer su cuaderno de bitácora y repasar la guía pedagógica de la Unidad 1. ¡Lleguen puntuales a las 9:30 AM!',
    likes: 12,
    comentarios: [
      {
        id: 'c-1',
        autor: 'Camila Rojas',
        rol: 'Estudiante',
        fecha: 'Ayer, 11:20 AM',
        texto: '¡Listo profesora! Ya leí el argumento de la obra y tengo las preguntas listas.',
      },
      {
        id: 'c-2',
        autor: 'Diego Santos',
        rol: 'Estudiante',
        fecha: 'Ayer, 12:45 PM',
        texto: 'Profesora, ¿podremos grabar notas de voz para la bitácora justo después de la obra?',
      },
    ],
  },
  {
    id: 'post-2',
    autor: 'Prof. Carla Mendoza',
    avatar: 'CM',
    rol: 'Docente',
    fecha: 'Hace 3 días',
    tipo: 'reflexion',
    titulo: 'Pregunta detonante: ¿Qué máscara usamos en el recreo?',
    contenido:
      'A partir de la lectura de la escena 2, los invito a dejar un breve comentario aquí: ¿En qué momentos sentimos que debemos aparentar algo diferente para encajar en el grupo?',
    likes: 8,
    comentarios: [
      {
        id: 'c-3',
        autor: 'Lucía Paredes',
        rol: 'Estudiante',
        fecha: 'Hace 3 días',
        texto:
          'A veces cuando no queremos decir que no nos gusta cierta música o tema de conversación por miedo a quedarnos solos.',
      },
    ],
  },
]

// Instituciones para el programa Voces que Transforman (regla: 1 docente por escuela)
const INSTITUCIONES_DEMO = [
  {
    id: 'ie-san-miguel',
    nombre: 'I.E. Emblemática San Miguel de Piura',
    codigoModular: '0349281',
    distrito: 'Piura',
    docenteActivo: {
      nombre: 'Lic. Carla Mendoza',
      email: 'carla.mendoza@sanmiguel.edu.pe',
      cohorte: 'Cohorte 2026-I (Marzo - Julio 2026)',
      avance: 50,
      moduloActual: 'Módulo 3: Mediación Escénica y Habilidades Socioemocionales',
      estado: 'En curso',
      horasCertificadas: '60 / 120 horas pedagógicas',
      certificacionOficial: 'Validación DREP / UGEL Piura',
    },
    vacanteOcupada: true,
    proximaConvocatoria: 'Agosto 2026 (Cohorte 2026-II)',
  },
  {
    id: 'ie-san-juan',
    nombre: 'I.E. San Juan Bautista (Catacaos)',
    codigoModular: '0281944',
    distrito: 'Catacaos',
    docenteActivo: null,
    vacanteOcupada: false,
    proximaConvocatoria: 'Inscripciones Abiertas (1 vacante disponible)',
  },
  {
    id: 'ie-santa-ana',
    nombre: 'I.E. Santa Ana (Piura)',
    codigoModular: '0491028',
    distrito: 'Piura',
    docenteActivo: null,
    vacanteOcupada: false,
    proximaConvocatoria: 'Inscripciones Abiertas (1 vacante disponible)',
  },
  {
    id: 'ie-jose-olaya',
    nombre: 'I.E. José Olaya Balandra (Sechura)',
    codigoModular: '0512879',
    distrito: 'Sechura',
    docenteActivo: null,
    vacanteOcupada: false,
    proximaConvocatoria: 'Inscripciones Abiertas (1 vacante disponible)',
  },
]

// Cartelera Teatral Escolar con filtros por CNEB, fechas y aforos (Capturas 1 y 2)
export const CARTELERA_ESCOLAR = [
  {
    id: 'otras-voces',
    titulo: 'Otras voces, un mismo patio',
    dramaturgo: 'Teatro Comunitario del Norte',
    tematica: 'Convivencia escolar',
    grados: '3.º a 5.º de secundaria',
    gradosSugeridosTexto: '3.º a 5.º de secundaria',
    edadSugerida: '14+',
    duracionTexto: '70 min',
    duracionMinutos: 70,
    lugar: 'Auditorio UNP (Universidad Nacional de Piura)',
    lugarCorto: 'Auditorio UNP',
    aforoTotal: 220,
    aforoReservado: 142,
    cuposDisponibles: 78,
    precioEscolar: 10,
    becasDisponibles: true,
    proximaFuncionTexto: 'Sáb. 24 may. · 10:30',
    proximasFunciones: ['2026-05-24 10:30 AM', '2026-05-31 10:30 AM', '2026-06-07 03:00 PM'],
    competenciaCneb: 'Se comunica oralmente en su lengua materna',
    enfoqueTransversal: 'Enfoque de Orientación al Bien Común',
    recomendada: true,
    porQueRecomendada:
      'Relacionada con el tema de convivencia escolar y permite trabajar la comunicación oral con tu sección.',
    gradiente: 'linear-gradient(135deg, #2b1f69 0%, #a11d61 100%)',
    sinopsis:
      'Un grupo de estudiantes de distintas procedencias culturales se enfrenta al reto de organizar una obra para el aniversario de la escuela. Las diferencias y prejuicios iniciales se transforman en una alianza genuina al descubrir sus historias compartidas.',
    imagen: '/images/obras/otras-voces.jpg',
  },
  {
    id: 'quien-soy',
    titulo: '¿Y si soy yo?',
    dramaturgo: 'Compañía Escena Viva',
    tematica: 'Identidad y autoestima',
    grados: '1.º a 4.º de secundaria',
    gradosSugeridosTexto: '1.º a 4.º de secundaria',
    edadSugerida: '12+',
    duracionTexto: '60 min',
    duracionMinutos: 60,
    lugar: 'Teatro Municipal de Piura',
    lugarCorto: 'Teatro Municipal de Piura',
    aforoTotal: 300,
    aforoReservado: 180,
    cuposDisponibles: 120,
    precioEscolar: 12,
    becasDisponibles: true,
    proximaFuncionTexto: 'Mié. 28 may. · 11:00',
    proximasFunciones: ['2026-05-28 11:00 AM', '2026-06-04 11:00 AM'],
    competenciaCneb: 'Construye su identidad',
    enfoqueTransversal: 'Enfoque de Igualdad de Género y Desarrollo Personal',
    recomendada: false,
    gradiente: 'linear-gradient(135deg, #c84126 0%, #e68324 100%)',
    sinopsis:
      'Entre las expectativas familiares, los comentarios en redes sociales y la incertidumbre vocacional, Camila busca defender su pasión por el arte frente a los temores de su entorno.',
    imagen: '/images/obras/quien-soy.jpg',
  },
  {
    id: 'semillas',
    titulo: 'El río que canta',
    dramaturgo: 'Colectivo Algarrobo Teatral',
    tematica: 'Comunidad y ambiente',
    grados: '1.º a 5.º de secundaria',
    gradosSugeridosTexto: '1.º a 5.º de secundaria',
    edadSugerida: '10+',
    duracionTexto: '55 min',
    duracionMinutos: 55,
    lugar: 'Auditorio Casa de la Cultura',
    lugarCorto: 'Auditorio Casa de la Cultura',
    aforoTotal: 120,
    aforoReservado: 25,
    cuposDisponibles: 95,
    precioEscolar: 8,
    becasDisponibles: true,
    proximaFuncionTexto: 'Vie. 30 may. · 09:30',
    proximasFunciones: ['2026-05-30 09:30 AM', '2026-06-06 09:30 AM'],
    competenciaCneb: 'Convive y participa democráticamente en la búsqueda del bien común',
    enfoqueTransversal: 'Enfoque Ambiental y Ciudadanía Activa',
    recomendada: false,
    gradiente: 'linear-gradient(135deg, #126459 0%, #71a554 100%)',
    sinopsis:
      'Una pequeña quebrada seca se convierte en el epicentro de un rescate ecológico liderado por escolares, desafiando a los adultos escépticos del pueblo.',
    imagen: '/images/obras/semillas.jpg',
  },
]

// Guías demostrativas precargadas
const GUIAS_DEMO = [
  {
    id: 'guia-demo-1',
    claseId: 'comunicacion',
    sesion: 1,
    creada: '2026-03-28T10:00:00.000Z',
    guia: {
      titulo: 'Guía Pedagógica CNEB: La voz que rompe el silencio',
      competencia: 'Se comunica oralmente en su lengua materna',
      capacidad: 'Adecúa, organiza y desarrolla las ideas de forma coherente',
      obraSugerida: 'Otras voces, un mismo patio',
      introduccion:
        'Esta guía orienta el análisis crítico y la empatía en la convivencia escolar a partir de la apreciación de la obra teatral "Otras voces, un mismo patio".',
      momentos: {
        antes:
          'Realizar el juego de "El espejo invertido": en parejas, los estudiantes imitan gestos pero buscando responder con un gesto de escucha y apertura. Reflexionar sobre cómo reaccionamos cuando alguien piensa distinto.',
        durante:
          'Observar con atención la escena en el patio (Minuto 25): identificar qué personaje calla ante la discusión y qué lenguaje corporal adopta.',
        despues:
          'Ronda de palabra en círculo. Cada estudiante comparte una frase que le haya resonado de la obra y graba su reflexión de audio de 1 minuto en la plataforma.',
      },
      preguntas_debate: [
        '¿Por qué al personaje principal le costó tanto admitir que necesitaba ayuda?',
        '¿Qué rol jugaron los compañeros que no participaron activamente de la burla pero tampoco la frenaron?',
        '¿Cómo podemos transformar un momento de tensión en nuestro propio salón en una oportunidad de escucharnos?',
      ],
      sugerenciasAlternativas: [
        {
          titulo: 'El patio de atrás (Adaptación de lectura dramática)',
          justificacion: 'Si no puedes asistir al teatro, puedes realizar una lectura dramatizada en el aula del guion corto adaptado.',
        },
      ],
    },
  },
]

const generarCodigoEstudiante = (grado, seccion, correlativo) => {
  const g = grado.replace(/[^0-9]/g, '') || '3'
  const sec = (seccion || 'A').toUpperCase()
  const num = String(correlativo).padStart(2, '0')
  return `SMP-${g}${sec}-${num}`
}

const crearNuevaClaseEstructura = (meta, conAlumnos = true) => {
  const g = meta.grade || '3.º'
  const sec = meta.section || 'A'
  const estudiantes = conAlumnos
    ? ESTUDIANTES_BASE.map((item, idx) => ({
        id: uid('est'),
        nombre: item.nombre,
        username: item.username,
        codigo: generarCodigoEstudiante(g, sec, idx + 1),
        consentimiento: item.consentimiento,
        avance: item.avance,
        audios: copia(item.audios),
      }))
    : []

  return {
    estudiantes,
    tareas: [],
    entregas: {},
    sesionesDictadas: [],
    unidades: copia(UNIDADES_CNEB_DEMO),
    posts: copia(POSTS_DEMO),
    reservas: [
      {
        id: 'res-demo-1',
        obra: 'Otras voces, un mismo patio',
        teatro: 'Auditorio UNP',
        fecha: '2026-04-18 10:00 AM',
        totalEstudiantes: 24,
        asistentesConfirmados: 22,
        inasistentes: ['Joaquín Atoche', 'Valeria Ñiquen'],
        estado: 'Confirmada',
        codigoReserva: 'SCN-RES-8821',
      },
    ],
  }
}

function persistir() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(estado))
  } catch {
    /* fallback en memoria */
  }
}

function cargar() {
  if (!estado) {
    try {
      const raw = window.localStorage.getItem(KEY)
      if (raw) estado = JSON.parse(raw)
    } catch {
      estado = null
    }
  }

  if (!estado) {
    estado = {
      clasesMeta: copia(clasesDemoIniciales),
      clases: {},
      guias: copia(GUIAS_DEMO),
      avisos: [],
      instituciones: copia(INSTITUCIONES_DEMO),
    }
  }

  // Asegurar que las clases de demostración iniciales estén sincronizadas
  clasesDemoIniciales.forEach((demoClass, i) => {
    const existingIndex = estado.clasesMeta.findIndex((c) => c.id === demoClass.id)
    if (existingIndex === -1) {
      estado.clasesMeta.push(copia(demoClass))
    } else {
      estado.clasesMeta[existingIndex] = {
        ...demoClass,
        ...estado.clasesMeta[existingIndex],
        topic: estado.clasesMeta[existingIndex].topic || demoClass.topic,
        proximo: estado.clasesMeta[existingIndex].proximo || demoClass.proximo,
        activa: demoClass.activa ?? estado.clasesMeta[existingIndex].activa,
        intereses: estado.clasesMeta[existingIndex].intereses || demoClass.intereses,
      }
    }
    if (!estado.clases[demoClass.id]) {
      estado.clases[demoClass.id] = crearNuevaClaseEstructura(demoClass, i === 0)
    }
  })

  // Asegurar que todas las clases meta existan en el diccionario de clases
  estado.clasesMeta.forEach((c, i) => {
    if (!estado.clases[c.id]) {
      estado.clases[c.id] = crearNuevaClaseEstructura(c, i === 0)
    }
  })

  persistir()
  return estado
}

export function edadPorGrado(grado) {
  const g = String(grado)
  if (g.includes('1')) return 12
  if (g.includes('2')) return 13
  if (g.includes('3')) return 14
  if (g.includes('4')) return 15
  return 16
}

export function resumenClase(clase) {
  const estudiantes = clase.estudiantes || []
  const aptos = estudiantes.filter((e) => e.consentimiento === 'otorgado')
  const tareas = clase.tareas || []
  let hechas = 0
  let porRevisar = 0

  tareas.forEach((t) =>
    aptos.forEach((e) => {
      const st = clase.entregas?.[t.id]?.[e.id]?.estado
      if (st === 'hecho') hechas += 1
      else if (st === 'entregada') porRevisar += 1
    }),
  )

  const audiosPendientes = estudiantes.reduce(
    (acc, est) => acc + (est.audios || []).filter((a) => !a.calificacion).length,
    0,
  )

  return {
    estudiantes: estudiantes.length,
    conConsentimiento: aptos.length,
    sinConsentimiento: estudiantes.length - aptos.length,
    tareas: tareas.length,
    hechas,
    porRevisar,
    posibles: tareas.length * aptos.length,
    sesionesDictadas: clase.sesionesDictadas ? clase.sesionesDictadas.length : 0,
    audiosPendientes,
    reservasActivas: (clase.reservas || []).length,
  }
}

function armar(meta) {
  const cData = cargar().clases[meta.id] || crearNuevaClaseEstructura(meta, false)
  const clase = { ...meta, ...copia(cData) }
  clase.resumen = resumenClase(clase)
  return clase
}

function claseMutable(id) {
  const c = cargar().clases[id]
  if (!c) throw new Error('Clase no encontrada')
  return c
}

const delay = (valor) => Promise.resolve(valor)

// ==========================================
// 1. CLASES Y AULAS
// ==========================================

export async function listarClases() {
  const e = cargar()
  return delay(e.clasesMeta.map(armar))
}

export async function obtenerClase(id) {
  const e = cargar()
  let meta = e.clasesMeta.find((c) => c.id === id)
  if (!meta && (id === 'comunicacion' || id === 'comunicacion-3b')) {
    meta = e.clasesMeta.find((c) => c.subject === 'Comunicación' && c.section === 'B') || e.clasesMeta[0]
  }
  if (!meta) meta = e.clasesMeta[0] || null
  if (!meta) throw new Error('Clase no encontrada')
  return delay(armar(meta))
}

export async function crearClase({ grade, section, subject, shift, topic, color = 'indigo' }) {
  const e = cargar()
  const id = uid('clase')
  const nuevaMeta = {
    id,
    grade: grade || '3.º',
    section: (section || 'A').toUpperCase(),
    subject: subject || 'Comunicación',
    shift: shift || 'Mañana',
    students: 25,
    guides: 0,
    completed: 0,
    total: 25,
    last: 'Sin actividad inicial',
    color: color || 'indigo',
    topic: topic || 'Desarrollo Curricular CNEB',
    proximo: 'Revisar actividades iniciales',
    activa: false,
  }

  e.clasesMeta.push(nuevaMeta)
  e.clases[id] = crearNuevaClaseEstructura(nuevaMeta, true)
  persistir()
  return delay(armar(nuevaMeta))
}

export async function crearCursoConSecciones({
  subject = 'Comunicación',
  nivel = 'Secundaria',
  grade = '3.º',
  sections = 'A, B',
  topic = 'Convivencia escolar',
  intereses = 'Debate, identidad cultural y creación audiovisual',
  listaEstudiantes = [],
}) {
  const e = cargar()
  const secList = (Array.isArray(sections) ? sections : String(sections).split(','))
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)

  const listToCreate = secList.length ? secList : ['A']
  const creadas = []

  for (const sec of listToCreate) {
    const safeSub = subject.toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 5) || 'curso'
    const id = uid(`clase-${safeSub}-${sec.toLowerCase()}`)
    const numEstudiantes = listaEstudiantes.length > 0 ? listaEstudiantes.length : 25
    const meta = {
      id,
      grade: grade || '3.º',
      section: sec,
      subject: subject || 'Comunicación',
      nivel: nivel || 'Secundaria',
      shift: 'Mañana',
      students: numEstudiantes,
      guides: 0,
      completed: 0,
      total: numEstudiantes,
      last: 'Curso creado',
      color: 'indigo',
      topic: topic || 'Convivencia escolar',
      intereses: intereses || 'Debate y expresión teatral',
      proximo: 'Planificar primera experiencia',
      activa: false,
    }

    e.clasesMeta.push(meta)
    const estructura = crearNuevaClaseEstructura(meta, listaEstudiantes.length === 0)
    if (listaEstudiantes.length > 0) {
      estructura.estudiantes = listaEstudiantes.map((nombre, idx) => ({
        id: uid('est'),
        nombre,
        username: nombre.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, ''),
        codigo: generarCodigoEstudiante(meta.grade, sec, idx + 1),
        consentimiento: 'pendiente',
        avance: 0,
        audios: [],
      }))
    }
    e.clases[id] = estructura
    creadas.push(armar(meta))
  }

  persistir()
  return delay(creadas)
}

export async function actualizarInteresesClase(claseId, { topic, intereses }) {
  const e = cargar()
  const meta = e.clasesMeta.find((c) => c.id === claseId)
  if (meta) {
    if (topic !== undefined && topic.trim()) meta.topic = topic.trim()
    if (intereses !== undefined) meta.intereses = intereses.trim()
  }
  const c = e.clases[claseId]
  if (c) {
    if (topic !== undefined && topic.trim()) c.topic = topic.trim()
    if (intereses !== undefined) c.intereses = intereses.trim()
  }
  persistir()
  return delay(meta ? armar(meta) : null)
}

export async function vincularObraAClase(claseId, obraTituloOId) {
  const e = cargar()
  const meta = e.clasesMeta.find((c) => c.id === claseId)
  const c = e.clases[claseId]
  const obra = CARTELERA_ESCOLAR.find((o) => o.id === obraTituloOId || o.titulo === obraTituloOId) || {
    titulo: obraTituloOId,
  }

  if (c) {
    c.obraSeleccionada = obra.titulo
    if (meta) {
      meta.last = `Obra vinculada: ${obra.titulo}`
      meta.proximo = `Confirmar asistencia a función de "${obra.titulo}"`
    }
  }
  persistir()
  return delay(true)
}

// Actividades próximas del panel docente (coincidentes con la captura 2)
export const ACTIVIDADES_PROXIMAS = [
  {
    id: 'act-1',
    tipo: 'funcion',
    titulo: 'Función reservada',
    subtitulo: 'Otras voces, un mismo patio · 3.º B',
    fechaTexto: '24 MAY',
    icono: 'ticket',
    color: 'indigo',
  },
  {
    id: 'act-2',
    tipo: 'actividad',
    titulo: 'Actividad previa',
    subtitulo: 'Escuchar para convivir · 3.º A',
    fechaTexto: '14 MAY',
    icono: 'calendar',
    color: 'rose',
  },
  {
    id: 'act-3',
    tipo: 'reflexiones',
    titulo: 'Reflexiones pendientes',
    subtitulo: 'Participaciones por revisar · 3.º B',
    badge: '8',
    icono: 'spark',
    color: 'amber',
  },
]

export async function obtenerActividadesProximas() {
  return delay(copia(ACTIVIDADES_PROXIMAS))
}

// Obras recomendadas por sección para el panel docente
export const OBRAS_RECOMENDADAS_DOCENTE = [
  {
    id: 'otras-voces',
    titulo: 'Otras voces, un mismo patio',
    tematica: 'Convivencia escolar',
    justificacion: 'Coincide con el tema "Convivencia escolar" y con los intereses de 3.° B.',
    gradiente: 'linear-gradient(135deg, #3b1b68 0%, #6d28d9 50%, #9f1239 100%)',
    tagsTematicos: ['Convivencia escolar', 'Debate'],
    enlaceCartelera: '/docente/cartelera?obra=otras-voces',
  },
  {
    id: 'quien-soy',
    titulo: '¿Y si soy yo?',
    tematica: 'Identidad y autoestima',
    justificacion: 'Invita a reconocer distintas perspectivas y fortalece la escucha empática en el aula.',
    gradiente: 'linear-gradient(135deg, #9a3412 0%, #ea580c 50%, #f59e0b 100%)',
    tagsTematicos: ['Identidad y autoestima', 'Escucha empática'],
    enlaceCartelera: '/docente/cartelera?obra=quien-soy',
  },
  {
    id: 'semillas',
    titulo: 'Pequeñas semillas',
    tematica: 'Comunidad y ambiente',
    justificacion: 'Conecta la expresión escénica con proyectos de participación y cuidado de la comunidad.',
    gradiente: 'linear-gradient(135deg, #115e59 0%, #047857 50%, #15803d 100%)',
    tagsTematicos: ['Comunidad y ambiente', 'Ciudadanía'],
    enlaceCartelera: '/docente/cartelera?obra=semillas',
  },
]

export function obtenerObrasRecomendadasParaClase(clase) {
  if (!clase) return copia(OBRAS_RECOMENDADAS_DOCENTE)

  const topicNorm = (clase.topic || '').toLowerCase()
  const sec = clase.section || 'B'
  const grade = clase.grade || '3.º'

  return OBRAS_RECOMENDADAS_DOCENTE.map((obra) => {
    let justificacion = obra.justificacion
    if (obra.tematica.toLowerCase().includes(topicNorm) || topicNorm.includes(obra.tematica.toLowerCase())) {
      justificacion = `Coincide con el tema "${clase.topic}" y con los intereses de ${grade} ${sec}.`
    } else if (obra.id === 'quien-soy') {
      justificacion = `Invita a reconocer distintas perspectivas y fortalece la escucha empática en el aula.`
    } else if (obra.id === 'semillas') {
      justificacion = `Conecta la expresión escénica con proyectos de participación y cuidado de la comunidad.`
    }
    return {
      ...obra,
      justificacion,
    }
  })
}

// ==========================================
// 2. NÓMINA, CONSENTIMIENTO Y ESTUDIANTES
// ==========================================

export async function inscribirEstudiantes(claseId, nombres) {
  const e = cargar()
  const c = claseMutable(claseId)
  const meta = e.clasesMeta.find((m) => m.id === claseId)
  const limpios = nombres.map((n) => n.trim()).filter(Boolean)
  if (!limpios.length) throw new Error('Escribe al menos un nombre.')

  const g = meta ? meta.grade : '3.º'
  const sec = meta ? meta.section : 'A'

  limpios.forEach((nombre) => {
    const correlativo = c.estudiantes.length + 1
    const username = nombre.toLowerCase().replace(/\s+/g, '.').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    c.estudiantes.push({
      id: uid('est'),
      nombre,
      username,
      codigo: generarCodigoEstudiante(g, sec, correlativo),
      consentimiento: 'pendiente', // Por defecto pendiente según Ley 29733
      avance: 0,
      audios: [],
    })
  })

  persistir()
  return delay(limpios.length)
}

export async function quitarEstudiante(claseId, estId) {
  const c = claseMutable(claseId)
  c.estudiantes = c.estudiantes.filter((e) => e.id !== estId)
  if (c.entregas) {
    Object.values(c.entregas).forEach((porEst) => delete porEst[estId])
  }
  persistir()
  return delay(true)
}

export async function registrarConsentimiento(claseId, estId, estadoNuevo) {
  const c = claseMutable(claseId)
  const e = c.estudiantes.find((x) => x.id === estId)
  if (!e) throw new Error('Estudiante no encontrado')
  e.consentimiento = estadoNuevo
  e.consentimientoFecha = ahora()
  persistir()
  return delay(true)
}

export async function evaluarAudioEstudiante(claseId, estId, audioId, { calificacion, retroalimentacion }) {
  const c = claseMutable(claseId)
  const est = c.estudiantes.find((x) => x.id === estId)
  if (!est) throw new Error('Estudiante no encontrado')
  const aud = (est.audios || []).find((a) => a.id === audioId)
  if (!aud) throw new Error('Audio de reflexión no encontrado')

  aud.calificacion = calificacion
  aud.retroalimentacion = retroalimentacion
  aud.fechaCalificacion = ahora()
  persistir()
  return delay(true)
}

// ==========================================
// 3. MURO SOCIAL DEL CURSO (FEED)
// ==========================================

export async function crearPostMuro(claseId, { titulo, contenido, tipo = 'anuncio', autor = 'Prof. Carla Mendoza', rol = 'Docente' }) {
  const c = claseMutable(claseId)
  if (!contenido?.trim()) throw new Error('La publicación debe contener un mensaje.')

  c.posts = c.posts || []
  const nuevoPost = {
    id: uid('post'),
    autor,
    avatar: 'CM',
    rol,
    fecha: 'Publicado hace unos momentos',
    tipo,
    titulo: titulo?.trim() || '',
    contenido: contenido.trim(),
    likes: 0,
    comentarios: [],
  }

  c.posts.unshift(nuevoPost)
  persistir()
  return delay(nuevoPost)
}

export async function reaccionarPost(claseId, postId) {
  const c = claseMutable(claseId)
  const post = (c.posts || []).find((p) => p.id === postId)
  if (!post) throw new Error('Publicación no encontrada')
  post.likes = (post.likes || 0) + 1
  persistir()
  return delay(post.likes)
}

export async function comentarPost(claseId, postId, { texto, autor = 'Prof. Carla Mendoza', rol = 'Docente' }) {
  const c = claseMutable(claseId)
  const post = (c.posts || []).find((p) => p.id === postId)
  if (!post) throw new Error('Publicación no encontrada')
  if (!texto?.trim()) throw new Error('El comentario no puede estar vacío.')

  post.comentarios = post.comentarios || []
  const nuevoComentario = {
    id: uid('com'),
    autor,
    rol,
    fecha: 'Hace un momento',
    texto: texto.trim(),
  }

  post.comentarios.push(nuevoComentario)
  persistir()
  return delay(nuevoComentario)
}

// ==========================================
// 4. TEMARIO CNEB, STEPPER Y GUÍAS IA
// ==========================================

export async function guardarGuia({ claseId, sesion, guia }) {
  const e = cargar()
  const nuevaGuia = {
    id: uid('guia'),
    claseId: claseId || null,
    sesion: sesion || null,
    guia,
    creada: ahora(),
  }
  e.guias.unshift(nuevaGuia)

  // Si está vinculada a una clase, actualizar la unidad o contador
  if (claseId && e.clases[claseId]) {
    const c = e.clases[claseId]
    const unidad = (c.unidades || []).find((u) => u.estado === 'en_progreso')
    if (unidad) {
      unidad.guiaId = nuevaGuia.id
    }
  }

  persistir()
  return delay(nuevaGuia)
}

export async function actualizarGuia(guiaId, guiaData) {
  const e = cargar()
  const idx = e.guias.findIndex((g) => g.id === guiaId)
  if (idx === -1) throw new Error('Guía no encontrada')
  e.guias[idx].guia = { ...e.guias[idx].guia, ...guiaData }
  e.guias[idx].actualizada = ahora()
  persistir()
  return delay(e.guias[idx])
}

export async function eliminarGuia(guiaId) {
  const e = cargar()
  e.guias = e.guias.filter((g) => g.id !== guiaId)
  persistir()
  return delay(true)
}

export async function listarGuias() {
  return delay(copia(cargar().guias))
}

// ==========================================
// 5. CARTELERA ESCOLAR Y RESERVA POR AULA
// ==========================================

export async function obtenerCarteleraEscolar() {
  return delay(copia(CARTELERA_ESCOLAR))
}

export async function reservarFuncionClase({
  claseId,
  obra,
  fecha,
  teatro,
  estudiantesIds = [],
  inasistentesNombres = [],
}) {
  const c = claseMutable(claseId)
  const total = estudiantesIds.length
  const nuevaReserva = {
    id: uid('res'),
    obra,
    fecha,
    teatro: teatro || 'Auditorio UNP',
    totalEstudiantes: total + inasistentesNombres.length,
    asistentesConfirmados: total,
    inasistentes: inasistentesNombres,
    estado: 'Confirmada',
    codigoReserva: `SCN-RES-${Math.floor(1000 + Math.random() * 9000)}`,
    creada: ahora(),
  }

  c.reservas = c.reservas || []
  c.reservas.unshift(nuevaReserva)

  // Registrar también en avisos globales para que figure en el dashboard
  const e = cargar()
  e.avisos.unshift({
    id: uid('aviso'),
    claseId,
    obra,
    fecha,
    nota: `${total} alumnos confirmados (${inasistentesNombres.length} inasistentes). Código: ${nuevaReserva.codigoReserva}`,
    creado: ahora(),
  })

  persistir()
  return delay(nuevaReserva)
}

export async function registrarAviso({ claseId, obra, fecha, nota }) {
  if (!obra?.trim()) throw new Error('Indica la obra a la que asistirás.')
  const e = cargar()
  e.avisos.unshift({
    id: uid('aviso'),
    claseId: claseId || null,
    obra: obra.trim(),
    fecha: fecha || null,
    nota: nota || '',
    creado: ahora(),
  })
  persistir()
  return delay(true)
}

export async function listarAvisos() {
  return delay(copia(cargar().avisos))
}

// ==========================================
// 6. PROGRAMA "VOCES QUE TRANSFORMAN"
//    (Regla estricta: 1 docente por escuela)
// ==========================================

export async function listarInstituciones() {
  const e = cargar()
  return delay(copia(e.instituciones))
}

export async function obtenerInstitucionDocente(idOModular = 'ie-san-miguel') {
  const e = cargar()
  const inst = e.instituciones.find((i) => i.id === idOModular || i.codigoModular === idOModular)
  if (!inst) throw new Error('Institución educativa no encontrada')
  return delay(copia(inst))
}

export async function postularProgramaDocente({
  institucionId,
  docenteNombre,
  email,
  especialidad,
  motivacion,
}) {
  const e = cargar()
  const inst = e.instituciones.find((i) => i.id === institucionId)
  if (!inst) throw new Error('Institución educativa no encontrada')

  // Validación estricta de la regla de negocio
  if (inst.vacanteOcupada && inst.docenteActivo) {
    throw new Error(
      `Regla institucional de Scenia: La institución "${inst.nombre}" ya tiene una vacante activa ocupada por ${inst.docenteActivo.nombre} en la ${inst.docenteActivo.cohorte}. Solo se permite 1 docente por escuela a la vez hasta su culminación.`,
    )
  }

  // Registrar inscripción si la vacante está libre
  inst.vacanteOcupada = true
  inst.docenteActivo = {
    nombre: docenteNombre || 'Docente Postulante',
    email: email || '',
    cohorte: 'Cohorte 2026-I',
    avance: 0,
    moduloActual: 'Módulo 1: Introducción a las Habilidades Socioemocionales en el Aula',
    estado: 'Inscrito / Activo',
    horasCertificadas: '0 / 120 horas pedagógicas',
    certificacionOficial: 'Validación DREP / UGEL Piura',
    especialidad: especialidad || 'Comunicación',
    motivacion: motivacion || '',
  }

  persistir()
  return delay(inst)
}

// ==========================================
// 7. TAREAS Y ENTREGAS (SOPORTE ANTERIOR)
// ==========================================

export async function asignarTareasSesion(claseId, sesion) {
  const c = claseMutable(claseId)
  const plantillas = plantillasDeSesion(sesion)
  if (!plantillas.length) throw new Error('Esta sesión todavía no tiene tareas definidas.')
  let nuevas = 0
  plantillas.forEach((p) => {
    if (c.tareas.some((t) => t.plantillaId === p.plantillaId)) return
    c.tareas.push({ id: uid('tarea'), sesion: Number(sesion), creada: ahora(), ...p })
    nuevas += 1
  })
  persistir()
  return delay(nuevas)
}

export async function crearTareaPersonalizada(claseId, { titulo, descripcion, fechaLimite }) {
  const c = claseMutable(claseId)
  if (!titulo?.trim()) throw new Error('La tarea necesita un título.')
  c.tareas.push({
    id: uid('tarea'),
    plantillaId: null,
    sesion: null,
    tipo: 'revision',
    titulo: titulo.trim(),
    descripcion: descripcion?.trim() || '',
    instruccion: descripcion?.trim() || '',
    campos: ['Respuesta'],
    fechaLimite: fechaLimite || null,
    creada: ahora(),
  })
  persistir()
  return delay(true)
}

export async function eliminarTarea(claseId, tareaId) {
  const c = claseMutable(claseId)
  c.tareas = c.tareas.filter((t) => t.id !== tareaId)
  delete c.entregas[tareaId]
  persistir()
  return delay(true)
}

function exigirConsentimiento(c, estId) {
  const e = c.estudiantes.find((x) => x.id === estId)
  if (!e) throw new Error('Estudiante no encontrado')
  if (e.consentimiento !== 'otorgado') {
    throw new Error(`${e.nombre} no tiene consentimiento otorgado: sus tareas están bloqueadas (Ley 29733).`)
  }
  return e
}

export async function marcarEntrega(claseId, tareaId, estId, estadoNuevo) {
  const c = claseMutable(claseId)
  exigirConsentimiento(c, estId)
  const actual = c.entregas[tareaId]?.[estId]
  if (estadoNuevo === 'hecho' && !actual) {
    throw new Error('El estudiante aún no entrega esta tarea.')
  }
  c.entregas[tareaId] = c.entregas[tareaId] || {}
  c.entregas[tareaId][estId] = { ...actual, estado: estadoNuevo, fecha: ahora() }
  persistir()
  return delay(true)
}

export async function simularEntrega(claseId, tareaId, estId) {
  const c = claseMutable(claseId)
  exigirConsentimiento(c, estId)
  const tarea = c.tareas.find((t) => t.id === tareaId)
  if (!tarea) throw new Error('Tarea no encontrada')
  let respuesta
  let estadoNuevo = 'entregada'
  if (tarea.tipo === 'auto') {
    respuesta = {
      dimensiones: Object.fromEntries(
        DIMENSIONES_WLEIS.map(([k]) => [k, Number((3.5 + Math.random() * 3).toFixed(1))]),
      ),
    }
    estadoNuevo = 'hecho'
  } else {
    respuesta = { items: tarea.campos.map((campo) => `(demo) Reflexión del estudiante sobre "${campo}"`) }
  }
  c.entregas[tareaId] = c.entregas[tareaId] || {}
  c.entregas[tareaId][estId] = { estado: estadoNuevo, respuesta, fecha: ahora() }
  persistir()
  return delay(true)
}

export async function alternarSesionDictada(claseId, n) {
  const c = claseMutable(claseId)
  c.sesionesDictadas = c.sesionesDictadas.includes(n)
    ? c.sesionesDictadas.filter((x) => x !== n)
    : [...c.sesionesDictadas, n].sort()
  persistir()
  return delay(true)
}
