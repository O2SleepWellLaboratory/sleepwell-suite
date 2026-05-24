/* ==========================================================================
   O₂ SleepWell Laboratory - Trail Making Test (TMT) Client Engine
   ========================================================================== */

// --- 1. INTERNATIONALIZATION (I18N) DICTIONARIES ---
const I18N_DICTS = {
  en: {
    navTag: "Clinical Diagnostic",
    badgeText: "Executive Cognition Audit",
    landingTitle: "Map Your <span>Task Switching Flexibility</span>",
    landingDesc: "Obstructive Sleep Apnea (OSA) interrupts breathing and fragments deep delta sleep. This creates structural hypoxia, resulting in 'brain fog' that severely slows executive function, scanning speed, and task-switching stamina. The Trail Making Test (TMT) measures your ability to switch cognitive pathways rapidly.",
    info1Title: "Process C, Process S & Brain Fog",
    info1Desc: "When Process S (homeostatic sleep pressure) remains abnormally high due to sleep apnea, attentional lapses spike, and task alternation efficiency drops. The TMT Part A measures basic motor/scanning speed, while Part B tests complex cognitive control.",
    info1Trans: "When sleep apnea causes homeostatic sleep pressure to be abnormally high, attentional micro-sleep lapses spike, and multitasking efficiency drops. Part A measures basic response speed, while Part B tests complex set-shifting control.",
    info2Title: "Clinical Recovery & Diagnostics",
    info2Desc: "Targeted therapeutic care (such as CPAP) increases oxygenation, clears neural somnogen accumulation, restores slow-wave delta cycles, and quickly returns cognitive switching flexibility back to optimal baseline levels.",
    info2Trans: "Proper therapy (such as CPAP) raises blood oxygen, clears synaptic somnogen accumulation, restores deep delta sleep, and rapidly returns your task-switching flexibility to its optimal baseline.",
    configTitle: "Patient Profile",
    configSubtitle: "Configure basic clinical parameters to retrieve age and education matched norm statistics.",
    labelAge: "Chronological Age",
    labelEdu: "Education Level",
    eduLowPrimary: "Less than 12 Yrs",
    eduLowSub: "Under 12 Years Education",
    eduHighPrimary: "12+ Years",
    eduHighSub: "12+ Years Education",
    btnNextStart: "Start Assessment",
    instrTitleA: "Instructions: Part A",
    instrTitleB: "Instructions: Part B",
    instrTextA: "Connect circles 1 to 25 in consecutive numerical order (1 -> 2 -> 3...) as fast as possible without making mistakes.",
    instrTextB: "Alternate between numbers and letters in consecutive order (1 -> A -> 2 -> B -> 3 -> C...) as fast as possible without making mistakes.",
    instrTip: "Tip: The test can be restarted at any time using the Reset button in the top right corner of the screen.",
    instrCitationTextA: "Reference: Reitan RM. (1958). Relation of Trail Making Test to organic brain damage. J Clin Psychol.",
    instrCitationTextB: "Reference: Decary A, et al. (2000). Cognitive deficits in sleep apnea sufferers. Sleep.",
    btnStartReadyText: "I am Ready / Start",
    btnArenaReset: "Reset",
    btnArenaQuit: "Quit",
    testInstrA: "Connect 1 to 25",
    testInstrB: "Alternate 1-A-2-B...",
    reportMainTitle: "Cognitive Flexibility",
    reportSubTitle: "Sleepwell Clinical Report",
    statLblRatio: "Brain Shifting Ratio",
    statLblSpeeda: "Part A Speed",
    statLblSpeedb: "Part B Speed",
    resErrors: "Errors",
    resPeerLbl: "Peer Comparison (Part B)",
    percentileAverage: "average",
    percentileExplanation: "Your visual scanning and executive attention speed are faster than <strong>{pct}%</strong> of people your age and education level. (50th represents the biological average).",
    percentileNote: "<strong>Clinical Note:</strong> Sleep fragmentation and hypoxemia from Obstructive Sleep Apnea frequently impair 'set-shifting' flexibility, driving the B/A Ratio above 3.0. Targeted treatments like CPAP restore this cognitive balance.",
    chartLblTitle: "Attention Stamina Wave",
    chartLblDesc: "Alternation click speed timeline",
    histLblTitle: "Clinical History Log",
    histLblClear: "Clear Records",
    thDatetime: "Date & Time",
    thSpeeda: "Part A",
    thSpeedb: "Part B",
    thRatio: "Ratio",
    thStatus: "Status",
    btnExportPhoto: "Export Lab Report Photo",
    btnRestartAssessment: "Retake Assessment",
    btnReturnHub: "Return to Clinical Hub Dashboard",
    overlayGuideMsg: "Long-press image to save report <span>长按图片并选择“存储图像”以保存临床报告</span>",
    overlayBtnClose: "Close / 关闭",
    statusNormal: "NORMAL",
    statusAbnormal: "ABNORMAL",
    alertQuitConfirm: "Are you sure you want to quit the current session? Progress will be lost.",
    clinicalNormalDesc: "Normal cognitive shifting speed. Low probability of sleep apnea-induced executive cognitive fog.",
    clinicalAbnormalDesc: "Task shifting delay (Ratio >= 3.0). High probability of moderate-to-severe sleep fragmentation or hypoxia-induced executive fog.",
    clinicalAwaiting: "Complete Part B to retrieve full summary ratio."
  },
  zh: {
    navTag: "临床认知诊断",
    badgeText: "脑部执行力测试",
    landingTitle: "测量您的 <span>大脑思维切换灵活性</span>",
    landingDesc: "阻塞性睡眠呼吸暂停 (OSA) 会导致夜间呼吸中断并割裂深层睡眠。这会引发慢性的脑部缺氧，进而形成“脑雾”，严重拉低执行决策力、视觉搜索速度以及在多重任务间切换的反应速度。本 Trail Making Test (TMT) 测验专门评估脑部切换任务的柔韧性。",
    info1Title: "睡眠过程 Process C / S 与脑雾",
    info1Desc: "当睡眠呼吸暂停导致 homeostatic 睡眠压力异常偏高时，大脑的注意力会出现微睡眠流失，执行多线任务的能力显著下降。测试 A 测量基础反应力，而测试 B 测量复杂控制力。",
    info1Trans: "当睡眠呼吸暂停导致机体 homeostatic 睡眠压力过大时，注意力会瞬间流失，多任务切换效率暴跌。Part A 测基础反应，Part B 测复杂执行切换。",
    info2Title: "临床康复与恢复诊断",
    info2Desc: "针对性的气道正压治疗（如使用呼吸机 CPAP）能提高血液氧含量，清除脑部腺苷酸堆积，有效恢复深度慢波睡眠，让您的多线思维效率在短期内显著恢复。",
    info2Trans: "呼吸机 CPAP 治疗能大幅增加供氧，加速清除腺苷酸，重塑深睡周期，使大脑的多任务处理灵活性快速重回巅峰。",
    configTitle: "受试者个人资料",
    configSubtitle: "请输入真实年龄与受教育程度，系统将匹配同龄及同等教育水平的临床常模基准。",
    labelAge: "年龄",
    labelEdu: "教育程度",
    eduLowPrimary: "12年以下教育",
    eduLowSub: "相当于初中及以下学历",
    eduHighPrimary: "12年以上教育",
    eduHighSub: "高中、大专、本科及以上",
    btnNextStart: "开始认知测评",
    instrTitleA: "测验说明: Part A",
    instrTitleB: "测验说明: Part B",
    instrTextA: "请以最快速度且不犯错地，按数字从小到大顺序 (1 -> 2 -> 3... -> 25) 依次点击圆圈连线。",
    instrTextB: "请以最快速度且不犯错地，交替按数字和字母从小到大顺序 (1 -> A -> 2 -> B -> 3 -> C... -> 13) 依次点击圆圈连线。",
    instrTip: "提示：如果您在测验中途受到干扰，可随时点击右上角的“Reset/重置”按钮重新开始。",
    instrCitationTextA: "文献引用: Reitan RM. (1958). Trail Making Test 脑部损伤灵敏度研究. J Clin Psychol.",
    instrCitationTextB: "文献引用: Decary A, et al. (2000). 睡眠呼吸暂停患者多任务切换认知缺陷研究. Sleep.",
    btnStartReadyText: "我准备好了 / 开始",
    btnArenaReset: "重置",
    btnArenaQuit: "退出",
    testInstrA: "依次连接 1 到 25",
    testInstrB: "交替连接 1-A-2-B...",
    reportMainTitle: "认知切换能力报告",
    reportSubTitle: "Sleepwell 实验室临床报告",
    statLblRatio: "切换效率比 Ratio",
    statLblSpeeda: "Part A 速度",
    statLblSpeedb: "Part B 速度",
    resErrors: "错误",
    resPeerLbl: "同龄常模比较 (Part B)",
    percentileAverage: "平均",
    percentileExplanation: "在同年龄和同等教育水平的人群中，您的反应与扫描速度快于 <strong>{pct}%</strong> 的受试者。（50% 为正常人平均水平）。",
    percentileNote: "<strong>临床提示：</strong> 睡眠呼吸暂停 (OSA) 导致的睡眠片段化与低氧血症，常选择性损害前额叶的“多线控制灵活性”，使 B/A 比例拉高至 3.0 以上。使用 CPAP 呼吸机治疗可以有效消除脑雾，恢复切换常态。",
    chartLblTitle: "注意力耐力波动图",
    chartLblDesc: "记录每次连线用时的波动状况 (秒)",
    histLblTitle: "历史测评记录",
    histLblClear: "清除历史",
    thDatetime: "测试时间",
    thSpeeda: "Part A 用时",
    thSpeedb: "Part B 用时",
    thRatio: "比率 (B/A)",
    thStatus: "临床结论",
    btnExportPhoto: "保存临床报告图片",
    btnRestartAssessment: "重新测评",
    btnReturnHub: "返回 Clinical Hub 临床中心",
    overlayGuideMsg: "长按图片并选择“存储图像” <span>或右键另存为图片，以保存您的临床测评报告</span>",
    overlayBtnClose: "关闭 / Close",
    statusNormal: "正常",
    statusAbnormal: "脑雾滞后",
    alertQuitConfirm: "确定要退出当前的测验吗？已进行的数据将不会被保存。",
    clinicalNormalDesc: "大脑切换灵活性处于正常水平。未见睡眠片段化导致的显著执行功能脑雾。",
    clinicalAbnormalDesc: "多任务任务切换明显滞后（比率 Ratio >= 3.0）。符合中重度睡眠片段化或慢性缺氧导致的 executive fog 脑雾表现。",
    clinicalAwaiting: "请先完成 Part B 测试以计算综合切换比率。"
  }
};

// --- 2. CLINICAL NORMAL DATASET (NORMS) ---
const NORMS = {
  low_edu: {
    A: [
      { min: 18, max: 24, mean: 22.9, sd: 7.2 },
      { min: 25, max: 34, mean: 24.6, sd: 5.8 },
      { min: 35, max: 44, mean: 28.5, sd: 9.3 },
      { min: 45, max: 54, mean: 31.7, sd: 9.6 },
      { min: 55, max: 59, mean: 35.8, sd: 9.5 },
      { min: 60, max: 64, mean: 37.1, sd: 11.2 },
      { min: 65, max: 69, mean: 41.5, sd: 14.5 },
      { min: 70, max: 74, mean: 44.3, sd: 13.5 },
      { min: 75, max: 79, mean: 51.5, sd: 16.4 },
      { min: 80, max: 84, mean: 58.4, sd: 20.2 },
      { min: 85, max: 99, mean: 63.8, sd: 19.3 }
    ],
    B: [
      { min: 18, max: 24, mean: 48.9, sd: 13.4 },
      { min: 25, max: 34, mean: 50.6, sd: 12.3 },
      { min: 35, max: 44, mean: 58.4, sd: 16.4 },
      { min: 45, max: 54, mean: 63.7, sd: 14.4 },
      { min: 55, max: 59, mean: 73.2, sd: 18.6 },
      { min: 60, max: 64, mean: 83.1, sd: 27.2 },
      { min: 65, max: 69, mean: 100.4, sd: 39.4 },
      { min: 70, max: 74, mean: 109.3, sd: 38.2 },
      { min: 75, max: 79, mean: 130.4, sd: 45.3 },
      { min: 80, max: 84, mean: 152.3, sd: 58.2 },
      { min: 85, max: 99, mean: 184.2, sd: 62.4 }
    ]
  },
  high_edu: {
    A: [
      { min: 18, max: 24, mean: 19.1, sd: 6.2 },
      { min: 25, max: 34, mean: 20.4, sd: 6.3 },
      { min: 35, max: 44, mean: 23.3, sd: 6.2 },
      { min: 45, max: 54, mean: 26.5, sd: 7.4 },
      { min: 55, max: 59, mean: 27.6, sd: 8.7 },
      { min: 60, max: 64, mean: 31.0, sd: 9.7 },
      { min: 65, max: 69, mean: 33.8, sd: 9.8 },
      { min: 70, max: 74, mean: 35.2, sd: 9.3 },
      { min: 75, max: 79, mean: 40.2, sd: 11.4 },
      { min: 80, max: 84, mean: 46.9, sd: 14.1 },
      { min: 85, max: 99, mean: 55.4, sd: 16.4 }
    ],
    B: [
      { min: 18, max: 24, mean: 41.2, sd: 11.2 },
      { min: 25, max: 34, mean: 43.1, sd: 10.4 },
      { min: 35, max: 44, mean: 50.4, sd: 12.3 },
      { min: 45, max: 54, mean: 56.1, sd: 13.4 },
      { min: 55, max: 59, mean: 61.2, sd: 16.3 },
      { min: 60, max: 64, mean: 68.4, sd: 18.4 },
      { min: 65, max: 69, mean: 79.2, sd: 24.3 },
      { min: 70, max: 74, mean: 86.4, sd: 28.3 },
      { min: 75, max: 79, mean: 100.2, stroke: 35.4, sd: 35.4 },
      { min: 80, max: 84, mean: 121.2, sd: 48.2 },
      { min: 85, max: 99, mean: 151.3, sd: 55.3 }
    ]
  }
};

// --- 3. SEQUENCES DEFINITIONS (25 STEPS) ---
const SEQ_A = Array.from({ length: 25 }, (_, i) => (i + 1).toString());
const SEQ_B = ['1', 'A', '2', 'B', '3', 'C', '4', 'D', '5', 'E', '6', 'F', '7', 'G', '8', 'H', '9', 'I', '10', 'J', '11', 'K', '12', 'L', '13'];

// --- 4. STATE SYSTEM & PATIENT CACHE ---
let currentLanguage = 'en';
let currentMode = 'A'; // 'A' or 'B'
let currentStep = 0;
let errors = 0;
let startTime = null;
let timerInterval = null;
let lastPosition = null;
let isInteractive = false;

let clickTimestamps = []; // Tracks elapsed seconds for every correct hit to plot the Timeline SVG

let sessionData = {
  A: null, // { duration, errors, clicks }
  B: null  // { duration, errors, clicks }
};

let patientProfile = {
  age: 45,
  edu: 'high'
};

// --- 5. INITIALIZATION & BOOTSTRAP ---
document.addEventListener('DOMContentLoaded', () => {
  initLanguage();
  initTheme();
  setupEventListeners();
  loadHistoryTable();
  
  // Listen for language updates from other apps in real-time
  window.addEventListener('storage', (e) => {
    if (e.key === 'sleepwell_lang') {
      currentLanguage = e.newValue || 'en';
      updateLanguageUI();
      if (!document.getElementById('screen-instr').classList.contains('hidden')) {
        createDemoIllustration(currentMode === 'A' ? ['1','2','3','4'] : ['1','A','2','B']);
      }
    }
  });
});

// --- 6. LANGUAGES & TRANSLATIONS ENGINE ---
function initLanguage() {
  const savedLang = localStorage.getItem('sleepwell_lang') || localStorage.getItem('tmt_lang') || 'en';
  currentLanguage = savedLang;
  updateLanguageUI();
}

function updateLanguageUI() {
  const d = I18N_DICTS[currentLanguage];
  
  // Set navbar toggle button
  document.getElementById('langToggleBtn').textContent = currentLanguage === 'en' ? '中文' : 'English';
  
  // Header tag
  document.getElementById('nav-tag').textContent = d.navTag;

  // Screen 0: Landing
  document.getElementById('badge-text').textContent = d.badgeText;
  document.getElementById('landing-title').innerHTML = d.landingTitle;
  document.getElementById('landing-desc').textContent = d.landingDesc;
  document.getElementById('info-1-title').textContent = d.info1Title;
  document.getElementById('info-1-desc').textContent = d.info1Desc;
  document.getElementById('info-1-trans').textContent = d.info1Trans;
  document.getElementById('info-2-title').textContent = d.info2Title;
  document.getElementById('info-2-desc').textContent = d.info2Desc;
  document.getElementById('info-2-trans').textContent = d.info2Trans;

  // Profile setup
  document.getElementById('config-title').textContent = d.configTitle;
  document.getElementById('config-subtitle').textContent = d.configSubtitle;
  document.getElementById('label-age').textContent = d.labelAge;
  document.getElementById('label-edu').textContent = d.labelEdu;
  document.getElementById('edu-low-primary').textContent = d.eduLowPrimary;
  document.getElementById('edu-low-sub').textContent = d.eduLowSub;
  document.getElementById('edu-high-primary').textContent = d.eduHighPrimary;
  document.getElementById('edu-high-sub').textContent = d.eduHighSub;
  document.getElementById('btn-next-start').querySelector('span').textContent = d.btnNextStart;

  // Screen 1: Instructions
  if (currentMode === 'A') {
    document.getElementById('instr-title').textContent = d.instrTitleA;
    document.getElementById('instr-badge-part').textContent = "Part A";
    document.getElementById('instr-text').textContent = d.instrTextA;
    document.getElementById('instr-citation-text').textContent = d.instrCitationTextA;
  } else {
    document.getElementById('instr-title').textContent = d.instrTitleB;
    document.getElementById('instr-badge-part').textContent = "Part B";
    document.getElementById('instr-text').textContent = d.instrTextB;
    document.getElementById('instr-citation-text').textContent = d.instrCitationTextB;
  }
  document.getElementById('instr-tip').textContent = d.instrTip;
  document.getElementById('btn-start-ready-text').textContent = d.btnStartReadyText;

  // Screen 2: Test Arena HUD
  document.getElementById('btn-arena-reset').textContent = currentLanguage === 'en' ? 'Reset / 重置' : '重置 / Reset';
  document.getElementById('btn-arena-quit').textContent = currentLanguage === 'en' ? 'Quit / 退出' : '退出 / Quit';
  document.getElementById('test-label').textContent = `Part ${currentMode}`;
  document.getElementById('test-instr-header').textContent = currentMode === 'A' ? d.testInstrA : d.testInstrB;

  // Screen 3: Results
  document.getElementById('report-main-title').textContent = d.reportMainTitle;
  document.getElementById('report-sub-title').textContent = d.reportSubTitle;
  document.getElementById('stat-lbl-ratio').textContent = d.statLblRatio;
  document.getElementById('stat-lbl-speeda').textContent = d.statLblSpeeda;
  document.getElementById('stat-lbl-speedb').textContent = d.statLblSpeedb;
  document.getElementById('res-peer-lbl').textContent = d.resPeerLbl;
  document.getElementById('chart-lbl-title').textContent = d.chartLblTitle;
  document.getElementById('chart-lbl-desc').textContent = d.chartLblDesc;
  document.getElementById('hist-lbl-title').textContent = d.histLblTitle;
  document.getElementById('hist-lbl-clear').textContent = d.histLblClear;
  document.getElementById('th-datetime').textContent = d.thDatetime;
  document.getElementById('th-speeda').textContent = d.thSpeeda;
  document.getElementById('th-speedb').textContent = d.thSpeedb;
  document.getElementById('th-ratio').textContent = d.thRatio;
  document.getElementById('th-status').textContent = d.thStatus;

  document.getElementById('btn-export-photo').textContent = d.btnExportPhoto;
  document.getElementById('btn-restart-assessment').textContent = d.btnRestartAssessment;
  document.getElementById('btn-return-hub').textContent = d.btnReturnHub;

  // Overlay preview
  document.getElementById('overlay-guide-msg').innerHTML = d.overlayGuideMsg;
  document.getElementById('overlay-btn-close').textContent = d.overlayBtnClose;

  // Refresh active result labels if currently showing results
  if (!document.getElementById('screen-results').classList.contains('hidden')) {
    renderFinalReportHTML();
  }
}

function setupEventListeners() {
  // Language button click
  document.getElementById('langToggleBtn').addEventListener('click', () => {
    currentLanguage = currentLanguage === 'en' ? 'zh' : 'en';
    localStorage.setItem('sleepwell_lang', currentLanguage);
    localStorage.setItem('tmt_lang', currentLanguage); // fallback legacy
    updateLanguageUI();
    
    // Regenerate instruction animation loop matching active mode
    if (!document.getElementById('screen-instr').classList.contains('hidden')) {
      createDemoIllustration(currentMode === 'A' ? ['1','2','3','4'] : ['1','A','2','B']);
    }
  });

  // Education Selector controls
  const lowBtn = document.getElementById('edu-low-btn');
  const highBtn = document.getElementById('edu-high-btn');
  
  lowBtn.addEventListener('click', () => {
    lowBtn.classList.add('active');
    highBtn.classList.remove('active');
    patientProfile.edu = 'low';
  });

  highBtn.addEventListener('click', () => {
    highBtn.classList.add('active');
    lowBtn.classList.remove('active');
    patientProfile.edu = 'high';
  });

  // Instruction start click
  document.getElementById('btn-start-test').addEventListener('click', () => {
    document.getElementById('screen-instr').classList.add('hidden');
    document.getElementById('screen-test').classList.remove('hidden');
    initTest(currentMode);
  });
}

// --- 7. DEEP CLINICAL DESIGN SYSTEMS (THEMES) ---
function initTheme() {
  // Synchronized theme setting matching circadian clinical hub or PVT-B
  const savedTheme = localStorage.getItem('circaHub_theme') || localStorage.getItem('circaAlign_theme') || localStorage.getItem('pvt_theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  
  const sunIcon = document.querySelector('.sun-icon');
  const moonIcon = document.querySelector('.moon-icon');
  
  if (savedTheme === 'light') {
    sunIcon.classList.remove('hidden');
    moonIcon.classList.add('hidden');
  } else {
    sunIcon.classList.add('hidden');
    moonIcon.classList.remove('hidden');
  }

  // Bind toggle click
  document.getElementById('themeToggleBtn').addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('pvt_theme', newTheme);
    localStorage.setItem('circaHub_theme', newTheme);
    localStorage.setItem('circaAlign_theme', newTheme);
    
    if (newTheme === 'light') {
      sunIcon.classList.remove('hidden');
      moonIcon.classList.add('hidden');
    } else {
      sunIcon.classList.add('hidden');
      moonIcon.classList.remove('hidden');
    }
  });
}

// --- 8. STEPPED USER NAVIGATION ---
function goToInstructions() {
  const ageInput = document.getElementById('input-age');
  let age = parseInt(ageInput.value);
  if (isNaN(age) || age < 18 || age > 99) {
    age = 45; // Clinical fallbacks
    ageInput.value = 45;
  }
  patientProfile.age = age;

  document.getElementById('screen-intro').classList.add('hidden');
  document.getElementById('screen-instr').classList.remove('hidden');
  
  showInstructions(currentMode);
}

function showInstructions(mode) {
  currentMode = mode;
  updateLanguageUI(); // Sync header & description translation
  
  const demoSvg = document.getElementById('demo-svg-unified');
  demoSvg.innerHTML = '';
  
  if (mode === 'A') {
    createDemoIllustration(['1', '2', '3', '4']);
  } else {
    createDemoIllustration(['1', 'A', '2', 'B']);
  }
}

// Draw instruction SVG with a beautiful, synchronized line animation
function createDemoIllustration(seq) {
  const svg = document.getElementById('demo-svg-unified');
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const strokeColor = theme === 'dark' ? 'rgba(0, 225, 217, 0.8)' : 'rgba(59, 130, 246, 0.8)';
  const nodeTextCol = theme === 'dark' ? '#f3f4f6' : '#0f172a';
  const nodeBgCol = theme === 'dark' ? '#111a2e' : '#ffffff';
  const borderCol = theme === 'dark' ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

  // Viewport Coordinates
  const coords = [
    { x: 18, y: 35 },
    { x: 42, y: 72 },
    { x: 58, y: 28 },
    { x: 82, y: 65 }
  ];

  // 1. Draw paths
  coords.forEach((c, i) => {
    if (i > 0) {
      const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
      line.setAttribute("x1", coords[i-1].x + "%");
      line.setAttribute("y1", coords[i-1].y + "%");
      line.setAttribute("x2", c.x + "%");
      line.setAttribute("y2", c.y + "%");
      line.setAttribute("class", "demo-line");
      line.style.animationDelay = (i-1) * 0.7 + 's';
      line.style.stroke = strokeColor;
      svg.appendChild(line);
    }
  });

  // 2. Draw nodes
  coords.forEach((c, i) => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    
    const circ = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    circ.setAttribute("cx", c.x + "%");
    circ.setAttribute("cy", c.y + "%");
    circ.setAttribute("r", "16");
    circ.setAttribute("fill", nodeBgCol);
    circ.setAttribute("stroke", borderCol);
    circ.setAttribute("stroke-width", "2");
    circ.setAttribute("style", "filter: drop-shadow(0 2px 4px rgba(0,0,0,0.15));");
    
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", c.x + "%");
    txt.setAttribute("y", c.y + "%");
    txt.setAttribute("dy", "5.5"); // dominant-baseline vertical alignment hack
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("fill", nodeTextCol);
    txt.setAttribute("font-size", "14");
    txt.setAttribute("font-family", "Outfit");
    txt.setAttribute("font-weight", "800");
    txt.textContent = seq[i];
    
    g.appendChild(circ);
    g.appendChild(txt);
    svg.appendChild(g);
  });
}

// --- 9. SYNTHESIZED CLINICAL HAPTICS (WEB AUDIO API) ---
const WebAudioSynthesizer = {
  ctx: null,
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  },

  playTone(freq, type, duration, volume) {
    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      // Exponential volume decay to avoid speaker pops
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {
      console.warn("Web Audio Context blocked or unsupported:", e);
    }
  },

  playSuccess() {
    this.playTone(720, 'sine', 0.1, 0.15);
  },

  playError() {
    this.playTone(130, 'square', 0.28, 0.22);
  },

  playComplete() {
    // Crisp minor chord finish
    const time = 0.12;
    setTimeout(() => this.playTone(523.25, 'sine', 0.35, 0.15), 0);
    setTimeout(() => this.playTone(659.25, 'sine', 0.35, 0.15), 120);
    setTimeout(() => this.playTone(783.99, 'sine', 0.5, 0.2), 240);
  }
};

// --- 10. CELL-GRID PHYSICS NODE SPAWNER ---
/**
 * Viewport Spacing Grid Node Generator
 * Divides the available space into a responsive 5x5 Grid (25 Cells total).
 * Places exactly one node per cell offset randomly by an safe threshold.
 * This guarantees:
 *  - 100% overlap prevention
 *  - High visual balance across all resolutions (mobile/tablet/desktop)
 *  - Fluid gameplay without clicking blocks underneath lines
 */
function distributeTmtNodes(sequence) {
  const container = document.getElementById('game-container');
  const rect = container.getBoundingClientRect();
  
  const nodesLayer = document.getElementById('nodes-layer');
  nodesLayer.innerHTML = '';
  
  const nodeRadius = window.innerWidth <= 480 ? 19 : 22; // 38px/44px diameter
  const edgePadding = 25; // Keep nodes safely away from header and edges
  
  const width = rect.width - edgePadding * 2;
  const height = rect.height - edgePadding * 2;
  
  const cellW = width / 5;
  const cellH = height / 5;
  
  // Generate 25 discrete grid cells
  let cellsList = [];
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      cellsList.push({ col: c, row: r });
    }
  }
  
  // Fisher-Yates Shuffle grid cells to assign numbers randomly
  for (let i = cellsList.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cellsList[i], cellsList[j]] = [cellsList[j], cellsList[i]];
  }
  
  // Place nodes on screen
  for (let i = 0; i < 25; i++) {
    const cell = cellsList[i];
    
    // Cell bound center coordinates
    const cellCenterX = edgePadding + (cell.col * cellW) + (cellW / 2);
    const cellCenterY = edgePadding + (cell.row * cellH) + (cellH / 2);
    
    // Offset slightly from center within cell boundaries (max 22% offset)
    const maxOffsetW = (cellW / 2) - nodeRadius - 10;
    const maxOffsetH = (cellH / 2) - nodeRadius - 10;
    
    const offsetX = (Math.random() - 0.5) * 2 * Math.max(0, maxOffsetW);
    const offsetY = (Math.random() - 0.5) * 2 * Math.max(0, maxOffsetH);
    
    const finalX = cellCenterX + offsetX;
    const finalY = cellCenterY + offsetY;
    
    // Create HTML element
    const el = document.createElement('div');
    el.className = 'node';
    el.textContent = sequence[i];
    el.style.left = `${finalX - nodeRadius}px`;
    el.style.top = `${finalY - nodeRadius}px`;
    
    // Store coordinate properties on DOM for visual path links
    el.dataset.x = finalX;
    el.dataset.y = finalY;
    el.dataset.index = i;
    
    // Touch/Mouse interaction
    el.addEventListener('pointerdown', (e) => {
      e.preventDefault();
      if (isInteractive) {
        handleNodeClick(i, finalX, finalY, el);
      }
    });
    
    nodesLayer.appendChild(el);
  }
}

// --- 11. ACTIVE TEST ARENA LOGIC ---
function initTest(mode) {
  if (timerInterval) clearInterval(timerInterval);
  
  currentStep = 0;
  errors = 0;
  lastPosition = null;
  isInteractive = false;
  clickTimestamps = [];
  
  document.getElementById('timer').textContent = "0.00s";
  document.getElementById('svg-canvas').innerHTML = '';
  
  document.getElementById('test-label').textContent = `Part ${mode}`;
  const d = I18N_DICTS[currentLanguage];
  document.getElementById('test-instr-header').textContent = mode === 'A' ? d.testInstrA : d.testInstrB;
  
  // Re-spawns distributed nodes
  distributeTmtNodes(mode === 'A' ? SEQ_A : SEQ_B);
  
  runCountdown();
}

function runCountdown() {
  const overlay = document.getElementById('countdown-overlay');
  const text = document.getElementById('countdown-text');
  
  overlay.style.display = 'flex';
  let counter = 3;
  text.textContent = counter;
  
  // Initialize synthesizer inside user interaction trigger
  WebAudioSynthesizer.init();
  WebAudioSynthesizer.playTone(392, 'sine', 0.1, 0.08); // high alert count

  const interval = setInterval(() => {
    counter--;
    if (counter > 0) {
      text.textContent = counter;
      WebAudioSynthesizer.playTone(392, 'sine', 0.1, 0.08);
    } else if (counter === 0) {
      text.textContent = currentLanguage === 'en' ? "GO!" : "走！";
      WebAudioSynthesizer.playTone(783.99, 'sine', 0.25, 0.12); // start chime
    } else {
      clearInterval(interval);
      overlay.style.display = 'none';
      isInteractive = true;
      startStopwatch();
    }
  }, 1000);
}

function startStopwatch() {
  startTime = Date.now();
  timerInterval = setInterval(() => {
    const elapsed = (Date.now() - startTime) / 1000;
    document.getElementById('timer').textContent = elapsed.toFixed(2) + "s";
  }, 50);
}

function handleNodeClick(index, x, y, el) {
  if (index === currentStep) {
    // Correct Hit
    WebAudioSynthesizer.playSuccess();
    el.classList.add('node-correct');
    
    const clickTime = (Date.now() - startTime) / 1000;
    clickTimestamps.push(clickTime);

    // Draw connecting path line
    if (lastPosition) {
      drawVectorLink(lastPosition.x, lastPosition.y, x, y);
    }
    
    lastPosition = { x, y };
    currentStep++;
    
    // Check finish conditions
    if (currentStep === 25) {
      finishMode();
    }
  } else if (index > currentStep) {
    // Incorrect Hit
    errors++;
    WebAudioSynthesizer.playError();
    el.classList.add('node-error');
    
    // Vibrate/shake haptic class resets
    setTimeout(() => {
      el.classList.remove('node-error');
    }, 450);
  }
}

function drawVectorLink(x1, y1, x2, y2) {
  const canvas = document.getElementById('svg-canvas');
  const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
  
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const strokeColor = theme === 'dark' ? 'var(--brand-primary)' : 'var(--brand-secondary)';
  
  line.setAttribute("x1", x1);
  line.setAttribute("y1", y1);
  line.setAttribute("x2", x2);
  line.setAttribute("y2", y2);
  line.setAttribute("stroke", strokeColor);
  line.setAttribute("stroke-width", "3");
  
  canvas.appendChild(line);
}

function quitTest() {
  const d = I18N_DICTS[currentLanguage];
  if (confirm(d.alertQuitConfirm)) {
    clearInterval(timerInterval);
    isInteractive = false;
    document.getElementById('screen-test').classList.add('hidden');
    document.getElementById('screen-intro').classList.remove('hidden');
  }
}

function finishMode() {
  clearInterval(timerInterval);
  isInteractive = false;
  WebAudioSynthesizer.playComplete();
  
  const duration = (Date.now() - startTime) / 1000;
  
  sessionData[currentMode] = {
    duration: duration,
    errors: errors,
    clicks: [...clickTimestamps]
  };

  // Stepped progression check
  setTimeout(() => {
    document.getElementById('screen-test').classList.add('hidden');
    
    if (currentMode === 'A') {
      // Transition to Part B
      currentMode = 'B';
      document.getElementById('screen-instr').classList.remove('hidden');
      showInstructions('B');
    } else {
      // Finalize full TMT assessment
      showFinalReport();
    }
  }, 1000);
}

// --- 12. SCIENTIFIC CALCULATIONS & NORMS (CDF ENGINE) ---
/**
 * Z-score Percentile Calculator
 * Calculates age and education matches, computes statistical z score:
 *  z = (mean - time) / standard_deviation
 * Passes through standard normal cumulative distribution function (CDF) to retrieve 
 * exact cohort percentiles.
 */
function calculateCohortPercentile(mode, timeSec) {
  const age = patientProfile.age;
  const edu = patientProfile.edu;
  
  const dataset = NORMS[edu === 'high' ? 'high_edu' : 'low_edu'][mode];
  
  // Find correct age bracket
  const bracket = dataset.find(b => age >= b.min && age <= b.max) || dataset[dataset.length - 1];
  
  const mean = bracket.mean;
  const sd = bracket.sd;
  
  // Calculate Z-Score
  const z = (mean - timeSec) / sd;
  
  // Cumulative standard normal distribution approximation (Abramowitz & Stegun formula)
  const t = 1 / (1 + 0.2316419 * Math.abs(z));
  const d = 0.3989423 * Math.exp(-z * z / 2);
  let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  
  if (z > 0) {
    p = 1 - p;
  }
  
  return Math.round(p * 100);
}

// --- 13. DATA PRESENTATION & TIMELINE DRAWING ---
function showFinalReport() {
  document.getElementById('screen-results').classList.remove('hidden');
  
  // 1. Calculate & Cache Stats
  const dataA = sessionData.A;
  const dataB = sessionData.B;
  
  const ratio = dataB.duration / dataA.duration;
  
  const pctA = calculateCohortPercentile('A', dataA.duration);
  const pctB = calculateCohortPercentile('B', dataB.duration);
  
  const isNormal = ratio < 3.0; // Shifting threshold standard
  
  const timestampString = new Date().toISOString().replace('T', ' ').substring(0, 16);
  
  // 2. Save Session to localStorage
  const currentRecord = {
    date: new Date().toLocaleDateString(currentLanguage === 'en' ? 'en-US' : 'zh-CN', { month: 'short', day: 'numeric', year: 'numeric' }),
    dateTime: timestampString,
    age: patientProfile.age,
    edu: patientProfile.edu,
    durationA: dataA.duration,
    durationB: dataB.duration,
    errorsA: dataA.errors,
    errorsB: dataB.errors,
    ratio: ratio,
    percentileA: pctA,
    percentileB: pctB,
    clinicalStatus: isNormal ? 'NORMAL' : 'ABNORMAL',
    score: `${pctB}%`
  };

  // Push to local log database
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem('tmt_history') || '[]');
  } catch(e) {
    history = [];
  }
  history.unshift(currentRecord);
  localStorage.setItem('tmt_history', JSON.stringify(history));
  
  // Propagate to clinical hub for unified patient profile mapping
  localStorage.setItem('tmt_latest', JSON.stringify(currentRecord));

  // Render HTML nodes
  renderFinalReportHTML(currentRecord);
  loadHistoryTable();
}

function renderFinalReportHTML(record) {
  if (!record) {
    try {
      const history = JSON.parse(localStorage.getItem('tmt_history') || '[]');
      if (history.length > 0) {
        record = history[0];
      } else {
        return;
      }
    } catch(e) {
      return;
    }
  }

  const d = I18N_DICTS[currentLanguage];
  const isN = record.clinicalStatus === 'NORMAL';
  
  // Timestamp
  document.getElementById('res-timestamp').textContent = record.dateTime;
  
  // Dynamic status icon
  const resIcon = document.getElementById('res-icon');
  resIcon.className = `results-status-icon ${isN ? 'status-normal' : 'status-abnormal'}`;
  resIcon.textContent = isN ? "✓" : "!";
  
  // Shifting Ratio
  document.getElementById('res-ratio-num').textContent = record.ratio.toFixed(2);
  const ratioBadge = document.getElementById('res-ratio-badge');
  ratioBadge.className = `ratio-badge ${isN ? 'normal' : 'abnormal'}`;
  ratioBadge.textContent = isN ? d.statusNormal : d.statusAbnormal;
  
  const ratioCard = document.getElementById('ratio-card');
  ratioCard.className = `stats-card col-span-2 ${isN ? 'status-normal' : 'status-abnormal'}`;

  // Speeds & errors
  document.getElementById('res-speed-a').textContent = record.durationA.toFixed(2) + "s";
  document.getElementById('res-errors-a').textContent = `${record.errorsA} ${d.resErrors}`;
  const speedACard = document.getElementById('speed-a-card');
  speedACard.className = `stats-card ${isN ? 'status-normal' : 'status-abnormal'}`;

  document.getElementById('res-speed-b').textContent = record.durationB.toFixed(2) + "s";
  document.getElementById('res-errors-b').textContent = `${record.errorsB} ${d.resErrors}`;
  const speedBCard = document.getElementById('speed-b-card');
  speedBCard.className = `stats-card ${isN ? 'status-normal' : 'status-abnormal'}`;

  // Peer Percentiles
  const pB = record.percentileB;
  document.getElementById('res-percentile-num').textContent = pB + "th";
  document.getElementById('res-percentile-num').className = `percentile-score ${isN ? 'normal' : 'abnormal'}`;
  
  const pctFill = document.getElementById('res-percentile-bar');
  pctFill.className = `percentile-fill-bar ${isN ? 'normal' : 'abnormal'}`;
  pctFill.style.width = pB + "%";

  document.getElementById('percentile-explanation').innerHTML = d.percentileExplanation.replace('{pct}', pB);
  document.getElementById('percentile-note').innerHTML = `
    <strong>${currentLanguage === 'en' ? 'Clinical Interpretation & Logic:' : '临床医学解释:'}</strong> ${isN ? d.clinicalNormalDesc : d.clinicalAbnormalDesc}<br><br>
    ${d.percentileNote}
  `;

  // Draw Latency timeline Wave Chart
  drawLatencyTimeline();
}

// Draw a beautiful vector timeline detailing click-speed fluctuations
function drawLatencyTimeline() {
  const dataA = sessionData.A;
  const dataB = sessionData.B;
  
  // If user refreshed result page, grab from latest cache
  if (!dataA || !dataB) return;

  const svg = document.getElementById('timeline-chart');
  svg.innerHTML = '';
  
  const width = svg.clientWidth || 440;
  const height = 100;
  
  const paddingL = 30;
  const paddingR = 15;
  const paddingT = 15;
  const paddingB = 15;
  
  const graphW = width - paddingL - paddingR;
  const graphH = height - paddingT - paddingB;

  // Extract individual latencies (time elapsed between correct clicks)
  let latenciesA = [dataA.clicks[0]];
  for (let i = 1; i < 25; i++) {
    latenciesA.push(dataA.clicks[i] - dataA.clicks[i-1]);
  }

  let latenciesB = [dataB.clicks[0]];
  for (let i = 1; i < 25; i++) {
    latenciesB.push(dataB.clicks[i] - dataB.clicks[i-1]);
  }

  // Find max latency for scaling y axis
  const maxLat = Math.max(...latenciesA, ...latenciesB, 1.5);

  // Helper coordinate converters
  const getX = (idx) => paddingL + (idx / 24) * graphW;
  const getY = (val) => paddingT + graphH - (val / maxLat) * graphH;

  // Draw dynamic grid lines
  const theme = document.documentElement.getAttribute('data-theme') || 'dark';
  const gridColor = theme === 'dark' ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  const fontColor = theme === 'dark' ? '#6b7280' : '#94a3b8';
  
  for (let i = 0; i <= 3; i++) {
    const v = (i / 3) * maxLat;
    const y = getY(v);
    
    // Horizontal grid lines
    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", paddingL);
    line.setAttribute("y1", y);
    line.setAttribute("x2", width - paddingR);
    line.setAttribute("y2", y);
    line.setAttribute("stroke", gridColor);
    line.setAttribute("stroke-width", "1");
    svg.appendChild(line);

    // Left Y Axis labels (seconds)
    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", paddingL - 8);
    txt.setAttribute("y", y + 4);
    txt.setAttribute("text-anchor", "end");
    txt.setAttribute("fill", fontColor);
    txt.setAttribute("font-size", "7.5");
    txt.setAttribute("font-weight", "600");
    txt.textContent = v.toFixed(1) + "s";
    svg.appendChild(txt);
  }

  // Draw Part A Wave Line (Grey/Blue)
  let pathStrA = `M ${getX(0)} ${getY(latenciesA[0])}`;
  for (let i = 1; i < 25; i++) {
    pathStrA += ` L ${getX(i)} ${getY(latenciesA[i])}`;
  }
  const pathA = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathA.setAttribute("d", pathStrA);
  pathA.setAttribute("fill", "none");
  pathA.setAttribute("stroke", theme === 'dark' ? 'rgba(255,255,255,0.25)' : 'rgba(0,0,0,0.15)');
  pathA.setAttribute("stroke-width", "1.5");
  svg.appendChild(pathA);

  // Draw Part B Wave Line (Neon Accent)
  let pathStrB = `M ${getX(0)} ${getY(latenciesB[0])}`;
  for (let i = 1; i < 25; i++) {
    pathStrB += ` L ${getX(i)} ${getY(latenciesB[i])}`;
  }
  const pathB = document.createElementNS("http://www.w3.org/2000/svg", "path");
  pathB.setAttribute("d", pathStrB);
  pathB.setAttribute("fill", "none");
  pathB.setAttribute("stroke", theme === 'dark' ? 'var(--brand-primary)' : 'var(--brand-secondary)');
  pathB.setAttribute("stroke-width", "2.5");
  pathB.setAttribute("style", "filter: drop-shadow(0 2px 4px rgba(0, 225, 217, 0.15));");
  svg.appendChild(pathB);

  // Render dots for spikes in Part B
  for (let i = 0; i < 25; i++) {
    const lat = latenciesB[i];
    if (lat > 2.0) { // Highlight severe processing spikes
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", getX(i));
      circle.setAttribute("cy", getY(lat));
      circle.setAttribute("r", "3");
      circle.setAttribute("fill", "var(--danger)");
      svg.appendChild(circle);
    }
  }
}

// --- 14. PATIENT LOG DATABASE (LOCAL STORAGE) ---
function loadHistoryTable() {
  let history = [];
  try {
    history = JSON.parse(localStorage.getItem('tmt_history') || '[]');
  } catch(e) {
    history = [];
  }

  const tbody = document.getElementById('historyTableBody');
  tbody.innerHTML = '';
  
  if (history.length === 0) {
    const tr = document.createElement('tr');
    tr.innerHTML = `<td colspan="5" style="text-align: center; color: var(--text-muted); padding: 1.5rem 0;">${currentLanguage === 'en' ? 'No patient records found.' : '暂无临床测评数据记录。'}</td>`;
    tbody.appendChild(tr);
    return;
  }

  // Display top 5 history records
  const limit = Math.min(history.length, 5);
  for (let i = 0; i < limit; i++) {
    const h = history[i];
    const tr = document.createElement('tr');
    
    const isN = h.clinicalStatus === 'NORMAL';
    const statusText = isN ? (currentLanguage === 'en' ? 'NORMAL' : '正常') : (currentLanguage === 'en' ? 'ABNORMAL' : '脑雾');
    
    tr.innerHTML = `
      <td style="font-weight: 500;">${h.dateTime}</td>
      <td>${h.durationA.toFixed(1)}s <span style="font-size: 0.6rem; opacity: 0.5;">(${h.errorsA}e)</span></td>
      <td>${h.durationB.toFixed(1)}s <span style="font-size: 0.6rem; opacity: 0.5;">(${h.errorsB}e)</span></td>
      <td style="font-weight: 700; color: ${isN ? 'var(--success)' : 'var(--danger)'}">${h.ratio.toFixed(2)}</td>
      <td><span class="history-badge-status ${isN ? 'normal' : 'abnormal'}">${statusText}</span></td>
    `;
    tbody.appendChild(tr);
  }
}

function clearHistory() {
  const msg = currentLanguage === 'en' 
    ? "Are you sure you want to delete all historical clinical test records?" 
    : "您确定要彻底删除所有的历史认知测评数据吗？此操作不可逆。";
  if (confirm(msg)) {
    localStorage.removeItem('tmt_history');
    localStorage.removeItem('tmt_latest');
    loadHistoryTable();
  }
}

// --- 15. CLINICAL PHOTO EXPORT ENGINE ---
function exportReportPhoto() {
  const exportBtn = document.getElementById('btn-export-photo');
  const d = I18N_DICTS[currentLanguage];
  exportBtn.textContent = currentLanguage === 'en' ? "Capturing..." : "生成报告中...";

  // Temporarily force dark or light styled background onto capture-area for clean exporting
  const captureArea = document.getElementById('capture-area');
  
  html2canvas(captureArea, {
    backgroundColor: getComputedStyle(document.documentElement).getPropertyValue('--bg-secondary').trim(),
    scale: 3, // Multiplies canvas density for extreme clean resolution
    useCORS: true
  }).then(canvas => {
    const previewImg = document.getElementById('preview-img');
    previewImg.src = canvas.toDataURL("image/png");
    
    // Pop overlay
    document.getElementById('save-overlay').style.display = 'flex';
    exportBtn.textContent = d.btnExportPhoto;
  }).catch(err => {
    console.error("html2canvas export failed: ", err);
    exportBtn.textContent = d.btnExportPhoto;
  });
}

function closeSaveOverlay() {
  document.getElementById('save-overlay').style.display = 'none';
}
