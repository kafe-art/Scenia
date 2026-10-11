import { useState } from 'react'
import { Icon } from '../../../components/SceniaUI'
import { crearCursoConSecciones } from '../services/clases'

export default function CrearCursoModal({ isOpen, onClose, onCursoCreado }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    subject: 'Comunicación',
    nivel: 'Secundaria',
    grade: '3.º',
    sections: 'A, B',
    topic: 'Convivencia escolar',
    intereses: 'Debate, identidad cultural y creación audiovisual',
  })
  const [estudiantesList, setEstudiantesList] = useState([])
  const [nombreAlumno, setNombreAlumno] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [error, setError] = useState(null)
  const [mensajeArchivo, setMensajeArchivo] = useState(null)

  if (!isOpen) return null

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (error) setError(null)
  }

  const handleNext = () => {
    if (step === 1) {
      if (!formData.subject.trim()) {
        setError('Ingresa el nombre del curso o área.')
        return
      }
      if (!formData.sections.trim()) {
        setError('Especifica al menos una sección (ej. A, B).')
        return
      }
      setError(null)
      setStep(2)
    } else if (step === 2) {
      if (!formData.topic.trim()) {
        setError('Ingresa el tema actual de trabajo.')
        return
      }
      setError(null)
      setStep(3)
    }
  }

  const handleBack = () => {
    setError(null)
    setStep((prev) => Math.max(1, prev - 1))
  }

  const handleAgregarEstudianteManual = (e) => {
    e?.preventDefault()
    const nombreLimpio = nombreAlumno.trim()
    if (!nombreLimpio) return
    if (estudiantesList.includes(nombreLimpio)) {
      setError('Este alumno ya fue agregado a la lista.')
      return
    }
    setEstudiantesList((prev) => [...prev, nombreLimpio])
    setNombreAlumno('')
    setError(null)
  }

  const handleEliminarEstudiante = (nombre) => {
    setEstudiantesList((prev) => prev.filter((item) => item !== nombre))
  }

  const handleCargarArchivoSimulado = () => {
    const nombresEjemplo = [
      'Valeria Mendoza Sánchez',
      'Gabriel Ortiz Castro',
      'Sofía Benítez Vega',
      'Rodrigo Castillo Ramos',
    ]
    setEstudiantesList((prev) => Array.from(new Set([...prev, ...nombresEjemplo])))
    setMensajeArchivo('Se cargaron 4 estudiantes desde el archivo de nómina.')
    setTimeout(() => setMensajeArchivo(null), 3500)
  }

  const handleFinalSubmit = async (e) => {
    e?.preventDefault()
    setGuardando(true)
    setError(null)
    try {
      const nuevasClases = await crearCursoConSecciones({
        subject: formData.subject.trim(),
        nivel: formData.nivel,
        grade: formData.grade,
        sections: formData.sections,
        topic: formData.topic.trim(),
        intereses: formData.intereses.trim(),
        listaEstudiantes: estudiantesList,
      })
      if (onCursoCreado) {
        onCursoCreado(nuevasClases)
      }
      onClose()
    } catch (err) {
      setError(err?.message || 'Error al crear el curso y secciones.')
    } finally {
      setGuardando(false)
    }
  }

  const parsedSections = formData.sections
    .split(',')
    .map((s) => s.trim().toUpperCase())
    .filter(Boolean)

  return (
    <div className="dc-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="dc-modal-card" onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del modal */}
        <div className="dc-modal-header">
          <div>
            <span className="dc-modal-tag">SCENIA · PANEL DOCENTE</span>
            <h2 className="dc-modal-title">Crear curso y secciones</h2>
          </div>
          <button
            type="button"
            className="dc-modal-close-btn"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            ✕
          </button>
        </div>

        {/* Stepper de 3 pasos */}
        <div className="dc-stepper-wrap">
          <div className="dc-stepper-line" />
          <div className={`dc-stepper-node ${step >= 1 ? 'is-active' : ''}`}>1</div>
          <div className={`dc-stepper-node ${step >= 2 ? 'is-active' : ''}`}>2</div>
          <div className={`dc-stepper-node ${step >= 3 ? 'is-active' : ''}`}>3</div>
        </div>

        {error && <div className="dc-modal-error-alert">{error}</div>}

        {/* Paso 1: Datos del curso */}
        {step === 1 && (
          <div className="dc-step-content animate-fade-in">
            <div className="dc-form-grid-2">
              <div className="dc-form-group">
                <label className="dc-form-label">Nombre del curso o área</label>
                <input
                  type="text"
                  className="dc-form-input"
                  placeholder="Comunicación"
                  value={formData.subject}
                  onChange={(e) => handleChange('subject', e.target.value)}
                />
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Nivel educativo</label>
                <select
                  className="dc-form-select"
                  value={formData.nivel}
                  onChange={(e) => handleChange('nivel', e.target.value)}
                >
                  <option value="Secundaria">Secundaria</option>
                  <option value="Primaria">Primaria</option>
                </select>
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Grado</label>
                <select
                  className="dc-form-select"
                  value={formData.grade}
                  onChange={(e) => handleChange('grade', e.target.value)}
                >
                  <option value="1.°">1.°</option>
                  <option value="2.°">2.°</option>
                  <option value="3.°">3.°</option>
                  <option value="4.°">4.°</option>
                  <option value="5.°">5.°</option>
                </select>
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Secciones</label>
                <input
                  type="text"
                  className="dc-form-input"
                  placeholder="A, B"
                  value={formData.sections}
                  onChange={(e) => handleChange('sections', e.target.value)}
                />
              </div>
            </div>

            <div className="dc-modal-footer is-end">
              <button type="button" className="dc-btn-red" onClick={handleNext}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 2: Tema e intereses */}
        {step === 2 && (
          <div className="dc-step-content animate-fade-in">
            <div className="dc-form-grid-2">
              <div className="dc-form-group">
                <label className="dc-form-label">Tema actual</label>
                <input
                  type="text"
                  className="dc-form-input"
                  placeholder="Convivencia escolar"
                  value={formData.topic}
                  onChange={(e) => handleChange('topic', e.target.value)}
                />
              </div>

              <div className="dc-form-group">
                <label className="dc-form-label">Intereses de la sección</label>
                <textarea
                  className="dc-form-textarea"
                  rows={3}
                  placeholder="Debate, identidad cultural y creación audiovisual"
                  value={formData.intereses}
                  onChange={(e) => handleChange('intereses', e.target.value)}
                />
              </div>
            </div>

            <div className="dc-modal-footer is-between">
              <button type="button" className="dc-btn-link" onClick={handleBack}>
                Anterior
              </button>
              <button type="button" className="dc-btn-red" onClick={handleNext}>
                Continuar →
              </button>
            </div>
          </div>
        )}

        {/* Paso 3: Agregar estudiantes y Resumen con estado */}
        {step === 3 && (
          <div className="dc-step-content animate-fade-in">
            {/* Caja punteada exactamente igual a la captura 1 */}
            <div className="dc-dashed-students-box">
              <div className="dc-dashed-box-icon">
                <Icon name="users" size={32} />
              </div>
              <h3 className="dc-dashed-box-title">Agregar estudiantes</h3>
              <p className="dc-dashed-box-subtitle">
                Puedes registrarlos ahora o completar la lista después.
              </p>

              {/* Botón de cargar archivo */}
              <button
                type="button"
                className="dc-btn-outline-upload"
                onClick={handleCargarArchivoSimulado}
              >
                Cargar archivo de estudiantes
              </button>

              {mensajeArchivo && (
                <div className="dc-upload-status-msg">{mensajeArchivo}</div>
              )}

              {/* Ingreso manual uno por uno */}
              <div className="dc-manual-student-input-wrap">
                <div className="dc-manual-student-row">
                  <input
                    type="text"
                    className="dc-form-input-manual"
                    placeholder="Escribe el nombre del alumno (ej. Diego Santos)"
                    value={nombreAlumno}
                    onChange={(e) => setNombreAlumno(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAgregarEstudianteManual()
                      }
                    }}
                  />
                  <button
                    type="button"
                    className="dc-btn-add-student-mini"
                    onClick={handleAgregarEstudianteManual}
                  >
                    + Agregar
                  </button>
                </div>

                {/* Lista de estudiantes ingresados */}
                {estudiantesList.length > 0 && (
                  <div className="dc-manual-students-chips">
                    {estudiantesList.map((nombre, idx) => (
                      <span key={nombre} className="dc-student-chip">
                        <span className="dc-chip-num">{idx + 1}.</span>
                        <span className="dc-chip-name">{nombre}</span>
                        <button
                          type="button"
                          className="dc-chip-remove"
                          onClick={() => handleEliminarEstudiante(nombre)}
                          aria-label={`Eliminar ${nombre}`}
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Tarjeta Amarilla de Resumen con Estado (Captura 1) */}
            <div className="dc-summary-yellow-box">
              <strong className="dc-summary-yellow-title">Resumen</strong>
              <p className="dc-summary-yellow-text">
                {formData.subject} · {formData.grade} de {formData.nivel.toLowerCase()} · Secciones{' '}
                {parsedSections.join(' y ')}
              </p>
              <div className="dc-summary-status-pill">
                {estudiantesList.length === 0 ? (
                  <span>
                    • Estado de nómina: <strong>0 estudiantes registrados</strong> (Completar lista después en el aula)
                  </span>
                ) : (
                  <span>
                    • Estado de nómina: <strong>{estudiantesList.length} alumno(s)</strong> listos para vincular
                  </span>
                )}
              </div>
            </div>

            {/* Footer con Anterior y Crear curso */}
            <div className="dc-modal-footer is-between">
              <button
                type="button"
                className="dc-btn-link"
                onClick={handleBack}
                disabled={guardando}
              >
                Anterior
              </button>
              <button
                type="button"
                className="dc-btn-red"
                onClick={handleFinalSubmit}
                disabled={guardando}
              >
                {guardando ? 'Creando curso...' : 'Crear curso'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
