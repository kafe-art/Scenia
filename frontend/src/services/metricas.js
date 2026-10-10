import { fetchAPI } from './api'

export async function obtenerMetricas() {
  return fetchAPI('/metricas')
}

