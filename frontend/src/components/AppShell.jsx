import { useState } from 'react'
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Brand, Icon } from './SceniaUI'
import { getActorModule } from '../modules/registry'

export default function AppShell() {
  const [menu,setMenu]=useState(false)
  const [query,setQuery]=useState('')
  const location=useLocation()
  const navigate=useNavigate()
  const actor = getActorModule(location.pathname)
  const role = actor.label
  const links = actor.navigation
  return <div className="workspace"><a className="skip-link" href="#workspace-main">Saltar al contenido</a><aside className={`sidebar ${menu?'is-open':''}`}><Brand light/><span className="sidebar-caption">MI ESPACIO CULTURAL</span><nav aria-label="Menú principal">{links.map(([to,label,icon])=><NavLink key={to} to={to} end onClick={()=>setMenu(false)}><Icon name={icon}/>{label}</NavLink>)}</nav><div className="sidebar-bottom"><div className="sidebar-note"><Icon name="spark"/><p>El aprendizaje también<br/>ocurre fuera del aula.</p></div><Link to="/ingresar"><Icon name="logout"/> Cambiar de vista demo</Link></div></aside>{menu&&<button className="menu-backdrop" onClick={()=>setMenu(false)} aria-label="Cerrar menú"/>}<div className="workspace-body"><header className="workspace-header"><button className="icon-button mobile-menu" onClick={()=>setMenu(!menu)} aria-expanded={menu} aria-label="Abrir menú"><Icon name={menu?'close':'menu'}/></button><form className="global-search" onSubmit={e=>{e.preventDefault();navigate(`/cartelera?q=${encodeURIComponent(query)}`);setQuery('')}}><Icon name="search"/><input aria-label="Buscar obras" placeholder="Busca una obra o un tema…" value={query} onChange={e=>setQuery(e.target.value)}/></form><Link className="account-pill" to="/ingresar"><span className="avatar small">{actor.initials}</span><span>{actor.demoName}<small>{role} · Demo</small></span></Link></header><main id="workspace-main" className="workspace-content"><Outlet/></main><footer className="workspace-footer">SCENIA <span>Hecho para aprender, sentir y transformar.</span><span className="demo-label">Prototipo · Datos de ejemplo</span></footer></div></div>
}


