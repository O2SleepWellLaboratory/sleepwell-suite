/* ==========================================================================
   O₂ SleepWell Laboratory Hub - Client-Side Intelligence Engine
   ========================================================================== */

// --- 1. STATE & GLOBAL CONFIGURATION ---
const CIRCADIAN_STATES = [
  { hourStart: 0, hourEnd: 6, label: "Deep Delta Sleep Trough", desc: "Suprachiasmatic nucleus triggers maximum melatonin secretion. Cognitive pathways are offline." },
  { hourStart: 6, hourEnd: 9, label: "Melatonin Cessation / Cortisol Rise", desc: "Melatonin secretion ceases. Core temperature rises as cortisol begins a sharp upward curve to establish morning waking arousal." },
  { hourStart: 9, hourEnd: 12, label: "Peak Executive Logic Focus", desc: "High-precision window. Analytical fluid reasoning, working memory, and logical execution reach their biological peaks." },
  { hourStart: 12, hourEnd: 15, label: "Post-Lunch Somnogen Dip", desc: "A natural transient decline in alertness driven by circadian sleep gates and initial homeostatic Somnogen accumulation." },
  { hourStart: 15, hourEnd: 18, label: "Cardio & Coordination Peak", desc: "Maximum muscle efficiency, aerobic capacity, and motor-coordination peak as core body temperature hits its daily high." },
  { hourStart: 18, hourEnd: 21, label: "Circadian Wind-Down Shift", desc: "Blood pressure and heart rate stabilize. Core temperature begins declining, signaling initial phase transition." },
  { hourStart: 21, hourEnd: 24, label: "Melatonin Secretion Onset", desc: "Melatonin rises rapidly as the brain prepares for sleep. Attentional vigilance declines progressively." }
];

// Chronotype profile definitions to synchronize across databases
const CHRONOTYPE_PROFILES = {
  "Morning Lark": {
    class: "state-lark",
    color: "var(--accent-morning)",
    colorRgb: "var(--accent-morning-rgb)",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <circle cx="12" cy="12" r="5" />
             <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
           </svg>`,
    bed: "10:00 PM",
    wake: "06:00 AM",
    peakStartHour: 8,
    peakEndHour: 12,
    downStartHour: 21,
    downEndHour: 6
  },
  "Intermediate Bear": {
    class: "state-bear",
    color: "var(--accent-bear)",
    colorRgb: "var(--accent-bear-rgb)",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
             <circle cx="12" cy="12" r="4" />
             <path d="M12 6c-3.3 0-6 2.7-6 6" />
           </svg>`,
    bed: "11:30 PM",
    wake: "07:30 AM",
    peakStartHour: 9.5,
    peakEndHour: 13,
    downStartHour: 22.5,
    downEndHour: 7.5
  },
  "Evening Owl": {
    class: "state-owl",
    color: "var(--accent-evening)",
    colorRgb: "var(--accent-evening-rgb)",
    icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
             <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
           </svg>`,
    bed: "01:30 AM",
    wake: "09:30 AM",
    peakStartHour: 17,
    peakEndHour: 22,
    downStartHour: 1,
    downEndHour: 9.5
  }
};

// --- 2. DOM ELEMENT REFERENCES ---
const hubBody = document.getElementById('hubBody');
const headerLiveTime = document.getElementById('headerLiveTime');
const headerPhaseState = document.getElementById('headerPhaseState');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const sunIcon = themeToggleBtn.querySelector('.sun-icon');
const moonIcon = themeToggleBtn.querySelector('.moon-icon');

const circadianPanelContent = document.getElementById('circadianPanelContent');
const vigilancePanelContent = document.getElementById('vigilancePanelContent');
const diagnosticsPanelContent = document.getElementById('diagnosticsPanelContent');

const rMeqTimeLabel = document.getElementById('rMeqTimeLabel');
const pvtTimeLabel = document.getElementById('pvtTimeLabel');

// --- 3. THEME MANAGEMENT SYSTEM ---
function initTheme() {
  const savedTheme = localStorage.getItem('circaHub_theme') || localStorage.getItem('circaAlign_theme') || localStorage.getItem('pvt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  if (savedTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
}

themeToggleBtn.addEventListener('click', () => {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('circaHub_theme', newTheme);
  
  // Propagate theme preference to sibling apps for seamless clinical integration
  localStorage.setItem('circaAlign_theme', newTheme);
  localStorage.setItem('pvt_theme', newTheme);
  
  if (newTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
});

// --- 4. LIVE CLINICAL CLOCK & PHASE STATE ENGINE ---
function startLiveClock() {
  const updateClock = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    
    // Format digital clock
    const ampm = currentHour >= 12 ? 'PM' : 'AM';
    const dispHour = currentHour % 12 === 0 ? 12 : currentHour % 12;
    const dispMin = currentMin.toString().padStart(2, '0');
    
    headerLiveTime.textContent = `${dispHour}:${dispMin} ${ampm}`;
    
    // Resolve circadian phase matching current hour
    const activePhase = CIRCADIAN_STATES.find(state => currentHour >= state.hourStart && currentHour < state.hourEnd);
    if (activePhase) {
      headerPhaseState.textContent = activePhase.label;
    }
  };
  
  updateClock();
  setInterval(updateClock, 15000); // refresh every 15 seconds
}

// --- 5. AGGREGATED LOCALSTORAGE GETTERS ---
function getCircAlignHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('circaAlign_history') || '[]');
    return history.length > 0 ? history[0] : null; // returns most recent record
  } catch (e) {
    console.error("Failed to parse circaAlign_history: ", e);
    return null;
  }
}

function getPvtHistory() {
  try {
    const history = JSON.parse(localStorage.getItem('pvt_history') || '[]');
    return history.length > 0 ? history[0] : null; // returns most recent record
  } catch (e) {
    console.error("Failed to parse pvt_history: ", e);
    return null;
  }
}

// --- 6. DASHBOARD GENERATION & RENDERING ENGINE ---
function renderDashboard() {
  const meqData = getCircAlignHistory();
  const pvtData = getPvtHistory();
  
  // 6.1 Render Panel A: Circadian Chronotype Profile
  if (meqData) {
    const profile = CHRONOTYPE_PROFILES[meqData.chronotype] || CHRONOTYPE_PROFILES["Intermediate Bear"];
    
    // Inject chronotype class in body to light up decorative atmospheric aura
    hubBody.className = profile.class;
    
    rMeqTimeLabel.textContent = meqData.date;
    rMeqTimeLabel.className = "badge chronotype-accent-bg chronotype-accent-color";
    
    circadianPanelContent.innerHTML = `
      <div class="panel-icon-center chronotype-accent-color" style="background: rgba(${profile.colorRgb}, 0.05); border-color: rgba(${profile.colorRgb}, 0.25);">
        ${profile.icon}
      </div>
      <h3 class="dash-chronotype-name chronotype-accent-color">${meqData.chronotype}</h3>
      <span class="dash-chronotype-score">Assessment Score: <strong>${meqData.score} / 25</strong></span>
      
      <div class="dash-chronotype-schedule">
        <span>Sleep Cycle:</span>
        <span class="chronotype-accent-color">${profile.bed} - ${profile.wake}</span>
      </div>
    `;
  } else {
    // Empty state rMEQ Quiz Pending
    circadianPanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
          <line x1="12" y1="17" x2="12.01" y2="17" />
        </svg>
        <h4>rMEQ Chronotype Pending</h4>
        <p>Complete the biological sleep chronometer quiz to identify your circadian peak alignment.</p>
        <a href="../meq-app/index.html" class="btn btn-primary btn-sm">Take Assessment</a>
      </div>
    `;
  }
  
  // 6.2 Render Panel B: Attentional Vigilance Audit
  if (pvtData) {
    pvtTimeLabel.textContent = pvtData.dateTime;
    
    const accuracy = parseFloat(pvtData.performanceScore);
    const strokeOffset = 264 - (264 * (accuracy / 100));
    
    // Performance coloring
    let colorVar = "var(--success)";
    if (accuracy < 70) colorVar = "var(--danger)";
    else if (accuracy < 90) colorVar = "var(--warning)";
    
    circadianPanelContent.style.setProperty('--accuracy-color-active', colorVar);
    
    vigilancePanelContent.innerHTML = `
      <div class="accuracy-radial-box">
        <svg viewBox="0 0 100 100" class="circle-svg">
          <circle cx="50" cy="50" r="42" stroke="var(--card-border)" stroke-width="6.5" fill="none" />
          <circle cx="50" cy="50" r="42" stroke="${colorVar}" stroke-width="7.5" stroke-dasharray="264" stroke-dashoffset="${strokeOffset}" stroke-linecap="round" fill="none" class="gauge-fill-ring" />
        </svg>
        <div class="accuracy-inner-val">
          <span class="pct" style="color: ${colorVar}">${pvtData.performanceScore}%</span>
          <span class="lbl">Vigilance</span>
        </div>
      </div>
      
      <div class="vigilance-meta-row">
        <div class="vigilance-meta-item">
          <strong style="color: ${colorVar}">${pvtData.meanRT} ms</strong>
          <span>Mean RT</span>
        </div>
        <div class="vigilance-meta-item">
          <strong style="color: ${pvtData.lapses > 0 ? 'var(--danger)' : 'var(--text-primary)'}">${pvtData.lapses}</strong>
          <span>Lapses</span>
        </div>
      </div>
    `;
  } else {
    // Empty state PVT-B Pending
    vigilancePanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
        </svg>
        <h4>PVT Attention Audit Pending</h4>
        <p>Run a reaction speed test to calculate your current attentional stamina and sleep debt lapses.</p>
        <a href="../pvt-app/index.html" class="btn btn-primary btn-sm" style="background: var(--brand-secondary); box-shadow: 0 4px 10px rgba(59, 130, 246, 0.25);">Initialize Test</a>
      </div>
    `;
  }
  
  // 6.3 Render Panel C: High-Fidelity Combined Circadian Alignment
  calculateCombinedDiagnostics(meqData, pvtData);
}

// --- 7. HIGH-FIDELITY DIAGNOSTICS & ALIGNMENT CALCULATIONS ---
function calculateCombinedDiagnostics(meqData, pvtData) {
  if (!meqData && !pvtData) {
    // Completely missing history records
    diagnosticsPanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
          <line x1="12" y1="9" x2="12" y2="13"/>
          <line x1="12" y1="17" x2="12.01" y2="17"/>
        </svg>
        <h4>Diagnostics Pending</h4>
        <p>Complete both rMEQ Sleep Chronotype and PVT reaction velocity assessments to unlock diagnostic sync auditing.</p>
      </div>
    `;
    return;
  }
  
  if (!meqData || !pvtData) {
    // Partial records completed
    const missingApp = !meqData ? "Circadian Chronotype quiz" : "PVT Neuro-Alertness test";
    const missingUrl = !meqData ? "../meq-app/index.html" : "../pvt-app/index.html";
    const missingBtnTxt = !meqData ? "Launch Quiz" : "Launch Test";
    
    diagnosticsPanelContent.innerHTML = `
      <div class="dash-pending-box">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <h4>Awaiting Sibling Data</h4>
        <p>Hub requires clinical parameters from both apps. Please complete the missing <strong>${missingApp}</strong> to resolve diagnostics.</p>
        <a href="${missingUrl}" class="btn btn-secondary btn-sm" style="border-color: var(--brand-primary); color: var(--brand-primary);">${missingBtnTxt}</a>
      </div>
    `;
    return;
  }
  
  // Both assessments are complete! Fire up high-fidelity medical audit calculations
  const chronotypeName = meqData.chronotype;
  const meanRT = pvtData.meanRT;
  const lapses = pvtData.lapses;
  const accuracy = parseFloat(pvtData.performanceScore);
  
  const now = new Date();
  const currentHour = now.getHours();
  
  const profile = CHRONOTYPE_PROFILES[chronotypeName] || CHRONOTYPE_PROFILES["Intermediate Bear"];
  
  // A. Determine if current hour falls in their circadian peak window or circadian down-phase
  let isPeakHour = false;
  let isDownHour = false;
  
  if (profile.peakStartHour < profile.peakEndHour) {
    isPeakHour = currentHour >= profile.peakStartHour && currentHour < profile.peakEndHour;
  } else {
    // wraps midnight
    isPeakHour = currentHour >= profile.peakStartHour || currentHour < profile.peakEndHour;
  }
  
  if (profile.downStartHour < profile.downEndHour) {
    isDownHour = currentHour >= profile.downStartHour && currentHour < profile.downEndHour;
  } else {
    // wraps midnight
    isDownHour = currentHour >= profile.downStartHour || currentHour < profile.downEndHour;
  }
  
  // B. Compute alignment sync percentage
  // Base score matches latest PVT Accuracy (Sustained focus), then is modulated by biological phase coordination
  let alignmentScore = Math.round(accuracy);
  
  let diagnosticStatus = "Synchronized";
  let diagnosticDesc = "";
  let statusColor = "var(--success)";
  
  // Sub-evaluate performance & coordination boundaries
  if (meanRT < 245 && lapses === 0) {
    // Elite Focus
    if (isPeakHour) {
      alignmentScore = Math.min(100, alignmentScore + 10);
      diagnosticStatus = "Perfect Peak Alignment";
      statusColor = "var(--success)";
      diagnosticDesc = `Your rapid reaction time (<strong>${meanRT}ms</strong>) indicates outstanding attentional stability. You are tested during your optimal <strong>${chronotypeName}</strong> alertness peak. Ideal window for high-precision operations, complex system architecture, and safety-critical tasks.`;
    } else if (isDownHour) {
      alignmentScore = Math.max(80, alignmentScore - 5);
      diagnosticStatus = "Hyper-Alert Arousal";
      statusColor = "var(--success)";
      diagnosticDesc = `Outstanding speed (<strong>${meanRT}ms</strong>) despite testing during your chronotype sleep window. While you show high focus, be wary of homeostatic sleep debt accumulation later. Hydrate and wind down as scheduled.`;
    } else {
      diagnosticStatus = "Highly Rested Status";
      statusColor = "var(--success)";
      diagnosticDesc = `Excellent reaction speed (<strong>${meanRT}ms</strong>) during intermediate circadian zones. Your cognitive pathway reserves are fully refreshed with zero active sleep debt.`;
    }
  } else if (meanRT >= 280 || lapses > 1) {
    // Fatigued Performance
    if (isDownHour) {
      alignmentScore = Math.max(40, alignmentScore - 15);
      diagnosticStatus = "Circadian Sluggishness";
      statusColor = "var(--warning)";
      diagnosticDesc = `Averages of <strong>${meanRT}ms</strong> and focus lapses match your <strong>${chronotypeName}</strong> biological down-phase (sleep gate). Your neurological clock is forcing melatonin secretion. Rest immediately; avoid safety-critical operations.`;
    } else if (isPeakHour) {
      alignmentScore = Math.max(30, alignmentScore - 25);
      diagnosticStatus = "Desynchronized Fatigue / Sleep Debt";
      statusColor = "var(--danger)";
      diagnosticDesc = `<strong>CRITICAL ERROR:</strong> You are experiencing cognitive fatigue and reaction delays (<strong>${meanRT}ms</strong>) during your expected biological alertness window! This desynchronization strongly indicates high homeostatic sleep debt. Rest is highly recommended.`;
    } else {
      alignmentScore = Math.max(50, alignmentScore - 10);
      diagnosticStatus = "Accumulated Fatigue";
      statusColor = "var(--warning)";
      diagnosticDesc = `Sluggish focus velocity (<strong>${meanRT}ms</strong>) indicates sleep debt is building up. Practice deep breathing, walk under sunlight to clear melatonin, or secure a full sleep recovery cycle.`;
    }
  } else {
    // Normal Moderate alert
    if (isPeakHour) {
      diagnosticStatus = "Normal Clinical Sync";
      statusColor = "var(--success)";
      diagnosticDesc = `Reaction speed of <strong>${meanRT}ms</strong> sits within normal healthy parameters, coinciding with your <strong>${chronotypeName}</strong> biological window. Focus resilience is stable.`;
    } else if (isDownHour) {
      alignmentScore = Math.max(70, alignmentScore - 10);
      diagnosticStatus = "Mild Circadian Decay";
      statusColor = "var(--warning)";
      diagnosticDesc = `Mild focus instability (<strong>${meanRT}ms</strong>) during your sleep gate. You are pushing through natural melatonin curves. Take a quick 20-minute power nap to reload attention pathways.`;
    } else {
      diagnosticStatus = "Normal Alertness Profile";
      statusColor = "var(--success)";
      diagnosticDesc = `Circadian alignment score of <strong>${alignmentScore}%</strong>. Attentional velocity and sleep rhythm coordinates show adequate cognitive stability.`;
    }
  }
  
  diagnosticsPanelContent.innerHTML = `
    <div class="cognitive-score-wrapper">
      <span class="cognitive-index-val" style="color: ${statusColor};">${alignmentScore}</span>
      <span class="cognitive-index-max">/100</span>
    </div>
    
    <div class="cognitive-status-title" style="color: ${statusColor};">${diagnosticStatus}</div>
    <p class="cognitive-status-desc">${diagnosticDesc}</p>
    
    <div class="cognitive-status-footer" style="color: ${profile.color}; border-color: rgba(${profile.colorRgb}, 0.2); background: rgba(${profile.colorRgb}, 0.05);">
      Target Bedtime: <strong>${profile.bed}</strong>
    </div>
  `;
}

// --- 8. INITIALIZATION & BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  startLiveClock();
  renderDashboard();
  
  // Listen for localstorage changes across tabs (if user updates results in children)
  window.addEventListener('storage', (e) => {
    if (e.key === 'circaAlign_history' || e.key === 'pvt_history') {
      renderDashboard();
    }
  });
});
