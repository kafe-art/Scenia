export default {
  id: 'admin',
  prefix: '/admin',
  label: 'Administrador',
  initials: 'CL',
  demoName: 'Coordinador del Club',
  navigation: [
    ['/admin', 'Instituciones Aliadas', 'building'],
    ['/admin/usuarios', 'Usuarios y Roles', 'users'],
    ['/admin/metricas', 'Métricas e Impacto', 'chart'],
    ['/admin/configuracion', 'Configuración del Sistema', 'settings'],
    ['/admin/auditoria', 'Auditoría y Seguridad', 'shield'],
  ],
}
