import { useRef, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

export default function TiltCard({
  children,
  className = '',
  maxTilt = 8,
  glowColor = 'rgba(230, 57, 70, 0.22)',
}) {
  const cardRef = useRef(null)
  const [rotation, setRotation] = useState({ x: 0, y: 0 })
  const [glow, setGlow] = useState({ x: 50, y: 50, opacity: 0 })
  const prefersReduced = useReducedMotion()

  const handleMouseMove = (e) => {
    if (prefersReduced || !cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const centerX = rect.width / 2
    const centerY = rect.height / 2

    const rotX = -((y - centerY) / centerY) * maxTilt
    const rotY = ((x - centerX) / centerX) * maxTilt

    setRotation({ x: rotX, y: rotY })
    setGlow({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 1,
    })
  }

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 })
    setGlow((prev) => ({ ...prev, opacity: 0 }))
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ rotateX: rotation.x, rotateY: rotation.y }}
      transition={{ type: 'spring', damping: 20, stiffness: 240, mass: 0.15 }}
      style={{ transformStyle: 'preserve-3d' }}
      className={`tilt-card ${className}`}
    >
      {/* Luz focal seguidora */}
      <div
        className="tilt-glow"
        style={{
          background: `radial-gradient(380px circle at ${glow.x}% ${glow.y}%, ${glowColor}, transparent 65%)`,
          opacity: glow.opacity,
        }}
        aria-hidden="true"
      />
      <div className="tilt-inner" style={{ transform: 'translateZ(26px)' }}>
        {children}
      </div>
    </motion.div>
  )
}
