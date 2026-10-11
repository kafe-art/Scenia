import { Route, Routes } from 'react-router-dom'
import Estudiante from './pages/Estudiante'
import ModuleNotFound from '../../components/ModuleNotFound'

export default function EstudianteRoutes() {
  return (
    <div className="actor-estudiante">
      <Routes>
        <Route index element={<Estudiante />} />
        {/* Agrega aquí las subrutas del estudiante (ej: perfil, actividades, etc.) */}
        <Route path="*" element={<ModuleNotFound to="/estudiante" />} />
      </Routes>
    </div>
  )
}
