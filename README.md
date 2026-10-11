# Scenia

Plataforma web full-stack construida con **React + Vite** en el frontend y **FastAPI** en el backend.

---

## 📁 Estructura del Proyecto

```text
Scenia/
├── frontend/       # Cliente Web (React + Vite)
├── backend/        # Servidor API REST (FastAPI)
├── database/       # Migraciones y datos de prueba
├── docs/           # Requisitos y contratos de API
├── .gitignore      # Reglas de exclusión de Git
└── README.md       # Documentación general del proyecto
```

### Descripción de los Directorios

- **`frontend/`**: Aplicación de interfaz de usuario desarrollada con React y empaquetada mediante Vite para un entorno de desarrollo rápido y optimizado.
- **`backend/`**: Servicio backend modular desarrollado en FastAPI con Python, soporte para CORS, enrutamiento versionado (`/api/v1`) y esquemas tipados con Pydantic.
- **`database/`**: Scripts de creación de esquemas, migraciones secuenciales (`database/migrations/`) y datos de prueba/semillas (`database/seeds/`).
- **`docs/`**: Documentación técnica del proyecto, incluyendo [Requisitos del Sistema](docs/requisitos.md), [Contratos de API](docs/contratos_api.md) y [Arquitectura](docs/arquitectura.md).

---

## 🚀 Inicio Rápido

### 1. Backend (FastAPI)

```bash
# Navegar al directorio del backend
cd backend

# Crear entorno virtual
python -m venv venv

# Activar entorno virtual
# En Windows:
.\venv\Scripts\Activate.ps1
# En macOS/Linux:
source venv/bin/activate

# Instalar dependencias
pip install -r requirements.txt

# Configurar variables de entorno
cp .env.example .env

# Iniciar servidor de desarrollo
uvicorn main:app --reload --port 8000
```

- **API Base:** [http://localhost:8000](http://localhost:8000)
- **Documentación Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **Documentación ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

---

### 2. Frontend (React + Vite)

```bash
# Navegar al directorio del frontend
cd frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

- **Aplicación web:** [http://localhost:5173](http://localhost:5173)

---

### 3. Base de Datos

Para inicializar una base de datos local con SQLite o PostgreSQL:

```bash
# Ejecutar esquema de referencia
sqlite3 backend/scenia.db < database/schema.sql

# Cargar datos de prueba
sqlite3 backend/scenia.db < database/seeds/test_data.sql
```

---

## 📚 Documentación Adicional

- [Guía de Trabajo en Equipo y Ramas (5 Integrantes)](docs/guia-equipo-ramas.md)
- [Requisitos del Sistema](docs/requisitos.md)
- [Contratos y Especificación de la API](docs/contratos_api.md)
- [Arquitectura del Sistema](docs/arquitectura.md)
