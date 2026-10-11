import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { Brand, Icon } from '../components/SceniaUI'
import MagneticButton from '../components/MagneticButton'
import StagePortal from '../components/StagePortal'
import TiltCard from '../components/TiltCard'
import { plays } from '../data/demo'
import '../styles/landing-wow.css'

// Variantes de animación para revelado escalonado en el Hero
const heroContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemFadeUp = {
  hidden: { y: 30, opacity: 0, filter: 'blur(6px)' },
  visible: {
    y: 0,
    opacity: 1,
    filter: 'blur(0px)',
    transition: {
      duration: 0.75,
      ease: [0.16, 1, 0.3, 1],
    },
  },
}

export default function Inicio() {
  const [isScrolled, setIsScrolled] = useState(false)
  const prefersReduced = useReducedMotion()

  // Listener para el Header Flotante estilo Glassmorphism
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="landing">
      {/* SECCIÓN OSCURA INMERSIVA: HEADER + HERO */}
      <div className="landing-dark relative overflow-hidden">
        {/* Foco ambiental cenital */}
        <div className="hero-ambient-spotlight" aria-hidden="true" />

        {/* Header Flotante */}
        <header className={`public-header ${isScrolled ? 'is-scrolled' : ''}`}>
          <Brand light />
          <nav aria-label="Navegación pública">
            <Link to="/cartelera">Cartelera</Link>
            <a href="#voces">Voces que Transforman</a>
            <a href="#experiencia">Cómo funciona</a>
            <a href="#aliados">El Club</a>
          </nav>
          <MagneticButton
            href="/ingresar"
            className="btn btn-white !py-2.5 !px-5 shadow-lg"
          >
            <span>Iniciar sesión</span>
            <Icon name="arrow" size={16} />
          </MagneticButton>
        </header>

        {/* HERO SECTION DE ALTO IMPACTO */}
        <section className="hero wrap">
          {/* Columna Izquierda: Tipografía y LLamados a la Acción */}
          <motion.div
            className="hero-copy"
            variants={heroContainerVariants}
            initial={prefersReduced ? 'visible' : 'hidden'}
            animate="visible"
          >
            <motion.div variants={itemFadeUp} className="flex items-center gap-2">
              <span className="eyebrow light flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#E63946] inline-block animate-pulse" />
                EL ESCENARIO TAMBIÉN ES UN AULA
              </span>
            </motion.div>

            <motion.h1 variants={itemFadeUp}>
              El teatro abre <br />
              conversaciones <br />
              que sí <em>transforman.</em>
            </motion.h1>

            <motion.p variants={itemFadeUp}>
              Guías pedagógicas con IA, experiencias en sala y una ruta cultural para cada estudiante y docente de Piura.
            </motion.p>

            <motion.div variants={itemFadeUp} className="button-row">
              <MagneticButton
                href="/cartelera"
                className="btn btn-white shadow-[0_0_25px_rgba(255,255,255,0.2)]"
              >
                <span>Explorar cartelera</span>
                <Icon size={18} />
              </MagneticButton>

              <MagneticButton
                href="#experiencia"
                className="btn btn-outline-light"
              >
                <span>Cómo funciona</span>
              </MagneticButton>
            </motion.div>

            <motion.div variants={itemFadeUp} className="hero-note">
              <span className="small-line" /> Hecho para las escuelas de Piura
            </motion.div>
          </motion.div>

          {/* Columna Derecha: The Living Stage Portal 3D */}
          <motion.div
            initial={prefersReduced ? { opacity: 1 } : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <StagePortal />
          </motion.div>

          {/* Indicador de Desplazamiento */}
          <div className="hero-scroll-indicator" aria-hidden="true">
            <span className="scroll-text">Desliza para entrar</span>
            <div className="scroll-mouse-pill">
              <div className="scroll-wheel-dot" />
            </div>
          </div>
        </section>
      </div>

      {/* CONTENIDO PRINCIPAL DE LA PÁGINA */}
      <main>
        {/* Banner de Acceso Institucional */}
        <div className="access-banner wrap">
          <div>
            <h2>¿Tu colegio ya participa?</h2>
            <p>Continúa tu ruta cultural con las credenciales asignadas a tu institución.</p>
          </div>
          <MagneticButton href="/ingresar" className="btn !bg-[#E63946] !text-white shadow-md">
            <span>Ingresar a Scenia</span>
            <Icon size={18} />
          </MagneticButton>
        </div>

        {/* Sección: Los Tres Momentos Pedagógicos con Tarjetas 3D Tilt */}
        <section className="wrap landing-section" id="experiencia">
          <div className="section-heading">
            <div>
              <span className="eyebrow">MUCHO MÁS QUE UNA FUNCIÓN</span>
              <h2>Una experiencia que se queda contigo.</h2>
            </div>
            <p>
              Antes, durante y después del teatro.<br />
              Cada momento tiene algo que enseñarnos.
            </p>
          </div>

          <div className="steps-grid">
            {[
              [
                '01',
                'Prepara la experiencia',
                'Guías con IA que conectan la obra con tu clase, editables y listas para hacerlas tuyas.',
                'book',
              ],
              [
                '02',
                'Vive el teatro',
                'Historias que se encuentran con el aula en una experiencia presencial inolvidable.',
                'ticket',
              ],
              [
                '03',
                'Dale voz a lo aprendido',
                'Reflexiones personales en texto o audio con análisis pedagógico formativo.',
                'mic',
              ],
            ].map(([n, t, d, icon]) => (
              <TiltCard key={n} className="step" maxTilt={6}>
                <div>
                  <Icon name={icon} size={28} />
                  <span>{n}</span>
                </div>
                <h3>{t}</h3>
                <p>{d}</p>
              </TiltCard>
            ))}
          </div>
        </section>

        {/* Sección: Cartelera Escénica de Obras */}
        <section className="wrap landing-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HISTORIAS QUE CONECTAN</span>
              <h2>La próxima conversación empieza aquí.</h2>
            </div>
            <Link className="text-link" to="/cartelera">
              Explorar cartelera <Icon />
            </Link>
          </div>
          <p className="demo-label">Vista previa · Obras ilustrativas, sin funciones disponibles para reserva.</p>

          <div className="play-grid">
            {plays.map((p) => (
              <Link className="play-card" key={p.id} to={`/cartelera/${p.id}`}>
                <div className={`poster ${p.color}`}>
                  <span>TEATRO EN LA ESCUELA</span>
                  <h3>{p.title}</h3>
                  <span className="poster-symbol" aria-hidden="true">✳</span>
                  <small>Una historia para encontrarnos</small>
                </div>
                <div className="play-info">
                  <span className="eyebrow">{p.theme}</span>
                  <h3>{p.title}</h3>
                  <p>{p.duration} min · Secundaria <Icon name="arrow" /></p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        {/* Sección: Voces que Transforman */}
        <section className="wrap program-banner" id="voces">
          <div>
            <span className="eyebrow light">VOCES QUE TRANSFORMAN</span>
            <h2>Sentir. Entender.<br />Encontrar nuestra voz.</h2>
            <p>
              Seis sesiones para trabajar autoconocimiento, autocontrol y automotivación con el acompañamiento
              del docente especializado.
            </p>
            <MagneticButton href="/programa" className="btn btn-white !mt-4">
              <span>Conoce el programa</span>
              <Icon size={18} />
            </MagneticButton>
          </div>
          <div className="program-art" aria-hidden="true">
            <span>6</span>
            <p>SESIONES<br />INFINITAS CONVERSACIONES</p>
          </div>
        </section>
      </main>

      {/* Footer Público */}
      <footer className="wrap public-footer" id="aliados">
        <Brand />
        <p>
          Una iniciativa del Club de Arte y Cultura de Piura.<br />
          El teatro nos reúne. La educación nos transforma.
        </p>
        <Link to="/ingresar" className="inline-flex items-center gap-2">
          <span>Entrar a mi espacio</span>
          <Icon size={16} />
        </Link>
      </footer>
    </div>
  )
}
