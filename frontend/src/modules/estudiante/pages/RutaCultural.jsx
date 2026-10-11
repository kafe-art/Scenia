import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import { obtenerDashboardEstudiante } from '../services/estudiante'

export default function RutaCultural() {
  const [data, setData] = useState(null)
  const [ticketModal, setTicketModal] = useState(false)

  useEffect(() => {
    obtenerDashboardEstudiante().then(setData)
  }, [])

  if (!data) return <Loading mensaje="Cargando tu ruta cultural..." />

  const { perfil, obras, actividades } = data
  const proximaObra = obras.find((o) => o.id === 'el-bosque') || obras[0]

  return (
    <div className="st-page-container">
      {/* Saludo Principal con Ilustración de Máscaras */}
      <section className="st-greeting-section">
        <div className="st-greeting-text">
          <h1>¡Hola, {perfil.nombre}!</h1>
          <p>Tu aventura cultural continúa.</p>
        </div>
        <div className="st-masks-art" aria-hidden="true">
          <span className="st-confetti-dot c1" />
          <span className="st-confetti-dot c2" />
          <span className="st-confetti-dot c3" />
          <div className="st-masks-wrapper">
            <span className="st-mask comedy">🎭</span>
          </div>
        </div>
      </section>

      {/* Grid Principal: 2 Columnas (Izquierda: Ruta y Obras; Derecha: Próxima Función y Actividades) */}
      <div className="st-dashboard-main-grid">
        {/* Columna Izquierda */}
        <div className="st-left-column">
          {/* Banner: Tu Ruta Cultural con Barra de Progreso */}
          <div className="st-card st-ruta-banner">
            <div className="st-ruta-header">
              <div className="st-ruta-title-box">
                <span className="st-ruta-icon">📜</span>
                <strong>Tu ruta cultural</strong>
              </div>
              <div className="st-ruta-stat">
                <span>{perfil.obrasCompletadas} de {perfil.obrasTotales} obras</span>
                <strong>40%</strong>
              </div>
            </div>
            <div className="st-progress-track">
              <div
                className="st-progress-fill"
                style={{
                  width: `${Math.round(
                    (perfil.obrasCompletadas / perfil.obrasTotales) * 100,
                  )}%`,
                }}
              />
            </div>
          </div>

          {/* Obras Asignadas */}
          <section className="st-obras-asignadas-section">
            <div className="st-section-header">
              <h2>Obras asignadas</h2>
              <Link to="/cartelera" className="st-link-ver-todas">
                Ver todas →
              </Link>
            </div>

            <div className="st-cards-carousel">
              {obras.map((obra) => {
                const esAsignada = obra.estado === 'asignada'

                return (
                  <article key={obra.id} className="st-obra-card">
                    <div className={`st-obra-poster-box ${obra.colorArt}`}>
                      <div className="st-poster-overlay">
                        <span className="st-play-icon">🎭</span>
                      </div>
                    </div>

                    <div className="st-obra-card-body">
                      <span
                        className={`st-badge-status ${
                          esAsignada ? 'badge-asignada' : 'badge-disponible'
                        }`}
                      >
                        {obra.etiquetaBadge}
                      </span>

                      <h3 className="st-obra-title">{obra.titulo}</h3>

                      <div className="st-obra-date">
                        <Icon name="calendar" size={14} />
                        <span>{obra.fechaCorta}</span>
                      </div>

                      <div className="st-card-actions">
                        {esAsignada ? (
                          <Link
                            to={`/estudiante/obras/${obra.id}`}
                            className="st-btn primary full"
                          >
                            Ver detalles
                          </Link>
                        ) : (
                          <Link
                            to={`/estudiante/obras/${obra.id}`}
                            className="st-btn secondary full"
                          >
                            Explorar obra
                          </Link>
                        )}
                      </div>
                    </div>
                  </article>
                )
              })}
            </div>
          </section>

          {/* Resumen Inferior: Progreso y Reflexiones */}
          <div className="st-bottom-summary-grid">
            <Link to="/estudiante/logros" className="st-card st-summary-card">
              <div className="st-summary-icon red">
                <span>🎭</span>
              </div>
              <div>
                <strong>Tu progreso cultural</strong>
                <p>{perfil.obrasCompletadas} de {perfil.obrasTotales} obras completadas</p>
              </div>
            </Link>

            <Link to="/estudiante/logros" className="st-card st-summary-card">
              <div className="st-summary-icon coral">
                <span>📝</span>
              </div>
              <div>
                <strong>Tus reflexiones</strong>
                <p>{perfil.reflexionesCompletadas} de {perfil.reflexionesTotales} completadas</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Columna Derecha */}
        <div className="st-right-column">
          {/* Card: Próxima Función con Botón "Ver mi entrada" */}
          <div className="st-card st-proxima-card">
            <div className="st-card-tag">
              <Icon name="ticket" size={16} /> Próxima función
            </div>

            <div className="st-proxima-content">
              <div className="st-proxima-thumb">
                <span>🌲</span>
              </div>

              <div className="st-proxima-details">
                <h3>{proximaObra.titulo}</h3>
                <div className="st-meta-row">
                  <Icon name="calendar" size={14} />
                  <span>{proximaObra.fecha}</span>
                </div>
                <div className="st-meta-row">
                  <Icon name="clock" size={14} />
                  <span>{proximaObra.hora}</span>
                </div>
                <div className="st-meta-row">
                  <Icon name="building" size={14} />
                  <span>{proximaObra.lugar}</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              className="st-btn primary full glow"
              onClick={() => setTicketModal(true)}
            >
              Ver mi entrada
            </button>
          </div>

          {/* Card: Actividades Pendientes */}
          <div className="st-card st-activity-box">
            <div className="st-activity-header">
              <div className="st-act-title-group">
                <span className="st-act-icon red">📋</span>
                <strong>Actividades pendientes</strong>
              </div>
              <span className="st-count-pill red">
                {actividades.pendientes.length} actividades
              </span>
            </div>

            <div className="st-act-list">
              {actividades.pendientes.map((act) => (
                <Link key={act.id} to={act.ruta} className="st-act-item">
                  <div className="st-act-info">
                    <span className="st-act-name">{act.titulo}</span>
                    <small>Vence: {act.vence}</small>
                  </div>
                  <span className="st-act-arrow">›</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Card: Actividades Completadas */}
          <div className="st-card st-activity-box">
            <div className="st-activity-header">
              <div className="st-act-title-group">
                <span className="st-act-icon green">✓</span>
                <strong>Actividades completadas</strong>
              </div>
              <span className="st-count-pill green">
                {actividades.completadas.length} actividades
              </span>
            </div>

            <div className="st-act-list">
              {actividades.completadas.map((act) => (
                <div key={act.id} className="st-act-item comp">
                  <div className="st-act-info">
                    <span className="st-act-name">{act.titulo}</span>
                    <small>{act.fecha}</small>
                  </div>
                  <span className="st-act-arrow">›</span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Historial de Obras Visitadas */}
          <div className="st-card st-activity-box">
            <div className="st-activity-header">
              <div className="st-act-title-group">
                <span className="st-act-icon blue">🏛️</span>
                <strong>Historial de obras visitadas</strong>
              </div>
            </div>

            <div className="st-act-list">
              {actividades.historialVisitadas.map((h) => (
                <div key={h.id} className="st-act-item">
                  <div className="st-act-thumb-mini">🎭</div>
                  <div className="st-act-info">
                    <span className="st-act-name">{h.titulo}</span>
                    <small>{h.fecha}</small>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Ver Mi Entrada Digital (Boleto con QR) */}
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
              <div className="st-ticket-play-info">
                <h2>{proximaObra.titulo}</h2>
                <p>{proximaObra.lugar}</p>
              </div>

              <div className="st-ticket-seat-box">
                <div className="st-seat-row">
                  <span>Asiento:</span>
                  <strong>{proximaObra.reserva?.asiento}</strong>
                </div>
                <div className="st-seat-row">
                  <span>Código de Reserva:</span>
                  <strong className="code">{proximaObra.reserva?.codigoReserva}</strong>
                </div>
                <div className="st-seat-row">
                  <span>Estudiante:</span>
                  <strong>{perfil.apellidos}</strong>
                </div>
                <div className="st-seat-row">
                  <span>Aula:</span>
                  <strong>{perfil.aula}</strong>
                </div>
              </div>

              {/* QR Simulado */}
              <div className="st-qr-box">
                <img
                  src={proximaObra.reserva?.qrSimulado}
                  alt="Código QR de ingreso a la obra"
                  width={140}
                  height={140}
                />
                <small>Presenta este código en la puerta del teatro para ingresar</small>
              </div>

              <div className="st-ticket-footer">
                <button
                  type="button"
                  className="st-btn secondary"
                  onClick={() => window.print()}
                >
                  Imprimir Entrada
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
    </div>
  )
}
