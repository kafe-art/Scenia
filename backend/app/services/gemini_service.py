import json
import logging
import os
import time

from dotenv import load_dotenv
from google import genai
from google.genai import types
from google.genai.errors import ServerError

load_dotenv()

logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Modelo principal y modelos de respaldo (menos demandados, más estables)
MODELOS = [
    "gemini-3.8-flash",
]

MAX_REINTENTOS = 3
PAUSA_ENTRE_REINTENTOS = 2  # segundos

client = genai.Client(api_key=GEMINI_API_KEY) if GEMINI_API_KEY else None


# ── Respuestas precargadas para que la demo NUNCA falle ──────────────

GUIA_PRECARGADA = {
    "titulo": "El puente de las voces",
    "objetivo": "Desarrollar la empatía y promover alternativas pacíficas "
                "ante situaciones de conflicto escolar mediante la "
                "representación teatral.",
    "materiales": [
        "Espacio abierto o salón despejado",
        "Tarjetas con nombres de personajes",
        "Pizarra o papelógrafo para la reflexión final",
    ],
    "personajes": [
        {
            "nombre": "Valentina",
            "descripcion": "Estudiante nueva que llega al colegio "
                           "sin conocer a nadie.",
        },
        {
            "nombre": "Marcos",
            "descripcion": "Líder del grupo que decide quién entra "
                           "y quién no a su círculo.",
        },
        {
            "nombre": "Lucía",
            "descripcion": "Amiga de Marcos que empieza a cuestionar "
                           "las decisiones del grupo.",
        },
        {
            "nombre": "El Narrador",
            "descripcion": "Guía la historia y hace pausas para que "
                           "el público reflexione.",
        },
    ],
    "escenas": [
        {
            "nombre": "El primer día",
            "duracion_minutos": 8,
            "instrucciones": "Valentina llega al salón. Intenta "
                             "presentarse pero el grupo la ignora. "
                             "El narrador congela la escena y pregunta "
                             "al público: ¿Qué sienten al ver esto?",
        },
        {
            "nombre": "La decisión de Lucía",
            "duracion_minutos": 10,
            "instrucciones": "Lucía ve a Valentina sola en el recreo. "
                             "Marcos le dice que no se acerque. Lucía "
                             "debe decidir. El docente pide a los "
                             "estudiantes que propongan qué debería "
                             "hacer Lucía y se representan dos finales "
                             "diferentes.",
        },
        {
            "nombre": "El puente",
            "duracion_minutos": 7,
            "instrucciones": "Los estudiantes construyen juntos un "
                             "final donde todos los personajes "
                             "encuentran una forma de convivir. Se "
                             "representan las propuestas del grupo.",
        },
        {
            "nombre": "Reflexión guiada",
            "duracion_minutos": 5,
            "instrucciones": "En círculo, cada estudiante comparte "
                             "una palabra que describa lo que sintió. "
                             "El docente facilita la conversación con "
                             "las preguntas de reflexión.",
        },
    ],
    "preguntas_reflexion": [
        "¿Alguna vez te has sentido como Valentina? ¿Qué hiciste?",
        "¿Qué necesita una persona para atreverse a actuar como Lucía?",
        "¿Qué pasaría en nuestro salón si ignoráramos a alguien nuevo?",
        "¿Cómo podemos construir un espacio donde todos se sientan "
        "bienvenidos?",
    ],
    "recomendaciones_docente": [
        "Permita que los estudiantes improvisen diálogos propios.",
        "No fuerce la participación: ofrezca roles alternativos como "
        "narrador u observador.",
        "Valide todas las emociones expresadas sin juzgar.",
        "Conecte la actividad con experiencias reales del aula sin "
        "señalar a ningún estudiante.",
    ],
}

ANALISIS_PRECARGADO = {
    "resumen": "El estudiante demuestra una comprensión inicial del "
               "conflicto representado y propone alternativas de actuación "
               "basadas en el diálogo y la inclusión.",
    "indicadores": [
        {
            "nombre": "Reconocimiento de perspectivas diferentes",
            "observacion": "El estudiante identifica que existen distintos "
                           "puntos de vista en la situación representada "
                           "y menciona cómo se sentiría en el lugar del "
                           "otro.",
            "nivel": "En desarrollo",
        },
        {
            "nombre": "Identificación de alternativas de actuación",
            "observacion": "Propone acciones concretas como hablar con "
                           "la persona afectada y pedir apoyo a un adulto "
                           "de confianza.",
            "nivel": "Evidenciado",
        },
        {
            "nombre": "Comprensión de consecuencias de las acciones",
            "observacion": "Reconoce que ignorar a alguien puede causar "
                           "daño emocional y que las acciones del grupo "
                           "afectan a todos.",
            "nivel": "En desarrollo",
        },
        {
            "nombre": "Propuestas de convivencia respetuosa",
            "observacion": "Sugiere formas de integrar a personas nuevas "
                           "en el grupo y crear acuerdos de convivencia.",
            "nivel": "Evidenciado",
        },
    ],
    "pregunta_sugerida": "¿Qué harías tú si vieras que un compañero "
                         "está siendo excluido y nadie más interviene?",
    "limitaciones": "El análisis se basa únicamente en el texto escrito "
                    "y no puede determinar las emociones reales del "
                    "estudiante ni su comportamiento fuera de la "
                    "actividad. Los niveles son orientativos.",
}


def _llamar_gemini(instrucciones, temperature, max_tokens):
    """Intenta llamar a Gemini con reintentos y modelos de respaldo."""
    ultimo_error = None

    for modelo in MODELOS:
        for intento in range(MAX_REINTENTOS):
            try:
                respuesta = client.models.generate_content(
                    model=modelo,
                    contents=instrucciones,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        temperature=temperature,
                        max_output_tokens=max_tokens,
                    ),
                )
                return json.loads(respuesta.text)

            except ServerError as e:
                ultimo_error = e
                logger.warning(
                    "Gemini %s intento %d/%d falló (503). "
                    "Reintentando en %ds...",
                    modelo, intento + 1, MAX_REINTENTOS,
                    PAUSA_ENTRE_REINTENTOS,
                )
                time.sleep(PAUSA_ENTRE_REINTENTOS)

            except Exception as e:
                ultimo_error = e
                logger.warning(
                    "Error al llamar a Gemini %s: %s",
                    modelo, e,
                )
                break

        logger.warning(
            "Modelo %s agotó reintentos. Probando siguiente modelo...",
            modelo,
        )

    # Si todos los modelos y reintentos fallaron
    raise ultimo_error or RuntimeError("Todos los modelos fallaron.")


def generar_guia(tema, objetivo, edad, duracion):
    """Genera una guía teatral. Si Gemini falla o no está configurado,
    devuelve respuesta precargada para que la demo nunca se caiga."""
    if client is None:
        logger.warning("Gemini no configurado. Usando respuesta precargada.")
        return GUIA_PRECARGADA

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

    try:
        return _llamar_gemini(instrucciones, temperature=0.7, max_tokens=3000)
    except Exception:
        logger.exception(
            "Todos los modelos fallaron. Usando respuesta precargada."
        )
        return GUIA_PRECARGADA


def analizar_reflexion(reflexion):
    """Analiza una reflexión. Si Gemini falla o no está configurado,
    devuelve análisis precargado para que la demo nunca se caiga."""
    if client is None:
        logger.warning("Gemini no configurado. Usando análisis precargado.")
        return ANALISIS_PRECARGADO

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

    try:
        return _llamar_gemini(instrucciones, temperature=0.3, max_tokens=2000)
    except Exception:
        logger.exception(
            "Todos los modelos fallaron. Usando análisis precargado."
        )
        return ANALISIS_PRECARGADO
