import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeading } from '../../../components/SceniaUI'
import { generarGuia } from '../../../services/guias'
import Loading from '../../../components/Loading'
import ErrorMessage from '../../../components/ErrorMessage'

function Docente() {
  const [params] = useSearchParams()
  const [form, setForm] = useState({
    tema: params.get('tema') || '',
    objetivo: params.get('objetivo') || '',
    edad: Number(params.get('edad')) || 14,
    duracion: 30,
  })
  const [guia, setGuia] = useState(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setGuia(null)

    try {
      const data = await generarGuia({
        obra_id: 1,
        ...form,
      })
      setGuia(data.guia)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="container">
      <PageHeading eyebrow="DOCENTE · IA PEDAGÓGICA" title="Generador de Guías Pedagógicas">
        Diseña una propuesta antes, durante y después de la experiencia escénica.
      </PageHeading>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="tema">Tema o Concepto:</label>
            <input
              type="text"
              id="tema"
              name="tema"
              value={form.tema}
              onChange={handleChange}
              placeholder="Ej: La empatía en situaciones de conflicto"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="objetivo">Objetivo Pedagógico:</label>
            <textarea
              id="objetivo"
              name="objetivo"
              value={form.objetivo}
              onChange={handleChange}
              placeholder="¿Qué deseas que los estudiantes reflexionen o aprendan?"
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="edad">Edad Sugerida:</label>
              <input
                type="number"
                id="edad"
                name="edad"
                value={form.edad}
                onChange={handleChange}
                min={6}
                max={18}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="duracion">Duración (minutos):</label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                value={form.duracion}
                onChange={handleChange}
                min={15}
                max={120}
                required
              />
            </div>
          </div>

          <button type="submit" disabled={cargando}>
            {cargando ? 'Generando con IA...' : 'Generar Guía'}
          </button>
        </form>

        {cargando && <Loading mensaje="Generando tu guía pedagógica con IA..." />}
        {error && <ErrorMessage mensaje={error} />}

        {guia && (
          <div className="resultado">
            <h3>{guia.titulo || 'Guía Generada'}</h3>
            {guia.objetivo && (
              <p><strong>Objetivo pedagógico:</strong> {guia.objetivo}</p>
            )}
            {guia.introduccion && <p>{guia.introduccion}</p>}

            {guia.materiales && guia.materiales.length > 0 && (
              <div className="materiales-section">
                <h4>Materiales necesarios:</h4>
                <ul>
                  {guia.materiales.map((m, idx) => (
                    <li key={idx}>{m}</li>
                  ))}
                </ul>
              </div>
            )}

            {guia.personajes && guia.personajes.length > 0 && (
              <div className="personajes-section">
                <h4>Personajes para la dramatización:</h4>
                <div className="personajes-grid">
                  {guia.personajes.map((p, idx) => (
                    <div key={idx} className="personaje-card">
                      <strong>{p.nombre}:</strong> <span>{p.descripcion}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guia.escenas && guia.escenas.length > 0 && (
              <div className="escenas-section">
                <h4>Escenas y Dinámicas:</h4>
                <div className="momentos">
                  {guia.escenas.map((e, idx) => (
                    <div key={idx} className="momento">
                      <h5>{e.nombre} ({e.duracion_minutos || 10} min)</h5>
                      <p>{e.instrucciones}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {guia.momentos && (
              <div className="momentos">
                {guia.momentos.antes && (
                  <div className="momento">
                    <h4>Antes de la Obra</h4>
                    <p>{guia.momentos.antes}</p>
                  </div>
                )}
                {guia.momentos.durante && (
                  <div className="momento">
                    <h4>Durante la Obra</h4>
                    <p>{guia.momentos.durante}</p>
                  </div>
                )}
                {guia.momentos.despues && (
                  <div className="momento">
                    <h4>Después de la Obra</h4>
                    <p>{guia.momentos.despues}</p>
                  </div>
                )}
              </div>
            )}

            {(guia.preguntas_reflexion || guia.preguntas_debate) && (
              <div className="preguntas">
                <h4>Preguntas para la Reflexión y Debate:</h4>
                <ul>
                  {(guia.preguntas_reflexion || guia.preguntas_debate).map((p, idx) => (
                    <li key={idx}>{p}</li>
                  ))}
                </ul>
              </div>
            )}

            {guia.recomendaciones_docente && guia.recomendaciones_docente.length > 0 && (
              <div className="recomendaciones">
                <h4>Recomendaciones pedagógicas para el docente:</h4>
                <ul>
                  {guia.recomendaciones_docente.map((r, idx) => (
                    <li key={idx}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Docente
