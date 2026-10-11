import { useRef, useEffect, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import scene from '../assets/escenario.svg'

export default function StagePortal() {
  const portalRef = useRef(null)
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const prefersReduced = useReducedMotion()

  useEffect(() => {
    if (prefersReduced) return

    const handleMouseMove = (e) => {
      const { innerWidth, innerHeight } = window
      // Coordenadas normalizadas entre -1 y 1
      const normX = (e.clientX / innerWidth - 0.5) * 2
      const normY = (e.clientY / innerHeight - 0.5) * 2

      setOffset({
        x: normX * 14,
        y: normY * 14,
      })
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [prefersReduced])

  return (
    <div className="stage-portal-wrapper">
      {/* Halo de iluminación perimetral */}
      <div className="stage-portal-halo" aria-hidden="true" />

      {/* Contenedor reactivo con inercia elástica */}
      <motion.div
        ref={portalRef}
        animate={{ x: offset.x, y: offset.y }}
        transition={{ type: 'spring', damping: 25, stiffness: 140, mass: 0.2 }}
        className="stage-portal-circle"
      >
        {/* Anillo tipográfico orbital rotativo */}
        <div className="stage-orbital-ring" aria-hidden="true">
          <svg viewBox="0 0 240 240" className="orbital-svg">
            <path
              id="orbitalTextPath"
              d="M 120, 120 m -96, 0 a 96,96 0 1,1 192,0 a 96,96 0 1,1 -192,0"
              fill="none"
            />
            <text className="orbital-text">
              <textPath href="#orbitalTextPath">
                TEATRO • ESCUELA • COMUNIDAD • SCENIA •
              </textPath>
            </text>
          </svg>
        </div>

        {/* Imagen del escenario y actores con efecto de profundidad */}
        <div className="stage-circle-inner">
          <img
            src={scene}
            alt="Ilustración de tres intérpretes ante un telón rojo de teatro"
            className="stage-circle-img"
          />
          <div className="stage-curtain-vignette" />
        </div>

        {/* Insignia / Sticker 1: El aprendizaje sale a escena */}
        <motion.div
          animate={prefersReduced ? {} : { y: [-5, 5] }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 3.4,
            ease: 'easeInOut',
          }}
          className="sticker sticker-red stage-sticker-top"
        >
          El aprendizaje<br />sale a escena
        </motion.div>

        {/* Insignia / Sticker 2: Experiencias presenciales */}
        <motion.div
          animate={prefersReduced ? {} : { y: [5, -5] }}
          transition={{
            repeat: Infinity,
            repeatType: 'reverse',
            duration: 4.1,
            ease: 'easeInOut',
          }}
          className="sticker sticker-cream stage-sticker-bottom"
        >
          Experiencias<br />presenciales
        </motion.div>
      </motion.div>
    </div>
  )
}
