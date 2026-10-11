import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import { Icon, PageHeading } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import useClase from '../hooks/useClase'
import NominaTab from '../components/NominaTab'
import TemarioCneb from '../components/TemarioCneb'
import GenerarGuiaModal from '../components/GenerarGuiaModal'
import KitPedagogico from '../components/KitPedagogico'
import ActivitySubmissionsModal from '../components/ActivitySubmissionsModal'
import {
  listarClases,
  obtenerObrasRecomendadasParaClase,
  vincularObraAClase,
  actualizarInteresesClase,
} from '../services/clases'

export default function DetalleClase({ defaultTab = 'resumen' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { clase, cargando, error, ejecutar } = useClase(id)

  const [todasClases, setTodasClases] = useState([])
  const [tab, setTab] = useState(defaultTab) // 'resumen' | 'experiencias' | 'guias' | 'estudiantes' | 'kit'
  const [mostrarCatalogo, setMostrarCatalogo] = useState(false)
  const [modalGuiaIA, setModalGuiaIA] = useState(false)
  const [modalEditarContexto, setModalEditarContexto] = useState(false)
  const [modalEntregas, setModalEntregas] = useState(false)
  const [busquedaObra, setBusquedaObra] = useState('')
  const [contextoForm, setContextoForm] = useState({ topic: '', intereses: '' })
  const [temaAsignadoObra, setTemaAsignadoObra] = useState('')
  const [modalFechaEntrega, setModalFechaEntrega] = useState(false)
  const [fechaEntrega, setFechaEntrega] = useState('2026-05-24')
  const [mostrarCneb, setMostrarCneb] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    listarClases().then((list) => setTodasClases(list || []))
  }, [])

  const handleAbrirEditarContexto = () => {
    setContextoForm({
      topic: clase?.topic || 'Convivencia escolar',
      intereses: clase?.intereses || 'Debate, identidad cultural y creación audiovisual',
    })
    setModalEditarContexto(true)
  }

  if (cargando) return <Loading mensaje="Cargando aula del curso..." />
  if (!clase) {
    return (
      <PageHeading
        title="Curso no encontrado"
        action={<Link to="/docente">Volver a Inicio</Link>}
      />
    )
  }

  const obrasRecomendadas = obtenerObrasRecomendadasParaClase(clase)
  const obrasFiltradas = obrasRecomendadas.filter((o) => {
    if (!busquedaObra.trim()) return true
    const q = busquedaObra.toLowerCase()
    return (
      o.titulo.toLowerCase().includes(q) ||
      o.tematica.toLowerCase().includes(q) ||
      o.justificacion.toLowerCase().includes(q)
    )
  })

  const handleCambiarSeccion = (nuevaId) => {
    navigate(`/docente/clases/${nuevaId}`)
  }

  const handleGuardarContexto = async (e) => {
    e.preventDefault()
    try {
      await ejecutar(actualizarInteresesClase, clase.id, contextoForm)
      setModalEditarContexto(false)
      showToast('¡Contexto de la sección actualizado correctamente!')
    } catch {
      showToast('Error al actualizar el contexto.')
    }
  }

  const handleVincularObra = async (obra) => {
    try {
      await ejecutar(vincularObraAClase, clase.id, obra.titulo)
      showToast(`¡"${obra.titulo}" fue seleccionada para ${clase.subject} ${clase.section}!`)
    } catch {
      showToast('Error al vincular la obra.')
    }
  }

  const numEstudiantes = clase.estudiantes?.length ?? clase.students ?? 28

  return (
    <div className="dc-detalle-clase-v3">
      {/* Toast Flotante */}
      {toast && (
        <div className="dc-floating-toast" role="alert">
          <Icon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Enlace Volver a Inicio */}
      <div className="dc-back-to-home-bar">
        <Link to="/docente" className="dc-link-back-home">
          ← Volver a Inicio
        </Link>
      </div>

      {/* Gran Banner Morado del Curso Activo (Captura 2) */}
      <section className="dc-active-course-banner">
        <div className="dc-course-banner-details">
          <span className="dc-active-course-tag">CURSO ACTIVO</span>
          <h1 className="dc-active-course-title">{clase.subject}</h1>
          <p className="dc-active-course-meta">
            {clase.grade} de secundaria · Sección {clase.section} · {numEstudiantes} estudiantes
          </p>
        </div>

        {/* Selector de Sección a la derecha */}
        <div className="dc-course-switcher-wrapper">
          <select
            className="dc-course-switcher-select"
            value={clase.id}
            onChange={(e) => handleCambiarSeccion(e.target.value)}
            aria-label="Cambiar sección activa"
          >
            {todasClases.map((c) => (
              <option key={c.id} value={c.id}>
                {c.subject} · {c.grade} {c.section}
              </option>
            ))}
          </select>
        </div>
      </section>

      {/* Barra de Pestañas (Captura 2 & 5) */}
      <nav className="dc-course-tabs-nav" aria-label="Secciones del curso">
        <button
          type="button"
          className={`dc-tab-nav-btn ${tab === 'resumen' ? 'is-active' : ''}`}
          onClick={() => {
            setTab('resumen')
            setMostrarCatalogo(false)
          }}
        >
          Resumen
        </button>
        <button
          type="button"
          className={`dc-tab-nav-btn ${tab === 'experiencias' || tab === 'kit' ? 'is-active' : ''}`}
          onClick={() => {
            setTab('experiencias')
            setMostrarCatalogo(false)
          }}
        >
          Experiencias teatrales
        </button>
        <button
          type="button"
          className={`dc-tab-nav-btn ${tab === 'guias' ? 'is-active' : ''}`}
          onClick={() => {
            setTab('guias')
            setMostrarCatalogo(false)
          }}
        >
          Guías y actividades
        </button>
        <button
          type="button"
          className={`dc-tab-nav-btn ${tab === 'estudiantes' ? 'is-active' : ''}`}
          onClick={() => {
            setTab('estudiantes')
            setMostrarCatalogo(false)
          }}
        >
          Estudiantes
        </button>
      </nav>

      {error && <div className="dc-error-msg">{error}</div>}

      {/* ============================================================== */}
      {/* 1. PESTAÑA: RESUMEN (Capturas 2 y 3)                           */}
      {/* ============================================================== */}
      {tab === 'resumen' && (
        <div className="dc-course-overview-layout animate-fade-in">
          {/* Columna Izquierda: Contexto de la sección y Pendientes */}
          <div className="dc-overview-col-left">
            {/* Tarjeta: Contexto de la sección */}
            <div className="dc-white-panel-card">
              <div className="dc-panel-header-with-action">
                <div>
                  <h3 className="dc-panel-heading">Contexto de la sección</h3>
                  <p className="dc-panel-subheading">
                    Esta información personaliza las recomendaciones y guías.
                  </p>
                </div>
                <button
                  type="button"
                  className="dc-btn-edit-pencil"
                  onClick={handleAbrirEditarContexto}
                >
                  <span className="dc-pencil-icon">✏️</span>
                  <span>Editar</span>
                </button>
              </div>

              <div className="dc-context-grid-2x2">
                <div className="dc-context-item">
                  <span className="dc-context-label">TEMA ACTUAL</span>
                  <strong className="dc-context-value">{clase.topic || 'Convivencia escolar'}</strong>
                </div>

                <div className="dc-context-item">
                  <span className="dc-context-label">INTERESES DEL GRUPO</span>
                  <strong className="dc-context-value">
                    {clase.intereses || 'Debate, identidad cultural y creación audiovisual'}
                  </strong>
                </div>

                <div className="dc-context-item">
                  <span className="dc-context-label">GRADO Y SECCIÓN</span>
                  <strong className="dc-context-value">
                    {clase.grade} de secundaria · {clase.section}
                  </strong>
                </div>

                <div className="dc-context-item">
                  <span className="dc-context-label">ESTUDIANTES</span>
                  <strong className="dc-context-value">{numEstudiantes} registrados</strong>
                </div>
              </div>
            </div>

            {/* Tarjeta: Pendientes del curso (Captura 3) */}
            <div className="dc-white-panel-card dc-pending-tasks-panel">
              <h3 className="dc-panel-heading">Pendientes del curso</h3>
              <p className="dc-panel-subheading">Acciones concretas que requieren tu atención.</p>

              <div className="dc-pending-items-list">
                <div
                  className="dc-pending-item-box cursor-pointer hover:border-indigo-400 transition"
                  onClick={() => setModalEntregas(true)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="dc-pending-icon-box bg-purple">
                    <Icon name="book" size={18} />
                  </div>
                  <div className="flex-1">
                    <strong className="dc-pending-item-title">4 entregas por revisar</strong>
                    <p className="dc-pending-item-sub">Actividad "Mi voz en el grupo"</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700">Ver →</span>
                </div>

                <div
                  className="dc-pending-item-box cursor-pointer hover:border-indigo-400 transition"
                  onClick={() => setModalFechaEntrega(true)}
                  role="button"
                  tabIndex={0}
                >
                  <div className="dc-pending-icon-box bg-blue">
                    <Icon name="calendar" size={18} />
                  </div>
                  <div className="flex-1">
                    <strong className="dc-pending-item-title">Actividad sin fecha de entrega</strong>
                    <p className="dc-pending-item-sub">Define cuándo debe responder la sección.</p>
                  </div>
                  <span className="text-xs font-bold text-indigo-700">Fijar →</span>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: ¿Qué quieres hacer? */}
          <div className="dc-overview-col-right">
            <h3 className="dc-action-column-title">¿Qué quieres hacer?</h3>

            <div className="dc-action-cards-stack">
              {/* Acción 1: Crear guía por tema (Abre el Modal de IA de la Captura 4) */}
              <div className="dc-action-hub-card">
                <div className="dc-hub-card-icon-box">
                  <Icon name="spark" size={20} />
                </div>
                <div className="dc-hub-card-body">
                  <h4 className="dc-hub-card-title">Crear guía por tema</h4>
                  <p className="dc-hub-card-desc">
                    Genera actividades para "{clase.topic || 'Convivencia escolar'}" sin elegir una obra.
                  </p>
                  <button
                    type="button"
                    className="dc-hub-card-link-btn"
                    onClick={() => setModalGuiaIA(true)}
                  >
                    Crear borrador con IA →
                  </button>
                </div>
              </div>

              {/* Acción 2: Elegir obra para este curso (Cambia a la pestaña Experiencias teatrales de la Captura 5) */}
              <div className="dc-action-hub-card">
                <div className="dc-hub-card-icon-box">
                  <Icon name="ticket" size={20} />
                </div>
                <div className="dc-hub-card-body">
                  <h4 className="dc-hub-card-title">Elegir obra para este curso</h4>
                  <p className="dc-hub-card-desc">
                    Revisa recomendaciones exclusivas para este curso y añádelas a un tema.
                  </p>
                  <button
                    type="button"
                    className="dc-hub-card-link-btn"
                    onClick={() => {
                      setTab('experiencias')
                      setMostrarCatalogo(true)
                    }}
                  >
                    Ver obras para este curso →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 2. PESTAÑA: EXPERIENCIAS TEATRALES (Captura 1 y Captura 5)     */}
      {/* ============================================================== */}
      {tab === 'experiencias' && (
        <div className="dc-theatrical-experiences-view animate-fade-in">
          {mostrarCatalogo ? (
            <div>
              {/* Enlace volver a obras añadidas */}
              <div className="dc-experiences-top-bar mb-4">
                <button
                  type="button"
                  className="back-link inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition"
                  onClick={() => setMostrarCatalogo(false)}
                >
                  ← Volver a obras añadidas
                </button>
              </div>

              {/* Encabezado Exclusivo y Barra de Búsqueda (Captura 5) */}
              <div className="dc-exclusive-selection-header">
                <div>
                  <span className="dc-exclusive-tag">SELECCIÓN EXCLUSIVA DEL CURSO</span>
                  <h2 className="dc-exclusive-title">
                    Obras para {clase.subject} · {clase.grade} {clase.section}
                  </h2>
                  <p className="dc-exclusive-subtitle">
                    Recomendadas según "{clase.topic || 'Convivencia escolar'}" y los intereses:{' '}
                    {clase.intereses || 'Debate, identidad cultural y creación audiovisual'}.
                  </p>
                </div>

                <div className="dc-exclusive-search-bar">
                  <Icon name="search" size={16} />
                  <input
                    type="text"
                    placeholder="Buscar obra o tema"
                    value={busquedaObra}
                    onChange={(e) => setBusquedaObra(e.target.value)}
                  />
                </div>
              </div>

              {/* Grilla de Obras Teatrales Recomendadas (Captura 5) */}
              <div className="dc-theatrical-plays-grid mt-5">
                {obrasFiltradas.map((obra, index) => {
                  const coincide = index === 0

                  return (
                    <article key={obra.id} className="dc-theatrical-play-card">
                      {/* Banner superior con máscara teatral en halo */}
                      <div
                        className="dc-theatrical-play-banner"
                        style={{ background: obra.gradiente }}
                      >
                        {coincide && (
                          <div className="dc-coincide-tag-pill">
                            <Icon name="spark" size={13} />
                            <span>Coincide con el tema</span>
                          </div>
                        )}
                        <div className="dc-theatrical-mask-circle">
                          <Icon name="mask" size={32} />
                        </div>
                      </div>

                      {/* Cuerpo de la tarjeta */}
                      <div className="dc-theatrical-play-body">
                        <span className="dc-play-tag-pill">{obra.tematica}</span>
                        <h3 className="dc-theatrical-play-title">{obra.titulo}</h3>
                        <p className="dc-theatrical-play-synopsis">
                          {obra.sinopsis ||
                            (obra.id === 'otras-voces'
                              ? 'Una creación colectiva sobre jóvenes que aprenden a escucharse mientras transforman un espacio compartido. La obra aborda el diálogo, la pertenencia y la construcción de acuerdos.'
                              : obra.id === 'quien-soy'
                                ? 'Una experiencia escénica sobre la búsqueda de la propia voz y el valor de reconocerse en una comunidad diversa.'
                                : 'Una pequeña quebrada seca se convierte en el epicentro de un rescate ecológico liderado por escolares, desafiando las dudas de su comunidad.')}
                        </p>

                        <div className="dc-theatrical-play-actions">
                          <Link
                            to={`/docente/cartelera?obra=${obra.id}`}
                            className="dc-btn-reserve-seats"
                          >
                            Ver funciones y aforo
                          </Link>
                          <button
                            type="button"
                            className="dc-btn-select-for-class"
                            onClick={async () => {
                              await handleVincularObra(obra)
                              setMostrarCatalogo(false)
                            }}
                          >
                            + Añadir al curso
                          </button>
                        </div>
                      </div>
                    </article>
                  )
                })}
              </div>
            </div>
          ) : (
            <div>
              {/* VISTA 1: Obras añadidas al curso (Captura 1) */}
              <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                    Obras añadidas al curso
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    Asigna cada obra a un tema antes de preparar actividades.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary px-4 py-2.5 text-sm font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl flex items-center gap-1.5 shadow-sm transition"
                  onClick={() => setMostrarCatalogo(true)}
                >
                  <span className="font-extrabold">+</span> Añadir otra obra
                </button>
              </div>

              {/* Tarjeta de la Obra Asignada (Captura 3) */}
              <div className="card overflow-hidden bg-white border border-slate-200 rounded-3xl shadow-sm">
                <div className="flex flex-col md:flex-row gap-6 p-6 sm:p-7">
                  {/* Miniatura vertical con degradado #332b89 a #d32c49 y sonrisa teatral [:)] */}
                  <div className="w-full md:w-56 min-h-[17rem] md:min-h-[21rem] rounded-2xl md:rounded-3xl bg-gradient-to-b from-[#332b89] to-[#d32c49] flex items-center justify-center p-6 text-white shadow-md flex-shrink-0">
                    <div className="flex flex-col items-center justify-center">
                      <svg
                        width="70"
                        height="70"
                        viewBox="0 0 68 68"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className="drop-shadow-sm"
                        aria-hidden="true"
                      >
                        <circle cx="23" cy="27" r="4.5" fill="white" />
                        <circle cx="45" cy="27" r="4.5" fill="white" />
                        <path
                          d="M21 42C25 50 43 50 47 42"
                          stroke="white"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <span className="status-badge inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
                        Añadida al curso
                      </span>
                      <h2 className="mt-3 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                        {clase.obraSeleccionada || 'Otras voces, un mismo patio'}
                      </h2>
                      <p className="mt-2.5 text-sm leading-relaxed text-slate-600 font-normal">
                        Una creación colectiva sobre jóvenes que aprenden a escucharse mientras transforman un espacio compartido. La obra aborda el diálogo, la pertenencia y la construcción de acuerdos.
                      </p>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <span className="tag tag-neutral text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                          Se comunica oralmente
                        </span>
                        <span className="tag tag-neutral text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-700 rounded-full">
                          Convive y participa democráticamente
                        </span>
                      </div>

                      <div className="mt-5 max-w-md">
                        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                          Asignar al tema
                        </label>
                        <select
                          aria-label="Asignar obra a un tema"
                          className="field w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-white focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                          value={temaAsignadoObra || clase.topic || 'Convivencia escolar'}
                          onChange={(e) => setTemaAsignadoObra(e.target.value)}
                        >
                          <option value={clase.topic || 'Convivencia escolar'}>
                            {clase.topic || 'Convivencia escolar'}
                          </option>
                          <option value="Comunicación oral">Comunicación oral</option>
                          <option value="Actividad independiente">Actividad independiente</option>
                        </select>
                      </div>
                    </div>

                    <div className="mt-6 flex flex-wrap gap-3 pt-2">
                      <button
                        type="button"
                        className="btn btn-primary px-5 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition"
                        onClick={() => setTab('kit')}
                      >
                        Preparar guía y actividades
                      </button>
                      <button
                        type="button"
                        className="btn btn-secondary px-4 py-2.5 text-sm font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl transition"
                        onClick={() =>
                          showToast(
                            `Obra asignada a “${temaAsignadoObra || clase.topic || 'Convivencia escolar'}”`,
                          )
                        }
                      >
                        Guardar asignación
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ============================================================== */}
      {/* 3. SUBVISTA: KIT PEDAGÓGICO CON IA (Captura 2)                  */}
      {/* ============================================================== */}
      {tab === 'kit' && (
        <KitPedagogico
          clase={clase}
          obra={{
            titulo: clase.obraSeleccionada || 'Otras voces, un mismo patio',
          }}
          onVolver={() => setTab('experiencias')}
          notify={showToast}
        />
      )}

      {/* ============================================================== */}
      {/* 4. PESTAÑA: GUÍAS Y ACTIVIDADES (Figma + Temario CNEB)         */}
      {/* ============================================================== */}
      {tab === 'guias' && (
        <div className="dc-tab-content-pane animate-fade-in space-y-6">
          <div className="section-heading mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                Temas, guías y actividades
              </h2>
              <p className="text-sm text-slate-600">
                Cada tema reúne su guía pedagógica y las actividades asignadas.
              </p>
            </div>
            <button
              type="button"
              className="btn btn-primary px-4 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl flex items-center gap-1.5 self-start sm:self-auto shadow-sm transition"
              onClick={() => setModalGuiaIA(true)}
            >
              <span>+</span> Crear guía para otro tema
            </button>
          </div>

          {/* Bloque del tema actual de Figma */}
          <article className="theme-block border border-slate-200 rounded-2xl overflow-hidden shadow-sm bg-white">
            <div className="theme-header p-5 bg-indigo-50/70 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <span className="eyebrow text-xs font-bold text-rose-600 uppercase tracking-wider block">
                  TEMA ACTUAL
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-0.5">
                  {clase.topic || 'Convivencia escolar'}
                </h3>
                <p className="text-xs text-slate-600 font-medium">
                  {clase.subject} · {clase.grade} {clase.section}
                </p>
              </div>
              <button
                type="button"
                className="btn btn-ghost px-3 py-1.5 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 rounded-lg hover:bg-indigo-50 transition self-start sm:self-auto"
                onClick={handleAbrirEditarContexto}
              >
                ✏️ Editar tema
              </button>
            </div>

            <div className="theme-content p-6 space-y-6">
              <div className="guide-row flex flex-col sm:flex-row sm:items-center gap-4">
                <span className="course-icon w-12 h-12 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center text-xl flex-shrink-0">
                  ✨
                </span>
                <div className="flex-1">
                  <span className="meta-label block text-xs font-bold text-slate-500 uppercase tracking-wider">
                    Guía pedagógica
                  </span>
                  <strong className="block text-slate-900 font-bold text-base mt-0.5">
                    Convivencia y escucha activa
                  </strong>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Borrador vinculado a “{clase.obraSeleccionada || 'Otras voces, un mismo patio'}”.
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-secondary px-4 py-2 text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl shadow-sm transition"
                  onClick={() => setTab('kit')}
                >
                  Abrir guía
                </button>
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="mb-3 flex items-center justify-between">
                  <h4 className="font-bold text-sm text-slate-900">Actividades del tema</h4>
                  <span className="text-xs text-slate-500 font-semibold">1 actividad</span>
                </div>
                <button
                  type="button"
                  className="activity-course-row flex w-full items-center gap-3.5 p-3.5 border border-slate-200 rounded-xl bg-slate-50 hover:bg-white hover:border-indigo-400 transition"
                  onClick={() => setModalEntregas(true)}
                >
                  <span className="activity-icon tone-red w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center text-lg flex-shrink-0">
                    📖
                  </span>
                  <span className="flex-1 text-left">
                    <strong className="text-slate-900 text-sm font-bold block">
                      Mi voz en el grupo
                    </strong>
                    <small className="text-xs text-slate-500 block">
                      Actividad posterior · 5 estudiantes de muestra
                    </small>
                  </span>
                  <span className="text-xs font-bold text-indigo-700 flex items-center gap-1">
                    Ver entregas →
                  </span>
                </button>
              </div>
            </div>
          </article>

          {/* Temario Curricular CNEB Completo (Acordeón desplegable para mantener limpieza visual de Captura 1) */}
          <div className="mt-8 pt-4 border-t border-slate-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <span>📚 Unidades Curriculares CNEB</span>
                  <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded-full font-semibold">
                    4 unidades
                  </span>
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Consulta o genera guías adicionales alineadas a competencias del currículo nacional.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMostrarCneb((prev) => !prev)}
                className="px-3.5 py-2 text-xs font-bold text-indigo-700 bg-white hover:bg-indigo-50 rounded-xl transition border border-indigo-200 shadow-sm flex items-center gap-1.5 self-start sm:self-auto"
              >
                <span>{mostrarCneb ? 'Ocultar temario ▲' : 'Ver temario CNEB completo ▼'}</span>
              </button>
            </div>

            {mostrarCneb && (
              <div className="mt-4 animate-fade-in">
                <TemarioCneb clase={clase} ejecutar={ejecutar} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* 5. PESTAÑA: ESTUDIANTES                                        */}
      {/* ============================================================== */}
      {tab === 'estudiantes' && (
        <div className="dc-tab-content-pane animate-fade-in">
          <NominaTab clase={clase} ejecutar={ejecutar} />
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL ENTREGAS: ACTIVIDAD "MI VOZ EN EL GRUPO"                  */}
      {/* ============================================================== */}
      {modalEntregas && (
        <ActivitySubmissionsModal onClose={() => setModalEntregas(false)} />
      )}

      {/* ============================================================== */}
      {/* MODAL IA: HAZ QUE TU PRÓXIMA CLASE COBRE VIDA (Captura 4)       */}
      {/* ============================================================== */}
      <GenerarGuiaModal
        isOpen={modalGuiaIA}
        onClose={() => setModalGuiaIA(false)}
        clase={clase}
      />

      {/* MODAL: EDITAR CONTEXTO DE LA SECCIÓN                           */}
      {modalEditarContexto && (
        <div
          className="dc-modal-overlay"
          onClick={() => setModalEditarContexto(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="dc-modal-card compact" onClick={(e) => e.stopPropagation()}>
            <div className="dc-modal-header">
              <div>
                <span className="dc-modal-tag">ENFOQUE PEDAGÓGICO</span>
                <h3 className="dc-modal-title">
                  Editar contexto · {clase.subject} {clase.grade} {clase.section}
                </h3>
              </div>
              <button
                type="button"
                className="dc-modal-close-btn"
                onClick={() => setModalEditarContexto(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardarContexto} className="dc-edit-interests-form">
              <div className="dc-form-group">
                <label className="dc-form-label">Tema actual del aula</label>
                <input
                  type="text"
                  className="dc-form-input"
                  value={contextoForm.topic}
                  onChange={(e) =>
                    setContextoForm((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Intereses del grupo</label>
                <textarea
                  className="dc-form-textarea"
                  rows={3}
                  value={contextoForm.intereses}
                  onChange={(e) =>
                    setContextoForm((prev) => ({ ...prev, intereses: e.target.value }))
                  }
                />
              </div>

              <div className="dc-modal-footer is-between">
                <button
                  type="button"
                  className="dc-btn-link"
                  onClick={() => setModalEditarContexto(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="dc-btn-red">
                  Guardar cambios
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================== */}
      {/* MODAL: FIJAR FECHA DE ENTREGA                                   */}
      {/* ============================================================== */}
      {modalFechaEntrega && (
        <div
          className="dc-modal-overlay"
          onClick={() => setModalFechaEntrega(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="dc-modal-card compact max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dc-modal-header border-b border-slate-200 pb-3">
              <div>
                <span className="dc-modal-tag text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  CALENDARIO ESCOLAR
                </span>
                <h3 className="dc-modal-title text-lg font-extrabold text-slate-900 mt-0.5">
                  Fijar fecha límite de entrega
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Actividad: Mi voz en el grupo · {clase.grade} {clase.section}
                </p>
              </div>
              <button
                type="button"
                className="dc-modal-close-btn text-slate-400 hover:text-slate-600 text-lg p-1"
                onClick={() => setModalFechaEntrega(false)}
              >
                ✕
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault()
                showToast(`Fecha límite programada para el ${fechaEntrega}`)
                setModalFechaEntrega(false)
              }}
              className="p-5 space-y-4 text-left"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Fecha de entrega
                </label>
                <input
                  type="date"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  value={fechaEntrega}
                  onChange={(e) => setFechaEntrega(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Hora de cierre
                </label>
                <input
                  type="time"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  defaultValue="23:59"
                />
              </div>

              <div className="space-y-2 pt-1 border-t border-slate-100">
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Enviar recordatorio automático a los estudiantes 24 horas antes</span>
                </label>
                <label className="flex items-start gap-2.5 text-xs text-slate-700 cursor-pointer">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                  />
                  <span>Permitir reflexiones en audio fuera de fecha con etiqueta de retraso</span>
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-800 transition"
                  onClick={() => setModalFechaEntrega(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm transition"
                >
                  Guardar fecha
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
