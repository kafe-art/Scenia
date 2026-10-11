import { Route, Routes } from 'react-router-dom'
import Docente from './pages/Docente'
import InicioDocente, { DetalleClase } from './pages/InicioDocente'
import ModuleNotFound from '../../components/ModuleNotFound'

// Rutas relativas a /docente. Añadir aquí las nuevas pantallas del actor.
export default function DocenteRoutes() {
  return (
    <div className="actor-docente">
      <Routes>
        <Route index element={<InicioDocente />} />
        <Route path="clases" element={<InicioDocente allClasses />} />
        <Route path="clases/:id" element={<DetalleClase />} />
        <Route path="guias/nueva" element={<Docente />} />
        {/* Agrega aquí nuevas subrutas de docente */}
        <Route path="*" element={<ModuleNotFound to="/docente" />} />
      </Routes>
    </div>
  )
}
