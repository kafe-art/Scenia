import { useState } from 'react'
import { Icon } from '../../../components/SceniaUI'
import { generarGuia } from '../../../services/guias'
import { guardarGuia, edadPorGrado } from '../services/clases'

export default function TemarioCneb({ clase, ejecutar }) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [unidadSeleccionada, setUnidadSeleccionada] = useState(null)
  const [generando, setGenerando] = useState(false)
  const [guiaActiva, setGuiaActiva] = useState(null)
  const [preguntasTexto, setPreguntasTexto] = useState('')
  const [avisoGuardado, setAvisoGuardado] = useState(null)

  // Formulario para solicitar a la IA
  const [formIA, setFormIA] = useState({
    tema: '',
    objetivo: '',
    duracion: 45,
  })

  const unidades = clase.unidades || []
  const edadClase = edadPorGrado(clase.grade)

  const abrirGeneradorParaUnidad = (unidad) => {
    setUnidadSeleccionada(unidad)
    setFormIA({
      tema: unidad.titulo,
      objetivo: `Desarrollar la competencia CNEB "${unidad.competencia}" mediante la apreciación dramática y la reflexión crítica en el aula.`,
      duracion: 45,
    })
    setGuiaActiva(null)
    setAvisoGuardado(null)
    setModalAbierto(true)
  }

  const verGuiaExistente = (unidad) => {
    // Buscar si hay guía vinculada o crear una vista editable directa
    setUnidadSeleccionada(unidad)
    const guiaDemo = {
      titulo: `Guía Pedagógica CNEB: ${unidad.titulo}`,
      competencia: unidad.competencia,
      capacidad: unidad.capacidad,
      edadSugerida: edadClase,
      duracionMinutos: 45,
      introduccion: `Planificación curricular alineada al CNEB para secundaria. Aborda la expresión dramática y la resolución pacífica de conflictos con enfoque en ${unidad.obraRecomendada}.`,
      momentos: {
        antes:
          'Dinámica de caldeamiento corporal y juego de confianza "El lazarillo escénico". Discusión inicial sobre las expectativas frente a la obra.',
        durante:
          'Observación atenta de las acciones del personaje principal en el nudo dramático. Registro mental de los puntos de quiebre en la trama.',
        despues:
          'Asamblea reflexiva y grabación de la bitácora de audio de 1 minuto en la plataforma respondiendo a las preguntas de debate.',
      },
      preguntas_debate: [
        '¿Qué motivó las acciones del personaje central?',
        '¿De qué manera esta historia refleja vivencias de nuestro grupo o colegio?',
        '¿Qué alternativas de diálogo habrían cambiado el desenlace?',
      ],
      sugerenciasAlternativas: [
        {
          titulo: 'El patio de atrás (Lectura dramatizada en aula)',
          justificacion:
            'Si el aforo está completo o no se cuenta con función presencial inmediata, esta adaptación teatral puede ser leída y actuada en el salón.',
        },
      ],
    }
    setGuiaActiva(guiaDemo)
    setPreguntasTexto(guiaDemo.preguntas_debate.join('\n'))
    setAvisoGuardado(null)
    setModalAbierto(true)
  }

  const handleGenerarIA = async (e) => {
    e.preventDefault()
    setGenerando(true)
    setAvisoGuardado(null)
    try {
      const data = await generarGuia({
        tema: formIA.tema,
        objetivo: formIA.objetivo,
        edad: edadClase,
        duracion: formIA.duracion,
      })
      if (data?.guia) {
        setGuiaActiva(data.guia)
        setPreguntasTexto((data.guia.preguntas_debate || []).join('\n'))
      }
    } catch (err) {
      alert('Error al generar la guía: ' + err.message)
    } finally {
      setGenerando(false)
    }
  }

  const handleGuardarGuia = async () => {
    if (!guiaActiva) return
    const guiaFinal = {
      ...guiaActiva,
      preguntas_debate: preguntasTexto.split('\n').map((p) => p.trim()).filter(Boolean),
    }

    await ejecutar(async () => {
      await guardarGuia({
        claseId: clase.id,
        sesion: unidadSeleccionada?.numero || 1,
        guia: guiaFinal,
      })
    })

    setAvisoGuardado('¡Guía pedagógica guardada con éxito en el curso!')
    setTimeout(() => setAvisoGuardado(null), 4000)
  }

  const handleImprimirPDF = () => {
    window.print()
  }

  return (
    <div className="dc-temario-wrapper">
      {/* Encabezado del Temario */}
      <section className="dc-temario-intro">
        <div className="dc-temario-intro-text">
          <span className="eyebrow">CURRÍCULO NACIONAL (CNEB) · RUTA DE APRENDIZAJE</span>
          <h2>Temario y Progresión de Competencias</h2>
          <p>
            Secuencia didáctica organizada en unidades pedagógicas con vinculación directa al teatro
            escolar. Genera y adapta tus guías con IA para cada momento pedagógico.
          </p>
        </div>
        <div className="dc-temario-meta-badge">
          <strong>{clase.grade} Secundaria</strong>
          <span>Edad sugerida: {edadClase} años</span>
        </div>
      </section>

      {/* Stepper Vertical con Nodos Circulares y Línea Conectora (Estilo Khan / Duolingo) */}
      <div className="dc-stepper-container">
        <div className="dc-stepper-timeline" aria-hidden="true" />

        {unidades.map((u) => {
          const esCompletada = u.estado === 'completada'
          const esEnProgreso = u.estado === 'en_progreso'
          const esBloqueada = u.estado === 'bloqueada'

          return (
            <div key={u.id} className={`dc-stepper-step ${u.estado}`}>
              {/* Nodo Circular con Icono */}
              <div className={`dc-step-node ${u.estado}`}>
                {esCompletada && <span className="dc-node-icon">✓</span>}
                {esEnProgreso && <span className="dc-node-icon">★</span>}
                {esBloqueada && <span className="dc-node-icon">🔒</span>}
              </div>

              {/* Tarjeta de la Unidad */}
              <div className="dc-step-card">
                <header className="dc-step-header">
                  <div className="dc-step-title-group">
                    <span className="dc-step-tag">UNIDAD 0{u.numero}</span>
                    <h3 className="dc-step-title">{u.titulo}</h3>
                  </div>

                  <span
                    className={`dc-status-pill ${
                      esCompletada ? 'pill-completada' : esEnProgreso ? 'pill-en-progreso' : 'pill-bloqueada'
                    }`}
                  >
                    {esCompletada ? 'Completada' : esEnProgreso ? 'En Progreso' : 'Próxima'}
                  </span>
                </header>

                <p className="dc-step-desc">{u.descripcion}</p>

                <div className="dc-step-competencia-box">
                  <div className="dc-cneb-badge">
                    <Icon name="book" size={14} /> CNEB
                  </div>
                  <div>
                    <strong>{u.competencia}</strong>
                    <p>{u.capacidad}</p>
                  </div>
                </div>

                <div className="dc-step-play-box">
                  <span className="dc-play-label">OBRA TEATRAL RECOMENDADA:</span>
                  <div className="dc-play-info">
                    <span className="dc-play-icon">🎭</span>
                    <strong>{u.obraRecomendada}</strong>
                  </div>
                </div>

                <div className="dc-step-actions">
                  {esCompletada || u.guiaId ? (
                    <>
                      <button
                        type="button"
                        className="dc-btn primary"
                        onClick={() => verGuiaExistente(u)}
                      >
                        <Icon name="spark" size={16} /> Ver y Modificar Guía
                      </button>
                      <button
                        type="button"
                        className="dc-btn"
                        onClick={() => {
                          verGuiaExistente(u)
                          setTimeout(() => window.print(), 300)
                        }}
                      >
                        <Icon name="chart" size={16} /> Descargar PDF
                      </button>
                    </>
                  ) : (
                    <button
                      type="button"
                      className="dc-btn primary glow"
                      onClick={() => abrirGeneradorParaUnidad(u)}
                    >
                      <Icon name="spark" size={16} /> Generar Guía Didáctica con IA
                    </button>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Modal / Panel de Generación y Edición Manual de Guía */}
      {modalAbierto && (
        <div className="dc-modal-overlay" role="dialog" aria-modal="true">
          <div className="dc-modal-content dc-modal-guia">
            <header className="dc-modal-header">
              <div>
                <span className="eyebrow">ASISTENTE PEDAGÓGICO SCENIA · CNEB</span>
                <h2>
                  {guiaActiva
                    ? 'Editor de Guía Didáctica'
                    : `Generar Guía IA: Unidad 0${unidadSeleccionada?.numero}`}
                </h2>
              </div>
              <button
                type="button"
                className="dc-modal-close"
                onClick={() => setModalAbierto(false)}
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </header>

            <div className="dc-modal-body">
              {avisoGuardado && <div className="dc-ok">{avisoGuardado}</div>}

              {/* Si todavía no se ha generado la guía, mostrar formulario de solicitud */}
              {!guiaActiva && !generando && (
                <form onSubmit={handleGenerarIA} className="dc-form-ia">
                  <div className="dc-ia-banner">
                    <Icon name="spark" size={24} />
                    <p>
                      La IA de Scenia estructurará tu guía con los 3 momentos pedagógicos (Antes,
                      Durante y Después de la función), preguntas de debate y sugerencias alternativas
                      articuladas al CNEB.
                    </p>
                  </div>

                  <div className="form-group">
                    <label>Tema o Contenido de la Unidad:</label>
                    <input
                      type="text"
                      className="dc-input-muro"
                      value={formIA.tema}
                      onChange={(e) => setFormIA({ ...formIA, tema: e.target.value })}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Propósito o Aprendizaje Esperado:</label>
                    <textarea
                      rows={3}
                      className="dc-textarea-muro"
                      value={formIA.objetivo}
                      onChange={(e) => setFormIA({ ...formIA, objetivo: e.target.value })}
                      required
                    />
                  </div>

                  <div className="dc-form-grid-2">
                    <div className="form-group">
                      <label>Grado Escolar:</label>
                      <input
                        type="text"
                        disabled
                        value={`${clase.grade} (${edadClase} años)`}
                        className="dc-input-muro"
                      />
                    </div>
                    <div className="form-group">
                      <label>Duración de la sesión (minutos):</label>
                      <input
                        type="number"
                        min={30}
                        max={120}
                        className="dc-input-muro"
                        value={formIA.duracion}
                        onChange={(e) =>
                          setFormIA({ ...formIA, duracion: Number(e.target.value) })
                        }
                      />
                    </div>
                  </div>

                  <div className="dc-modal-footer">
                    <button
                      type="button"
                      className="dc-btn"
                      onClick={() => setModalAbierto(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="dc-btn primary">
                      <Icon name="spark" size={16} /> Generar Guía con IA
                    </button>
                  </div>
                </form>
              )}

              {/* Estado de Carga con Skeleton */}
              {generando && (
                <div className="dc-skeleton-loading">
                  <div className="dc-skeleton-spinner" />
                  <h3>Diseñando propuesta pedagógica con IA...</h3>
                  <p>
                    Articulando competencias del CNEB, diseñando actividades de mediación y
                    analizando pertinencia teatral.
                  </p>
                  <div className="dc-skeleton-bars">
                    <span className="dc-skeleton-bar bar-1" />
                    <span className="dc-skeleton-bar bar-2" />
                    <span className="dc-skeleton-bar bar-3" />
                  </div>
                </div>
              )}

              {/* Guía Generada - Editor Manual y Descarga PDF */}
              {guiaActiva && (
                <div className="dc-editor-guia-container">
                  <div className="dc-editor-toolbar">
                    <div className="dc-toolbar-badge">
                      <span>✏️ Modo Edición Manual Habilitado</span>
                      <small>Puedes modificar los textos libremente antes de guardar o imprimir</small>
                    </div>
                    <div className="dc-toolbar-buttons">
                      <button
                        type="button"
                        className="dc-btn"
                        onClick={handleImprimirPDF}
                      >
                        <Icon name="chart" size={16} /> Descargar / Imprimir PDF
                      </button>
                      <button
                        type="button"
                        className="dc-btn primary"
                        onClick={handleGuardarGuia}
                      >
                        <Icon name="check" size={16} /> Guardar Cambios
                      </button>
                    </div>
                  </div>

                  <div className="dc-editor-form">
                    <div className="form-group">
                      <label>Título de la Guía:</label>
                      <input
                        type="text"
                        className="dc-input-muro"
                        value={guiaActiva.titulo || ''}
                        onChange={(e) =>
                          setGuiaActiva({ ...guiaActiva, titulo: e.target.value })
                        }
                      />
                    </div>

                    <div className="dc-form-grid-2">
                      <div className="form-group">
                        <label>Competencia CNEB:</label>
                        <input
                          type="text"
                          className="dc-input-muro"
                          value={guiaActiva.competencia || ''}
                          onChange={(e) =>
                            setGuiaActiva({ ...guiaActiva, competencia: e.target.value })
                          }
                        />
                      </div>
                      <div className="form-group">
                        <label>Capacidad Asociada:</label>
                        <input
                          type="text"
                          className="dc-input-muro"
                          value={guiaActiva.capacidad || ''}
                          onChange={(e) =>
                            setGuiaActiva({ ...guiaActiva, capacidad: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Introducción y Enfoque Pedagógico:</label>
                      <textarea
                        rows={3}
                        className="dc-textarea-muro"
                        value={guiaActiva.introduccion || ''}
                        onChange={(e) =>
                          setGuiaActiva({ ...guiaActiva, introduccion: e.target.value })
                        }
                      />
                    </div>

                    <h4 className="dc-section-title">Momentos de la Experiencia Pedagógica</h4>

                    <div className="form-group">
                      <label>1. Antes de la Función (Preparación y Caldeamiento en el Aula):</label>
                      <textarea
                        rows={3}
                        className="dc-textarea-muro"
                        value={guiaActiva.momentos?.antes || ''}
                        onChange={(e) =>
                          setGuiaActiva({
                            ...guiaActiva,
                            momentos: { ...guiaActiva.momentos, antes: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>2. Durante la Función (Foco de Atención y Bitácora Observacional):</label>
                      <textarea
                        rows={3}
                        className="dc-textarea-muro"
                        value={guiaActiva.momentos?.durante || ''}
                        onChange={(e) =>
                          setGuiaActiva({
                            ...guiaActiva,
                            momentos: { ...guiaActiva.momentos, durante: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>3. Después de la Función (Asamblea Reflexiva y Bitácora de Audio):</label>
                      <textarea
                        rows={3}
                        className="dc-textarea-muro"
                        value={guiaActiva.momentos?.despues || ''}
                        onChange={(e) =>
                          setGuiaActiva({
                            ...guiaActiva,
                            momentos: { ...guiaActiva.momentos, despues: e.target.value },
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Preguntas para el Diálogo y Debate (una por línea):</label>
                      <textarea
                        rows={4}
                        className="dc-textarea-muro"
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
                            ¿No encuentras una obra en cartelera que se adapte exactamente a este tema?
                            La IA te propone estas alternativas escénicas adaptadas para el aula:
                          </p>
                        </div>
                      </div>

                      <div className="dc-sugerencias-cards">
                        {(guiaActiva.sugerenciasAlternativas || [
                          {
                            titulo: 'El patio de atrás (Lectura dramatizada en aula)',
                            justificacion:
                              'Excelente alternativa de bajo costo: un libreto de 3 escenas breves para ser representado o leído directamente por los estudiantes en clase.',
                          },
                          {
                            titulo: 'Espejo de dos caras (Teatro Imagen de Boal)',
                            justificacion:
                              'Técnica participativa donde los estudiantes crean esculturas corporales sin texto para representar situaciones de conflicto y empatía.',
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
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
