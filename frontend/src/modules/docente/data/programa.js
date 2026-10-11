// Contenido del programa "Voces que Transforman 2026" (fuente: Programa_Voces_2026.pdf).
// Solo la Sesión 1 está desarrollada en el documento; las demás tienen pilar pero
// todavía no tienen tareas definidas. Cuando existan, basta con añadir sus `tareas` aquí.

export const DIMENSIONES_WLEIS = [
  ['SEA', 'Autoconocimiento (SEA)'],
  ['ROE', 'Autocontrol (ROE)'],
  ['UOE', 'Automotivación (UOE)'],
  ['OEA', 'Empatía (OEA)'],
]

const TAREAS_SESION_1 = [
  {
    plantillaId: 's1-pretest',
    titulo: 'Evaluación inicial · Test WLEIS (Pre-test)',
    tipo: 'auto', // la plataforma la califica sola; el docente no la marca
    descripcion:
      'Evaluación diagnóstica de 16 preguntas en escala del 1 al 7 (1 = totalmente en desacuerdo, 7 = totalmente de acuerdo).',
    instruccion: 'Responde los 16 enunciados de la escala WLEIS.',
    campos: DIMENSIONES_WLEIS.map(([, etiqueta]) => etiqueta),
  },
  {
    plantillaId: 's1-expediente',
    titulo: 'Expediente personal · Detectives de fortalezas',
    tipo: 'revision', // el docente lee la respuesta y la marca como hecha
    descripcion: 'Tras el juego de parejas en el aula, el estudiante vuelca sus reflexiones.',
    instruccion: 'Responde sobre ti mismo, a partir de la actividad realizada en clase:',
    campos: [
      '¿Qué disfrutas hacer?',
      '¿Qué suele salirte bien?',
      '¿Para qué te buscan otras personas?',
      '¿Qué te gustaría aprender aunque nadie te obligara?',
    ],
  },
  {
    plantillaId: 's1-brujula',
    titulo: 'Mi Brújula digital · Fruto significativo',
    tipo: 'revision',
    descripcion: 'Registro final de las 3 pistas descubiertas sobre sí mismo al cierre de la sesión.',
    instruccion: 'Completa tus 3 tarjetas de la Brújula de Autoconocimiento:',
    campos: ['Lo que me gusta', 'Lo que creo que se me da bien', 'Lo que quiero descubrir o desarrollar'],
  },
]

export const SESIONES = [
  {
    n: 1,
    pilar: 'Autoconocimiento',
    titulo: 'Descubre qué hay en ti',
    objetivo:
      'Reconocer que cada persona tiene intereses, habilidades y fortalezas diferentes, y que compararse constantemente impide verlas.',
    pregunta: '¿Cómo sabes en qué eres bueno?',
    tareas: TAREAS_SESION_1,
  },
  { n: 2, pilar: 'Autoconocimiento', tareas: [] },
  { n: 3, pilar: 'Autocontrol', tareas: [] },
  { n: 4, pilar: 'Autocontrol', tareas: [] },
  { n: 5, pilar: 'Automotivación', tareas: [] },
  { n: 6, pilar: 'Automotivación', tareas: [] },
]

export const sesionPorN = (n) => SESIONES.find((s) => s.n === Number(n))
export const plantillasDeSesion = (n) => sesionPorN(n)?.tareas ?? []
export const nombreSesion = (s) => `Sesión ${s.n} · ${s.pilar}${s.titulo ? ` — ${s.titulo}` : ''}`
