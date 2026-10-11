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
      const g = data.guia || {}
      setGuia(g)
      const preguntas = g.preguntas_reflexion || g.preguntas_debate || []
      setPreguntasTexto(Array.isArray(preguntas) ? preguntas.join('\n') : '')
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
          <div className="dc-guia-container">
            {/* Header del Kit Generado */}
            <div className="dc-guia-header-card">
              <div className="dc-guia-badge">
                <span className="dc-sparkle">✦</span> KIT PEDAGÓGICO GENERADO POR IA
              </div>
              <div className="dc-guia-title-edit">
                <label className="dc-label-inline">TÍTULO DE LA EXPERIENCIA TEATRAL</label>
                <input
                  className="dc-input-hero"
                  value={guia.titulo || ''}
                  onChange={(e) => editarGuia('titulo', e.target.value)}
                  placeholder="Título de la obra o dinámica"
                />
              </div>
              <div className="dc-guia-meta-chips">
                <span className="dc-meta-chip">🎭 {form.tema || 'Convivencia escolar'}</span>
                <span className="dc-meta-chip">👥 {form.edad} años</span>
                <span className="dc-meta-chip">⏱️ {form.duracion} minutos</span>
                <span className="dc-meta-chip-edit">✏️ Editable en tiempo real</span>
              </div>
            </div>

            {/* Objetivo Pedagógico */}
            <div className="dc-card-section">
              <div className="dc-section-title">
                <span className="dc-section-icon">🎯</span>
                <div>
                  <h4>Objetivo Pedagógico</h4>
                  <small>Alineado a las competencias del Currículo Nacional</small>
                </div>
              </div>
              <textarea
                className="dc-textarea-styled"
                rows={2}
                value={guia.objetivo || ''}
                onChange={(e) => editarGuia('objetivo', e.target.value)}
                placeholder="Objetivo pedagógico de la experiencia teatral"
              />
            </div>

            {/* Materiales y Recursos */}
            <div className="dc-card-section">
              <div className="dc-section-title">
                <span className="dc-section-icon">📦</span>
                <div>
                  <h4>Materiales y Espacio</h4>
                  <small>Recursos requeridos en el aula o escenario</small>
                </div>
              </div>
              <div className="dc-items-list">
                {(guia.materiales || []).map((mat, idx) => (
                  <div key={idx} className="dc-item-row">
                    <span className="dc-bullet">•</span>
                    <input
                      className="dc-input-item"
                      value={mat}
                      onChange={(e) => {
                        const nuevos = [...(guia.materiales || [])]
                        nuevos[idx] = e.target.value
                        editarGuia('materiales', nuevos)
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Personajes de la Dinámica */}
            {guia.personajes && guia.personajes.length > 0 && (
              <div className="dc-card-section">
                <div className="dc-section-title">
                  <span className="dc-section-icon">🎭</span>
                  <div>
                    <h4>Elenco y Personajes para Estudiantes</h4>
                    <small>Roles diseñados para fomentar la empatía y la toma de perspectiva</small>
                  </div>
                </div>
                <div className="dc-personajes-grid">
                  {guia.personajes.map((p, idx) => (
                    <div key={idx} className="dc-personaje-card">
                      <div className="dc-personaje-badge">Rol #{idx + 1}</div>
                      <input
                        className="dc-personaje-nombre"
                        value={p.nombre || ''}
                        onChange={(e) => {
                          const nuevos = [...guia.personajes]
                          nuevos[idx] = { ...nuevos[idx], nombre: e.target.value }
                          editarGuia('personajes', nuevos)
                        }}
                        placeholder="Nombre del personaje"
                      />
                      <textarea
                        className="dc-personaje-desc"
                        rows={3}
                        value={p.descripcion || ''}
                        onChange={(e) => {
                          const nuevos = [...guia.personajes]
                          nuevos[idx] = { ...nuevos[idx], descripcion: e.target.value }
                          editarGuia('personajes', nuevos)
                        }}
                        placeholder="Descripción y conflicto del personaje"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Estructura Escénica: Momentos / Escenas */}
            <div className="dc-card-section">
              <div className="dc-section-title">
                <span className="dc-section-icon">🎬</span>
                <div>
                  <h4>Estructura de la Dinámica Escénica</h4>
                  <small>Secuencia dramática paso a paso adaptada al tiempo de clase</small>
                </div>
              </div>

              {guia.escenas && guia.escenas.length > 0 ? (
                <div className="dc-escenas-timeline">
                  {guia.escenas.map((esc, idx) => (
                    <div key={idx} className="dc-escena-item">
                      <div className="dc-escena-num">{idx + 1}</div>
                      <div className="dc-escena-content">
                        <div className="dc-escena-header">
                          <input
                            className="dc-escena-titulo"
                            value={esc.nombre || ''}
                            onChange={(e) => {
                              const nuevas = [...guia.escenas]
                              nuevas[idx] = { ...nuevas[idx], nombre: e.target.value }
                              editarGuia('escenas', nuevas)
                            }}
                            placeholder="Nombre del momento o escena"
                          />
                          <div className="dc-escena-minutos">
                            <input
                              type="number"
                              className="dc-min-input"
                              value={esc.duracion_minutos || 10}
                              onChange={(e) => {
                                const nuevas = [...guia.escenas]
                                nuevas[idx] = { ...nuevas[idx], duracion_minutos: Number(e.target.value) }
                                editarGuia('escenas', nuevas)
                              }}
                            />
                            <span>min</span>
                          </div>
                        </div>
                        <textarea
                          className="dc-escena-instrucciones"
                          rows={3}
                          value={esc.instrucciones || ''}
                          onChange={(e) => {
                            const nuevas = [...guia.escenas]
                            nuevas[idx] = { ...nuevas[idx], instrucciones: e.target.value }
                            editarGuia('escenas', nuevas)
                          }}
                          placeholder="Instrucciones para los participantes y el docente"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="dc-momentos-fallback">
                  {[['antes', '1. Antes de la Obra (Preparación)'], ['durante', '2. Durante la Obra (Experiencia)'], ['despues', '3. Después de la Obra (Reflexión)']].map(([clave, titulo]) => (
                    <div className="form-group" key={clave} style={{ marginBottom: 14 }}>
                      <label style={{ fontWeight: 600 }}>{titulo}</label>
                      <textarea
                        className="dc-textarea-styled"
                        rows={3}
                        value={guia.momentos?.[clave] || ''}
                        onChange={(e) => editarMomento(clave, e.target.value)}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Preguntas de Diálogo y Reflexión */}
            <div className="dc-card-section">
              <div className="dc-section-title">
                <span className="dc-section-icon">💬</span>
                <div>
                  <h4>Preguntas para el Diálogo y Debate Guiado</h4>
                  <small>Detonadores de empatía y pensamiento crítico para los estudiantes</small>
                </div>
              </div>
              <div className="dc-preguntas-box">
                <textarea
                  className="dc-textarea-styled"
                  rows={5}
                  value={preguntasTexto}
                  onChange={(e) => setPreguntasTexto(e.target.value)}
                  placeholder="Escribe una pregunta por línea..."
                />
                <span className="dc-tip-badge">💡 Puedes agregar o editar preguntas (una por renglón)</span>
              </div>
            </div>

            {/* Recomendaciones Pedagógicas para el Docente */}
            {guia.recomendaciones_docente && guia.recomendaciones_docente.length > 0 && (
              <div className="dc-card-section dc-recom-box">
                <div className="dc-section-title">
                  <span className="dc-section-icon">✨</span>
                  <div>
                    <h4>Recomendaciones para el Docente</h4>
                    <small>Cuidado pedagógico, contención emocional y clima seguro</small>
                  </div>
                </div>
                <div className="dc-recom-list">
                  {guia.recomendaciones_docente.map((rec, idx) => (
                    <div key={idx} className="dc-recom-item">
                      <span className="dc-recom-check">✓</span>
                      <textarea
                        className="dc-input-item-auto"
                        rows={2}
                        value={rec}
                        onChange={(e) => {
                          const nuevas = [...guia.recomendaciones_docente]
                          nuevas[idx] = e.target.value
                          editarGuia('recomendaciones_docente', nuevas)
                        }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Barra de Acciones del Docente */}
            <div className="dc-footer-actions">
              <button
                type="button"
                className="btn"
                style={{ padding: '12px 28px', fontSize: '15px' }}
                onClick={() => accion(() => guardarGuia({ claseId, sesion, guia: guiaFinal() }), '✓ ¡Guía pedagógica guardada con éxito!')}
              >
                💾 Guardar Guía Editada
              </button>
              <button type="button" className="btn btn-white" onClick={() => window.print()}>
                📄 Exportar a PDF / Imprimir
              </button>
              {clase && plantillas.length > 0 && (
                <button
                  type="button"
                  className="btn btn-outline-light"
                  style={{ color: 'var(--ink)', borderColor: 'var(--line)' }}
                  onClick={() => accion(async () => { await asignarTareasSesion(clase.id, sesion) }, `✓ Tareas de la sesión ${sesion} asignadas a ${clase.grade} ${clase.section}.`)}
                >
                  Asignar a {clase.grade} {clase.section}
                </button>
              )}
            </div>

            {/* Versión para Impresión Limpia */}
            <div className="dc-print-only">
              <h1>{guia.titulo || 'Guía pedagógica'}</h1>
              {clase && <p>{clase.grade} {clase.section} · {clase.subject}</p>}
              <p><strong>Objetivo:</strong> {guia.objetivo}</p>
              <h2>Estructura de la Experiencia</h2>
              {(guia.escenas || []).map((e, idx) => (
                <div key={idx} style={{ marginBottom: 12 }}>
                  <h3>{idx + 1}. {e.nombre} ({e.duracion_minutos} min)</h3>
                  <p>{e.instrucciones}</p>
                </div>
              ))}
              <h2>Preguntas para el Diálogo</h2>
              <ul>
                {preguntasTexto.split('\n').filter(Boolean).map((q, i) => (
                  <li key={i}>{q}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Docente
