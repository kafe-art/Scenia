export default {
  id: 'docente',
  prefix: '/docente',
  label: 'Docente',
  initials: 'CM',
  demoName: 'Carla Mendoza',
  institution: 'I.E. Emblemática San Miguel de Piura',
  navigation: [
    ['/docente', 'Inicio', 'home'],
    ['/docente/cartelera', 'Cartelera escolar', 'ticket'],
    ['/docente/clases', 'Mis experiencias', 'spark'],
  ],
  sidebarCard: {
    title: 'Voces que Transforman',
    description: 'Metodología para escuchar, crear y reflexionar a través del teatro.',
    to: '/docente/programa',
    icon: 'spark',
  },
  bottomLinks: [
    ['/docente/perfil', 'Mi perfil', 'user'],
    ['/ingresar', 'Cerrar sesión', 'logout'],
  ],
}
