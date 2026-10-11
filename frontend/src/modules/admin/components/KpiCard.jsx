import { motion } from 'framer-motion'

export default function KpiCard({
  caption,
  value,
  target,
  badgeText,
  badgeType = 'meta', // 'meta', 'up', 'warn'
  iconText = '★',
  colorScheme = 'crimson', // 'crimson', 'teal', 'amber', 'blue'
  progressPercentage,
  progressColor = '#e63946',
}) {
  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="kpi-card"
    >
      <div>
        <div className="kpi-header">
          <span className="kpi-caption">{caption}</span>
          <div className={`kpi-icon ${colorScheme}`}>{iconText}</div>
        </div>

        <div className="kpi-value-row">
          <span className="kpi-value">{value}</span>
          {target && <span className="kpi-target">{target}</span>}
        </div>

        {badgeText && (
          <span className={`kpi-badge ${badgeType}`}>
            {badgeText}
          </span>
        )}
      </div>

      {typeof progressPercentage === 'number' && (
        <div className="kpi-progress" title={`${progressPercentage}% completado`}>
          <div
            className="kpi-progress-bar"
            style={{
              width: `${Math.min(100, Math.max(0, progressPercentage))}%`,
              background: progressColor,
            }}
          />
        </div>
      )}
    </motion.div>
  )
}
