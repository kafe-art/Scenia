import { useState } from 'react'
import ConsentBadge from './ConsentBadge'
import RespuestaView from './RespuestaView'
import { marcarEntrega, simularEntrega } from '../services/clases'

const ETIQUETA = {
  pendiente: ['muted', 'Pendiente'],
  entregada: ['info', 'Entregada · por revisar'],
  hecho: ['ok', 'Hecho'],
}

// Lista de comprobación de un estudiante: una fila por tarea de la clase.
export default function FichaAlumno({ clase, estudiante, ejecutar, onCerrar }) {
  const [abierta, setAbierta] = useState(null)
  const bloqueado = estudiante.consentimiento !== 'otorgado'

  return (
    <section className="dc-block" aria-label={`Ficha de ${estudiante.nombre}`}>
      <header>
        <div>
          <h3>{estudiante.nombre}</h3>
          <ConsentBadge estado={estudiante.consentimiento} />
        </div>
        <button type="button" className="dc-btn" onClick={onCerrar}>Cerrar</button>
      </header>

      {bloqueado && (
        <p className="dc-lock" style={{ marginTop: 12 }}>
          Las tareas están bloqueadas hasta que el apoderado otorgue el consentimiento (Ley 29733).
        </p>
      )}

      {clase.tareas.length === 0 && (
        <p className="dc-muted" style={{ marginTop: 12 }}>
          Esta clase aún no tiene tareas. Asígnalas desde la pestaña “Programa y tareas”.
        </p>
      )}

      {clase.tareas.map((tarea) => {
        const entrega = clase.entregas[tarea.id]?.[estudiante.id]
        const estado = entrega?.estado || 'pendiente'
        const [tono, texto] = ETIQUETA[estado]
        return (
          <div className="dc-row" key={tarea.id} style={{ display: 'block' }}>
            <div className="between" style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
              <div>
                <strong>{tarea.titulo}</strong>
                <div className="dc-muted">{tarea.tipo === 'auto' ? 'Se verifica automáticamente' : 'Requiere tu revisión'}</div>
              </div>
              <div className="dc-actions">
                <span className={`dc-pill ${bloqueado ? 'warn' : tono}`}>{bloqueado ? 'Bloqueada' : texto}</span>
                {!bloqueado && entrega?.respuesta && (
                  <button type="button" className="dc-btn" onClick={() => setAbierta(abierta === tarea.id ? null : tarea.id)}>
                    {abierta === tarea.id ? 'Ocultar respuesta' : 'Ver respuesta'}
                  </button>
                )}
                {!bloqueado && tarea.tipo === 'revision' && estado === 'entregada' && (
                  <button type="button" className="dc-btn primary" onClick={() => ejecutar(() => marcarEntrega(clase.id, tarea.id, estudiante.id, 'hecho'))}>
                    Marcar como hecho
                  </button>
                )}
                {!bloqueado && estado === 'pendiente' && (
                  <button type="button" className="dc-btn" title="Solo demo: imita lo que enviaría el estudiante" onClick={() => ejecutar(() => simularEntrega(clase.id, tarea.id, estudiante.id))}>
                    Simular entrega (demo)
                  </button>
                )}
              </div>
            </div>
            {!bloqueado && abierta === tarea.id && <RespuestaView tarea={tarea} respuesta={entrega?.respuesta} />}
          </div>
        )
      })}
    </section>
  )
}
