import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import {
  obtenerDetalleObra,
  obtenerReflexionObra,
  guardarPasoReflexion,
  enviarReflexionCompleta,
} from '../services/estudiante'

const EMOCIONES = [
  { id: 'feliz', etiqueta: 'Feliz', emoji: '😊' },
  { id: 'tranquilo', etiqueta: 'Tranquilo', emoji: '😌' },
  { id: 'sorprendido', etiqueta: 'Sorprendido', emoji: '😲' },
  { id: 'triste', etiqueta: 'Triste', emoji: '😢' },
  { id: 'inspirado', etiqueta: 'Inspirado', emoji: '💡' },
  { id: 'otra', etiqueta: 'Otra', emoji: '🤔' },
]

export default function ReflexionTeatral() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [obra, setObra] = useState(null)
  const [paso, setPaso] = useState(1) // 1 | 2 | 3
  const [cargando, setCargando] = useState(true)
  const [guardadoMsg, setGuardadoMsg] = useState(null)
  const [enviadoExito, setEnviadoExito] = useState(false)

  // Grabador de audio simulado
  const [grabandoAudio, setGrabandoAudio] = useState(false)
  const [segundosAudio, setSegundosAudio] = useState(0)
  const [audioGrabadoUrl, setAudioGrabadoUrl] = useState(null)

  // Formulario de los 3 Pasos
  const [formulario, setFormulario] = useState({
    loQueSenti: {
      texto: '',
      emocion: 'Sorprendido',
      audioUrl: null,
      tieneAudio: false,
    },
    loQueComprendi: {
      conflicto: '',
      resolucion: '',
    },
    loQueMeLlevo: {
      aprendizaje: '',
      palabraClave: '',
    },
  })

  useEffect(() => {
    Promise.all([obtenerDetalleObra(id), obtenerReflexionObra(id)]).then(([ob, ref]) => {
      setObra(ob)
      if (ref) {
        setFormulario((prev) => ({
          ...prev,
          loQueSenti: ref.loQueSenti || prev.loQueSenti,
          loQueComprendi: ref.loQueComprendi || prev.loQueComprendi,
          loQueMeLlevo: ref.loQueMeLlevo || prev.loQueMeLlevo,
        }))
        if (ref.loQueSenti?.audioUrl) {
          setAudioGrabadoUrl(ref.loQueSenti.audioUrl)
        }
      }
      setCargando(false)
    })
  }, [id])

  // Timer para grabación de audio
  useEffect(() => {
    let timer
    if (grabandoAudio) {
      timer = setInterval(() => {
        setSegundosAudio((s) => s + 1)
      }, 1000)
    }
    return () => clearInterval(timer)
  }, [grabandoAudio])

  if (cargando) return <Loading mensaje="Cargando tu espacio de reflexión..." />

  const handleToggleGrabarAudio = () => {
    if (!grabandoAudio) {
      setGrabandoAudio(true)
      setSegundosAudio(0)
    } else {
      setGrabandoAudio(false)
      const fakeUrl = 'demo-audio-grabado.mp3'
      setAudioGrabadoUrl(fakeUrl)
      setFormulario((prev) => ({
        ...prev,
        loQueSenti: {
          ...prev.loQueSenti,
          tieneAudio: true,
          audioUrl: fakeUrl,
        },
      }))
    }
  }

  const handleGuardarBorrador = async () => {
    await guardarPasoReflexion(obra.id, {
      ...formulario,
      pasoActual: paso,
    })
    setGuardadoMsg('¡Borrador guardado con éxito!')
    setTimeout(() => setGuardadoMsg(null), 3000)
  }

  const handleSiguiente = async () => {
    if (paso < 3) {
      await guardarPasoReflexion(obra.id, {
        ...formulario,
        pasoActual: paso + 1,
      })
      setPaso(paso + 1)
    } else {
      // Enviar reflexión final al docente
      await enviarReflexionCompleta(obra.id, formulario)
      setEnviadoExito(true)
    }
  }

  const formatoTiempo = (totalSeg) => {
    const min = Math.floor(totalSeg / 60)
    const seg = totalSeg % 60
    return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`
  }

  return (
    <div className="st-page-container st-reflexion-page">
      {/* Botón Volver */}
      <div className="st-back-bar">
        <Link to={`/estudiante/obras/${obra.id}`} className="st-back-link">
          ← Volver
        </Link>
      </div>

      {/* Encabezado */}
      <header className="st-reflexion-header">
        <div className="st-ref-icon-bubble">📝</div>
        <div>
          <h1>Mi reflexión teatral</h1>
          <p>Comparte lo que sentiste, comprendiste y aprendiste después de la obra.</p>
        </div>
      </header>

      {/* Barra Informativa Superior de la Obra y Recordatorio */}
      <div className="st-ref-top-grid">
        <div className="st-card st-ref-play-mini-card">
          <div className="st-ref-thumb">🌲</div>
          <div className="st-ref-play-meta">
            <h3>{obra.titulo}</h3>
            <span>{obra.fecha} · {obra.lugar}</span>
          </div>

          <div className="st-ref-status-indicator">
            <div className="st-ref-status-label">
              <span>Tu reflexión:</span>
              <strong className="status-badge">En proceso</strong>
            </div>
            <div className="st-ref-step-progress">
              <small>Paso {paso} de 3 ({Math.round((paso / 3) * 100)}%)</small>
              <div className="st-ref-track">
                <div
                  className="st-ref-fill"
                  style={{ width: `${Math.round((paso / 3) * 100)}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tarjeta de Recordatorio con Ilustración */}
        <div className="st-card st-recordatorio-card">
          <div className="st-rec-bubble">
            <div className="st-rec-badge">
              <span className="lightbulb">💡</span>
              <strong>Recuerda</strong>
            </div>
            <p>
              No hay respuestas correctas o incorrectas. Lo verdaderamente valioso es tu experiencia
              y tu mirada personal.
            </p>
          </div>
          <div className="st-rec-avatar-art">
            <span>👩‍🎓🎨</span>
          </div>
        </div>
      </div>

      {guardadoMsg && <div className="st-ok-banner">{guardadoMsg}</div>}

      {/* Modal / Pantalla de Confirmación Exitosa */}
      {enviadoExito ? (
        <div className="st-card st-exito-card">
          <div className="st-exito-icon">🎉</div>
          <h2>¡Felicitaciones! Has completado tu reflexión</h2>
          <p>
            Tu reflexión y nota de voz han sido enviadas exitosamente. Tu docente de aula podrá
            revisarla y dejarte una retroalimentación formativa.
          </p>
          <div className="st-exito-actions">
            <button
              type="button"
              className="st-btn primary glow"
              onClick={() => navigate('/estudiante/logros')}
            >
              Ver mis insignias y logros →
            </button>
            <Link to="/estudiante" className="st-btn secondary">
              Volver a mi ruta cultural
            </Link>
          </div>
        </div>
      ) : (
        /* Stepper Horizontal de 3 Pasos y Formulario */
        <div className="st-card st-stepper-form-card">
          {/* Stepper Horizontal */}
          <div className="st-wizard-steps">
            {[
              [1, 'Lo que sentí'],
              [2, 'Lo que comprendí'],
              [3, 'Lo que me llevo'],
            ].map(([num, titulo]) => (
              <button
                key={num}
                type="button"
                className={`st-wizard-step ${paso === num ? 'active' : paso > num ? 'done' : ''}`}
                onClick={() => setPaso(num)}
              >
                <span className="st-step-circle">{paso > num ? '✓' : num}</span>
                <span className="st-step-name">{titulo}</span>
              </button>
            ))}
          </div>

          <div className="st-step-content-box">
            {/* ==================================================== */}
            {/* PASO 1: LO QUE SENTÍ                                 */}
            {/* ==================================================== */}
            {paso === 1 && (
              <div className="st-step-panel">
                {/* Pregunta 1: Texto */}
                <div className="st-field-group">
                  <label>1. ¿Qué fue lo que más te llamó la atención?</label>
                  <textarea
                    rows={4}
                    className="st-textarea"
                    placeholder="Escribe aquí tu respuesta sobre la escena, personajes o vestuario..."
                    maxLength={300}
                    value={formulario.loQueSenti.texto}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        loQueSenti: { ...formulario.loQueSenti, texto: e.target.value },
                      })
                    }
                  />
                  <div className="st-char-counter">
                    {formulario.loQueSenti.texto.length} / 300
                  </div>
                </div>

                {/* Pregunta 2: Selector de Emociones */}
                <div className="st-field-group">
                  <label>2. Selecciona la emoción que mejor te represente:</label>
                  <div className="st-emociones-selector">
                    {EMOCIONES.map((emo) => {
                      const seleccionada = formulario.loQueSenti.emocion === emo.etiqueta

                      return (
                        <button
                          key={emo.id}
                          type="button"
                          className={`st-emotion-btn ${seleccionada ? 'selected' : ''}`}
                          onClick={() =>
                            setFormulario({
                              ...formulario,
                              loQueSenti: { ...formulario.loQueSenti, emocion: emo.etiqueta },
                            })
                          }
                        >
                          <span className="st-emo-icon">{emo.emoji}</span>
                          <span className="st-emo-name">{emo.etiqueta}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Pregunta 3: Grabador de Audio o Video */}
                <div className="st-field-group">
                  <label>Puedes adjuntar un audio o video (opcional):</label>
                  <div className="st-media-buttons-row">
                    <button
                      type="button"
                      className={`st-media-btn ${grabandoAudio ? 'recording' : ''}`}
                      onClick={handleToggleGrabarAudio}
                    >
                      <Icon name="mic" size={18} />
                      {grabandoAudio
                        ? `Grabando... (${formatoTiempo(segundosAudio)})`
                        : audioGrabadoUrl
                        ? '🎙️ Audio grabado ✓ (Volver a grabar)'
                        : 'Grabar audio de voz'}
                    </button>

                    <label className="st-media-btn outline">
                      📹 Subir video o archivo
                      <input
                        type="file"
                        accept="video/*,audio/*"
                        style={{ display: 'none' }}
                        onChange={(e) => {
                          if (e.target.files?.[0]) {
                            alert(`Archivo seleccionado: ${e.target.files[0].name}`)
                          }
                        }}
                      />
                    </label>

                    <span className="st-media-hint">Máx. 2 min • MP3, MP4</span>
                  </div>

                  {audioGrabadoUrl && (
                    <div className="st-audio-preview-chip">
                      <span>🔊 Nota de voz adjunta ({formatoTiempo(segundosAudio || 90)})</span>
                      <small>Tu docente podrá escucharla al revisar la tarea</small>
                    </div>
                  )}
                </div>

                {/* Caja de Privacidad */}
                <div className="st-privacy-callout">
                  <div className="st-lock-icon">🔒</div>
                  <div>
                    <strong>Tu reflexión es privada</strong>
                    <p>
                      Solo tú y el personal autorizado del colegio y del Club de Arte y Cultura
                      podrán verla.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* PASO 2: LO QUE COMPRENDÍ                             */}
            {/* ==================================================== */}
            {paso === 2 && (
              <div className="st-step-panel">
                <div className="st-field-group">
                  <label>1. ¿Qué conflicto o dilema enfrentó el personaje principal?</label>
                  <textarea
                    rows={4}
                    className="st-textarea"
                    placeholder="Describe el momento en que el personaje tuvo que tomar una decisión difícil..."
                    value={formulario.loQueComprendi.conflicto}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        loQueComprendi: {
                          ...formulario.loQueComprendi,
                          conflicto: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="st-field-group">
                  <label>2. ¿Cómo influyó el diálogo o la ayuda de los demás para resolverlo?</label>
                  <textarea
                    rows={4}
                    className="st-textarea"
                    placeholder="Explica qué actitudes ayudaron a resolver el problema en la historia..."
                    value={formulario.loQueComprendi.resolucion}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        loQueComprendi: {
                          ...formulario.loQueComprendi,
                          resolucion: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* ==================================================== */}
            {/* PASO 3: LO QUE ME LLEVO                              */}
            {/* ==================================================== */}
            {paso === 3 && (
              <div className="st-step-panel">
                <div className="st-field-group">
                  <label>1. ¿Qué aprendizaje o mensaje te llevas para tu vida o tu salón de clases?</label>
                  <textarea
                    rows={4}
                    className="st-textarea"
                    placeholder="¿De qué manera puedes aplicar lo que viste en la obra con tus amigos o familia?..."
                    value={formulario.loQueMeLlevo.aprendizaje}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        loQueMeLlevo: {
                          ...formulario.loQueMeLlevo,
                          aprendizaje: e.target.value,
                        },
                      })
                    }
                  />
                </div>

                <div className="st-field-group">
                  <label>2. En una palabra o frase corta, ¿cómo resumirías esta experiencia?</label>
                  <input
                    type="text"
                    className="st-input"
                    placeholder="Ej: Valentía, Empatía, Escuchar al otro..."
                    value={formulario.loQueMeLlevo.palabraClave}
                    onChange={(e) =>
                      setFormulario({
                        ...formulario,
                        loQueMeLlevo: {
                          ...formulario.loQueMeLlevo,
                          palabraClave: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            )}

            {/* Botones de Navegación Inferior */}
            <div className="st-stepper-bottom-bar">
              <button
                type="button"
                className="st-btn secondary"
                onClick={handleGuardarBorrador}
              >
                💾 Guardar borrador
              </button>

              <div className="st-stepper-forward-group">
                {paso > 1 && (
                  <button
                    type="button"
                    className="st-btn outline"
                    onClick={() => setPaso(paso - 1)}
                  >
                    ← Anterior
                  </button>
                )}

                <button
                  type="button"
                  className="st-btn primary glow"
                  onClick={handleSiguiente}
                >
                  {paso === 3 ? 'Enviar reflexión al docente ✓' : 'Siguiente →'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
