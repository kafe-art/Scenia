import docente from './docente/config'
import estudiante from './estudiante/config'
import director from './director/config'
import admin from './admin/config'

// La configuración y el menú de cada actor se editan en su propio módulo.
export const actorModules = [docente, estudiante, director, admin]
export function getActorModule(pathname) {
  return actorModules.find(({ prefix }) => pathname === prefix || pathname.startsWith(`${prefix}/`))
}
