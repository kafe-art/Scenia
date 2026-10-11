# Guía de Trabajo en Equipo y Estrategia de Ramas (Scenia)

Esta guía define cómo debe organizarse el equipo de **5 personas** para trabajar en paralelo de forma eficiente y **sin conflictos de Git (merge conflicts)**.

---

## 1. Distribución de Roles en el Equipo (5 Integrantes)

| Integrante | Rol | Responsabilidad Principal | Carpeta de Trabajo |
|---|---|---|---|
| **Compañero 1** | **Backend & Integrador (DevOps)** | FastAPI, Supabase, Gemini IA, Base de datos, pruebas de contratos, revisión de PRs y despliegue. | `backend/`, `database/`, `docs/` |
| **Compañero 2** | **Frontend - Actor Estudiante** | Vistas de reflexión, actividades del estudiante, interacción con obras. | `frontend/src/modules/estudiante/` |
| **Compañero 3** | **Frontend - Actor Docente** | Vistas de clases, generador de guías con IA, seguimiento de alumnos. | `frontend/src/modules/docente/` |
| **Compañero 4** | **Frontend - Actor Director** | Paneles de métricas con Recharts, impacto pedagógico, reportes. | `frontend/src/modules/director/` |
| **Compañero 5** | **Frontend - Actor Administrador** | Gestión de usuarios, colegios, permisos y configuraciones globales. | `frontend/src/modules/admin/` |

---

## 2. La Regla de Oro: Aislamiento por Módulos

Para que los 4 compañeros de frontend trabajen al mismo tiempo sin pisarse:

1. **Cada actor tiene su propia carpeta encapsulada (`frontend/src/modules/<actor>/`):**
   - Sus propias páginas en `pages/`
   - Sus propios componentes en `components/`
   - Sus propias rutas en `routes.jsx`
   - Su propio menú lateral en `config.js`
2. **Archivos Protegidos (Nadie los toca salvo coordinación con el Integrador):**
   - `frontend/src/App.jsx` (Ya tiene el enrutamiento dinámico configurado con `lazy`).
   - `frontend/src/components/AppShell.jsx` (El layout común con sidebar y navbar).
   - `frontend/src/modules/registry.js` (Ya tiene registrados a los 4 actores).
   - `frontend/package.json` (Si alguien necesita una librería nueva, debe coordinar antes de instalarla para no romper el lockfile).
   - `frontend/src/styles/scenia.css` (Para estilos propios, crear archivos CSS dentro de tu módulo o usar CSS modules).

---

## 3. Estrategia de Git y Nomenclatura de Ramas

### Estructura de Ramas
- **`main`**: Rama principal de producción / estable. **Nadie hace `git push` directo a `main`**. Todos entran mediante Pull Request (PR).
- **Ramas de funcionalidad por actor:**
  - `feature/estudiante-<tarea>` (ej: `feature/estudiante-nueva-reflexion`)
  - `feature/docente-<tarea>` (ej: `feature/docente-generador-guia`)
  - `feature/director-<tarea>` (ej: `feature/director-panel-metricas`)
  - `feature/admin-<tarea>` (ej: `feature/admin-gestion-usuarios`)
  - `feature/api-<tarea>` (ej: `feature/api-endpoint-reflexiones`)

---

## 4. Flujo Diario Paso a Paso para cada Integrante

### Paso 1: Actualizar su copia local
Antes de empezar a trabajar cada día:
```bash
git checkout main
git pull origin main
```

### Paso 2: Crear su rama de trabajo
```bash
git checkout -b feature/estudiante-detalle-actividad
```

### Paso 3: Trabajar únicamente en su módulo
- Agregar vistas en `frontend/src/modules/estudiante/pages/`
- Registrar la ruta en `frontend/src/modules/estudiante/routes.jsx`
- Si requiere enlace en el menú lateral, agregarlo en `frontend/src/modules/estudiante/config.js`

### Paso 4: Verificar que no rompió la compilación
Antes de subir código, verificar que el proyecto compila:
```bash
cd frontend
npm run build
```
*(Debe compilar sin errores en color verde)*.

### Paso 5: Guardar y subir a GitHub
```bash
git add frontend/src/modules/estudiante/
git commit -m "feat(estudiante): agrega pantalla de detalle de actividad"
git push origin feature/estudiante-detalle-actividad
```

### Paso 6: Abrir Pull Request (PR)
1. Ir a GitHub y abrir el PR apuntando a `main`.
2. Completar la plantilla de PR (`.github/pull_request_template.md`).
3. El **Compañero 1 (Integrador)** revisa el PR, verifica que la CI pase (`ci.yml`) y hace el merge.

---

## 5. Cómo Conectarse con la API del Backend

- El **Compañero 1 (Backend)** define los endpoints en `docs/contratos_api.md`.
- Los 4 desarrolladores de frontend consultan ese documento para saber:
  - Qué URL llamar (ej: `POST /api/v1/guias/generar`).
  - Qué campos enviar en el JSON de petición.
  - Qué estructura recibir en la respuesta JSON.
- Para realizar peticiones HTTP, se utiliza el cliente configurado en `frontend/src/services/api.js` (o crear llamadas dentro de cada módulo).
