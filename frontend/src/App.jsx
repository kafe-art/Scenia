import { useEffect, lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom'
import './App.css'
import './styles/scenia.css'
import Inicio from './pages/Inicio'
import IniciarSesion from './pages/IniciarSesion'
import Cartelera, { DetalleObra, Programa } from './pages/Cartelera'
import AppShell from './components/AppShell'

const DocenteRoutes = lazy(() => import('./modules/docente/routes'))
const EstudianteRoutes = lazy(() => import('./modules/estudiante/routes'))
const DirectorRoutes = lazy(() => import('./modules/director/routes'))
const AdminRoutes = lazy(() => import('./modules/admin/routes'))

function ActorModule({ children }) {
  return <Suspense fallback={<p role="status">Cargando tu espacio…</p>}>{children}</Suspense>
}

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
            <Route path="/docente/*" element={<ActorModule><DocenteRoutes /></ActorModule>} />
            <Route path="/estudiante/*" element={<ActorModule><EstudianteRoutes /></ActorModule>} />
            <Route path="/director/*" element={<ActorModule><DirectorRoutes /></ActorModule>} />
            <Route path="/admin/*" element={<ActorModule><AdminRoutes /></ActorModule>} />
          </Route>
          <Route path="*" element={<div className="empty-state"><h1>Esta página no está en escena.</h1><Link className="btn" to="/">Volver al inicio</Link></div>} />
        </Routes>
    </BrowserRouter>
  )
}

export default App
