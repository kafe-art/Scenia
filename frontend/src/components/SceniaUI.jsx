import { Link } from 'react-router-dom'

const paths = {
  arrow: 'M5 12h14m-6-6 6 6-6 6', home: 'm3 10 9-7 9 7v10H3V10m6 10v-7h6v7',
  book: 'M12 5c-3-2-7-2-9-1v15c3-1 6-1 9 1 3-2 6-2 9-1V4c-2-1-6-1-9 1v15',
  spark: 'm12 3 2.5 6.5L21 12l-6.5 2.5L12 21l-2.5-6.5L3 12l6.5-2.5L12 3',
  search: 'M10 3a7 7 0 1 0 0 14 7 7 0 0 0 0-14m5 12 6 6',
  users: 'M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8M2 21v-3a7 7 0 0 1 14 0v3m1-17a4 4 0 0 1 0 8m2 3c2 1 3 3 3 6',
  calendar: 'M4 5h16v16H4V5m4-3v6m8-6v6M4 11h16',
  mic: 'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0V5M5 10v2a7 7 0 0 0 14 0v-2m-7 9v3m-4 0h8',
  chart: 'M4 3v18h17M8 16v-4m5 4V7m5 9V4',
  ticket: 'M3 5h18v5a2 2 0 0 0 0 4v5H3v-5a2 2 0 0 0 0-4V5m12 0v3m0 3v2m0 3v3',
  logout: 'M9 4H3v16h6m-1-8h13m-5-5 5 5-5 5',
  menu: 'M4 6h16M4 12h16M4 18h16', close: 'm5 5 14 14M5 19 19 5',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12m10-3a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
  plus: 'M12 4v16M4 12h16', check: 'm5 12 4 4L19 6', clock: 'M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18m0 4v5l3 2',
  building: 'M3 21h18M5 21V7l8-4v18M13 7l6 3v11M9 9v1m0 4v1m0 4v1m8-7v1m0 4v1',
  shield: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm7.4-2.8.1-1.6-1.4-.8a1 1 0 0 0-.5-1.2l.7-1.7a1 1 0 0 0-1.1-.6l-1.6.4-1.2-1.1.2-1.6a1 1 0 0 0-.9-1.1l-1.8-.2a1 1 0 0 0-1.1.8l-.5 1.5-1.6.1-.9-1.3a1 1 0 0 0-1.2-.5l-1.7.7a1 1 0 0 0-.6 1.1l.4 1.6-1.1 1.2-1.6-.2a1 1 0 0 0-1.1.9l-.2 1.8a1 1 0 0 0 .8 1.1l1.5.5.1 1.6-1.3.9a1 1 0 0 0-.5 1.2l.7 1.7a1 1 0 0 0 1.1.6l1.6-.4 1.2 1.1-.2 1.6a1 1 0 0 0 .9 1.1l1.8.2a1 1 0 0 0 1.1-.8l.5-1.5 1.6-.1.9 1.3a1 1 0 0 0 1.2.5l1.7-.7a1 1 0 0 0 .6-1.1l-.4-1.6 1.1-1.2 1.6.2a1 1 0 0 0 1.1-.9l.2-1.8a1 1 0 0 0-.8-1.1z',
}
export function Icon({ name = 'arrow', size = 20 }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={paths[name] || paths.arrow} /></svg>
}
export function Brand({ light = false }) {
  return <Link className={`brand ${light ? 'brand-light' : ''}`} to="/" aria-label="Scenia, inicio"><span className="brand-mark" aria-hidden="true">◩</span><span>scenia<span className="brand-dot">.</span><small>ARTE · ESCUELA · CULTURA</small></span></Link>
}
export function PageHeading({ eyebrow, title, children, action }) {
  return <div className="page-heading"><div><span className="eyebrow">{eyebrow}</span><h1>{title}</h1>{children && <p>{children}</p>}</div>{action}</div>
}
export function EmptyState({ title, children }) {
  return <div className="empty-state"><Icon name="book" size={32}/><h3>{title}</h3><p>{children}</p></div>
}
