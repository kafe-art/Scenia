export default {
  id: 'admin',
  prefix: '/admin',
  label: 'Colegio',
  initials: 'SM',
  demoName: 'San Miguel',
  demoSubtitle: 'Colegio',
  institution: 'I.E. Emblemática San Miguel de Piura',
  sidebarCaption: 'GESTIÓN CULTURAL',
  navigation: [
    ['/admin', 'Panel institucional', 'chart'],
  ],
  sidebarCard: {
    title: 'Voces que Transforman',
    description: 'Metodología para escuchar, crear y reflexionar a través del teatro.',
    to: '/admin/programa',
    icon: 'spark',
  },
  bottomLinks: [
    ['/admin/perfil', 'Mi perfil', 'user'],
    ['/ingresar', 'Cerrar sesión', 'logout'],
  ],
}
