from flask import Blueprint, jsonify, request

metricas_bp = Blueprint("metricas", __name__)


@metricas_bp.get("/metricas")
def get_metricas():
    """Devuelve métricas agregadas para el dashboard del director."""
    # TODO: conectar a Supabase para datos reales
    # from app.services.supabase_service import obtener_metricas, esta_conectado
    # if esta_conectado():
    #     datos = obtener_metricas()
    #     return jsonify({"ok": True, "demo": False, ...})

    return jsonify({
        "ok": True,
        "demo": True,
        "total_actividades": 12,
        "total_reflexiones": 47,
        "indicadores": [
            {
                "nombre": "Reconocimiento de perspectivas",
                "inicial": 5,
                "en_desarrollo": 22,
                "evidenciado": 20,
            },
            {
                "nombre": "Alternativas de actuación",
                "inicial": 8,
                "en_desarrollo": 25,
                "evidenciado": 14,
            },
            {
                "nombre": "Comprensión de consecuencias",
                "inicial": 3,
                "en_desarrollo": 18,
                "evidenciado": 26,
            },
            {
                "nombre": "Propuestas de convivencia",
                "inicial": 10,
                "en_desarrollo": 20,
                "evidenciado": 17,
            },
        ],
    })


@metricas_bp.get("/actividades")
def get_actividades():
    """Devuelve la lista de actividades."""
    # TODO: conectar a Supabase
    return jsonify({
        "ok": True,
        "demo": True,
        "actividades": [],
    })

