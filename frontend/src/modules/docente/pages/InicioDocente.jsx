import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Icon, PageHeading } from '../../../components/SceniaUI'
import Loading from '../../../components/Loading'
import { SESIONES } from '../data/programa'
import { listarAvisos, listarClases, listarGuias } from '../services/clases'

const nombreClase = (lista, id) => {
  const c = lista.find((x) => x.id === id)
  return c ? `${c.grade} ${c.section}` : 'Sin clase'
}

export function ClassCard({ item }) {
  const r = item.resumen
  const estudiantes = r ? r.estudiantes : item.students
  const hechas = r ? r.hechas : item.completed
  const total = r ? r.posibles : item.total
  return (
    <article className="class-card">
      <div className={`class-art ${item.color}`}>
        <span className="art-shape one" />
        <span className="art-shape two" />
        <span className="art-grid" />
        <div>
          <span className="class-grade">{item.grade} SECUNDARIA</span>
          <p>{item.subject}</p>
        </div>
      </div>
      <div className="class-info">
        <div className="between">
          <h3>Sección {item.section}</h3>
          <span className={`badge ${item.color}`}>{item.guides} guías</span>
        </div>
        <p className="class-meta">
          <Icon name="users" size={16} /> {estudiantes} estudiantes · Turno {item.shift.toLowerCase()}
        </p>
        <div className="last-guide">
          <small>ÚLTIMA GUÍA · EJEMPLO</small>
          <strong>{item.last}</strong>
        </div>
        <div className="progress-label">
          <span>Entregas de la actividad</span>
          <strong>{hechas}/{total}</strong>
        </div>
        <progress
          max={total || 1}
          value={hechas}
          aria-label={`${hechas} de ${total} entregas hechas`}
        />
        <Link className="card-action" to={`/docente/clases/${item.id}`}>
          Abrir clase <Icon size={18} />
        </Link>
      </div>
    </article>
  )
}

export default function InicioDocente({ allClasses = false }) {
  const [classes, setClasses] = useState(null)
  const [guias, setGuias] = useState([])
  const [avisos, setAvisos] = useState([])

  useEffect(() => {
    Promise.all([listarClases(), listarGuias(), listarAvisos()]).then(([c, g, a]) => {
      setClasses(c)
      setGuias(g)
      setAvisos(a)
    })
  }, [])

  if (!classes) return <Loading mensaje="Cargando tus clases..." />

  const totales = classes.reduce(
    (acc, c) => ({
      estudiantes: acc.estudiantes + c.resumen.estudiantes,
      sinConsentimiento: acc.sinConsentimiento + c.resumen.sinConsentimiento,
      porRevisar: acc.porRevisar + c.resumen.porRevisar,
    }),
    { estudiantes: 0, sinConsentimiento: 0, porRevisar: 0 },
  )

  return (
    <>
      {!allClasses && (
        <section className="teacher-banner">
          <span className="avatar large">CM</span>
          <div>
            <span className="profile-label">PERFIL DOCENTE · DEMOSTRACIÓN</span>
            <h1>Carla Mendoza</h1>
            <p>Comunicación · Secundaria <span>•</span> I.E. de ejemplo</p>
          </div>
          <div className="teacher-banner-right">
            <span>UN NUEVO DÍA PARA INSPIRAR</span>
            <Link to="/cartelera">Explorar cartelera <Icon /></Link>
          </div>
        </section>
      )}

      <PageHeading
        eyebrow="TUS AULAS"
        title={allClasses ? 'Mis clases' : 'Cada clase, una nueva historia.'}
        action={
          <Link className="btn" to="/docente/guias/nueva">
            <Icon name="plus" /> Nueva guía
          </Link>
        }
      >
        Selecciona una clase para ver sus actividades y preparar tu próxima experiencia.
      </PageHeading>

      <div className="class-grid">
        {classes.map((item) => (
          <ClassCard key={item.id} item={item} />
        ))}
      </div>

      {!allClasses && (
        <>
          <div className="overview-grid">
            {[
              [String(classes.length), 'Clases a tu cargo', 'book', '/docente/clases'],
              [String(totales.estudiantes), 'Estudiantes inscritos', 'users', '/docente/clases'],
              [String(totales.porRevisar), 'Entregas por revisar', 'calendar', '/docente/clases'],
              [String(guias.length), 'Guías IA guardadas', 'spark', '/docente/guias/nueva'],
            ].map(([n, l, i, to]) => (
              <Link className="overview-card" key={l} to={to}>
                <span className={`metric-icon ${i}`}><Icon name={i} /></span>
                <div>
                  <strong>{n}</strong>
                  <p>{l}</p>
                </div>
                <Icon size={16} />
              </Link>
            ))}
          </div>

          <section className="surface" style={{ margin: '24px 0' }}>
            <span className="eyebrow">VOCES QUE TRANSFORMAN</span>
            <h2>Avance del programa por clase</h2>
            {totales.sinConsentimiento > 0 && (
              <p className="inline-message">
                {totales.sinConsentimiento} estudiante(s) aún sin consentimiento: no podrán recibir tareas.
              </p>
            )}
            {classes.map((c) => {
              const proxima = SESIONES.find((s) => !c.sesionesDictadas.includes(s.n))?.n
              return (
                <div className="dc-row" key={c.id}>
                  <Link to={`/docente/clases/${c.id}`}>{c.grade} {c.section} · {c.subject}</Link>
                  <div className="dc-dots" aria-label={`${c.resumen.sesionesDictadas} de 6 sesiones dictadas`}>
                    {SESIONES.map((s) => (
                      <span key={s.n} className={`dc-dot ${c.sesionesDictadas.includes(s.n) ? 'hecha' : s.n === proxima ? 'proxima' : ''}`}>{s.n}</span>
                    ))}
                  </div>
                </div>
              )
            })}
          </section>

          {(guias.length > 0 || avisos.length > 0) && (
            <section className="surface" style={{ margin: '24px 0' }}>
              {guias.length > 0 && (
                <>
                  <span className="eyebrow">GUÍAS RECIENTES</span>
                  {guias.slice(0, 3).map((g) => (
                    <div className="dc-row" key={g.id}>
                      <strong>{g.guia.titulo || 'Guía sin título'}</strong>
                      <span className="dc-muted">{nombreClase(classes, g.claseId)}</span>
                    </div>
                  ))}
                </>
              )}
              {avisos.length > 0 && (
                <>
                  <span className="eyebrow" style={{ display: 'block', marginTop: 16 }}>SALIDAS AL TEATRO AVISADAS</span>
                  {avisos.slice(0, 3).map((a) => (
                    <div className="dc-row" key={a.id}>
                      <strong>{a.obra}</strong>
                      <span className="dc-muted">{a.fecha || 'Fecha por definir'}</span>
                    </div>
                  ))}
                </>
              )}
            </section>
          )}

          <section className="teacher-feature">
            <div>
              <span className="eyebrow">DEL AULA AL ESCENARIO</span>
              <h2>Una historia puede abrir<br />una gran conversación.</h2>
              <p>Encuentra una obra y prepara una guía para tu clase.</p>
              <Link className="text-link" to="/cartelera">
                Descubrir historias <Icon />
              </Link>
            </div>
            <div className="feature-quote">
              <span aria-hidden="true">“</span>
              <p>El teatro es un lugar<br />para encontrarnos.</p>
              <small>VOCES QUE TRANSFORMAN</small>
            </div>
          </section>
        </>
      )}
    </>
  )
}
