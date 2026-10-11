import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Icon } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import {
  obtenerActividadPorId,
  guardarBorradorActividad,
  enviarRespuestaActividad,
} from '../services/estudianteStore'

export default function DetalleActividad() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [formato, setFormato] = useState('texto') // 'texto' | 'audio' | 'video'
  const [texto, setTexto] = useState('')
  const [archivoSeleccionado, setArchivoSeleccionado] = useState(null)
  const [guardando, setGuardando] = useState(false)
  const [toast, setToast] = useState(null)

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(null), 4000)
  }

  useEffect(() => {
    obtenerActividadPorId(id).then((res) => {
      setData(res)
      if (res.entrega) {
        setFormato(res.entrega.formato || 'texto')
        setTexto(res.entrega.texto || '')
        if (res.entrega.archivoNombre) {
          setArchivoSeleccionado({ name: res.entrega.archivoNombre })
        }
      }
    })
  }, [id])

  if (!data) return <Loading mensaje="Cargando instrucciones de la actividad..." />

  const { actividad, entrega } = data
  const esBorrador = entrega?.estado === 'borrador'
  const esEntregada = entrega?.estado === 'entregada'

  const handleGuardarBorrador = async () => {
    setGuardando(true)
    try {
      const res = await guardarBorradorActividad({
        actividadId: actividad.id,
        formato,
        texto,
        archivoNombre: archivoSeleccionado ? archivoSeleccionado.name : null,
      })
      setData((prev) => ({ ...prev, entrega: res }))
      showToast('Borrador guardado correctamente.')
    } catch {
      showToast('No se pudo guardar el borrador.')
    } finally {
      setGuardando(false)
    }
  }

  const handleEnviarRespuesta = async () => {
    if (formato === 'texto' && (!texto || !texto.trim())) {
      alert('Por favor escribe tu reflexión antes de enviar.')
      return
    }
    if ((formato === 'audio' || formato === 'video') && !archivoSeleccionado && !texto) {
      alert(`Por favor selecciona un archivo de ${formato} para tu entrega.`)
      return
    }

    setGuardando(true)
    try {
      const res = await enviarRespuestaActividad({
        actividadId: actividad.id,
        formato,
        texto,
        archivoNombre: archivoSeleccionado ? archivoSeleccionado.name : null,
      })
      setData((prev) => ({ ...prev, entrega: res }))
      showToast('¡Tu respuesta fue enviada a la docente Carla Mendoza!')
    } catch {
      showToast('Error al enviar respuesta.')
    } finally {
      setGuardando(false)
    }
  }

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setArchivoSeleccionado(e.target.files[0])
    }
  }

  return (
    <div className="st-detalle-actividad-page space-y-6 max-w-4xl mx-auto pb-16 animate-fade-in text-left">
      {/* Toast Notificación */}
      {toast && (
        <div className="dc-floating-toast" role="alert">
          <Icon name="check" size={16} />
          <span>{toast}</span>
        </div>
      )}

      {/* Botón Volver (Captura 3) */}
      <div>
        <Link
          to="/estudiante"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 transition"
        >
          <span>‹</span>
          <span>Volver</span>
        </Link>
      </div>

      {/* Encabezado Principal (Captura 3) */}
      <header>
        <span className="text-rose-600 font-extrabold text-xs tracking-wider uppercase block">
          ACTIVIDAD · VERSIÓN PUBLICADA {actividad.versionPublicada}
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-1">
          {actividad.titulo}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1">
          {actividad.curso} · {actividad.tema}
        </p>
      </header>

      {/* Tarjeta 1: INSTRUCCIONES DE TU DOCENTE (Captura 3) */}
      <article className="card bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <span className="text-[11px] font-extrabold text-rose-600 uppercase tracking-wider block">
              INSTRUCCIONES DE TU DOCENTE
            </span>
            <h2 className="text-xl font-black text-slate-900 mt-0.5">
              {actividad.guiaTitulo}
            </h2>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 self-start sm:self-auto">
            <span>⏰</span>
            <span>{actividad.fechaLimiteTexto}</span>
          </div>
        </div>

        {/* Caja de Instrucción Detallada */}
        <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-5 text-sm leading-relaxed text-slate-700 font-normal">
          {actividad.instrucciones}
        </div>

        {/* Metadatos: Formatos permitidos y Obra relacionada */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100 text-xs">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              FORMATOS PERMITIDOS
            </span>
            <strong className="text-slate-900 font-extrabold block mt-0.5">
              {actividad.formatosPermitidos.join(', ')}
            </strong>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
              OBRA RELACIONADA
            </span>
            <strong className="text-slate-900 font-extrabold block mt-0.5">
              {actividad.obraRelacionada}
            </strong>
          </div>
        </div>

        {/* Criterios de Evaluación */}
        <div className="pt-2 border-t border-slate-100">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
            CRITERIOS
          </span>
          <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-700">
            {actividad.criterios.map((crit, idx) => (
              <span key={idx} className="inline-flex items-center gap-1">
                <span className="text-indigo-600 font-bold">✓</span>
                <span>{crit}</span>
              </span>
            ))}
          </div>
        </div>
      </article>

      {/* Notificación de Devolución Docente (si aplica) */}
      {entrega?.retroalimentacion && (
        <article className="card bg-indigo-50/70 border border-indigo-200 rounded-3xl p-6 shadow-sm">
          <span className="text-[11px] font-extrabold text-indigo-700 uppercase tracking-wider block">
            DEVOLUCIÓN DE TU DOCENTE (CARLA MENDOZA)
          </span>
          <p className="text-sm text-slate-800 mt-2 font-medium leading-relaxed">
            "{entrega.retroalimentacion}"
          </p>
          {entrega.calificacion && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-white rounded-xl border border-indigo-200 text-xs font-bold text-indigo-900">
              <span>Valoración formativa:</span>
              <span className="text-emerald-700 font-extrabold text-sm">{entrega.calificacion}</span>
            </div>
          )}
        </article>
      )}

      {/* Tarjeta 2: TU RESPUESTA (Captura 4, 5 y 6) */}
      <article className="card bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-sm space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Tu respuesta</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Elige un formato. Las preguntas son una orientación para una sola respuesta.
            </p>
          </div>

          <div>
            {esBorrador && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                Borrador
              </span>
            )}
            {esEntregada && (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                ✓ Entregada
              </span>
            )}
          </div>
        </div>

        {/* 3 Cajitas Guía de Orientación (Captura 4) */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {actividad.preguntasOrientacion.map((p, pIdx) => (
            <div
              key={pIdx}
              className="p-3.5 bg-slate-50 border border-slate-200/70 rounded-2xl text-xs text-slate-700 font-medium"
            >
              {p}
            </div>
          ))}
        </div>

        {/* Botones de Selección de Formato (Texto, Audio, Video) */}
        <div className="flex flex-wrap items-center gap-2.5 pt-1">
          <button
            type="button"
            onClick={() => setFormato('texto')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              formato === 'texto'
                ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-900 shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>📝</span>
            <span>Texto</span>
          </button>

          <button
            type="button"
            onClick={() => setFormato('audio')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              formato === 'audio'
                ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-900 shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>🎙️</span>
            <span>Audio</span>
          </button>

          <button
            type="button"
            onClick={() => setFormato('video')}
            className={`px-4 py-2 rounded-xl text-xs font-extrabold transition flex items-center gap-2 ${
              formato === 'video'
                ? 'bg-indigo-50 border-2 border-indigo-600 text-indigo-900 shadow-xs'
                : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-50'
            }`}
          >
            <span>📹</span>
            <span>Video</span>
          </button>
        </div>

        {/* Modo 1: TEXTO (Captura 4) */}
        {formato === 'texto' && (
          <div className="space-y-2">
            <textarea
              rows={6}
              value={texto}
              onChange={(e) => setTexto(e.target.value)}
              placeholder="Escribe tu reflexión aquí..."
              className="w-full p-4 text-sm border border-slate-300 rounded-2xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 focus:outline-none transition resize-y font-normal"
            />
            <div className="flex items-center justify-between text-[11px] text-slate-400">
              <span>{texto.length} caracteres</span>
              <span>Se guarda únicamente al elegir "Guardar borrador".</span>
            </div>
          </div>
        )}

        {/* Modo 2: AUDIO (Captura 5) */}
        {formato === 'audio' && (
          <div className="border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-4 bg-slate-50/50">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 mx-auto flex items-center justify-center text-xl">
              <Icon name="upload" size={22} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sube tu audio</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                MP3, M4A o WAV · máximo 25 MB y 5 minutos
              </p>
            </div>

            <div className="flex justify-center">
              <label className="cursor-pointer px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition">
                <span>{archivoSeleccionado ? 'Cambiar archivo' : 'Seleccionar archivo'}</span>
                <input
                  type="file"
                  accept="audio/mp3,audio/m4a,audio/wav,audio/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {archivoSeleccionado && (
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl max-w-sm mx-auto">
                🎵 Archivo seleccionado: {archivoSeleccionado.name}
              </div>
            )}

            <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
              La grabación directa requiere almacenamiento privado de backend. En esta demo puedes
              seleccionar y previsualizar el nombre, pero el archivo no se guarda en el navegador.
            </p>
          </div>
        )}

        {/* Modo 3: VIDEO (Captura 6) */}
        {formato === 'video' && (
          <div className="border border-dashed border-slate-300 rounded-3xl p-8 text-center space-y-4 bg-slate-50/50">
            <div className="w-12 h-12 rounded-full bg-indigo-50 text-indigo-700 mx-auto flex items-center justify-center text-xl">
              <Icon name="upload" size={22} />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-900">Sube tu video</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                MP4 o MOV · máximo 100 MB y 5 minutos
              </p>
            </div>

            <div className="flex justify-center">
              <label className="cursor-pointer px-5 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition">
                <span>{archivoSeleccionado ? 'Cambiar archivo' : 'Seleccionar archivo'}</span>
                <input
                  type="file"
                  accept="video/mp4,video/quicktime,video/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
              </label>
            </div>

            {archivoSeleccionado && (
              <div className="text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 p-2.5 rounded-xl max-w-sm mx-auto">
                🎬 Archivo seleccionado: {archivoSeleccionado.name}
              </div>
            )}

            <p className="text-[11px] text-slate-400 max-w-md mx-auto leading-relaxed">
              La grabación directa requiere almacenamiento privado de backend. En esta demo puedes
              seleccionar y previsualizar el nombre, pero el archivo no se guarda en el navegador.
            </p>
          </div>
        )}

        {/* Botones de Acción (Guardar borrador / Enviar respuesta) */}
        <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row justify-end gap-3">
          <button
            type="button"
            disabled={guardando}
            onClick={handleGuardarBorrador}
            className="px-5 py-2.5 border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 font-bold text-xs rounded-xl shadow-xs transition"
          >
            Guardar borrador
          </button>
          <button
            type="button"
            disabled={guardando}
            onClick={handleEnviarRespuesta}
            className="px-6 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-xs rounded-xl shadow-sm transition inline-flex items-center justify-center gap-1.5"
          >
            <span>{esEntregada ? 'Reenviar respuesta' : 'Enviar respuesta'}</span>
            <span>›</span>
          </button>
        </div>
      </article>

      {/* Tarjeta 3: ANÁLISIS DE APRENDIZAJES (Capturas 4, 5, 6) */}
      <article className="card bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center flex-shrink-0 text-base">
            <Icon name="spark" size={16} />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900">Análisis de aprendizajes</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xl leading-relaxed">
              {entrega?.analisisIA?.mensaje ||
                'Análisis no disponible: falta configurar un proveedor de transcripción e IA en backend. Tu entrega permanece enviada y segura.'}
            </p>
          </div>
        </div>

        <div className="self-start sm:self-auto flex-shrink-0">
          <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-slate-100 text-slate-600">
            No disponible
          </span>
        </div>
      </article>
    </div>
  )
}
