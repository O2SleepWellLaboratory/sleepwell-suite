/**
 * CircaAlign - Circadian Rhythm Alignment Tool
 * Scientifically validated reduced Morningness-Eveningness Questionnaire (rMEQ)
 */

// --- 1. QUESTION DATA ENGINE ---
const questions = [
  {
    id: 1,
    text: "Considering only your own 'feeling best' rhythm, at what time would you get up if you were entirely free to plan your day?",
    options: [
      { text: "05:00 AM - 06:30 AM", points: 5 },
      { text: "06:30 AM - 07:45 AM", points: 4 },
      { text: "07:45 AM - 09:45 AM", points: 3 },
      { text: "09:45 AM - 11:00 AM", points: 2 },
      { text: "11:00 AM - 12:00 PM (Noon)", points: 1 }
    ]
  },
  {
    id: 2,
    text: "During the first half-hour after having awakened in the morning, how tired do you feel?",
    options: [
      { text: "Very tired", points: 1 },
      { text: "Fairly tired", points: 2 },
      { text: "Fairly refreshed", points: 3 },
      { text: "Very refreshed", points: 4 }
    ]
  },
  {
    id: 3,
    text: "At what time in the evening, having no commitments, would you go to bed?",
    options: [
      { text: "08:00 PM - 09:00 PM", points: 5 },
      { text: "09:00 PM - 10:15 PM", points: 4 },
      { text: "10:15 PM - 12:30 AM (Midnight)", points: 3 },
      { text: "12:30 AM - 01:45 AM", points: 2 },
      { text: "01:45 AM - 03:00 AM", points: 1 }
    ]
  },
  {
    id: 4,
    text: "At what time of the day do you think that you reach your 'feeling best' peak?",
    options: [
      { text: "05:00 AM - 08:00 AM", points: 5 },
      { text: "08:00 AM - 10:00 AM", points: 4 },
      { text: "10:00 AM - 05:00 PM", points: 3 },
      { text: "05:00 PM - 10:00 PM", points: 2 },
      { text: "10:00 PM - 05:00 AM", points: 1 }
    ]
  },
  {
    id: 5,
    text: "One hears about 'morning' and 'evening' types of people. Which one of these types do you consider yourself to be?",
    options: [
      { text: "Definitely a morning type", points: 6 },
      { text: "More a morning than an evening type", points: 4 },
      { text: "More an evening than a morning type", points: 2 },
      { text: "Definitely an evening type", points: 0 }
    ]
  }
];

// --- 2. STATE CONSTANTS & VARIABLES ---
let currentQuestionIdx = 0;
let answers = Array(questions.length).fill(null); // stores selected option index for each question

// Chronotype classifications metadata
const CHRONOTYPES = {
  LARK: {
    name: "Morning Lark",
    scoreRange: "18 - 25",
    accentColor: "var(--accent-morning)",
    accentRgb: "var(--accent-morning-rgb)",
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <circle cx="12" cy="12" r="5" />
                <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>`,
    description: "Morning types (Larks) typically experience high alertness and energy in the early hours. They wake up refreshed, reach their cognitive peak by mid-morning, and naturally wind down early in the evening. Waking early feels easy and biological schedules align well with traditional solar days.",
    sleepSchedule: { bed: "10:00 PM", wake: "06:00 AM", bedH: 22.0, wakeH: 6.0 },
    recommendations: [
      { title: "Cortisol & Sunlight Anchor", time: "06:00 AM", desc: "Get 10 minutes of direct bright solar light immediately after rising. This triggers immediate cortisol release and puts a hard stop on melatonin production, cementing your early-phase schedule." },
      { title: "Peak Cognitive Window", time: "08:00 AM - 12:00 PM", desc: "Your logical capacity, high-focus planning, and analytical processing peak during these morning hours. Dedicate this block to intense mental projects, system design, or complex engineering tasks." },
      { title: "Coordination & Cardio Peak", time: "03:30 PM - 05:30 PM", desc: "Core body temperature and muscular efficiency peak around late afternoon, making this the safest and most efficient time for heavy muscle-building exercises or cardio workouts." },
      { title: "Circadian Wind-Down", time: "08:30 PM - 10:00 PM", desc: "Dim all ambient screens and activate amber lighting. Melatonin begins natural secretion around 8:00 PM. A cool, dark room will help you glide into deep delta sleep by 10:00 PM." }
    ]
  },
  BEAR: {
    name: "Intermediate Bear",
    scoreRange: "12 - 17",
    accentColor: "var(--accent-bear)",
    accentRgb: "var(--accent-bear-rgb)",
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/>
                <circle cx="12" cy="12" r="4" />
                <path d="M12 6c-3.3 0-6 2.7-6 6" />
              </svg>`,
    description: "Intermediate types (Bears/Hummingbirds) follow the standard cycle of the sun. Alertness builds gradually through the morning, peaks mid-day, and declines in the late evening. Waking up requires a brief adjustment period, and they thrive on a stable 8-hour sleep/wake routine.",
    sleepSchedule: { bed: "11:30 PM", wake: "07:30 AM", bedH: 23.5, wakeH: 7.5 },
    recommendations: [
      { title: "Gradual Awakening & Hydration", time: "07:30 AM", desc: "Allow 20 minutes to shake off sleep inertia. Hydrate immediately with 500ml of water and seek natural ambient light to reset your circadian master clock." },
      { title: "Primary analytical block", time: "09:30 AM - 12:30 PM", desc: "Your highest level of mental precision and rapid reasoning occurs before lunch. Focus on critical code architectural work, writing, or strategic calls." },
      { title: "Secondary Focus / Brainstorming", time: "02:30 PM - 04:30 PM", desc: "After the standard post-lunch physiological dip, alertness rebounds in a creative way. Great for collaborative brainstorming, design reviews, or lighter administrative work." },
      { title: "Evening Relaxation Cycle", time: "10:30 PM - 11:30 PM", desc: "Melatonin secretion rises. Wind down by turning off active computer screens, lowering light temperature, and cooling down your room to 18°C (65°F) for optimal sleep cycles." }
    ]
  },
  OWL: {
    name: "Evening Owl",
    scoreRange: "4 - 11",
    accentColor: "var(--accent-evening)",
    accentRgb: "var(--accent-evening-rgb)",
    svgIcon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
              </svg>`,
    description: "Evening types (Owls) experience a phase-delayed circadian rhythm. Alertness increases progressively throughout the day and peaks in the late afternoon and night. Early mornings are typically marked by grogginess (sleep inertia), whereas late-night hours offer profound focus, flow state, and creative energy.",
    sleepSchedule: { bed: "01:30 AM", wake: "09:30 AM", bedH: 1.5, wakeH: 9.5 },
    recommendations: [
      { title: "Delayed Light exposure", time: "09:30 AM", desc: "Upon waking, flood your room with bright light (use a 10,000-lux lamp if solar light isn't fully available) to accelerate the clearance of residual sleep melatonin." },
      { title: "Creative Alertness Peak", time: "05:00 PM - 09:00 PM", desc: "Unlike Larks, your brain reaches maximum executive power, problem-solving, and cognitive fluid reasoning late in the day. Use this window for deep coding, engineering, or complex design work." },
      { title: "Late-Phase Physical Peak", time: "06:00 PM - 08:30 PM", desc: "Your coordination, cardiovascular capacity, and body temperature peak significantly later. Heavy weight training or high-intensity exercise is optimal and safe during these evening blocks." },
      { title: "Deep Night Wind-down", time: "12:00 AM - 01:30 AM", desc: "As your peak winds down, signal sleep to your system. Ban blue screens entirely, utilize warm sunset orange lighting, and practice deep box breathing to lower your heart rate." }
    ]
  }
};

// --- 3. DOM ELEMENT REFERENCES ---
// Layout Containers
const heroSection = document.getElementById('heroSection');
const quizSection = document.getElementById('quizSection');
const resultsSection = document.getElementById('resultsSection');
const historySection = document.getElementById('historySection');

// Hero Interaction
const startQuizBtn = document.getElementById('startQuizBtn');
const viewHistoryQuickBtn = document.getElementById('viewHistoryQuickBtn');
const logoLink = document.getElementById('logoLink');
const scrollToTopLink = document.getElementById('scrollToTopLink');

// Quiz Elements
const currentQuestionNum = document.getElementById('currentQuestionNum');
const progressBarFill = document.getElementById('progressBarFill');
const quitQuizBtn = document.getElementById('quitQuizBtn');
const questionText = document.getElementById('questionText');
const optionsList = document.getElementById('optionsList');
const prevQuestionBtn = document.getElementById('prevQuestionBtn');
const nextQuestionBtn = document.getElementById('nextQuestionBtn');

// Dashboard Results Elements
const chronotypeScore = document.getElementById('chronotypeScore');
const chronotypeDesc = document.getElementById('chronotypeDesc');
const illustrationCard = document.getElementById('illustrationCard');
const illustrationIconWrapper = document.getElementById('illustrationIconWrapper');
const illustrationLabel = document.getElementById('illustrationLabel');
const optimalBedtime = document.getElementById('optimalBedtime');
const optimalWakeTime = document.getElementById('optimalWakeTime');
const circadianChart = document.getElementById('circadianChart');
const recommendationsList = document.getElementById('recommendationsList');
const retakeQuizBtn = document.getElementById('retakeQuizBtn');
const printReportBtn = document.getElementById('printReportBtn');

// History Elements
const clearHistoryBtn = document.getElementById('clearHistoryBtn');
const historyList = document.getElementById('historyList');

// Theme Toggle
const themeToggleBtn = document.getElementById('themeToggleBtn');
const sunIcon = themeToggleBtn.querySelector('.sun-icon');
const moonIcon = themeToggleBtn.querySelector('.moon-icon');

// --- 4. THEME CONTROLLER ---
function initTheme() {
  const savedTheme = localStorage.getItem('circaAlign_theme') || 'dark';
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
  localStorage.setItem('circaAlign_theme', newTheme);
  
  if (newTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }
});

// --- 5. HERO DECORATIVE CLOCK ANIMATOR ---
function initHeroClock() {
  const clockTimeEl = document.getElementById('heroTimeIndicator');
  const clockBadgeEl = document.getElementById('heroClockState');
  const clockSvgEl = document.querySelector('.clock-center-art svg');
  
  const clockStates = [
    { 
      time: '07:30 AM', 
      text: 'Melatonin Ceases', 
      color: 'var(--accent-morning)',
      svg: `<circle cx="12" cy="12" r="5" /><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />`
    },
    { 
      time: '10:00 AM', 
      text: 'Peak Alertness', 
      color: 'var(--accent-bear)',
      svg: `<path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="M12 6v6l4 2" />`
    },
    { 
      time: '02:30 PM', 
      text: 'Coordination High', 
      color: 'var(--brand-secondary)',
      svg: `<path d="M22 12h-4l-3 9L9 3l-3 9H2" />`
    },
    { 
      time: '05:30 PM', 
      text: 'Best Cardio State', 
      color: 'var(--accent-morning)',
      svg: `<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />`
    },
    { 
      time: '09:00 PM', 
      text: 'Melatonin Begins', 
      color: 'var(--accent-evening)',
      svg: `<path d="M12 2a10 10 0 1 0 10 10H12V2z" /><path d="M12 2a10 10 0 0 1 10 10h-10V2z" opacity="0.3" />`
    },
    { 
      time: '02:00 AM', 
      text: 'Deepest Sleep Trough', 
      color: 'var(--text-muted)',
      svg: `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />`
    }
  ];
  
  let currentIndex = 0;
  
  setInterval(() => {
    currentIndex = (currentIndex + 1) % clockStates.length;
    const currentState = clockStates[currentIndex];
    
    if (clockTimeEl) {
      clockTimeEl.textContent = currentState.time;
      clockTimeEl.style.color = currentState.color;
    }
    
    if (clockBadgeEl) {
      clockBadgeEl.textContent = currentState.text;
      clockBadgeEl.style.color = currentState.color;
      clockBadgeEl.style.borderColor = currentState.color.replace(')', ', 0.35)');
      clockBadgeEl.style.backgroundColor = currentState.color.replace(')', ', 0.08)');
    }
    
    if (clockSvgEl) {
      clockSvgEl.innerHTML = currentState.svg;
      clockSvgEl.setAttribute('stroke', currentState.color);
      clockSvgEl.style.filter = `drop-shadow(0 0 8px ${currentState.color.replace(')', ', 0.45)')})`;
    }
  }, 3500);
}

// --- 6. STATE TRANSITIONS & SCREEN SWITCHES ---
function showScreen(screen) {
  // Hide all screens
  heroSection.classList.add('hidden');
  quizSection.classList.add('hidden');
  resultsSection.classList.add('hidden');
  
  // Show target screen
  screen.classList.remove('hidden');
  
  // Ensure the history section is only visible when NOT in the active quiz
  if (screen === quizSection) {
    historySection.classList.add('hidden');
  } else {
    historySection.classList.remove('hidden');
    loadHistory(); // load history when going back to dashboards or home
  }
}

// --- 7. QUIZ STATE MACHINE ---
function startQuiz() {
  currentQuestionIdx = 0;
  answers = Array(questions.length).fill(null);
  showScreen(quizSection);
  renderQuestion();
}

function quitQuiz() {
  if (confirm("Are you sure you want to quit the assessment? Your progress will be lost.")) {
    showScreen(heroSection);
  }
}

function renderQuestion() {
  const q = questions[currentQuestionIdx];
  
  // Update Steps & Progress Bar
  currentQuestionNum.textContent = currentQuestionIdx + 1;
  const progressPercent = ((currentQuestionIdx + 1) / questions.length) * 100;
  progressBarFill.style.width = `${progressPercent}%`;
  
  // Update Question Text
  questionText.textContent = q.text;
  
  // Render Options
  optionsList.innerHTML = '';
  q.options.forEach((opt, idx) => {
    const optionEl = document.createElement('div');
    optionEl.className = 'option-item';
    if (answers[currentQuestionIdx] === idx) {
      optionEl.classList.add('selected');
    }
    
    optionEl.innerHTML = `
      <span class="option-label">${opt.text}</span>
      <span class="option-check">
        <svg viewBox="0 0 24 24">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
    `;
    
    optionEl.addEventListener('click', () => selectOption(idx));
    optionsList.appendChild(optionEl);
  });
  
  // Update Navigation Buttons
  if (currentQuestionIdx === 0) {
    prevQuestionBtn.classList.add('hidden');
  } else {
    prevQuestionBtn.classList.remove('hidden');
  }
  
  // Check if option is selected
  const hasSelection = answers[currentQuestionIdx] !== null;
  nextQuestionBtn.disabled = !hasSelection;
  
  if (currentQuestionIdx === questions.length - 1) {
    nextQuestionBtn.innerHTML = `
      View Results
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
      </svg>
    `;
  } else {
    nextQuestionBtn.innerHTML = `
      Next
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
        <polyline points="12 5 19 12 12 19"></polyline>
      </svg>
    `;
  }
}

function selectOption(optIdx) {
  // Update answer in state
  answers[currentQuestionIdx] = optIdx;
  
  // Re-render options to show selection visual instantly
  const children = optionsList.children;
  for (let i = 0; i < children.length; i++) {
    if (i === optIdx) {
      children[i].classList.add('selected');
    } else {
      children[i].classList.remove('selected');
    }
  }
  
  // Enable next button
  nextQuestionBtn.disabled = false;
  
  // Auto-advance with a slight delay for rich tactile feedback
  setTimeout(() => {
    if (currentQuestionIdx === optIdx && currentQuestionIdx < questions.length - 1) {
      // only advance if the selected question state hasn't changed in between
      advanceQuestion();
    }
  }, 350);
}

function advanceQuestion() {
  if (currentQuestionIdx < questions.length - 1) {
    currentQuestionIdx++;
    renderQuestion();
  } else {
    calculateResults();
  }
}

function retreatQuestion() {
  if (currentQuestionIdx > 0) {
    currentQuestionIdx--;
    renderQuestion();
  }
}

// --- 8. RESULTS ENGINE ---
function calculateResults() {
  // Calculate raw score
  let totalScore = 0;
  questions.forEach((q, qIdx) => {
    const selectedOptIdx = answers[qIdx];
    if (selectedOptIdx !== null) {
      totalScore += q.options[selectedOptIdx].points;
    }
  });
  
  // Determine Chronotype Classification
  let typeKey = "BEAR";
  if (totalScore >= 18) {
    typeKey = "LARK";
  } else if (totalScore <= 11) {
    typeKey = "OWL";
  }
  
  const chronotype = CHRONOTYPES[typeKey];
  
  // Display Results
  chronotypeScore.textContent = totalScore;
  
  // Set up header title and colors dynamically
  const resultTitleEl = document.querySelector('.chronotype-title');
  if (resultTitleEl) {
    resultTitleEl.innerHTML = `You are an <span>${chronotype.name}</span>`;
    const titleSpan = resultTitleEl.querySelector('span');
    if (titleSpan) {
      titleSpan.style.background = `linear-gradient(135deg, ${chronotype.accentColor}, var(--text-primary))`;
      titleSpan.style.webkitBackgroundClip = 'text';
      titleSpan.style.webkitTextFillColor = 'transparent';
    }
  }
  
  chronotypeDesc.textContent = chronotype.description;
  
  // Update illustration card styling variables dynamically
  illustrationCard.style.setProperty('--accent-color', chronotype.accentColor);
  illustrationCard.style.setProperty('--accent-rgb', chronotype.accentRgb);
  illustrationIconWrapper.innerHTML = `
    ${chronotype.svgIcon}
    <span class="illustration-label" style="color: ${chronotype.accentColor}">${chronotype.name}</span>
  `;
  
  // Set Bed and Wake Times
  optimalBedtime.textContent = chronotype.sleepSchedule.bed;
  optimalWakeTime.textContent = chronotype.sleepSchedule.wake;
  
  // Generate Core Alignment Recommendations list
  recommendationsList.innerHTML = '';
  chronotype.recommendations.forEach(rec => {
    const recEl = document.createElement('div');
    recEl.className = 'recommendation-item';
    recEl.style.borderLeftColor = chronotype.accentColor;
    
    recEl.innerHTML = `
      <div class="recommendation-heading">
        <h4 class="recommendation-title">${rec.title}</h4>
        <span class="recommendation-time" style="color: ${chronotype.accentColor}; background: ${chronotype.accentColor.replace(')', ', 0.12)')}">${rec.time}</span>
      </div>
      <p class="recommendation-desc">${rec.desc}</p>
    `;
    recommendationsList.appendChild(recEl);
  });
  
  // Render Dynamic Circadian Graph Wave
  renderCircadianChart(chronotype, totalScore);
  
  // Save to history storage
  saveResultToHistory(chronotype.name, totalScore, chronotype.accentColor);
  
  // Transition View
  showScreen(resultsSection);
  
  // Smooth scroll to top of dashboard
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// --- 9. CIRCADIAN WAVEFORM GRAPH GENERATOR ---
function renderCircadianChart(chronotype, score) {
  // Determine phase shift from score linear interpolation
  // Score 4 is full owl (peak hour 9:00 PM / 21h)
  // Score 25 is full lark (peak hour 8:00 AM / 8h)
  const fraction = (score - 4) / 21;
  const peakHour = 21.0 - fraction * 13.0; // scales from 21 to 8
  const troughHour = (peakHour + 12) % 24;
  
  const bedH = chronotype.sleepSchedule.bedH;
  const wakeH = chronotype.sleepSchedule.wakeH;
  
  // Helper to format hours in graph peak dots
  const formatGraphHour = (h) => {
    let hrs = Math.floor(h) % 24;
    let mins = Math.round((h % 1) * 60);
    let am = hrs < 12 ? 'AM' : 'PM';
    let displayHrs = hrs % 12;
    displayHrs = displayHrs === 0 ? 12 : displayHrs;
    let displayMins = mins < 10 ? '0' + mins : mins;
    return `${displayHrs}:${displayMins} ${am}`;
  };

  // Generate sleep zone SVG rectangles
  let sleepZonesHtml = '';
  const sleepColor = "var(--accent-evening)";
  
  if (bedH > wakeH) {
    // Bedtime wraps midnight (e.g. Bed 11:30 PM (23.5h) to Wake 7:30 AM (7.5h))
    const rect1X = bedH * 25;
    const rect1W = (24 - bedH) * 25;
    const rect2X = 0;
    const rect2W = wakeH * 25;
    
    sleepZonesHtml = `
      <rect x="${rect1X}" y="20" width="${rect1W}" height="180" fill="url(#sleepGradient)" />
      <rect x="${rect2X}" y="20" width="${rect2W}" height="180" fill="url(#sleepGradient)" />
      <!-- Dotted separators for sleep start/end -->
      <line x1="${rect1X}" y1="20" x2="${rect1X}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="${rect2W}" y1="20" x2="${rect2W}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      
      <text x="${rect1X - 8}" y="35" fill="var(--text-muted)" font-size="10" font-weight="600" text-anchor="end" opacity="0.8">Sleep Window</text>
    `;
  } else {
    // Sleep window entirely inside one day (e.g. Owl sleep 1:30 AM (1.5) to 9:30 AM (9.5))
    const rectX = bedH * 25;
    const rectW = (wakeH - bedH) * 25;
    
    sleepZonesHtml = `
      <rect x="${rectX}" y="20" width="${rectW}" height="180" fill="url(#sleepGradient)" />
      <line x1="${rectX}" y1="20" x2="${rectX}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      <line x1="${rectX + rectW}" y1="20" x2="${rectX + rectW}" y2="200" stroke="${sleepColor}" stroke-opacity="0.3" stroke-width="1.5" stroke-dasharray="3 3" />
      
      <text x="${rectX + 8}" y="35" fill="var(--text-muted)" font-size="10" font-weight="600" opacity="0.8">Sleep Window</text>
    `;
  }

  // Construct Alarm alertness wave path points
  // Baseline alertness is Y=110. Amplitude is 50. Wave peaks up (Y=60), and troughs down (Y=160).
  let wavePoints = [];
  for (let h = 0; h <= 24; h += 0.15) {
    let x = h * 25;
    let y = 110 - 50 * Math.cos((2 * Math.PI * (h - peakHour)) / 24);
    wavePoints.push({ x, y });
  }

  let pathD = `M ${wavePoints[0].x} ${wavePoints[0].y}`;
  for (let i = 1; i < wavePoints.length; i++) {
    pathD += ` L ${wavePoints[i].x} ${wavePoints[i].y}`;
  }

  const fillD = pathD + " L 600 200 L 0 200 Z";
  
  // Calculate Peak and Trough coordinates
  const peakX = peakHour * 25;
  const peakY = 110 - 50 * Math.cos(0); // Y = 60
  
  const troughX = troughHour * 25;
  const troughY = 110 - 50 * Math.cos(Math.PI); // Y = 160

  circadianChart.innerHTML = `
    <defs>
      <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${chronotype.accentColor}" stop-opacity="0.35" />
        <stop offset="100%" stop-color="${chronotype.accentColor}" stop-opacity="0.0" />
      </linearGradient>
      <linearGradient id="sleepGradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="var(--accent-evening)" stop-opacity="0.12" />
        <stop offset="100%" stop-color="var(--accent-evening)" stop-opacity="0.02" />
      </linearGradient>
    </defs>

    <!-- Sleep zones -->
    ${sleepZonesHtml}

    <!-- Grid Horizontal Lines -->
    <line x1="0" y1="20" x2="600" y2="20" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="2 4" />
    <line x1="0" y1="110" x2="600" y2="110" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="4 8" />
    <line x1="0" y1="200" x2="600" y2="200" stroke="var(--card-border)" stroke-width="1.2" />

    <!-- Grid Vertical Lines for 6h periods -->
    <line x1="0" y1="20" x2="0" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="150" y1="20" x2="150" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="300" y1="20" x2="300" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="450" y1="20" x2="450" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />
    <line x1="600" y1="20" x2="600" y2="200" stroke="var(--card-border)" stroke-width="1" stroke-dasharray="1 3" />

    <!-- Grid Axis Labels -->
    <text x="5" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif">12 AM</text>
    <text x="150" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">6 AM</text>
    <text x="300" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">12 PM</text>
    <text x="450" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">6 PM</text>
    <text x="595" y="218" fill="var(--text-muted)" font-size="11" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="end">12 AM</text>

    <!-- Wave Shaded Area -->
    <path d="${fillD}" fill="url(#waveGradient)" />

    <!-- Wave Line -->
    <path d="${pathD}" fill="none" stroke="${chronotype.accentColor}" stroke-width="3.5" stroke-linecap="round" />

    <!-- Trough Indicator -->
    <g transform="translate(${troughX}, ${troughY})">
      <circle r="4" fill="var(--text-muted)" stroke="var(--card-border)" stroke-width="1.5" />
      <text y="18" fill="var(--text-muted)" font-size="10" font-weight="600" font-family="'Outfit', sans-serif" text-anchor="middle">Alertness Trough</text>
    </g>

    <!-- Peak Alertness Indicator -->
    <g transform="translate(${peakX}, ${peakY})">
      <circle r="9" fill="${chronotype.accentColor}" opacity="0.3">
        <animate attributeName="r" values="7;13;7" dur="3.5s" repeatCount="indefinite" />
      </circle>
      <circle r="4.5" fill="${chronotype.accentColor}" stroke="var(--text-primary)" stroke-width="1.5" />
      <text y="-14" fill="var(--text-primary)" font-size="11" font-weight="700" font-family="'Outfit', sans-serif" text-anchor="middle">Peak Alertness (${formatGraphHour(peakHour)})</text>
    </g>
  `;
}

// --- 10. LOCAL STORAGE HISTORY ENGINE ---
function saveResultToHistory(chronotypeName, score, accentColor) {
  const history = JSON.parse(localStorage.getItem('circaAlign_history') || '[]');
  const record = {
    id: Date.now(),
    date: new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }),
    chronotype: chronotypeName,
    score: score,
    color: accentColor
  };
  
  history.unshift(record); // Add to beginning
  localStorage.setItem('circaAlign_history', JSON.stringify(history));
}

function loadHistory() {
  const history = JSON.parse(localStorage.getItem('circaAlign_history') || '[]');
  
  if (history.length === 0) {
    renderEmptyHistoryState();
    return;
  }
  
  historyList.innerHTML = '';
  history.forEach(item => {
    const itemEl = document.createElement('div');
    itemEl.className = 'history-item';
    
    // Assign custom styling variable for appropriate border and text colors
    itemEl.style.setProperty('--accent-color', item.color);
    
    itemEl.innerHTML = `
      <div class="history-meta">
        <span class="history-date">${item.date}</span>
        <span class="history-chronotype" style="color: ${item.color}">${item.chronotype}</span>
      </div>
      <div class="history-score-display">
        <span class="history-score">${item.score}<span>/25</span></span>
      </div>
    `;
    
    historyList.appendChild(itemEl);
  });
}

function renderEmptyHistoryState() {
  historyList.innerHTML = `
    <div class="empty-history-state">
      <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.5">
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </svg>
      <p>No assessment records yet. Take the rMEQ questionnaire to save your first result!</p>
    </div>
  `;
}

function clearHistory() {
  if (confirm("Are you sure you want to clear all history records? This cannot be undone.")) {
    localStorage.removeItem('circaAlign_history');
    loadHistory();
  }
}

// --- 11. EVENT LISTENERS SETUP ---
startQuizBtn.addEventListener('click', startQuiz);

viewHistoryQuickBtn.addEventListener('click', () => {
  historySection.scrollIntoView({ behavior: 'smooth' });
});

quitQuizBtn.addEventListener('click', quitQuiz);

prevQuestionBtn.addEventListener('click', retreatQuestion);

nextQuestionBtn.addEventListener('click', () => {
  if (answers[currentQuestionIdx] !== null) {
    advanceQuestion();
  }
});

retakeQuizBtn.addEventListener('click', startQuiz);

printReportBtn.addEventListener('click', () => {
  window.print();
});

clearHistoryBtn.addEventListener('click', clearHistory);

// Smooth logo scroll
logoLink.addEventListener('click', (e) => {
  if (!quizSection.classList.contains('hidden')) {
    e.preventDefault();
    if (confirm("Quit active questionnaire and visit O₂ Sleepwell Laboratory?")) {
      window.open(logoLink.href, '_blank');
      showScreen(heroSection);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }
  // Otherwise, the default anchor behavior opens the external URL in a new tab naturally.
});

scrollToTopLink.addEventListener('click', (e) => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- 12. INITIALIZATION ENGINE ---
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initHeroClock();
  loadHistory();
  
  // Initially show Hero
  showScreen(heroSection);
});
