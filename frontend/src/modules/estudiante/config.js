export default {
  id: 'estudiante',
  prefix: '/estudiante',
  label: 'Estudiante',
  initials: 'AC',
  demoName: 'Andrea Castro',
  demoSubtitle: 'Estudiante · 3.º B',
  institution: 'I.E. Emblemática San Miguel de Piura',
  navigation: [
    ['/estudiante', 'Mi ruta cultural', 'home'],
    ['/estudiante/reflexiones', 'Mis reflexiones', 'book'],
    ['/estudiante/logros', 'Mi historial y logros', 'award'],
    ['/estudiante/cartelera', 'Cartelera', 'ticket'],
  ],
  sidebarCard: {
    title: 'Voces que Transforman',
    description: 'Metodología para escuchar, crear y reflexionar a través del teatro.',
    to: '/estudiante/voces-que-transforman',
    icon: 'spark',
  },
  bottomLinks: [
    ['/estudiante/perfil', 'Mi perfil', 'user'],
    ['/ingresar', 'Cerrar sesión', 'logout'],
  ],
}
