import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'

export default function PerfilDocente() {
  const [perfil, setPerfil] = useState({
    nombre: 'Carla Mendoza',
    email: 'carla.mendoza@sanmiguel.edu.pe',
    telefono: '+51 968 452 119',
    especialidad: 'Comunicación, Teatro Escolar y Arte',
    colegio: 'I.E. Emblemática San Miguel de Piura',
    codigoModular: '0349281',
    ugel: 'UGEL Piura / DREP',
    notificacionesEmail: true,
    recordatorioFunciones: true,
  })

  const [guardado, setGuardado] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setGuardado(true)
    setTimeout(() => setGuardado(false), 3500)
  }

  return (
    <div className="dc-perfil-page max-w-4xl mx-auto space-y-6 pb-12 animate-fade-in text-left">
      {/* Volver a inicio */}
      <div>
        <Link
          to="/docente"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition"
        >
          ← Volver al Panel Docente
        </Link>
      </div>

      {/* Banner de Perfil */}
      <div className="card bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center gap-5">
        <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-800 text-2xl font-black flex items-center justify-center flex-shrink-0 border-2 border-emerald-300">
          CM
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {perfil.nombre}
            </h1>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
              Docente Titular
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1">
            {perfil.especialidad} · {perfil.colegio}
          </p>
          <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-500 font-medium">
            <span>📧 {perfil.email}</span>
            <span>📍 Piura, Perú</span>
            <span>🏛️ {perfil.ugel}</span>
          </div>
        </div>
      </div>

      {/* Alerta de Guardado */}
      {guardado && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-semibold flex items-center gap-2">
          <Icon name="check" size={18} />
          <span>¡Datos de perfil y preferencias guardados correctamente!</span>
        </div>
      )}

      {/* Grid de Formulario y Estado del Programa */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Formulario Principal */}
        <div className="md:col-span-2 card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Información Profesional</h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nombres y Apellidos
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  value={perfil.nombre}
                  onChange={(e) => setPerfil({ ...perfil, nombre: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Correo Institucional
                </label>
                <input
                  type="email"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  value={perfil.email}
                  onChange={(e) => setPerfil({ ...perfil, email: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Teléfono / WhatsApp
                </label>
                <input
                  type="tel"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  value={perfil.telefono}
                  onChange={(e) => setPerfil({ ...perfil, telefono: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Área Curricular
                </label>
                <input
                  type="text"
                  className="w-full p-2.5 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100"
                  value={perfil.especialidad}
                  onChange={(e) => setPerfil({ ...perfil, especialidad: e.target.value })}
                />
              </div>
            </div>

            <div className="pt-2 border-t border-slate-100 space-y-2">
              <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Preferencias de Notificación
              </span>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={perfil.recordatorioFunciones}
                  onChange={(e) =>
                    setPerfil({ ...perfil, recordatorioFunciones: e.target.checked })
                  }
                  className="rounded border-slate-300 text-indigo-600"
                />
                <span>Alertas 48h antes de cada función teatral reservada para el aula</span>
              </label>
              <label className="flex items-center gap-2.5 text-xs text-slate-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={perfil.notificacionesEmail}
                  onChange={(e) =>
                    setPerfil({ ...perfil, notificacionesEmail: e.target.checked })
                  }
                  className="rounded border-slate-300 text-indigo-600"
                />
                <span>Avisos de nuevas reflexiones y audios entregados por estudiantes</span>
              </label>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm rounded-xl shadow-sm transition"
              >
                Guardar cambios
              </button>
            </div>
          </form>
        </div>

        {/* Columna Derecha: Programa y Certificación */}
        <div className="space-y-6">
          <div className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider block">
              PROGRAMA INSTITUCIONAL
            </span>
            <h3 className="text-base font-extrabold text-slate-900 mt-1">
              Voces que Transforman
            </h3>
            <p className="text-xs text-slate-600 mt-1 leading-relaxed">
              Titular del cupo único institucional para la I.E. Emblemática San Miguel de Piura.
            </p>

            <div className="mt-4 p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-xs space-y-1.5">
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600">Avance curricular:</span>
                <span className="text-indigo-700">50% (Módulo 3)</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600">Horas pedagógicas:</span>
                <span className="text-slate-900">60 / 120 hrs</span>
              </div>
              <div className="flex justify-between font-semibold">
                <span className="text-slate-600">Certificación:</span>
                <span className="text-emerald-700">Validada DREP</span>
              </div>
            </div>

            <Link
              to="/docente/programa"
              className="mt-4 block text-center py-2 px-3 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 hover:bg-indigo-50 rounded-xl transition"
            >
              Ver programa y módulos →
            </Link>
          </div>

          <div className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
              PROTECCIÓN DE DATOS
            </span>
            <h3 className="text-sm font-extrabold text-slate-900 mt-1">
              Cumplimiento Ley N.° 29733
            </h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Todos los audios de reflexión y evidencias de los estudiantes son confidenciales y se almacenan bajo consentimiento informado de padres de familia.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
