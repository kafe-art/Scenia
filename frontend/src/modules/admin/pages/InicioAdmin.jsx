import { Link } from 'react-router-dom'
import { PageHeading, Icon } from '../../../components/SceniaUI'

export default function InicioAdmin() {
  return <>
    <PageHeading eyebrow="CLUB DE ARTE Y CULTURA" title="El inicio de muchas historias.">Espacio de trabajo del Coordinador del Club.</PageHeading>
    <p className="inline-message">Módulo en preparación. La prospección, la activación institucional y los indicadores se conectarán a Supabase. Esta vista no activa colegios ni envía credenciales.</p>
    <section className="surface program-info">
      <span className="eyebrow">INCORPORACIÓN DE COLEGIOS</span>
      <h2>Una ruta acompañada desde el primer contacto.</h2>
      <ol className="activity-steps">
        <li><strong>Recomendación UGEL</strong> Registrar los colegios prefiltrados por espacios y horarios.</li>
        <li><strong>Coordinación</strong> Documentar el contacto con el Director escolar.</li>
        <li><strong>OK institucional</strong> Registrar la aprobación formal antes de activar la institución.</li>
        <li><strong>Activación y acceso</strong> Habilitar la cuenta del Director y la carga de docentes.</li>
      </ol>
      <Link className="btn" to="/cartelera">Explorar cartelera pública <Icon name="arrow" /></Link>
    </section>
  </>
}
