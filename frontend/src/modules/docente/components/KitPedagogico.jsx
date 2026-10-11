import { useState } from 'react'
import { Icon } from '../../../components/SceniaUI'

export default function KitPedagogico({
  clase,
  obra,
  onVolver,
  notify = () => {},
}) {
  const [active, setActive] = useState(0)
  const [editing, setEditing] = useState(false)
  const [guardado, setGuardado] = useState(true)

  const tituloObra = obra?.titulo || obra?.title || 'Otras voces, un mismo patio'
  const cursoMeta = `${clase?.subject || 'Comunicación'} · ${clase?.grade || '3.º'} ${clase?.section || 'B'} · Tema: ${clase?.topic || 'Convivencia escolar'}`

  const [content, setContent] = useState([
    {
      title: 'Antes de la función',
      subtitle: 'Activar saberes y preparar la mirada',
      items: [
        [
          'Activación de conocimientos',
          'Mapa de voces: el grupo identifica situaciones en las que escuchar cambió un desacuerdo.',
        ],
        [
          'Taller introductorio',
          'En parejas, ensayan una misma frase con diferentes intenciones y conversan sobre cómo cambia el mensaje.',
        ],
        [
          'Preguntas para conectar',
          '¿Qué necesitamos para sentir que nuestra voz es tomada en cuenta?',
        ],
      ],
    },
    {
      title: 'Durante la experiencia',
      subtitle: 'Observar con intención',
      items: [
        [
          'Focos de observación',
          'Registra cómo los personajes expresan acuerdos o desacuerdos mediante su voz, sus pausas y su cuerpo.',
        ],
        [
          'Conexión con el aprendizaje',
          'Observa recursos de comunicación sin asumir escenas específicas no incluidas en los materiales de la obra.',
        ],
      ],
    },
    {
      title: 'Después de la función',
      subtitle: 'Reflexionar, expresar y evidenciar',
      items: [
        [
          'Preguntas de reflexión',
          '¿Qué idea de la obra dialoga con la convivencia de nuestro grupo?',
        ],
        [
          'Actividad de expresión',
          'Crea una breve escena que proponga una manera distinta de resolver un conflicto cotidiano.',
        ],
        [
          'Evidencia y evaluación',
          'Reflexión oral o escrita. Criterios: claridad, escucha, relación con el tema y propuesta personal.',
        ],
      ],
    },
  ])

  const updateItem = (itemIndex, value) => {
    setGuardado(false)
    setContent((current) =>
      current.map((moment, momentIndex) =>
        momentIndex === active
          ? {
              ...moment,
              items: moment.items.map((item, index) =>
                index === itemIndex ? [item[0], value] : item,
              ),
            }
          : moment,
      ),
    )
  }

  const handleRegenerate = () => {
    // Generar variaciones pedagógicas para la sección activa
    const variaciones = {
      0: [
        [
          'Activación de saberes previos',
          'Ronda de escucha: ¿Cuándo sentiste que una discusión se resolvió gracias a que alguien prestó atención de verdad?',
        ],
        [
          'Dinámica corporal introductoria',
          'Juego del espejo con intenciones: explorar cómo la postura física y el tono de voz transforman el clima del diálogo.',
        ],
        [
          'Pregunta detonante',
          '¿Qué condiciones necesita nuestro salón para que todos puedan expresarse sin temor al juicio ajeno?',
        ],
      ],
      1: [
        [
          'Focos de observación actoral',
          'Fíjate en cómo los actores utilizan los silencios y las miradas para comunicar tensión o empatía antes de hablar.',
        ],
        [
          'Eje pedagógico en escena',
          'Identifica el punto de quiebre donde los personajes deciden colaborar en lugar de competir.',
        ],
      ],
      2: [
        [
          'Diálogo guiado posterior',
          '¿Qué escena de la obra refleja mejor las dinámicas cotidianas que vivimos en nuestros recreos?',
        ],
        [
          'Creación escénica colectiva',
          'En tríos, propongan un final alternativo a una situación de conflicto usando una estrategia de resolución pacífica.',
        ],
        [
          'Instrumento de evaluación CNEB',
          'Bitácora de audio personal (1 minuto). Rúbrica: autorregulación, escucha empática y propuesta ciudadana.',
        ],
      ],
    }

    if (variaciones[active]) {
      setContent((current) =>
        current.map((moment, idx) =>
          idx === active ? { ...moment, items: variaciones[active] } : moment,
        ),
      )
    }
    notify('Sección regenerada sin modificar las demás')
  }

  const handleGuardarCambios = () => {
    setGuardado(true)
    notify('Cambios guardados')
  }

  const handleAsignarAlGrupo = () => {
    setGuardado(true)
    notify(`Guía asignada a ${clase?.subject || 'Comunicación'} · ${clase?.grade || '3.º'} ${clase?.section || 'B'}`)
  }

  return (
    <div className="dc-kit-pedagogico-view animate-fade-in">
      {/* Botón Volver al curso */}
      <div className="mb-4">
        <button
          type="button"
          className="back-link inline-flex items-center gap-1 text-sm font-semibold text-indigo-700 hover:text-indigo-900 transition-colors"
          onClick={onVolver}
        >
          ← Volver al curso
        </button>
      </div>

      {/* Cabecera del Kit */}
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <span className="eyebrow block">KIT PEDAGÓGICO CON IA</span>
          <h1 className="mt-1 text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {tituloObra}
          </h1>
          <p className="mt-1 text-sm text-slate-600 font-medium">
            {cursoMeta}
          </p>
        </div>

        <div className="flex-shrink-0">
          <span className="status-badge">
            <span className="text-amber-500">✨</span> {guardado ? 'Borrador guardado' : 'Cambios sin guardar'}
          </span>
        </div>
      </div>

      {/* Banner AI Note */}
      <div className="ai-note">
        <div className="flex-shrink-0 text-xl">
          <Icon name="spark" size={22} />
        </div>
        <div>
          <strong className="text-indigo-950 font-bold block">Borrador personalizado</strong>
          <p>
            Creado con la información disponible de la obra, el grado, el tema y los intereses del grupo. Revisa el contenido antes de asignarlo.
          </p>
        </div>
      </div>

      {/* Grid de 2 Columnas: Navegación de Momentos + Contenido Activo */}
      <div className="mt-6 grid gap-6 lg:grid-cols-[16rem_1fr] items-start">
        {/* Columna Izquierda: Selector de Momentos */}
        <aside className="moment-nav">
          {content.map((moment, index) => {
            const isActive = active === index
            return (
              <button
                key={moment.title}
                type="button"
                className={isActive ? 'active' : ''}
                onClick={() => {
                  setActive(index)
                  setEditing(false)
                }}
              >
                <span>{index + 1}</span>
                <div>
                  <strong>{moment.title}</strong>
                  <small>{moment.subtitle}</small>
                </div>
              </button>
            )
          })}
        </aside>

        {/* Columna Derecha: Tarjeta del Momento Activo */}
        <section className="card overflow-hidden bg-white border border-slate-200 rounded-2xl shadow-sm">
          {/* Header de la Tarjeta */}
          <div className="flex flex-col gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center sm:justify-between bg-white">
            <div>
              <div className="eyebrow text-xs font-bold text-rose-600 tracking-wider">
                MOMENTO {active + 1} DE 3
              </div>
              <h2 className="mt-1 text-xl font-bold text-slate-900">
                {content[active].title}
              </h2>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                className="btn btn-ghost px-3 py-2 text-xs font-bold flex items-center gap-1.5 text-indigo-700 hover:bg-indigo-50 rounded-lg transition"
                onClick={handleRegenerate}
              >
                <span>🔄</span> Regenerar sección
              </button>
              <button
                type="button"
                className="btn btn-secondary px-3.5 py-2 text-xs font-bold flex items-center gap-1.5 border border-slate-300 rounded-lg hover:border-indigo-600 hover:text-indigo-700 transition"
                onClick={() => setEditing(!editing)}
              >
                <span>✏️</span> {editing ? 'Terminar edición' : 'Editar'}
              </button>
            </div>
          </div>

          {/* Lista de Actividades */}
          <div className="p-5 sm:p-6 space-y-6">
            {content[active].items.map((item, index) => (
              <div className="kit-item" key={item[0]}>
                <div className="kit-number font-mono text-rose-600 font-extrabold text-sm">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                    {item[0]}
                  </h3>
                  {editing ? (
                    <textarea
                      className="field mt-2 w-full p-3 text-sm border border-slate-300 rounded-xl focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition resize-y"
                      rows={3}
                      aria-label={`Editar ${item[0]}`}
                      value={item[1]}
                      onChange={(e) => updateItem(index, e.target.value)}
                    />
                  ) : (
                    <p className="mt-1.5 text-sm leading-relaxed text-slate-600 font-normal">
                      {item[1]}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Footer de Acciones */}
          <div className="flex flex-col-reverse gap-3 border-t border-slate-200 p-5 sm:flex-row sm:justify-end bg-slate-50/50">
            <button
              type="button"
              className="btn btn-secondary px-4 py-2.5 text-sm font-bold border border-slate-300 bg-white hover:bg-slate-50 rounded-xl transition"
              onClick={handleGuardarCambios}
            >
              Guardar cambios
            </button>
            <button
              type="button"
              className="btn btn-primary px-5 py-2.5 text-sm font-bold bg-rose-600 hover:bg-rose-700 text-white rounded-xl shadow-sm hover:shadow transition"
              onClick={handleAsignarAlGrupo}
            >
              Revisar y asignar al grupo
            </button>
          </div>
        </section>
      </div>
    </div>
  )
}
