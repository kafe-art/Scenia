import { Route, Routes } from 'react-router-dom'
import PanelColegio from './pages/PanelColegio'
import InicioAdmin from './pages/InicioAdmin'
import ModuleNotFound from '../../components/ModuleNotFound'

export default function AdminRoutes() {
  return (
    <div className="actor-admin">
      <Routes>
        {/* Vista principal institucional del colegio (Capturas 13 y 14) */}
        <Route index element={<PanelColegio />} />
        <Route path="panel" element={<PanelColegio />} />

        {/* Vistas de administración detallada y auditoría */}
        <Route path="instituciones" element={<InicioAdmin initialTab="instituciones" />} />
        <Route path="usuarios" element={<InicioAdmin initialTab="usuarios" />} />
        <Route path="metricas" element={<InicioAdmin initialTab="metricas" />} />
        <Route path="configuracion" element={<InicioAdmin initialTab="configuracion" />} />
        <Route path="auditoria" element={<InicioAdmin initialTab="auditoria" />} />

        {/* Alias de compatibilidad */}
        <Route path="colegios" element={<InicioAdmin initialTab="instituciones" />} />
        <Route path="cartelera" element={<InicioAdmin initialTab="auditoria" />} />
        <Route path="alianzas" element={<InicioAdmin initialTab="configuracion" />} />
        <Route path="programa" element={<PanelColegio />} />
        <Route path="perfil" element={<PanelColegio />} />
        <Route path="*" element={<ModuleNotFound to="/admin" />} />
      </Routes>
    </div>
  )
}
