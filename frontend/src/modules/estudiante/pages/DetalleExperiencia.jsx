import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import ModalEntradaDigital from '../components/ModalEntradaDigital'
import { obtenerDashboardEstudiante } from '../services/estudianteStore'

export default function DetalleExperiencia() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState(null)
  const [modalEntrada, setModalEntrada] = useState(false)

  useEffect(() => {
    obtenerDashboardEstudiante().then(setData)
  }, [id])

  if (!data) return <Loading mensaje="Cargando experiencia teatral..." />

  const { estudiante, experiencia, entregaPrincipal } = data
  const tieneEntrega = entregaPrincipal?.estado === 'entregada'

  return (
    <div className="st-detalle-experiencia-page space-y-6 max-w-5xl mx-auto pb-16 animate-fade-in text-left">
      {/* Botón Volver (Captura 7) */}
      <div>
        <Link
          to="/estudiante"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition"
        >
          <span>‹</span>
          <span>Volver</span>
        </Link>
      </div>

      {/* Encabezado Principal (Captura 7) */}
      <header>
        <span className="text-rose-600 font-extrabold text-xs tracking-wider uppercase block">
          {experiencia.curso}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          {experiencia.titulo}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Acompañada por {experiencia.docente} · {experiencia.metodologia}
        </p>
      </header>

      {/* Banner Principal de la Experiencia (Captura 7) */}
      <article className="card rounded-3xl overflow-hidden shadow-sm flex flex-col md:flex-row bg-[#0d3a33] text-white">
        <div className="md:w-5/12 h-64 md:h-auto relative overflow-hidden bg-slate-900 flex-shrink-0">
          <img
            src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80"
            alt={experiencia.titulo}
            className="w-full h-full object-cover opacity-90"
          />
        </div>

        <div className="p-7 md:w-7/12 flex flex-col justify-between space-y-4">
          <div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
              {experiencia.estadoReserva}
            </span>

            <h2 className="text-2xl sm:text-3xl font-black mt-3 tracking-tight">
              {experiencia.fechaTexto}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100 font-semibold mt-1">
              {experiencia.lugar}
            </p>

            <p className="text-xs sm:text-sm text-slate-200 mt-3 leading-relaxed font-normal">
              {experiencia.sinopsis}
            </p>
          </div>
        </div>
      </article>

      {/* 3 Tarjetas de las Etapas Pedagógicas (Captura 7 y 8) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-2">
        {/* Etapa 1: ANTES · ME PREPARO */}
        <article className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center">
                1
              </span>
              <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
                ANTES · ME PREPARO
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {experiencia.etapas.preparacion.titulo}
            </h3>
            <p className="text-xs text-slate-600">
              Guía publicada:{' '}
              <strong className="text-slate-900">
                {experiencia.etapas.preparacion.guiaTitulo}
              </strong>
            </p>

            <ul className="text-xs text-slate-500 space-y-1.5 pt-2 border-t border-slate-100">
              <li>• {experiencia.etapas.preparacion.taller}</li>
              <li>• {experiencia.etapas.preparacion.herramienta}</li>
              <li>• Actividad previa y entregas</li>
            </ul>
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                navigate(`/estudiante/actividades/${experiencia.etapas.preparacion.actividadId}`)
              }
              className="w-full py-2.5 px-4 bg-indigo-700 hover:bg-indigo-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Continuar actividad</span>
              <span>›</span>
            </button>
          </div>
        </article>

        {/* Etapa 2: FUNCIÓN · VIVO LA EXPERIENCIA */}
        <article className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center">
                2
              </span>
              <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
                FUNCIÓN · VIVO LA EXPERIENCIA
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {experiencia.etapas.funcion.titulo}
            </h3>
            <p className="text-xs text-slate-600 font-semibold">
              {experiencia.fechaTexto} · {experiencia.lugar}
            </p>
            <p className="text-xs text-slate-500 leading-relaxed">
              {experiencia.etapas.funcion.orientaciones}
            </p>

            <div className="flex flex-wrap gap-2 pt-2 border-t border-slate-100">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Reserva confirmada
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200">
                {experiencia.asistenciaRegistrada ? '✓ Asistencia registrada' : 'Asistencia pendiente'}
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <button
              type="button"
              onClick={() => setModalEntrada(true)}
              className="w-full py-2.5 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Ver mi entrada</span>
              <span>🎟️</span>
            </button>
            <p className="text-[10px] text-slate-400 text-center">
              Abrir la entrada no registra asistencia.
            </p>
          </div>
        </article>

        {/* Etapa 3: DESPUÉS · COMPARTO */}
        <article className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between space-y-5">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-indigo-700 text-white font-extrabold text-xs flex items-center justify-center">
                3
              </span>
              <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider">
                DESPUÉS · COMPARTO
              </span>
            </div>

            <h3 className="text-lg font-black text-slate-900">
              {experiencia.etapas.reflexion.titulo}
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              {experiencia.etapas.reflexion.orientaciones}
            </p>

            <div className="pt-2 border-t border-slate-100">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 text-slate-600">
                {tieneEntrega ? '✓ Reflexión enviada' : 'Aún no iniciada'}
              </span>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() =>
                navigate(`/estudiante/actividades/${experiencia.etapas.preparacion.actividadId}`)
              }
              className="w-full py-2.5 px-4 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5"
            >
              <span>Ir a mi reflexión</span>
              <span>›</span>
            </button>
          </div>
        </article>
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
