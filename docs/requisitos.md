# Especificación de Requisitos del Sistema - Scenia

## 1. Introducción
El proyecto **Scenia** es una aplicación web full-stack compuesta por un frontend en React + Vite y un backend en FastAPI, respaldado por una base de datos relacional.

## 2. Requisitos Funcionales (RF)

| ID | Nombre | Descripción | Prioridad |
|---|---|---|---|
| **RF-01** | Gestión de Usuarios | Registro, inicio de sesión y autenticación segura con JWT. | Alta |
| **RF-02** | Catálogo / Recursos | Creación, lectura, actualización y eliminación (CRUD) de elementos principales. | Alta |
| **RF-03** | Panel de Control | Vista interactiva con métricas y lista de elementos del usuario. | Media |
| **RF-04** | Verificación de Estado | Endpoint de salud (`/api/v1/health`) para monitoreo del backend. | Alta |

## 3. Requisitos No Funcionales (RNF)

| ID | Categoría | Descripción |
|---|---|---|
| **RNF-01** | Rendimiento | Respuestas de API menores a 200ms en el percentil 95 para operaciones estándar. |
| **RNF-02** | Seguridad | Contraseñas cifradas con algoritmos seguros (bcrypt/argon2). CORS restringido a orígenes autorizados. |
| **RNF-03** | Usabilidad | Interfaz web responsiva con React y Vite, adaptable a dispositivos móviles y escritorio. |
| **RNF-04** | Mantenibilidad | Arquitectura modular en el backend y componentes desacoplados en el frontend. |
| **RNF-05** | Documentación | Contratos de API autogenerados con OpenAPI/Swagger en `/docs`. |
