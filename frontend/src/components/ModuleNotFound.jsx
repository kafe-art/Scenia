import { Link } from 'react-router-dom'

export default function ModuleNotFound({ to }) {
  return <section className="empty-state"><h1>Página no encontrada</h1><p>Esta dirección todavía no tiene una pantalla disponible.</p><Link className="btn" to={to}>Volver a mi espacio</Link></section>
}
