import { fetchAPI } from './api'

export async function generarGuia({ tema, objetivo, edad, duracion }) {
  return fetchAPI('/generar-guia', {
    method: 'POST',
    body: JSON.stringify({ tema, objetivo, edad, duracion }),
  })
}

