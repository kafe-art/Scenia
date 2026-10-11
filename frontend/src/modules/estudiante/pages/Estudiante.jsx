import { useState } from 'react'
import { analizarReflexion } from '../../../services/reflexiones'
import Loading from '../../../components/Loading'
import ErrorMessage from '../../../components/ErrorMessage'

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
    <div className="container">
      <div className="card">
        <h2>Mi Espacio de Reflexión</h2>
        <p>Escribe tu reflexión sobre la obra de teatro que viste.</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="reflexion">Tu Reflexión:</label>
            <textarea
              id="reflexion"
              value={reflexion}
              onChange={(e) => setReflexion(e.target.value)}
              placeholder="¿Qué te hizo sentir la obra? ¿Qué aprendiste de los personajes?"
              required
            />
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Analizando...' : 'Enviar Reflexión'}
          </button>
        </form>

        {cargando && <Loading mensaje="Analizando tu reflexión con IA..." />}
        {error && <ErrorMessage mensaje={error} />}

        {resultado && (
          <div className="resultado">
            <h3>Retroalimentación</h3>
            {resultado.emociones_detectadas && (
              <p>
                <strong>Emociones identificadas:</strong>{' '}
                {resultado.emociones_detectadas.join(', ')}
              </p>
            )}
            {resultado.nivel_empatia && (
              <p>
                <strong>Nivel de empatía:</strong> {resultado.nivel_empatia}
              </p>
            )}
            {resultado.retroalimentacion && (
              <p>
                <strong>Comentario:</strong> {resultado.retroalimentacion}
              </p>
            )}
            {resultado.pregunta_profundizacion && (
              <div className="pregunta-guia">
                <strong>Para seguir pensando:</strong>
                <p>{resultado.pregunta_profundizacion}</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Estudiante
