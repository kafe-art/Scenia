function Loading({ mensaje = 'Cargando...' }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="spinner" aria-hidden="true"></div>
      <p>{mensaje}</p>
    </div>
  )
}

export default Loading

