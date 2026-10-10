import json
import logging

from flask import Blueprint, jsonify, request

from app.services.gemini_service import analizar_reflexion

reflexiones_bp = Blueprint("reflexiones", __name__)
logger = logging.getLogger(__name__)


@reflexiones_bp.post("/analizar-reflexion")
def post_analizar_reflexion():
    datos = request.get_json(silent=True) or {}

    reflexion = datos.get("reflexion", "").strip()

    if not reflexion:
        return jsonify({
            "error": "Debes proporcionar una reflexión."
        }), 400

    if len(reflexion) > 8000:
        return jsonify({
            "error": "La reflexión supera el límite permitido."
        }), 400

    actividad_id = datos.get("actividad_id")
    estudiante_id = datos.get("estudiante_id")

    try:
        resultado = analizar_reflexion(reflexion)

        # TODO: guardar en Supabase cuando esté conectado
        # from app.services.supabase_service import guardar_reflexion, guardar_metricas
        # guardar_reflexion({...})
        # guardar_metricas({...})

        return jsonify({
            "ok": True,
            "analisis": resultado,
        })

    except json.JSONDecodeError:
        logger.exception("Respuesta JSON inválida de Gemini.")
        return jsonify({
            "error": "No se pudo interpretar el análisis."
        }), 502

    except RuntimeError as e:
        return jsonify({"error": str(e)}), 503

    except Exception:
        logger.exception("Error analizando la reflexión.")
        return jsonify({
            "error": "No se pudo analizar la reflexión."
        }), 502

