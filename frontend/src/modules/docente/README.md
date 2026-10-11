# Módulo: Docente

Este módulo está asignado al **Desarrollador 2 (Actor Docente)**.

## 📌 Reglas de Aislamiento para Evitar Conflictos en Git
- **Trabaja en tu rama:** `git checkout -b feature/docente-<funcionalidad>`
- **Tu zona segura de trabajo:** Todos tus cambios deben realizarse **únicamente** dentro de esta carpeta (`frontend/src/modules/docente/`).
- **NO modifiques sin consultar:** `App.jsx`, `AppShell.jsx`, `registry.js`, `scenia.css` ni `package.json`.

## 📁 Estructura Interna del Módulo
- `pages/`: Vistas del docente (`InicioDocente.jsx`, `Docente.jsx` [Generador de Guías IA], etc.).
- `components/`: Componentes específicos del docente (resumen de aula, tarjetas de clase, etc.).
- `routes.jsx`: Aquí registras todas tus pantallas bajo el prefijo `/docente`.
- `config.js`: Aquí editas el menú lateral (sidebar) del docente sin tocar los otros módulos.

## 🚀 Cómo agregar una nueva pantalla:
1. Crea tu archivo en `pages/MiNuevaVista.jsx`.
2. En `routes.jsx`, impórtala y añade: `<Route path="nueva-vista" element={<MiNuevaVista />} />`.
3. (Opcional) Si quieres que aparezca en el menú lateral, agrégala en `config.js` en el arreglo `navigation`.
4. La pantalla estará disponible automáticamente en: `http://localhost:5173/docente/nueva-vista`.
