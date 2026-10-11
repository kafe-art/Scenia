import { Link } from 'react-router-dom'

export default function VocesQueTransformanEstudiante() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-sans">
      <div className="mb-6">
        <Link
          to="/estudiante"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-rose-600 transition"
        >
          ← Volver a Mi ruta cultural
        </Link>
      </div>

      <div className="bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-3xl p-8 shadow-xl mb-8 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
        <span className="text-xs font-bold uppercase tracking-wider text-rose-400 bg-rose-950/60 border border-rose-800/40 px-3 py-1 rounded-full">
          Metodología Pedagógica Scenia
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight mt-3">
          Voces que Transforman
        </h1>
        <p className="mt-2 text-slate-300 text-sm max-w-2xl leading-relaxed">
          Una propuesta que conecta las artes escénicas con tu vida en la escuela. A través
          del teatro aprendemos a escucharnos, resolver desacuerdos y construir una
          convivencia basada en el respeto mutuo.
        </p>
      </div>

      {/* Las 3 Etapas Explicadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 font-extrabold flex items-center justify-center text-lg mb-4">
              1
            </div>
            <h2 className="text-base font-bold text-slate-900">Antes · Me preparo</h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              En el aula, tu docente introduce los temas mediante juegos teatrales,
              ejercicios de escucha activa y la guía didáctica alineada al CNEB.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-amber-800">
            ✓ Taller previo en clase
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-700 font-extrabold flex items-center justify-center text-lg mb-4">
              2
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Durante · Vivo la experiencia
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Visitas el teatro junto a tus compañeros. Con tu entrada digital y butaca
              asignada, experimentas la obra en vivo prestando atención a los personajes.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-rose-800">
            ✓ Función escolar presencial
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-700 font-extrabold flex items-center justify-center text-lg mb-4">
              3
            </div>
            <h2 className="text-base font-bold text-slate-900">
              Después · Comparto y transformo
            </h2>
            <p className="text-xs text-slate-600 mt-2 leading-relaxed">
              Expresas lo vivido a través de texto, audio o video. Tu docente revisa tu
              entrega y el salón debate aprendizajes para mejorar el clima del aula.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-indigo-800">
            ✓ Reflexión y retroalimentación
          </div>
        </div>
      </div>

      {/* Participación en tu escuela */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Tu colegio en el programa
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            <strong>I.E. Emblemática San Miguel de Piura</strong> participa activamente
            mediante el aula de Comunicación 3.º B con la profesora Carla Mendoza.
          </p>
        </div>
        <Link
          to="/estudiante"
          className="px-5 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition flex-shrink-0"
        >
          Ir a mis actividades ›
        </Link>
      </div>
    </div>
  )
}
