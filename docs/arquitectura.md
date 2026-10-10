# Arquitectura del Sistema - Scenia

## Visión General

Scenia está concebida bajo una arquitectura cliente-servidor desacoplada:

```
  ┌────────────────────────┐
  │   Cliente Web          │
  │   (React + Vite)       │
  └───────────┬────────────┘
              │ HTTP / JSON
              ▼
  ┌────────────────────────┐
  │   Backend API REST     │
  │   (FastAPI)            │
  └───────────┬────────────┘
              │ SQL / ORM
              ▼
  ┌────────────────────────┐
  │   Capa de Persistencia │
  │   (PostgreSQL/SQLite)  │
  └────────────────────────┘
```

## Componentes

1. **Frontend (`frontend/`)**:
   - Construido con React y empaquetado con Vite.
   - Comunicación asíncrona mediante llamadas fetch/axios contra endpoints del backend.
   - Servidor local en `http://localhost:5173`.

2. **Backend (`backend/`)**:
   - Framework FastAPI en Python.
   - Enrutamiento versionado (`/api/v1/`).
   - Validación y serialización declarativa con Pydantic.
   - Servidor local en `http://localhost:8000`.

3. **Base de Datos (`database/`)**:
   - Modelado relacional.
   - Scripts de migración en `database/migrations/`.
   - Carga inicial y datos de prueba en `database/seeds/`.

4. **Documentación (`docs/`)**:
   - Especificación de requerimientos funcionales y técnicos.
   - Contratos formales de API REST.
