# Contratos de API - Scenia (REST API Specification)

**Base URL Local:** `http://localhost:8000`  
**Formato de Intercambio:** `application/json`

Esta especificación documenta los contratos HTTP implementados en el backend de Flask y validados mediante pruebas automatizadas en `backend/tests/test_contracts.py`.

---

## 1. Verificación de Estado (Health Check)

### `GET /salud` (o `GET /health`)
Verifica que el servicio esté activo y el estado de la conexión con el modelo de Gemini.

- **Respuesta 200 OK:**
  ```json
  {
    "estado": "ok",
    "servicio": "Scenia API",
    "gemini_configurado": true
  }
  ```

---

## 2. Generador de Guías Teatrales (Docente)

### `POST /generar-guia`
Genera una propuesta pedagógica teatral a través de Gemini 3.8 Flash.

- **Request Body (JSON):**
  ```json
  {
    "tema": "La empatía en situaciones de conflicto",
    "objetivo": "Reconocer las emociones del otro y buscar soluciones colectivas",
    "edad": 14,
    "duracion": 30
  }
  ```
- **Validaciones:**
  - `tema`: String no vacío (requerido).
  - `objetivo`: String no vacío (requerido).
  - `edad`: Entero entre 6 y 18 (requerido).
  - `duracion`: Entero entre 5 y 120 minutos (requerido).

- **Respuesta 200 OK:**
  ```json
  {
    "ok": true,
    "guia": {
      "titulo": "Voces en el Espejo",
      "objetivo": "Reconocer emociones y buscar acuerdos",
      "materiales": ["Cuaderno", "Objetos cotidianos"],
      "personajes": [
        {
          "nombre": "Mateo",
          "descripcion": "Estudiante retraído que teme participar"
        }
      ],
      "escenas": [
        {
          "nombre": "El encuentro en el patio",
          "duracion_minutos": 10,
          "instrucciones": "Dramatizar una situación de malentendido sin usar palabras agresivas."
        }
      ],
      "preguntas_reflexion": [
        "¿Qué hubieras hecho tú en el lugar de Mateo?"
      ],
      "recomendaciones_docente": [
        "Brindar un espacio de confianza antes de iniciar la dramatización."
      ]
    }
  }
  ```

- **Respuesta 400 Bad Request:**
  ```json
  {
    "error": "Debes proporcionar tema y objetivo."
  }
  ```

- **Respuesta 503 Service Unavailable:**
  ```json
  {
    "error": "Gemini no está configurado en el servidor."
  }
  ```

---

## 3. Análisis de Reflexiones de Estudiantes (Estudiante)

### `POST /analizar-reflexion`
Analiza una reflexión escrita por un estudiante sobre una experiencia escénica utilizando indicadores pedagógicos formativos (no diagnósticos ni psicológicos).

- **Request Body (JSON):**
  ```json
  {
    "actividad_id": 1,
    "estudiante_id": 1,
    "reflexion": "Al ver la obra me di cuenta de que a veces juzgo a las personas sin saber por lo que están pasando..."
  }
  ```
- **Validaciones:**
  - `reflexion`: String no vacío, máximo 8000 caracteres.

- **Respuesta 200 OK:**
  ```json
  {
    "ok": true,
    "analisis": {
      "resumen": "El estudiante reflexiona sobre el juicio precipitado y la empatía.",
      "indicadores": [
        {
          "nombre": "Reconocimiento de perspectivas diferentes",
          "observacion": "Identifica que las actitudes de los personajes tienen motivos de fondo.",
          "nivel": "Evidenciado"
        },
        {
          "nombre": "Propuestas de convivencia respetuosa",
          "observacion": "Propone escuchar antes de reaccionar.",
          "nivel": "En desarrollo"
        }
      ],
      "pregunta_sugerida": "¿Cómo podrías aplicar esa escucha activa en tu grupo de aula?",
      "limitaciones": "El análisis se basa exclusivamente en el texto compartido por el estudiante."
    }
  }
  ```

- **Respuesta 400 Bad Request:**
  ```json
  {
    "error": "Debes proporcionar una reflexión."
  }
  ```

---

## 4. Métricas e Indicadores de Impacto (Director)

### `GET /metricas`
Devuelve datos agregados e indicadores institucionales para el panel del Director.

- **Respuesta 200 OK:**
  ```json
  {
    "ok": true,
    "demo": true,
    "total_obras": 3,
    "total_guias": 12,
    "total_actividades": 12,
    "total_reflexiones": 47,
    "indicadores": [
      {
        "nombre": "Reconocimiento de perspectivas",
        "inicial": 5,
        "en_desarrollo": 22,
        "evidenciado": 20
      },
      {
        "nombre": "Alternativas de actuación",
        "inicial": 8,
        "en_desarrollo": 25,
        "evidenciado": 14
      },
      {
        "nombre": "Comprensión de consecuencias",
        "inicial": 3,
        "en_desarrollo": 18,
        "evidenciado": 26
      },
      {
        "nombre": "Propuestas de convivencia",
        "inicial": 10,
        "en_desarrollo": 20,
        "evidenciado": 17
      }
    ]
  }
  ```

---

## 5. Listado de Actividades

### `GET /actividades`
Devuelve la lista de actividades pedagógicas disponibles.

- **Respuesta 200 OK:**
  ```json
  {
    "ok": true,
    "demo": true,
    "actividades": []
  }
  ```
