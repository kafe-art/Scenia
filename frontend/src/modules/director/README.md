# Módulo: Director

Este módulo está asignado al **Desarrollador 3 (Actor Director)**.

## 📌 Reglas de Aislamiento para Evitar Conflictos en Git
- **Trabaja en tu rama:** `git checkout -b feature/director-<funcionalidad>`
- **Tu zona segura de trabajo:** Todos tus cambios deben realizarse **únicamente** dentro de esta carpeta (`frontend/src/modules/director/`).
- **NO modifiques sin consultar:** `App.jsx`, `AppShell.jsx`, `registry.js`, `scenia.css` ni `package.json`.

## 📁 Estructura Interna del Módulo
- `pages/`: Vistas del director (`Director.jsx` [Métricas y Participación], `Reportes.jsx`, etc.).
- `components/`: Componentes específicos del director (gráficos Recharts, métricas institucionales).
- `routes.jsx`: Aquí registras todas tus pantallas bajo el prefijo `/director`.
- `config.js`: Aquí editas el menú lateral (sidebar) del director.

## 🚀 Cómo agregar una nueva pantalla:
1. Crea tu archivo en `pages/MiNuevaVista.jsx`.
2. En `routes.jsx`, impórtala y añade: `<Route path="nueva-vista" element={<MiNuevaVista />} />`.
3. (Opcional) Si quieres que aparezca en el menú lateral, agrégala en `config.js` en el arreglo `navigation`.
4. La pantalla estará disponible automáticamente en: `http://localhost:5173/director/nueva-vista`.
