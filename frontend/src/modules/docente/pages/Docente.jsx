import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
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

export default function Docente() {
  const [params] = useSearchParams()
  const [clases, setClases] = useState([])
  const [claseId, setClaseId] = useState(params.get('clase') || '')
  const [sesion, setSesion] = useState(params.get('sesion') || '')
  const [form, setForm] = useState({
    tema: params.get('tema') || 'bulling',
    objetivo: params.get('objetivo') || '',
    edad: Number(params.get('edad')) || 14,
    duracion: 30,
  })
  const [guia, setGuia] = useState(null)
  const [preguntasTexto, setPreguntasTexto] = useState('')
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState(null)
  const [aviso, setAviso] = useState(null)
  const [salida, setSalida] = useState({ obra: '', fecha: '', nota: '' })

  useEffect(() => {
    listarClases().then(setClases)
  }, [])

  const clase = clases.find((c) => c.id === claseId)
  const plantillas = sesion ? plantillasDeSesion(sesion) : []

  const handleChange = (e) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value, 10) : value,
    }))
  }

  const elegirClase = (id) => {
    setClaseId(id)
    const c = clases.find((x) => x.id === id)
    if (c) {
      setForm((prev) => ({
        ...prev,
        edad: edadPorGrado(c.grade),
        tema: prev.tema === 'bulling' ? (c.topic || prev.tema) : prev.tema,
      }))
    }
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
    <div className="dc-ai-generator-page">
      {/* Encabezado Principal fiel al diseño de la imagen */}
      <header className="dc-ai-header">
        <span className="dc-ai-eyebrow">TU ASISTENTE PEDAGÓGICO</span>
        <h1 className="dc-ai-title">Haz que tu próxima clase cobre vida.</h1>
        <p className="dc-ai-subtitle">
          Prepara una propuesta teatral y revísala antes de llevarla al aula.
        </p>
        <p className="dc-ai-caption">
          Este formulario utiliza tu backend y Gemini. La respuesta es una propuesta para revisión docente.
        </p>
      </header>

      {/* Tarjeta del Formulario (Fiel a la captura) */}
      <div className="dc-ai-card">
        <form onSubmit={handleSubmit} className="dc-ai-form">
          {/* Campo: Tema */}
          <div className="dc-ai-field-group">
            <label htmlFor="tema" className="dc-ai-label">Tema</label>
            <input
              type="text"
              id="tema"
              name="tema"
              className="dc-ai-input-tema"
              value={form.tema}
              onChange={handleChange}
              placeholder="bulling"
              required
            />
          </div>

          {/* Campo: Objetivo Pedagógico */}
          <div className="dc-ai-field-group">
            <label htmlFor="objetivo" className="dc-ai-label">Objetivo pedagógico</label>
            <textarea
              id="objetivo"
              name="objetivo"
              className="dc-ai-textarea-objetivo"
              rows={3}
              value={form.objetivo}
              onChange={handleChange}
              placeholder="Ej: Promover la empatía y prevenir el acoso"
              required
            />
          </div>

          {/* Fila: Edad y Duración */}
          <div className="dc-ai-grid-2">
            <div className="dc-ai-field-group">
              <label htmlFor="edad" className="dc-ai-label">Edad (años)</label>
              <input
                type="number"
                id="edad"
                name="edad"
                className="dc-ai-input-number"
                value={form.edad}
                onChange={handleChange}
                min={6}
                max={18}
                required
              />
            </div>

            <div className="dc-ai-field-group">
              <label htmlFor="duracion" className="dc-ai-label">Duración (minutos)</label>
              <input
                type="number"
                id="duracion"
                name="duracion"
                className="dc-ai-input-number"
                value={form.duracion}
                onChange={handleChange}
                min={15}
                max={120}
                required
              />
            </div>
          </div>

          {/* Vinculación opcional con clase o programa */}
          <div className="dc-ai-extra-options">
            <div className="dc-ai-inline-select">
              <label htmlFor="clase">Vincular a un aula (opcional):</label>
              <select
                id="clase"
                value={claseId}
                onChange={(e) => elegirClase(e.target.value)}
                className="dc-ai-select"
              >
                <option value="">Guía abierta (sin aula específica)</option>
                {clases.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.grade} {c.section} · {c.subject}
                  </option>
                ))}
              </select>
            </div>

            <div className="dc-ai-inline-select">
              <label htmlFor="sesion">Sesión del Programa (opcional):</label>
              <select
                id="sesion"
                value={sesion}
                onChange={(e) => elegirSesion(e.target.value)}
                className="dc-ai-select"
              >
                <option value="">Ninguna</option>
                {SESIONES.map((s) => (
                  <option key={s.n} value={s.n}>
                    {nombreSesion(s)}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botón de Acción Principal (Pill Rojo) */}
          <div className="dc-ai-action-row">
            <button
              type="submit"
              className="dc-ai-btn-generar"
              disabled={cargando}
            >
              {cargando ? 'Generando propuesta...' : 'Generar guía'}
            </button>
          </div>
        </form>

        {/* Feedback de Carga */}
        {cargando && (
          <div className="dc-ai-loading-box">
            <Loading mensaje="Consultando Gemini y articulando competencias CNEB para tu guía..." />
          </div>
        )}

        {error && <ErrorMessage mensaje={error} />}
        {aviso && <div className="dc-ok" role="status">{aviso}</div>}

        {/* Guía Generada con Editor Manual y Sugerencias de Obras */}
        {guia && (
          <section className="dc-ai-resultado-section">
            <header className="dc-ai-resultado-header">
              <div>
                <span className="eyebrow">PROPUESTA PEDAGÓGICA GENERADA</span>
                <h2>{guia.titulo || 'Guía Pedagógica CNEB'}</h2>
                <span className="dc-muted">
                  Puedes editar cualquier sección manualmente antes de guardarla o descargarla en PDF.
                </span>
              </div>
              <div className="dc-toolbar-buttons">
                <button
                  type="button"
                  className="dc-btn"
                  onClick={() => window.print()}
                >
                  <Icon name="chart" size={16} /> Exportar a PDF
                </button>
                <button
                  type="button"
                  className="dc-btn primary"
                  onClick={() =>
                    accion(
                      () => guardarGuia({ claseId, sesion, guia: guiaFinal() }),
                      'Guía guardada con éxito en tu panel pedagógico.',
                    )
                  }
                >
                  <Icon name="check" size={16} /> Guardar Guía
                </button>
              </div>
            </header>

            <div className="dc-editor-form">
              <div className="form-group">
                <label htmlFor="g-titulo">Título de la Guía</label>
                <input
                  id="g-titulo"
                  className="dc-input-muro"
                  value={guia.titulo || ''}
                  onChange={(e) => editarGuia('titulo', e.target.value)}
                />
              </div>

              <div className="dc-form-grid-2">
                <div className="form-group">
                  <label htmlFor="g-comp">Competencia CNEB</label>
                  <input
                    id="g-comp"
                    className="dc-input-muro"
                    value={guia.competencia || 'Se comunica oralmente en su lengua materna'}
                    onChange={(e) => editarGuia('competencia', e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="g-cap">Capacidad Asociada</label>
                  <input
                    id="g-cap"
                    className="dc-input-muro"
                    value={guia.capacidad || 'Adecúa, organiza y desarrolla las ideas de forma reflexiva'}
                    onChange={(e) => editarGuia('capacidad', e.target.value)}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="g-intro">Introducción y Contextualización</label>
                <textarea
                  id="g-intro"
                  className="dc-textarea-muro"
                  rows={3}
                  value={guia.introduccion || ''}
                  onChange={(e) => editarGuia('introduccion', e.target.value)}
                />
              </div>

              <h4 className="dc-section-title">Momentos de la Propuesta Teatral</h4>

              <div className="form-group">
                <label htmlFor="g-antes">1. Antes de la Función (En el Aula)</label>
                <textarea
                  id="g-antes"
                  className="dc-textarea-muro"
                  rows={3}
                  value={guia.momentos?.antes || ''}
                  onChange={(e) => editarMomento('antes', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="g-durante">2. Durante la Función (Foco de Atención)</label>
                <textarea
                  id="g-durante"
                  className="dc-textarea-muro"
                  rows={3}
                  value={guia.momentos?.durante || ''}
                  onChange={(e) => editarMomento('durante', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="g-despues">3. Después de la Función (Reflexión y Bitácora)</label>
                <textarea
                  id="g-despues"
                  className="dc-textarea-muro"
                  rows={3}
                  value={guia.momentos?.despues || ''}
                  onChange={(e) => editarMomento('despues', e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="g-preguntas">Preguntas para el Diálogo (una por línea)</label>
                <textarea
                  id="g-preguntas"
                  className="dc-textarea-muro"
                  rows={4}
                  value={preguntasTexto}
                  onChange={(e) => setPreguntasTexto(e.target.value)}
                />
              </div>

              {/* CAJA DE SUGERENCIAS INTELIGENTES DE OBRAS ALTERNATIVAS */}
              <div className="dc-sugerencias-box">
                <div className="dc-sugerencias-header">
                  <span className="dc-sparkle">💡</span>
                  <div>
                    <strong>Sugerencias Inteligentes de Obras Alternativas</strong>
                    <p>
                      ¿No encuentras una obra en cartelera que se adapte exactamente a "{form.tema}"?
                      La IA te sugiere estas alternativas escénicas adaptadas para el aula:
                    </p>
                  </div>
                </div>

                <div className="dc-sugerencias-cards">
                  {(guia.sugerenciasAlternativas || [
                    {
                      titulo: `Adaptación en el aula: "El silencio roto"`,
                      justificacion:
                        'Libreto de 3 escenas breves para lectura dramatizada escolar que aborda el acoso y la empatía.',
                    },
                    {
                      titulo: 'Espejo de dos caras (Teatro Imagen)',
                      justificacion:
                        'Dinámica teatral donde los estudiantes recrean una situación de exclusión y proponen soluciones corporales.',
                    },
                  ]).map((sug, sIdx) => (
                    <div key={sIdx} className="dc-sug-item">
                      <span className="dc-sug-badge">Opción adaptada</span>
                      <strong>{sug.titulo}</strong>
                      <p>{sug.justificacion}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tareas del Programa */}
              {clase && plantillas.length > 0 && (
                <div className="dc-actions" style={{ marginTop: 16 }}>
                  <button
                    type="button"
                    className="dc-btn"
                    onClick={() =>
                      accion(
                        async () => {
                          await asignarTareasSesion(clase.id, sesion)
                        },
                        `Tareas de la sesión ${sesion} asignadas a ${clase.grade} ${clase.section}.`,
                      )
                    }
                  >
                    Asignar a {clase.grade} {clase.section} las {plantillas.length} tareas de la sesión {sesion}
                  </button>
                </div>
              )}

              {/* Aviso de Salida al Teatro */}
              <section className="dc-block" style={{ marginTop: 20 }}>
                <h3>Salida al teatro vinculada (opcional)</h3>
                <p className="dc-muted">
                  Si vas a llevar a tu aula a ver una obra relacionada a este tema, registra aquí la salida:
                </p>
                <div className="dc-form">
                  <input
                    value={salida.obra}
                    onChange={(e) => setSalida({ ...salida, obra: e.target.value })}
                    placeholder="Obra a la que asistirán (ej. Otras voces, un mismo patio)"
                    aria-label="Obra"
                  />
                  <input
                    type="date"
                    value={salida.fecha}
                    onChange={(e) => setSalida({ ...salida, fecha: e.target.value })}
                    aria-label="Fecha"
                  />
                  <input
                    value={salida.nota}
                    onChange={(e) => setSalida({ ...salida, nota: e.target.value })}
                    placeholder="Nota o indicación pedagógica adicional"
                    aria-label="Nota"
                  />
                  <div>
                    <button
                      type="button"
                      className="dc-btn primary"
                      onClick={() =>
                        accion(
                          () => registrarAviso({ claseId, ...salida }),
                          'Aviso de salida registrado en el panel del aula.',
                        )
                      }
                    >
                      Avisar salida al teatro
                    </button>
                  </div>
                </div>
              </section>
            </div>
          </section>
        )}
      </div>

      {/* Versión para Impresión Limpia en PDF */}
      {guia && (
        <div className="dc-print-only">
          <h1>{guia.titulo || 'Guía Pedagógica CNEB'}</h1>
          {clase && <p>{clase.grade} {clase.section} · {clase.subject}</p>}
          {guia.introduccion && <p>{guia.introduccion}</p>}
          {[['antes', '1. Antes de la Obra'], ['durante', '2. Durante la Obra'], ['despues', '3. Después de la Obra']].map(([clave, titulo]) => (
            guia.momentos?.[clave] ? (
              <div key={clave} style={{ marginBottom: 16 }}>
                <h2>{titulo}</h2>
                <p>{guia.momentos[clave]}</p>
              </div>
            ) : null
          ))}
          {guiaFinal().preguntas_debate.length > 0 && (
            <div style={{ marginTop: 16 }}>
              <h2>Preguntas para el Diálogo y Debate</h2>
              <ul>
                {guiaFinal().preguntas_debate.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
