from app.services.supabase_service import esta_conectado

print("--- VERIFICANDO CONEXIÓN CON SUPABASE ---")

if esta_conectado():
    print("¡La base de datos está conectada y operativa!")
else:
    print("Error: No se pudo conectar a la base de datos.")