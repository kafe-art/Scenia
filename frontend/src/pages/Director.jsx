import { useEffect, useState } from 'react'
import { obtenerMetricas } from '../services/metricas'
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
import Loading from '../components/Loading'
import ErrorMessage from '../components/ErrorMessage'

function Director() {
  const [metricas, setMetricas] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    obtenerMetricas()
      .then((data) => setMetricas(data))
      .catch((err) => setError(err.message))
      .finally(() => setCargando(false))
  }, [])

  if (cargando) return <Loading mensaje="Cargando métricas..." />
  if (error) return <ErrorMessage mensaje={error} />
  if (!metricas) return null

  const datosBarras =
    metricas.indicadores?.map((ind) => ({
      nombre: ind.nombre,
      Inicial: ind.inicial,
      'En desarrollo': ind.en_desarrollo,
      Evidenciado: ind.evidenciado,
    })) || []

  return (
    <div className="page">
      <h2>Dashboard Director</h2>
      {metricas.demo && (
        <p className="demo-badge">⚠️ Datos de demostración</p>
      )}

      <div className="stats-grid">
        <div className="stat-card">
          <h3>{metricas.total_actividades}</h3>
          <p>Actividades</p>
        </div>
        <div className="stat-card">
          <h3>{metricas.total_reflexiones}</h3>
          <p>Reflexiones</p>
        </div>
      </div>

      <div className="chart-container">
        <h3>Indicadores por nivel</h3>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={datosBarras}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="nombre" tick={{ fontSize: 12 }} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Inicial" fill="#ef4444" />
            <Bar dataKey="En desarrollo" fill="#f59e0b" />
            <Bar dataKey="Evidenciado" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Director

