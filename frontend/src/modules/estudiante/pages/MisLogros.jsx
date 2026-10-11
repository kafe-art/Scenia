import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Loading from '../../../components/Loading'
import { obtenerDashboardEstudiante } from '../services/estudiante'

export default function MisLogros() {
  const [data, setData] = useState(null)

  useEffect(() => {
    obtenerDashboardEstudiante().then(setData)
  }, [])

  if (!data) return <Loading mensaje="Cargando tus logros y reconocimientos..." />

  const { perfil, insignias, actividades } = data

  const OBRAS_PARTICIPADAS = [
    {
      id: 'el-bosque',
      titulo: 'El bosque de los sueños',
      fecha: '12 oct. 2025',
      estado: 'completada',
      badge: '✓ Completada',
      badgeClass: 'badge-ok',
      color: 'art-green',
    },
    {
      id: 'la-nina',
      titulo: 'La niña y el mar',
      fecha: '20 oct. 2025',
      estado: 'en_curso',
      badge: 'En curso',
      badgeClass: 'badge-warn',
      color: 'art-blue',
    },
    {
      id: 'suenos',
      titulo: 'Sueños en escena',
      fecha: '10 jul. 2025',
      estado: 'disponible',
      badge: 'Disponible',
      badgeClass: 'badge-info',
      color: 'art-amber',
    },
  ]

  return (
    <div className="st-page-container st-logros-page">
      {/* Banner Superior con Ilustración y Progreso */}
      <section className="st-logros-hero-banner">
        <div className="st-hero-left">
          <div className="st-hero-avatar-art">
            <span>👧🏆</span>
          </div>
          <div>
            <h1>¡Vas muy bien, {perfil.nombre}!</h1>
            <p>Cada obra, cada reflexión y cada experiencia te acercan a una gran historia.</p>
          </div>
        </div>

        <div className="st-hero-progress-box">
          <div className="st-hero-prog-label">
            <span className="st-tag-ruta">📜 Tu progreso en la ruta cultural</span>
            <strong>{perfil.obrasCompletadas} de {perfil.obrasTotales} obras (40%)</strong>
          </div>
          <div className="st-hero-track">
            <div
              className="st-hero-fill"
              style={{
                width: `${Math.round(
                  (perfil.obrasCompletadas / perfil.obrasTotales) * 100,
                )}%`,
              }}
            />
          </div>
        </div>
      </section>

      {/* Contadores: Obras Visitadas y Reflexiones */}
      <div className="st-counters-row">
        <div className="st-card st-counter-pill">
          <div className="st-counter-icon-wrap red">
            <span>🎭</span>
          </div>
          <div>
            <span className="st-counter-title">Obras visitadas</span>
            <strong>{perfil.obrasCompletadas} de {perfil.obrasTotales}</strong>
          </div>
        </div>

        <div className="st-card st-counter-pill">
          <div className="st-counter-icon-wrap coral">
            <span>📝</span>
          </div>
          <div>
            <span className="st-counter-title">Reflexiones completadas</span>
            <strong>{perfil.reflexionesCompletadas} de {perfil.reflexionesTotales}</strong>
          </div>
        </div>
      </div>

      {/* Grid Principal: Obras en las que participé, Insignias, Mi historial */}
      <div className="st-logros-sections-grid">
        {/* Sección: Obras en las que participé */}
        <div className="st-card st-section-box">
          <div className="st-section-top-row">
            <div className="st-sec-title-group">
              <span className="st-sec-icon">🎭</span>
              <h3>Obras en las que participé</h3>
            </div>
            <Link to="/estudiante" className="st-link-ver">
              Ver todas →
            </Link>
          </div>

          <div className="st-obras-participadas-grid">
            {OBRAS_PARTICIPADAS.map((ob) => (
              <div key={ob.id} className="st-mini-obra-card">
                <div className={`st-mini-art ${ob.color}`}>
                  <span>🌲</span>
                </div>
                <div className="st-mini-details">
                  <h4>{ob.titulo}</h4>
                  <small>{ob.fecha}</small>
                  <span className={`st-pill-status ${ob.badgeClass}`}>
                    {ob.badge}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Insignias */}
        <div className="st-card st-section-box">
          <div className="st-section-top-row">
            <div className="st-sec-title-group">
              <span className="st-sec-icon">🎖️</span>
              <h3>Insignias</h3>
            </div>
            <span className="st-count-insignias">3 / 4 desbloqueadas</span>
          </div>

          <div className="st-insignias-grid">
            {insignias.map((ins) => (
              <div
                key={ins.id}
                className={`st-insignia-badge-card ${
                  ins.desbloqueada ? 'unlocked' : 'locked'
                }`}
              >
                <div className={`st-badge-circle ${ins.color}`}>
                  <span>{ins.icono}</span>
                </div>
                <strong>{ins.nombre}</strong>
                <small>{ins.descripcion}</small>
              </div>
            ))}
          </div>
        </div>

        {/* Sección: Mi Historial */}
        <div className="st-card st-section-box">
          <div className="st-section-top-row">
            <div className="st-sec-title-group">
              <span className="st-sec-icon">📋</span>
              <h3>Mi historial</h3>
            </div>
            <Link to="/cartelera" className="st-link-ver">
              Ver todas →
            </Link>
          </div>

          <div className="st-historial-items-list">
            {actividades.historialVisitadas.map((h) => (
              <div key={h.id} className="st-historial-row">
                <div className="st-hist-thumb">🎭</div>
                <div className="st-hist-text">
                  <strong>{h.titulo}</strong>
                  <small>{h.fecha} · {h.estado}</small>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Banner Inferior de Cierre */}
      <section className="st-card st-bottom-banner-cta">
        <div className="st-cta-left">
          <span className="st-cta-trophy">🏆</span>
          <div>
            <h3>¡Cada experiencia cuenta!</h3>
            <p>El teatro te ayuda a descubrir nuevas historias y a ver el mundo con otros ojos.</p>
          </div>
        </div>
        <Link to="/cartelera" className="st-btn primary glow">
          Ver obras disponibles →
        </Link>
      </section>
    </div>
  )
}
