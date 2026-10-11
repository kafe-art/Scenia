import { useState } from 'react'
import { Icon } from '../../../components/SceniaUI'
import { edadPorGrado } from '../services/clases'

export default function GenerarGuiaModal({ isOpen, onClose, clase }) {
  const [fase, setFase] = useState('formulario') // 'formulario' | 'generando' | 'resultado'
  const [pasoProgreso, setPasoProgreso] = useState(0)

  const [formData, setFormData] = useState(() => ({
    tema: clase?.topic || 'Convivencia escolar',
    objetivo: 'Promover la escucha empática y la resolución pacífica de conflictos en el aula',
    edad: edadPorGrado(clase?.grade) || 14,
    duracion: 30,
    cursoSeccion: clase ? `${clase.subject} · ${clase.grade} ${clase.section}` : 'Comunicación · 3.° B',
    competencia: 'Se comunica oralmente',
    intereses: clase?.intereses || 'Debate, identidad cultural y creación audiovisual',
  }))

  if (!isOpen) return null

  const handleIniciarGeneracion = (e) => {
    e?.preventDefault()
    setFase('generando')
    setPasoProgreso(1)

    setTimeout(() => setPasoProgreso(2), 1100)
    setTimeout(() => setPasoProgreso(3), 2200)
    setTimeout(() => {
      setFase('resultado')
    }, 3200)
  }

  const handleCerrar = () => {
    setFase('formulario')
    setPasoProgreso(0)
    onClose()
  }

  return (
    <div className="dc-modal-overlay" onClick={handleCerrar} role="dialog" aria-modal="true">
      <div className="dc-modal-card dc-ai-guide-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del modal (Captura 4) */}
        <div className="dc-modal-header">
          <div>
            <span className="dc-modal-tag">SCENIA · PANEL DOCENTE</span>
            <h2 className="dc-modal-title">Haz que tu próxima clase cobre vida</h2>
            <p className="dc-modal-desc-sub">
              Prepara una propuesta teatral y revísala antes de llevarla al aula.
            </p>
          </div>
          <button
            type="button"
            className="dc-modal-close-btn"
            onClick={handleCerrar}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* 1. Formulario visual de Generación (Captura 4 exacta) */}
        {fase === 'formulario' && (
          <form onSubmit={handleIniciarGeneracion} className="dc-ai-guide-form animate-fade-in">
            {/* Campo Tema */}
            <div className="dc-form-group">
              <label className="dc-form-label">Tema</label>
              <input
                type="text"
                className="dc-form-input"
                value={formData.tema}
                onChange={(e) => setFormData((prev) => ({ ...prev, tema: e.target.value }))}
                required
              />
            </div>

            {/* Campo Objetivo pedagógico */}
            <div className="dc-form-group">
              <label className="dc-form-label">Objetivo pedagógico</label>
              <textarea
                className="dc-form-textarea"
                rows={2}
                placeholder="Ej. Promover la empatía y prevenir el acoso"
                value={formData.objetivo}
                onChange={(e) => setFormData((prev) => ({ ...prev, objetivo: e.target.value }))}
              />
            </div>

            {/* Fila 2 columnas: Edad y Duración */}
            <div className="dc-form-grid-2">
              <div className="dc-form-group">
                <label className="dc-form-label">Edad (años)</label>
                <input
                  type="number"
                  className="dc-form-input"
                  value={formData.edad}
                  onChange={(e) => setFormData((prev) => ({ ...prev, edad: Number(e.target.value) }))}
                  min={10}
                  max={18}
                />
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Duración (minutos)</label>
                <input
                  type="number"
                  className="dc-form-input"
                  value={formData.duracion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, duracion: Number(e.target.value) }))}
                  min={15}
                  max={120}
                />
              </div>
            </div>

            {/* Fila 2 columnas: Curso y sección y Competencia curricular */}
            <div className="dc-form-grid-2">
              <div className="dc-form-group">
                <label className="dc-form-label">Curso y sección</label>
                <input
                  type="text"
                  className="dc-form-input"
                  value={formData.cursoSeccion}
                  onChange={(e) => setFormData((prev) => ({ ...prev, cursoSeccion: e.target.value }))}
                />
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Competencia curricular</label>
                <select
                  className="dc-form-select"
                  value={formData.competencia}
                  onChange={(e) => setFormData((prev) => ({ ...prev, competencia: e.target.value }))}
                >
                  <option value="Se comunica oralmente">Se comunica oralmente</option>
                  <option value="Construye su identidad">Construye su identidad</option>
                  <option value="Convive democráticamente">Convive democráticamente</option>
                  <option value="Aprecia manifestaciones artísticas">Aprecia manifestaciones artísticas</option>
                </select>
              </div>
            </div>

            {/* Campo Intereses del grupo */}
            <div className="dc-form-group">
              <label className="dc-form-label">Intereses del grupo</label>
              <textarea
                className="dc-form-textarea"
                rows={2}
                value={formData.intereses}
                onChange={(e) => setFormData((prev) => ({ ...prev, intereses: e.target.value }))}
              />
            </div>

            {/* Footer con Cancelar y Generar guía */}
            <div className="dc-modal-footer is-between">
              <button type="button" className="dc-btn-link" onClick={handleCerrar}>
                Cancelar
              </button>
              <button type="submit" className="dc-btn-red dc-btn-generate-ai">
                <Icon name="spark" size={16} />
                <span>Generar guía</span>
              </button>
            </div>
          </form>
        )}

        {/* 2. Visual Loading de Generación IA */}
        {fase === 'generando' && (
          <div className="dc-ai-generating-view animate-fade-in">
            <div className="dc-ai-spinner-halo">
              <div className="dc-ai-spinner-circle" />
              <Icon name="spark" size={32} />
            </div>

            <h3 className="dc-ai-generating-title">Scenia IA está diseñando tu sesión...</h3>
            <p className="dc-ai-generating-desc">
              Conectando el enfoque CNEB con el lenguaje escénico y los intereses de tu aula.
            </p>

            <div className="dc-ai-steps-checklist">
              <div className={`dc-ai-check-item ${pasoProgreso >= 1 ? 'is-done' : ''}`}>
                <span className="dc-check-bullet">✓</span>
                <span>Analizando competencia: "{formData.competencia}"</span>
              </div>
              <div className={`dc-ai-check-item ${pasoProgreso >= 2 ? 'is-done' : ''}`}>
                <span className="dc-check-bullet">✓</span>
                <span>Estructurando momentos: Antes, Durante y Después</span>
              </div>
              <div className={`dc-ai-check-item ${pasoProgreso >= 3 ? 'is-done' : ''}`}>
                <span className="dc-check-bullet">✓</span>
                <span>Generando preguntas de reflexión y bitácora de audio</span>
              </div>
            </div>
          </div>
        )}

        {/* 3. Resultado Visual de la Guía Generada */}
        {fase === 'resultado' && (
          <div className="dc-ai-guide-result-view animate-fade-in">
            <div className="dc-ai-result-badge-row">
              <span className="dc-ai-badge-success">✨ Guía pedagógica generada por IA</span>
              <span className="dc-ai-badge-time">{formData.duracion} min · CNEB</span>
            </div>

            <h3 className="dc-ai-result-title">
              Guía Didáctica: "{formData.tema}" a través del Teatro
            </h3>

            <div className="dc-ai-moments-list">
              <div className="dc-ai-moment-box">
                <span className="dc-moment-tag before">1. ANTES DE LA FUNCIÓN (10 min)</span>
                <p>
                  Dinámica de "El círculo de escucha": En parejas, los estudiantes representan una situación cotidiana
                  donde no se sintieron escuchados y luego la reinterpretan con una actitud empática.
                </p>
              </div>

              <div className="dc-ai-moment-box">
                <span className="dc-moment-tag during">2. DURANTE LA EXPERIENCIA (15 min)</span>
                <p>
                  Observación atenta del conflicto dramático: Prestar atención a las miradas y al lenguaje no verbal
                  de los personajes cuando se genera un desacuerdo en escena.
                </p>
              </div>

              <div className="dc-ai-moment-box">
                <span className="dc-moment-tag after">3. DESPUÉS DE LA FUNCIÓN (15 min)</span>
                <p>
                  Ronda de diálogo crítico y grabación de bitácora: Cada alumno graba un audio de 1 minuto en Scenia
                  respondiendo: "¿Qué máscara usamos cuando tenemos miedo a decir lo que sentimos?".
                </p>
              </div>
            </div>

            <div className="dc-ai-result-actions">
              <button
                type="button"
                className="dc-btn-outline-print"
                onClick={() => window.print()}
              >
                Imprimir / PDF
              </button>
              <button
                type="button"
                className="dc-btn-red"
                onClick={handleCerrar}
              >
                Guardar en el curso
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
