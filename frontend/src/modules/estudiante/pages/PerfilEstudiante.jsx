import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ESTUDIANTE_ACTIVO, obtenerDashboardEstudiante } from '../services/estudianteStore'

export default function PerfilEstudiante() {
  const [estudiante] = useState(ESTUDIANTE_ACTIVO)
  const [metricas, setMetricas] = useState(null)
  const [modalConstancia, setModalConstancia] = useState(false)

  useEffect(() => {
    async function cargar() {
      const data = await obtenerDashboardEstudiante()
      setMetricas(data)
    }
    cargar()
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      {/* Botón Volver */}
      <div className="mb-6">
        <Link
          to="/estudiante"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition"
        >
          ← Volver a Mi ruta cultural
        </Link>
      </div>

      {/* Cabecera del Perfil */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className="w-24 h-24 rounded-3xl bg-rose-600 text-white font-extrabold text-3xl flex items-center justify-center shadow-lg shadow-rose-600/20 flex-shrink-0">
          AC
        </div>
        <div className="text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-1.5">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-rose-50 text-rose-700">
              Estudiante regular
            </span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 flex items-center gap-1">
              <span>✓</span> Consentimiento Ley 29733 Aprobado
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {estudiante.nombre}
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Código: <strong className="text-slate-800 font-mono">{estudiante.codigo}</strong> ·{' '}
            {estudiante.grado} de secundaria, Sección {estudiante.seccion}
          </p>
          <p className="text-xs text-slate-400 mt-0.5">
            {estudiante.colegio} · Piura, Perú
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Consentimiento Parental Ley N.° 29733 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📜</span>
              <h2 className="text-base font-bold text-slate-900">
                Consentimiento Legal Parental
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              En cumplimiento de la <strong>Ley N.° 29733</strong> (Protección de Datos
              Personales de Niños, Niñas y Adolescentes), este perfil cuenta con
              autorización formal de su apoderado(a) para participar en el programa Scenia.
            </p>

            <div className="space-y-2 text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <div className="flex justify-between">
                <span className="text-slate-500">Apoderada registrada:</span>
                <strong className="text-slate-800">Rosa Castro Quispe (Madre)</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Estado de firma:</span>
                <span className="text-emerald-700 font-bold">Verificado digitalmente</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Fecha de autorización:</span>
                <span className="text-slate-700 font-medium">12 de marzo de 2026</span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-400">Válido para el año escolar 2026</span>
            <button
              type="button"
              onClick={() => setModalConstancia(true)}
              className="text-xs font-bold text-rose-600 hover:text-rose-700 hover:underline"
            >
              Ver constancia ›
            </button>
          </div>
        </div>

        {/* Asignatura y Docente Vinculado */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-xl">📚</span>
              <h2 className="text-base font-bold text-slate-900">
                Curso y Docente Vinculado
              </h2>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed mb-4">
              Tu participación teatral se encuentra articulada a los aprendizajes y
              competencias del Currículo Nacional (CNEB).
            </p>

            <div className="bg-indigo-50/60 border border-indigo-100 p-4 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-700">
                Asignatura principal
              </span>
              <h3 className="text-base font-bold text-slate-900 mt-1">
                Comunicación · 3.º B
              </h3>
              <p className="text-xs text-slate-600 mt-1">
                Docente líder:{' '}
                <strong className="text-slate-800">Prof. Carla Mendoza</strong>
              </p>
              <div className="mt-3 pt-3 border-t border-indigo-100 text-xs text-indigo-900">
                <span>🎭 Obra del curso: </span>
                <strong className="font-semibold">Otras voces, un mismo patio</strong>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              Avance del curso: <strong>{metricas?.avance?.porcentaje || 0}%</strong>
            </span>
            <Link
              to="/estudiante"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Ir a las actividades ›
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Constancia Legal */}
      {modalConstancia && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalConstancia(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="text-4xl block mb-2">📜</span>
            <h3 className="text-xl font-bold text-slate-900">
              Constancia de Consentimiento Parental
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Registro legal #SCENIA-29733-SMP-3B-01-2026
            </p>

            <div className="mt-4 text-left text-xs bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-slate-700 leading-relaxed">
              <p>
                Yo, <strong>Rosa Castro Quispe</strong>, con DNI registrado, en calidad de
                madre y apoderada legal de la estudiante <strong>Andrea Castro Ramos</strong>,
                otorgo mi expreso consentimiento para:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-slate-600">
                <li>
                  Creación y uso de su cuenta formativa en la plataforma escolar Scenia.
                </li>
                <li>
                  Participación en salidas pedagógicas supervisadas a las salas de teatro
                  asociadas.
                </li>
                <li>
                  Registro de reflexiones y audios estrictamente pedagógicos evaluados por
                  el docente del área.
                </li>
              </ul>
              <div className="pt-2 text-emerald-700 font-bold">
                ✓ Documento firmado y validado por la Dirección del Colegio San Miguel.
              </div>
            </div>

            <button
              type="button"
              className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800"
              onClick={() => setModalConstancia(false)}
            >
              Cerrar constancia
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
