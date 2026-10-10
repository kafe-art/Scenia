import json
import os

from google import genai
from google.genai import types

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
MODEL = "gemini-3.8-flash"

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


def generar_guia(tema, objetivo, edad, duracion):
    """Genera una guía teatral estructurada usando Gemini."""
    if client is None:
        raise RuntimeError("Gemini no está configurado en el servidor.")

    instrucciones = f"""
    Eres un asistente de diseño pedagógico especializado en teatro
    educativo y convivencia escolar.

    Diseña una actividad teatral con estas características:

    Tema: {tema}
    Objetivo: {objetivo}
    Edad: {edad} años
    Duración: {duracion} minutos

    Devuelve exclusivamente un objeto JSON válido con esta estructura:

    {{
        "titulo": "Título de la actividad",
        "objetivo": "Objetivo pedagógico",
        "materiales": ["Material 1", "Material 2"],
        "personajes": [
            {{
                "nombre": "Personaje",
                "descripcion": "Descripción"
            }}
        ],
        "escenas": [
            {{
                "nombre": "Nombre de la escena",
                "duracion_minutos": 10,
                "instrucciones": "Qué deben hacer los participantes"
            }}
        ],
        "preguntas_reflexion": [
            "Pregunta para el debate"
        ],
        "recomendaciones_docente": [
            "Recomendación"
        ]
    }}

    Adapta el lenguaje a la edad indicada.
    La suma de las duraciones de las escenas debe ajustarse
    aproximadamente al tiempo disponible.

    Evita estigmatizar a los participantes.
    No conviertas la actividad en una evaluación psicológica.
    """

    respuesta = client.models.generate_content(
        model=MODEL,
        contents=instrucciones,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.7,
            max_output_tokens=3000,
        ),
    )

    return json.loads(respuesta.text)


def analizar_reflexion(reflexion):
    """Analiza una reflexión estudiantil con indicadores pedagógicos."""
    if client is None:
        raise RuntimeError("Gemini no está configurado en el servidor.")

    instrucciones = f"""
    Analiza esta reflexión escrita después de una actividad teatral
    sobre convivencia escolar.

    Utiliza exclusivamente estos indicadores pedagógicos:

    1. Reconocimiento de perspectivas diferentes.
    2. Identificación de alternativas de actuación.
    3. Comprensión de consecuencias de las acciones.
    4. Propuestas de convivencia respetuosa.

    No diagnostiques estados psicológicos.
    No afirmes conocer las emociones reales del estudiante.
    No clasifiques al estudiante como empático o no empático.
    No infieras características personales que el texto no permita
    justificar.

    Devuelve exclusivamente JSON con esta estructura:

    {{
        "resumen": "Resumen breve de la reflexión",
        "indicadores": [
            {{
                "nombre": "Nombre del indicador",
                "observacion": "Evidencia presente en el texto",
                "nivel": "Inicial, En desarrollo o Evidenciado"
            }}
        ],
        "pregunta_sugerida": "Pregunta para continuar la reflexión",
        "limitaciones": "Qué no puede determinarse a partir del texto"
    }}

    Los niveles son orientativos, no diagnósticos ni mediciones
    científicas validadas.

    Reflexión:
    {reflexion}
    """

    respuesta = client.models.generate_content(
        model=MODEL,
        contents=instrucciones,
        config=types.GenerateContentConfig(
            response_mime_type="application/json",
            temperature=0.3,
            max_output_tokens=2000,
        ),
    )

    return json.loads(respuesta.text)

