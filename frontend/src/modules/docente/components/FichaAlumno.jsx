import { useState, useEffect } from 'react'
import ConsentBadge from './ConsentBadge'
import RespuestaView from './RespuestaView'
import { Icon } from '../../../components/SceniaUI'
import { marcarEntrega, simularEntrega, evaluarAudioEstudiante } from '../services/clases'

export default function FichaAlumno({ clase, estudiante, ejecutar, onCerrar }) {
  const [tabActiva, setTabActiva] = useState('audios') // 'audios' | 'tareas'
  const [reproduciendo, setReproduciendo] = useState({})
  const [progresoAudio, setProgresoAudio] = useState({})
  const [calificaciones, setCalificaciones] = useState(() => {
    const califs = {}
    ;(estudiante.audios || []).forEach((a) => {
      califs[a.id] = a.calificacion || 'A'
    })
    return califs
  })
  const [feedback, setFeedback] = useState(() => {
    const feeds = {}
    ;(estudiante.audios || []).forEach((a) => {
      feeds[a.id] = a.retroalimentacion || ''
    })
    return feeds
  })
  const [mensajeGuardado, setMensajeGuardado] = useState(null)
  const [tareaAbierta, setTareaAbierta] = useState(null)

  const bloqueado = estudiante.consentimiento !== 'otorgado'
  const audios = estudiante.audios || []

  // Simulación de reproducción de audio
  useEffect(() => {
    const intervals = {}
    Object.keys(reproduciendo).forEach((audioId) => {
      if (reproduciendo[audioId]) {
        intervals[audioId] = setInterval(() => {
          setProgresoAudio((prev) => {
            const actual = prev[audioId] || 0
            if (actual >= 100) {
              setReproduciendo((r) => ({ ...r, [audioId]: false }))
              return { ...prev, [audioId]: 0 }
            }
            return { ...prev, [audioId]: actual + 5 }
          })
        }, 300)
      }
    })
    return () => {
      Object.values(intervals).forEach(clearInterval)
    }
  }, [reproduciendo])

  const togglePlayAudio = (audioId) => {
    setReproduciendo((prev) => ({
      ...prev,
      [audioId]: !prev[audioId],
    }))
  }

  const handleGuardarEvaluacionAudio = async (audioId) => {
    const cal = calificaciones[audioId] || 'A'
    const ret = feedback[audioId] || ''
    await ejecutar(async () => {
      await evaluarAudioEstudiante(clase.id, estudiante.id, audioId, {
        calificacion: cal,
        retroalimentacion: ret,
      })
    })
    setMensajeGuardado('¡Evaluación y retroalimentación guardadas con éxito!')
    setTimeout(() => setMensajeGuardado(null), 3500)
  }

  return (
    <div className="dc-modal-overlay" role="dialog" aria-modal="true">
      <div className="dc-modal-content dc-modal-ficha">
        {/* Cabecera del Estudiante */}
        <header className="dc-ficha-header">
          <div className="dc-ficha-profile">
            <div className="dc-ficha-avatar">
              {estudiante.nombre
                .split(' ')
                .map((n) => n[0])
                .slice(0, 2)
                .join('')}
            </div>
            <div>
              <div className="dc-ficha-title-row">
                <h2>{estudiante.nombre}</h2>
                <ConsentBadge estado={estudiante.consentimiento} />
              </div>
              <div className="dc-ficha-meta">
                <span className="dc-badge-code">
                  <Icon name="users" size={14} /> Código: {estudiante.codigo || 'SMP-3B-01'}
                </span>
                <span className="dc-badge-user">@{estudiante.username || 'usuario'}</span>
                <span className="dc-badge-aula">
                  {clase.grade} {clase.section} · {clase.subject}
                </span>
              </div>
            </div>
          </div>

          <button type="button" className="dc-modal-close" onClick={onCerrar} aria-label="Cerrar ficha">
            ✕
          </button>
        </header>

        {/* Barra de Progreso y Alerta de Consentimiento */}
        <div className="dc-ficha-summary-bar">
          <div className="dc-summary-stat">
            <span>Avance general en el curso:</span>
            <strong>{estudiante.avance || 0}%</strong>
            <div className="dc-progress-track">
              <div
                className="dc-progress-fill"
                style={{ width: `${estudiante.avance || 0}%` }}
              />
            </div>
          </div>
          <div className="dc-summary-stat">
            <span>Audios reflexivos:</span>
            <strong>{audios.length} grabados</strong>
          </div>
          <div className="dc-summary-stat">
            <span>Tareas cumplidas:</span>
            <strong>
              {clase.tareas.filter((t) => clase.entregas?.[t.id]?.[estudiante.id]?.estado === 'hecho').length} /{' '}
              {clase.tareas.length}
            </strong>
          </div>
        </div>

        {bloqueado && (
          <div className="dc-lock-banner">
            <Icon name="shield" size={18} />
            <div>
              <strong>Acceso a tareas bloqueado por Ley N.° 29733 (Protección de Datos)</strong>
              <p>
                El apoderado aún no ha otorgado el consentimiento formal. El estudiante no puede
                recibir evaluaciones hasta regularizar su autorización.
              </p>
            </div>
          </div>
        )}

        {mensajeGuardado && <div className="dc-ok">{mensajeGuardado}</div>}

        {/* Pestañas de la Ficha */}
        <div className="dc-ficha-tabs">
          <button
            type="button"
            className={`dc-tab-item ${tabActiva === 'audios' ? 'active' : ''}`}
            onClick={() => setTabActiva('audios')}
          >
            🎙️ Audios de Reflexión ({audios.length})
          </button>
          <button
            type="button"
            className={`dc-tab-item ${tabActiva === 'tareas' ? 'active' : ''}`}
            onClick={() => setTabActiva('tareas')}
          >
            📝 Tareas y Actividades ({clase.tareas.length})
          </button>
        </div>

        {/* Contenido: AUDIOS DE REFLEXIÓN */}
        {tabActiva === 'audios' && (
          <div className="dc-ficha-tab-content">
            {audios.length === 0 ? (
              <div className="dc-empty-tab">
                <Icon name="mic" size={32} />
                <h3>No hay grabaciones de audio registradas</h3>
                <p>
                  El estudiante aún no ha enviado bitácoras de voz para las obras o sesiones de este
                  curso.
                </p>
              </div>
            ) : (
              <div className="dc-audios-list">
                {audios.map((audio) => {
                  const isPlaying = reproduciendo[audio.id]
                  const progress = progresoAudio[audio.id] || 0
                  const califActual = calificaciones[audio.id] || 'A'

                  return (
                    <article key={audio.id} className="dc-audio-card">
                      <header className="dc-audio-header">
                        <div>
                          <span className="dc-audio-tag">BITÁCORA VOCAL PEDAGÓGICA</span>
                          <h4>{audio.titulo}</h4>
                          <span className="dc-audio-date">
                            {audio.fecha} · Duración: {audio.duracion}
                          </span>
                        </div>
                        {audio.calificacion && (
                          <span className={`dc-grade-badge grade-${audio.calificacion.toLowerCase()}`}>
                            Logro: {audio.calificacion}
                          </span>
                        )}
                      </header>

                      {/* Reproductor de Audio Simulado con Onda Sonora */}
                      <div className="dc-audio-player-box">
                        <button
                          type="button"
                          className={`dc-play-btn ${isPlaying ? 'playing' : ''}`}
                          onClick={() => togglePlayAudio(audio.id)}
                          aria-label={isPlaying ? 'Pausar audio' : 'Reproducir audio'}
                        >
                          {isPlaying ? '⏸' : '▶'}
                        </button>

                        <div className="dc-wave-container">
                          <div className="dc-soundwave-bars">
                            {[18, 35, 20, 42, 60, 30, 50, 75, 40, 65, 30, 50, 80, 45, 25, 40].map(
                              (h, bIdx) => (
                                <span
                                  key={bIdx}
                                  className={`dc-wave-bar ${isPlaying ? 'animated' : ''}`}
                                  style={{
                                    height: `${h}%`,
                                    animationDelay: `${bIdx * 0.08}s`,
                                  }}
                                />
                              ),
                            )}
                          </div>
                          <div className="dc-audio-track">
                            <div
                              className="dc-audio-fill"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>

                        <span className="dc-audio-time">
                          {isPlaying ? `00:${String(Math.floor((progress * 45) / 100)).padStart(2, '0')}` : audio.duracion}
                        </span>
                      </div>

                      {/* Transcripción de IA */}
                      <div className="dc-transcript-box">
                        <div className="dc-transcript-label">
                          <span>🤖 Transcripción de Texto (IA Scenia):</span>
                        </div>
                        <p className="dc-transcript-text">“{audio.transcripcion}”</p>

                        {audio.puntosClave && (
                          <div className="dc-keywords-row">
                            <span className="dc-kw-label">Competencias detectadas:</span>
                            {audio.puntosClave.map((kw, kwIdx) => (
                              <span key={kwIdx} className="dc-kw-chip">
                                {kw}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>

                      {/* Formulario de Evaluación Docente */}
                      <div className="dc-audio-grading-section">
                        <div className="dc-grade-selector-row">
                          <label>Calificación Docente (CNEB):</label>
                          <div className="dc-grade-options">
                            {[
                              ['AD', 'AD · Logro Destacado'],
                              ['A', 'A · Logro Esperado'],
                              ['B', 'B · En Proceso'],
                            ].map(([val, txt]) => (
                              <button
                                key={val}
                                type="button"
                                className={`dc-grade-btn ${califActual === val ? 'selected' : ''}`}
                                onClick={() =>
                                  setCalificaciones({ ...calificaciones, [audio.id]: val })
                                }
                              >
                                {txt}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="dc-feedback-input-row">
                          <label>Retroalimentación formativa para el estudiante:</label>
                          <textarea
                            rows={2}
                            className="dc-textarea-muro"
                            placeholder="Escribe comentarios formativos para potenciar la expresión oral del estudiante..."
                            value={feedback[audio.id] || ''}
                            onChange={(e) =>
                              setFeedback({ ...feedback, [audio.id]: e.target.value })
                            }
                          />
                        </div>

                        <div className="dc-audio-action-row">
                          <button
                            type="button"
                            className="dc-btn primary"
                            onClick={() => handleGuardarEvaluacionAudio(audio.id)}
                          >
                            Guardar Evaluación del Audio
                          </button>
                        </div>
                      </div>
                    </article>
                    )
                  })}
                </div>
              )}
            </div>
          )}

        {/* Contenido: TAREAS Y ACTIVIDADES */}
        {tabActiva === 'tareas' && (
          <div className="dc-ficha-tab-content">
            {clase.tareas.length === 0 ? (
              <div className="dc-empty-tab">
                <Icon name="book" size={32} />
                <h3>No hay tareas asignadas en esta clase</h3>
                <p>Asigna actividades curriculares desde el temario o programa de la clase.</p>
              </div>
            ) : (
              <div className="dc-tasks-list">
                {clase.tareas.map((tarea) => {
                  const entrega = clase.entregas?.[tarea.id]?.[estudiante.id]
                  const estado = entrega?.estado || 'pendiente'
                  const abierta = tareaAbierta === tarea.id

                  return (
                    <div key={tarea.id} className="dc-task-item-card">
                      <div className="dc-task-header-row">
                        <div>
                          <strong>{tarea.titulo}</strong>
                          <span className="dc-task-type">
                            {tarea.tipo === 'auto'
                              ? 'Evaluación automatizada'
                              : 'Revisión docente requerida'}
                          </span>
                        </div>

                        <div className="dc-task-status-actions">
                          <span
                            className={`dc-pill ${
                              bloqueado
                                ? 'warn'
                                : estado === 'hecho'
                                ? 'ok'
                                : estado === 'entregada'
                                ? 'info'
                                : 'muted'
                            }`}
                          >
                            {bloqueado
                              ? 'Bloqueada (Ley 29733)'
                              : estado === 'hecho'
                              ? 'Calificada / Hecho'
                              : estado === 'entregada'
                              ? 'Entregada · Por revisar'
                              : 'Pendiente'}
                          </span>

                          {!bloqueado && entrega?.respuesta && (
                            <button
                              type="button"
                              className="dc-btn"
                              onClick={() => setTareaAbierta(abierta ? null : tarea.id)}
                            >
                              {abierta ? 'Ocultar respuesta' : 'Ver respuesta'}
                            </button>
                          )}

                          {!bloqueado && tarea.tipo === 'revision' && estado === 'entregada' && (
                            <button
                              type="button"
                              className="dc-btn primary"
                              onClick={() =>
                                ejecutar(() =>
                                  marcarEntrega(clase.id, tarea.id, estudiante.id, 'hecho'),
                                )
                              }
                            >
                              Marcar como hecho
                            </button>
                          )}

                          {!bloqueado && estado === 'pendiente' && (
                            <button
                              type="button"
                              className="dc-btn"
                              title="Simular entrega del alumno (demo)"
                              onClick={() =>
                                ejecutar(() =>
                                  simularEntrega(clase.id, tarea.id, estudiante.id),
                                )
                              }
                            >
                              Simular entrega
                            </button>
                          )}
                        </div>
                      </div>

                      {!bloqueado && abierta && (
                        <div className="dc-task-answer-box">
                          <RespuestaView tarea={tarea} respuesta={entrega?.respuesta} />
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
