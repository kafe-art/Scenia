import { useState } from 'react'
import { analizarReflexion } from '../services/reflexiones'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function Estudiante() {
  const [reflexion, setReflexion] = useState('')
  const [resultado, setResultado] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setResultado(null)

    try {
      const data = await analizarReflexion({
        actividad_id: 1,
        estudiante_id: 1,
        reflexion,
      })
      setResultado(data.analisis)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="page">
      <h2>Vista Estudiante</h2>
      <p>Escribe tu reflexión después de participar en la actividad teatral.</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Tu reflexión
          <textarea
            value={reflexion}
            onChange={(e) => setReflexion(e.target.value)}
            required
            rows={6}
            placeholder="Escribe lo que aprendiste, sentiste o descubriste durante la actividad..."
            maxLength={8000}
          />
        </label>
        <p className="char-count">{reflexion.length} / 8000 caracteres</p>
        <button type="submit" disabled={cargando || !reflexion.trim()}>
          {cargando ? 'Analizando...' : 'Enviar reflexión'}
        </button>
      </form>

      {cargando && <Loading mensaje="Analizando reflexión..." />}
      {error && <ErrorMessage mensaje={error} />}

      {resultado && (
        <div className="analisis-resultado">
          <h3>Resultado del análisis</h3>
          <p>
            <strong>Resumen:</strong> {resultado.resumen}
          </p>

          {resultado.indicadores && (
            <div>
              <h4>Indicadores pedagógicos</h4>
              <div className="indicadores">
                {resultado.indicadores.map((ind, i) => (
                  <div
                    key={i}
                    className={`indicador nivel-${ind.nivel?.toLowerCase().replace(/ /g, '-')}`}
                  >
                    <h5>{ind.nombre}</h5>
                    <span className="nivel">{ind.nivel}</span>
                    <p>{ind.observacion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {resultado.pregunta_sugerida && (
            <div>
              <h4>Para seguir reflexionando</h4>
              <p className="pregunta">{resultado.pregunta_sugerida}</p>
            </div>
          )}

          {resultado.limitaciones && (
            <div className="limitaciones">
              <h4>Limitaciones del análisis</h4>
              <p>{resultado.limitaciones}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Estudiante

