const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`

  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  }

  let response
  try {
    response = await fetch(url, config)
  } catch {
    throw new Error('No pudimos conectar con el servidor. Comprueba que el backend esté disponible e inténtalo de nuevo.')
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error ${response.status}`)
  }

  return response.json()
}

export async function comprobarBackend() {
  return fetchAPI('/salud')
}

