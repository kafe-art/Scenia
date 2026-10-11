import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function MagneticButton({
  children,
  className = '',
  onClick,
  href,
  strength = 0.28,
  glow = true,
}) {
  const ref = useRef(null)
  const [coords, setCoords] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const prefersReduced = useReducedMotion()

  const handleMouseMove = (e) => {
    if (prefersReduced || !ref.current) return
    const { clientX, clientY } = e
    const { left, top, width, height } = ref.current.getBoundingClientRect()
    const x = (clientX - (left + width / 2)) * strength
    const y = (clientY - (top + height / 2)) * strength
    setCoords({ x, y })
  }

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 })
    setIsHovered(false)
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const motionProps = {
    ref,
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
    onMouseEnter: handleMouseEnter,
    animate: { x: coords.x, y: coords.y },
    transition: { type: 'spring', damping: 15, stiffness: 220, mass: 0.1 },
    whileTap: { scale: 0.96 },
    className: `magnetic-btn-wrap ${className}`,
  }

  const innerContent = (
    <>
      <span className="magnetic-btn-content">{children}</span>
      {glow && (
        <span
          className={`magnetic-glow ${isHovered ? 'is-active' : ''}`}
          aria-hidden="true"
        />
      )}
    </>
  )

  if (href) {
    return (
      <motion.a href={href} {...motionProps}>
        {innerContent}
      </motion.a>
    )
  }

  return (
    <motion.button type="button" onClick={onClick} {...motionProps}>
      {innerContent}
    </motion.button>
  )
}
