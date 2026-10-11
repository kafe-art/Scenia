import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeading } from '../../../components/SceniaUI'
import ExecutiveKpiCard from '../components/ExecutiveKpiCard'
import ApprovalCard from '../components/ApprovalCard'
import WhatIfSimulator from '../components/WhatIfSimulator'
import {
  directorInfo,
  metricasEstrategicas,
  comparativaWleisColegio,
  proximosEventosColegio,
  solicitudesDecisiones,
  docentesColegio,
} from '../data/directorDemo'
import '../director.css'

export default function Director({ initialTab = 'institucion' }) {
  const activeTab = initialTab
  const navigate = useNavigate()

  // Estados de interfaz y datos
  const [periodo, setPeriodo] = useState('2026-I')
  const [modoPresentacion, setModoPresentacion] = useState(false)
  const [subTabInstitucion, setSubTabInstitucion] = useState('kpis') // 'kpis', 'wleis', 'eventos', 'informe'
  const [decisiones, setDecisiones] = useState(solicitudesDecisiones)
  const [docentes, setDocentes] = useState(docentesColegio)
  const [isDocenteModalOpen, setIsDocenteModalOpen] = useState(false)
  const [nuevoDocente, setNuevoDocente] = useState({ nombre: '', especialidad: '', grados: '3.° A' })
  const [dossierDescargando, setDossierDescargando] = useState(false)
  const [toastMensaje, setToastMensaje] = useState(null)

  const triggerToast = (msg) => {
    setToastMensaje(msg)
    setTimeout(() => setToastMensaje(null), 3500)
  }

  const handleTabClick = (tabKey, route) => {
    navigate(route)
  }

  // Manejo de Aprobación One-Tap
  const handleAccionDecision = (id, accion, comentario) => {
    setDecisiones((prev) =>
      prev.map((d) => (d.id === id ? { ...d, estado: accion === 'APROBAR' ? 'APROBADO' : accion } : d))
    )
    if (accion === 'APROBAR') {
      triggerToast('Firma digital estampada con éxito. Documento formalmente visado.')
    } else {
      triggerToast(`Acción "${accion}" registrada: ${comentario || 'Observación enviada'}`)
    }
  }

  // Invitar nuevo docente
  const handleCrearDocente = (e) => {
    e.preventDefault()
    if (!nuevoDocente.nombre) return
    const nuevo = {
      id: `doc-${Date.now()}`,
      nombre: nuevoDocente.nombre,
      especialidad: nuevoDocente.especialidad,
      gradosAsignados: [nuevoDocente.grados],
      estudiantes: 35,
      estado: 'Docente Participante',
      rolScenia: 'En Proceso de Acreditación',
      activo: true,
    }
    setDocentes((prev) => [...prev, nuevo])
    setNuevoDocente({ nombre: '', especialidad: '', grados: '3.° A' })
    setIsDocenteModalOpen(false)
    triggerToast(`Docente ${nuevo.nombre} convocado al programa cultural.`)
  }

  // Descarga informe institucional
  const handleDescargarInforme = () => {
    setDossierDescargando(true)
    setTimeout(() => {
      setDossierDescargando(false)
      triggerToast('Informe Ejecutivo Oficial para CONEI & UGEL descargado en PDF.')
    }, 1500)
  }

  return (
    <div className={`director-dashboard ${modoPresentacion ? 'presentation-active-container' : ''}`}>
      {/* Toast Notification */}
      {toastMensaje && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#0f172a',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
            zIndex: 99999,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span style={{ color: '#22c55e' }}>✓</span> {toastMensaje}
        </div>
      )}

      {/* Topbar Ejecutiva */}
      <div className="director-topbar">
        <PageHeading
          eyebrow={`${directorInfo.colegio} · ${directorInfo.distrito}`}
          title="Centro de Mando del Director"
        >
          Supervisión holística de impacto cultural, gestión del cuerpo docente y aprobaciones estratégicas.
        </PageHeading>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          {/* Navegación Principal Canónica: Mi institución (D01) | Docentes y postulaciones (D02) */}
          <div className="director-nav-tabs" role="tablist">
            <button
              className={`director-nav-tab ${activeTab === 'institucion' ? 'is-active' : ''}`}
              onClick={() => handleTabClick('institucion', '/director')}
              role="tab"
              aria-selected={activeTab === 'institucion'}
            >
              <span>🏛️ Mi institución</span>
            </button>
            <button
              className={`director-nav-tab ${activeTab === 'docentes' ? 'is-active' : ''}`}
              onClick={() => handleTabClick('docentes', '/director/docentes')}
              role="tab"
              aria-selected={activeTab === 'docentes'}
            >
              <span>👥 Docentes y postulaciones</span>
              {decisiones.filter((d) => d.estado === 'PENDIENTE').length > 0 && (
                <span style={{ background: '#e63946', color: '#fff', fontSize: '10px', padding: '1px 6px', borderRadius: '999px', fontWeight: 800 }}>
                  {decisiones.filter((d) => d.estado === 'PENDIENTE').length}
                </span>
              )}
            </button>
          </div>

          {/* Selector de Periodo */}
          <div className="period-badge-group">
            <select
              value={periodo}
              onChange={(e) => setPeriodo(e.target.value)}
              className="period-select"
            >
              <option value="2026-I">Semestre 2026-I</option>
              <option value="2026-ANUAL">Anual 2026</option>
              <option value="2027-PROY">Proyección 2027</option>
            </select>

            {/* Botón Modo Presentación */}
            <button
              type="button"
              className="btn-presentation"
              onClick={() => setModoPresentacion(!modoPresentacion)}
            >
              <span>🖥️ Modo Presentación</span>
            </button>
          </div>
        </div>
      </div>

      {/* =========================================================================
          MODO PRESENTACIÓN (ZEN / FULL-SCREEN EXECUTIVE VIEW)
          ========================================================================= */}
      {modoPresentacion && (
        <div className="director-presentation-active">
          <div className="presentation-header">
            <div>
              <span style={{ fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.1em', color: '#93c5fd', fontWeight: 700 }}>
                SESIÓN DE CONSEJO EDUCATIVO INSTITUCIONAL (CONEI)
              </span>
              <h1 style={{ fontSize: '32px', margin: '4px 0 0', fontWeight: 800 }}>
                {directorInfo.colegio} · Informe Ejecutivo de Impacto Scenia
              </h1>
            </div>
            <button
              onClick={() => setModoPresentacion(false)}
              style={{
                background: 'rgba(255,255,255,0.15)',
                border: 0,
                color: '#fff',
                padding: '10px 20px',
                borderRadius: '12px',
                cursor: 'pointer',
                fontWeight: 700,
                fontSize: '14px',
              }}
            >
              ✕ Salir de Presentación
            </button>
          </div>

          {/* KPIs Proyectados en Gran Formato */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginBottom: '32px' }}>
            {metricasEstrategicas.map((k) => (
              <div key={k.id} className="presentation-card">
                <span style={{ fontSize: '12px', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 700 }}>
                  {k.titulo}
                </span>
                <div style={{ fontSize: '48px', fontWeight: 800, margin: '8px 0', color: k.color }}>
                  {k.valor}
                </div>
                <div style={{ fontSize: '14px', color: '#cbd5e1' }}>{k.meta}</div>
                <div style={{ fontSize: '13px', color: '#22c55e', marginTop: '6px', fontWeight: 600 }}>
                  {k.tendencia}
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '24px' }}>
            <div className="presentation-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '20px' }}>Dimensiones de Crecimiento Emocional WLEIS</h3>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.2)', textAlign: 'left', color: '#94a3b8' }}>
                    <th style={{ padding: '10px 0' }}>Dimensión</th>
                    <th>Pre-Test</th>
                    <th>Post-Test</th>
                    <th>Impacto Δ</th>
                  </tr>
                </thead>
                <tbody>
                  {comparativaWleisColegio.map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                      <td style={{ padding: '12px 0', fontWeight: 600 }}>{row.dimension}</td>
                      <td style={{ color: '#94a3b8' }}>{row.preTest} pts</td>
                      <td style={{ color: '#38bdf8' }}>{row.postTest} pts</td>
                      <td style={{ color: '#4ade80', fontWeight: 800 }}>{row.delta} ({row.impacto})</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="presentation-card">
              <h3 style={{ margin: '0 0 16px', fontSize: '20px' }}>Resumen de Alianzas y Beneficios</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '14px' }}>
                <div>✓ <strong>Alianza Estratégica:</strong> {directorInfo.alianzaPrincipal}</div>
                <div>✓ <strong>Costo a Familias:</strong> S/ 0 (Subvención 100% de butacas y traslados)</div>
                <div>✓ <strong>Acreditación Docente:</strong> 12 docentes con horas certificadas por DREP Piura</div>
                <div>✓ <strong>Próximo Estreno:</strong> Voces en el Espejo · 18 Octubre en Auditorio UNP (210 alumnos)</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          PANTALLA D01: MI INSTITUCIÓN (PANEL INSTITUCIONAL & HERO DASHBOARD)
          ========================================================================= */}
      {activeTab === 'institucion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Executive Hero Banner con Ambient Glow */}
          <div className="director-hero">
            <div className="director-hero-glow" />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '800px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span className="director-hero-badge">
                  ● {directorInfo.nivelCultural}
                </span>
                <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                  Código Modular: {directorInfo.codigoModular}
                </span>
              </div>
              <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '6px 0 10px', letterSpacing: '-0.02em' }}>
                {directorInfo.colegio}
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                Panel institucional del <strong>{directorInfo.nombre}</strong>. Mando estratégico para consolidar el arte escénico y la formación socioemocional como sello de identidad pedagógica en Piura.
              </p>
            </div>
          </div>

          {/* Cuatro Métricas Estratégicas Principales (Soft Cards con Sparklines) */}
          <div className="exec-kpi-grid">
            {metricasEstrategicas.map((kpi) => (
              <ExecutiveKpiCard key={kpi.id} kpi={kpi} />
            ))}
          </div>

          {/* Subpestañas del Panel Institucional D01 */}
          <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '24px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #edf2f7', paddingBottom: '16px', marginBottom: '22px', flexWrap: 'wrap', gap: '12px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  ['kpis', '📊 Visión Panorámica & Metas'],
                  ['wleis', '📈 Beneficios Culturales & WLEIS'],
                  ['eventos', '🎭 Próximos Eventos & Salidas'],
                  ['informe', '📄 Informe Institucional (PDF)'],
                ].map(([subKey, label]) => (
                  <button
                    key={subKey}
                    type="button"
                    onClick={() => setSubTabInstitucion(subKey)}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      border: subTabInstitucion === subKey ? '1px solid #0f172a' : '1px solid #e2e8f0',
                      background: subTabInstitucion === subKey ? '#0f172a' : '#f8fafc',
                      color: subTabInstitucion === subKey ? '#ffffff' : '#64748b',
                      fontSize: '13px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>

              {subTabInstitucion === 'informe' && (
                <button
                  type="button"
                  onClick={handleDescargarInforme}
                  disabled={dossierDescargando}
                  style={{
                    background: '#059669',
                    color: '#fff',
                    border: 0,
                    padding: '8px 18px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {dossierDescargando ? 'Generando Expediente...' : 'Descargar Informe para CONEI/UGEL'}
                </button>
              )}
            </div>

            {/* Subpestaña 1: Panorámica & Metas */}
            {subTabInstitucion === 'kpis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
                  <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#0f172a' }}>Población Estudiantil Beneficiada</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                      420 alumnos de 3.° y 4.° de secundaria asisten a funciones teatrales y talleres guiados con materiales pedagógicos Scenia.
                    </p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#0f172a' }}>Cumplimiento Normativo Ley N.° 29733</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                      100% de consentimientos informados debidamente visados y archivados en el legajo de la dirección escolar.
                    </p>
                  </div>
                  <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                    <h4 style={{ margin: '0 0 6px', fontSize: '14px', color: '#0f172a' }}>Patio Teatral y Espacios Expresivos</h4>
                    <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                      Auditorio y patio central de la I.E. San Miguel acondicionados para ensayos y dinámicas teatrales en horario escolar.
                    </p>
                  </div>
                </div>

                {/* Simulador What-If */}
                <WhatIfSimulator />
              </div>
            )}

            {/* Subpestaña 2: Beneficios Culturales & WLEIS */}
            {subTabInstitucion === 'wleis' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                <div>
                  <h4 style={{ margin: '0 0 6px', fontSize: '16px', color: '#0f172a' }}>
                    Resultados Psicométricos Institucionales (Escala Wong & Law)
                  </h4>
                  <p style={{ margin: 0, fontSize: '13px', color: '#64748b' }}>
                    Evidencia científica del impacto formativo que demuestra a las familias y a la UGEL los beneficios del programa teatral.
                  </p>
                </div>

                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>Dimensión Socioemocional</th>
                        <th>Evaluación Diagnóstica (Pre-Test)</th>
                        <th>Medición Post-Función</th>
                        <th>Incremento Neto Δ</th>
                        <th>Dictamen Evaluativo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparativaWleisColegio.map((m, i) => (
                        <tr key={i}>
                          <td><strong>{m.dimension}</strong></td>
                          <td style={{ color: '#64748b' }}>{m.preTest} / 7.0 pts</td>
                          <td style={{ color: '#2563eb', fontWeight: 700 }}>{m.postTest} / 7.0 pts</td>
                          <td><strong style={{ color: '#16a34a', fontSize: '14px' }}>{m.delta}</strong></td>
                          <td>
                            <span style={{ background: '#dcfce7', color: '#15803d', padding: '3px 10px', borderRadius: '999px', fontSize: '11px', fontWeight: 700 }}>
                              {m.impacto}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Subpestaña 3: Próximos Eventos & Salidas */}
            {subTabInstitucion === 'eventos' && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
                {proximosEventosColegio.map((ev) => (
                  <div
                    key={ev.id}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderTop: `4px solid ${ev.color}`,
                      borderRadius: '18px',
                      padding: '20px',
                    }}
                  >
                    <span style={{ fontSize: '11px', fontWeight: 700, color: ev.color, textTransform: 'uppercase' }}>
                      {ev.recinto}
                    </span>
                    <h4 style={{ margin: '4px 0 8px', fontSize: '17px', color: '#0f172a' }}>{ev.obra}</h4>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      <div>📅 <strong>Fecha:</strong> {ev.fecha}</div>
                      <div>🎓 <strong>Grados:</strong> {ev.grados}</div>
                      <div>🎟 <strong>Delegación:</strong> {ev.alumnosConvocados} estudiantes confirmados</div>
                      <div style={{ marginTop: '6px', color: '#059669', fontWeight: 600 }}>
                        ✓ {ev.estadoLogistico}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Subpestaña 4: Informe Institucional */}
            {subTabInstitucion === 'informe' && (
              <div style={{ background: '#f8fafc', padding: '24px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '17px', color: '#0f172a' }}>
                      Dossier Institucional Oficial · I.E. San Miguel de Piura (2026)
                    </h4>
                    <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                      Documento consolidado para presentación ante el CONEI, Dirección Regional de Educación y patrocinadores.
                    </p>
                  </div>
                  <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '12px', fontWeight: 700, padding: '4px 12px', borderRadius: '999px' }}>
                    Listo para Visado
                  </span>
                </div>

                <div style={{ fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
                  <div>• <strong>Institución:</strong> I.E. San Miguel de Piura (Piura Centro)</div>
                  <div>• <strong>Director Responsable:</strong> Mg. Carlos Alberto Ramos</div>
                  <div>• <strong>Docente Especialista Activo:</strong> Lic. Carla Mendoza</div>
                  <div>• <strong>Estudiantes Acreditados en Escena:</strong> 420 alumnos con consentimiento formal</div>
                  <div>• <strong>Ahorro Estimado para Familias:</strong> S/ 31,500 en subvenciones culturales</div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================================
          PANTALLA D02: DOCENTES Y POSTULACIONES (GESTIÓN & ONE-TAP APPROVALS)
          ========================================================================= */}
      {activeTab === 'docentes' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Bandeja de Aprobaciones y Decisiones Ejecutivas (One-Tap Approvals) */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '26px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#e63946', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  BANDEJA DE DECISIONES DIRECTIVAS
                </span>
                <h3 style={{ margin: '2px 0 0', fontSize: '18px', color: '#0f172a' }}>
                  Aprobaciones Rápidas en 1 Clic (One-Tap Approvals)
                </h3>
              </div>
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                {decisiones.filter((d) => d.estado === 'PENDIENTE').length} trámites requieren tu visto bueno
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {decisiones.map((dec) => (
                <ApprovalCard key={dec.id} decision={dec} onAccion={handleAccionDecision} />
              ))}
            </div>
          </div>

          {/* Plantel Docente y Asignación de Clases */}
          <div style={{ background: '#ffffff', borderRadius: '24px', padding: '26px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.02)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', color: '#0f172a' }}>
                  Planta Docente Vinculada al Programa Cultural
                </h3>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
                  Gestión de docentes participantes y aprobación del docente especializado activo.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsDocenteModalOpen(true)}
                style={{
                  background: '#0f172a',
                  color: '#ffffff',
                  border: 0,
                  padding: '9px 18px',
                  borderRadius: '12px',
                  fontSize: '13px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                + Registrar / Invitar Docente
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Docente</th>
                    <th>Especialidad Curricular</th>
                    <th>Aulas Asignadas</th>
                    <th>Alumnos</th>
                    <th>Estatus en Scenia</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {docentes.map((doc) => (
                    <tr key={doc.id}>
                      <td><strong style={{ color: '#0f172a' }}>{doc.nombre}</strong></td>
                      <td style={{ color: '#64748b' }}>{doc.especialidad}</td>
                      <td>
                        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                          {doc.gradosAsignados.map((g, i) => (
                            <span key={i} style={{ background: '#f1f5f9', padding: '2px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 600 }}>
                              {g}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td>{doc.estudiantes}</td>
                      <td>
                        <span
                          style={{
                            padding: '3px 10px',
                            borderRadius: '999px',
                            fontSize: '11px',
                            fontWeight: 700,
                            background: doc.estado.includes('Especialista') ? '#dcfce7' : doc.estado.includes('Participante') ? '#e0f2fe' : '#fef3c7',
                            color: doc.estado.includes('Especialista') ? '#15803d' : doc.estado.includes('Participante') ? '#0369a1' : '#b45309',
                          }}
                        >
                          {doc.estado}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => triggerToast(`Aulas reasignadas para ${doc.nombre}`)}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          Asignar Clases
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Invitar Docente */}
          {isDocenteModalOpen && (
            <div className="drawer-backdrop" onClick={() => setIsDocenteModalOpen(false)}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '30px',
                  maxWidth: '480px',
                  width: '90%',
                  margin: 'auto',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 style={{ margin: '0 0 16px', fontSize: '20px', color: '#0f172a' }}>
                  Registrar Docente en Programa Scenia
                </h3>
                <form onSubmit={handleCrearDocente} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Nombre Completo del Docente
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Prof. Juan José Medina"
                      value={nuevoDocente.nombre}
                      onChange={(e) => setNuevoDocente({ ...nuevoDocente, nombre: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Área o Especialidad Curricular
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Ej. Comunicación / Ciencias Sociales / Arte"
                      value={nuevoDocente.especialidad}
                      onChange={(e) => setNuevoDocente({ ...nuevoDocente, especialidad: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Sección o Grado Inicial Asignado
                    </label>
                    <select
                      value={nuevoDocente.grados}
                      onChange={(e) => setNuevoDocente({ ...nuevoDocente, grados: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    >
                      <option value="3.° A">3.° de Secundaria · Sección A</option>
                      <option value="3.° B">3.° de Secundaria · Sección B</option>
                      <option value="4.° A">4.° de Secundaria · Sección A</option>
                      <option value="4.° B">4.° de Secundaria · Sección B</option>
                      <option value="5.° A">5.° de Secundaria · Sección A</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsDocenteModalOpen(false)}
                      style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 20px', borderRadius: '10px', border: 0, background: '#0f172a', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Registrar Docente
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
