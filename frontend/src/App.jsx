import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import Docente from './pages/Docente'
import Estudiante from './pages/Estudiante'
const Director = lazy(() => import('./pages/Director'))
import './App.css'
import './styles/scenia.css'
import Inicio from './pages/Inicio'
import IniciarSesion from './pages/IniciarSesion'
import InicioDocente, { DetalleClase } from './pages/InicioDocente'
import Cartelera, { DetalleObra, Programa } from './pages/Cartelera'
import AppShell from './components/AppShell'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/ingresar" element={<IniciarSesion />} />
          <Route path="/cartelera" element={<Cartelera />} />
          <Route path="/cartelera/:id" element={<DetalleObra />} />
          <Route path="/programa" element={<Programa />} />
          <Route element={<AppShell />}>
            <Route path="/docente" element={<InicioDocente />} />
            <Route path="/docente/clases" element={<InicioDocente allClasses />} />
            <Route path="/docente/clases/:id" element={<DetalleClase />} />
            <Route path="/docente/guias/nueva" element={<Docente />} />
            <Route path="/estudiante" element={<Estudiante />} />
            <Route path="/director" element={<Suspense fallback={<p role="status">Cargando el panel institucional…</p>}><Director /></Suspense>} />
          </Route>
          <Route path="*" element={<div className="empty-state"><h1>Esta página no está en escena.</h1><Link className="btn" to="/">Volver al inicio</Link></div>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
