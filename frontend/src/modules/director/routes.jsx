import { Route, Routes } from 'react-router-dom'
import Director from './pages/Director'
import ModuleNotFound from '../../components/ModuleNotFound'

export default function DirectorRoutes() {
  return (
    <div className="actor-director">
      <Routes>
        <Route index element={<Director initialTab="institucion" />} />
        <Route path="docentes" element={<Director initialTab="docentes" />} />
        <Route path="*" element={<ModuleNotFound to="/director" />} />
      </Routes>
    </div>
  )
}
