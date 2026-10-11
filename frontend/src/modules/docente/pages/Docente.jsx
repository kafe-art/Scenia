import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageHeading } from '../../../components/SceniaUI'
import { generarGuia } from '../../../services/guias'
import Loading from '../../../components/Loading'
import ErrorMessage from '../../../components/ErrorMessage'
import { SESIONES, nombreSesion, plantillasDeSesion, sesionPorN } from '../data/programa'
import {
  asignarTareasSesion,
  edadPorGrado,
  guardarGuia,
  listarClases,
  registrarAviso,
} from '../services/clases'

function Docente() {
  const [params] = useSearchParams()
  const [clases, setClases] = useState([])
  const [claseId, setClaseId] = useState(params.get('clase') || '')
  const [sesion, setSesion] = useState(params.get('sesion') || '')
  const [form, setForm] = useState({
    tema: params.get('tema') || '',
    objetivo: params.get('objetivo') || '',
    edad: Number(params.get('edad')) || 14,
    duracion: 30,
  })
  const [guia, setGuia] = useState(null)
  const [preguntasTexto, setPreguntasTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null) // mensaje de confirmación
  const [salida, setSalida] = useState({ obra: '', fecha: '', nota: '' })

  useEffect(() => {
    listarClases().then(setClases)
  }, [])

  const clase = clases.find((c) => c.id === claseId)
  const sesionElegida = sesion ? sesionPorN(sesion) : null
  const plantillas = sesion ? plantillasDeSesion(sesion) : []

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }))
  }

  // Al elegir clase, la edad sale del grado; al elegir sesión, el tema y el objetivo salen del programa.
  const elegirClase = (id) => {
    setClaseId(id)
    const c = clases.find((x) => x.id === id)
    if (c) setForm((prev) => ({ ...prev, edad: edadPorGrado(c.grade), tema: prev.tema || c.topic }))
  }

  const elegirSesion = (n) => {
    setSesion(n)
    const s = n ? sesionPorN(n) : null
    if (s) {
      setForm((prev) => ({
        ...prev,
        tema: s.titulo ? `${s.pilar}: ${s.titulo}` : `${s.pilar} (sesión ${s.n})`,
        objetivo: s.objetivo || prev.objetivo,
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError(null)
    setGuia(null)
    setAviso(null)

    try {
      const data = await generarGuia({
        obra_id: 1,
        ...form,
      })
      setGuia(data.guia)
      setPreguntasTexto((data.guia.preguntas_debate || []).join('\n'))
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }

  const editarGuia = (campo, valor) => setGuia((g) => ({ ...g, [campo]: valor }))
  const editarMomento = (momento, valor) =>
    setGuia((g) => ({ ...g, momentos: { ...g.momentos, [momento]: valor } }))

  const guiaFinal = () => ({
    ...guia,
    preguntas_debate: preguntasTexto.split('\n').map((p) => p.trim()).filter(Boolean),
  })

  const accion = async (fn, mensaje) => {
    setError(null)
    setAviso(null)
    try {
      await fn()
      setAviso(mensaje)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="container">
      <PageHeading eyebrow="DOCENTE · IA PEDAGÓGICA" title="Generador de Guías Pedagógicas">
        Diseña una propuesta antes, durante y después de la experiencia escénica.
      </PageHeading>

      <div className="card">
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="clase">Clase:</label>
              <select id="clase" value={claseId} onChange={(e) => elegirClase(e.target.value)}>
                <option value="">Sin clase (guía suelta)</option>
                {clases.map((c) => (
                  <option key={c.id} value={c.id}>{c.grade} {c.section} · {c.subject}</option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="sesion">Sesión de Voces que Transforman:</label>
              <select id="sesion" value={sesion} onChange={(e) => elegirSesion(e.target.value)}>
                <option value="">Ninguna</option>
                {SESIONES.map((s) => (
                  <option key={s.n} value={s.n}>{nombreSesion(s)}</option>
                ))}
              </select>
            </div>
          </div>

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
        {aviso && <div className="dc-ok" role="status">{aviso}</div>}

        {guia && (
          <>
            {/* Versión editable (pantalla) */}
            <div className="resultado">
              <p className="dc-muted">Puedes editar cualquier parte de la guía antes de guardarla o imprimirla.</p>
              <div className="form-group">
                <label htmlFor="g-titulo">Título</label>
                <input id="g-titulo" value={guia.titulo || ''} onChange={(e) => editarGuia('titulo', e.target.value)} />
              </div>
              <div className="form-group">
                <label htmlFor="g-intro">Introducción</label>
                <textarea id="g-intro" rows={3} value={guia.introduccion || ''} onChange={(e) => editarGuia('introduccion', e.target.value)} />
              </div>
              {[['antes', 'Antes de la Obra'], ['durante', 'Durante la Obra'], ['despues', 'Después de la Obra']].map(([clave, titulo]) => (
                <div className="form-group" key={clave}>
                  <label htmlFor={`g-${clave}`}>{titulo}</label>
                  <textarea id={`g-${clave}`} rows={4} value={guia.momentos?.[clave] || ''} onChange={(e) => editarMomento(clave, e.target.value)} />
                </div>
              ))}
              <div className="form-group">
                <label htmlFor="g-preguntas">Preguntas para el Diálogo (una por línea)</label>
                <textarea id="g-preguntas" rows={4} value={preguntasTexto} onChange={(e) => setPreguntasTexto(e.target.value)} />
              </div>

              <div className="dc-actions" style={{ margin: '12px 0' }}>
                <button type="button" className="dc-btn primary" onClick={() => accion(() => guardarGuia({ claseId, sesion, guia: guiaFinal() }), 'Guía guardada en tu panel.')}>
                  Guardar guía
                </button>
                <button type="button" className="dc-btn" onClick={() => window.print()}>Exportar a PDF</button>
                {clase && plantillas.length > 0 && (
                  <button
                    type="button"
                    className="dc-btn"
                    onClick={() => accion(async () => { await asignarTareasSesion(clase.id, sesion) }, `Tareas de la sesión ${sesion} asignadas a ${clase.grade} ${clase.section}.`)}
                  >
                    Asignar a {clase.grade} {clase.section} las {plantillas.length} tareas de la sesión {sesion}
                  </button>
                )}
              </div>
              {sesionElegida && !plantillas.length && (
                <p className="dc-muted">Esta sesión aún no tiene tareas definidas en el programa.</p>
              )}

              <section className="dc-block">
                <h3>Salida al teatro (opcional)</h3>
                <p className="dc-muted">
                  La guía puede recomendar asistir a una obra. Si decides ir con tu clase, avisa aquí.
                </p>
                <div className="dc-form">
                  <input value={salida.obra} onChange={(e) => setSalida({ ...salida, obra: e.target.value })} placeholder="Obra a la que asistirás" aria-label="Obra" />
                  <input type="date" value={salida.fecha} onChange={(e) => setSalida({ ...salida, fecha: e.target.value })} aria-label="Fecha" />
                  <input value={salida.nota} onChange={(e) => setSalida({ ...salida, nota: e.target.value })} placeholder="Nota (opcional)" aria-label="Nota" />
                  <div>
                    <button
                      type="button"
                      className="dc-btn primary"
                      onClick={() => accion(() => registrarAviso({ claseId, ...salida }), 'Aviso registrado: irás a la función con tu clase.')}
                    >
                      Avisar que asistiré
                    </button>
                  </div>
                </div>
              </section>
            </div>

            {/* Versión de solo lectura que es la que se imprime */}
            <div className="dc-print-only">
              <h1>{guia.titulo || 'Guía pedagógica'}</h1>
              {clase && <p>{clase.grade} {clase.section} · {clase.subject}</p>}
              {guia.introduccion && <p>{guia.introduccion}</p>}
              {[['antes', 'Antes de la Obra'], ['durante', 'Durante la Obra'], ['despues', 'Después de la Obra']].map(([clave, titulo]) => (
                guia.momentos?.[clave] ? <div key={clave}><h2>{titulo}</h2><p>{guia.momentos[clave]}</p></div> : null
              ))}
              {guiaFinal().preguntas_debate.length > 0 && (
                <>
                  <h2>Preguntas para el Diálogo</h2>
                  <ul>{guiaFinal().preguntas_debate.map((p, i) => <li key={i}>{p}</li>)}</ul>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export default Docente
