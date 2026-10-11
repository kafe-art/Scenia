import { useState } from 'react'

export default function InstitucionDrawer({
  institucion,
  isOpen,
  onClose,
  onUpdateInstitucion,
}) {
  if (!isOpen || !institucion) return null

  return (
    <InstitucionDrawerContent
      key={institucion.id}
      institucion={institucion}
      onClose={onClose}
      onUpdateInstitucion={onUpdateInstitucion}
    />
  )
}

function InstitucionDrawerContent({
  institucion,
  onClose,
  onUpdateInstitucion,
}) {
  const [nombreDirector, setNombreDirector] = useState(institucion.director || '')
  const [emailDirector, setEmailDirector] = useState(institucion.email || '')
  const [estado, setEstado] = useState(institucion.estado || 'ACTIVO')
  const [vistoBueno, setVistoBueno] = useState(institucion.estado === 'ACTIVO')
  const [credencialesEnviadas, setCredencialesEnviadas] = useState(false)
  const [guardando, setGuardando] = useState(false)
  const [pdfDescargado, setPdfDescargado] = useState(false)

  const handleGuardar = () => {
    setGuardando(true)
    setTimeout(() => {
      onUpdateInstitucion({
        ...institucion,
        director: nombreDirector,
        email: emailDirector,
        estado,
      })
      setGuardando(false)
      onClose()
    }, 500)
  }

  const handleEnviarCredenciales = () => {
    setCredencialesEnviadas(true)
  }

  const handleDescargarConvenio = () => {
    setPdfDescargado(true)
    setTimeout(() => setPdfDescargado(false), 3000)
  }

  const getStatusClass = (st) => {
    if (st === 'ACTIVO') return 'status-activo'
    if (st === 'RENOVACION') return 'status-renovacion'
    return 'status-pendiente'
  }

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '14px',
                background: `${institucion.color || '#e63946'}18`,
                color: institucion.color || '#e63946',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '17px',
                fontWeight: '800',
                border: `1.5px solid ${institucion.color || '#e63946'}40`,
              }}
            >
              {institucion.siglas || 'SC'}
            </div>
            <div>
              <span className="kpi-caption">{institucion.tipo} · {institucion.distrito}</span>
              <h2 style={{ fontSize: '19px', margin: '3px 0 0', color: '#07151a', fontWeight: '800' }}>
                {institucion.nombre}
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar panel"
            style={{
              background: '#f1f5f9',
              border: 0,
              width: '34px',
              height: '34px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Badge de Estado & Selector Rápido */}
          <div style={{ background: '#f8fafc', padding: '16px 20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                ESTADO DEL CONVENIO
              </span>
              <span className={`status-pill ${getStatusClass(estado)}`}>
                <span className="status-dot" />
                {estado === 'ACTIVO' ? 'Convenio Activo' : estado === 'RENOVACION' ? 'En Renovación' : 'Pendiente de Validación'}
              </span>
            </div>

            <div style={{ display: 'flex', gap: '8px', marginTop: '10px' }}>
              {['ACTIVO', 'RENOVACION', 'PENDIENTE'].map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setEstado(st)}
                  style={{
                    flex: 1,
                    padding: '8px 10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    borderRadius: '10px',
                    border: estado === st ? '2px solid #07151a' : '1px solid #cbd5e1',
                    background: estado === st ? '#ffffff' : '#f1f5f9',
                    color: estado === st ? '#07151a' : '#64748b',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {st === 'ACTIVO' ? '✓ Activo' : st === 'RENOVACION' ? '↻ Renovación' : '⏳ Pendiente'}
                </button>
              ))}
            </div>
          </div>

          {/* Ficha Resumen del Convenio */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px', color: '#07151a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Especificaciones de Convenio
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px', background: '#ffffff', border: '1px solid #edf2f7', borderRadius: '16px', padding: '16px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>TÍTULO DE ACUERDO</span>
                <strong style={{ color: '#0f172a' }}>{institucion.convenio}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>VIGENCIA OFICIAL</span>
                <strong style={{ color: '#0f172a' }}>{institucion.vigencia}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>NIVEL EN PROGRAMA</span>
                <strong style={{ color: '#0f172a' }}>{institucion.nivelCultural}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>PATIO / SALA PROPIA</span>
                <strong style={{ color: institucion.patioTeatral ? '#16a34a' : '#64748b' }}>
                  {institucion.patioTeatral ? '✓ Verificado' : '— No dispone'}
                </strong>
              </div>
            </div>
          </div>

          {/* Métricas de Impacto Directo */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', padding: '14px 16px', borderRadius: '14px' }}>
              <span style={{ fontSize: '11px', color: '#166534', fontWeight: 700, textTransform: 'uppercase' }}>ESTUDIANTES ASIGNADOS</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#14532d', marginTop: '4px' }}>
                {institucion.estudiantes}
              </div>
              <span style={{ fontSize: '11px', color: '#16a34a' }}>En temporada teatral 2026</span>
            </div>
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '14px 16px', borderRadius: '14px' }}>
              <span style={{ fontSize: '11px', color: '#075985', fontWeight: 700, textTransform: 'uppercase' }}>DOCENTES CO-CREADORES</span>
              <div style={{ fontSize: '24px', fontWeight: 800, color: '#0c4a6e', marginTop: '4px' }}>
                {institucion.docentes}
              </div>
              <span style={{ fontSize: '11px', color: '#0284c7' }}>Con guías pedagógicas</span>
            </div>
          </div>

          {/* Proyectos Vinculados */}
          {institucion.proyectos && institucion.proyectos.length > 0 && (
            <div>
              <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px', color: '#07151a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Proyectos & Compromisos Institucionales
              </h4>
              <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#334155', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {institucion.proyectos.map((proj, idx) => (
                  <li key={idx}><strong>{proj}</strong></li>
                ))}
              </ul>
            </div>
          )}

          {/* Datos de Contacto y Representante */}
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: 700, margin: '0 0 10px', color: '#07151a', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Representante Legal / Director Responsable
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Nombre y Título
                </label>
                <input
                  type="text"
                  value={nombreDirector}
                  onChange={(e) => setNombreDirector(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#475569', marginBottom: '4px' }}>
                  Correo Electrónico Institucional
                </label>
                <input
                  type="email"
                  value={emailDirector}
                  onChange={(e) => setEmailDirector(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    fontSize: '13px',
                    outline: 'none',
                    background: '#ffffff',
                  }}
                />
              </div>
            </div>
          </div>

          {/* Visto Bueno y Marco de Protección de Datos (Ley N.° 29733) */}
          <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', cursor: 'pointer', fontSize: '12px', color: '#334155' }}>
              <input
                type="checkbox"
                checked={vistoBueno}
                onChange={(e) => setVistoBueno(e.target.checked)}
                style={{ marginTop: '2px', accentColor: '#e63946' }}
              />
              <span>
                <strong>Visto Bueno Formal Registrado:</strong> Se certifica la conformidad del convenio bajo el marco legal de la <strong>Ley N.° 29733 (Protección de Datos Personales de Menores de Edad)</strong> y directivas UGEL Piura.
              </span>
            </label>
          </div>

          {/* Despacho de Credenciales y PDF */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <button
              type="button"
              onClick={handleEnviarCredenciales}
              disabled={credencialesEnviadas}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '12px',
                background: credencialesEnviadas ? '#ecfdf5' : '#07151a',
                color: credencialesEnviadas ? '#065f46' : '#ffffff',
                border: credencialesEnviadas ? '1px solid #a7f3d0' : 0,
                fontSize: '13px',
                fontWeight: 600,
                cursor: credencialesEnviadas ? 'default' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                transition: 'all 0.2s ease',
              }}
            >
              {credencialesEnviadas ? '✓ Credenciales Institucionales Despachadas' : '✉ Despachar Credenciales a Dirección'}
            </button>

            <button
              type="button"
              onClick={handleDescargarConvenio}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '12px',
                background: '#ffffff',
                color: '#07151a',
                border: '1px solid #cbd5e1',
                fontSize: '13px',
                fontWeight: 600,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
              }}
            >
              {pdfDescargado ? '✓ Generando Ficha de Convenio (PDF)...' : '📄 Descargar Convenio Marco (PDF)'}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '12px',
              border: '1px solid #cbd5e1',
              background: '#ffffff',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
              color: '#475569',
            }}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleGuardar}
            disabled={guardando}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: 0,
              background: '#e63946',
              color: '#ffffff',
              fontSize: '13px',
              fontWeight: 700,
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(230, 57, 70, 0.3)',
            }}
          >
            {guardando ? 'Guardando Cambios...' : 'Guardar y Actualizar'}
          </button>
        </div>
      </div>
    </div>
  )
}
