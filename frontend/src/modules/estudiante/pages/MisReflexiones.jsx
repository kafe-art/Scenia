import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import { obtenerReflexionesEstudiante } from '../services/estudianteStore'

export default function MisReflexiones() {
  const navigate = useNavigate()
  const [tab, setTab] = useState('todas') // 'todas' | 'pendientes' | 'enviadas'
  const [reflexiones, setReflexiones] = useState(null)

  useEffect(() => {
    obtenerReflexionesEstudiante().then(setReflexiones)
  }, [])

  if (!reflexiones) return <Loading mensaje="Cargando tus reflexiones..." />

  const filtradas = reflexiones.filter((r) => {
    if (tab === 'pendientes') return r.estado === 'pendiente' || r.estado === 'borrador'
    if (tab === 'enviadas') return r.estado === 'entregada'
    return true
  })

  return (
    <div className="st-mis-reflexiones-page space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in text-left">
      {/* Encabezado (Captura 12) */}
      <header>
        <span className="text-rose-600 font-extrabold text-xs tracking-wider uppercase block">
          MIS REFLEXIONES
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Lo que pienso también transforma
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Revisa tus actividades pendientes, borradores y respuestas enviadas.
        </p>
      </header>

      {/* Selector de Pestañas (Todas / Pendientes / Enviadas) */}
      <div className="flex border-b border-slate-200 gap-6 text-sm font-bold">
        <button
          type="button"
          onClick={() => setTab('todas')}
          className={`pb-3 transition ${
            tab === 'todas'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Todas
        </button>
        <button
          type="button"
          onClick={() => setTab('pendientes')}
          className={`pb-3 transition ${
            tab === 'pendientes'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Pendientes
        </button>
        <button
          type="button"
          onClick={() => setTab('enviadas')}
          className={`pb-3 transition ${
            tab === 'enviadas'
              ? 'text-rose-600 border-b-2 border-rose-600'
              : 'text-slate-500 hover:text-slate-800'
          }`}
        >
          Enviadas
        </button>
      </div>

      {/* Lista de Tarjetas de Reflexión (Captura 12) */}
      <div className="space-y-3.5">
        {filtradas.length === 0 ? (
          <div className="card p-10 text-center text-slate-500 bg-white border border-slate-200 rounded-3xl">
            <span className="text-3xl block mb-2">📖</span>
            <p className="font-bold text-sm">No tienes reflexiones en esta pestaña</p>
            <p className="text-xs text-slate-400 mt-0.5">
              Tus entregas y borradores aparecerán registrados aquí.
            </p>
          </div>
        ) : (
          filtradas.map((r) => {
            const esBorrador = r.estado === 'borrador'
            const esEntregada = r.estado === 'entregada'

            return (
              <div
                key={r.id}
                className="card bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-sm hover:border-indigo-300 transition flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex items-center gap-4">
                  <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 text-lg border border-indigo-100 font-bold">
                    <Icon name="book" size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      {esBorrador && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-800 border border-amber-200">
                          Borrador guardado
                        </span>
                      )}
                      {esEntregada && (
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                          ✓ Entregada
                        </span>
                      )}
                    </div>
                    <h3 className="text-base sm:text-lg font-black text-slate-900 mt-1">
                      {r.titulo}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {r.curso} · {r.fechaLimite}
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => navigate(`/estudiante/actividades/${r.id}`)}
                  className="px-4 py-2 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition inline-flex items-center justify-center gap-1.5 self-start sm:self-auto flex-shrink-0"
                >
                  <span>Abrir</span>
                  <span>›</span>
                </button>
              </div>
            )
          })
        )}
      </div>

      {/* Banner Informativo Inferior (Captura 12) */}
      <article className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex items-start gap-3.5">
        <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 text-base">
          <Icon name="spark" size={16} />
        </div>
        <div>
          <h3 className="text-sm font-black text-slate-900">Una entrega, un solo historial</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Esta reflexión está vinculada a la actividad y a tu experiencia. Los reenvíos se
            conservan como versiones, sin duplicarla.
          </p>
        </div>
      </article>
    </div>
  )
}
