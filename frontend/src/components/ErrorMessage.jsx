function ErrorMessage({ mensaje }) {
  if (!mensaje) return null

  return (
    <div className="error-message" role="alert">
      <p>❌ {mensaje}</p>
    </div>
  )
}

export default ErrorMessage

