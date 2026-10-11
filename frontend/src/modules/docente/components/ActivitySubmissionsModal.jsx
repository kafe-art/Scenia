import { useState } from 'react'

export default function ActivitySubmissionsModal({ onClose }) {
  const [selected, setSelected] = useState(null)

  const students = [
    {
      name: 'Andrea Castro',
      submitted: true,
      note: 'Reflexión escrita sobre cómo la escucha puede transformar un conflicto del aula. Encontré que aprender a pausar antes de responder cambia por completo el ambiente del grupo.',
    },
    {
      name: 'Bruno Díaz',
      submitted: true,
      note: 'Audio de 1:20 min con una propuesta de diálogo para su grupo. Destaca la importancia de dar espacio a quienes casi nunca intervienen en clase.',
    },
    {
      name: 'Camila Flores',
      submitted: true,
      note: 'Escena breve escrita en equipo y reflexión personal sobre el impacto del lenguaje no verbal y los silencios al resolver desacuerdos.',
    },
    {
      name: 'Diego Herrera',
      submitted: false,
      note: '',
    },
    {
      name: 'Elena Jiménez',
      submitted: false,
      note: '',
    },
  ]

  const selectedStudent = students.find((student) => student.name === selected)

  return (
    <div
      className="dc-modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="dc-modal-card is-wide"
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth: '36rem' }}
      >
        <div className="dc-modal-header">
          <div>
            <span className="dc-modal-tag">REVISIÓN DE EVIDENCIAS</span>
            <h3 className="dc-modal-title">Entregas · Mi voz en el grupo</h3>
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

        <div className="p-6">
          {selectedStudent ? (
            <div>
              <button
                type="button"
                className="back-link mb-4 inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
                onClick={() => setSelected(null)}
              >
                ← Volver al listado
              </button>

              <div className="submission-detail">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-800 font-extrabold flex items-center justify-center text-sm">
                    {selectedStudent.name
                      .split(' ')
                      .map((p) => p[0])
                      .join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">
                      {selectedStudent.name}
                    </h4>
                    <span
                      className={
                        selectedStudent.submitted
                          ? 'status-badge mt-1'
                          : 'pending-badge mt-1'
                      }
                    >
                      {selectedStudent.submitted ? '✓ Entregada' : '⏳ Sin entregar'}
                    </span>
                  </div>
                </div>

                {selectedStudent.submitted ? (
                  <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-4">
                    <span className="meta-label block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                      Contenido entregado
                    </span>
                    <p className="text-sm leading-relaxed text-slate-700 font-normal">
                      {selectedStudent.note}
                    </p>
                  </div>
                ) : (
                  <div className="mt-5 flex items-center gap-2 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-sm">
                    <span>⏱️</span>
                    <span>Este estudiante todavía no ha subido su actividad.</span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="mb-4 text-sm text-slate-600">
                Selecciona un estudiante para revisar el contenido de su entrega.
              </p>

              <div className="submission-list divide-y divide-slate-100 border border-slate-200 rounded-xl overflow-hidden">
                {students.map((student) => (
                  <button
                    key={student.name}
                    type="button"
                    className="flex w-full items-center gap-3 p-3.5 hover:bg-slate-50 text-left transition"
                    onClick={() => setSelected(student.name)}
                  >
                    <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-xs flex-shrink-0">
                      {student.name
                        .split(' ')
                        .map((p) => p[0])
                        .join('')}
                    </div>
                    <strong className="text-sm font-semibold text-slate-900 flex-1">
                      {student.name}
                    </strong>
                    <span
                      className={
                        student.submitted ? 'submission-check' : 'pending-badge'
                      }
                    >
                      {student.submitted ? (
                        <span className="text-emerald-700 font-bold text-xs flex items-center gap-1">
                          ✓ Entregada
                        </span>
                      ) : (
                        <span className="text-amber-800 font-semibold text-xs">
                          Pendiente
                        </span>
                      )}
                    </span>
                    <span className="text-slate-400 text-sm">→</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="dc-modal-footer is-end p-4 border-t border-slate-200 bg-slate-50">
          <button
            type="button"
            className="btn btn-secondary px-4 py-2 text-sm font-bold border border-slate-300 bg-white rounded-xl"
            onClick={onClose}
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}
