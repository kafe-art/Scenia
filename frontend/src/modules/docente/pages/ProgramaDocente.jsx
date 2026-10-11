import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Icon, PageHeading } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import {
  listarInstituciones,
  postularProgramaDocente,
} from '../services/clases'

export default function ProgramaDocente() {
  const [instituciones, setInstituciones] = useState([])
  const [instSeleccionadaId, setInstSeleccionadaId] = useState('ie-san-miguel')
  const [cargando, setCargando] = useState(true)
  const [modalPostulacion, setModalPostulacion] = useState(false)
  const [formPostulacion, setFormPostulacion] = useState({
    nombre: 'Lic. Carla Mendoza',
    email: 'carla.mendoza@sanmiguel.edu.pe',
    especialidad: 'Comunicación y Arte',
    motivacion: '',
  })
  const [mensajeExito, setMensajeExito] = useState(null)
  const [errorRegla, setErrorRegla] = useState(null)
  const [enviando, setEnviando] = useState(false)

  useEffect(() => {
    listarInstituciones().then((list) => {
      setInstituciones(list)
      setCargando(false)
    })
  }, [])

  if (cargando) return <Loading mensaje="Cargando programa de formación docente..." />

  const instActual =
    instituciones.find((i) => i.id === instSeleccionadaId) || instituciones[0]

  const handlePostular = async (e) => {
    e.preventDefault()
    setErrorRegla(null)
    setMensajeExito(null)
    setEnviando(true)

    try {
      await postularProgramaDocente({
        institucionId: instActual.id,
        docenteNombre: formPostulacion.nombre,
        email: formPostulacion.email,
        especialidad: formPostulacion.especialidad,
        motivacion: formPostulacion.motivacion,
      })

      // Refrescar lista de instituciones
      const actualizadas = await listarInstituciones()
      setInstituciones(actualizadas)
      setMensajeExito(
        `¡Postulación exitosa para la institución "${instActual.nombre}"! Has asegurado el cupo institucional de este ciclo.`,
      )
      setModalPostulacion(false)
    } catch (err) {
      setErrorRegla(err.message)
    } finally {
      setEnviando(false)
    }
  }

  const MODULOS_PROGRAMA = [
    {
      n: 1,
      titulo: 'Módulo 1: Habilidades Socioemocionales en el Aula',
      estado: 'completado',
      horas: '20 horas',
      descripcion:
        'Fundamentos teóricos del autoconocimiento, autorregulación y empatía vinculados al CNEB.',
    },
    {
      n: 2,
      titulo: 'Módulo 2: Mediación y Apreciación del Hecho Escénico',
      estado: 'completado',
      horas: '25 horas',
      descripcion:
        'Herramientas metodológicas para transformar la experiencia teatral en detonante reflexivo.',
    },
    {
      n: 3,
      titulo: 'Módulo 3: Dinámicas Corporales y Convivencia Escolar',
      estado: 'en_curso',
      horas: '25 horas',
      descripcion:
        'Técnicas de juego dramático, teatro imagen y resolución pacífica de conflictos en secundaria.',
    },
    {
      n: 4,
      titulo: 'Módulo 4: Diseño de Guías Didácticas Asistidas por IA',
      estado: 'proximo',
      horas: '20 horas',
      descripcion:
        'Alineación curricular, momentos pedagógicos y personalización mediante herramientas de Scenia.',
    },
    {
      n: 5,
      titulo: 'Módulo 5: Aplicación en el Aula y Registro de Bitácoras',
      estado: 'proximo',
      horas: '20 horas',
      descripcion:
        'Implementación práctica con estudiantes, recopilación de notas de voz y evidencias formativas.',
    },
    {
      n: 6,
      titulo: 'Módulo 6: Proyecto Final y Certificación Oficial DREP/UGEL',
      estado: 'proximo',
      horas: '10 horas',
      descripcion:
        'Presentación del portafolio pedagógico y expedición de la certificación oficial de 120 horas.',
    },
  ]

  return (
    <div className="dc-programa-page">
      <PageHeading
        eyebrow="PROGRAMA FORMATIVO OFICIAL · RESOLUCIÓN DREP/UGEL"
        title="Voces que Transforman"
        action={
          <Link to="/docente" className="btn btn-outline">
            ← Volver al Panel
          </Link>
        }
      >
        Especialización pedagógica en mediación artística y habilidades socioemocionales para
        docentes de secundaria. Certificación de 120 horas pedagógicas oficiales.
      </PageHeading>

      {/* Selector de Institución para Simular / Verificar Regla */}
      <section className="dc-card-muro dc-inst-selector-card">
        <div className="dc-inst-selector-header">
          <div>
            <span className="eyebrow">VERIFICACIÓN INSTITUCIONAL</span>
            <h3>Tu Institución Educativa</h3>
            <p>
              El programa garantiza cobertura equitativa aplicando una regla estricta:
              <strong> solo 1 docente por institución educativa a la vez</strong> hasta su
              culminación.
            </p>
          </div>

          <div className="dc-inst-select-wrapper">
            <label>Cambiar institución para consultar:</label>
            <select
              className="dc-input-muro"
              value={instSeleccionadaId}
              onChange={(e) => {
                setInstSeleccionadaId(e.target.value)
                setErrorRegla(null)
                setMensajeExito(null)
              }}
            >
              {instituciones.map((inst) => (
                <option key={inst.id} value={inst.id}>
                  {inst.nombre} ({inst.vacanteOcupada ? '🔴 Vacante Ocupada' : '🟢 Vacante Disponible'})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Tarjeta de Estado de la Vacante Institucional */}
        <div
          className={`dc-inst-status-banner ${
            instActual.vacanteOcupada ? 'ocupada' : 'disponible'
          }`}
        >
          <div className="dc-inst-status-icon">
            {instActual.vacanteOcupada ? '🏛️' : '✨'}
          </div>

          <div className="dc-inst-status-info">
            <div className="dc-inst-badge-row">
              <span className="dc-inst-name">{instActual.nombre}</span>
              <span className="dc-cod-modular">Cód. Modular: {instActual.codigoModular}</span>
              <span
                className={`dc-status-badge ${
                  instActual.vacanteOcupada ? 'badge-ocupada' : 'badge-disponible'
                }`}
              >
                {instActual.vacanteOcupada
                  ? 'Vacante Institucional en Curso'
                  : 'Vacante Institucional Disponible'}
              </span>
            </div>

            {instActual.vacanteOcupada && instActual.docenteActivo ? (
              <div className="dc-docente-activo-box">
                <div className="dc-docente-meta">
                  <strong>Docente Titular Inscrita:</strong> {instActual.docenteActivo.nombre} (
                  {instActual.docenteActivo.email})
                </div>
                <div className="dc-docente-meta">
                  <strong>Cohorte:</strong> {instActual.docenteActivo.cohorte} ·{' '}
                  <strong>Progreso:</strong> {instActual.docenteActivo.avance}% (
                  {instActual.docenteActivo.horasCertificadas})
                </div>
                <div className="dc-docente-meta">
                  <strong>Módulo en curso:</strong> {instActual.docenteActivo.moduloActual}
                </div>
                <p className="dc-regla-explicacion">
                  ⚠️ <strong>Regla de negocio:</strong> La vacante de esta escuela se encuentra
                  ocupada por la colega en formación. Nuevas vacantes para esta institución se
                  abrirán en <strong>{instActual.proximaConvocatoria}</strong>, una vez concluido el
                  proceso de certificación vigente.
                </p>
              </div>
            ) : (
              <div className="dc-docente-libre-box">
                <p>
                  Esta institución no cuenta con docentes inscritos en el ciclo actual. La vacante
                  institucional está <strong>libre e inmediata</strong> para postulación.
                </p>
                <button
                  type="button"
                  className="dc-btn primary glow"
                  onClick={() => setModalPostulacion(true)}
                >
                  <Icon name="spark" size={16} /> Postular a la Vacante Institucional
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {errorRegla && <div className="dc-error">{errorRegla}</div>}
      {mensajeExito && <div className="dc-ok">{mensajeExito}</div>}

      {/* Malla Curricular y Módulos del Programa */}
      <section className="dc-card-muro dc-malla-card">
        <header className="dc-malla-header">
          <div>
            <span className="eyebrow">ESTRUCTURA DE CERTIFICACIÓN PEDAGÓGICA</span>
            <h3>Plan de Estudios · 120 Horas Pedagógicas</h3>
            <p>
              Avalado por convenio interinstitucional para ascenso y escalafón en la Carrera Pública
              Magisterial.
            </p>
          </div>
          <span className="dc-cert-stamp">📜 AVALADO DREP PIURA</span>
        </header>

        <div className="dc-modulos-grid">
          {MODULOS_PROGRAMA.map((mod) => {
            const esHecho = mod.estado === 'completado'
            const esActual = mod.estado === 'en_curso'

            return (
              <div
                key={mod.n}
                className={`dc-modulo-card ${
                  esHecho ? 'completado' : esActual ? 'en-curso' : 'proximo'
                }`}
              >
                <div className="dc-modulo-top">
                  <span className="dc-mod-badge">0{mod.n}</span>
                  <span className="dc-mod-horas">{mod.horas}</span>
                  <span
                    className={`dc-mod-status ${
                      esHecho ? 'st-hecho' : esActual ? 'st-actual' : 'st-proximo'
                    }`}
                  >
                    {esHecho ? '✓ Aprobado' : esActual ? '★ En Curso' : '🔒 Pendiente'}
                  </span>
                </div>

                <h4>{mod.titulo}</h4>
                <p>{mod.descripcion}</p>

                {esActual && (
                  <div className="dc-mod-progress-bar">
                    <div className="dc-mod-fill" style={{ width: '65%' }} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </section>

      {/* Modal de Postulación */}
      {modalPostulacion && (
        <div className="dc-modal-overlay" role="dialog" aria-modal="true">
          <div className="dc-modal-content dc-modal-postulacion">
            <header className="dc-modal-header">
              <div>
                <span className="eyebrow">POSTULACIÓN INSTITUCIONAL</span>
                <h2>Inscripción en Voces que Transforman</h2>
                <span className="dc-modal-sub">{instActual.nombre}</span>
              </div>
              <button
                type="button"
                className="dc-modal-close"
                onClick={() => setModalPostulacion(false)}
              >
                ✕
              </button>
            </header>

            <form onSubmit={handlePostular} className="dc-modal-body">
              <div className="dc-info-callout">
                <Icon name="shield" size={18} />
                <span>
                  Al registrar tu postulación, ocuparás la <strong>única vacante oficial</strong> de
                  tu institución educativa para esta cohorte de 120 horas.
                </span>
              </div>

              <div className="form-group">
                <label>Nombre y Apellidos del Docente:</label>
                <input
                  type="text"
                  className="dc-input-muro"
                  value={formPostulacion.nombre}
                  onChange={(e) =>
                    setFormPostulacion({ ...formPostulacion, nombre: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Correo Electrónico Institucional:</label>
                <input
                  type="email"
                  className="dc-input-muro"
                  value={formPostulacion.email}
                  onChange={(e) =>
                    setFormPostulacion({ ...formPostulacion, email: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Área o Especialidad Curricular:</label>
                <input
                  type="text"
                  className="dc-input-muro"
                  value={formPostulacion.especialidad}
                  onChange={(e) =>
                    setFormPostulacion({ ...formPostulacion, especialidad: e.target.value })
                  }
                  required
                />
              </div>

              <div className="form-group">
                <label>Motivación pedagógica o compromiso con la institución:</label>
                <textarea
                  rows={3}
                  className="dc-textarea-muro"
                  placeholder="Describe cómo transferirás la experiencia artística a tus estudiantes..."
                  value={formPostulacion.motivacion}
                  onChange={(e) =>
                    setFormPostulacion({ ...formPostulacion, motivacion: e.target.value })
                  }
                  required
                />
              </div>

              <div className="dc-modal-footer">
                <button
                  type="button"
                  className="dc-btn"
                  onClick={() => setModalPostulacion(false)}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="dc-btn primary glow"
                  disabled={enviando}
                >
                  {enviando ? 'Validando Vacante...' : 'Confirmar Inscripción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
