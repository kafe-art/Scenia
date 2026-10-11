import { useState } from 'react'
import ConsentBadge from './ConsentBadge'
import FichaAlumno from './FichaAlumno'
import { inscribirEstudiantes, quitarEstudiante, registrarConsentimiento } from '../services/clases'

export default function NominaTab({ clase, ejecutar }) {
  const [texto, setTexto] = useState('')
  const [fichaId, setFichaId] = useState(null)
  const ficha = clase.estudiantes.find((e) => e.id === fichaId)
  const { resumen } = clase

  const inscribir = (e) => {
    e.preventDefault()
    const nombres = texto.split('\n')
    ejecutar(async () => {
      await inscribirEstudiantes(clase.id, nombres)
      setTexto('')
    })
  }

  return (
    <>
      <section className="dc-block">
        <h3>Inscribir estudiantes</h3>
        <p className="dc-muted">Escribe un nombre por línea. Cada estudiante nuevo empieza con el consentimiento pendiente.</p>
        <form className="dc-form" onSubmit={inscribir}>
          <textarea
            rows={3}
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
            placeholder={'Ana Torres\nLuis Ramírez'}
            aria-label="Nombres de los estudiantes, uno por línea"
          />
          <div><button type="submit" className="dc-btn primary">Inscribir</button></div>
        </form>
      </section>

      <section className="dc-block">
        <header>
          <div>
            <h3>Nómina</h3>
            <p className="dc-muted">
              {resumen.conConsentimiento} de {resumen.estudiantes} con consentimiento (Ley 29733). Los demás no pueden recibir tareas.
            </p>
          </div>
        </header>
        {clase.estudiantes.length === 0 ? (
          <p className="dc-muted">Todavía no hay estudiantes en esta clase.</p>
        ) : (
          <table className="dc-table">
            <thead>
              <tr><th>Estudiante</th><th>Consentimiento</th><th>Tareas</th><th>Acciones</th></tr>
            </thead>
            <tbody>
              {clase.estudiantes.map((est) => {
                const ok = est.consentimiento === 'otorgado'
                const hechas = clase.tareas.filter((t) => clase.entregas[t.id]?.[est.id]?.estado === 'hecho').length
                return (
                  <tr key={est.id}>
                    <td>{est.nombre}</td>
                    <td><ConsentBadge estado={est.consentimiento} /></td>
                    <td>{!ok ? 'Bloqueadas' : clase.tareas.length ? `${hechas}/${clase.tareas.length}` : '—'}</td>
                    <td>
                      <div className="dc-actions">
                        <button type="button" className="dc-btn" onClick={() => setFichaId(est.id)}>Ver ficha</button>
                        {ok ? (
                          <button type="button" className="dc-btn" onClick={() => ejecutar(() => registrarConsentimiento(clase.id, est.id, 'revocado'))}>Revocar</button>
                        ) : (
                          <button type="button" className="dc-btn" title="Registra que el apoderado firmó el consentimiento" onClick={() => ejecutar(() => registrarConsentimiento(clase.id, est.id, 'otorgado'))}>
                            Registrar consentimiento
                          </button>
                        )}
                        <button
                          type="button"
                          className="dc-btn danger"
                          onClick={() => {
                            if (window.confirm(`¿Quitar a ${est.nombre} de la clase?`)) {
                              if (fichaId === est.id) setFichaId(null)
                              ejecutar(() => quitarEstudiante(clase.id, est.id))
                            }
                          }}
                        >
                          Quitar
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </section>

      {ficha && <FichaAlumno clase={clase} estudiante={ficha} ejecutar={ejecutar} onCerrar={() => setFichaId(null)} />}
    </>
  )
}
