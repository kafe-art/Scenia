import { fetchAPI } from './api'

export async function analizarReflexion({ actividad_id, estudiante_id, reflexion }) {
  return fetchAPI('/analizar-reflexion', {
    method: 'POST',
    body: JSON.stringify({ actividad_id, estudiante_id, reflexion }),
  })
}

