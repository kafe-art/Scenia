import os

from dotenv import load_dotenv
from google import genai

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError(
        "No se encontró GEMINI_API_KEY en el archivo .env"
    )

client = genai.Client(api_key=api_key)

respuesta = client.models.generate_content(
    model="gemini-3.8-flash",
    contents=(
        "Responde en español. "
        "Propón una actividad teatral breve "
        "para promover la convivencia escolar."
    ),
)

print(respuesta.text)