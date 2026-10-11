import { Link } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'

export default function SalidasTab({ clase }) {
  const reservas = clase.reservas || []

  return (
    <div className="dc-salidas-container">
      <div className="dc-salidas-hero-banner">
        <div>
          <span className="eyebrow">EXPERIENCIAS TEATRALES · {clase.grade} {clase.section}</span>
          <h2>Historial de Salidas al Teatro</h2>
          <p>
            Registro de funciones reservadas y asistidas por esta aula, aforos asignados y
            estudiantes participantes.
          </p>
        </div>
        <Link
          to={`/docente/cartelera?clase=${clase.id}`}
          className="dc-btn primary"
        >
          <Icon name="ticket" size={16} /> Reservar Nueva Función
        </Link>
      </div>

      {reservas.length === 0 ? (
        <div className="dc-empty-tab">
          <Icon name="ticket" size={32} />
          <h3>No hay salidas teatrales programadas para esta clase</h3>
          <p>
            Explora la cartelera escolar con pertinencia CNEB y reserva una función didáctica con tu
            grupo.
          </p>
          <Link
            to={`/docente/cartelera?clase=${clase.id}`}
            className="dc-btn primary"
            style={{ marginTop: 12 }}
          >
            Ir a Cartelera Escolar
          </Link>
        </div>
      ) : (
        <div className="dc-salidas-grid">
          {reservas.map((res) => (
            <article key={res.id} className="dc-reserva-card">
              <header className="dc-reserva-header">
                <div>
                  <span className="dc-codigo-reserva">CÓDIGO: {res.codigoReserva}</span>
                  <h3>{res.obra}</h3>
                </div>
                <span className="dc-pill ok">{res.estado || 'Confirmada'}</span>
              </header>

              <div className="dc-reserva-details">
                <div className="dc-detail-row">
                  <span className="dc-detail-label">Lugar / Escenario:</span>
                  <strong>{res.teatro}</strong>
                </div>
                <div className="dc-detail-row">
                  <span className="dc-detail-label">Fecha y Hora:</span>
                  <strong>{res.fecha}</strong>
                </div>
                <div className="dc-detail-row">
                  <span className="dc-detail-label">Estudiantes Confirmados:</span>
                  <strong>
                    {res.asistentesConfirmados || res.totalEstudiantes} de {clase.estudiantes?.length || res.totalEstudiantes} alumnos
                  </strong>
                </div>
              </div>

              {res.inasistentes && res.inasistentes.length > 0 && (
                <div className="dc-inasistentes-box">
                  <span className="dc-inasistentes-label">Estudiantes desmarcados / justificados:</span>
                  <div className="dc-inasistentes-tags">
                    {res.inasistentes.map((nombre, iIdx) => (
                      <span key={iIdx} className="dc-tag-inasistente">
                        {nombre}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <footer className="dc-reserva-footer">
                <span className="dc-muted">
                  Guía pedagógica vinculada a la unidad curricular activa.
                </span>
                <button
                  type="button"
                  className="dc-btn small"
                  onClick={() => window.print()}
                >
                  Imprimir Credenciales de Ingreso
                </button>
              </footer>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
