import { Route, Routes } from 'react-router-dom'
import Docente from './pages/Docente'
import InicioDocente from './pages/InicioDocente'
import DetalleClase from './pages/DetalleClase'
import CarteleraDocente from './pages/CarteleraDocente'
import ProgramaDocente from './pages/ProgramaDocente'
import PerfilDocente from './pages/PerfilDocente'
import ModuleNotFound from '../../components/ModuleNotFound'
import './docente.css'

// Rutas relativas a /docente
export default function DocenteRoutes() {
  return (
    <div className="actor-docente">
      <Routes>
        <Route index element={<InicioDocente />} />
        <Route path="clases" element={<InicioDocente allClasses />} />
        <Route path="clases/:id" element={<DetalleClase />} />
        <Route path="clases/:id/kit" element={<DetalleClase defaultTab="kit" />} />
        <Route path="cartelera" element={<CarteleraDocente />} />
        <Route path="programa" element={<ProgramaDocente />} />
        <Route path="perfil" element={<PerfilDocente />} />
        <Route path="guias/nueva" element={<Docente />} />
        <Route path="*" element={<ModuleNotFound to="/docente" />} />
      </Routes>
    </div>
  )
}
