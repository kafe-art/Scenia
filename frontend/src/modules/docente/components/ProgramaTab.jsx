import { useState } from 'react'
import { Link } from 'react-router-dom'
import { SESIONES, nombreSesion } from '../data/programa'
import {
  alternarSesionDictada,
  asignarTareasSesion,
  crearTareaPersonalizada,
  eliminarTarea,
  edadPorGrado,
} from '../services/clases'

function ProgresoTarea({ clase, tarea }) {
  const aptos = clase.estudiantes.filter((e) => e.consentimiento === 'otorgado')
  const estados = aptos.map((e) => clase.entregas[tarea.id]?.[e.id]?.estado)
  const hechas = estados.filter((s) => s === 'hecho').length
  const porRevisar = estados.filter((s) => s === 'entregada').length
  return (
    <span className="dc-muted">
      {hechas}/{aptos.length} hechas{porRevisar ? ` · ${porRevisar} por revisar` : ''}
    </span>
  )
}

function FilaTarea({ clase, tarea, ejecutar }) {
  return (
    <div className="dc-row">
      <div>
        <strong>{tarea.titulo}</strong>{' '}
        <span className={`dc-pill ${tarea.tipo === 'auto' ? 'info' : 'muted'}`}>{tarea.tipo === 'auto' ? 'Automática' : 'Revisión docente'}</span>
        <div><ProgresoTarea clase={clase} tarea={tarea} /></div>
      </div>
      <button type="button" className="dc-btn danger" onClick={() => window.confirm('¿Eliminar esta tarea?') && ejecutar(() => eliminarTarea(clase.id, tarea.id))}>
        Eliminar
      </button>
    </div>
  )
}

export default function ProgramaTab({ clase, ejecutar }) {
  const [form, setForm] = useState({ titulo: '', descripcion: '', fechaLimite: '' })
  const proxima = SESIONES.find((s) => !clase.sesionesDictadas.includes(s.n))?.n
  const sinConsentimiento = clase.resumen.sinConsentimiento
  const personalizadas = clase.tareas.filter((t) => !t.sesion)

  const crear = (e) => {
    e.preventDefault()
    ejecutar(async () => {
      await crearTareaPersonalizada(clase.id, form)
      setForm({ titulo: '', descripcion: '', fechaLimite: '' })
    })
  }

  return (
    <>
      {sinConsentimiento > 0 && (
        <p className="dc-lock" style={{ marginBottom: 14 }}>
          {sinConsentimiento} estudiante(s) no tienen consentimiento otorgado y no verán las tareas hasta registrarlo.
        </p>
      )}

      {SESIONES.map((s) => {
        const dictada = clase.sesionesDictadas.includes(s.n)
        const tareasSesion = clase.tareas.filter((t) => t.sesion === s.n)
        const todasAsignadas = s.tareas.length > 0 && s.tareas.every((p) => clase.tareas.some((t) => t.plantillaId === p.plantillaId))
        const estado = dictada ? ['ok', 'Dictada'] : s.n === proxima ? ['info', 'Próxima'] : ['muted', 'Pendiente']
        return (
          <section className="dc-block" key={s.n}>
            <header>
              <div>
                <h3>{nombreSesion(s)}</h3>
                <span className={`dc-pill ${estado[0]}`}>{estado[1]}</span>
              </div>
              <div className="dc-actions">
                <button type="button" className="dc-btn" onClick={() => ejecutar(() => alternarSesionDictada(clase.id, s.n))}>
                  {dictada ? 'Quitar “dictada”' : 'Marcar como dictada'}
                </button>
                <Link
                  className="dc-btn"
                  to={`/docente/guias/nueva?clase=${clase.id}&sesion=${s.n}&edad=${edadPorGrado(clase.grade)}`}
                >
                  Preparar guía
                </Link>
              </div>
            </header>
            {s.objetivo && <p className="dc-muted" style={{ marginTop: 10 }}>{s.objetivo}</p>}

            {s.tareas.length === 0 ? (
              <p className="dc-muted" style={{ marginTop: 10 }}>Las tareas de esta sesión se definirán junto con su guía.</p>
            ) : (
              <div style={{ marginTop: 10 }}>
                <button
                  type="button"
                  className="dc-btn primary"
                  disabled={todasAsignadas}
                  onClick={() => ejecutar(() => asignarTareasSesion(clase.id, s.n))}
                >
                  {todasAsignadas ? 'Tareas asignadas' : `Asignar las ${s.tareas.length} tareas de esta sesión`}
                </button>
              </div>
            )}
            {tareasSesion.map((t) => <FilaTarea key={t.id} clase={clase} tarea={t} ejecutar={ejecutar} />)}
          </section>
        )
      })}

      <section className="dc-block">
        <h3>Otras tareas de la clase</h3>
        <form className="dc-form" onSubmit={crear}>
          <input value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} placeholder="Título de la tarea" aria-label="Título de la tarea" />
          <textarea rows={2} value={form.descripcion} onChange={(e) => setForm({ ...form, descripcion: e.target.value })} placeholder="Instrucciones para los estudiantes" aria-label="Instrucciones" />
          <input type="date" value={form.fechaLimite} onChange={(e) => setForm({ ...form, fechaLimite: e.target.value })} aria-label="Fecha límite" />
          <div><button type="submit" className="dc-btn primary">Crear tarea</button></div>
        </form>
        {personalizadas.map((t) => <FilaTarea key={t.id} clase={clase} tarea={t} ejecutar={ejecutar} />)}
      </section>
    </>
  )
}
