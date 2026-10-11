import { useState } from 'react'

export default function WhatIfSimulator() {
  const [alumnos, setAlumnos] = useState(420)
  const [funciones, setFunciones] = useState(3)

  // Cálculos predictivos dinámicos
  const deltaWleisEstimado = (1.0 + (alumnos / 450) * 0.35 + (funciones / 5) * 0.25).toFixed(2)
  const ahorroFamilias = alumnos * funciones * 25 // S/ 25 costo comercial promedio de entrada de teatro
  const horasPedagogicas = funciones * 6 * 4 // Horas acumuladas acreditables para docentes

  return (
    <div className="what-if-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
        <div>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            HERRAMIENTA PREDICTIVA ESTRATÉGICA
          </span>
          <h3 style={{ margin: '4px 0 0', fontSize: '18px', color: '#0f172a' }}>
            Simulador de Impacto Escolar (What-If Analysis)
          </h3>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Modela los resultados antes de someterlos a consideración del Consejo Educativo (CONEI).
          </p>
        </div>
        <span
          style={{
            background: '#dbeafe',
            color: '#1e40af',
            fontSize: '12px',
            fontWeight: 700,
            padding: '4px 12px',
            borderRadius: '999px',
          }}
        >
          Algoritmo Scenia Predictive v2.4
        </span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '24px', marginTop: '20px' }}>
        {/* Controles Deslizantes */}
        <div style={{ background: '#ffffff', padding: '20px', borderRadius: '18px', border: '1px solid #e2e8f0' }}>
          <div className="what-if-slider-box">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                Estudiantes participantes a convocar:
              </label>
              <strong style={{ fontSize: '16px', color: '#2563eb' }}>{alumnos} alumnos</strong>
            </div>
            <input
              type="range"
              min={100}
              max={450}
              step={10}
              value={alumnos}
              onChange={(e) => setAlumnos(Number(e.target.value))}
              className="slider-input"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
              <span>100 (Solo elenco)</span>
              <span>450 (100% Secundaria)</span>
            </div>
          </div>

          <div className="what-if-slider-box" style={{ marginTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ fontSize: '13px', fontWeight: 700, color: '#334155' }}>
                Salidas teatrales en el año:
              </label>
              <strong style={{ fontSize: '16px', color: '#059669' }}>{funciones} temporadas</strong>
            </div>
            <input
              type="range"
              min={1}
              max={5}
              step={1}
              value={funciones}
              onChange={(e) => setFunciones(Number(e.target.value))}
              className="slider-input"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#94a3b8' }}>
              <span>1 función piloto</span>
              <span>5 funciones anuales</span>
            </div>
          </div>
        </div>

        {/* Resultados Proyectados */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>IMPACTO EMOCIONAL WLEIS</span>
            <div style={{ fontSize: '26px', fontWeight: 800, color: '#7c3aed', margin: '6px 0' }}>
              +{deltaWleisEstimado} <small style={{ fontSize: '13px' }}>Δ pts</small>
            </div>
            <span style={{ fontSize: '11px', color: '#16a34a', fontWeight: 600 }}>Crecimiento significativo</span>
          </div>

          <div style={{ background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>AHORRO ESTIMADO FAMILIAS</span>
            <div style={{ fontSize: '24px', fontWeight: 800, color: '#059669', margin: '6px 0' }}>
              S/ {ahorroFamilias.toLocaleString()}
            </div>
            <span style={{ fontSize: '11px', color: '#0284c7', fontWeight: 600 }}>100% Beca Alianzas</span>
          </div>

          <div style={{ gridColumn: 'span 2', background: '#ffffff', padding: '16px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b' }}>HORAS PEDAGÓGICAS ACREDITABLES</span>
              <strong style={{ fontSize: '18px', color: '#0f172a' }}>{horasPedagogicas} horas / año</strong>
            </div>
            <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#64748b' }}>
              Válidas para escalafón y reconocimiento docente ante la DREP Piura.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
