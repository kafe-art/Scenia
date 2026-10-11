import os
import sys

# Asegurar que el directorio backend esté en sys.path para importaciones absolutas
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app.main import app

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8000))
    debug = os.getenv("FLASK_DEBUG", "True").lower() in ("true", "1")
    print(f"Iniciando Scenia API en http://localhost:{port} (debug={debug})...")
    app.run(host="0.0.0.0", port=port, debug=debug)
