import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Brand, Icon } from './SceniaUI'
import { getActorModule } from '../modules/registry'

export default function AppShell() {
  const [menu, setMenu] = useState(false)
  const [query, setQuery] = useState('')
  const location = useLocation()
  const navigate = useNavigate()
  const actor = getActorModule(location.pathname) || {
    id: 'docente',
    label: 'Docente',
    initials: 'CM',
    demoName: 'Carla Mendoza',
    institution: 'I.E. Emblemática San Miguel de Piura',
    navigation: [['/docente', 'Inicio', 'home']],
  }
  const role = actor.label
  const links = actor.navigation || []

  return (
    <div className="workspace">
      <a className="skip-link" href="#workspace-main">Saltar al contenido</a>
      <aside className={`sidebar ${menu ? 'is-open' : ''}`}>
        <Brand light />
        <span className="sidebar-caption">{actor.sidebarCaption || 'MI ESPACIO CULTURAL'}</span>
        <nav aria-label="Menú principal">
          {links.map(([to, label, icon]) => (
            <NavLink key={to} to={to} end onClick={() => setMenu(false)}>
              <Icon name={icon} />
              {label}
            </NavLink>
          ))}
        </nav>

        {actor.sidebarCard && (
          <Link
            to={actor.sidebarCard.to}
            className="sidebar-promoted-card"
            onClick={() => setMenu(false)}
          >
            <div className="sidebar-promoted-head">
              <Icon name={actor.sidebarCard.icon || 'spark'} size={15} />
              <strong>{actor.sidebarCard.title}</strong>
            </div>
            <p>{actor.sidebarCard.description}</p>
          </Link>
        )}

        <div className="sidebar-bottom">
          {actor.bottomLinks ? (
            <div className="sidebar-bottom-links-group">
              {actor.bottomLinks.map(([to, label, icon]) => (
                <Link
                  key={to}
                  to={to}
                  className="sidebar-bottom-nav-link"
                  onClick={() => setMenu(false)}
                >
                  <Icon name={icon} size={15} />
                  <span>{label}</span>
                </Link>
              ))}
            </div>
          ) : (
            <>
              <div className="sidebar-note">
                <Icon name="spark" />
                <p>
                  El aprendizaje también
                  <br />
                  ocurre fuera del aula.
                </p>
              </div>
              <Link to="/ingresar">
                <Icon name="logout" /> Cambiar de vista demo
              </Link>
            </>
          )}
        </div>
      </aside>
      {menu && <button className="menu-backdrop" onClick={() => setMenu(false)} aria-label="Cerrar menú" />}
      <div className="workspace-body">
        <header className="workspace-header">
          <button
            className="icon-button mobile-menu"
            onClick={() => setMenu(!menu)}
            aria-expanded={menu}
            aria-label="Abrir menú"
          >
            <Icon name={menu ? 'close' : 'menu'} />
          </button>

          {actor.institution ? (
            <div className="workspace-header-school">
              <Icon name="menu" size={16} />
              <span className="school-name">{actor.institution}</span>
            </div>
          ) : (
            <form
              className="global-search"
              onSubmit={(e) => {
                e.preventDefault()
                navigate(`/cartelera?q=${encodeURIComponent(query)}`)
                setQuery('')
              }}
            >
              <Icon name="search" />
              <input
                aria-label="Buscar obras"
                placeholder="Busca una obra o un tema…"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </form>
          )}

          {/* Selector de Roles / Actores (Captura 1 y 13) */}
          <div className="hidden sm:flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs font-semibold ml-auto mr-3">
            <NavLink
              to="/estudiante"
              className={() =>
                `px-3 py-1 rounded-lg transition ${
                  location.pathname.startsWith('/estudiante')
                    ? 'bg-white text-slate-900 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Estudiante
            </NavLink>
            <NavLink
              to="/docente"
              className={() =>
                `px-3 py-1 rounded-lg transition ${
                  location.pathname.startsWith('/docente')
                    ? 'bg-white text-slate-900 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Docente
            </NavLink>
            <NavLink
              to="/admin"
              className={() =>
                `px-3 py-1 rounded-lg transition ${
                  location.pathname.startsWith('/admin')
                    ? 'bg-white text-slate-900 font-extrabold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`
              }
            >
              Colegio
            </NavLink>
          </div>

          <Link className="account-pill" to="/ingresar">
            <span className="avatar small">{actor.initials}</span>
            <span className="account-pill-text">
              <strong className="account-pill-name">{actor.demoName}</strong>
              <small className="account-pill-role">{actor.demoSubtitle || role}</small>
            </span>
          </Link>
        </header>
        <main id="workspace-main" className="workspace-content">
          <Outlet />
        </main>
        <footer className="workspace-footer">
          SCENIA <span>Hecho para aprender, sentir y transformar.</span>
          <span className="demo-label">Prototipo · Datos de ejemplo</span>
        </footer>
      </div>
    </div>
  )
}
