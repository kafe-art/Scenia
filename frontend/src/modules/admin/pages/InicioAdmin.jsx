import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeading, Icon } from '../../../components/SceniaUI'
import KpiCard from '../components/KpiCard'
import WleisChart from '../components/WleisChart'
import InstitucionDrawer from '../components/InstitucionDrawer'
import {
  initialInstituciones,
  initialMetricasWleis,
  initialSalasEficiencia,
  initialFunciones,
  initialUsuariosAdmin,
  initialAuditoriaLogs,
  initialConfiguracion,
  initialPatrocinios,
} from '../data/adminDemo'
import '../admin.css'

export default function InicioAdmin({ initialTab = 'instituciones' }) {
  const activeTab = initialTab
  const navigate = useNavigate()

  const handleTabClick = (_tabKey, route) => {
    navigate(route)
  }

  // --- Estados de Datos ---
  const [instituciones, setInstituciones] = useState(initialInstituciones)
  const [usuarios, setUsuarios] = useState(initialUsuariosAdmin)
  const [funciones] = useState(initialFunciones)
  const [auditoriaLogs, setAuditoriaLogs] = useState(initialAuditoriaLogs)
  const [config, setConfig] = useState(initialConfiguracion)
  const [patrocinios, setPatrocinios] = useState(initialPatrocinios)

  // --- Estados de Filtros Instituciones ---
  const [searchInst, setSearchInst] = useState('')
  const [tipoFilter, setTipoFilter] = useState('TODAS')
  const [selectedInst, setSelectedInst] = useState(null)
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)

  // --- Estados de Filtros Usuarios ---
  const [searchUser, setSearchUser] = useState('')
  const [rolUserFilter, setRolUserFilter] = useState('TODOS')
  const [isUserModalOpen, setIsUserModalOpen] = useState(false)
  const [newUser, setNewUser] = useState({ nombre: '', email: '', rol: 'Docente Coordinador', colegio: 'San Miguel de Piura' })

  // --- Estados de PDF / Reportes ---
  const [pdfReporteGenerado, setPdfReporteGenerado] = useState(null)
  const [dossierDescargando, setDossierDescargando] = useState(false)
  const [notifMensaje, setNotifMensaje] = useState(null)

  // Feedback toast temporal
  const triggerToast = (msg) => {
    setNotifMensaje(msg)
    setTimeout(() => setNotifMensaje(null), 3500)
  }

  // Filtrado de Instituciones
  const filteredInstituciones = instituciones.filter((inst) => {
    const matchSearch =
      inst.nombre.toLowerCase().includes(searchInst.toLowerCase()) ||
      inst.director.toLowerCase().includes(searchInst.toLowerCase()) ||
      inst.distrito.toLowerCase().includes(searchInst.toLowerCase()) ||
      inst.siglas.toLowerCase().includes(searchInst.toLowerCase())
    const matchTipo = tipoFilter === 'TODAS' || inst.tipo === tipoFilter
    return matchSearch && matchTipo
  })

  // Actualización de institución desde drawer
  const handleUpdateInstitucion = (updated) => {
    setInstituciones((prev) =>
      prev.map((i) => (i.id === updated.id ? updated : i))
    )
    // Registrar en auditoría
    const nuevoLog = {
      id: `log-${Date.now()}`,
      evento: `Convenio Actualizado: ${updated.siglas}`,
      actor: 'Coordinador del Club',
      fecha: 'Ahora mismo',
      severidad: 'success',
      detalle: `Estado: ${updated.estado} · Titular: ${updated.director}`,
    }
    setAuditoriaLogs((prev) => [nuevoLog, ...prev])
    triggerToast(`Institución "${updated.nombre}" actualizada con éxito`)
  }

  // Abrir drawer para una institución
  const handleOpenDrawer = (inst) => {
    setSelectedInst(inst)
    setIsDrawerOpen(true)
  }

  // Filtrado de Usuarios
  const filteredUsuarios = usuarios.filter((usr) => {
    const matchSearch =
      usr.nombre.toLowerCase().includes(searchUser.toLowerCase()) ||
      usr.email.toLowerCase().includes(searchUser.toLowerCase()) ||
      usr.colegio.toLowerCase().includes(searchUser.toLowerCase())
    const matchRol = rolUserFilter === 'TODOS' || usr.rol === rolUserFilter
    return matchSearch && matchRol
  })

  // Toggle estado de usuario
  const handleToggleUsuario = (id) => {
    setUsuarios((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, estado: u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO' } : u
      )
    )
    triggerToast('Estado de usuario modificado.')
  }

  // Crear nuevo usuario
  const handleCrearUsuario = (e) => {
    e.preventDefault()
    if (!newUser.nombre || !newUser.email) return
    const nuevo = {
      id: `usr-${Date.now()}`,
      nombre: newUser.nombre,
      email: newUser.email,
      rol: newUser.rol,
      colegio: newUser.colegio,
      estado: 'ACTIVO',
    }
    setUsuarios((prev) => [nuevo, ...prev])
    setNewUser({ nombre: '', email: '', rol: 'Docente Coordinador', colegio: 'San Miguel de Piura' })
    setIsUserModalOpen(false)
    triggerToast(`Usuario ${nuevo.nombre} invitado correctamente.`)
  }

  // Toggle configuración del sistema
  const handleToggleConfig = (key) => {
    setConfig((prev) => {
      const updated = { ...prev, [key]: !prev[key] }
      triggerToast(`Configuración "${key}" actualizada`)
      return updated
    })
  }

  // Toggle patrocinios
  const handleTogglePatrocinio = (id) => {
    setPatrocinios((prev) =>
      prev.map((p) => (p.id === id ? { ...p, activo: !p.activo } : p))
    )
    triggerToast('Visibilidad de marca actualizada')
  }

  // Descarga de Dossier UGEL
  const handleDescargarDossier = () => {
    setDossierDescargando(true)
    setTimeout(() => {
      setDossierDescargando(false)
      triggerToast('Dossier Oficial de Impacto UGEL & Sponsors descargado')
    }, 1500)
  }

  // Generación de Reporte de Taquilla para Sala
  const handleGenerarReporteSala = (func) => {
    setPdfReporteGenerado({
      obra: func.obra,
      recinto: func.recinto,
      fecha: func.fecha,
      aforoTotal: func.aforoTotal,
      reservados: func.reservados,
      colegiosInscritos: func.colegiosInscritos,
      horaEmision: '10:00 AM (Validado DREP/UGEL)',
    })
  }

  return (
    <div className="admin-dashboard">
      {/* Toast Notificación */}
      {notifMensaje && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: '#07151a',
            color: '#ffffff',
            padding: '12px 22px',
            borderRadius: '14px',
            boxShadow: '0 8px 30px rgba(0,0,0,0.25)',
            zIndex: 9999,
            fontSize: '13px',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            border: '1px solid rgba(255,255,255,0.15)',
          }}
        >
          <span style={{ color: '#22c55e' }}>✓</span> {notifMensaje}
        </div>
      )}

      {/* Topbar con los 5 Botones de Navegación del Rediseño */}
      <div className="admin-topbar">
        <PageHeading
          eyebrow="CLUB DE ARTE Y CULTURA DE PIURA"
          title="Panel de Administración y Gestión Regional"
        >
          Supervisión de instituciones aliadas, impacto psicométrico y auditoría institucional.
        </PageHeading>

        <div className="admin-tabs" role="tablist">
          <button
            className={`admin-tab ${activeTab === 'instituciones' ? 'is-active' : ''}`}
            onClick={() => handleTabClick('instituciones', '/admin')}
            role="tab"
            aria-selected={activeTab === 'instituciones'}
          >
            <span>🏛️ Instituciones Aliadas</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'usuarios' ? 'is-active' : ''}`}
            onClick={() => handleTabClick('usuarios', '/admin/usuarios')}
            role="tab"
            aria-selected={activeTab === 'usuarios'}
          >
            <span>👥 Usuarios y Roles</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'metricas' ? 'is-active' : ''}`}
            onClick={() => handleTabClick('metricas', '/admin/metricas')}
            role="tab"
            aria-selected={activeTab === 'metricas'}
          >
            <span>📊 Métricas e Impacto</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'configuracion' ? 'is-active' : ''}`}
            onClick={() => handleTabClick('configuracion', '/admin/configuracion')}
            role="tab"
            aria-selected={activeTab === 'configuracion'}
          >
            <span>⚙️ Configuración del Sistema</span>
          </button>
          <button
            className={`admin-tab ${activeTab === 'auditoria' ? 'is-active' : ''}`}
            onClick={() => handleTabClick('auditoria', '/admin/auditoria')}
            role="tab"
            aria-selected={activeTab === 'auditoria'}
          >
            <span>🛡️ Auditoría y Seguridad</span>
          </button>
        </div>
      </div>

      {/* =========================================================================
          VISTA 1: 🏛️ INSTITUCIONES ALIADAS (VISTA PRINCIPAL / LANDING DEL ADMIN)
          ========================================================================= */}
      {activeTab === 'instituciones' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
          {/* Hero Header con Ambient Glow & Contadores en Tiempo Real */}
          <div className="admin-hero-hub">
            <div className="admin-hero-glow" />
            <div style={{ position: 'relative', zIndex: 1, maxWidth: '780px' }}>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  background: 'rgba(255,255,255,0.12)',
                  padding: '5px 14px',
                  borderRadius: '999px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e' }} />
                Red de Cooperación Cultural Activa · Piura 2026
              </span>
              <h1 style={{ fontSize: '32px', fontWeight: 800, margin: '14px 0 8px', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
                Bienvenido, Coordinador del Club
              </h1>
              <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
                Gestiona y audita los convenios bilaterales con colegios, universidades y entidades públicas aliadas. Toda la red escolar conectada a las temporadas escénicas bajo el marco de la <strong>Ley N.° 29733</strong>.
              </p>
            </div>

            {/* Fila de Contadores en Tiempo Real */}
            <div className="hero-stats-row">
              <div className="hero-stat-card">
                <div className="hero-stat-val">
                  <span>32</span>
                  <span style={{ fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>+4 este mes</span>
                </div>
                <div className="hero-stat-lbl">Instituciones en Red Regional</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">
                  <span>5</span>
                  <span style={{ fontSize: '13px', color: '#38bdf8', fontWeight: 600 }}>Vigentes</span>
                </div>
                <div className="hero-stat-lbl">Convenios Activos Este Mes</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">
                  <span>94%</span>
                  <span style={{ fontSize: '13px', color: '#fbbf24', fontWeight: 600 }}>Alta</span>
                </div>
                <div className="hero-stat-lbl">Tasa de Aprobación Escolar</div>
              </div>
              <div className="hero-stat-card">
                <div className="hero-stat-val">
                  <span>4,280</span>
                  <span style={{ fontSize: '13px', color: '#a7f3d0', fontWeight: 600 }}>Alumnos</span>
                </div>
                <div className="hero-stat-lbl">Estudiantes Beneficiados</div>
              </div>
            </div>
          </div>

          {/* Barra de Búsqueda y Filtros Deslizantes (Sliding Tabs) */}
          <div className="partner-toolbar">
            <div className="sliding-filters">
              {['TODAS', 'Colegios', 'Universidades', 'Empresas', 'ONGs / Gobierno'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-pill ${tipoFilter === cat ? 'is-active' : ''}`}
                  onClick={() => setTipoFilter(cat)}
                >
                  {cat === 'TODAS' ? 'Todas las Alianzas' : cat}
                </button>
              ))}
            </div>

            <div style={{ position: 'relative', minWidth: '280px', flex: '1', maxWidth: '380px' }}>
              <input
                type="text"
                placeholder="Buscar por institución, siglas, director o distrito…"
                value={searchInst}
                onChange={(e) => setSearchInst(e.target.value)}
                style={{
                  width: '100%',
                  padding: '10px 16px 10px 38px',
                  borderRadius: '999px',
                  border: '1px solid #cbd5e1',
                  background: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.03)',
                }}
              />
              <span style={{ position: 'absolute', left: '14px', top: '10px', color: '#94a3b8' }}>
                <Icon name="search" size={16} />
              </span>
            </div>
          </div>

          {/* Mensaje de resultados */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: '#64748b' }}>
            <span>Mostrando <strong>{filteredInstituciones.length}</strong> de {instituciones.length} entidades aliadas</span>
            {searchInst && (
              <button
                onClick={() => setSearchInst('')}
                style={{ background: 'none', border: 0, color: '#e63946', cursor: 'pointer', fontWeight: 600 }}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>

          {/* The Partner Grid (Tarjetas Soft 3D Tilt) */}
          <div className="partner-grid">
            {filteredInstituciones.map((inst) => {
              const statusClass =
                inst.estado === 'ACTIVO'
                  ? 'status-activo'
                  : inst.estado === 'RENOVACION'
                  ? 'status-renovacion'
                  : 'status-pendiente'
              const statusLabel =
                inst.estado === 'ACTIVO'
                  ? 'Convenio Activo'
                  : inst.estado === 'RENOVACION'
                  ? 'En Renovación'
                  : 'Pendiente'

              return (
                <div
                  key={inst.id}
                  className="partner-card-3d"
                  onClick={() => handleOpenDrawer(inst)}
                  tabIndex={0}
                  role="button"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleOpenDrawer(inst)
                  }}
                  style={{ borderTop: `4px solid ${inst.color || '#e63946'}` }}
                >
                  <div
                    className="partner-card-glow"
                    style={{ background: inst.color || '#e63946' }}
                  />

                  {/* Header de Tarjeta */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                      <div
                        style={{
                          width: '44px',
                          height: '44px',
                          borderRadius: '14px',
                          background: `${inst.color || '#e63946'}15`,
                          color: inst.color || '#e63946',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '16px',
                          border: `1.5px solid ${inst.color || '#e63946'}35`,
                        }}
                      >
                        {inst.siglas}
                      </div>
                      <span className={`status-pill ${statusClass}`}>
                        <span className="status-dot" />
                        {statusLabel}
                      </span>
                    </div>

                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#7b8e95', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                      {inst.tipo} · {inst.distrito}
                    </span>
                    <h3 style={{ fontSize: '17px', fontWeight: 800, margin: '4px 0 10px', color: '#07151a', lineHeight: 1.3 }}>
                      {inst.nombre}
                    </h3>

                    <div style={{ fontSize: '12px', color: '#475569', marginBottom: '14px', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div><strong>Titular:</strong> {inst.director}</div>
                      <div><strong>Acuerdo:</strong> {inst.convenio}</div>
                      <div><strong>Vigencia:</strong> {inst.vigencia}</div>
                    </div>
                  </div>

                  {/* Footer de Tarjeta */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '14px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
                      <div>
                        <span style={{ color: '#64748b', display: 'block', fontSize: '11px' }}>Impacto</span>
                        <strong style={{ color: '#07151a' }}>{inst.estudiantes} alumnos</strong>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation()
                          handleOpenDrawer(inst)
                        }}
                        style={{
                          background: '#f8fafc',
                          border: '1px solid #cbd5e1',
                          padding: '6px 12px',
                          borderRadius: '999px',
                          fontSize: '12px',
                          fontWeight: 600,
                          color: '#07151a',
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        Gestionar <span>→</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* Drawer Lateral de Inspección Profunda */}
          <InstitucionDrawer
            institucion={selectedInst}
            isOpen={isDrawerOpen}
            onClose={() => setIsDrawerOpen(false)}
            onUpdateInstitucion={handleUpdateInstitucion}
          />
        </div>
      )}

      {/* =========================================================================
          VISTA 2: 👥 USUARIOS Y ROLES (GESTIÓN DE ACCESO Y PERMISOS)
          ========================================================================= */}
      {activeTab === 'usuarios' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* KPIs de Usuarios */}
          <div className="kpi-grid">
            <KpiCard
              caption="Total Usuarios Registrados"
              value={usuarios.length.toString()}
              target="en el ecosistema"
              badgeText="Ley 29733 Ok"
              badgeType="up"
              colorScheme="crimson"
              iconText="👥"
              progressPercentage={85}
              progressColor="#e63946"
            />
            <KpiCard
              caption="Directores Escolares"
              value={usuarios.filter((u) => u.rol.includes('Director')).length.toString()}
              badgeText="Acreditados"
              badgeType="meta"
              colorScheme="teal"
              iconText="🏛"
              progressPercentage={90}
              progressColor="#0d9488"
            />
            <KpiCard
              caption="Docentes Coordinadores"
              value={usuarios.filter((u) => u.rol.includes('Docente')).length.toString()}
              badgeText="Activos"
              badgeType="up"
              colorScheme="blue"
              iconText="🎓"
              progressPercentage={75}
              progressColor="#4f46e5"
            />
          </div>

          {/* Tabla de Usuarios y Controles */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Directorio de Usuarios y Permisos</h3>
                <p className="admin-card-subtitle">
                  Control de credenciales bajo los lineamientos de privacidad institucional.
                </p>
              </div>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  placeholder="Buscar usuario o institución…"
                  value={searchUser}
                  onChange={(e) => setSearchUser(e.target.value)}
                  style={{
                    padding: '8px 14px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                  }}
                />
                <select
                  value={rolUserFilter}
                  onChange={(e) => setRolUserFilter(e.target.value)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    background: '#ffffff',
                  }}
                >
                  <option value="TODOS">Todos los Roles</option>
                  <option value="Director Escolar">Directores Escolares</option>
                  <option value="Docente Coordinadora">Docentes Coordinadores</option>
                </select>
                <button
                  type="button"
                  onClick={() => setIsUserModalOpen(true)}
                  style={{
                    background: '#07151a',
                    color: '#ffffff',
                    border: 0,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '13px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  + Invitar Usuario
                </button>
              </div>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Usuario / Nombre</th>
                    <th>Correo Electrónico</th>
                    <th>Institución</th>
                    <th>Rol en Scenia</th>
                    <th>Estado</th>
                    <th>Acción</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.map((usr) => (
                    <tr key={usr.id}>
                      <td>
                        <strong style={{ color: '#0f172a' }}>{usr.nombre}</strong>
                      </td>
                      <td style={{ color: '#64748b' }}>{usr.email}</td>
                      <td>{usr.colegio}</td>
                      <td>
                        <span style={{ background: '#f1f5f9', padding: '3px 8px', borderRadius: '6px', fontSize: '12px', fontWeight: 600 }}>
                          {usr.rol}
                        </span>
                      </td>
                      <td>
                        <span className={`status-pill ${usr.estado === 'ACTIVO' ? 'status-activo' : 'status-pendiente'}`}>
                          <span className="status-dot" />
                          {usr.estado}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleToggleUsuario(usr.id)}
                          style={{
                            background: '#f8fafc',
                            border: '1px solid #cbd5e1',
                            borderRadius: '8px',
                            padding: '4px 10px',
                            fontSize: '12px',
                            cursor: 'pointer',
                          }}
                        >
                          {usr.estado === 'ACTIVO' ? 'Suspender' : 'Activar'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Modal Invitar Usuario */}
          {isUserModalOpen && (
            <div className="drawer-backdrop" onClick={() => setIsUserModalOpen(false)}>
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
                <h3 style={{ margin: '0 0 16px', fontSize: '20px', color: '#07151a' }}>Invitar Nuevo Usuario</h3>
                <form onSubmit={handleCrearUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Nombre Completo
                    </label>
                    <input
                      type="text"
                      required
                      value={newUser.nombre}
                      onChange={(e) => setNewUser({ ...newUser, nombre: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Correo Institucional
                    </label>
                    <input
                      type="email"
                      required
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                      Rol
                    </label>
                    <select
                      value={newUser.rol}
                      onChange={(e) => setNewUser({ ...newUser, rol: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    >
                      <option value="Director Escolar">Director Escolar</option>
                      <option value="Docente Coordinador">Docente Coordinador</option>
                      <option value="Supervisor UGEL">Supervisor UGEL</option>
                    </select>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setIsUserModalOpen(false)}
                      style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      style={{ padding: '8px 20px', borderRadius: '10px', border: 0, background: '#e63946', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                    >
                      Enviar Invitación
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =========================================================================
          VISTA 3: 📊 MÉTRICAS E IMPACTO (ANALÍTICAS GLOBALES & OBSERVATORIO WLEIS)
          ========================================================================= */}
      {activeTab === 'metricas' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Fila de KPIs de Impacto */}
          <div className="kpi-grid">
            <KpiCard
              caption="Cobertura Escolar UGEL"
              value="32"
              target="/ 50 Colegios"
              badgeText="Meta 2026: 64%"
              badgeType="meta"
              colorScheme="crimson"
              iconText="🏛"
              progressPercentage={64}
              progressColor="#e63946"
            />
            <KpiCard
              caption="Asimilación por Voz (IA)"
              value="84.6%"
              badgeText="+6.2% vs mes anterior"
              badgeType="up"
              colorScheme="teal"
              iconText="🎙"
              progressPercentage={85}
              progressColor="#0d9488"
            />
            <KpiCard
              caption="Crecimiento Emocional Promedio"
              value="+1.25"
              target="Δ WLEIS"
              badgeText="Pre vs Post test"
              badgeType="up"
              colorScheme="blue"
              iconText="📈"
              progressPercentage={78}
              progressColor="#4f46e5"
            />
          </div>

          {/* Gráfico y Observatorio Psicométrico */}
          <div className="charts-row">
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Impacto Psicométrico WLEIS (Escala Wong & Law)</h3>
                  <p className="admin-card-subtitle">
                    Comparación científica entre Pre-test escolar y Post-test tras vivir la función teatral.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleDescargarDossier}
                  disabled={dossierDescargando}
                  style={{
                    background: '#07151a',
                    color: '#ffffff',
                    border: 0,
                    padding: '8px 16px',
                    borderRadius: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {dossierDescargando ? 'Generando Dossier...' : '📄 Exportar Dossier UGEL'}
                </button>
              </div>

              <WleisChart data={initialMetricasWleis} />

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px', marginTop: '20px' }}>
                {initialMetricasWleis.map((m) => (
                  <div key={m.dimCode} style={{ background: '#f8fafc', padding: '12px 14px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '11px', fontWeight: 800, color: '#e63946' }}>{m.dimCode}</span>
                      <strong style={{ fontSize: '12px', color: '#16a34a' }}>{m.delta}</strong>
                    </div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#0f172a', margin: '4px 0' }}>{m.dimension}</div>
                    <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>{m.descripcion}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Ocupación de Salas y Butacas */}
            <div className="admin-card">
              <div className="admin-card-header">
                <div>
                  <h3 className="admin-card-title">Eficiencia y Aforo de Salas</h3>
                  <p className="admin-card-subtitle">
                    Capacidad y demanda en Auditorio UNP y Alianza Francesa.
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {initialSalasEficiencia.map((sala, idx) => (
                  <div key={idx} style={{ background: '#f8fafc', padding: '16px', borderRadius: '14px', border: '1px solid #edf2f7' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <strong style={{ fontSize: '14px', color: '#07151a' }}>{sala.recinto}</strong>
                      <span className="status-pill status-activo">{sala.estado}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '6px' }}>
                      {sala.butacasEfectivas} butacas ocupadas de {sala.aforoMaximo} ({sala.ocupacion}%)
                    </div>
                    <div className="kpi-progress">
                      <div
                        className="kpi-progress-bar"
                        style={{ width: `${sala.ocupacion}%`, background: sala.ocupacion > 90 ? '#e63946' : '#0d9488' }}
                      />
                    </div>
                    <div style={{ fontSize: '11px', color: '#7b8e95', marginTop: '6px' }}>
                      {sala.funcionesMes} funciones programadas este mes
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 4: ⚙️ CONFIGURACIÓN DEL SISTEMA (AJUSTES GENERALES & SPONSORS)
          ========================================================================= */}
      {activeTab === 'configuracion' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Toggles Reactivos de Plataforma */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Parámetros Operativos de la Temporada 2026</h3>
                <p className="admin-card-subtitle">
                  Interruptores reactivos con actualización en tiempo real para directores y docentes.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={config.convocatoriaAbierta}
                  onChange={() => handleToggleConfig('convocatoriaAbierta')}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Convocatoria Escolar Abierta</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Permite a directores registrar delegaciones y solicitar reservas.</div>
                </div>
              </label>

              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={config.notificacionesAutomaticas}
                  onChange={() => handleToggleConfig('notificacionesAutomaticas')}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Notificaciones Automatizadas</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Envía correos y alertas de butacas emitidas a los directores.</div>
                </div>
              </label>

              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={config.filtroConsentimientoLey29733}
                  onChange={() => handleToggleConfig('filtroConsentimientoLey29733')}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Filtro Ley N.° 29733 Obligatorio</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Exige consentimiento de padres antes de generar listas de sala.</div>
                </div>
              </label>

              <label className="switch-label">
                <input
                  type="checkbox"
                  className="switch-input"
                  checked={config.modoAltaDemanda}
                  onChange={() => handleToggleConfig('modoAltaDemanda')}
                />
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 700 }}>Modo Alta Demanda y Reserva</div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>Protege 15% de butacas para colegios de zonas vulnerables de Piura.</div>
                </div>
              </label>
            </div>
          </div>

          {/* Gestión de Marcas y Patrocinios */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Gestión de Marcas y Patrocinios Oficiales</h3>
                <p className="admin-card-subtitle">
                  Controla la presencia de las marcas en carteleras, guías pedagógicas y proyecciones de sala.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {patrocinios.map((pat) => (
                <div
                  key={pat.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '14px 18px',
                    borderRadius: '14px',
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div>
                    <strong style={{ fontSize: '14px', color: '#07151a' }}>{pat.marca}</strong>
                    <span style={{ marginLeft: '10px', fontSize: '11px', background: '#e0e7ff', color: '#4338ca', padding: '2px 8px', borderRadius: '999px', fontWeight: 700 }}>
                      {pat.categoria}
                    </span>
                    <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#64748b' }}>{pat.beneficio}</p>
                  </div>

                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                    <span style={{ fontSize: '12px', fontWeight: 600, color: pat.activo ? '#16a34a' : '#94a3b8' }}>
                      {pat.activo ? 'Visible en Sala' : 'Oculto'}
                    </span>
                    <input
                      type="checkbox"
                      className="switch-input"
                      checked={pat.activo}
                      onChange={() => handleTogglePatrocinio(pat.id)}
                    />
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          VISTA 5: 🛡️ AUDITORÍA Y SEGURIDAD (LOGS Y CONTROL DE EVENTOS)
          ========================================================================= */}
      {activeTab === 'auditoria' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Cartelera y Emisión de Reportes de Sala en PDF */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Curaduría Teatral & Reportes Oficiales de Sala</h3>
                <p className="admin-card-subtitle">
                  Generación de listas de asistencia para control de acceso y taquilla bajo la Ley N.° 29733.
                </p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(310px, 1fr))', gap: '16px' }}>
              {funciones.map((func) => (
                <div
                  key={func.id}
                  style={{
                    background: '#f8fafc',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid #e2e8f0',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                  }}
                >
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#e63946', textTransform: 'uppercase' }}>
                      {func.recinto}
                    </span>
                    <h4 style={{ fontSize: '17px', margin: '4px 0 8px', color: '#07151a' }}>{func.obra}</h4>
                    <div style={{ fontSize: '12px', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '3px' }}>
                      <div>📅 <strong>Fecha:</strong> {func.fecha}</div>
                      <div>🎓 <strong>Grados:</strong> {func.grados}</div>
                      <div>🎟 <strong>Aforo:</strong> {func.reservados} / {func.aforoTotal} butacas reservadas</div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleGenerarReporteSala(func)}
                    style={{
                      marginTop: '16px',
                      background: '#07151a',
                      color: '#ffffff',
                      border: 0,
                      padding: '10px 14px',
                      borderRadius: '10px',
                      fontSize: '12px',
                      fontWeight: 600,
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    📄 Generar Reporte de Sala (PDF)
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal de Previsualización de Reporte PDF */}
          {pdfReporteGenerado && (
            <div className="drawer-backdrop" onClick={() => setPdfReporteGenerado(null)}>
              <div
                style={{
                  background: '#ffffff',
                  borderRadius: '24px',
                  padding: '32px',
                  maxWidth: '560px',
                  width: '90%',
                  margin: 'auto',
                  boxShadow: '0 20px 50px rgba(0,0,0,0.3)',
                }}
                onClick={(e) => e.stopPropagation()}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '16px' }}>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#e63946', textTransform: 'uppercase' }}>
                      REPORTE OFICIAL DE TAQUILLA Y SALA
                    </span>
                    <h3 style={{ margin: '2px 0 0', fontSize: '18px', color: '#07151a' }}>{pdfReporteGenerado.obra}</h3>
                  </div>
                  <button
                    onClick={() => setPdfReporteGenerado(null)}
                    style={{ background: '#f1f5f9', border: 0, borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer' }}
                  >
                    ✕
                  </button>
                </div>

                <div style={{ fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Recinto:</strong> {pdfReporteGenerado.recinto}</div>
                  <div><strong>Horario:</strong> {pdfReporteGenerado.fecha}</div>
                  <div><strong>Total Alumnos Convocados:</strong> {pdfReporteGenerado.reservados} alumnos</div>
                  <div><strong>Colegios Inscritos:</strong> {pdfReporteGenerado.colegiosInscritos.join(', ')}</div>
                  <div><strong>Hora de Emisión:</strong> {pdfReporteGenerado.horaEmision}</div>
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '12px', borderRadius: '10px', fontSize: '12px', color: '#166534', marginTop: '10px' }}>
                    ✓ <strong>Acreditado bajo Ley N.° 29733:</strong> Toda la información de menores cuenta con autorización formal de la UGEL y de los directores respectivos.
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    onClick={() => setPdfReporteGenerado(null)}
                    style={{ padding: '8px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                  >
                    Cerrar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      triggerToast('Descarga iniciada para el Reporte de Sala')
                      setPdfReporteGenerado(null)
                    }}
                    style={{ padding: '8px 20px', borderRadius: '10px', border: 0, background: '#e63946', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                  >
                    Descargar PDF Oficial
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Timeline de Auditoría Inmutable */}
          <div className="admin-card">
            <div className="admin-card-header">
              <div>
                <h3 className="admin-card-title">Registro de Auditoría y Eventos Inmutables</h3>
                <p className="admin-card-subtitle">
                  Historial de acciones críticas de validación de convenios y protección de datos.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {auditoriaLogs.map((log) => (
                <div
                  key={log.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '14px',
                    padding: '14px 18px',
                    background: '#f8fafc',
                    borderRadius: '14px',
                    border: '1px solid #e2e8f0',
                  }}
                >
                  <div
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: log.severidad === 'success' ? '#dcfce7' : '#e0f2fe',
                      color: log.severidad === 'success' ? '#15803d' : '#0369a1',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 800,
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    {log.severidad === 'success' ? '✓' : 'ℹ'}
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ fontSize: '13px', color: '#07151a' }}>{log.evento}</strong>
                      <span style={{ fontSize: '11px', color: '#94a3b8' }}>{log.fecha}</span>
                    </div>
                    <p style={{ margin: '3px 0 0', fontSize: '12px', color: '#64748b' }}>
                      {log.detalle} · <em>Ejecutado por: {log.actor}</em>
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
