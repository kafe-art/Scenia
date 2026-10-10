# Base de Datos - Scenia

Este directorio gestiona la persistencia de datos, migraciones de esquema y datos de prueba para desarrollo.

## Contenido

```text
database/
├── migrations/          # Scripts de migración de esquema versionados
│   ├── 001_initial_schema.sql
│   └── README.md
├── seeds/               # Conjuntos de datos ficticios para pruebas locales
│   ├── test_data.sql
│   └── README.md
├── schema.sql           # Esquema consolidado de referencia
└── README.md
```

## Flujo de Trabajo Recomendado

1. Modificaciones de estructura deben realizarse a través de un nuevo archivo en `migrations/`.
2. Actualizar `schema.sql` como vista consolidada del modelo de datos.
3. Actualizar `seeds/test_data.sql` si se añaden campos obligatorios en las tablas.
