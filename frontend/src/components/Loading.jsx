function Loading({ mensaje = 'Cargando...' }) {
  return (
    <div className="loading">
      <div className="spinner"></div>
      <p>{mensaje}</p>
    </div>
  )
}

export default Loading

