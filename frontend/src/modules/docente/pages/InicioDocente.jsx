import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import {
  listarClases,
  obtenerActividadesProximas,
  obtenerObrasRecomendadasParaClase,
  vincularObraAClase,
  actualizarInteresesClase,
} from '../services/clases'
import CrearCursoModal from '../components/CrearCursoModal'

export default function InicioDocente() {
  const [classes, setClasses] = useState(null)
  const [actividades, setActividades] = useState([])
  const [selectedClassId, setSelectedClassId] = useState('')
  const [modalCrearCurso, setModalCrearCurso] = useState(false)
  const [modalIntereses, setModalIntereses] = useState(false)
  const [interesesForm, setInteresesForm] = useState({ topic: '', intereses: '' })
  const [toast, setToast] = useState(null)

  const showToast = (message) => {
    setToast(message)
    setTimeout(() => setToast(null), 4000)
  }

  const cargarDatos = () => {
    Promise.all([listarClases(), obtenerActividadesProximas()]).then(([listaClases, listaActividades]) => {
      setClasses(listaClases)
      setActividades(listaActividades)
      if (listaClases && listaClases.length > 0) {
        const activa = listaClases.find((c) => c.activa) || listaClases[0]
        setSelectedClassId((prev) => (prev && listaClases.some((c) => c.id === prev) ? prev : activa.id))
      }
    })
  }

  useEffect(() => {
    let cancelado = false
    Promise.all([listarClases(), obtenerActividadesProximas()]).then(([listaClases, listaActividades]) => {
      if (cancelado) return
      setClasses(listaClases)
      setActividades(listaActividades)
      if (listaClases && listaClases.length > 0) {
        const activa = listaClases.find((c) => c.activa) || listaClases[0]
        setSelectedClassId((prev) => (prev && listaClases.some((c) => c.id === prev) ? prev : activa.id))
      }
    })
    return () => {
      cancelado = true
    }
  }, [])

  if (!classes) return <Loading mensaje="Cargando tu panel docente..." />

  const selectedClass = classes.find((c) => c.id === selectedClassId) || classes[0]
  const obrasRecomendadas = obtenerObrasRecomendadasParaClase(selectedClass)

  const handleCursoCreado = (nuevas) => {
    cargarDatos()
    const plural = nuevas.length > 1 ? `las secciones ${nuevas.map((n) => n.section).join(', ')}` : `la sección ${nuevas[0]?.section || 'A'}`
    showToast(`¡Se ha creado ${nuevas[0]?.subject || 'el curso'} con ${plural}!`)
  }

  const handleAbrirEditarIntereses = () => {
    if (!selectedClass) return
    setInteresesForm({
      topic: selectedClass.topic || '',
      intereses: selectedClass.intereses || '',
    })
    setModalIntereses(true)
  }

  const handleGuardarIntereses = async (e) => {
    e.preventDefault()
    if (!selectedClass) return
    try {
      await actualizarInteresesClase(selectedClass.id, interesesForm)
      await cargarDatos()
      setModalIntereses(false)
      showToast(`¡Intereses y tema de ${selectedClass.subject} ${selectedClass.section} actualizados!`)
    } catch {
      showToast('Error al guardar los intereses.')
    }
  }

  const handleAnadirAlCurso = async (obra) => {
    if (!selectedClass) return
    try {
      await vincularObraAClase(selectedClass.id, obra.titulo)
      await cargarDatos()
      showToast(`¡"${obra.titulo}" fue añadida al curso ${selectedClass.subject} ${selectedClass.section}!`)
    } catch {
      showToast('No se pudo vincular la obra al curso.')
    }
  }

  return (
    <div className="dc-docente-dashboard">
      {/* Toast Notification Flotante */}
      {toast && (
        <div className="dc-floating-toast" role="alert">
          <Icon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* 1. Header de Bienvenida */}
      <header className="dc-dashboard-welcome">
        <div>
          <span className="dc-welcome-eyebrow">PANEL DOCENTE</span>
          <h1 className="dc-welcome-title">Buenos días, Carla</h1>
          <p className="dc-welcome-subtitle">
            Organiza tus cursos y acompaña cada experiencia teatral desde un solo lugar.
          </p>
        </div>
        <button
          type="button"
          className="dc-btn-primary-action"
          onClick={() => setModalCrearCurso(true)}
        >
          <Icon name="plus" size={16} />
          <span>Crear curso</span>
        </button>
      </header>

      {/* 2. Sección: Mis cursos y secciones */}
      <section className="dc-courses-section">
        <div className="dc-section-title-group">
          <h2 className="dc-section-title">Mis cursos y secciones</h2>
          <p className="dc-section-subtitle">Continúa desde donde lo dejaste.</p>
        </div>

        <div className="dc-courses-grid">
          {classes.map((curso) => {
            const numEstudiantes = curso.resumen?.estudiantes ?? curso.students ?? 25
            const temaActual = curso.topic || 'Convivencia escolar'
            const proximoTexto = curso.proximo || 'Revisar reflexiones'
            const esActiva = Boolean(curso.activa)

            return (
              <article
                key={curso.id}
                className={`dc-course-card ${esActiva ? 'is-active-section' : ''}`}
              >
                {/* Cabecera de la tarjeta */}
                <div className="dc-card-top-bar">
                  <div className="dc-course-icon-badge">
                    <Icon name="book" size={18} />
                  </div>
                  {esActiva && (
                    <span className="dc-active-badge">Sección activa</span>
                  )}
                </div>

                {/* Título y Grado/Sección */}
                <div className="dc-card-title-block">
                  <h3 className="dc-card-subject">{curso.subject}</h3>
                  <p className="dc-card-grade-sec">
                    {curso.grade} de secundaria · Sección {curso.section}
                  </p>
                </div>

                {/* Métricas clave */}
                <div className="dc-card-metrics-grid">
                  <div className="dc-metric-col">
                    <span className="dc-metric-label">ESTUDIANTES</span>
                    <strong className="dc-metric-value">{numEstudiantes}</strong>
                  </div>
                  <div className="dc-metric-col">
                    <span className="dc-metric-label">TEMA ACTUAL</span>
                    <strong className="dc-metric-value topic-text">{temaActual}</strong>
                  </div>
                </div>

                <div className="dc-card-divider" />

                {/* Alerta de próximo pendiente */}
                <div className="dc-card-next-alert">
                  <Icon name="clock" size={14} />
                  <span>
                    <strong>Próximo:</strong> {proximoTexto}
                  </span>
                </div>

                {/* Botón de acción */}
                <Link
                  to={`/docente/clases/${curso.id}`}
                  className="dc-card-open-btn"
                >
                  <span>Abrir curso</span>
                  <span className="dc-btn-arrow">→</span>
                </Link>
              </article>
            )
          })}
        </div>
      </section>

      {/* 3. Bloque Inferior: Próximas actividades y Obras para tu sección */}
      <div className="dc-dashboard-lower-grid">
        {/* Columna Izquierda: Próximas actividades */}
        <section className="dc-lower-col-left">
          <div className="dc-section-title-group">
            <h2 className="dc-section-title">Próximas actividades</h2>
            <p className="dc-section-subtitle">Prioridades de tus secciones.</p>
          </div>

          <div className="dc-activities-card-list">
            {actividades.map((act) => {
              const bgIconClass =
                act.color === 'rose'
                  ? 'bg-rose-50 text-rose-500'
                  : act.color === 'amber'
                    ? 'bg-amber-50 text-amber-500'
                    : 'bg-indigo-50 text-indigo-600'

              return (
                <div key={act.id} className="dc-activity-item-row">
                  <div className={`dc-activity-icon ${bgIconClass}`}>
                    <Icon name={act.icono || 'ticket'} size={18} />
                  </div>
                  <div className="dc-activity-info">
                    <h4 className="dc-activity-item-title">{act.titulo}</h4>
                    <p className="dc-activity-item-sub">{act.subtitulo}</p>
                  </div>
                  <div className="dc-activity-meta-right">
                    {act.fechaTexto && (
                      <span className="dc-activity-date-pill">{act.fechaTexto}</span>
                    )}
                    {act.badge && (
                      <span className="dc-activity-count-badge">{act.badge}</span>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Columna Derecha: Obras para tu sección */}
        <section className="dc-lower-col-right">
          <div className="dc-recommendations-header-row">
            <div>
              <h2 className="dc-section-title">Obras para tu sección</h2>
              <p className="dc-recommendations-topic-sub">
                Tema actual: <strong>{selectedClass?.topic || 'Convivencia escolar'}</strong> ·{' '}
                <button
                  type="button"
                  className="dc-link-edit-interests"
                  onClick={handleAbrirEditarIntereses}
                >
                  Editar intereses
                </button>
              </p>
            </div>

            {/* Selector de clase/sección */}
            <div className="dc-section-select-wrapper">
              <select
                className="dc-section-select"
                value={selectedClassId}
                onChange={(e) => setSelectedClassId(e.target.value)}
                aria-label="Seleccionar sección"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.subject} · {c.grade} {c.section}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de tarjetas de obras recomendadas */}
          <div className="dc-recommended-plays-list">
            {obrasRecomendadas.map((obra) => (
              <article key={obra.id} className="dc-play-recommendation-card">
                {/* Poster con degradado y máscara teatral */}
                <div
                  className="dc-play-poster-thumb"
                  style={{ background: obra.gradiente }}
                >
                  <div className="dc-theater-mask-icon">
                    <Icon name="mask" size={28} />
                  </div>
                </div>

                {/* Contenido descriptivo */}
                <div className="dc-play-details-col">
                  <span className="dc-play-tag-pill">{obra.tematica}</span>
                  <h3 className="dc-play-item-title">{obra.titulo}</h3>
                  <p className="dc-play-why-recommended">
                    <strong>Por qué te la recomendamos:</strong> {obra.justificacion}
                  </p>

                  <div className="dc-play-actions-row">
                    <Link
                      to={`/docente/cartelera?obra=${obra.id}`}
                      className="dc-link-view-play"
                    >
                      Ver obra y funciones →
                    </Link>
                    <button
                      type="button"
                      className="dc-btn-add-to-course"
                      onClick={() => handleAnadirAlCurso(obra)}
                    >
                      + Añadir al curso
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="dc-view-all-recs-wrap">
            <Link to="/docente/cartelera" className="dc-link-all-recs">
              Ver todas las recomendaciones →
            </Link>
          </div>
        </section>
      </div>

      {/* Modal Multi-paso para Crear curso y secciones */}
      <CrearCursoModal
        isOpen={modalCrearCurso}
        onClose={() => setModalCrearCurso(false)}
        onCursoCreado={handleCursoCreado}
      />

      {/* Modal rápido: Editar intereses del aula */}
      {modalIntereses && (
        <div
          className="dc-modal-overlay"
          onClick={() => setModalIntereses(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="dc-modal-card compact" onClick={(e) => e.stopPropagation()}>
            <div className="dc-modal-header">
              <div>
                <span className="dc-modal-tag">ENFOQUE PEDAGÓGICO</span>
                <h3 className="dc-modal-title">
                  Editar intereses · {selectedClass?.subject} {selectedClass?.grade}{' '}
                  {selectedClass?.section}
                </h3>
              </div>
              <button
                type="button"
                className="dc-modal-close-btn"
                onClick={() => setModalIntereses(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardarIntereses} className="dc-edit-interests-form">
              <div className="dc-form-group">
                <label className="dc-form-label">Tema actual del aula</label>
                <input
                  type="text"
                  className="dc-form-input"
                  value={interesesForm.topic}
                  onChange={(e) =>
                    setInteresesForm((prev) => ({ ...prev, topic: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Intereses y dinámicas de la sección</label>
                <textarea
                  className="dc-form-textarea"
                  rows={3}
                  value={interesesForm.intereses}
                  onChange={(e) =>
                    setInteresesForm((prev) => ({ ...prev, intereses: e.target.value }))
                  }
                  placeholder="ej. Debate, creación audiovisual, escucha activa..."
                />
              </div>

              <div className="dc-modal-footer is-between">
                <button
                  type="button"
                  className="dc-btn-link"
                  onClick={() => setModalIntereses(false)}
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
    </div>
  )
}
