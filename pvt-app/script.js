/**
 * O2 SleepWell Laboratory
 * Scientific Standalone Psychomotor Vigilance Task (PVT-B)
 */

// --- 1. LABORATORY CONSTANTS ---
const MIN_ISI = 2000; // Minimum delay before stimulus (2s)
const MAX_ISI = 5000; // Maximum delay before stimulus (5s)
const LAPSE_THRESHOLD = 500; // Attention lapse boundary (500ms)
const FALSE_START_THRESHOLD = 100; // Premature response boundary (100ms)

// --- 2. LABORATORY STATE ENGINE ---
const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (navigator.msMaxTouchPoints > 0);

let config = {
  duration: 60000,   // default: 1 minute (60,000ms)
  inputType: isTouchDevice ? 'tap' : 'space', // default: Tap on touch screens, Space on desktops
  audioEnabled: true // default: Web Audio chimes active
};

let activeSession = {
  screen: 'config',  // 'config', 'arena', 'results'
  phase: 'idle',      // 'waiting', 'counting', 'feedback'
  trials: [],         // array of { rt, type, timestamp }
  timeLeft: 0,
  startTime: null,
  trialStartTime: null,
  currentRT: 0,
  
  // Timers and anim frames
  globalTimerId: null,
  isiTimeoutId: null,
  countingAnimFrameId: null,
  feedbackTimeoutId: null
};

// --- 3. WEB AUDIO SYNTHESIZER ---
let audioCtx = null;

function initAudio() {
  if (audioCtx) return;
  try {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    audioCtx = new AudioContextClass();
  } catch (e) {
    console.warn("Web Audio API not supported in this browser.", e);
  }
}

function playSynthesizedTone(type) {
  if (!config.audioEnabled) return;
  initAudio();
  if (!audioCtx) return;
  
  // Resume context if suspended (browser security policy)
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }

  const now = audioCtx.currentTime;
  
  if (type === 'success') {
    // Elegant high-pitched success major third chime
    triggerSynthOscillator(600, 'sine', 0.08, now);
    triggerSynthOscillator(750, 'sine', 0.08, now + 0.06);
    triggerSynthOscillator(900, 'sine', 0.1, now + 0.12);
  } else if (type === 'lapse') {
    // Low-frequency warning minor third double pulse
    triggerSynthOscillator(220, 'triangle', 0.15, now);
    triggerSynthOscillator(175, 'triangle', 0.2, now + 0.12);
  } else if (type === 'false-start') {
    // Aggressive square wave frequency sweep buzz
    const osc = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(150, now);
    osc.frequency.exponentialRampToValueAtTime(70, now + 0.25);
    
    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
    
    osc.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

function triggerSynthOscillator(freq, wave, duration, startTime) {
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, startTime);
  
  gainNode.gain.setValueAtTime(0.08, startTime);
  gainNode.gain.exponentialRampToValueAtTime(0.005, startTime + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start(startTime);
  osc.stop(startTime + duration + 0.02);
}

// --- 4. DOM ELEMENT REFERENCES ---
// Layout Screens
const configScreen = document.getElementById('configScreen');
const arenaScreen = document.getElementById('arenaScreen');
const resultsScreen = document.getElementById('resultsScreen');

// Config Selectors
const durationSelector = document.getElementById('durationSelector');
const inputSelector = document.getElementById('inputSelector');
const audioSelector = document.getElementById('audioSelector');
const startTestBtn = document.getElementById('startTestBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');

// Active Arena Elements
const hudTimeLeft = document.getElementById('hudTimeLeft');
const hudTrialsCount = document.getElementById('hudTrialsCount');
const hudLapsesCount = document.getElementById('hudLapsesCount');
const hudFalseStartsCount = document.getElementById('hudFalseStartsCount');
const quitTestBtn = document.getElementById('quitTestBtn');
const arenaProgressBar = document.getElementById('arenaProgressBar');
const clickBackdrop = document.getElementById('clickBackdrop');
const stimulusBox = document.getElementById('stimulusBox');
const stimulusStateText = document.getElementById('stimulusStateText');
const stimulusTimer = document.getElementById('stimulusTimer');
const stimulusFeedback = document.getElementById('stimulusFeedback');
const feedbackRt = document.getElementById('feedbackRt');
const feedbackMsg = document.getElementById('feedbackMsg');
const tapInstructionPrompt = document.getElementById('tapInstructionPrompt');

// Results Dashboard Elements
const resultsBadge = document.getElementById('resultsBadge');
const resultsGradeTitle = document.getElementById('resultsGradeTitle');
const resultsGradeDesc = document.getElementById('resultsGradeDesc');
const meanRtQuick = document.getElementById('meanRtQuick');
const lapsesQuick = document.getElementById('lapsesQuick');
const gaugeCircle = document.getElementById('gaugeCircle');

const statMeanRT = document.getElementById('statMeanRT');
const statMeanRTComp = document.getElementById('statMeanRTComp');
const statLapses = document.getElementById('statLapses');
const statLapsesComp = document.getElementById('statLapsesComp');
const statFalseStarts = document.getElementById('statFalseStarts');
const statFalseStartsComp = document.getElementById('statFalseStartsComp');
const statReciprocalRT = document.getElementById('statReciprocalRT');
const statPerformanceScore = document.getElementById('statPerformanceScore');
const statPerfComp = document.getElementById('statPerfComp');

const trialChart = document.getElementById('trialChart');
const diagnosticText = document.getElementById('diagnosticText');
const historyTableBody = document.getElementById('historyTableBody');
const clearHistoryBtn = document.getElementById('clearHistoryBtn');

const retryTestBtn = document.getElementById('retryTestBtn');
const printReportBtn = document.getElementById('printReportBtn');
const backToSetupBtn = document.getElementById('backToSetupBtn');

// --- 5. THEME SWITCH CONTROLLER ---
function initTheme() {
  const savedTheme = localStorage.getItem('pvt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  
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
  localStorage.setItem('pvt_theme', newTheme);
  
  const sunIcon = themeToggleBtn.querySelector('.sun-icon');
  const moonIcon = themeToggleBtn.querySelector('.moon-icon');
  
  if (newTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
});

// --- 6. NAVIGATION ROUTER ---
function showScreen(screenEl) {
  configScreen.classList.add('hidden');
  arenaScreen.classList.add('hidden');
  resultsScreen.classList.add('hidden');
  
  screenEl.classList.remove('hidden');
  
  if (screenEl === configScreen) {
    activeSession.screen = 'config';
  } else if (screenEl === arenaScreen) {
    activeSession.screen = 'arena';
  } else if (screenEl === resultsScreen) {
    activeSession.screen = 'results';
  }
}

// Setup segment switch event listener helpers
function configureSelector(selectorContainer, configKey, callback) {
  const buttons = selectorContainer.querySelectorAll('.selector-btn');
  buttons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      // Find closest button in case text was clicked
      const targetBtn = e.target.closest('.selector-btn');
      if (!targetBtn) return;
      
      buttons.forEach(b => b.classList.remove('active'));
      targetBtn.classList.add('active');
      
      let val = targetBtn.getAttribute('data-value');
      // Typecasting if numeric
      if (!isNaN(val)) {
        val = parseInt(val, 10);
      } else if (val === 'on' || val === 'off') {
        val = val === 'on';
      }
      
      config[configKey] = val;
      if (callback) callback(val);
    });
  });
}

// Initialise segment configurations
configureSelector(durationSelector, 'duration');
configureSelector(inputSelector, 'inputType', (val) => {
  if (val === 'space') {
    tapInstructionPrompt.textContent = "Press SPACEBAR when the red box turns neon and numbers count";
  } else {
    tapInstructionPrompt.textContent = "TAP OR CLICK screen when the red box turns neon and numbers count";
  }
});
configureSelector(audioSelector, 'audioEnabled', (enabled) => {
  if (enabled) {
    initAudio();
  }
});

// Start button trigger
startTestBtn.addEventListener('click', () => {
  initAudio();
  startTask();
});

// --- 7. ACTIVE TIMING VIGILANCE TASK ENGINE ---
function startTask() {
  activeSession.trials = [];
  activeSession.timeLeft = config.duration;
  
  showScreen(arenaScreen);
  updateHUD();
  
  activeSession.startTime = performance.now();
  
  // High-precision global session countdown interval
  activeSession.globalTimerId = setInterval(() => {
    const elapsed = performance.now() - activeSession.startTime;
    const remaining = Math.max(0, config.duration - elapsed);
    activeSession.timeLeft = remaining;
    
    // Smooth progress bar update
    const percentLeft = (remaining / config.duration) * 100;
    arenaProgressBar.style.width = `${percentLeft}%`;
    
    // Digital clock format
    const totalSecs = remaining / 1000;
    const mins = Math.floor(totalSecs / 60);
    const secs = Math.floor(totalSecs % 60);
    const msFraction = Math.floor((remaining % 1000) / 100);
    
    hudTimeLeft.textContent = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}.${msFraction}`;
    
    if (remaining <= 0) {
      endTask();
    }
  }, 50);

  triggerNewTrial();
}

function endTask() {
  // Clear all running timers, frames, and timeouts
  clearInterval(activeSession.globalTimerId);
  clearTimeout(activeSession.isiTimeoutId);
  clearTimeout(activeSession.feedbackTimeoutId);
  cancelAnimationFrame(activeSession.countingAnimFrameId);
  
  activeSession.phase = 'idle';
  
  // Synthesise test complete final tone
  playSynthesizedTone('success');
  
  showResultsDashboard();
}

function quitActiveTask() {
  if (confirm("Are you sure you want to quit this active vigilance run? Your session results will not be saved.")) {
    clearInterval(activeSession.globalTimerId);
    clearTimeout(activeSession.isiTimeoutId);
    clearTimeout(activeSession.feedbackTimeoutId);
    cancelAnimationFrame(activeSession.countingAnimFrameId);
    
    activeSession.phase = 'idle';
    showScreen(configScreen);
  }
}

quitTestBtn.addEventListener('click', quitActiveTask);

function triggerNewTrial() {
  activeSession.phase = 'waiting';
  activeSession.currentRT = 0;
  
  // Set waiting layout indicators
  clickBackdrop.className = 'stimulus-backdrop phase-waiting';
  stimulusStateText.classList.remove('hidden');
  stimulusStateText.textContent = "WAIT FOR RED BOX";
  stimulusTimer.classList.add('hidden');
  stimulusFeedback.classList.add('hidden');
  
  // Generate randomized inter-stimulus delay (2000ms - 5000ms)
  const delay = Math.floor(Math.random() * (MAX_ISI - MIN_ISI)) + MIN_ISI;
  
  activeSession.isiTimeoutId = setTimeout(() => {
    launchStimulusCounter();
  }, delay);
}

function launchStimulusCounter() {
  activeSession.phase = 'counting';
  clickBackdrop.className = 'stimulus-backdrop phase-counting';
  
  stimulusStateText.classList.add('hidden');
  stimulusTimer.classList.remove('hidden');
  stimulusTimer.textContent = "0";
  
  activeSession.trialStartTime = performance.now();
  
  // fluid frame timing loop
  runHighPrecisionCounter();
}

function runHighPrecisionCounter() {
  if (activeSession.phase !== 'counting') return;
  
  const elapsed = Math.floor(performance.now() - activeSession.trialStartTime);
  activeSession.currentRT = elapsed;
  stimulusTimer.textContent = elapsed;
  
  // If the user lapses massively (no click for 3.5 seconds), auto-register a huge lapse and trigger feedback
  if (elapsed >= 3500) {
    handlePhysicalAction();
  } else {
    activeSession.countingAnimFrameId = requestAnimationFrame(runHighPrecisionCounter);
  }
}

// physical trigger input overrides
const handlePhysicalAction = () => {
  if (activeSession.screen !== 'arena') return;
  
  const nowTime = performance.now();
  
  if (activeSession.phase === 'waiting') {
    // Attentional False Start: early click/tap during the wait phase
    clearTimeout(activeSession.isiTimeoutId);
    
    activeSession.phase = 'feedback';
    playSynthesizedTone('false-start');
    
    clickBackdrop.className = 'stimulus-backdrop phase-feedback-false';
    stimulusStateText.classList.add('hidden');
    stimulusFeedback.classList.remove('hidden');
    feedbackRt.textContent = "---";
    feedbackMsg.textContent = "FALSE START";
    
    const trialRecord = { rt: 0, type: 'false-start', timestamp: Date.now() };
    activeSession.trials.push(trialRecord);
    
    updateHUD();
    
    // Penalty delay lock: user has to wait 1.2s after a false start
    activeSession.feedbackTimeoutId = setTimeout(triggerNewTrial, 1200);
    
  } else if (activeSession.phase === 'counting') {
    // Valid physical reaction
    cancelAnimationFrame(activeSession.countingAnimFrameId);
    activeSession.phase = 'feedback';
    
    const rt = Math.floor(nowTime - activeSession.trialStartTime);
    activeSession.currentRT = rt;
    
    let type = 'valid';
    let label = 'OPTIMAL';
    let chimeType = 'success';
    
    if (rt < FALSE_START_THRESHOLD) {
      type = 'false-start';
      label = 'TOO EARLY';
      chimeType = 'false-start';
      clickBackdrop.className = 'stimulus-backdrop phase-feedback-false';
    } else if (rt >= LAPSE_THRESHOLD) {
      type = 'lapse';
      label = 'LAPSE';
      chimeType = 'lapse';
      clickBackdrop.className = 'stimulus-backdrop phase-feedback-lapse';
    } else {
      clickBackdrop.className = 'stimulus-backdrop phase-feedback-valid';
    }
    
    playSynthesizedTone(chimeType);
    
    stimulusTimer.classList.add('hidden');
    stimulusFeedback.classList.remove('hidden');
    feedbackRt.textContent = `${rt} ms`;
    feedbackMsg.textContent = label;
    
    const trialRecord = { rt, type, timestamp: Date.now() };
    activeSession.trials.push(trialRecord);
    
    updateHUD();
    
    // Standard feedback delay display (1 second)
    activeSession.feedbackTimeoutId = setTimeout(triggerNewTrial, 1000);
  }
};

// Event handlers capturing
clickBackdrop.addEventListener('mousedown', (e) => {
  if (config.inputType === 'tap' || isTouchDevice) {
    e.preventDefault();
    handlePhysicalAction();
  }
});

clickBackdrop.addEventListener('touchstart', (e) => {
  if (config.inputType === 'tap' || isTouchDevice) {
    e.preventDefault(); // Prevents scale zooming and double firing touch/mouse events
    handlePhysicalAction();
  }
}, { passive: false });

// Keypress listener (Spacebar overriding)
window.addEventListener('keydown', (e) => {
  if (activeSession.screen !== 'arena') return;
  
  if (e.code === 'Space') {
    e.preventDefault(); // Stop scrolling viewport
    
    if (config.inputType === 'space') {
      handlePhysicalAction();
    }
  }
});

function updateHUD() {
  const stats = computeSessionStats();
  
  hudTrialsCount.textContent = stats.total;
  hudLapsesCount.textContent = stats.lapses;
  hudFalseStartsCount.textContent = stats.falseStarts;
}

// --- 8. MATHEMATICAL DIAGNOSTIC MATH ---
function computeSessionStats() {
  const trials = activeSession.trials;
  
  const validTrials = trials.filter(t => t.type !== 'false-start');
  const lapses = trials.filter(t => t.type === 'lapse').length;
  const falseStarts = trials.filter(t => t.type === 'false-start').length;
  
  const meanRT = validTrials.length > 0 
    ? Math.round(validTrials.reduce((sum, t) => sum + t.rt, 0) / validTrials.length) 
    : 0;
    
  // Reciprocal Reaction Time (1/RT in seconds)
  // Evaluates reaction velocities. Crucial Sleep-Research standard because it resolves positive skewness.
  const reciprocalRT = validTrials.length > 0
    ? (validTrials.reduce((sum, t) => sum + (1000 / t.rt), 0) / validTrials.length).toFixed(2)
    : "0.00";

  // Sustained Accuracy score (false starts and lapses decay accuracy performance)
  const performanceScore = trials.length > 0
    ? ((1 - (lapses + falseStarts) / trials.length) * 100).toFixed(1)
    : "0.0";

  return { 
    meanRT, 
    lapses, 
    falseStarts, 
    reciprocalRT, 
    performanceScore, 
    total: trials.length 
  };
}

// --- 9. RESULTS DASHBOARD CONTROLLER ---
function showResultsDashboard() {
  showScreen(resultsScreen);
  
  const stats = computeSessionStats();
  
  // Save run to local database records
  saveSessionToLocalStorage(stats);
  
  // Render details card parameters
  meanRtQuick.textContent = stats.meanRT;
  lapsesQuick.textContent = stats.lapses;
  
  statMeanRT.textContent = stats.meanRT;
  statLapses.textContent = stats.lapses;
  statFalseStarts.textContent = stats.falseStarts;
  statReciprocalRT.textContent = stats.reciprocalRT;
  statPerformanceScore.textContent = stats.performanceScore;
  
  // Circular gauge display matching accuracy performance
  const scorePercent = parseFloat(stats.performanceScore);
  const strokeOffset = 264 - (264 * (scorePercent / 100));
  gaugeCircle.style.strokeDashoffset = strokeOffset;
  
  // Color code circles based on vigilance grades
  if (scorePercent >= 90) {
    gaugeCircle.style.stroke = "var(--success)";
  } else if (scorePercent >= 70) {
    gaugeCircle.style.stroke = "var(--warning)";
  } else {
    gaugeCircle.style.stroke = "var(--danger)";
  }

  // Grade classifications
  let badgeText = "OPTIMAL ALERTNESS";
  let gradeTitle = "Elite Attention Profile";
  let gradeDesc = "Your reaction times are exceptionally fast, showing zero cognitive lag, high focus resilience, and excellent circadian arousal.";
  let badgeColor = "var(--success)";
  
  if (stats.meanRT >= 340 || stats.lapses > 4 || scorePercent < 60) {
    badgeText = "CRITICAL DECAY";
    gradeTitle = "Severe Attention Deficit";
    gradeDesc = "Significant lapses of concentration and slow reaction averages suggest high fatigue or acute sleep pressure. Micro-sleep susceptibility is high.";
    badgeColor = "var(--danger)";
  } else if (stats.meanRT >= 280 || stats.lapses >= 2 || scorePercent < 85) {
    badgeText = "MODERATE FATIGUE";
    gradeTitle = "Sluggish Vigilance Curve";
    gradeDesc = "Attentional deficits and sluggish speeds observed. Consistent with mild biological sleep pressure, chronic sleep debt, or testing during circadian down-phases.";
    badgeColor = "var(--warning)";
  } else if (stats.meanRT > 0 && stats.meanRT < 245) {
    badgeText = "EXCELLENT STATUS";
    gradeTitle = "Optimal Executive Performance";
    gradeDesc = "Response speeds are consistent with high executive function, optimal neurological rest, and complete absence of sleep debt.";
    badgeColor = "var(--success)";
  }
  
  resultsBadge.textContent = badgeText;
  resultsBadge.style.color = badgeColor;
  resultsBadge.style.borderColor = badgeColor.replace(')', ', 0.35)');
  resultsBadge.style.backgroundColor = badgeColor.replace(')', ', 0.08)');
  
  resultsGradeTitle.textContent = gradeTitle;
  resultsGradeDesc.textContent = gradeDesc;
  
  // Comparative strings
  statMeanRTComp.textContent = stats.meanRT < 250 ? "Optimal (< 250ms)" : (stats.meanRT < 300 ? "Acceptable Speed" : "Sluggish Performance");
  statLapsesComp.textContent = stats.lapses === 0 ? "No lapses observed" : (stats.lapses <= 2 ? "Minor lapses (fatigue threshold)" : "Critical attention slips");
  statFalseStartsComp.textContent = stats.falseStarts === 0 ? "Optimal anticipation" : (stats.falseStarts <= 2 ? "Minor anticipations" : "High impulsivity");
  statPerfComp.textContent = scorePercent >= 90 ? "Sustained attentional accuracy" : (scorePercent >= 70 ? "Unstable attention profile" : "Compromised focus capacity");

  // Populate dynamic SVG reaction time chart
  renderVigilanceTimelineChart();
  
  // Populate diagnostic description text block
  generateDiagnosticClinicalAnalysis(stats);
  
  // Refresh localStorage log tables list
  loadSessionHistory();
}

// --- 10. DYNAMIC SVG REACTION PERFORMANCE TIMELINE CHART RENDERER ---
function renderVigilanceTimelineChart() {
  const trials = activeSession.trials;
  
  if (trials.length === 0) {
    trialChart.innerHTML = `<text x="350" y="140" fill="var(--text-muted)" text-anchor="middle" font-size="14" font-weight="600">No trials recorded in session</text>`;
    return;
  }
  
  const width = 700;
  const height = 280;
  const paddingLeft = 50;
  const paddingRight = 30;
  const paddingTop = 30;
  const paddingBottom = 40;
  
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  
  // Resolve chart scale values dynamically matching results
  // We want to scale Y up to the max reaction time. Max Y is at least 600ms to preserve context.
  const rts = trials.map(t => t.rt);
  const maxRT = Math.max(600, ...rts);
  const yMax = Math.ceil(maxRT / 100) * 100; // round up to nearest 100ms
  
  // Coordinate transformers
  const getX = (index) => {
    if (trials.length === 1) return paddingLeft + chartWidth / 2;
    return paddingLeft + (index / (trials.length - 1)) * chartWidth;
  };
  
  const getY = (rt) => {
    // Clip high outlier RTs to the chart max boundary to preserve layout visual aesthetics
    const clippedRt = Math.min(yMax, rt);
    return paddingTop + chartHeight - (clippedRt / yMax) * chartHeight;
  };

  // Build grid markers and baseline rules
  let gridLines = '';
  const divisions = 4;
  for (let i = 0; i <= divisions; i++) {
    const value = Math.round((yMax / divisions) * i);
    const yCoord = getY(value);
    
    gridLines += `
      <line x1="${paddingLeft}" y1="${yCoord}" x2="${width - paddingRight}" y2="${yCoord}" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="3 6" />
      <text x="${paddingLeft - 10}" y="${yCoord + 4}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="end" font-family="'Outfit', sans-serif">${value} ms</text>
    `;
  }
  
  // Build standard attention lapse baseline warning border (500ms line)
  const lapseY = getY(LAPSE_THRESHOLD);
  const lapseThresholdLine = `
    <g>
      <line x1="${paddingLeft}" y1="${lapseY}" x2="${width - paddingRight}" y2="${lapseY}" stroke="var(--danger)" stroke-width="1.5" stroke-dasharray="5 4" opacity="0.6" />
      <text x="${width - paddingRight - 8}" y="${lapseY - 6}" fill="var(--danger)" font-size="9" font-weight="700" text-anchor="end" font-family="'Outfit', sans-serif" opacity="0.85">Lapse Threshold (500ms)</text>
    </g>
  `;
  
  // Assemble polyline coordinate paths for valid points
  let pathPoints = [];
  let dots = '';
  
  trials.forEach((trial, index) => {
    const x = getX(index);
    
    if (trial.type === 'false-start') {
      // Plot false starts as warning orange indicator triangles at the bottom (Y=getY(0))
      const yZero = getY(0);
      dots += `
        <polygon points="${x},${yZero - 6} ${x - 5},${yZero + 4} ${x + 5},${yZero + 4}" fill="var(--warning)" />
        <circle cx="${x}" cy="${yZero}" r="12" fill="var(--warning)" opacity="0.15">
          <title>Trial ${index + 1}: False Start</title>
        </circle>
      `;
    } else {
      const y = getY(trial.rt);
      pathPoints.push(`${x},${y}`);
      
      // Determine colors based on speed thresholds
      let nodeColor = 'var(--success)';
      let hoverGlow = 'var(--success-glow)';
      
      if (trial.rt >= LAPSE_THRESHOLD) {
        nodeColor = 'var(--danger)';
        hoverGlow = 'var(--danger-glow)';
      } else if (trial.rt >= 300) {
        nodeColor = 'var(--warning)';
        hoverGlow = 'var(--warning-glow)';
      }
      
      dots += `
        <g class="chart-point">
          <circle cx="${x}" cy="${y}" r="8" fill="${nodeColor}" opacity="0.2" />
          <circle cx="${x}" cy="${y}" r="4" fill="${nodeColor}" stroke="var(--card-bg)" stroke-width="1.5" />
          <title>Trial ${index + 1}: ${trial.rt}ms (${trial.type.toUpperCase()})</title>
        </g>
      `;
    }
  });
  
  // Connect points with a polyline trace if we have multiple valid coordinates
  let linePath = '';
  if (pathPoints.length > 1) {
    linePath = `<polyline points="${pathPoints.join(' ')}" fill="none" stroke="var(--brand-primary)" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" />`;
  }
  
  // Build chart X-axis trial indicators
  let xAxisLabels = '';
  const step = Math.ceil(trials.length / 10); // cap to maximum 10 labels on X axis to avoid visual overlap
  trials.forEach((_, idx) => {
    if (idx % step === 0 || idx === trials.length - 1) {
      const x = getX(idx);
      xAxisLabels += `<text x="${x}" y="${height - 18}" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="middle" font-family="'Outfit', sans-serif">T-${idx + 1}</text>`;
    }
  });

  trialChart.innerHTML = `
    <!-- Grid System Lines -->
    ${gridLines}
    
    <!-- 500ms Attention Lapse Boundary -->
    ${lapseThresholdLine}
    
    <!-- Smooth Connected Trace Line -->
    ${linePath}
    
    <!-- SVG Nodes/Dots -->
    ${dots}
    
    <!-- X-axis Bottom Labels -->
    ${xAxisLabels}
  `;
}

// --- 11. CLINICAL SLEEP PERFORMANCE INTERPRETATION BUILDER ---
function generateDiagnosticClinicalAnalysis(stats) {
  let content = '';
  
  const scorePercent = parseFloat(stats.performanceScore);
  
  if (stats.meanRT === 0) {
    diagnosticText.innerHTML = "<p>No analytical diagnostics are available. Take the vigilance test first.</p>";
    return;
  }
  
  content += `<p>Based on your sustained attention assessment metrics, the laboratory has compiled your clinical cognitive vigilance report:</p>`;
  
  // Section A: Averages and Processing speed analysis
  if (stats.meanRT < 240) {
    content += `<p><strong>Processing Speed:</strong> Your average processing reaction velocity of <strong>${stats.meanRT}ms</strong> is **exceptional**, placing you in the top 10% of the rested cohort. Your neural conduction speeds and muscle reaction execution reflect optimal neurocognitive reserve and strong focus pathways.</p>`;
  } else if (stats.meanRT < 285) {
    content += `<p><strong>Processing Speed:</strong> Your mean reaction velocity of <strong>${stats.meanRT}ms</strong> sits within the **normal healthy baseline**. This indicates an active executive focus threshold, consistent with regular cognitive task endurance.</p>`;
  } else if (stats.meanRT < 340) {
    content += `<p><strong>Processing Speed:</strong> Your mean reaction speed is <strong>${stats.meanRT}ms</strong>. This sits at a **sluggish focus baseline**, suggesting possible fatigue, mental workload saturation, or the presence of moderate biological sleep pressure.</p>`;
  } else {
    content += `<p><strong>Processing Speed:</strong> A critical mean reaction average of <strong>${stats.meanRT}ms</strong> represents a **severe performance decay** (cognitive slowing of over 40%). Widespread slowings of this degree indicate heavy cognitive loading or physical fatigue states.</p>`;
  }
  
  // Section B: Attentional Lapses & Sleep Debt
  if (stats.lapses === 0) {
    content += `<p><strong>Concentration Stability:</strong> With **zero lapses** during this run, you demonstrated **impeccable sustained attention stability**. Focus pathway synapses are fully synced without micro-sleep drops.</p>`;
  } else if (stats.lapses <= 2) {
    content += `<p><strong>Concentration Stability:</strong> You registered <strong>${stats.lapses} attentional lapses</strong>. Occasional lapses reflect slight transient dips of vigilance (moments of blinking or minor focus slips), common when sleep debt is starting to accumulate slightly.</p>`;
  } else if (stats.lapses <= 5) {
    content += `<p><strong>Concentration Stability:</strong> Having <strong>${stats.lapses} attentional lapses</strong> indicates a **moderate sleep pressure and fatigue risk**. Attentional capacity is becoming unstable, and focus pathways are intermittently shutting down (micro-sleeps). Extreme caution should be exercised when engaging in high-precision work.</p>`;
  } else {
    content += `<p><strong>Concentration Stability:</strong> With a critical count of <strong>${stats.lapses} lapses</strong>, you are in a **lapse-prone severe sleep deficit**. Attentional lapses are frequent and severe, indicating that the brain is forcing micro-sleep episodes to offset sleep debt. Sustained mental tasks are heavily compromised.</p>`;
  }
  
  // Section C: Impulse control and Anticipations
  if (stats.falseStarts === 0) {
    content += `<p><strong>Impulse Control:</strong> You displayed **perfect impulse control** (0 false starts), meaning you reacted solely to visual triggers rather than guessing or anticipating.</p>`;
  } else if (stats.falseStarts <= 2) {
    content += `<p><strong>Impulse Control:</strong> With <strong>${stats.falseStarts} false starts</strong>, your motor response showed minor premature triggers. This reveals minor anticipation errors, which is normal as you push for faster response times.</p>`;
  } else {
    content += `<p><strong>Impulse Control:</strong> A high count of <strong>${stats.falseStarts} false starts</strong> reflects **compromised motor impulse inhibition**. Anxious anticipations suggest trying to bypass slow physical reaction speeds by guessing, indicating an unstable focus strategy.</p>`;
  }
  
  // Section D: Clinical Recommendation
  if (scorePercent >= 90) {
    content += `<p><strong>Clinical Recommendation:</strong> <strong>PASSED WITH DISTINCTION</strong>. You are at peak executive potential. High-precision duties, detailed coding, complex operations, and safety-critical tasks are optimal to perform right now.</p>`;
  } else if (scorePercent >= 70) {
    content += `<p><strong>Clinical Recommendation:</strong> <strong>CAUTION - MODERATE RISK</strong>. Focus fluctuates. Refrain from safety-critical duties. Avoid long uninterrupted driving blocks. Consider hydrating, walking under direct sunlight, or taking a short 20-minute power nap to reset sustained alertness.</p>`;
  } else {
    content += `<p><strong>Clinical Recommendation:</strong> <strong>SAFETY WARNING - CRITICAL STATE</strong>. Sleep debt or fatigue indices are exceptionally high. Highly prone to lapses of attention. It is highly recommended to suspend safety-critical operations immediately, refrain from operating machinery, and secure a full sleep recovery cycle (7.5 - 9 hours).</p>`;
  }
  
  diagnosticText.innerHTML = content;
}

// --- 12. LOCAL STORAGE DATABASE MANAGER ---
function saveSessionToLocalStorage(stats) {
  const history = JSON.parse(localStorage.getItem('pvt_history') || '[]');
  const durationSec = config.duration / 1000;
  
  const record = {
    id: Date.now(),
    dateTime: new Date().toLocaleString(undefined, { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }),
    durationLabel: durationSec === 180 ? '3m Clinical' : (durationSec === 60 ? '1m Sprint' : '30s Demo'),
    meanRT: stats.meanRT,
    lapses: stats.lapses,
    falseStarts: stats.falseStarts,
    performanceScore: stats.performanceScore
  };
  
  history.unshift(record); // Add to top
  localStorage.setItem('pvt_history', JSON.stringify(history));
}

function loadSessionHistory() {
  const history = JSON.parse(localStorage.getItem('pvt_history') || '[]');
  
  if (history.length === 0) {
    historyTableBody.innerHTML = `
      <tr>
        <td colspan="6" class="history-empty">
          No clinical logs committed yet. Complete a vigilance assessment to record your first run!
        </td>
      </tr>
    `;
    return;
  }
  
  historyTableBody.innerHTML = '';
  history.forEach(item => {
    const tr = document.createElement('tr');
    
    // Performance class indicator coloring
    const perfVal = parseFloat(item.performanceScore);
    let scoreColorClass = 'text-green';
    if (perfVal < 70) scoreColorClass = 'text-danger';
    else if (perfVal < 90) scoreColorClass = 'text-warning';
    
    tr.innerHTML = `
      <td>${item.dateTime}</td>
      <td><strong>${item.durationLabel}</strong></td>
      <td><strong>${item.meanRT} ms</strong></td>
      <td class="text-lapses">${item.lapses}</td>
      <td class="text-false-starts">${item.falseStarts}</td>
      <td><span class="${scoreColorClass}" font-weight="700">${item.performanceScore}%</span></td>
    `;
    historyTableBody.appendChild(tr);
  });
}

function clearSessionHistory() {
  if (confirm("Are you sure you want to delete all historical clinical vigilance records? This cannot be undone.")) {
    localStorage.removeItem('pvt_history');
    loadSessionHistory();
  }
}

clearHistoryBtn.addEventListener('click', clearSessionHistory);

// --- 13. POST-TEST ACTIONS CONTROL BINDINGS ---
retryTestBtn.addEventListener('click', () => {
  startTask();
});

printReportBtn.addEventListener('click', () => {
  window.print();
});

backToSetupBtn.addEventListener('click', () => {
  showScreen(configScreen);
});

// --- 14. INITIALISATION CONTROLLER ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  
  // Dynamic mobile/touch UI defaults
  if (isTouchDevice) {
    const spaceBtn = inputSelector.querySelector('[data-value="space"]');
    const tapBtn = inputSelector.querySelector('[data-value="tap"]');
    if (spaceBtn && tapBtn) {
      spaceBtn.classList.remove('active');
      tapBtn.classList.add('active');
    }
  }

  // Initialise instruction prompt text based on starting config
  if (config.inputType === 'space') {
    tapInstructionPrompt.textContent = "Press SPACEBAR when the red box turns neon and numbers count";
  } else {
    tapInstructionPrompt.textContent = "TAP OR CLICK screen when the red box turns neon and numbers count";
  }
  
  // Initially clear history empty-state trigger checking
  loadSessionHistory();
  
  // Switch immediately to initial setup view
  showScreen(configScreen);
});
