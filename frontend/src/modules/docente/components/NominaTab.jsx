import { useState } from 'react'
import ConsentBadge from './ConsentBadge'
import FichaAlumno from './FichaAlumno'
import { Icon } from '../../../components/SceniaUI'
import {
  inscribirEstudiantes,
  quitarEstudiante,
} from '../services/clases'

export default function NominaTab({ clase, ejecutar }) {
  const [modalInscribir, setModalInscribir] = useState(false)
  const [modalRetirar, setModalRetirar] = useState(null)
  const [nombreNuevo, setNombreNuevo] = useState('')
  const [consentimientoNuevo, setConsentimientoNuevo] = useState('otorgado')
  const [modoMasivo, setModoMasivo] = useState(false)
  const [textoMasivo, setTextoMasivo] = useState('')
  const [busqueda, setBusqueda] = useState('')
  const [fichaId, setFichaId] = useState(null)
  const [enviando, setEnviando] = useState(false)

  const estudiantes = clase.estudiantes || []
  const { resumen } = clase

  const filtrados = estudiantes.filter((est) => {
    const q = busqueda.toLowerCase().trim()
    if (!q) return true
    return (
      est.nombre.toLowerCase().includes(q) ||
      (est.codigo && est.codigo.toLowerCase().includes(q)) ||
      (est.username && est.username.toLowerCase().includes(q))
    )
  })

  const ficha = estudiantes.find((e) => e.id === fichaId)

  const handleAgregarEstudiante = async (e) => {
    e.preventDefault()
    if (modoMasivo) {
      const lineas = textoMasivo.split('\n').filter((l) => l.trim())
      if (!lineas.length) return
      setEnviando(true)
      try {
        await ejecutar(() => inscribirEstudiantes(clase.id, lineas))
        setTextoMasivo('')
        setModalInscribir(false)
      } finally {
        setEnviando(false)
      }
    } else {
      if (!nombreNuevo.trim()) return
      setEnviando(true)
      try {
        await ejecutar(async () => {
          await inscribirEstudiantes(clase.id, [nombreNuevo.trim()])
        })
        setNombreNuevo('')
        setModalInscribir(false)
      } finally {
        setEnviando(false)
      }
    }
  }

  const handleConfirmarRetiro = async () => {
    if (!modalRetirar) return
    setEnviando(true)
    try {
      await ejecutar(() => quitarEstudiante(clase.id, modalRetirar.id))
      setModalRetirar(null)
      if (fichaId === modalRetirar.id) setFichaId(null)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <div className="dc-students-tab-container space-y-6 animate-fade-in">
      {/* Resumen Superior de Métricas Rápidas */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="block text-xs font-bold text-slate-500 uppercase tracking-wider">
            Matriculados
          </span>
          <strong className="text-xl font-extrabold text-slate-900 block mt-0.5">
            {resumen.estudiantes}
          </strong>
          <span className="text-xs text-slate-500 font-medium">alumnos registrados</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="block text-xs font-bold text-emerald-700 uppercase tracking-wider">
            Ley N.° 29733
          </span>
          <strong className="text-xl font-extrabold text-emerald-700 block mt-0.5">
            {resumen.conConsentimiento}
          </strong>
          <span className="text-xs text-emerald-600 font-medium">consentimientos válidos</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="block text-xs font-bold text-amber-700 uppercase tracking-wider">
            Pendientes
          </span>
          <strong className="text-xl font-extrabold text-amber-800 block mt-0.5">
            {resumen.sinConsentimiento}
          </strong>
          <span className="text-xs text-amber-700 font-medium">sin autorización</span>
        </div>

        <div className="rounded-xl border border-slate-200 bg-white p-3.5 shadow-sm">
          <span className="block text-xs font-bold text-indigo-700 uppercase tracking-wider">
            Audios
          </span>
          <strong className="text-xl font-extrabold text-indigo-800 block mt-0.5">
            {resumen.audiosPendientes}
          </strong>
          <span className="text-xs text-indigo-600 font-medium">por retroalimentar</span>
        </div>
      </div>

      {/* Tarjeta Principal de Estudiantes (Diseño idéntico a la Captura 2) */}
      <div className="card overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
        {/* Cabecera de la Tarjeta */}
        <div className="p-5 border-b border-slate-200 flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-white">
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Estudiantes de {clase.grade} {clase.section}
            </h2>
            <p className="text-sm text-slate-500 mt-0.5">
              {estudiantes.length} estudiantes registrados · mostrando {filtrados.length}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Buscador */}
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar estudiante o código..."
                className="pl-8 pr-3 py-1.5 text-xs border border-slate-300 rounded-xl focus:border-indigo-600 focus:outline-none w-48 sm:w-60 transition"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />
              <span className="absolute left-2.5 top-2 text-slate-400 pointer-events-none flex items-center">
                <Icon name="search" size={14} />
              </span>
              {busqueda && (
                <button
                  type="button"
                  className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-700 text-xs"
                  onClick={() => setBusqueda('')}
                >
                  ✕
                </button>
              )}
            </div>

            {/* Botón Agregar Estudiante */}
            <button
              type="button"
              className="btn btn-secondary px-3.5 py-1.5 text-xs font-bold border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 rounded-xl flex items-center gap-1.5 shadow-sm transition"
              onClick={() => {
                setNombreNuevo('')
                setTextoMasivo('')
                setModalInscribir(true)
              }}
            >
              <span className="font-extrabold text-sm">+</span> Agregar estudiante
            </button>
          </div>
        </div>

        {/* Lista de Filas de Estudiantes (Captura 2) */}
        {filtrados.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <span className="text-3xl block mb-2">👥</span>
            <p className="font-semibold text-sm">No se encontraron estudiantes</p>
            <p className="text-xs text-slate-400 mt-1">
              Prueba con otro término de búsqueda o agrega un nuevo alumno.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {filtrados.map((est) => {
              const iniciales = est.nombre
                .split(' ')
                .map((x) => x[0])
                .slice(0, 2)
                .join('')
              const actividadEntregada = (est.avance ?? 0) >= 50

              return (
                <div
                  key={est.id}
                  className="student-row flex items-center gap-3.5 px-5 py-3.5 hover:bg-slate-50/80 transition group"
                >
                  {/* Avatar con Iniciales */}
                  <div
                    className="avatar avatar-small w-8 h-8 rounded-full bg-slate-100 text-slate-700 font-extrabold flex items-center justify-center text-xs flex-shrink-0 cursor-pointer"
                    onClick={() => setFichaId(est.id)}
                    title="Ver ficha del estudiante"
                  >
                    {iniciales}
                  </div>

                  {/* Nombre y Código */}
                  <div
                    className="flex-1 min-w-0 cursor-pointer"
                    onClick={() => setFichaId(est.id)}
                  >
                    <div className="flex items-center gap-2 flex-wrap">
                      <strong className="text-sm font-bold text-slate-900 truncate">
                        {est.nombre}
                      </strong>
                      <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-1.5 py-0.5 rounded border border-slate-200">
                        {est.codigo || 'SMP-3B-01'}
                      </span>
                      <ConsentBadge estado={est.consentimiento} />
                    </div>
                  </div>

                  {/* Estado de la Actividad (Captura 2: Actividad entregada vs Pendiente) */}
                  <div
                    className="text-right flex items-center gap-3 flex-shrink-0 cursor-pointer"
                    onClick={() => setFichaId(est.id)}
                  >
                    <span
                      className={`text-xs font-semibold ${
                        actividadEntregada
                          ? 'text-slate-500'
                          : 'text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full'
                      }`}
                    >
                      {actividadEntregada ? 'Actividad entregada' : 'Pendiente'}
                    </span>
                  </div>

                  {/* Acciones Rápidas */}
                  <div className="flex items-center gap-1.5 pl-2">
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-indigo-600 rounded text-xs transition"
                      onClick={() => setFichaId(est.id)}
                      title="Ver ficha y audios de reflexión"
                    >
                      👁️
                    </button>
                    <button
                      type="button"
                      className="p-1 text-slate-400 hover:text-rose-600 rounded text-xs transition opacity-0 group-hover:opacity-100"
                      onClick={() => setModalRetirar(est)}
                      title="Retirar estudiante de este curso"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Modal Ficha del Estudiante */}
      {ficha && (
        <FichaAlumno
          clase={clase}
          estudiante={ficha}
          ejecutar={ejecutar}
          onCerrar={() => setFichaId(null)}
        />
      )}

      {/* Modal: Agregar Estudiante */}
      {modalInscribir && (
        <div
          className="dc-modal-overlay"
          onClick={() => setModalInscribir(false)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="dc-modal-card compact"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '30rem' }}
          >
            <div className="dc-modal-header">
              <div>
                <span className="dc-modal-tag">MATRÍCULA AÚLICA</span>
                <h3 className="dc-modal-title">
                  Agregar estudiante · {clase.grade} {clase.section}
                </h3>
              </div>
              <button
                type="button"
                className="dc-modal-close-btn"
                onClick={() => setModalInscribir(false)}
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              {/* Selector de Modo */}
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  type="button"
                  className={`pb-2 text-xs font-bold border-b-2 mr-4 transition ${
                    !modoMasivo
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                  onClick={() => setModoMasivo(false)}
                >
                  Individual
                </button>
                <button
                  type="button"
                  className={`pb-2 text-xs font-bold border-b-2 transition ${
                    modoMasivo
                      ? 'border-indigo-600 text-indigo-700'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                  onClick={() => setModoMasivo(true)}
                >
                  Carga masiva por lista
                </button>
              </div>

              <form onSubmit={handleAgregarEstudiante} className="space-y-4">
                {!modoMasivo ? (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Nombre completo del estudiante
                      </label>
                      <input
                        type="text"
                        placeholder="Ej. Valeria Morales"
                        className="field w-full p-2.5 text-sm border border-slate-300 rounded-xl"
                        value={nombreNuevo}
                        onChange={(e) => setNombreNuevo(e.target.value)}
                        required
                        autoFocus
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Consentimiento Parental (Ley N.° 29733)
                      </label>
                      <select
                        className="field w-full p-2.5 text-sm border border-slate-300 rounded-xl bg-white"
                        value={consentimientoNuevo}
                        onChange={(e) => setConsentimientoNuevo(e.target.value)}
                      >
                        <option value="otorgado">Otorgado (Autorizado por apoderado)</option>
                        <option value="pendiente">Pendiente de firma</option>
                        <option value="revocado">Revocado</option>
                      </select>
                    </div>

                    <div className="rounded-xl bg-slate-50 border border-slate-200 p-3 text-xs text-slate-500">
                      ℹ️ Se generará automáticamente el código institucional (ej.{' '}
                      <code className="text-indigo-700 font-bold">
                        SMP-{clase.grade?.replace(/[^0-9]/g, '') || '3'}{clase.section}-
                        {String(estudiantes.length + 1).padStart(2, '0')}
                      </code>
                      ) y el usuario para el acceso a Scenia.
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                        Pega los nombres (uno por línea)
                      </label>
                      <textarea
                        rows={5}
                        placeholder={'Mateo Vílchez\nLucía Morales\nRodrigo Sánchez'}
                        className="field w-full p-2.5 text-sm border border-slate-300 rounded-xl font-sans"
                        value={textoMasivo}
                        onChange={(e) => setTextoMasivo(e.target.value)}
                        required
                      />
                    </div>
                  </>
                )}

                <div className="flex justify-end gap-2 pt-2 border-t border-slate-200">
                  <button
                    type="button"
                    className="btn btn-secondary px-4 py-2 text-xs font-bold border border-slate-300 bg-white rounded-xl"
                    onClick={() => setModalInscribir(false)}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 py-2 text-xs font-bold bg-indigo-700 hover:bg-indigo-800 text-white rounded-xl"
                    disabled={enviando}
                  >
                    {enviando ? 'Guardando...' : 'Registrar estudiante'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Confirmar Retiro de Estudiante */}
      {modalRetirar && (
        <div
          className="dc-modal-overlay"
          onClick={() => setModalRetirar(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="dc-modal-card compact"
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: '28rem' }}
          >
            <div className="p-6 space-y-4 text-center">
              <span className="text-3xl block">⚠️</span>
              <h3 className="text-lg font-bold text-slate-900">
                ¿Retirar a {modalRetirar.nombre}?
              </h3>
              <p className="text-xs leading-relaxed text-slate-600">
                El estudiante será desvinculado de la sección{' '}
                <strong>
                  {clase.grade} {clase.section}
                </strong>
                . Se conservarán sus bitácoras previas pero perderá acceso a las actividades de este curso.
              </p>

              <div className="flex justify-center gap-3 pt-3">
                <button
                  type="button"
                  className="btn btn-secondary px-4 py-2 text-xs font-bold border border-slate-300 bg-white rounded-xl"
                  onClick={() => setModalRetirar(null)}
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  className="btn btn-primary px-4 py-2 text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl"
                  onClick={handleConfirmarRetiro}
                  disabled={enviando}
                >
                  {enviando ? 'Retirando...' : 'Sí, retirar estudiante'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
