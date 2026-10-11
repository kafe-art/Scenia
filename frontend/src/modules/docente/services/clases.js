// Capa de datos del docente.
// Hoy guarda todo en localStorage (no hay backend de clases todavía). Cada función es async
// y devuelve copias, igual que lo haría una API: cuando exista Supabase solo se reemplaza el
// cuerpo de estas funciones y las pantallas no cambian.
import { classes as clasesDemo } from '../../../data/demo'
import { plantillasDeSesion, DIMENSIONES_WLEIS } from '../data/programa'

const KEY = 'scenia.docente.v1'
let estado = null

const copia = (x) => JSON.parse(JSON.stringify(x))
const uid = (p) => `${p}-${Math.random().toString(36).slice(2, 9)}`
const ahora = () => new Date().toISOString()

const ALUMNOS_DEMO = [
  ['Camila Rojas', 'otorgado'],
  ['Diego Santos', 'otorgado'],
  ['Lucía Paredes', 'otorgado'],
  ['Mateo Vílchez', 'otorgado'],
  ['Valeria Ñiquen', 'pendiente'],
  ['Joaquín Atoche', 'revocado'],
]

const nuevaClase = (conAlumnos) => ({
  estudiantes: conAlumnos
    ? ALUMNOS_DEMO.map(([nombre, consentimiento]) => ({ id: uid('est'), nombre, consentimiento }))
    : [],
  tareas: [],
  entregas: {}, // entregas[tareaId][estudianteId] = { estado, respuesta, fecha }
  sesionesDictadas: [],
})

function persistir() {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(estado))
  } catch {
    /* sin almacenamiento: los datos viven solo en memoria */
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
  if (!estado) estado = { clases: {}, guias: [], avisos: [] }
  clasesDemo.forEach((c, i) => {
    if (!estado.clases[c.id]) estado.clases[c.id] = nuevaClase(i === 0)
  })
  persistir()
  return estado
}

export function edadPorGrado(grado) {
  return grado === '3.º' ? 14 : grado === '4.º' ? 15 : 16
}

export function resumenClase(clase) {
  const aptos = clase.estudiantes.filter((e) => e.consentimiento === 'otorgado')
  let hechas = 0
  let porRevisar = 0
  clase.tareas.forEach((t) =>
    aptos.forEach((e) => {
      const st = clase.entregas[t.id]?.[e.id]?.estado
      if (st === 'hecho') hechas += 1
      else if (st === 'entregada') porRevisar += 1
    }),
  )
  return {
    estudiantes: clase.estudiantes.length,
    conConsentimiento: aptos.length,
    sinConsentimiento: clase.estudiantes.length - aptos.length,
    tareas: clase.tareas.length,
    hechas,
    porRevisar,
    posibles: clase.tareas.length * aptos.length,
    sesionesDictadas: clase.sesionesDictadas.length,
  }
}

function armar(meta) {
  const clase = { ...meta, ...copia(cargar().clases[meta.id]) }
  clase.resumen = resumenClase(clase)
  return clase
}

function claseMutable(id) {
  const c = cargar().clases[id]
  if (!c) throw new Error('Clase no encontrada')
  return c
}

const delay = (valor) => Promise.resolve(valor)

// ---------- Lectura ----------
export async function listarClases() {
  return delay(clasesDemo.map(armar))
}

export async function obtenerClase(id) {
  const meta = clasesDemo.find((c) => c.id === id)
  if (!meta) throw new Error('Clase no encontrada')
  return delay(armar(meta))
}

// ---------- Nómina y consentimiento ----------
export async function inscribirEstudiantes(claseId, nombres) {
  const c = claseMutable(claseId)
  const limpios = nombres.map((n) => n.trim()).filter(Boolean)
  if (!limpios.length) throw new Error('Escribe al menos un nombre.')
  limpios.forEach((nombre) => {
    // Todo estudiante nuevo nace sin consentimiento: sus tareas quedan bloqueadas hasta registrarlo.
    c.estudiantes.push({ id: uid('est'), nombre, consentimiento: 'pendiente' })
  })
  persistir()
  return delay(limpios.length)
}

export async function quitarEstudiante(claseId, estId) {
  const c = claseMutable(claseId)
  c.estudiantes = c.estudiantes.filter((e) => e.id !== estId)
  Object.values(c.entregas).forEach((porEst) => delete porEst[estId])
  persistir()
  return delay(true)
}

// estadoNuevo: 'otorgado' | 'revocado' | 'pendiente'
export async function registrarConsentimiento(claseId, estId, estadoNuevo) {
  const c = claseMutable(claseId)
  const e = c.estudiantes.find((x) => x.id === estId)
  if (!e) throw new Error('Estudiante no encontrado')
  e.consentimiento = estadoNuevo
  e.consentimientoFecha = ahora()
  persistir()
  return delay(true)
}

// ---------- Tareas ----------
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
    throw new Error(`${e.nombre} no tiene consentimiento otorgado: sus tareas están bloqueadas.`)
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

// SOLO DEMO: imita lo que enviaría el módulo del estudiante.
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
    estadoNuevo = 'hecho' // el pre-test se valida solo
  } else {
    respuesta = { items: tarea.campos.map((campo) => `(demo) Respuesta de ejemplo a "${campo}"`) }
  }
  c.entregas[tareaId] = c.entregas[tareaId] || {}
  c.entregas[tareaId][estId] = { estado: estadoNuevo, respuesta, fecha: ahora() }
  persistir()
  return delay(true)
}

// ---------- Programa ----------
export async function alternarSesionDictada(claseId, n) {
  const c = claseMutable(claseId)
  c.sesionesDictadas = c.sesionesDictadas.includes(n)
    ? c.sesionesDictadas.filter((x) => x !== n)
    : [...c.sesionesDictadas, n].sort()
  persistir()
  return delay(true)
}

// ---------- Guías y avisos ----------
export async function guardarGuia({ claseId, sesion, guia }) {
  const e = cargar()
  e.guias.unshift({ id: uid('guia'), claseId: claseId || null, sesion: sesion || null, guia, creada: ahora() })
  persistir()
  return delay(true)
}

export async function listarGuias() {
  return delay(copia(cargar().guias))
}

export async function registrarAviso({ claseId, obra, fecha, nota }) {
  if (!obra?.trim()) throw new Error('Indica la obra a la que asistirás.')
  const e = cargar()
  e.avisos.unshift({ id: uid('aviso'), claseId: claseId || null, obra: obra.trim(), fecha: fecha || null, nota: nota || '', creado: ahora() })
  persistir()
  return delay(true)
}

export async function listarAvisos() {
  return delay(copia(cargar().avisos))
}
