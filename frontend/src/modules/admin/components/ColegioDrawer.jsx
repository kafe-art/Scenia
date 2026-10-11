import { useState } from 'react'

export default function ColegioDrawer({ colegio, isOpen, onClose, onActivate }) {
  const [directorAprobado, setDirectorAprobado] = useState(
    colegio?.directorAprobado || false
  )
  const [contactoDirector, setContactoDirector] = useState(
    colegio?.director || ''
  )
  const [correoDirector, setCorreoDirector] = useState(
    colegio?.email || ''
  )
  const [activando, setActivando] = useState(false)

  if (!isOpen || !colegio) return null

  const handleActivar = () => {
    if (!directorAprobado) {
      alert('Debes registrar el visto bueno de la Dirección antes de activar.')
      return
    }
    setActivando(true)
    setTimeout(() => {
      onActivate({
        ...colegio,
        director: contactoDirector,
        email: correoDirector,
        directorAprobado: true,
        estado: 'ACTIVADO',
      })
      setActivando(false)
      onClose()
    }, 600)
  }

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <div className="drawer-panel" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="drawer-header">
          <div>
            <span className="kpi-caption">CU-ADM-01 · Validación UGEL</span>
            <h2 style={{ fontSize: '20px', margin: '4px 0 0', color: '#07151a' }}>
              {colegio.nombre}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              background: '#f1f5f9',
              border: 0,
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="drawer-body">
          {/* Ficha técnica */}
          <div style={{ background: '#f8fafc', padding: '18px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '13px' }}>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>DISTRITO</span>
                <strong>{colegio.distrito}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>CÓDIGO MODULAR</span>
                <strong>{colegio.codigoModular || '0492811'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>TURNO</span>
                <strong>{colegio.turno || 'Mañana y Tarde'}</strong>
              </div>
              <div>
                <span style={{ color: '#64748b', display: 'block', fontSize: '11px', fontWeight: 600 }}>ESTADO ACTUAL</span>
                <span className={`status-pill ${colegio.estado.toLowerCase()}`}>
                  <span className="status-dot" />
                  {colegio.estado}
                </span>
              </div>
            </div>
          </div>

          {/* Criterios de Espacio y Horario (Filtro UGEL) */}
          <div>
            <h4 style={{ fontSize: '14px', margin: '0 0 10px', color: '#07151a' }}>
              Criterios de Espacio Físico y Horario (Filtro UGEL)
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px', color: '#334155' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#16a34a' }}>✓</span> Cuenta con patio/auditorio para dinámicas teatrales vivenciales.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ color: '#16a34a' }}>✓</span> Disponibilidad para salidas escolares en jornada regular.
              </div>
            </div>
          </div>

          {/* Datos del Director */}
          <div>
            <h4 style={{ fontSize: '14px', margin: '0 0 10px', color: '#07151a' }}>
              Contacto de la Dirección Escolar
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  Nombre del Director(a)
                </label>
                <input
                  type="text"
                  value={contactoDirector}
                  onChange={(e) => setContactoDirector(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                  Correo Institucional del Director(a)
                </label>
                <input
                  type="email"
                  value={correoDirector}
                  onChange={(e) => setCorreoDirector(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                />
              </div>
            </div>
          </div>

          {/* Switch Visto Bueno Formal */}
          <label className="switch-label">
            <input
              type="checkbox"
              className="switch-input"
              checked={directorAprobado}
              onChange={(e) => setDirectorAprobado(e.target.checked)}
            />
            <span>
              Aprobación de Dirección Confirmada (Visto Bueno Formal)
              <small style={{ display: 'block', color: '#64748b', fontWeight: 'normal', fontSize: '12px' }}>
                Constancia de visto bueno y compromiso de enrolar a los docentes de secundaria.
              </small>
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="drawer-footer">
          <button
            onClick={onClose}
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              background: '#ffffff',
              border: '1px solid #cbd5e1',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
          <button
            onClick={handleActivar}
            disabled={!directorAprobado || activando}
            style={{
              padding: '10px 22px',
              borderRadius: '999px',
              background: directorAprobado ? '#e63946' : '#94a3b8',
              color: '#ffffff',
              border: 0,
              fontSize: '13px',
              fontWeight: 700,
              cursor: directorAprobado ? 'pointer' : 'not-allowed',
              boxShadow: directorAprobado ? '0 4px 14px rgba(230, 57, 70, 0.35)' : 'none',
              transition: 'all 0.2s',
            }}
          >
            {activando ? 'Despachando accesos...' : 'Habilitar y Despachar Credenciales'}
          </button>
        </div>
      </div>
    </div>
  )
}
