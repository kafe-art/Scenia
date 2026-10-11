import { Icon } from '../../../components/SceniaUI'

export default function ModalEntradaDigital({
  isOpen,
  onClose,
  experiencia,
  estudiante,
}) {
  if (!isOpen) return null

  const obraTitulo = experiencia?.titulo || 'Otras voces, un mismo patio'
  const fecha = experiencia?.fechaTexto || 'Sábado 22 de junio · 4:30 p. m.'
  const lugar = experiencia?.lugar || 'Teatro Municipal de Piura'
  const asiento = experiencia?.asiento || 'Fila 3 · Butaca 14'
  const codigo = experiencia?.codigoEntrada || 'SCENIA-ENTRADA-AC-3B-2026'
  const nombreEstudiante = estudiante?.nombre || 'Andrea Castro'
  const seccion = estudiante?.grado ? `${estudiante.grado} ${estudiante.seccion}` : '3.º B'

  return (
    <div className="dc-modal-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="dc-modal-card compact max-w-md w-full mx-4 overflow-hidden rounded-3xl bg-white shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cabecera del ticket con diseño festivo Scenia */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-5 text-center relative">
          <button
            type="button"
            className="absolute right-4 top-4 text-white/80 hover:text-white text-lg p-1"
            onClick={onClose}
          >
            ✕
          </button>
          <span className="text-[11px] font-extrabold tracking-widest uppercase text-emerald-300 block">
            SCENIA · PASE ESCOLAR CONFIRMADO
          </span>
          <h2 className="text-xl font-black mt-1 tracking-tight">{obraTitulo}</h2>
          <p className="text-xs text-emerald-100 mt-0.5">{lugar}</p>
        </div>

        {/* Cuerpo del ticket con perforación lateral */}
        <div className="p-6 space-y-4 text-left bg-white">
          <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                ESTUDIANTE
              </span>
              <strong className="text-slate-900 font-bold text-sm block mt-0.5">
                {nombreEstudiante}
              </strong>
              <span className="text-slate-500 text-[11px] font-medium">{seccion}</span>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                ASIENTO ASIGNADO
              </span>
              <strong className="text-emerald-700 font-extrabold text-sm block mt-0.5">
                {asiento}
              </strong>
              <span className="text-slate-500 text-[11px] font-medium">Zona Escolar</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 text-xs border-b border-slate-100 pb-4">
            <div>
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                FUNCIÓN
              </span>
              <strong className="text-slate-900 font-bold text-xs block mt-0.5">
                {fecha}
              </strong>
            </div>
            <div>
              <span className="block text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                INSTITUCIÓN
              </span>
              <strong className="text-slate-900 font-bold text-xs block mt-0.5 truncate">
                I.E. San Miguel de Piura
              </strong>
            </div>
          </div>

          {/* Código QR simulado y código de barras */}
          <div className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <div className="w-28 h-28 bg-white border border-slate-200 rounded-xl p-2 shadow-inner flex items-center justify-center">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(
                  codigo,
                )}`}
                alt="QR Entrada"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-mono text-xs font-extrabold text-slate-700 mt-2 tracking-wider">
              {codigo}
            </span>
          </div>

          {/* Nota importante: Abrir entrada no registra asistencia */}
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-800 text-xs flex items-start gap-2">
            <span className="text-base flex-shrink-0">⚠️</span>
            <p className="leading-relaxed">
              <strong>Recuerda:</strong> Abrir la entrada no registra asistencia. Tu asistencia será
              verificada por los mediadores teatrales al ingresar al teatro.
            </p>
          </div>
        </div>

        {/* Footer con botón imprimir */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center">
          <button
            type="button"
            className="text-xs font-bold text-slate-600 hover:text-slate-900"
            onClick={onClose}
          >
            Cerrar
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Icon name="ticket" size={14} />
            <span>Imprimir mi entrada</span>
          </button>
        </div>
      </div>
    </div>
  )
}
