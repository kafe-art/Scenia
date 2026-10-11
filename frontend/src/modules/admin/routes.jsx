import { Route, Routes } from 'react-router-dom'
import InicioAdmin from './pages/InicioAdmin'
import ModuleNotFound from '../../components/ModuleNotFound'

export default function AdminRoutes() {
  return (
    <div className="actor-admin">
      <Routes>
        <Route index element={<InicioAdmin initialTab="instituciones" />} />
        <Route path="usuarios" element={<InicioAdmin initialTab="usuarios" />} />
        <Route path="metricas" element={<InicioAdmin initialTab="metricas" />} />
        <Route path="configuracion" element={<InicioAdmin initialTab="configuracion" />} />
        <Route path="auditoria" element={<InicioAdmin initialTab="auditoria" />} />

        {/* Alias de compatibilidad con rutas previas */}
        <Route path="colegios" element={<InicioAdmin initialTab="instituciones" />} />
        <Route path="cartelera" element={<InicioAdmin initialTab="auditoria" />} />
        <Route path="alianzas" element={<InicioAdmin initialTab="configuracion" />} />
        <Route path="*" element={<ModuleNotFound to="/admin" />} />
      </Routes>
    </div>
  )
}
