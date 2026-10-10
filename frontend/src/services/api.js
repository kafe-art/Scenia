const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export async function fetchAPI(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  }

  const response = await fetch(url, config)

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.error || `Error ${response.status}`)
  }

  return response.json()
}

export async function comprobarBackend() {
  return fetchAPI('/salud')
}

