import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Icon, PageHeading } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import useClase from '../hooks/useClase'
import NominaTab from '../components/NominaTab'
import ProgramaTab from '../components/ProgramaTab'
import { edadPorGrado } from '../services/clases'

export default function DetalleClase() {
  const { id } = useParams()
  const { clase, cargando, error, ejecutar } = useClase(id)
  const [tab, setTab] = useState('nomina')

  if (cargando) return <Loading mensaje="Cargando clase..." />
  if (!clase) {
    return <PageHeading title="Clase no encontrada" action={<Link to="/docente/clases">Volver a mis clases</Link>} />
  }

  const r = clase.resumen
  const stats = [
    [r.estudiantes, 'Estudiantes'],
    [`${r.conConsentimiento}/${r.estudiantes}`, 'Con consentimiento'],
    [`${r.hechas}/${r.posibles}`, 'Entregas hechas'],
    [r.porRevisar, 'Por revisar'],
    [`${r.sesionesDictadas}/6`, 'Sesiones dictadas'],
  ]

  return (
    <>
      <Link className="back-link" to="/docente/clases">← Mis clases</Link>
      <PageHeading
        eyebrow={`${clase.grade} DE SECUNDARIA · SECCIÓN ${clase.section}`}
        title={clase.subject}
        action={
          <Link className="btn" to={`/docente/guias/nueva?clase=${clase.id}&tema=${encodeURIComponent(clase.topic)}&edad=${edadPorGrado(clase.grade)}`}>
            <Icon name="spark" /> Preparar guía
          </Link>
        }
      >
        Turno {clase.shift}
      </PageHeading>

      <div className="dc-stats">
        {stats.map(([valor, etiqueta]) => (
          <div className="dc-stat" key={etiqueta}><strong>{valor}</strong><span>{etiqueta}</span></div>
        ))}
      </div>

      {error && <div className="dc-error" role="alert">{error}</div>}

      <div className="dc-tabs" role="tablist">
        {[['nomina', 'Nómina'], ['programa', 'Programa y tareas']].map(([clave, texto]) => (
          <button key={clave} type="button" role="tab" aria-selected={tab === clave} className="dc-tab" onClick={() => setTab(clave)}>
            {texto}
          </button>
        ))}
      </div>

      {tab === 'nomina' ? <NominaTab clase={clase} ejecutar={ejecutar} /> : <ProgramaTab clase={clase} ejecutar={ejecutar} />}
    </>
  )
}
