# Datos de Prueba (Seeds)

Este directorio contiene datos ficticios o de referencia para poblar la base de datos en entornos locales y de testing.

## Archivos

- `test_data.sql`: Registros de ejemplo para usuarios y entidades principales.

## Aplicación de Semillas

Para cargar los datos en tu entorno local:

```bash
# Ejemplo SQLite
sqlite3 ../backend/scenia.db < test_data.sql
```
