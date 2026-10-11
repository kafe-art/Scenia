import { useState } from 'react'

export default function ApprovalCard({ decision, onAccion }) {
  const [modalAbierto, setModalAbierto] = useState(false)
  const [tipoAccion, setTipoAccion] = useState(null)
  const [pin, setPin] = useState('')
  const [comentario, setComentario] = useState('')
  const [procesando, setProcesando] = useState(false)

  const handleAbrirModal = (tipo) => {
    setTipoAccion(tipo)
    setModalAbierto(true)
  }

  const handleConfirmar = (e) => {
    e.preventDefault()
    setProcesando(true)
    setTimeout(() => {
      onAccion(decision.id, tipoAccion, comentario)
      setProcesando(false)
      setModalAbierto(false)
      setPin('')
      setComentario('')
    }, 600)
  }

  const getUrgencyBadge = (urg) => {
    if (urg === 'Crítica') return { bg: '#fee2e2', color: '#991b1b' }
    if (urg === 'Alta') return { bg: '#fef3c7', color: '#92400e' }
    return { bg: '#e0f2fe', color: '#0369a1' }
  }

  const badgeStyle = getUrgencyBadge(decision.urgencia)

  return (
    <>
      <div className="decision-card">
        <div style={{ flex: '1', minWidth: '280px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <span
              style={{
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '999px',
                background: badgeStyle.bg,
                color: badgeStyle.color,
                textTransform: 'uppercase',
              }}
            >
              Urgencia {decision.urgencia}
            </span>
            <span style={{ fontSize: '12px', color: '#64748b' }}>
              {decision.tipo} · {decision.fecha}
            </span>
          </div>

          <h4 style={{ fontSize: '16px', fontWeight: 700, margin: '2px 0 6px', color: '#0f172a' }}>
            {decision.titulo}
          </h4>

          <p style={{ fontSize: '13px', color: '#475569', margin: '0 0 10px', lineHeight: 1.4 }}>
            {decision.detalle}
          </p>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', fontSize: '12px', color: '#64748b' }}>
            <span>👤 <strong>Solicitante:</strong> {decision.solicitante}</span>
            <span>📄 <strong>Adjunto:</strong> <em>{decision.documentoAdjunto}</em></span>
          </div>
        </div>

        {/* Acciones Rápidas */}
        <div className="decision-actions">
          {decision.estado === 'PENDIENTE' ? (
            <>
              <button
                type="button"
                className="btn-approve"
                onClick={() => handleAbrirModal('APROBAR')}
              >
                ✓ Aprobar con Firma
              </button>
              <button
                type="button"
                className="btn-review"
                onClick={() => handleAbrirModal('REVISION')}
              >
                Solicitar Revisión
              </button>
              <button
                type="button"
                className="btn-reject"
                onClick={() => handleAbrirModal('RECHAZAR')}
              >
                Rechazar
              </button>
            </>
          ) : (
            <div
              style={{
                padding: '8px 16px',
                borderRadius: '12px',
                background: decision.estado === 'APROBADO' ? '#dcfce7' : '#fee2e2',
                color: decision.estado === 'APROBADO' ? '#166534' : '#991b1b',
                fontWeight: 700,
                fontSize: '13px',
              }}
            >
              {decision.estado === 'APROBADO' ? '✓ Aprobado Formalmente' : '✕ ' + decision.estado}
            </div>
          )}
        </div>
      </div>

      {/* Modal Fluido de Confirmación & Firma Digital */}
      {modalAbierto && (
        <div
          className="drawer-backdrop"
          onClick={() => setModalAbierto(false)}
          style={{ backdropFilter: 'blur(8px)', zIndex: 9999 }}
        >
          <div
            style={{
              background: '#ffffff',
              borderRadius: '24px',
              padding: '32px',
              maxWidth: '500px',
              width: '90%',
              margin: 'auto',
              boxShadow: '0 25px 60px rgba(15, 23, 42, 0.35)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: 700, color: '#2563eb', textTransform: 'uppercase' }}>
                  DECISIÓN EJECUTIVA DE LA DIRECCIÓN
                </span>
                <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: '#0f172a' }}>
                  {tipoAccion === 'APROBAR' ? 'Confirmar y Firmar Digitalmente' : tipoAccion === 'REVISION' ? 'Solicitar Observaciones' : 'Rechazar Solicitud'}
                </h3>
              </div>
              <button
                onClick={() => setModalAbierto(false)}
                style={{ background: '#f1f5f9', border: 0, width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '16px' }}>
              <strong>Documento:</strong> {decision.titulo}
            </p>

            <form onSubmit={handleConfirmar} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {tipoAccion === 'APROBAR' ? (
                <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '6px' }}>
                    PIN de Confirmación Directiva (Seguridad Rápida)
                  </label>
                  <input
                    type="password"
                    maxLength={4}
                    placeholder="•••• (ej. 2026)"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '10px',
                      border: '1px solid #cbd5e1',
                      fontSize: '16px',
                      letterSpacing: '0.2em',
                      textAlign: 'center',
                      outline: 'none',
                    }}
                  />
                  <span style={{ fontSize: '11px', color: '#64748b', display: 'block', marginTop: '6px' }}>
                    Esta acción estampa la firma digital institucional del Mg. Carlos Alberto Ramos.
                  </span>
                </div>
              ) : (
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                    Motivo u Observación para la Coordinación
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Indica qué puntos deben subsanarse..."
                    value={comentario}
                    onChange={(e) => setComentario(e.target.value)}
                    required
                    style={{ width: '100%', padding: '10px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                  />
                </div>
              )}

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setModalAbierto(false)}
                  style={{ padding: '9px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer' }}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={procesando}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '10px',
                    border: 0,
                    background: tipoAccion === 'APROBAR' ? '#059669' : tipoAccion === 'REVISION' ? '#0f172a' : '#b91c1c',
                    color: '#fff',
                    fontWeight: 700,
                    cursor: 'pointer',
                  }}
                >
                  {procesando ? 'Procesando...' : tipoAccion === 'APROBAR' ? 'Aprobar y Visar' : 'Confirmar Acción'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}
