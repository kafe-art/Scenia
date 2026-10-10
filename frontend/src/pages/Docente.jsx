import { useState } from 'react'
import { generarGuia } from '../services/guias'
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function Docente() {
  const [form, setForm] = useState({
    tema: '',
    objetivo: '',
    edad: 12,
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
      const data = await generarGuia(form)
      setGuia(data.guia)
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  return (
    <div className="page">
      <h2>Vista Docente</h2>
      <p>Genera una guía teatral para tu actividad de convivencia escolar.</p>

      <form onSubmit={handleSubmit} className="form">
        <label>
          Tema
          <input
            name="tema"
            value={form.tema}
            onChange={handleChange}
            required
            placeholder="Ej: Convivencia escolar"
          />
        </label>

        <label>
          Objetivo pedagógico
          <textarea
            name="objetivo"
            value={form.objetivo}
            onChange={handleChange}
            required
            placeholder="Ej: Promover la empatía y prevenir el acoso"
            rows={3}
          />
        </label>

        <div className="form-row">
          <label>
            Edad (años)
            <input
              type="number"
              name="edad"
              value={form.edad}
              onChange={handleChange}
              min={6}
              max={18}
              required
            />
          </label>
          <label>
            Duración (minutos)
            <input
              type="number"
              name="duracion"
              value={form.duracion}
              onChange={handleChange}
              min={5}
              max={120}
              required
            />
          </label>
        </div>

        <button type="submit" disabled={cargando}>
          {cargando ? 'Generando...' : 'Generar guía'}
        </button>
      </form>

      {cargando && <Loading mensaje="Generando guía con IA..." />}
      {error && <ErrorMessage mensaje={error} />}

      {guia && (
        <div className="guia-resultado">
          <h3>{guia.titulo}</h3>
          <p>
            <strong>Objetivo:</strong> {guia.objetivo}
          </p>

          {guia.materiales && (
            <div>
              <h4>Materiales</h4>
              <ul>
                {guia.materiales.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
          )}

          {guia.personajes && (
            <div>
              <h4>Personajes</h4>
              <ul>
                {guia.personajes.map((p, i) => (
                  <li key={i}>
                    <strong>{p.nombre}:</strong> {p.descripcion}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {guia.escenas && (
            <div>
              <h4>Escenas</h4>
              {guia.escenas.map((e, i) => (
                <div key={i} className="escena">
                  <h5>
                    {e.nombre} ({e.duracion_minutos} min)
                  </h5>
                  <p>{e.instrucciones}</p>
                </div>
              ))}
            </div>
          )}

          {guia.preguntas_reflexion && (
            <div>
              <h4>Preguntas de reflexión</h4>
              <ol>
                {guia.preguntas_reflexion.map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ol>
            </div>
          )}

          {guia.recomendaciones_docente && (
            <div>
              <h4>Recomendaciones para el docente</h4>
              <ul>
                {guia.recomendaciones_docente.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default Docente

