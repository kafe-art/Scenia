import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'

const dataWleis = [
  { dimension: 'Autoconocimiento', preTest: 3.1, postTest: 4.3, delta: '+1.2' },
  { dimension: 'Autocontrol', preTest: 2.9, postTest: 4.0, delta: '+1.1' },
  { dimension: 'Automotivación', preTest: 3.4, postTest: 4.6, delta: '+1.2' },
  { dimension: 'Empatía', preTest: 3.0, postTest: 4.5, delta: '+1.5' },
]

export default function WleisChart() {
  return (
    <div style={{ width: '100%', height: 310 }}>
      <ResponsiveContainer>
        <BarChart
          data={dataWleis}
          margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
          <XAxis
            dataKey="dimension"
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <YAxis
            domain={[0, 5]}
            ticks={[1, 2, 3, 4, 5]}
            tick={{ fill: '#64748b', fontSize: 12 }}
            axisLine={{ stroke: '#e2e8f0' }}
          />
          <Tooltip
            contentStyle={{
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              boxShadow: '0 8px 24px rgba(0,0,0,0.08)',
              fontSize: '12px',
            }}
          />
          <Legend
            verticalAlign="top"
            align="right"
            wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
          />
          <Bar
            dataKey="preTest"
            name="Línea Base (Pre-test)"
            fill="#94a3b8"
            radius={[6, 6, 0, 0]}
          />
          <Bar
            dataKey="postTest"
            name="Crecimiento Post-test (Δ WLEIS)"
            fill="#e63946"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
