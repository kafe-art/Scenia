# Backend - Scenia (FastAPI)

Este directorio contiene el backend de la aplicación, desarrollado con **FastAPI** y estructurado de forma modular y escalable.

## Estructura del Backend

```text
backend/
├── app/
│   ├── api/             # Controladores y endpoints (versionados v1)
│   ├── core/            # Configuraciones globales y seguridad
│   ├── models/          # Modelos ORM (SQLAlchemy)
│   ├── schemas/         # Esquemas y validaciones (Pydantic)
│   ├── services/        # Lógica de negocio
│   └── main.py          # Creación e inicialización de FastAPI
├── .env.example         # Variables de entorno de ejemplo
├── main.py              # Punto de entrada para ejecución directa
├── requirements.txt     # Dependencias de Python
└── README.md
```

## Requisitos Previos

- Python 3.10+
- Gestor de entornos virtuales (recomendado `venv`)

## Configuración y Ejecución

1. **Crear y activar el entorno virtual:**

   En Windows:
   ```powershell
   python -m venv venv
   .\venv\Scripts\Activate.ps1
   ```

   En macOS/Linux:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   ```

2. **Instalar dependencias:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Configurar variables de entorno:**
   ```bash
   cp .env.example .env
   ```

4. **Ejecutar el servidor de desarrollo:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```
   O ejecutar directamente:
   ```bash
   python main.py
   ```

5. **Documentación interactiva:**
   - Swagger UI: [http://localhost:8000/docs](http://localhost:8000/docs)
   - ReDoc: [http://localhost:8000/redoc](http://localhost:8000/redoc)
