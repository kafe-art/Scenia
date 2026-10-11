export default function ExecutiveKpiCard({ kpi }) {
  const maxSpark = Math.max(...kpi.sparkline)
  const minSpark = Math.min(...kpi.sparkline)
  const range = maxSpark - minSpark || 1

  return (
    <div
      className="exec-kpi-card"
      style={{ borderTop: `4px solid ${kpi.color}` }}
    >
      <div
        className="exec-kpi-card-glow"
        style={{ background: kpi.color }}
      />

      <div>
        <div className="exec-kpi-header">
          <span className="exec-kpi-title">{kpi.titulo}</span>
          <span
            style={{
              fontSize: '11px',
              fontWeight: 700,
              padding: '2px 8px',
              borderRadius: '999px',
              background: `${kpi.color}18`,
              color: kpi.color,
            }}
          >
            {kpi.tendencia}
          </span>
        </div>

        <div className="exec-kpi-value-row">
          <span className="exec-kpi-value">{kpi.valor}</span>
          <span className="exec-kpi-meta">{kpi.meta}</span>
        </div>

        <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0' }}>
          {kpi.descripcion}
        </p>
      </div>

      {/* Sparkline Reactivo */}
      <div>
        <div className="exec-sparkline-box">
          {kpi.sparkline.map((val, idx) => {
            const pct = Math.max(15, ((val - minSpark) / range) * 100)
            return (
              <div
                key={idx}
                className="spark-bar"
                style={{
                  height: `${pct}%`,
                  background: idx === kpi.sparkline.length - 1 ? kpi.color : `${kpi.color}50`,
                }}
                title={`Valor: ${val}`}
              />
            )
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '10px', color: '#94a3b8', fontWeight: 600 }}>
          <span>Inicio Semestre</span>
          <span>Actual</span>
        </div>
      </div>
    </div>
  )
}
