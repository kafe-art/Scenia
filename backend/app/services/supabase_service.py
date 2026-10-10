import os

from supabase import create_client, Client

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")

supabase: Client | None = None

if (
    SUPABASE_URL
    and SUPABASE_KEY
    and "TU_" not in SUPABASE_URL
    and "TU_" not in SUPABASE_KEY
):
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception:
        supabase = None


def esta_conectado():
    """Indica si Supabase está configurado y conectado."""
    return supabase is not None


def guardar_guia(guia_data):
    """Guarda una guía generada en la tabla 'guias'."""
    if supabase is None:
        return None
    resultado = supabase.table("guias").insert(guia_data).execute()
    return resultado.data


def guardar_reflexion(reflexion_data):
    """Guarda una reflexión en la tabla 'reflexiones'."""
    if supabase is None:
        return None
    resultado = supabase.table("reflexiones").insert(reflexion_data).execute()
    return resultado.data


def guardar_metricas(metricas_data):
    """Guarda métricas de análisis en la tabla 'metricas'."""
    if supabase is None:
        return None
    resultado = supabase.table("metricas").insert(metricas_data).execute()
    return resultado.data


def obtener_metricas():
    """Obtiene todas las métricas para el dashboard."""
    if supabase is None:
        return None
    resultado = supabase.table("metricas").select("*").execute()
    return resultado.data


def obtener_actividades():
    """Obtiene la lista de actividades."""
    if supabase is None:
        return None
    resultado = (
        supabase.table("actividades")
        .select("*, guias(titulo, tema)")
        .order("created_at", desc=True)
        .execute()
    )
    return resultado.data

