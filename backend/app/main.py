import os
import warnings

# Silenciar advertencias informativas de fin de vida de Python 3.9 y LibreSSL en macOS
warnings.filterwarnings("ignore", category=FutureWarning, module="google.auth")
warnings.filterwarnings("ignore", category=FutureWarning, module="google.oauth2")
warnings.filterwarnings("ignore", category=Warning, module="urllib3")


from dotenv import load_dotenv
from flask import Flask, jsonify
from flask_cors import CORS

load_dotenv()

app = Flask(__name__)
app.config["MAX_CONTENT_LENGTH"] = 15 * 1024 * 1024

frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

CORS(
    app,
    resources={
        r"/*": {
            "origins": [
                "http://localhost:5173",
                frontend_url,
            ]
        }
    },
)

# Registrar blueprints
from app.routes.guias import guias_bp
from app.routes.reflexiones import reflexiones_bp
from app.routes.metricas import metricas_bp

app.register_blueprint(guias_bp)
app.register_blueprint(reflexiones_bp)
app.register_blueprint(metricas_bp)


@app.get("/")
def inicio():
    return jsonify({
        "mensaje": "CulturaMétrica API funcionando correctamente",
        "version": "1.0.0",
    })


@app.get("/salud")
def salud():
    from app.services.gemini_service import client
    return jsonify({
        "estado": "ok",
        "servicio": "CulturaMétrica API",
        "gemini_configurado": client is not None,
    })


if __name__ == "__main__":
    app.run(debug=True, port=8000)