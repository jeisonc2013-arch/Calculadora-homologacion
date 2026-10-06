// Catálogo de Dimensiones Comerciales en Colombia
const colombianTireSizes = [
  { label: "-- Seleccionar o Personalizar --", w: 0, a: 0, r: 0 },
  
  // --- AUTOMÓVILES Y SUVS (Milimétricas) ---
  { label: "165/70R13 (Spark, Picanto)", w: 165, a: 70, r: 13 },
  { label: "175/70R13 (Chevrolet Aveo, Logan)", w: 175, a: 70, r: 13 },
  { label: "175/65R14 (Fiesta, Gol, March)", w: 175, a: 65, r: 14 },
  { label: "185/60R15 (Sail, Yaris, Swift)", w: 185, a: 60, r: 15 },
  { label: "185/65R15 (Logan, Sandero, Versa)", w: 185, a: 65, r: 15 },
  { label: "195/65R15 (Corolla, Mazdas, Civic)", w: 195, a: 65, r: 15 },
  { label: "205/55R16 (Jetta, Corolla, Mazda 3)", w: 205, a: 55, r: 16 },
  { label: "205/60R16 (Tracker, Duster, Ecosport)", w: 205, a: 60, r: 16 },
  { label: "215/65R16 (Duster, Tucson, Sportage)", w: 215, a: 65, r: 16 },
  { label: "225/65R17 (CX-5, CR-V, RAV4)", w: 225, a: 65, r: 17 },
  { label: "235/60R18 (Santa Fe, Sorento)", w: 235, a: 60, r: 18 },

  // --- PICKUPS Y 4X4 (Milimétricas y Pulgadas) ---
  { label: "235/75R15 (L200, Hilux antigua)", w: 235, a: 75, r: 15 },
  { label: "265/70R16 (Hilux, Fortuner, NP300)", w: 265, a: 70, r: 16 },
  { label: "265/65R17 (Hilux, Prado, Trailblazer)", w: 265, a: 65, r: 17 },
  { label: "265/60R18 (Prado VX, Fortuner)", w: 265, a: 60, r: 18 },
  { label: "31x10.50R15 (4x4 Comercial)", w: 10.5, a: 80, r: 15 },

  // --- TRANSPORTE PESADO, CAMIONES Y BUSES ---
  { label: "205/75R17.5 (Camión Liviano Comercial)", w: 215, a: 75, r: 17.5 },
  { label: "215/75R17.5 (Turbo, NPR, NHR)", w: 215, a: 75, r: 17.5 },
  { label: "235/75R17.5 (Buses urbanos, NQR)", w: 235, a: 75, r: 17.5 },
  { label: "9.5R17.5 (Camión Liviano Comercial)", w: 9.5, a: 80, r: 17.5 },
  { label: "275/80R22.5 (Tractomulas, Buses)", w: 275, a: 80, r: 22.5 },
  { label: "295/80R22.5 (Tractomulas, Doble Troque)", w: 295, a: 80, r: 22.5 },
  { label: "11R22.5 (Camión Convencional Estándar)", w: 11, a: 80, r: 22.5 },
  { label: "12R22.5 (Camión Convencional Ancho)", w: 12, a: 80, r: 22.5 },
  { label: "13R22.5 (Volquetas, Operación Pesada)", w: 13, a: 80, r: 22.5 },
  { label: "12.00R24 (Volquetas Pesadas, OTR)", w: 12, a: 80, r: 24 }
];

// Cargar opciones en los desplegables
function populateSelects() {
  const selOrig = document.getElementById('select-orig');
  const selNew = document.getElementById('select-new');

  colombianTireSizes.forEach((item, index) => {
    const optOrig = document.createElement('option');
    optOrig.value = index;
    optOrig.textContent = item.label;
    selOrig.appendChild(optOrig);

    const optNew = document.createElement('option');
    optNew.value = index;
    optNew.textContent = item.label;
    selNew.appendChild(optNew);
  });

  // Event listeners para los desplegables
  selOrig.addEventListener('change', (e) => applySelectValue(e.target.value, 'orig'));
  selNew.addEventListener('change', (e) => applySelectValue(e.target.value, 'new'));
}

function applySelectValue(index, type) {
  const idx = parseInt(index);
  if (idx <= 0) return; // Opción vacía o personalizada

  const tire = colombianTireSizes[idx];
  document.getElementById(`width-${type}`).value = tire.w;
  document.getElementById(`aspect-${type}`).value = tire.a;
  document.getElementById(`rim-${type}`).value = tire.r;

  calculateAndRender();
}

// Configuración de listeners de inputs manuales
const inputIds = [
  'width-orig', 'aspect-orig', 'rim-orig',
  'width-new', 'aspect-new', 'rim-new', 'speed-input'
];

inputIds.forEach(id => {
  const el = document.getElementById(id);
  if (el) el.addEventListener('input', () => {
    // Si edita manualmente, resetear el desplegable a "Personalizar"
    if (id.includes('orig')) document.getElementById('select-orig').value = 0;
    if (id.includes('new')) document.getElementById('select-new').value = 0;
    calculateAndRender();
  });
});

// Función conversora de dimensiones
function parseTireData(width, aspect, rim) {
  let widthMm = width;
  let aspectPct = aspect;

  if (width < 50 && width > 0) {
    widthMm = width * 25.4;
    aspectPct = aspect > 0 ? aspect : 80;
  }

  const h = widthMm * (aspectPct / 100);
  const d = (2 * h) + (rim * 25.4);
  const c = Math.PI * d;
  const revs = 1000000 / c;

  return { widthMm, aspectPct, h, d, c, revs };
}

function calculateAndRender() {
  const wOrig = parseFloat(document.getElementById('width-orig').value) || 0;
  const aOrig = parseFloat(document.getElementById('aspect-orig').value) || 0;
  const rOrig = parseFloat(document.getElementById('rim-orig').value) || 0;

  const wNew = parseFloat(document.getElementById('width-new').value) || 0;
  const aNew = parseFloat(document.getElementById('aspect-new').value) || 0;
  const rNew = parseFloat(document.getElementById('rim-new').value) || 0;

  const speedInd = parseFloat(document.getElementById('speed-input').value) || 0;

  const tblSpeed = document.getElementById('tbl-speed-ind');
  if (tblSpeed) tblSpeed.textContent = speedInd;

  if (wOrig <= 0 || rOrig <= 0 || wNew <= 0 || rNew <= 0) return;

  const orig = parseTireData(wOrig, aOrig, rOrig);
  const tireNew = parseTireData(wNew, aNew, rNew);

  const pctDiam = ((tireNew.d - orig.d) / orig.d) * 100;
  const pctFlank = ((tireNew.h - orig.h) / orig.h) * 100;
  const pctWidth = ((tireNew.widthMm - orig.widthMm) / orig.widthMm) * 100;
  const pctCirc = ((tireNew.c - orig.c) / orig.c) * 100;
  const pctRevs = ((tireNew.revs - orig.revs) / orig.revs) * 100;

  const vReal = speedInd * (tireNew.d / orig.d);
  const diffSpeed = vReal - speedInd;

  // Render KPIs
  document.getElementById('card-d-orig').textContent = `${orig.d.toFixed(1)} mm`;
  document.getElementById('card-d-new').textContent = `${tireNew.d.toFixed(1)} mm`;
  document.getElementById('card-speed-real').textContent = `${vReal.toFixed(1)} km/h`;
  document.getElementById('card-speed-diff').textContent = `${diffSpeed >= 0 ? '+' : ''}${diffSpeed.toFixed(1)} km/h`;
  document.getElementById('card-w-diff').textContent = `${(tireNew.widthMm - orig.widthMm) >= 0 ? '+' : ''}${(tireNew.widthMm - orig.widthMm).toFixed(0)} mm`;

  // Render Status (±3%)
  const statusCard = document.getElementById('status-card');
  const statusIcon = document.getElementById('status-icon');
  const statusTitle = document.getElementById('status-title');
  const statusSub = document.getElementById('status-subtitle');
  const kpiDiff = document.getElementById('kpi-diameter-diff');

  if (kpiDiff) kpiDiff.textContent = `${pctDiam >= 0 ? '+' : ''}${pctDiam.toFixed(2)}%`;

  if (statusCard) {
    if (Math.abs(pctDiam) <= 3) {
      statusCard.className = 'status-banner valid';
      if (statusIcon) statusIcon.textContent = '✓';
      if (statusTitle) statusTitle.textContent = 'HOMOLOGADO';
      if (statusSub) statusSub.textContent = 'La variación del diámetro total se mantiene dentro del rango permitido (±3.0%)';
    } else {
      statusCard.className = 'status-banner invalid';
      if (statusIcon) statusIcon.textContent = '✕';
      if (statusTitle) statusTitle.textContent = 'NO HOMOLOGADO';
      if (statusSub) statusSub.textContent = `La variación de diámetro (${pctDiam >= 0 ? '+' : ''}${pctDiam.toFixed(2)}%) supera la tolerancia de ±3.0%`;
    }
  }

  // Render Tabla
  document.getElementById('orig-flank').textContent = `${orig.h.toFixed(1)} mm`;
  document.getElementById('new-flank').textContent = `${tireNew.h.toFixed(1)} mm`;
  document.getElementById('var-flank').textContent = `${pctFlank >= 0 ? '+' : ''}${pctFlank.toFixed(2)}%`;

  document.getElementById('orig-diam').textContent = `${orig.d.toFixed(1)} mm`;
  document.getElementById('new-diam').textContent = `${tireNew.d.toFixed(1)} mm`;
  document.getElementById('var-diam').textContent = `${pctDiam >= 0 ? '+' : ''}${pctDiam.toFixed(2)}%`;

  document.getElementById('orig-circ').textContent = `${Math.round(orig.c)} mm`;
  document.getElementById('new-circ').textContent = `${Math.round(tireNew.c)} mm`;
  document.getElementById('var-circ').textContent = `${pctCirc >= 0 ? '+' : ''}${pctCirc.toFixed(2)}%`;

  document.getElementById('orig-revs').textContent = `${Math.round(orig.revs)}`;
  document.getElementById('new-revs').textContent = `${Math.round(tireNew.revs)}`;
  document.getElementById('var-revs').textContent = `${pctRevs >= 0 ? '+' : ''}${pctRevs.toFixed(2)}%`;

  document.getElementById('real-speed').textContent = `${vReal.toFixed(1)} km/h`;
  document.getElementById('var-speed').textContent = `${diffSpeed >= 0 ? '+' : ''}${diffSpeed.toFixed(1)} km/h`;

  renderSVG(orig.d, rOrig * 25.4, tireNew.d, rNew * 25.4, orig.revs, tireNew.revs);
}

// Renderizador SVG Animado Hiperrealista
function renderSVG(dOrig, rimOrigMm, dNew, rimNewMm, revsOrig, revsNew) {
  const svg = document.getElementById('tire-visualizer');
  if (!svg) return;

  const maxD = Math.max(dOrig, dNew, 1);
  const scale = 75 / (maxD / 2); // Factor de escala para que entren cómodamente en 240px de alto

  const cx1 = 140, cx2 = 360, cy = 110;

  const rOuterOrig = Math.max((dOrig / 2) * scale, 10);
  const rInnerOrig = Math.max((rimOrigMm / 2) * scale, 5);

  const rOuterNew = Math.max((dNew / 2) * scale, 10);
  const rInnerNew = Math.max((rimNewMm / 2) * scale, 5);

  // Velocidades de rotación basadas en relación de revoluciones/km
  const speedOrig = 3.0; // Segundos por vuelta base
  const speedNew = (revsOrig && revsNew) ? (speedOrig * (revsOrig / revsNew)) : 3.0;

  // Helper para generar el ensamble completo de llanta + rin en SVG
  function buildWheelSVG(cx, cy, rOuter, rInner, label, colorAccent, animSpeed, diamValue) {
    const rSide = rOuter * 0.90;
    const rHub = rInner * 0.38;

    return `
      <g class="wheel-group">
        <!-- CONJUNTO GIRATORIO -->
        <g class="rotating-wheel" style="transform-origin: ${cx}px ${cy}px; animation: spinTire ${animSpeed}s linear infinite;">
          
          <!-- BANDA DE RODADURA / TREAD -->
          <circle cx="${cx}" cy="${cy}" r="${rOuter}" fill="#111827" stroke="#374151" stroke-width="2" />
          <circle cx="${cx}" cy="${cy}" r="${rOuter - 2}" fill="none" stroke="#1f2937" stroke-width="4" stroke-dasharray="6,4" />

          <!-- FLANCO / PERFIL -->
          <circle cx="${cx}" cy="${cy}" r="${rSide}" fill="#1f2937" stroke="#0f172a" stroke-width="2" />
          <circle cx="${cx}" cy="${cy}" r="${(rSide + rInner) / 2}" fill="none" stroke="#374151" stroke-width="1.5" stroke-dasharray="30,3" />

          <!-- RIN METÁLICO -->
          <circle cx="${cx}" cy="${cy}" r="${rInner}" fill="#94a3b8" stroke="#cbd5e1" stroke-width="2" />
          <circle cx="${cx}" cy="${cy}" r="${rInner * 0.72}" fill="#475569" stroke="#334155" stroke-width="1.5" />

          <!-- RADIOS DEL RIN (5 Brazos) -->
          ${[0, 72, 144, 216, 288].map(angle => `
            <line x1="${cx}" y1="${cy}" 
                  x2="${cx + rInner * Math.cos(angle * Math.PI / 180)}" 
                  y2="${cy + rInner * Math.sin(angle * Math.PI / 180)}" 
                  stroke="#cbd5e1" stroke-width="4" stroke-linecap="round" />
            <line x1="${cx}" y1="${cy}" 
                  x2="${cx + rInner * Math.cos(angle * Math.PI / 180)}" 
                  y2="${cy + rInner * Math.sin(angle * Math.PI / 180)}" 
                  stroke="#f8fafc" stroke-width="1.5" stroke-linecap="round" />
          `).join('')}

          <!-- MANZANA Y PERNOS -->
          <circle cx="${cx}" cy="${cy}" r="${rHub}" fill="#1e293b" stroke="#64748b" stroke-width="1.5" />
          ${[0, 72, 144, 216, 288].map(angle => `
            <circle cx="${cx + (rHub * 0.6) * Math.cos((angle + 36) * Math.PI / 180)}" 
                    cy="${cy + (rHub * 0.6) * Math.sin((angle + 36) * Math.PI / 180)}" 
                    r="2" fill="#f8fafc" />
          `).join('')}
          <circle cx="${cx}" cy="${cy}" r="${rHub * 0.3}" fill="#0f172a" />
        </g>

        <!-- ANILLO INDICADOR PUNTIAGUDO -->
        <circle cx="${cx}" cy="${cy}" r="${rOuter + 5}" fill="none" stroke="${colorAccent}" stroke-width="2" stroke-dasharray="6,4" opacity="0.85" />

        <!-- ETIQUETA Y MEDIDA (FIJAS) -->
        <text x="${cx}" y="${cy + rOuter + 22}" fill="${colorAccent}" font-size="12" font-weight="bold" text-anchor="middle">
          ${label}: ${diamValue.toFixed(1)} mm
        </text>
      </g>
    `;
  }

  svg.innerHTML = `
    <line x1="30" y1="${cy}" x2="470" y2="${cy}" stroke="#334155" stroke-dasharray="4" stroke-width="1" />
    ${buildWheelSVG(cx1, cy, rOuterOrig, rInnerOrig, 'ORIGINAL', '#94a3b8', speedOrig, dOrig)}
    ${buildWheelSVG(cx2, cy, rOuterNew, rInnerNew, 'NUEVO', '#f5a90b', speedNew, dNew)}
  `;
}

// Inicialización
document.addEventListener('DOMContentLoaded', () => {
  populateSelects();
  calculateAndRender();
});