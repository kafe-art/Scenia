import { Route, Routes } from 'react-router-dom'
import RutaCultural from './pages/RutaCultural'
import DetalleObraEstudiante from './pages/DetalleObraEstudiante'
import ReflexionTeatral from './pages/ReflexionTeatral'
import MisLogros from './pages/MisLogros'
import ModuleNotFound from '../../components/ModuleNotFound'
import './estudiante.css'

export default function EstudianteRoutes() {
  return (
    <div className="actor-estudiante">
      <Routes>
        <Route index element={<RutaCultural />} />
        <Route path="obras/:id" element={<DetalleObraEstudiante />} />
        <Route path="obras/:id/reflexion" element={<ReflexionTeatral />} />
        <Route path="reflexion" element={<ReflexionTeatral />} />
        <Route path="logros" element={<MisLogros />} />
        <Route path="*" element={<ModuleNotFound to="/estudiante" />} />
      </Routes>
    </div>
  )
}
