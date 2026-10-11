import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand, Icon } from '../components/SceniaUI'
import scene from '../assets/escenario.svg'

export default function IniciarSesion() {
  const [show, setShow] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  return <main className="login-page"><section className="login-story" style={{backgroundImage:`linear-gradient(0deg,rgba(13,32,38,.92),rgba(13,32,38,.4)),url("${scene}")`}}><Brand light/><div><span className="eyebrow light">TU CULTURA TAMBIÉN CUENTA</span><h1>Una ruta cultural <br/>para aprender, sentir <br/>y transformar.</h1><p>Conectamos el teatro, la escuela y la experiencia de cada estudiante.</p></div><small>Club de Arte y Cultura de Piura</small></section><section className="login-panel"><div className="login-inner"><Link className="back-link" to="/">← Volver al inicio</Link><span className="eyebrow">BIENVENIDO A SCENIA</span><h2>Tu próxima historia<br/>empieza aquí.</h2><p>Usa las credenciales entregadas por tu institución.</p><form className="login-form" onSubmit={e=>{e.preventDefault();setError('El acceso institucional todavía no está conectado. Puedes explorar las vistas de demostración de abajo.')}}><label htmlFor="identifier">Correo o DNI</label><input id="identifier" name="username" autoComplete="username" required placeholder="Tu correo o documento de identidad"/><label htmlFor="password">Contraseña</label><div className="password-field"><input id="password" name="password" type={show?'text':'password'} autoComplete="current-password" required placeholder="Ingresa tu contraseña"/><button type="button" onClick={()=>setShow(!show)} aria-label={show?'Ocultar contraseña':'Mostrar contraseña'} aria-pressed={show}><Icon name="eye"/></button></div><button className="btn" type="submit">Entrar <Icon/></button>{error&&<p className="inline-message" role="alert">{error}</p>}</form><div className="demo-access"><span className="eyebrow">EXPLORA EL PROTOTIPO</span><p>Accesos de demostración, sin autenticación ni datos institucionales reales.</p><div className="button-row">{[['Docente','/docente'],['Estudiante','/estudiante'],['Director','/director']].map(([label,path])=><button key={path} className="chip" onClick={()=>navigate(path)}>{label} <Icon size={14}/></button>)}</div></div><p className="login-help">El acceso de tu colegio se habilita después de la aprobación formal del Director.</p></div></section></main>
}


