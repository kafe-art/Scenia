import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  CARTELERA_ESTUDIANTE,
  obtenerDashboardEstudiante,
  toggleMeInteresaObra,
  proponerObraADocente,
} from '../services/estudianteStore'

export default function CarteleraEstudiante() {
  const navigate = useNavigate()
  const [obras, setObras] = useState(CARTELERA_ESTUDIANTE)
  const [obrasInteres, setObrasInteres] = useState(['otras-voces'])
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroTematica, setFiltroTematica] = useState('todas')
  const [filtroEdad, setFiltroEdad] = useState('todas')
  const [filtroPrecio, setFiltroPrecio] = useState('todos')

  // Modales
  const [modalProponer, setModalProponer] = useState(null)
  const [mensajePropuesta, setMensajePropuesta] = useState('')
  const [enviandoPropuesta, setEnviandoPropuesta] = useState(false)
  const [modalComoAsistir, setModalComoAsistir] = useState(null)
  const [toastMensaje, setToastMensaje] = useState(null)

  useEffect(() => {
    async function cargar() {
      const data = await obtenerDashboardEstudiante()
      // cargar intereses
      try {
        const raw = window.localStorage.getItem('scenia.estudiante.v2')
        if (raw) {
          const parsed = JSON.parse(raw)
          if (parsed.obrasInteres) setObrasInteres(parsed.obrasInteres)
        }
      } catch {
        /* fallback */
      }
    }
    cargar()
  }, [])

  const mostrarToast = (msg) => {
    setToastMensaje(msg)
    setTimeout(() => setToastMensaje(null), 3500)
  }

  const handleToggleInteres = async (obraId) => {
    const estadoNuevo = await toggleMeInteresaObra(obraId)
    if (estadoNuevo) {
      setObrasInteres((prev) => [...prev, obraId])
      mostrarToast('Obra agregada a tu lista de interés ⭐')
    } else {
      setObrasInteres((prev) => prev.filter((id) => id !== obraId))
      mostrarToast('Obra retirada de tu lista')
    }
  }

  const abrirModalProponer = (obra) => {
    setModalProponer(obra)
    setMensajePropuesta(
      `Hola profesora Carla, me gustaría proponer la obra "${obra.titulo}" para nuestro curso de Comunicación. Aborda temas muy cercanos a lo que venimos trabajando.`
    )
  }

  const enviarPropuestaConfirmada = async () => {
    if (!modalProponer) return
    setEnviandoPropuesta(true)
    try {
      await proponerObraADocente({
        obraId: modalProponer.id,
        mensaje: mensajePropuesta,
      })
      mostrarToast(`¡Propuesta enviada al muro de Comunicación 3.º B!`)
      setModalProponer(null)
    } finally {
      setEnviandoPropuesta(false)
    }
  }

  const obrasFiltradas = obras.filter((obra) => {
    if (filtroTexto.trim()) {
      const q = filtroTexto.toLowerCase()
      const matchTitulo = obra.titulo.toLowerCase().includes(q)
      const matchDesc = obra.descripcion.toLowerCase().includes(q)
      const matchTema = obra.tematica.toLowerCase().includes(q)
      if (!matchTitulo && !matchDesc && !matchTema) return false
    }

    if (filtroTematica !== 'todas') {
      if (obra.tematica.toLowerCase() !== filtroTematica.toLowerCase()) return false
    }

    if (filtroEdad !== 'todas') {
      if (obra.edadSugerida !== filtroEdad) return false
    }

    if (filtroPrecio === 'gratis' && obra.proximaFuncion.precioNumero !== 0) return false
    if (filtroPrecio === 'hasta15' && obra.proximaFuncion.precioNumero > 15) return false
    if (filtroPrecio === 'mas15' && obra.proximaFuncion.precioNumero <= 15) return false

    return true
  })

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      {/* Toast Notification */}
      {toastMensaje && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-medium">{toastMensaje}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Cartelera escolar
        </h1>
        <p className="mt-2 text-slate-600 text-base max-w-3xl leading-relaxed">
          Explora las obras recomendadas para tu grado y colegio. Puedes guardarlas en tu
          lista o proponerlas a tu docente para ir con el salón.
        </p>
      </div>

      {/* Barra de Filtros */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm mb-8 flex flex-col md:flex-row gap-3 items-stretch md:items-center">
        {/* Buscador */}
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-slate-400 text-sm">
            🔍
          </span>
          <input
            type="text"
            className="w-full pl-9 pr-4 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-rose-500 text-slate-800"
            placeholder="Buscar obra, temática..."
            value={filtroTexto}
            onChange={(e) => setFiltroTexto(e.target.value)}
          />
        </div>

        {/* Selector de Temática */}
        <select
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          value={filtroTematica}
          onChange={(e) => setFiltroTematica(e.target.value)}
        >
          <option value="todas">Todas las temáticas</option>
          <option value="convivencia">Convivencia</option>
          <option value="identidad">Identidad</option>
          <option value="ambiente">Ambiente</option>
        </select>

        {/* Selector de Edades */}
        <select
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          value={filtroEdad}
          onChange={(e) => setFiltroEdad(e.target.value)}
        >
          <option value="todas">Todas las edades</option>
          <option value="10+">10+ años</option>
          <option value="12+">12+ años</option>
        </select>

        {/* Selector de Precio */}
        <select
          className="px-3 py-2 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-rose-500"
          value={filtroPrecio}
          onChange={(e) => setFiltroPrecio(e.target.value)}
        >
          <option value="todos">Cualquier precio</option>
          <option value="gratis">Ingreso libre</option>
          <option value="hasta15">Hasta S/ 15</option>
          <option value="mas15">Más de S/ 15</option>
        </select>
      </div>

      {/* Lista de Obras */}
      <div className="space-y-6">
        {obrasFiltradas.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center">
            <span className="text-4xl block mb-2">🎭</span>
            <h3 className="text-lg font-bold text-slate-800">No encontramos obras con esos filtros</h3>
            <p className="text-sm text-slate-500 mt-1">
              Prueba cambiando la temática o el buscador para ver más opciones en cartelera.
            </p>
          </div>
        ) : (
          obrasFiltradas.map((obra) => {
            const esInteres = obrasInteres.includes(obra.id)
            const esExperienciaCurso = obra.id === 'otras-voces'

            return (
              <div
                key={obra.id}
                className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col md:flex-row gap-6 items-start"
              >
                {/* Imagen / Afiche */}
                <div className="w-full md:w-56 h-48 md:h-44 rounded-2xl overflow-hidden bg-slate-100 flex-shrink-0 relative">
                  <img
                    src={obra.imagen}
                    alt={obra.titulo}
                    className="w-full h-full object-cover"
                  />
                  {esExperienciaCurso && (
                    <span className="absolute top-3 left-3 bg-emerald-600 text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
                      Experiencia de tu curso
                    </span>
                  )}
                </div>

                {/* Contenido */}
                <div className="flex-1 flex flex-col justify-between h-full">
                  <div>
                    {/* Título y Metadatos */}
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {obra.tematica}
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                        {obra.edadSugerida} sugerida
                      </span>
                      <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-700">
                        {obra.proximaFuncion.precioTexto}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">
                        ⏱️ {obra.duracionTexto}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                      {obra.titulo}
                    </h2>

                    <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                      {obra.descripcion}
                    </p>

                    {/* Próxima función */}
                    <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                      <span>📍 {obra.proximaFuncion.lugar}</span>
                      <span>📅 {obra.proximaFuncion.fechaTexto}</span>
                    </div>
                  </div>

                  {/* Botones de Acción (Fieles a Capturas 10 y 11) */}
                  <div className="mt-5 pt-4 border-t border-slate-100 flex flex-wrap items-center gap-3">
                    {/* Botón Me interesa */}
                    <button
                      type="button"
                      onClick={() => handleToggleInteres(obra.id)}
                      className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition ${
                        esInteres
                          ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      {esInteres ? '✓ Guardada en Me interesa' : '☆ Me interesa'}
                    </button>

                    {/* Botón Proponer a mi docente */}
                    <button
                      type="button"
                      onClick={() => abrirModalProponer(obra)}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition shadow-sm"
                    >
                      <span>📣</span>
                      Proponer a mi docente
                    </button>

                    {/* Enlace Cómo asistir por mi cuenta */}
                    <button
                      type="button"
                      onClick={() => setModalComoAsistir(obra)}
                      className="text-xs font-semibold text-slate-500 hover:text-rose-600 underline underline-offset-2 ml-auto"
                    >
                      ¿Cómo asistir por mi cuenta?
                    </button>
                  </div>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Modal: Proponer a mi docente */}
      {modalProponer && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalProponer(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-rose-600 bg-rose-50 px-2.5 py-0.5 rounded-full">
                  Propuesta escolar
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  Proponer a Carla Mendoza
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Curso: Comunicación · 3.º B · I.E. San Miguel
                </p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                onClick={() => setModalProponer(null)}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 bg-slate-50 p-3.5 rounded-2xl border border-slate-200 flex items-center gap-3">
              <span className="text-2xl">🎭</span>
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {modalProponer.titulo}
                </h4>
                <p className="text-xs text-slate-500">
                  {modalProponer.tematica} · {modalProponer.proximaFuncion.precioTexto} ·{' '}
                  {modalProponer.proximaFuncion.lugar}
                </p>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mensaje para tu docente
              </label>
              <textarea
                rows={4}
                className="w-full text-sm p-3 rounded-2xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800"
                value={mensajePropuesta}
                onChange={(e) => setMensajePropuesta(e.target.value)}
                placeholder="Explica brevemente por qué te gustaría ver esta obra con el curso..."
              />
              <p className="text-xs text-slate-400 mt-1">
                Este mensaje se publicará como sugerencia en el muro del curso para que la
                docente pueda evaluar la reserva escolar.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                onClick={() => setModalProponer(null)}
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={enviandoPropuesta}
                onClick={enviarPropuestaConfirmada}
                className="px-5 py-2.5 text-xs font-bold bg-rose-600 text-white rounded-xl hover:bg-rose-700 transition disabled:opacity-50"
              >
                {enviandoPropuesta ? 'Publicando...' : 'Enviar propuesta ›'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Cómo asistir por mi cuenta */}
      {modalComoAsistir && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalComoAsistir(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                  Guía para el estudiante y familia
                </span>
                <h3 className="text-lg font-bold text-slate-900 mt-2">
                  ¿Cómo asistir por mi cuenta?
                </h3>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                onClick={() => setModalComoAsistir(null)}
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3.5 text-sm text-slate-600">
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3 items-start">
                <span className="text-xl">🎟️</span>
                <div>
                  <strong className="block text-slate-900 font-bold text-xs uppercase tracking-wide">
                    1. Entradas y funciones
                  </strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Puedes consultar los horarios y comprar tus boletos directamente en la
                    boletería de <strong>{modalComoAsistir.proximaFuncion.lugar}</strong> o a
                    través de sus canales oficiales.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 flex gap-3 items-start">
                <span className="text-xl">👨‍👩‍👧</span>
                <div>
                  <strong className="block text-slate-900 font-bold text-xs uppercase tracking-wide">
                    2. Acompañamiento responsable
                  </strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Como estudiante de secundaria, te recomendamos asistir en compañía de
                    tu apoderado, familiares o amigos para enriquecer la conversación
                    posterior.
                  </p>
                </div>
              </div>

              <div className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex gap-3 items-start text-amber-900">
                <span className="text-xl">🏆</span>
                <div>
                  <strong className="block font-bold text-xs uppercase tracking-wide">
                    3. Suma a tu historial cultural escolar
                  </strong>
                  <p className="text-xs mt-0.5">
                    Al terminar la obra, ingresa a tu sección de{' '}
                    <strong>Mi historial y logros</strong> y presiona "Registrar visita
                    personal". ¡Esto sumará puntos hacia tu insignia de Explorador Cultural!
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                onClick={() => setModalComoAsistir(null)}
              >
                Entendido
              </button>
              <button
                type="button"
                onClick={() => {
                  setModalComoAsistir(null)
                  navigate('/estudiante/logros')
                }}
                className="px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Ir a registrar visita ›
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
