import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import { obtenerDetalleObra } from '../services/estudiante'

export default function DetalleObraEstudiante() {
  const { id } = useParams()
  const [obra, setObra] = useState(null)
  const [ticketModal, setTicketModal] = useState(false)
  const [actividadPreviaModal, setActividadPreviaModal] = useState(false)
  const [respuestasPrevias, setRespuestasPrevias] = useState({ r1: '', r2: '' })
  const [mensajePrevioGuardado, setMensajePrevioGuardado] = useState(false)

  useEffect(() => {
    obtenerDetalleObra(id).then(setObra)
  }, [id])

  if (!obra) return <Loading mensaje="Cargando detalles de la obra..." />

  const { reserva } = obra

  return (
    <div className="st-page-container">
      {/* Botón Volver */}
      <div className="st-back-bar">
        <Link to="/estudiante" className="st-back-link">
          ← Volver
        </Link>
      </div>

      {/* Hero Principal de la Obra */}
      <section className="st-obra-detail-hero">
        {/* Póster Vertical */}
        <div className="st-poster-large">
          <div className="st-poster-large-inner">
            <span className="st-poster-tree-art">🌲✨</span>
            <div className="st-poster-title-overlay">
              <h2>{obra.titulo}</h2>
            </div>
          </div>
        </div>

        {/* Información Central */}
        <div className="st-obra-main-info">
          <h1 className="st-hero-title">{obra.titulo}</h1>
          <p className="st-hero-desc">{obra.descripcion}</p>

          <div className="st-temas-section">
            <span className="st-temas-label">Temas que aborda</span>
            <div className="st-temas-pills">
              {(obra.temas || []).map((t, tIdx) => (
                <span key={tIdx} className="st-tema-pill">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Tarjetas Laterales de Fecha y Reserva */}
        <div className="st-obra-side-info">
          <div className="st-card st-info-side-card">
            <div className="st-info-side-row">
              <span className="st-icon-side red">
                <Icon name="calendar" size={18} />
              </span>
              <div>
                <small>Fecha</small>
                <strong>{obra.fecha}</strong>
              </div>
            </div>

            <div className="st-info-side-row">
              <span className="st-icon-side red">
                <Icon name="clock" size={18} />
              </span>
              <div>
                <small>Hora</small>
                <strong>{obra.hora}</strong>
              </div>
            </div>

            <div className="st-info-side-row">
              <span className="st-icon-side red">
                <Icon name="building" size={18} />
              </span>
              <div>
                <small>Lugar</small>
                <strong>{obra.lugar}</strong>
              </div>
            </div>
          </div>

          {reserva && (
            <div className="st-card st-reserva-side-card">
              <div className="st-reserva-header-row">
                <div className="st-reserva-title">
                  <Icon name="ticket" size={16} /> Tu reserva
                </div>
                <span className="st-badge-confirmada">✓ Confirmada</span>
              </div>

              <div className="st-reserva-meta-box">
                <div className="st-r-line">
                  <span>Asiento:</span>
                  <strong>{reserva.asiento}</strong>
                </div>
                <div className="st-r-line">
                  <span>Código de reserva:</span>
                  <strong className="code">{reserva.codigoReserva}</strong>
                </div>
              </div>

              <button
                type="button"
                className="st-btn primary full"
                onClick={() => setTicketModal(true)}
              >
                Ver mi entrada
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Banner: Recomendaciones antes de asistir */}
      <section className="st-card st-banner-recomendaciones">
        <div className="st-rec-icon-box">
          <span className="st-bulb-icon">💡</span>
        </div>
        <div className="st-rec-content">
          <h3>Recomendaciones antes de asistir</h3>
          <ul>
            {(obra.recomendaciones || []).map((rec, rIdx) => (
              <li key={rIdx}>{rec}</li>
            ))}
          </ul>
        </div>
      </section>

      {/* 3 Momentos Pedagógicos: Antes de asistir, Recomendaciones, Después de la función */}
      <section className="st-momentos-grid">
        {/* Tarjeta 1: Antes de asistir */}
        <article className="st-card st-momento-card">
          <div className="st-momento-header">
            <span className="st-momento-icon red">🎭</span>
            <h3>Antes de asistir</h3>
          </div>
          <p className="st-momento-text">
            {obra.actividadPrevia?.pregunta1} {obra.actividadPrevia?.pregunta2}
          </p>
          <div className="st-momento-action">
            <button
              type="button"
              className="st-btn primary full"
              onClick={() => setActividadPreviaModal(true)}
            >
              Ver actividad previa
            </button>
          </div>
        </article>

        {/* Tarjeta 2: Recomendaciones */}
        <article className="st-card st-momento-card">
          <div className="st-momento-header">
            <span className="st-momento-icon red">📋</span>
            <h3>Recomendaciones</h3>
          </div>
          <ul className="st-momento-bullets">
            <li>Llega 15 minutos antes de la función.</li>
            <li>Lleva tu entrada (digital o impresa).</li>
            <li>Usa ropa cómoda y lleva una botella de agua.</li>
            <li>Disfruta y mantén una actitud respetuosa.</li>
          </ul>
        </article>

        {/* Tarjeta 3: Después de la función -> Enlace a Reflexión */}
        <article className="st-card st-momento-card highlight">
          <div className="st-momento-header">
            <span className="st-momento-icon red">✨</span>
            <h3>Después de la función</h3>
          </div>
          <p className="st-momento-text">
            Registra tu reflexión teatral y comparte lo que aprendiste con tu clase.
          </p>
          <div className="st-momento-action">
            <Link
              to={`/estudiante/obras/${obra.id}/reflexion`}
              className="st-btn primary full glow"
            >
              Ir a mi reflexión
            </Link>
          </div>
        </article>
      </section>

      {/* Modal: Entrada Digital */}
      {ticketModal && (
        <div className="st-modal-overlay" role="dialog" aria-modal="true">
          <div className="st-modal-ticket-card">
            <div className="st-ticket-top">
              <span className="st-ticket-tag">ENTRADA ESCOLAR DIGITAL</span>
              <button
                type="button"
                className="st-modal-close"
                onClick={() => setTicketModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="st-ticket-body">
              <h2>{obra.titulo}</h2>
              <p>{obra.lugar}</p>
              <div className="st-ticket-seat-box">
                <div className="st-seat-row">
                  <span>Asiento:</span>
                  <strong>{reserva?.asiento}</strong>
                </div>
                <div className="st-seat-row">
                  <span>Código de Reserva:</span>
                  <strong className="code">{reserva?.codigoReserva}</strong>
                </div>
              </div>
              <div className="st-qr-box">
                <img
                  src={reserva?.qrSimulado}
                  alt="QR ingreso"
                  width={140}
                  height={140}
                />
                <small>Presenta este código en puerta</small>
              </div>
              <div className="st-ticket-footer">
                <button
                  type="button"
                  className="st-btn secondary"
                  onClick={() => window.print()}
                >
                  Imprimir
                </button>
                <button
                  type="button"
                  className="st-btn primary"
                  onClick={() => setTicketModal(false)}
                >
                  Listo
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Actividad Previa */}
      {actividadPreviaModal && (
        <div className="st-modal-overlay" role="dialog" aria-modal="true">
          <div className="st-modal-ticket-card" style={{ maxWidth: 540 }}>
            <div className="st-ticket-top">
              <span className="st-ticket-tag">ACTIVIDAD ANTES DE ASISTIR</span>
              <button
                type="button"
                className="st-modal-close"
                onClick={() => setActividadPreviaModal(false)}
              >
                ✕
              </button>
            </div>
            <div className="st-ticket-body" style={{ textAlign: 'left' }}>
              <h3>Anticipando la historia</h3>
              <p className="st-muted">
                Responde brevemente qué esperas de la obra. Tus respuestas se guardan en tu cuaderno cultural.
              </p>

              {mensajePrevioGuardado && (
                <div className="st-ok-banner">
                  ¡Tus ideas previas han sido guardadas con éxito!
                </div>
              )}

              <div className="st-field-box">
                <label>1. ¿Qué emociones crees que vivirán los personajes?</label>
                <textarea
                  rows={2}
                  className="st-textarea"
                  placeholder="Escribe lo que imaginas..."
                  value={respuestasPrevias.r1}
                  onChange={(e) =>
                    setRespuestasPrevias({ ...respuestasPrevias, r1: e.target.value })
                  }
                />
              </div>

              <div className="st-field-box">
                <label>2. ¿Qué mensaje crees que nos dejará la obra?</label>
                <textarea
                  rows={2}
                  className="st-textarea"
                  placeholder="Escribe tu hipótesis..."
                  value={respuestasPrevias.r2}
                  onChange={(e) =>
                    setRespuestasPrevias({ ...respuestasPrevias, r2: e.target.value })
                  }
                />
              </div>

              <div className="st-ticket-footer" style={{ marginTop: 16 }}>
                <button
                  type="button"
                  className="st-btn secondary"
                  onClick={() => setActividadPreviaModal(false)}
                >
                  Cerrar
                </button>
                <button
                  type="button"
                  className="st-btn primary"
                  onClick={() => {
                    setMensajePrevioGuardado(true)
                    setTimeout(() => {
                      setMensajePrevioGuardado(false)
                      setActividadPreviaModal(false)
                    }, 1200)
                  }}
                >
                  Guardar respuestas
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
