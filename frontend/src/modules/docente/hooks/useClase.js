import { useCallback, useEffect, useState } from 'react'
import { obtenerClase } from '../services/clases'

// Carga una clase y expone `ejecutar(fn)`: corre una acción del servicio, recarga y captura el error.
export default function useClase(id) {
  const [clase, setClase] = useState(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(null)

  const recargar = useCallback(async () => {
    try {
      setClase(await obtenerClase(id))
    } catch (err) {
      setError(err.message)
    } finally {
      setCargando(false)
    }
  }, [id])

  useEffect(() => {
    let cancel = false
    obtenerClase(id)
      .then((data) => {
        if (!cancel) setClase(data)
      })
      .catch((err) => {
        if (!cancel) setError(err.message)
      })
      .finally(() => {
        if (!cancel) setCargando(false)
      })
    return () => {
      cancel = true
    }
  }, [id])

  const ejecutar = useCallback(
    async (accion) => {
      setError(null)
      try {
        await accion()
        await recargar()
      } catch (err) {
        setError(err.message)
      }
    },
    [recargar],
  )

  return { clase, cargando, error, setError, ejecutar }
}
