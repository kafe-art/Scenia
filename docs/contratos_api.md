# Contratos de API - Scenia (REST API Specification)

**Base URL Local:** `http://localhost:8000/api/v1`  
**Formato de Intercambio:** `application/json`

---

## 1. Health Check

### `GET /health`
Verifica el estado del servicio de backend.

- **Autenticación:** No requerida
- **Respuesta 200 OK:**
  ```json
  {
    "status": "healthy",
    "app": "Scenia API",
    "version": "1.0.0"
  }
  ```

---

## 2. Autenticación (Auth)

### `POST /auth/login`
Autenticación de usuario mediante credenciales.

- **Request Body:**
  ```json
  {
    "username": "usuario@ejemplo.com",
    "password": "Password123!"
  }
  ```
- **Respuesta 200 OK:**
  ```json
  {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
  ```
- **Respuesta 401 Unauthorized:**
  ```json
  {
    "detail": "Credenciales inválidas"
  }
  ```

---

## 3. Elementos / Recursos (Items)

### `GET /items`
Obtiene la lista de elementos del usuario autenticado.

- **Headers:** `Authorization: Bearer <token>`
- **Query Params:**
  - `skip` (int, default: 0)
  - `limit` (int, default: 20)
- **Respuesta 200 OK:**
  ```json
  [
    {
      "id": "itm-001",
      "title": "Ejemplo de Elemento",
      "description": "Detalles del elemento",
      "owner_id": "usr-001",
      "created_at": "2026-10-10T12:00:00Z"
    }
  ]
  ```

### `POST /items`
Crea un nuevo elemento.

- **Headers:** `Authorization: Bearer <token>`
- **Request Body:**
  ```json
  {
    "title": "Nuevo Elemento",
    "description": "Descripción opcional"
  }
  ```
- **Respuesta 201 Created:**
  ```json
  {
    "id": "itm-003",
    "title": "Nuevo Elemento",
    "description": "Descripción opcional",
    "owner_id": "usr-001",
    "created_at": "2026-10-10T17:00:00Z"
  }
  ```
- **Respuesta 422 Unprocessable Entity:**
  ```json
  {
    "detail": [
      {
        "loc": ["body", "title"],
        "msg": "field required",
        "type": "value_error.missing"
      }
    ]
  }
  ```
