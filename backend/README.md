# Backend - Scenia API (Flask + Gemini + Supabase)

Este directorio contiene la API REST de **Scenia**, desarrollada en Python con **Flask**, integración con **Google Gemini (IA Pedagógica)** y persistencia opcional con **Supabase**.

---

## 📁 Estructura del Backend

```text
backend/
├── app/
│   ├── routes/              # Blueprints y controladores de endpoints
│   │   ├── guias.py         # POST /generar-guia (Generador de guías teatrales con IA)
│   │   ├── reflexiones.py   # POST /analizar-reflexion (Análisis pedagógico de reflexiones)
│   │   └── metricas.py      # GET /metricas y GET /actividades (Dashboard)
│   ├── services/            # Servicios de integración
│   │   ├── gemini_service.py   # Llamadas a Gemini 3.8 Flash con google-genai
│   │   └── supabase_service.py # Conexión a base de datos Supabase
│   ├── main.py              # Fábrica de la aplicación Flask y configuración de CORS
│   └── __init__.py
├── tests/
│   └── test_contracts.py    # Pruebas automatizadas de contratos HTTP
├── .env.example             # Variables de entorno requeridas
├── main.py                  # Punto de entrada para ejecución directa
├── probar_gemini.py         # Script rápido para verificar la clave de Gemini
├── requirements.txt         # Dependencias del proyecto
└── README.md
```

---

## 🛠️ Requisitos Previos

- Python 3.10 o superior (recomendado 3.11 / 3.12 / 3.14)
- Clave de API de Google Gemini (opcional para pruebas en modo demo, necesaria para generar contenido con IA)

---

## 🚀 Instalación y Puesta en Marcha

### 1. Crear y activar el entorno virtual

En **Windows (PowerShell)**:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
```

En **macOS / Linux**:
```bash
python3 -m venv venv
source venv/bin/activate
```

### 2. Instalar dependencias
```bash
pip install -r requirements.txt
```

### 3. Configurar variables de entorno
Copia la plantilla `.env.example` y crea tu archivo `.env`:
```bash
cp .env.example .env
```

Contenido de `.env`:
```ini
GEMINI_API_KEY=tu_api_key_de_gemini
SUPABASE_URL=tu_url_de_supabase
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
FRONTEND_URL=http://localhost:5173
PORT=8000
```
> **Nota:** Si no defines `GEMINI_API_KEY` o credenciales de Supabase, la API arrancará normalmente en **modo demo**, devolviendo datos de ejemplo para el frontend.

### 4. Iniciar el servidor
```bash
python main.py
```
El servidor quedará disponible en: [http://localhost:8000](http://localhost:8000).

---

## 🧪 Pruebas Automatizadas de Contratos

Para verificar que todos los endpoints responden según el contrato acordado con el frontend:
```bash
python -m unittest discover -s tests -v
```

---

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
|---|---|---|
| `GET` | `/salud` o `/health` | Estado del backend y estado de la conexión con Gemini. |
| `POST` | `/generar-guia` | Genera una guía teatral estructurada (Docente). |
| `POST` | `/analizar-reflexion` | Analiza formativamente la reflexión de un estudiante. |
| `GET` | `/metricas` | Métricas institucionales e indicadores para el Director. |
| `GET` | `/actividades` | Listado de actividades culturales y pedagógicas. |
