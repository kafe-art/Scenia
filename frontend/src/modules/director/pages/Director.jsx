import { useEffect, useState } from 'react'
import { obtenerMetricas } from '../../../services/metricas'
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
import Loading from '../../../components/Loading'
import ErrorMessage from '../../../components/ErrorMessage'

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

  if (cargando) return <Loading mensaje="Cargando métricas institucionales..." />
  if (error) return <ErrorMessage mensaje={error} />
  if (!metricas) return null

  const datosGrafico = [
    {
      categoria: 'Obras Activas',
      total: metricas.total_obras,
    },
    {
      categoria: 'Guías Creadas',
      total: metricas.total_guias,
    },
    {
      categoria: 'Reflexiones',
      total: metricas.total_reflexiones,
    },
  ]

  return (
    <div className="container">
      <h2>Panel del Director</h2>
      <p>Métricas de impacto cultural y pedagógico del colegio.</p>

      <div className="metricas-grid">
        <div className="metrica-card">
          <h3>Total Obras</h3>
          <p className="numero">{metricas.total_obras}</p>
        </div>
        <div className="metrica-card">
          <h3>Guías Pedagógicas</h3>
          <p className="numero">{metricas.total_guias}</p>
        </div>
        <div className="metrica-card">
          <h3>Reflexiones de Estudiantes</h3>
          <p className="numero">{metricas.total_reflexiones}</p>
        </div>
      </div>

      <div className="card grafico-container">
        <h3>Participación General</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={datosGrafico}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="categoria" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="total" fill="#4f46e5" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

export default Director
