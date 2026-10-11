import { useState, useEffect } from 'react'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import {
  obtenerLogrosEHistorial,
  registrarVisitaPersonal,
} from '../services/estudianteStore'

export default function MisLogrosEstudiante() {
  const [data, setData] = useState(null)
  const [modalVisita, setModalVisita] = useState(false)
  const [formVisita, setFormVisita] = useState({
    obraTitulo: '',
    fecha: new Date().toISOString().slice(0, 10),
    lugar: '',
    reflexion: '',
  })
  const [guardando, setGuardando] = useState(false)

  const cargarDatos = () => {
    obtenerLogrosEHistorial().then(setData)
  }

  useEffect(() => {
    cargarDatos()
  }, [])

  if (!data) return <Loading mensaje="Cargando tu historial y logros..." />

  const { insignias, historial } = data

  const handleGuardarVisita = async (e) => {
    e.preventDefault()
    if (!formVisita.obraTitulo.trim()) return
    setGuardando(true)
    try {
      await registrarVisitaPersonal(formVisita)
      setModalVisita(false)
      setFormVisita({
        obraTitulo: '',
        fecha: new Date().toISOString().slice(0, 10),
        lugar: '',
        reflexion: '',
      })
      cargarDatos()
    } finally {
      setGuardando(false)
    }
  }

  return (
    <div className="st-mis-logros-page space-y-8 max-w-5xl mx-auto pb-16 animate-fade-in text-left">
      {/* Encabezado Principal (Captura 9) */}
      <header>
        <span className="text-rose-600 font-extrabold text-xs tracking-wider uppercase block">
          MI HISTORIAL Y LOGROS
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          Cada experiencia deja una huella
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          Aquí aparecen solo las participaciones y visitas que registraste, no las obras disponibles en cartelera.
        </p>
      </header>

      {/* 1. Sección: Mis insignias (Captura 9) */}
      <section className="space-y-3.5">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Mis insignias</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Cada insignia se obtiene una sola vez, sin importar el formato de tu respuesta.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {insignias.map((ins) => {
            return (
              <div
                key={ins.id}
                className={`card rounded-3xl p-5 shadow-sm border transition flex flex-col justify-between space-y-4 ${
                  ins.desbloqueada
                    ? 'bg-emerald-50/50 border-emerald-200'
                    : 'bg-white border-slate-200'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg ${
                      ins.desbloqueada
                        ? 'bg-emerald-100 text-emerald-800 font-bold'
                        : 'bg-indigo-50 text-indigo-700'
                    }`}
                  >
                    <Icon name={ins.icono || 'award'} size={20} />
                  </div>

                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      ins.desbloqueada
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {ins.desbloqueada ? '✓ Obtenida' : 'En progreso'}
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-slate-900">{ins.nombre}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {ins.descripcion}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100">
                  <span className="text-[11px] font-bold text-slate-400 block">
                    {ins.progresoTexto}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* 2. Sección: Historial cultural (Captura 9) */}
      <section className="space-y-3.5">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Historial cultural</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Asistencia, reflexión y devoluciones en un mismo registro.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setModalVisita(true)}
            className="px-3.5 py-2 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition self-start sm:self-auto"
          >
            + Declarar visita personal
          </button>
        </div>

        {historial.length === 0 ? (
          /* Estado inicial vacío (Captura 9 exacta) */
          <div className="card bg-white border border-slate-200 rounded-3xl p-8 shadow-sm flex items-start gap-4">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 text-lg border border-indigo-100">
              <Icon name="book" size={20} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Tu historial empezará aquí</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Una obra se agrega cuando existe una asistencia registrada o declaras una visita
                personal.
              </p>
            </div>
          </div>
        ) : (
          /* Lista de participaciones culturales reales */
          <div className="space-y-3.5">
            {historial.map((item) => (
              <div
                key={item.id}
                className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-bold text-indigo-700 uppercase tracking-wider block">
                      {item.tipo}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 mt-0.5">{item.obra}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">Fecha: {item.fecha}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        item.asistenciaVerificada
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}
                    >
                      {item.asistenciaVerificada
                        ? '✓ Asistencia verificada'
                        : 'Asistencia en proceso'}
                    </span>
                  </div>
                </div>

                <div className="bg-slate-50 rounded-2xl p-4 text-xs space-y-1.5 border border-slate-200/70">
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Reflexión del estudiante:</span>
                    <strong className="text-slate-900">{item.reflexionEstado}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 font-semibold">Devolución docente:</span>
                    <span className="text-slate-700 font-medium">{item.devolucion}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Modal: Declarar visita personal independiente */}
      {modalVisita && (
        <div
          className="dc-modal-overlay"
          onClick={() => setModalVisita(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="dc-modal-card compact max-w-md w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="dc-modal-header border-b border-slate-200 pb-3">
              <div>
                <span className="dc-modal-tag text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  EXPERIENCIA INDEPENDIENTE
                </span>
                <h3 className="dc-modal-title text-lg font-extrabold text-slate-900 mt-0.5">
                  Declarar visita personal
                </h3>
              </div>
              <button
                type="button"
                className="dc-modal-close-btn text-slate-400 hover:text-slate-600"
                onClick={() => setModalVisita(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardarVisita} className="p-5 space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Título de la obra vista
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none"
                  value={formVisita.obraTitulo}
                  onChange={(e) => setFormVisita({ ...formVisita, obraTitulo: e.target.value })}
                  placeholder="Ej. El secreto del algarrobo"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Fecha de asistencia
                  </label>
                  <input
                    type="date"
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-xl"
                    value={formVisita.fecha}
                    onChange={(e) => setFormVisita({ ...formVisita, fecha: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Lugar o Teatro
                  </label>
                  <input
                    type="text"
                    className="w-full p-2.5 text-sm border border-slate-300 rounded-xl"
                    placeholder="Ej. Alianza Francesa"
                    value={formVisita.lugar}
                    onChange={(e) => setFormVisita({ ...formVisita, lugar: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Tu breve reflexión personal
                </label>
                <textarea
                  rows={3}
                  className="w-full p-3 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none resize-y"
                  placeholder="¿De qué trataba y qué idea te dejó?"
                  value={formVisita.reflexion}
                  onChange={(e) => setFormVisita({ ...formVisita, reflexion: e.target.value })}
                  required
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex justify-end gap-2.5">
                <button
                  type="button"
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                  onClick={() => setModalVisita(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={guardando}
                  className="px-5 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-xs transition"
                >
                  {guardando ? 'Guardando...' : 'Registrar en mi historial'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
