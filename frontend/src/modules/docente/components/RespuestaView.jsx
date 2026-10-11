import { DIMENSIONES_WLEIS } from '../data/programa'

// Muestra lo que entregó el estudiante, según el tipo de tarea.
export default function RespuestaView({ tarea, respuesta }) {
  if (!respuesta) return <p className="dc-muted">Aún no hay respuesta.</p>
  if (respuesta.dimensiones) {
    return (
      <dl className="dc-respuesta">
        {DIMENSIONES_WLEIS.map(([clave, etiqueta]) => (
          <div key={clave}>
            <dt>{etiqueta}</dt>
            <dd>{respuesta.dimensiones[clave]} / 7</dd>
          </div>
        ))}
      </dl>
    )
  }
  return (
    <dl className="dc-respuesta">
      {(respuesta.items || []).map((texto, i) => (
        <div key={i}>
          <dt>{tarea.campos[i] || `Campo ${i + 1}`}</dt>
          <dd>{texto || '—'}</dd>
        </div>
      ))}
    </dl>
  )
}
