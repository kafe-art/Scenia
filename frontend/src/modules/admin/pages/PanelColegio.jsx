import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { obtenerIndicadoresColegio } from '../../estudiante/services/estudianteStore'

export default function PanelColegio() {
  const [indicadores, setIndicadores] = useState(null)
  const [modalReporte, setModalReporte] = useState(false)
  const [descargando, setDescargando] = useState(false)
  const [toastMensaje, setToastMensaje] = useState(null)

  useEffect(() => {
    async function cargar() {
      const data = await obtenerIndicadoresColegio()
      setIndicadores(data)
    }
    cargar()
  }, [])

  const mostrarToast = (msg) => {
    setToastMensaje(msg)
    setTimeout(() => setToastMensaje(null), 3500)
  }

  const handleDescargarExcel = () => {
    mostrarToast('Generando planilla de evidencias consolidadas (CSV)...')
    setTimeout(() => {
      mostrarToast('✓ Planilla de evidencias descargada exitosamente.')
    }, 1200)
  }

  const handleDescargarPdf = () => {
    setDescargando(true)
    setTimeout(() => {
      setDescargando(false)
      setModalReporte(true)
    }, 800)
  }

  if (!indicadores) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12 text-center text-slate-500 font-sans">
        Cargando indicadores del colegio...
      </div>
    )
  }

  const { puntos, puntosMeta, nivelInstitucional, kpis, requisitos } = indicadores
  const porcentajePuntos = Math.min(100, Math.round((puntos / puntosMeta) * 100))

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 font-sans">
      {/* Toast Notification */}
      {toastMensaje && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700 animate-bounce">
          <span className="text-emerald-400 font-bold">✓</span>
          <span className="text-sm font-medium">{toastMensaje}</span>
        </div>
      )}

      {/* Encabezado */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Panel Institucional · Acreditación 2026
          </span>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-2">
            I.E. Emblemática San Miguel de Piura
          </h1>
          <p className="mt-1 text-slate-600 text-sm">
            Monitorea la participación cultural, evidencias y certificaciones escolares.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleDescargarExcel}
            className="px-4 py-2 text-xs font-bold bg-white text-slate-700 border border-slate-200 rounded-xl hover:bg-slate-50 transition shadow-sm"
          >
            Exportar datos (CSV)
          </button>
          <button
            type="button"
            onClick={handleDescargarPdf}
            className="px-4 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition shadow-sm flex items-center gap-1.5"
          >
            <span>⤓</span>
            {descargando ? 'Generando...' : 'Reporte Anual (PDF)'}
          </button>
        </div>
      </div>

      {/* Nivel Institucional (Fiel a Captura 13) */}
      <div className="bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                Nivel actual
              </span>
              <span className="text-xs text-slate-400">Escala de 3 niveles</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              {nivelInstitucional}
            </h2>
          </div>

          <div className="text-right sm:text-right">
            <span className="text-3xl font-black text-indigo-400 font-mono">
              {puntos}
            </span>
            <span className="text-slate-400 text-sm font-semibold"> / {puntosMeta} pts</span>
            <p className="text-xs text-slate-400 mt-0.5">
              {puntos >= puntosMeta
                ? '¡Meta alcanzada!'
                : `Te faltan ${puntosMeta - puntos} pts para Colegio Participante`}
            </p>
          </div>
        </div>

        {/* Barra de Progreso */}
        <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden mb-3 p-0.5 border border-slate-700/50">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 via-rose-500 to-amber-400 rounded-full transition-all duration-500"
            style={{ width: `${Math.max(5, porcentajePuntos)}%` }}
          />
        </div>

        <p className="text-xs text-slate-400 leading-relaxed max-w-2xl">
          {indicadores.reglasNota}
        </p>
      </div>

      {/* Grid de 6 KPIs (Fiel a Captura 13) */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8">
        {/* KPI 1 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-2xl block mb-2">👥</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Estudiantes participantes
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.estudiantesParticipantes}
            </span>
            <span className="text-xs text-slate-400">con experiencia activa</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Nómina de 3.º B registrada y con consentimiento.
          </p>
        </div>

        {/* KPI 2 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-2xl block mb-2">🎭</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Experiencias realizadas
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.experienciasRealizadas}
            </span>
            <span className="text-xs text-slate-400">obra en 3 etapas</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Otras voces, un mismo patio en curso.
          </p>
        </div>

        {/* KPI 3 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-2xl block mb-2">🎟️</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Asistencias verificadas
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.asistenciasTotales}
            </span>
            <span className="text-xs text-slate-400">en sala teatral</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Validada en puerta con entrada escolar.
          </p>
        </div>

        {/* KPI 4 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-2xl block mb-2">✍️</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Reflexiones entregadas
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.reflexionesTotales}
            </span>
            <span className="text-xs text-slate-400">evidencias subidas</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            En formato texto, audio o video.
          </p>
        </div>

        {/* KPI 5 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-2xl block mb-2">📖</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Aprendizajes trabajados
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.aprendizajesTrabajados}
            </span>
            <span className="text-xs text-slate-400">eje temático CNEB</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Convivencia y resolución de conflictos.
          </p>
        </div>

        {/* KPI 6 */}
        <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
          <span className="text-2xl block mb-2">💬</span>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block">
            Aprendizajes expresados
          </span>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono">
              {kpis.aprendizajesExpresados}
            </span>
            <span className="text-xs text-slate-400">con devolución docente</span>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Retroalimentación formativa registrada.
          </p>
        </div>
      </div>

      {/* Requisitos y Beneficios (Fiel a Captura 14) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Requisitos */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📋</span>
            <h3 className="text-base font-bold text-slate-900">
              Requisitos · Camino al siguiente nivel
            </h3>
          </div>
          <p className="text-xs text-slate-500 mb-4 leading-relaxed">
            Hitos necesarios para certificar al colegio con el nivel{' '}
            <strong>Colegio Participante</strong> ante la comunidad educativa:
          </p>

          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span
                className={`text-sm font-bold ${
                  requisitos.participacionVerificada
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                {requisitos.participacionVerificada ? '✓' : '○'}
              </span>
              <div>
                <strong className="text-xs font-bold text-slate-800 block">
                  Participación escolar verificada
                </strong>
                <p className="text-xs text-slate-500">
                  Al menos 1 función presencial con registro de asistencia en puerta.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span
                className={`text-sm font-bold ${
                  requisitos.vozEstudiantil ? 'text-emerald-600' : 'text-slate-400'
                }`}
              >
                {requisitos.vozEstudiantil ? '✓' : '○'}
              </span>
              <div>
                <strong className="text-xs font-bold text-slate-800 block">
                  Voz y reflexión estudiantil
                </strong>
                <p className="text-xs text-slate-500">
                  Entrega de evidencias de reflexión por parte de los estudiantes.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 rounded-2xl bg-slate-50 border border-slate-200">
              <span
                className={`text-sm font-bold ${
                  requisitos.acompanamientoDocente
                    ? 'text-emerald-600'
                    : 'text-slate-400'
                }`}
              >
                {requisitos.acompanamientoDocente ? '✓' : '○'}
              </span>
              <div>
                <strong className="text-xs font-bold text-slate-800 block">
                  Acompañamiento docente
                </strong>
                <p className="text-xs text-slate-500">
                  Guía pedagógica CNEB y retroalimentación cualitativa en plataforma.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Beneficios */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">🌟</span>
              <h3 className="text-base font-bold text-slate-900">
                Beneficios institucionales
              </h3>
            </div>
            <p className="text-xs text-slate-500 mb-4 leading-relaxed">
              Ventajas al alcanzar los niveles superiores del programa Scenia:
            </p>

            <ul className="space-y-3 text-xs text-slate-700">
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Distintivo digital acreditado:</strong> Sello escolar de
                  compromiso con la educación artística y el CNEB.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Reporte ejecutivo anual:</strong> Resumen formal para la
                  UGEL, DRE y asamblea de padres de familia.
                </span>
              </li>
              <li className="flex items-start gap-2.5">
                <span className="text-emerald-600 font-bold">✓</span>
                <span>
                  <strong>Tarifa escolar preferencial:</strong> Descuentos exclusivos y
                  cupos reservados para funciones matinales de gala.
                </span>
              </li>
            </ul>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500">Programa Escolar Scenia</span>
            <Link
              to="/docente"
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800"
            >
              Ver aula docente vinculada ›
            </Link>
          </div>
        </div>
      </div>

      {/* Modal de Reporte Anual PDF (Fiel a Captura 14) */}
      {modalReporte && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setModalReporte(false)}
        >
          <div
            className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full">
                  Documento Oficial Generado
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-2">
                  Reporte Anual de Impacto Cultural
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  I.E. Emblemática San Miguel de Piura · Año Académico 2026
                </p>
              </div>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
                onClick={() => setModalReporte(false)}
              >
                ✕
              </button>
            </div>

            <div className="mt-5 space-y-3 bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700">
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Nivel institucional alcanzado:</span>
                <strong className="text-slate-900">{nivelInstitucional} ({puntos} pts)</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Docente responsable:</span>
                <strong className="text-slate-900">Prof. Carla Mendoza (Comunicación)</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Estudiantes beneficiarios:</span>
                <strong className="text-slate-900">3.º de secundaria · Sección B</strong>
              </div>
              <div className="flex justify-between border-b border-slate-200 pb-2">
                <span className="text-slate-500">Obra teatral vinculada:</span>
                <strong className="text-slate-900">Otras voces, un mismo patio</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Cumplimiento Ley N.° 29733:</span>
                <strong className="text-emerald-700">100% de consentimientos verificados</strong>
              </div>
            </div>

            <p className="text-xs text-slate-500 mt-4 leading-relaxed">
              Este reporte consolida las evidencias pedagógicas de la plataforma Scenia y
              está listo para adjuntarse en el Plan Anual de Trabajo (PAT) y en las
              auditorías curriculares de la UGEL Piura.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                className="px-4 py-2 text-xs font-bold text-slate-600 hover:text-slate-800"
                onClick={() => setModalReporte(false)}
              >
                Cerrar
              </button>
              <button
                type="button"
                onClick={() => {
                  mostrarToast('Descargando archivo PDF formal...')
                  setModalReporte(false)
                }}
                className="px-5 py-2.5 text-xs font-bold bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 transition"
              >
                Descargar copia PDF ⤓
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
