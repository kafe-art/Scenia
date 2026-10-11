import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import ModalEntradaDigital from '../components/ModalEntradaDigital'
import { obtenerDashboardEstudiante } from '../services/estudianteStore'

export default function RutaCultural() {
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [modalEntrada, setModalEntrada] = useState(false)

  useEffect(() => {
    obtenerDashboardEstudiante().then(setData)
  }, [])

  if (!data) return <Loading mensaje="Cargando tu ruta cultural..." />

  const { estudiante, siguienteActividad, actividadesCursos, experiencia, avance } = data

  return (
    <div className="st-ruta-cultural-v2 space-y-7 max-w-5xl mx-auto pb-12 animate-fade-in text-left">
      {/* 1. Encabezado de Bienvenida (Captura 1) */}
      <header className="st-welcome-header">
        <span className="text-rose-600 font-extrabold text-xs tracking-wider uppercase block">
          MI RUTA CULTURAL
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-1">
          Buenos días, {estudiante?.nombre ? estudiante.nombre.split(' ')[0] : 'Andrea'}
        </h1>
        <p className="mt-1 text-sm sm:text-base text-slate-600">
          Tu recorrido reúne lo que preparas, vives y compartes en cada experiencia.
        </p>
      </header>

      {/* 2. Banner: SIGUIENTE ACTIVIDAD DESTACADA (Captura 1) */}
      <section className="bg-gradient-to-r from-[#f0efff] to-[#fbfaff] border border-[#dedbf5] rounded-3xl p-6 sm:p-7 shadow-sm flex flex-col md:flex-row md:items-center md:justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <div className="w-11 h-11 rounded-2xl bg-white text-indigo-700 flex items-center justify-center flex-shrink-0 shadow-sm border border-indigo-100 text-xl font-bold">
            <Icon name="spark" size={22} />
          </div>
          <div>
            <span className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider block">
              SIGUIENTE ACTIVIDAD
            </span>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-0.5 tracking-tight">
              {siguienteActividad.titulo}
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 font-medium">
              {siguienteActividad.subtitulo}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/estudiante/actividades/${siguienteActividad.actividadId}`)}
          className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm py-3 px-6 rounded-2xl shadow-sm hover:shadow transition flex items-center justify-center gap-2 self-start md:self-auto flex-shrink-0"
        >
          <span>Empezar actividad</span>
          <span className="text-base">›</span>
        </button>
      </section>

      {/* 3. Sección: Actividades de mis cursos (Captura 1) */}
      <section className="space-y-3.5">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Actividades de mis cursos</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Publicadas para los grupos en los que estás matriculada.
            </p>
          </div>
          <Link
            to="/estudiante/reflexiones"
            className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 transition"
          >
            <span>Ver todas</span>
            <span>›</span>
          </Link>
        </div>

        <div className="space-y-3">
          {actividadesCursos.map((act) => {
            const esBorrador = act.estado === 'borrador'
            const esEntregada = act.estado === 'entregada'

            return (
              <div
                key={act.id}
                className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center flex-shrink-0 text-lg border border-indigo-100">
                    <Icon name="book" size={18} />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                        {act.cursoSeccion}
                      </span>
                      {esBorrador && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                          Borrador
                        </span>
                      )}
                      {esEntregada && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ Entregada
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900 mt-1">{act.titulo}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {act.tema} · {act.fechaLimite}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/estudiante/actividades/${act.id}`)}
                  className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center justify-center gap-1.5 self-start sm:self-auto flex-shrink-0"
                >
                  <span>Abrir actividad</span>
                  <span>›</span>
                </button>
              </div>
            )
          })}
        </div>
      </section>

      {/* 4. Sección: Mis experiencias teatrales (Captura 2) */}
      <section className="space-y-3.5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Mis experiencias teatrales</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Obras asignadas por tus docentes, separadas de la cartelera.
          </p>
        </div>

        {/* Tarjeta Horizontal Grande de la Experiencia */}
        <article className="card bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row">
          {/* Fotografía de escena teatral */}
          <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-slate-900 flex-shrink-0">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
              alt={experiencia.titulo}
              className="w-full h-full object-cover opacity-90"
            />
          </div>

          {/* Cuerpo descriptivo */}
          <div className="p-6 sm:p-7 md:w-7/12 flex flex-col justify-between space-y-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-100">
                  {experiencia.curso}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {experiencia.estadoReserva}
                </span>
              </div>

              <h3 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                {experiencia.titulo}
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Con {experiencia.docente} · {experiencia.fechaTexto}
              </p>

              {/* Indicadores de las 3 etapas pedagógicas */}
              <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-3 gap-2 text-xs">
                <div className="flex items-center gap-1.5 text-indigo-700 font-bold">
                  <span className="w-5 h-5 rounded-full bg-indigo-100 text-indigo-800 flex items-center justify-center text-[10px]">
                    📖
                  </span>
                  <span>Preparación</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-500 font-semibold">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-[10px]">
                    🎟️
                  </span>
                  <span>Asistencia</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400 font-medium">
                  <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center text-[10px]">
                    ✨
                  </span>
                  <span>Reflexión</span>
                </div>
              </div>
            </div>

            <div>
              <button
                type="button"
                onClick={() => navigate(`/estudiante/experiencias/${experiencia.id}`)}
                className="bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm py-2.5 px-5 rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
              >
                <span>Ver detalles</span>
                <span>›</span>
              </button>
            </div>
          </div>
        </article>
      </section>

      {/* 5. Grilla Inferior de 2 Columnas (Captura 2) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Columna Izquierda: PRÓXIMA FUNCIÓN */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
              PRÓXIMA FUNCIÓN
            </span>
            <h3 className="text-lg font-black text-slate-900 mt-1">{experiencia.titulo}</h3>
            <p className="text-xs font-bold text-slate-700 mt-1">{experiencia.fechaTexto}</p>
            <p className="text-xs text-slate-500 mt-0.5">{experiencia.lugar}</p>
          </div>

          <div>
            <button
              type="button"
              onClick={() => setModalEntrada(true)}
              className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center gap-1.5"
            >
              <span>Ver mi entrada</span>
              <span>🎟️</span>
            </button>
          </div>
        </section>

        {/* Columna Derecha: RESUMEN DE AVANCE */}
        <section className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
              RESUMEN DE AVANCE
            </span>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl sm:text-4xl font-black text-slate-900">
                {avance.porcentaje}%
              </span>
              <span className="text-xs text-slate-500 font-semibold">de esta experiencia</span>
            </div>

            <p className="text-xs text-slate-500 mt-3 leading-relaxed">
              Se completa con preparación, asistencia registrada y reflexión revisada.{' '}
              {avance.etapasVerificadas} de {avance.totalEtapas} etapas verificadas.
            </p>
          </div>

          <div>
            <Link
              to="/estudiante/logros"
              className="text-xs font-bold text-indigo-700 hover:text-indigo-900 inline-flex items-center gap-1 transition"
            >
              <span>Tu progreso cultural</span>
              <span>›</span>
            </Link>
          </div>
        </section>
      </div>

      {/* Modal Entrada Digital */}
      <ModalEntradaDigital
        isOpen={modalEntrada}
        onClose={() => setModalEntrada(false)}
        experiencia={experiencia}
        estudiante={estudiante}
      />
    </div>
  )
}
