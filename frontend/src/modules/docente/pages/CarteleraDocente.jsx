import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import {
  listarClases,
  obtenerCarteleraEscolar,
  reservarFuncionClase,
} from '../services/clases'

export default function CarteleraDocente() {
  const [params] = useSearchParams()
  const claseInicialId = params.get('clase') || ''
  const obraInicialId = params.get('obra') || ''

  const [obras, setObras] = useState([])
  const [clases, setClases] = useState([])
  const [cargando, setCargando] = useState(true)

  // Filtros dinámicos (Captura 1)
  const [busqueda, setBusqueda] = useState('')
  const [filtroGrado, setFiltroGrado] = useState('todos')
  const [filtroTematica, setFiltroTematica] = useState('todos')
  const [filtroFecha, setFiltroFecha] = useState('todos')
  const [filtroExperiencia, setFiltroExperiencia] = useState('todos')
  const [filtroDuracion, setFiltroDuracion] = useState('todos')
  const [filtroCupos, setFiltroCupos] = useState('todos')
  const [orden, setOrden] = useState('relevantes')

  // Contexto de Clase y Reserva
  const [claseSeleccionadaId, setClaseSeleccionadaId] = useState(claseInicialId)
  const [obraParaReservar, setObraParaReservar] = useState(null)
  const [fechaSeleccionada, setFechaSeleccionada] = useState('')
  const [estudiantesSeleccionados, setEstudiantesSeleccionados] = useState({})
  const [reservaConfirmada, setReservaConfirmada] = useState(null)
  const [guardandoReserva, setGuardandoReserva] = useState(false)

  const claseActual = clases.find((c) => c.id === claseSeleccionadaId) || clases[0]
  const numEstudiantesAula = claseActual?.estudiantes?.length ?? claseActual?.students ?? 29

  const inicializarAsistentes = (cId, obra, clasesLista = clases) => {
    const claseObj = clasesLista.find((c) => c.id === cId)
    if (claseObj) {
      const checkMap = {}
      ;(claseObj.estudiantes || []).forEach((est) => {
        checkMap[est.id] = est.consentimiento === 'otorgado'
      })
      setEstudiantesSeleccionados(checkMap)
    }
    if (obra?.proximasFunciones && obra.proximasFunciones.length > 0) {
      setFechaSeleccionada(obra.proximasFunciones[0])
    }
  }

  const abrirModalReserva = (obra, classId = null, clasesLista = clases) => {
    setObraParaReservar(obra)
    setReservaConfirmada(null)
    const cId = classId || claseSeleccionadaId || (clasesLista[0] ? clasesLista[0].id : '')
    inicializarAsistentes(cId, obra, clasesLista)
  }

  useEffect(() => {
    Promise.all([obtenerCarteleraEscolar(), listarClases()]).then(([obs, cls]) => {
      setObras(obs || [])
      setClases(cls || [])
      if (!claseInicialId && cls && cls.length > 0) {
        setClaseSeleccionadaId(cls[0].id)
      }
      if (obraInicialId && obs && obs.length > 0) {
        const encontrada = obs.find((o) => o.id === obraInicialId)
        if (encontrada) {
          abrirModalReserva(encontrada, cls && cls[0] ? cls[0].id : '', cls || [])
        }
      }
      setCargando(false)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [claseInicialId, obraInicialId])

  const toggleEstudiante = (estId) => {
    setEstudiantesSeleccionados((prev) => ({
      ...prev,
      [estId]: !prev[estId],
    }))
  }

  const toggleTodosEstudiantes = (marcarTodos) => {
    if (!claseActual) return
    const nuevoMap = {}
    ;(claseActual.estudiantes || []).forEach((est) => {
      nuevoMap[est.id] = marcarTodos
    })
    setEstudiantesSeleccionados(nuevoMap)
  }

  const handleConfirmarReserva = async (e) => {
    e.preventDefault()
    if (!claseActual || !obraParaReservar) return

    const asistentesIds = Object.keys(estudiantesSeleccionados).filter(
      (id) => estudiantesSeleccionados[id],
    )
    const inasistentesNombres = (claseActual.estudiantes || [])
      .filter((est) => !estudiantesSeleccionados[est.id])
      .map((est) => est.nombre)

    if (asistentesIds.length === 0) {
      alert('Debes seleccionar al menos un estudiante asistente para completar la reserva.')
      return
    }

    setGuardandoReserva(true)
    try {
      const res = await reservarFuncionClase({
        claseId: claseActual.id,
        obra: obraParaReservar.titulo,
        fecha: fechaSeleccionada,
        teatro: obraParaReservar.lugarCorto || obraParaReservar.lugar,
        estudiantesIds: asistentesIds,
        inasistentesNombres,
      })
      setReservaConfirmada(res)
    } catch (err) {
      alert('Error al reservar función: ' + err.message)
    } finally {
      setGuardandoReserva(false)
    }
  }

  if (cargando) return <Loading mensaje="Cargando cartelera teatral escolar..." />

  // Filtrado reactivo de obras
  const obrasFiltradas = obras
    .filter((obra) => {
      // 1. Búsqueda por texto
      if (busqueda.trim()) {
        const q = busqueda.toLowerCase().trim()
        const matchTitulo = obra.titulo.toLowerCase().includes(q)
        const matchTema = obra.tematica.toLowerCase().includes(q)
        const matchSinopsis = (obra.sinopsis || '').toLowerCase().includes(q)
        const matchCneb = (obra.competenciaCneb || '').toLowerCase().includes(q)
        if (!matchTitulo && !matchTema && !matchSinopsis && !matchCneb) return false
      }

      // 2. Filtro Grado
      if (filtroGrado !== 'todos') {
        const gNum = filtroGrado
        if (!obra.grados.includes(gNum)) return false
      }

      // 3. Filtro Temática
      if (filtroTematica !== 'todos') {
        if (obra.tematica !== filtroTematica) return false
      }

      // 4. Filtro Duración
      if (filtroDuracion === 'corta' && obra.duracionMinutos > 60) return false
      if (filtroDuracion === 'media' && (obra.duracionMinutos <= 60 || obra.duracionMinutos > 80))
        return false

      // 5. Filtro Cupos
      if (filtroCupos === 'aula' && (obra.cuposDisponibles ?? 100) < numEstudiantesAula) {
        return false
      }

      return true
    })
    .sort((a, b) => {
      if (orden === 'relevantes') {
        if (a.recomendada && !b.recomendada) return -1
        if (!a.recomendada && b.recomendada) return 1
      }
      if (orden === 'cupos') {
        return (b.cuposDisponibles ?? 0) - (a.cuposDisponibles ?? 0)
      }
      return 0
    })

  const estudiantesTotales = claseActual?.estudiantes || []
  const asistentesCount = Object.values(estudiantesSeleccionados).filter(Boolean).length
  const inasistentesCount = estudiantesTotales.length - asistentesCount
  const costoTotal = (obraParaReservar?.precioEscolar || 0) * asistentesCount

  return (
    <div className="dc-cartelera-view space-y-6 animate-fade-in max-w-7xl mx-auto pb-12">
      {/* 1. Encabezado de la Página (Captura 1) */}
      <header className="dc-cartelera-header">
        <span className="text-rose-600 font-extrabold text-xs tracking-wider uppercase block">
          MEDIACIÓN ESCÉNICA
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Cartelera escolar
        </h1>
        <p className="mt-1.5 text-sm sm:text-base text-slate-600">
          Encuentra obras y funciones pertinentes para tu grupo. El contexto de la sección se mantiene al explorar.
        </p>
      </header>

      {/* 2. Banner Contextual: Recomendaciones Para... (Captura 1) */}
      <section className="bg-[#f0efff] border border-[#dedbf5] rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-white text-indigo-700 flex items-center justify-center flex-shrink-0 shadow-sm border border-indigo-100 font-bold">
            <Icon name="users" size={20} />
          </div>
          <div>
            <span className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              RECOMENDACIONES PARA
            </span>
            <strong className="text-sm sm:text-base font-extrabold text-slate-900 block mt-0.5">
              Personalizamos temas, grados y cupos
            </strong>
          </div>
        </div>

        <div className="sm:w-64">
          <select
            aria-label="Seleccionar aula del curso"
            value={claseSeleccionadaId}
            onChange={(e) => {
              const val = e.target.value
              setClaseSeleccionadaId(val)
              if (obraParaReservar) {
                inicializarAsistentes(val, obraParaReservar)
              }
            }}
            className="w-full bg-white border border-slate-300 rounded-xl px-3.5 py-2 text-sm font-semibold text-slate-800 shadow-sm focus:border-indigo-600 focus:outline-none cursor-pointer transition"
          >
            {clases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subject} · {c.grade} {c.section}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* 3. Barra de Búsqueda y Filtros Múltiples (Captura 1) */}
      <section className="space-y-3">
        {/* Input de Búsqueda */}
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar por título o tema..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm text-slate-900 placeholder:text-slate-400 shadow-sm focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition"
          />
          <span className="absolute left-3.5 top-3.5 text-slate-400 pointer-events-none flex items-center">
            <Icon name="search" size={18} />
          </span>
          {busqueda && (
            <button
              type="button"
              onClick={() => setBusqueda('')}
              className="absolute right-3.5 top-3.5 text-xs text-slate-400 hover:text-slate-700 font-bold"
            >
              ✕
            </button>
          )}
        </div>

        {/* Fila de 6 Dropdowns Selectores (Captura 1) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {/* 1. Grados */}
          <select
            value={filtroGrado}
            onChange={(e) => setFiltroGrado(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todos los grados</option>
            <option value="1">1.º secundaria</option>
            <option value="2">2.º secundaria</option>
            <option value="3">3.º secundaria</option>
            <option value="4">4.º secundaria</option>
            <option value="5">5.º secundaria</option>
          </select>

          {/* 2. Temáticas */}
          <select
            value={filtroTematica}
            onChange={(e) => setFiltroTematica(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todas las temáticas</option>
            <option value="Convivencia escolar">Convivencia escolar</option>
            <option value="Identidad y autoestima">Identidad y autoestima</option>
            <option value="Comunidad y ambiente">Comunidad y ambiente</option>
          </select>

          {/* 3. Fechas */}
          <select
            value={filtroFecha}
            onChange={(e) => setFiltroFecha(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todas las fechas</option>
            <option value="semana">Esta semana</option>
            <option value="15dias">Próximos 15 días</option>
            <option value="mes">Este mes</option>
          </select>

          {/* 4. Experiencias */}
          <select
            value={filtroExperiencia}
            onChange={(e) => setFiltroExperiencia(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="todos">Todas las experiencias</option>
            <option value="presencial">Función presencial</option>
            <option value="taller">Taller de mediación</option>
            <option value="elenco">Encuentro con elenco</option>
          </select>

          {/* 5. Duración */}
          <select
            value={filtroDuracion}
            onChange={(e) => setFiltroDuracion(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="todos">Toda duración</option>
            <option value="corta">Hasta 60 min</option>
            <option value="media">60 a 80 min</option>
          </select>

          {/* 6. Cupos según el aula */}
          <select
            value={filtroCupos}
            onChange={(e) => setFiltroCupos(e.target.value)}
            className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 shadow-sm focus:border-indigo-600 focus:outline-none cursor-pointer"
          >
            <option value="todos">Cupos para {numEstudiantesAula}</option>
            <option value="aula">Disponibilidad total</option>
          </select>
        </div>
      </section>

      {/* 4. Barra de Conteo y Orden (Captura 1) */}
      <div className="flex items-center justify-between pt-2">
        <span className="text-sm text-slate-600">
          <strong className="text-slate-900 font-extrabold">{obrasFiltradas.length} obras</strong>{' '}
          encontradas
        </span>

        <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
          <span>Orden:</span>
          <select
            value={orden}
            onChange={(e) => setOrden(e.target.value)}
            className="bg-transparent font-bold text-slate-900 border-0 focus:outline-none cursor-pointer pr-1"
          >
            <option value="relevantes">Más relevantes</option>
            <option value="cupos">Mayor disponibilidad</option>
          </select>
        </div>
      </div>

      {/* 5. Grilla de Tarjetas de Obras Teatrales (Captura 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
        {obrasFiltradas.map((obra) => {
          return (
            <article
              key={obra.id}
              className="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* Banner con degradado, halo concéntrico y rostro teatral [:)] */}
                <div
                  className="h-52 sm:h-56 relative overflow-hidden flex items-center justify-center text-white p-6"
                  style={{ background: obra.gradiente }}
                >
                  {/* Halos circulares concéntricos */}
                  <div className="absolute w-44 h-44 rounded-full border border-white/20 pointer-events-none" />
                  <div className="absolute w-64 h-64 rounded-full border border-white/10 pointer-events-none" />

                  {/* Rostro teatral sonriente blanco */}
                  <div className="relative z-10 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/15 backdrop-blur-sm border border-white/25 flex items-center justify-center shadow-inner">
                      <svg
                        width="44"
                        height="44"
                        viewBox="0 0 44 44"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        aria-hidden="true"
                      >
                        <circle cx="15" cy="18" r="2.8" fill="white" />
                        <circle cx="29" cy="18" r="2.8" fill="white" />
                        <path
                          d="M14 27C17 33 27 33 30 27"
                          stroke="white"
                          strokeWidth="3.2"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  {/* Badge Recomendada (si aplica) */}
                  {obra.recomendada && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur px-3 py-1.5 rounded-full text-indigo-950 text-xs font-extrabold shadow-sm flex items-center gap-1.5">
                      <span className="text-indigo-600">✨</span> Recomendada
                    </div>
                  )}
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6">
                  {/* Etiquetas temáticas y duración */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {obra.tematica}
                    </span>
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">
                      {obra.edadSugerida} · {obra.duracionTexto}
                    </span>
                  </div>

                  {/* Título y Grados */}
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-3 tracking-tight">
                    {obra.titulo}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium mt-1">
                    Grados sugeridos: {obra.gradosSugeridosTexto || obra.grados}
                  </p>

                  {/* Recuadro lila "Por qué te la recomendamos" (Captura 2) */}
                  {obra.porQueRecomendada && (
                    <div className="bg-[#f0efff] border border-[#dedbf5] rounded-2xl p-4 mt-4 text-left">
                      <strong className="text-xs font-extrabold text-slate-900 block">
                        Por qué te la recomendamos
                      </strong>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {obra.porQueRecomendada}
                      </p>
                    </div>
                  )}

                  {/* Metadatos: Próxima función, Lugar y Disponibilidad */}
                  <div className="grid grid-cols-2 gap-4 mt-5 pt-4 border-t border-slate-100 text-left">
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        PRÓXIMA FUNCIÓN
                      </span>
                      <strong className="block text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5">
                        {obra.proximaFuncionTexto || obra.proximasFunciones[0]}
                      </strong>
                    </div>
                    <div>
                      <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        LUGAR
                      </span>
                      <strong className="block text-xs sm:text-sm font-extrabold text-slate-900 mt-0.5 truncate">
                        {obra.lugarCorto || obra.lugar}
                      </strong>
                    </div>
                  </div>

                  <div className="mt-3.5 text-left">
                    <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                      DISPONIBILIDAD
                    </span>
                    <strong className="block text-xs sm:text-sm font-extrabold text-emerald-600 mt-0.5">
                      {obra.cuposDisponibles || obra.aforoTotal - obra.aforoReservado} cupos
                    </strong>
                  </div>
                </div>
              </div>

              {/* Botón de Acción Principal Rojo (Captura 2) */}
              <div className="px-6 pb-6">
                <button
                  type="button"
                  onClick={() => abrirModalReserva(obra)}
                  className="w-full bg-rose-600 hover:bg-rose-700 text-white font-bold py-3 px-5 rounded-2xl transition shadow-sm text-center flex items-center justify-center gap-1.5"
                >
                  <span>Ver obra y funciones</span>
                  <span className="text-sm font-extrabold">→</span>
                </button>
              </div>
            </article>
          )
        })}
      </div>

      {/* ============================================================== */}
      {/* 6. MODAL INTERACTIVO DE RESERVA DE FUNCIONES                   */}
      {/* ============================================================== */}
      {obraParaReservar && (
        <div
          className="dc-modal-overlay"
          onClick={() => setObraParaReservar(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="dc-modal-card is-wide max-w-2xl w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dc-modal-header border-b border-slate-200 pb-3">
              <div>
                <span className="dc-modal-tag text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  RESERVA DE FUNCIÓN ESCOLAR
                </span>
                <h3 className="dc-modal-title text-xl font-extrabold text-slate-900 mt-0.5">
                  {obraParaReservar.titulo}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  {obraParaReservar.lugarCorto || obraParaReservar.lugar} · Tarifa:{' '}
                  {obraParaReservar.becasDisponibles
                    ? 'Beca Scenia disponible (S/ 0 - S/ 10)'
                    : `S/ ${obraParaReservar.precioEscolar} por estudiante`}
                </p>
              </div>
              <button
                type="button"
                className="dc-modal-close-btn text-slate-400 hover:text-slate-600 text-lg p-1"
                onClick={() => setObraParaReservar(null)}
              >
                ✕
              </button>
            </div>

            {!reservaConfirmada ? (
              <form onSubmit={handleConfirmarReserva} className="p-6 space-y-5 text-left">
                {/* Paso 1: Selectores de Curso y Función */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Aula / Curso de destino
                    </label>
                    <select
                      className="w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                      value={claseSeleccionadaId}
                      onChange={(e) => {
                        const val = e.target.value
                        setClaseSeleccionadaId(val)
                        inicializarAsistentes(val, obraParaReservar)
                      }}
                      required
                    >
                      {clases.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.subject} · {c.grade} {c.section} ({c.students || c.resumen?.estudiantes} alumnos)
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                      Fecha y Horario de Función
                    </label>
                    <select
                      className="w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                      value={fechaSeleccionada}
                      onChange={(e) => setFechaSeleccionada(e.target.value)}
                      required
                    >
                      {(obraParaReservar.proximasFunciones || []).map((f, fIdx) => (
                        <option key={fIdx} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Paso 2: Nómina con Desmarcado de Inasistentes */}
                <div className="border border-slate-200 rounded-2xl p-4 bg-slate-50/50 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">
                        Confirmar Asistencia de Estudiantes
                      </h4>
                      <p className="text-xs text-slate-500">
                        Desmarca a los alumnos que no asistirán por permiso médico o inasistencia.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="text-xs font-bold text-indigo-700 hover:text-indigo-900"
                        onClick={() => toggleTodosEstudiantes(true)}
                      >
                        Marcar todos
                      </button>
                      <span className="text-slate-300">|</span>
                      <button
                        type="button"
                        className="text-xs font-bold text-slate-500 hover:text-slate-700"
                        onClick={() => toggleTodosEstudiantes(false)}
                      >
                        Desmarcar todos
                      </button>
                    </div>
                  </div>

                  <div className="max-h-52 overflow-y-auto space-y-1.5 pr-1 border-t border-slate-200 pt-2">
                    {estudiantesTotales.map((est) => {
                      const estaMarcado = !!estudiantesSeleccionados[est.id]
                      const sinConsentimiento = est.consentimiento !== 'otorgado'

                      return (
                        <label
                          key={est.id}
                          className={`flex items-center justify-between p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                            estaMarcado
                              ? 'bg-white border-indigo-200 shadow-xs'
                              : 'bg-slate-100/70 border-slate-200 text-slate-400'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="checkbox"
                              checked={estaMarcado}
                              onChange={() => toggleEstudiante(est.id)}
                              className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                            />
                            <strong className={estaMarcado ? 'text-slate-900' : 'text-slate-400'}>
                              {est.nombre}
                            </strong>
                            <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1 py-0.5 rounded">
                              {est.codigo || 'SMP-3B-01'}
                            </span>
                          </div>

                          {sinConsentimiento && (
                            <span className="text-[10px] font-semibold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              Consentimiento pendiente
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                </div>

                {/* Resumen de Liquidación de la Reserva */}
                <div className="bg-slate-100/70 rounded-xl p-3.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 block">Estudiantes confirmados:</span>
                    <strong className="text-slate-900 font-extrabold text-sm">
                      {asistentesCount} asistentes{' '}
                      <span className="text-slate-400 font-normal">
                        ({inasistentesCount} ausentes)
                      </span>
                    </strong>
                  </div>
                  <div className="text-right">
                    <span className="text-slate-500 block">Costo estimado:</span>
                    <strong className="text-rose-600 font-extrabold text-sm">
                      S/ {costoTotal}{' '}
                      {obraParaReservar.becasDisponibles && (
                        <span className="text-[10px] text-emerald-700 block font-normal">
                          (Subsidio aplicable)
                        </span>
                      )}
                    </strong>
                  </div>
                </div>

                {/* Botones del Modal */}
                <div className="pt-2 border-t border-slate-200 flex justify-end gap-3">
                  <button
                    type="button"
                    className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
                    onClick={() => setObraParaReservar(null)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={guardandoReserva || asistentesCount === 0}
                    className="px-5 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition disabled:opacity-50"
                  >
                    {guardandoReserva
                      ? 'Procesando reserva...'
                      : `Confirmar Reserva (${asistentesCount} butacas)`}
                  </button>
                </div>
              </form>
            ) : (
              /* Pantalla de Confirmación Exitosa */
              <div className="p-8 text-center space-y-4">
                <div className="text-4xl">🎉</div>
                <h3 className="text-xl font-black text-slate-900">
                  ¡Reserva Confirmada con Éxito!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto">
                  Hemos reservado{' '}
                  <strong className="text-slate-900">
                    {reservaConfirmada.asistentesConfirmados} butacas
                  </strong>{' '}
                  para el curso{' '}
                  <strong className="text-slate-900">
                    {claseActual?.subject} {claseActual?.grade} {claseActual?.section}
                  </strong>{' '}
                  en la función seleccionada.
                </p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 max-w-sm mx-auto text-left space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Código de Reserva:</span>
                    <strong className="font-mono text-indigo-700 font-bold">
                      {reservaConfirmada.codigoReserva}
                    </strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Obra:</span>
                    <strong className="text-slate-800 font-bold">{reservaConfirmada.obra}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Lugar:</span>
                    <strong className="text-slate-800 font-bold">{reservaConfirmada.teatro}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Fecha:</span>
                    <strong className="text-slate-800 font-bold">{reservaConfirmada.fecha}</strong>
                  </div>
                </div>

                <div className="pt-4 flex flex-col sm:flex-row justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => window.print()}
                    className="px-4 py-2.5 text-xs font-bold border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-700 transition"
                  >
                    🖨️ Imprimir pase escolar
                  </button>
                  <Link
                    to={`/docente/clases/${claseActual?.id}`}
                    className="px-5 py-2.5 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl shadow-sm transition inline-flex items-center justify-center gap-1.5"
                  >
                    Ir al Aula y Notificar en el Muro →
                  </Link>
                  <button
                    type="button"
                    onClick={() => setObraParaReservar(null)}
                    className="px-4 py-2.5 text-xs font-bold text-slate-500 hover:text-slate-700 transition"
                  >
                    Volver a la cartelera
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
