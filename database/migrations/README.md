# Migraciones de Base de Datos

En este directorio se almacenan los scripts y versiones de migración del esquema de base de datos.

## Convención de Nombres

- `001_nombre_descriptivo.sql`
- `002_agregar_columna_x.sql`

## Integración recomendada

Si utilizas Alembic (incluido en `backend/requirements.txt`), las migraciones generadas por la herramienta se pueden sincronizar aquí o en `backend/alembic/versions/`.
Para migraciones directas con cliente SQL / script:
```bash
# Ejemplo SQLite
sqlite3 ../backend/scenia.db < 001_initial_schema.sql
```
