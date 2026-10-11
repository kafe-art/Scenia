import { Route, Routes } from 'react-router-dom'
import InicioAdmin from './pages/InicioAdmin'
import ModuleNotFound from '../../components/ModuleNotFound'

export default function AdminRoutes() {
  return <div className="actor-admin"><Routes>
    <Route index element={<InicioAdmin />} />
    <Route path="*" element={<ModuleNotFound to="/admin" />} />
  </Routes></div>
}
