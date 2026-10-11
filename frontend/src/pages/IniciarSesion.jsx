import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Brand, Icon } from '../components/SceniaUI'
import scene from '../assets/escenario.svg'
import { actorModules } from '../modules/registry'

export default function IniciarSesion() {
  const [show, setShow] = useState(false)
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleLogin = (e) => {
    e.preventDefault()
    setError('')
    const id = identifier.trim().toLowerCase()

    if (!id) {
      setError('Por favor, ingresa tu correo, DNI o usuario institucional.')
      return
    }

    // Enrutamiento inteligente según las credenciales del prototipo
    if (id.includes('admin') || id.includes('coordinador')) {
      navigate('/admin')
    } else if (id.includes('director') || id.includes('carlos') || id.includes('ramos')) {
      navigate('/director')
    } else if (id.includes('docente') || id.includes('carla') || id.includes('mendoza') || id.includes('profe')) {
      navigate('/docente')
    } else if (id.includes('estudiante') || id.includes('alumno') || /^\d+$/.test(id)) {
      navigate('/estudiante')
    } else {
      // Si ingresa credenciales no específicas, redirige al portal de estudiante por defecto o muestra ayuda
      navigate('/estudiante')
    }
  }

  return (
    <main className="login-page">
      <section
        className="login-story"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(13,32,38,.92), rgba(13,32,38,.4)), url("${scene}")`,
        }}
      >
        <Brand light />
        <div>
          <span className="eyebrow light">TU CULTURA TAMBIÉN CUENTA</span>
          <h1>
            Una ruta cultural <br />
            para aprender, sentir <br />
            y transformar.
          </h1>
          <p>Conectamos el teatro, la escuela y la experiencia de cada estudiante.</p>
        </div>
        <small>Club de Arte y Cultura de Piura</small>
      </section>

      <section className="login-panel">
        <div className="login-inner">
          <Link className="back-link" to="/">
            ← Volver al inicio
          </Link>
          <span className="eyebrow">BIENVENIDO A SCENIA</span>
          <h2>
            Tu próxima historia
            <br />
            empieza aquí.
          </h2>
          <p>Usa las credenciales entregadas por tu institución o elige un perfil demo.</p>

          <form className="login-form" onSubmit={handleLogin}>
            <label htmlFor="identifier">Correo, usuario o DNI</label>
            <input
              id="identifier"
              name="username"
              autoComplete="username"
              required
              placeholder="Ej: director@scenia.pe, docente, admin..."
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />

            <label htmlFor="password">Contraseña</label>
            <div className="password-field">
              <input
                id="password"
                name="password"
                type={show ? 'text' : 'password'}
                autoComplete="current-password"
                required
                placeholder="Ingresa tu contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                aria-pressed={show}
              >
                <Icon name="eye" />
              </button>
            </div>

            <button className="btn" type="submit">
              Entrar <Icon />
            </button>
            {error && (
              <p className="inline-message" role="alert">
                {error}
              </p>
            )}
          </form>

          <div className="demo-access">
            <span className="eyebrow">ACCESO RÁPIDO POR ACTOR (PROTOTIPO)</span>
            <p>Selecciona tu rol para explorar directamente su centro de mando:</p>
            <div className="button-row" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {actorModules.map(({ label, prefix: path }) => (
                <button
                  key={path}
                  type="button"
                  className="chip"
                  onClick={() => navigate(path)}
                  style={{
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  {label} <Icon size={14} />
                </button>
              ))}
            </div>
          </div>

          <p className="login-help">
            El acceso de tu colegio se habilita después de la aprobación formal del Director.
          </p>
        </div>
      </section>
    </main>
  )
}
