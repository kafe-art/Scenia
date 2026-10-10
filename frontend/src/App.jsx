import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Docente from './pages/Docente'
import Estudiante from './pages/Estudiante'
import Director from './pages/Director'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav className="navbar">
        <h1 className="logo">CulturaMétrica</h1>
        <div className="nav-links">
          <NavLink to="/" end>
            Docente
          </NavLink>
          <NavLink to="/estudiante">Estudiante</NavLink>
          <NavLink to="/director">Director</NavLink>
        </div>
      </nav>

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Docente />} />
          <Route path="/estudiante" element={<Estudiante />} />
          <Route path="/director" element={<Director />} />
        </Routes>
      </main>
    </BrowserRouter>
  )
}

export default App
