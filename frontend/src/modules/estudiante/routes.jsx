import { Route, Routes } from 'react-router-dom'
import RutaCultural from './pages/RutaCultural'
import DetalleActividad from './pages/DetalleActividad'
import DetalleExperiencia from './pages/DetalleExperiencia'
import MisReflexiones from './pages/MisReflexiones'
import MisLogrosEstudiante from './pages/MisLogrosEstudiante'
import CarteleraEstudiante from './pages/CarteleraEstudiante'
import PerfilEstudiante from './pages/PerfilEstudiante'
import VocesQueTransformanEstudiante from './pages/VocesQueTransformanEstudiante'
import ModuleNotFound from '../../components/ModuleNotFound'
import './estudiante.css'

export default function EstudianteRoutes() {
  return (
    <div className="actor-estudiante">
      <Routes>
        {/* Ruta principal del estudiante (Capturas 1 y 2) */}
        <Route index element={<RutaCultural />} />

        {/* Detalle de actividad con texto, audio, video y preguntas orientadoras (Capturas 3, 4, 5 y 6) */}
        <Route path="actividades/:id" element={<DetalleActividad />} />
        <Route path="actividades" element={<RutaCultural />} />

        {/* Detalle de experiencia en 3 etapas: Antes, Durante, Después (Capturas 7 y 8) */}
        <Route path="experiencias/:id" element={<DetalleExperiencia />} />
        <Route path="experiencias" element={<RutaCultural />} />

        {/* Mis reflexiones y evidencias con filtros y versionado (Captura 12) */}
        <Route path="reflexiones" element={<MisReflexiones />} />

        {/* Mis logros e historial con insignias y registro de visita (Captura 9) */}
        <Route path="logros" element={<MisLogrosEstudiante />} />

        {/* Cartelera escolar con propuesta a docente y cómo asistir (Capturas 10 y 11) */}
        <Route path="cartelera" element={<CarteleraEstudiante />} />

        {/* Perfil del estudiante con consentimiento Ley 29733 */}
        <Route path="perfil" element={<PerfilEstudiante />} />

        {/* Voces que transforman (metodología escolar) */}
        <Route path="voces-que-transforman" element={<VocesQueTransformanEstudiante />} />

        {/* Alias de compatibilidad */}
        <Route path="obras/:id" element={<DetalleExperiencia />} />
        <Route path="obras/:id/reflexion" element={<DetalleActividad />} />
        <Route path="reflexion" element={<MisReflexiones />} />

        <Route path="*" element={<ModuleNotFound to="/estudiante" />} />
      </Routes>
    </div>
  )
}
